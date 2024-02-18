<?php

namespace EmbedPress\Providers;

use Embera\Provider\ProviderAdapter;
use Embera\Provider\ProviderInterface;
use Embera\Url;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Entity responsible to support TikTok embeds.
 *
 * @package     EmbedPress
 * @subpackage  EmbedPress/Providers
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2023 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       1.0.0
 */
class TikTok extends ProviderAdapter implements ProviderInterface
{
    /** inline {@inheritdoc} */
    protected static $hosts = ["tiktok.com"];
    /**
     * Method that verifies if the embed URL belongs to TikTok.
     *
     * @param Url $url
     * @return  boolean
     * @since   1.0.0
     *
     */
    public function validateUrl(Url $url)
    {
        // TikTok URL pattern
        $pattern = "/^https:\/\/www\.tiktok\.com\/@[\w.-]+\/video\/[\w.-]+$/i";
        // Check if the URL matches the pattern
        return (bool) preg_match($pattern, (string) $url);
    }

    public function validateTikTok($url)
    {
        // TikTok URL pattern
        $pattern = "/^https:\/\/www\.tiktok\.com\/@[\w.-]+\/video\/[\w.-]+$/i";
        // Check if the URL matches the pattern
        return (bool) preg_match($pattern, (string) $url);
    }

    public function getTiktokVideoId($url)
    {
        // TikTok URL pattern
        $pattern = "/^https:\/\/www\.tiktok\.com\/@[\w.-]+\/video\/([\w.-]+)$/i";

        // Check if the URL matches the pattern
        if (preg_match($pattern, (string) $url, $matches)) {
            // Extracted video ID
            return $matches[1];
        }

        return null;
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
        if ($this->validateTikTok($src_url)) {
            $iframeSrc = 'https://tiktok.com/embed/' . $this->getTiktokVideoId($this->url);
        } else {
            return [];
        }


        $width = isset($this->config['maxwidth']) ? $this->config['maxwidth'] : 600;
        $height = isset($this->config['maxheight']) ? $this->config['maxheight'] : 350;

        return [
            'type'          => 'rich',
            'provider_name' => 'TikTok',
            'provider_url'  => 'https://tiktok.com',
            'title'         => 'Unknown title',
            'html'          => '<iframe title=""  width="' . esc_attr($width) . '" height="' . esc_attr($height) . '" src="' . esc_url($iframeSrc) . '" ></iframe>',
        ];
    }
    /** inline @inheritDoc */
    public function modifyResponse(array $response = [])
    {
        return $this->fakeResponse();
    }
}
