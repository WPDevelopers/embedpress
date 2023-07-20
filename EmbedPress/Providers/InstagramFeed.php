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
    public function getInstagramUserInfo($accessToken, $account_type)
    {
        if(strtolower($account_type) === 'business'){
            $api_url = 'https://graph.facebook.com/17841451532462963?fields=biography,id,username,website,followers_count,media_count,profile_picture_url,name&access_token='.BUSINESS_ACCESS_TOKEN;
        }
        else{
            $api_url = "https://graph.instagram.com/me?fields=id,username,account_type,media_count,followers_count,biography,website&access_token=$accessToken";
        }

        // Set the transient key
        $transientKey = 'instagram_profile_info_' . md5($api_url);

    
        // Attempt to retrieve the user info from the transient cache

        $cachedUserInfo = get_transient($transientKey);

        // If the user info is found in the cache, return it
        if ($cachedUserInfo !== false) {
            return $cachedUserInfo;
        }

        // Make a GET request to Instagram's API to retrieve user information
        $userInfoResponse = wp_remote_get($api_url);
        

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

            if(!empty($posts['data'])){
                return $posts['data'];
            }

            return 'Please add Instagram Access Token';
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
        <div class="insta-gallery-item cg-carousel__slide js-carousel__slide" data-insta-postid="<?php echo esc_attr( $post['id'] )?>" data-postindex="<?php echo esc_attr( $index ); ?>" data-postdata="<?php echo htmlspecialchars(json_encode($post), ENT_QUOTES, 'UTF-8'); ?>" data-media-type="<?php echo esc_attr( $media_type );?>">
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
        $profile_info = $this->getInstagramUserInfo($accessToken, $account_type);

        // Check and assign each item to separate variables
        $id = !empty($profile_info['id']) ? $profile_info['id'] : '';
        $username = !empty($profile_info['username']) ? $profile_info['username'] : '';
        $followers_count = !empty($profile_info['followers_count']) ? $profile_info['followers_count'] : 0;
        $media_count = !empty($profile_info['media_count']) ? $profile_info['media_count'] : 0;
        $profile_picture_url = !empty($profile_info['profile_picture_url']) ? $profile_info['profile_picture_url'] : '';
        $name = !empty($profile_info['name']) ? $profile_info['name'] : '';

        // echo '<pre>';
        // print_r ($profile_info);
        // echo '</pre>';

        $insta_posts = $this->getInstagramPosts($accessToken, $account_type);

        if(strtolower($account_type) === 'business'){
            $tkey = md5('https://graph.facebook.com/v17.0/'.$id.'/media?fields=media_url,media_product_type,thumbnail_url,caption,id,media_type,timestamp,username,comments_count,like_count,permalink,children%7Bmedia_url,id,media_type,timestamp,permalink,thumbnail_url%7D&limit=20&access_token='.BUSINESS_ACCESS_TOKEN);
        }
        else{
            $tkey = md5("https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,children{media_url},permalink,timestamp,username,thumbnail_url&access_token=$accessToken");
        }


        if (is_array($insta_posts) and !empty($insta_posts)) {
            ob_start(); ?>
            <header class="profile-header">

                <div class="profile-image">
                    <img src="<?php echo esc_url($profile_picture_url); ?>" alt="<?php echo esc_attr( $name ); ?>">
                </div>

                <section class="profile-details">
                    <div class="username-section">
                        <a class="profile-link" href="<?php echo esc_url( 'https://instagram.com/'.$username); ?>" role="link" tabindex="0">
                            <h2 class="username" dir="auto"><?php echo esc_html($username ); ?></h2>
                        </a>
                        <div class="edit-profile-button">
                            <a class="edit-profile-link" href="/accounts/edit/" role="link" tabindex="0"><?php echo esc_html__( 'Follow', 'embedpress' ); ?></a>
                        </div>
                    </div>
                    <div class="profile-stats">
                        <ul class="stats-list">
                            <li class="posts-count"><span class="count"><?php echo esc_html( $media_count ); ?></span> <?php echo esc_html__( 'posts', 'embedpress' ); ?></li>
                            <li class="followers-count">
                                <a class="followers-link" target="_blank" href="<?php echo esc_url( 'https://instagram.com/'.$username.'/followers'); ?>" role="link" tabindex="0">
                                    <span class="count" title="<?php echo esc_attr( $followers_count ); ?>"><?php echo esc_attr( $followers_count ); ?></span> <?php echo esc_html__( 'followers', 'embedpress' ); ?>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div class="bio-section">
                        <span class="bio" dir="auto"><?php echo esc_attr( $name ); ?></span>
                    </div>
                </section>
            </header>
            <div class="posts-tab-options">
                <ul class="tabs">
                    <li data-media-type="ALL" class="active"><svg class="_ab6-" color="#000" height="20" viewBox="5 5 30 30" width="20"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.3333333333333335" d="M5 5h30v30H5zm10.025 0v30m9.95 -30v30M35 15.025H5m30 9.95H5"/></svg>Posts</li>
                    <li data-media-type="VIDEO"><svg class="_ab6-" color="#000" height="20" viewBox="0 0 40 40" width="20"><path fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="3.333" d="M3.415 11.67h33.168"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.333" d="m22.507 3.335 4.763 8.335M12.012 3.517l4.658 8.153M3.333 20.002v5.748c0 4.748 1.163 6.677 2.677 8.242 1.567 1.513 3.497 2.678 8.243 2.678h11.493c4.747 0 6.677-1.165 8.243-2.678 1.513-1.565 2.677-3.493 2.677-8.242V14.253c0-4.747-1.163-6.677-2.677-8.242-1.566-1.513-3.496-2.678-8.242-2.678H14.253c-4.747 0-6.677 1.165-8.243 2.678-1.513 1.566-2.677 3.496-2.677 8.242Z"/><path class="fill-color" d="M16.272 29.44a1.513 1.513 0 0 1-.757-1.312v-8.745a1.515 1.515 0 0 1 2.273-1.313l7.575 4.373a1.515 1.515 0 0 1 0 2.625l-7.575 4.373a1.517 1.517 0 0 1-1.517 0Z" fill-rule="evenodd"/></svg>Reels</li>
                    <li data-media-type="CAROUSEL_ALBUM"><svg aria-label="Carousel" class="x1lliihq x1n2onr6" color="#000" height="20" viewBox="0 0 43.636 43.636" width="20"><path class="fill-color" d="M31.636 27V10a4.695 4.695 0 0 0-4.727-4.727H10A4.695 4.695 0 0 0 5.273 10v17A4.695 4.695 0 0 0 10 31.727h17c2.545-.091 4.636-2.182 4.636-4.727zm4-13.364v14.636c0 4.091-3.364 7.455-7.455 7.455H13.545c-.545 0-.818.636-.455 1 .909 1 2.182 1.636 3.727 1.636h12.182a9.35 9.35 0 0 0 9.364-9.364V16.818a5.076 5.076 0 0 0-1.636-3.727c-.455-.364-1.091 0-1.091.545z"/></svg>Album</li>
                </ul>
            </div>
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
                        <div class="popup-close">x</div>
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
        $account_type = 'business';

        if ($this->validateInstagramFeed($url)) {
            if ($this->getInstagramFeedTemplate($accessToken, $account_type)) {
                $insta_feed['html'] = $this->getInstagramFeedTemplate($accessToken, $account_type);
            }
        }

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
