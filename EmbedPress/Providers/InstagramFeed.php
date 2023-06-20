<?php

namespace EmbedPress\Providers;

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
    protected static $hosts = ["radio.nrk.no"];
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
        $transientKey = 'instagram_user_info_' . md5($accessToken);

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
        $transientKey = 'instagram_posts_' . md5($accessToken);

        // Attempt to retrieve the posts from the transient cache
        $cachedPosts = get_transient($transientKey);

        // If the posts are found in the cache, return them
        if ($cachedPosts !== false) {
            return $cachedPosts;
        }

        // Make a GET request to Instagram's API to retrieve posts
        $postsResponse = wp_remote_get("https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,children{media_url},thumbnail_url&access_token=$accessToken");

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

    public function getInstagramFeedTemplate($accessToken)
    {
        $insta_user_info = $this->getInstagramUserInfo($accessToken);
        $insta_posts = $this->getInstagramPosts($accessToken);
        
        ?>
        <div class="embedpress-insta-container">
            <div class="insta-gallery">
                <div class="insta-gallery-item" tabindex="0">
                    <img class="insta-gallery-image" src="https://i.pinimg.com/564x/46/d9/37/46d93782d252ad5d27a3978543cafdfa.jpg" alt="insta-gallery-img">
                    <div class="insta-gallery-item-type">
                        <div class="insta-gallery-item-type-icon">
                            <svg aria-label="Clip" class="x1lliihq x1n2onr6" color="#FFF" fill="#FFF" height="20" viewBox="1.111 1.111 24.444 24.447" width="20">
                                <path d="m14.248 1.111 3.304 5.558h-6.2L8.408 1.146c.229-.014.466-.024.713-.03l.379-.005Zm2.586 0h.331c3.4 0 4.964.838 6.267 2.097a6.674 6.674 0 0 1 1.773 3.133l.078.328H20.14l-3.307-5.558ZM6.093 1.53l2.74 5.139H1.382a6.678 6.678 0 0 1 4.38-5.033ZM16.91 15.79l-5.05-2.916a1.01 1.01 0 0 0-1.507.742l-.009.133v5.831a1.011 1.011 0 0 0 1.394.933l.121-.059 5.05-2.916a1.01 1.01 0 0 0 .111-1.674l-.111-.076-5.05-2.916ZM1.132 8.891h24.404l.017.4.003.21v7.666c0 3.401-.839 4.966-2.098 6.267-1.279 1.238-2.778 2.062-5.922 2.121l-.371.003H9.501c-3.4 0-4.963-.839-6.267-2.099-1.238-1.278-2.06-2.776-2.12-5.922l-.003-.37V9.501l.003-.21Z" fill-rule="evenodd" />
                            </svg>
                            <svg aria-label="Carousel" class="x1lliihq x1n2onr6" color="#FFF" fill="#FFF" height="20" viewBox="0 0 43.636 43.636" width="20">
                                <path d="M31.636 27V10a4.695 4.695 0 0 0-4.727-4.727H10A4.695 4.695 0 0 0 5.273 10v17A4.695 4.695 0 0 0 10 31.727h17c2.545-.091 4.636-2.182 4.636-4.727zm4-13.364v14.636c0 4.091-3.364 7.455-7.455 7.455H13.545c-.545 0-.818.636-.455 1 .909 1 2.182 1.636 3.727 1.636h12.182a9.35 9.35 0 0 0 9.364-9.364V16.818a5.076 5.076 0 0 0-1.636-3.727c-.455-.364-1.091 0-1.091.545z" />
                            </svg>
                        </div>
                    </div>
                    <div class="insta-gallery-item-info">
                        <ul>
                            <li class="insta-gallery-item-likes">
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
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
<?php
    }


    /**
     * This method fakes an Oembed response.
     *
     * @since   1.0.0
     *
     * @return  array
     */
    public function fakeResponse()
    {
        $src_url = urldecode($this->url);

        // Check if the url is already converted to the embed format  
        if ($this->validateInstagramFeed($src_url)) {
            $iframeSrc = $this->url;
        } else {
            return [];
        }

        $width = isset($this->config['maxwidth']) ? $this->config['maxwidth'] : 600;
        $height = isset($this->config['maxheight']) ? $this->config['maxheight'] : 350;

        return [
            'type'          => 'rich',
            'provider_name' => 'Instagram',
            'provider_url'  => 'https://instagram.com',
            'title'         => 'Unknown title',
            'html'          => '<iframe title=""  width="' . $width . '" height="' . $height . '" src="' . $iframeSrc . '" ></iframe>',
        ];
    }
    /** inline @inheritDoc */
    public function modifyResponse(array $response = [])
    {
        return $this->fakeResponse();
    }
}
