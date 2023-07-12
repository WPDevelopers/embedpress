<?php

namespace EmbedPress\Providers;

use EmbedPress\Includes\Classes\Helper;
use Embera\Provider\ProviderAdapter;
use Embera\Provider\ProviderInterface;
use Embera\Url;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Entity responsible to support InstagramFeed embeds.
 *
 * @package     EmbedPress
 * @subpackage  EmbedPress/Providers
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2020 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       1.0.0
 */
class InstagramFeed extends ProviderAdapter implements ProviderInterface
{
    /** inline {@inheritdoc} */
    protected $shouldSendRequest = false;

    protected static $hosts = ["instagram.com"];
    /**
     * Method that verifies if the embed URL belongs to InstagramFeed.
     *
     * @param Url $url
     * @return  boolean
     * @since   1.0.0
     *
     */
    public function validateUrl(Url $url)
    {
        return  (bool) preg_match(
            '/^(?:https?:\/\/)?(?:www\.)?instagram\.com\/[a-zA-Z0-9_\.]+\/?$/',
            (string) $url
        );
    }

    public function validateInstagramFeed($url)
    {
        return  (bool) preg_match(
            '/^(?:https?:\/\/)?(?:www\.)?instagram\.com\/[a-zA-Z0-9_\.]+\/?$/',
            (string) $url
        );
    }

    // get instagram user info
    public function getInstagramUserInfo($accessToken)
    {
        // Set the transient key
        $transientKey = 'instagram_user_info_' . md5("https://graph.instagram.com/me?fields=id,username,account_type,media_count,followers_count,biography,website&access_token=$accessToken");

        // Attempt to retrieve the user info from the transient cache

        $cachedUserInfo = get_transient($transientKey);

        // If the user info is found in the cache, return it
        if ($cachedUserInfo !== false) {
            return $cachedUserInfo;
        }

        // Make a GET request to Instagram's API to retrieve user information
        $userInfoResponse = wp_remote_get("https://graph.instagram.com/me?fields=id,username,account_type,media_count,followers_count,biography,website&access_token=$accessToken");

        // Check if the user information request was successful
        if (is_wp_error($userInfoResponse)) {
            echo 'Error: Unable to retrieve Instagram user information.';
        } else {
            $userInfoBody = wp_remote_retrieve_body($userInfoResponse);
            $userInfo = json_decode($userInfoBody, true);

            // Save the user info in the transient cache for 1 hour (adjust the time as needed)
            set_transient($transientKey, $userInfo, 1 * HOUR_IN_SECONDS);

            return $userInfo;
        }
    }


    // Get Instagram posts, videos, reels
    public function getInstagramPosts($accessToken)
    {
        // Set the transient key
        $transientKey = 'instagram_posts_' . md5("https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,children{media_url},permalink,thumbnail_url&access_token=$accessToken");

        // Attempt to retrieve the posts from the transient cache
        $cachedPosts = get_transient($transientKey);

        // If the posts are found in the cache, return them
        if ($cachedPosts !== false) {
            return $cachedPosts;
        }

        // Make a GET request to Instagram's API to retrieve posts
        $postsResponse = wp_remote_get("https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,children{media_url},permalink,thumbnail_url&access_token=$accessToken");

        // Check if the posts request was successful
        if (is_wp_error($postsResponse)) {
            echo 'Error: Unable to retrieve Instagram posts.';
        } else {
            $postsBody = wp_remote_retrieve_body($postsResponse);
            $posts = json_decode($postsBody, true);

            // Save the posts in the transient cache for 1 hour (adjust the time as needed)
            set_transient($transientKey, $posts['data'], 1 * HOUR_IN_SECONDS);

            return $posts['data'];
        }
    }

    function getInstagramMediaDetails($mediaId, $accessToken)
    {
        $details = array(
            'likes' => 0,
            'comments' => 0
        );

        // Get comments for the media item
        $commentsResponse = wp_remote_get("https://graph.instagram.com/{$mediaId}/comments?access_token={$accessToken}");
        if (is_array($commentsResponse) && !is_wp_error($commentsResponse)) {
            $commentsBody = wp_remote_retrieve_body($commentsResponse);
            $commentsData = json_decode($commentsBody);
            $details['comments'] = count($commentsData->data);
        }

        // Get likes for the media item
        $likesResponse = wp_remote_get("https://graph.instagram.com/{$mediaId}/likes?access_token={$accessToken}");
        if (is_array($likesResponse) && !is_wp_error($likesResponse)) {
            $likesBody = wp_remote_retrieve_body($likesResponse);
            $likesData = json_decode($likesBody);
            $details['likes'] = count($likesData->data);
        }

        return $details;
    }


