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

    //  Business profile endpoints url 
    // https://graph.facebook.com/17841451532462963?fields=biography,id,username,website,followers_count,media_count,profile_picture_url,name&access_token=BUSINESS_ACCESS_TOKEN

    //Business Instagram Feed endpoints url
    // https://graph.facebook.com/v17.0/17841451532462963/media?fields=media_url,media_product_type,thumbnail_url,caption,id,media_type,timestamp,username,comments_count,like_count,permalink,children%7Bmedia_url,id,media_type,timestamp,permalink,thumbnail_url%7D&limit=20&access_token=BUSINESS_ACCESS_TOKEN

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
        $transientKey = 'instagram_user_info_' . md5("https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,children{media_url},permalink,timestamp,username,thumbnail_url&access_token=$accessToken");

    
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
    public function getInstagramPosts($accessToken, $account_type)
    {
        if(strtolower($account_type) === 'business'){
            $api_url = 'https://graph.facebook.com/v17.0/17841451532462963/media?fields=media_url,media_product_type,thumbnail_url,caption,id,media_type,timestamp,username,comments_count,like_count,permalink,children%7Bmedia_url,id,media_type,timestamp,permalink,thumbnail_url%7D&limit=20&access_token='.BUSINESS_ACCESS_TOKEN;
        }
        else{
            $api_url = "https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,children{media_url},permalink,timestamp,username,thumbnail_url&access_token=$accessToken";
        }
        

        // Set the transient key
        $transientKey = 'instagram_posts_' . md5($api_url);

        // Attempt to retrieve the posts from the transient cache
        $cachedPosts = get_transient($transientKey);

        // echo '<pre>'; 
        // print_r($cachedPosts);
        // echo '</pre>'; 



        // If the posts are found in the cache, return them
        if ($cachedPosts !== false) {
            return $cachedPosts;
        }

        // Make a GET request to Instagram's API to retrieve posts
        $postsResponse = wp_remote_get($api_url);


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


    public function getInstaFeedItem($post, $index, $account_type)
    {
        $caption = !empty($post['caption']) ? $post['caption'] : '';
        $media_type = !empty($post['media_type']) ? $post['media_type'] : '';
        $media_url = !empty($post['media_url']) ? $post['media_url'] : '';
        $permalink = !empty($post['permalink']) ? $post['permalink'] : '';
        $timestamp = !empty($post['timestamp']) ? $post['timestamp'] : '';
        $username = !empty($post['username']) ? $post['username'] : '';

        $like_count = !empty($post['like_count']) ? $post['like_count'] : 0;
        $comments_count = !empty($post['comments_count']) ? $post['comments_count'] : 0;

        $dataAttributes = 'data-caption="' . htmlspecialchars($caption) . '" ' .
        'data-media-type="' . htmlspecialchars($media_type) . '" ' .
        'data-media-type="' . htmlspecialchars($media_type) . '" ' .
        'data-media-url="' . htmlspecialchars($media_url) . '" ' .
        'data-permalink="' . htmlspecialchars($permalink) . '" ' .
        'data-timestamp="' . htmlspecialchars($timestamp) . '" ' .
        'data-username="' . htmlspecialchars($username) . '" ' .
        (($account_type === 'business') ? 'data-like-count="' . htmlspecialchars($like_count) . '" ' : '') .
        (($account_type === 'business') ? 'data-comments-count="' . htmlspecialchars($comments_count) . '" ' : '');

        ob_start(); ?>
        <div class="insta-gallery-item cg-carousel__slide js-carousel__slide" data-insta-postid="<?php echo esc_attr( $post['id'] )?>" data-postindex="<?php echo esc_attr( $index ); ?>" data-postdata="<?php echo htmlspecialchars(json_encode($post), ENT_QUOTES, 'UTF-8'); ?>">
            <?php
                if ($media_type == 'VIDEO') {
                    echo '<video class="insta-gallery-image" src="' . esc_url($media_url) . '"></video>';
                } else {
                    echo ' <img class="insta-gallery-image" src="' . esc_url($media_url) . '" alt="' . esc_attr($caption) . '">';
                }
            ?>

            <div class="insta-gallery-item-type">
                <div class="insta-gallery-item-type-icon">
                    <?php
                        if ($media_type == 'VIDEO') {
                            echo Helper::get_insta_video_icon();
                        } else if ($media_type == 'CAROUSEL_ALBUM') {
                            echo Helper::get_insta_image_carousel_icon();
                        } else {
                            echo Helper::get_insta_image_icon();
                        }
                    ?>
                </div>
            </div>
            <div class="insta-gallery-item-info">
                <?php if(strtolower($account_type) === 'business'): ?>
                    <div class="insta-item-reaction-count">
                        <div class="insta-gallery-item-likes">
                            <?php echo Helper::get_insta_like_icon(); echo esc_html($like_count); ?>
                        </div>
                        <div class="insta-gallery-item-comments">
                            <?php echo Helper::get_insta_comment_icon(); echo esc_html($comments_count); ?>
                        </div>
                    </div>
                <?php else: ?>
                    <div class="insta-gallery-item-permalink">
                        <?php  echo Helper::get_instagram_icon(); ?>
                    </div>
                <?php endif; ?>
            </div>
        </div>
        <!-- <div class="pop-insta-feed-item-details">
            <blockquote class="instagram-media" data-instgrm-permalink="<?php echo esc_url($post['permalink']); ?>" ></blockquote>
        </div> -->
    <?php $feed_item = ob_get_clean(); return $feed_item;
    }

    public function getInstagramFeedTemplate($accessToken, $account_type)
    {
        $insta_user_info = $this->getInstagramUserInfo($accessToken);
        $insta_posts = $this->getInstagramPosts($accessToken, $account_type);
        

        if(strtolower($account_type) === 'business'){
            $tkey = md5('https://graph.facebook.com/v17.0/17841451532462963/media?fields=media_url,media_product_type,thumbnail_url,caption,id,media_type,timestamp,username,comments_count,like_count,permalink,children%7Bmedia_url,id,media_type,timestamp,permalink,thumbnail_url%7D&limit=20&access_token='.BUSINESS_ACCESS_TOKEN);
        }
        else{
            $tkey = md5("https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,children{media_url},permalink,timestamp,username,thumbnail_url&access_token=$accessToken");
        }


        if (is_array($insta_posts) and !empty($insta_posts)) {
            ob_start(); ?>
            <header class="profile-header">
                <div class="profile-image">
                    <img src="https://scontent.cdninstagram.com/v/t51.29350-15/298060274_378096814396551_7463359385267832289_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=8ae9d6&_nc_ohc=I9IwvDsl_DIAX8o6S8R&_nc_ht=scontent.cdninstagram.com&edm=AM6HXa8EAAAA&oh=00_AfDKP_WX2qSYwDAtYgk-tmRag0txCe6gm2SI662M8F6itQ&oe=64BBDFE1" alt="">
                </div>
                <section class="profile-details">
                    <div class="username-section">
                        <a class="profile-link" href="#" role="link" tabindex="0">
                            <h2 class="username" dir="auto">me_tester23</h2>
                        </a>
                        <div class="edit-profile-button">
                            <a class="edit-profile-link" href="/accounts/edit/" role="link" tabindex="0"><?php echo esc_html__( 'Follow', 'embedpress' ); ?></a>
                        </div>
                    </div>
                    <div class="profile-stats">
                        <ul class="stats-list">
                            <li class="posts-count"><span class="count">9</span> posts</li>
                            <li class="followers-count">
                                <a class="followers-link" href="/me_tester23/followers/" role="link" tabindex="0">
                                    <span class="count" title="36">36</span> followers
                                </a>
                            </li>
                            <li class="following-count">
                                <a class="following-link" href="/me_tester23/following/" role="link" tabindex="0">
                                    <span class="count">13</span> following
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div class="bio-section">
                        <span class="bio" dir="auto">Testing Account</span>
                    </div>
                </section>
            </header>

            <div class="instagram-container">
                <div class="embedpress-insta-container" data-tkey="<?php echo esc_attr( $tkey ); ?>">
                    <div class="insta-gallery cg-carousel__track js-carousel__track">
                        <?php
                            foreach ($insta_posts as $index => $post) {
                                print_r($this->getInstaFeedItem($post, $index, 'business'));
                            }
                            ?>
                    </div>
                    <div class="cg-carousel__btns hidden">
                        <button class="cg-carousel__btn" id="js-carousel__prev-1"><svg width="20" height="30" viewBox="-5 0 23 23" xmlns="http://www.w3.org/2000/svg"><path d="M11.24.29.361 10.742l-.06.054a.97.97 0 0 0-.301.642v.124a.97.97 0 0 0 .3.642l.054.044L11.239 22.71a1.061 1.061 0 0 0 1.459 0 .964.964 0 0 0 0-1.402l-10.15-9.746 10.15-9.87a.964.964 0 0 0 0-1.402 1.061 1.061 0 0 0-1.459 0Z" fill="#fff"/></svg></button>

                        <button class="cg-carousel__btn" id="js-carousel__next-1"><svg width="20" height="30" viewBox="-5 0 23 23" xmlns="http://www.w3.org/2000/svg"><path d="m1.76.29 10.879 10.452.06.054a.97.97 0 0 1 .301.642v.124a.97.97 0 0 1-.3.642l-.054.044L1.761 22.71a1.061 1.061 0 0 1-1.459 0 .964.964 0 0 1 0-1.402l10.15-9.746-10.15-9.87a.964.964 0 0 1 0-1.402 1.061 1.061 0 0 1 1.459 0Z" fill="#fff"/></svg></button>
                    </div>
                </div>

                <!-- Popup div -->
                <div class="insta-popup" style="display: none;">  
                    <div class="popup-wrapper popup-is-opened">
                        <div class="popup popup-is-initialized"  tabindex="-1"> </div>
                        <div id="popup-close">x</div>
                    </div>
                </div>
            </div>

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

        if ($this->getInstagramFeedTemplate($accessToken, 'business')) {
            $insta_feed['html'] = $this->getInstagramFeedTemplate($accessToken, 'business');
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
