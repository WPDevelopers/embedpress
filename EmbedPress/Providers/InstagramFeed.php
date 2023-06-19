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