    public function getInstaFeedItem($post)
    {
        ob_start(); ?>
        <div class="insta-gallery-item cg-carousel__slide js-carousel__slide" data-insta-postid="<?php echo esc_attr( $post['id'] )?>">
            <?php
                    if ($post['media_type'] == 'VIDEO') {
                        echo '<video class="insta-gallery-image" src="' . esc_url($post['media_url']) . '"></video>';
                    } else {
                        echo ' <img class="insta-gallery-image" src="' . $post['media_url'] . '" alt="' . esc_attr($post['caption']) . '">';
                    }
                    ?>

            <div class="insta-gallery-item-type">
                <div class="insta-gallery-item-type-icon">
                    <?php
                            if ($post['media_type'] == 'VIDEO') {
                                echo Helper::get_insta_video_icon();
                            } else if ($post['media_type'] == 'CAROUSEL_ALBUM') {
                                echo Helper::get_insta_image_carousel_icon();
                            } else {
                                echo Helper::get_insta_image_icon();
                            }
                            ?>
                </div>
            </div>
            <div class="insta-gallery-item-info">
                <ul>
                    <!-- <li class="insta-gallery-item-likes">
                        <svg version="1.1" id="Uploaded to svgrepo.com" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 0.8 0.8" xml:space="preserve">
                            <style>
                                .st0 {
                                    fill: #fff
                                }
                            </style>
                            <path d="M.225.25C.225.264.214.275.2.275S.175.264.175.25.186.225.2.225.225.236.225.25zM.75.3C.75.453.589.582.485.65a1.06 1.06 0 0 1-.073.044.025.025 0 0 1-.024 0A1.049 1.049 0 0 1 .315.65C.211.582.05.453.05.3a.2.2 0 0 1 .2-.2.199.199 0 0 1 .15.068A.199.199 0 0 1 .55.1a.2.2 0 0 1 .2.2zM.25.25a.05.05 0 1 0-.1 0 .05.05 0 0 0 .1 0z" style="fill:#fff" />
                        </svg> 120
                    </li>
                    <li class="insta-gallery-item-comments">
                        <svg fill="#fff" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 2.5 2.5" xml:space="preserve">
                            <path d="M2.374.446a.063.063 0 0 0-.061-.057H.991a.063.063 0 0 0-.063.057H.927v.328h.559c.029 0 .053.022.056.051h.001v.731h.275l.162.162a.063.063 0 0 0 .116-.035v-.127h.217a.063.063 0 0 0 .06-.051h.002V.446h-.001z" />
                            <path d="M1.361.899H.18A.056.056 0 0 0 .125.95v.946h.001a.057.057 0 0 0 .054.045h.194v.113a.057.057 0 0 0 .104.032l.145-.145h.738c.027 0 .05-.02.056-.045h.001V.95h-.001a.056.056 0 0 0-.056-.051z" />
                        </svg>34
                    </li> -->
                    <li class="insta-gallery-item-permalink">
                        <!-- <a href="<?php echo esc_url($post['permalink']); ?>"> -->
                        <svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" xml:space="preserve" width="20" height="20">
                            <style>
                                .st0 {
                                    fill: none;
                                    stroke: #fff;
                                    stroke-width: 2;
                                    stroke-linecap: round;
                                    stroke-linejoin: round;
                                    stroke-miterlimit: 10
                                }
                            </style>
                            <path class="st0" d="M14.375 19.375h-8.75c-2.75 0-5-2.25-5-5v-8.75c0-2.75 2.25-5 5-5h8.75c2.75 0 5 2.25 5 5v8.75c0 2.75-2.25 5-5 5z" />
                            <path class="st0" d="M14.375 10A4.375 4.375 0 0 1 10 14.375 4.375 4.375 0 0 1 5.625 10a4.375 4.375 0 0 1 8.75 0zm1.25-5.625A.625.625 0 0 1 15 5a.625.625 0 0 1-.625-.625.625.625 0 0 1 1.25 0z" />
                        </svg>
                        <!-- </a> -->
                    </li>
                </ul>
            </div>
        </div>
        <!-- <div class="pop-insta-feed-item-details">
            <blockquote class="instagram-media" data-instgrm-permalink="<?php echo esc_url($post['permalink']); ?>" ></blockquote>
        </div> -->
    <?php $feed_item = ob_get_clean(); return $feed_item;
    }

    public function getInstagramFeedTemplate($accessToken)
    {
        $insta_user_info = $this->getInstagramUserInfo($accessToken);
        $insta_posts = $this->getInstagramPosts($accessToken);

        if (is_array($insta_posts) and !empty($insta_posts)) {
            ob_start(); ?>
            <div class="embedpress-insta-container">
                <div class="insta-gallery cg-carousel__track js-carousel__track">
                    <?php
                        foreach ($insta_posts as $post) {
                            print_r($this->getInstaFeedItem($post));
                        }
                        ?>
                </div>
                <div class="cg-carousel__btns hidden">
                    <button class="cg-carousel__btn" id="js-carousel__prev-1"><svg width="20" height="30" viewBox="-5 0 23 23" xmlns="http://www.w3.org/2000/svg"><path d="M11.24.29.361 10.742l-.06.054a.97.97 0 0 0-.301.642v.124a.97.97 0 0 0 .3.642l.054.044L11.239 22.71a1.061 1.061 0 0 0 1.459 0 .964.964 0 0 0 0-1.402l-10.15-9.746 10.15-9.87a.964.964 0 0 0 0-1.402 1.061 1.061 0 0 0-1.459 0Z" fill="#fff"/></svg></button>

                    <button class="cg-carousel__btn" id="js-carousel__next-1"><svg width="20" height="30" viewBox="-5 0 23 23" xmlns="http://www.w3.org/2000/svg"><path d="m1.76.29 10.879 10.452.06.054a.97.97 0 0 1 .301.642v.124a.97.97 0 0 1-.3.642l-.054.044L1.761 22.71a1.061 1.061 0 0 1-1.459 0 .964.964 0 0 1 0-1.402l10.15-9.746-10.15-9.87a.964.964 0 0 1 0-1.402 1.061 1.061 0 0 1 1.459 0Z" fill="#fff"/></svg></button>
                </div>
            </div>

            <!-- Popup div -->
            <div id="popup" class="popup"></div>

            <script>
                // Preloaded data for each post
                const postData = <?php echo json_encode($insta_posts); ?>;

                // Add click event listener to the post elements
                const posts = document.querySelectorAll('.insta-gallery-item');
                posts.forEach(post => {
                    post.addEventListener('click', function () {
                        const postId = this.dataset.instaPostid;
                        showPopup(postId);
                    });
                });

                function showPopup(postId) {
                    // Retrieve data for the clicked post
                    const post = postData.find(item => item.id == postId);
                    // Get the popup element
                    const popup = document.getElementById("popup");
                    popup.innerHTML = `
                        <h2>${post.caption}</h2>
                        <button onclick="closePopup()">Close</button>
                    `;

                    // Show the popup
                    popup.classList.add("show");
                }

                function closePopup() {
                    // Get the popup element
                    const popup = document.getElementById("popup");

                    // Hide the popup
                    popup.classList.remove("show");
                }
            </script>
        <?php

            $feed_template = ob_get_clean();
            return $feed_template;
        }
    }


    public function getStaticResponse()
    {
        $insta_feed = [
            "title"         => "Unknown Title",
            "type"          => "video",
            'provider_name' => 'Instagram Feed',
            "provider_url"  => 'https://instagram.com',
            'html'          => "",
        ];
        $url = $this->getUrl();

        $accessToken = TEMP_ACCESS_TOKEN;

        if ($this->validateInstagramFeed($url)) {
            // print_r("Instagram feed validation successful");
        }

        if ($this->getInstagramFeedTemplate($accessToken)) {
            $insta_feed['html'] = $this->getInstagramFeedTemplate($accessToken);
        }

        // print_r($insta_feed);

        return $insta_feed;
    }


    /** inline {@inheritdoc} */
    public function getFakeResponse()
    {
        return [
            'type' => 'video',
            'provider_name' => 'Instagram Feed',
            'provider_url' => 'https://instagram.com',
            'title' => 'Unknown title',
            'html' => '',
        ];
    }
}
