<?php

namespace EmbedPress\Providers;

use Embera\Provider\ProviderAdapter;
use Embera\Provider\ProviderInterface;
use Embera\Url;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Entity responsible to support LinkedIn embeds.
 *
 * @package     EmbedPress
 * @subpackage  EmbedPress/Providers
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2023 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       1.0.0
 */
class LinkedIn extends ProviderAdapter implements ProviderInterface
{
    /** inline {@inheritdoc} */
    protected static $hosts = ["linkedin.com"];
    /**
     * Method that verifies if the embed URL belongs to LinkedIn.
     *
     * @param Url $url
     * @return  boolean
     * @since   1.0.0
     *
     */
    public function validateUrl(Url $url)
    {
        // LinkedIn URL pattern
        $pattern = '/^https:\/\/www\.linkedin\.com\/\w+\/update\/urn:li:\w+:\d+\/$/';
        // Check if the URL matches the pattern
        return (bool) preg_match($pattern, (string) $url);
    }

    public function validateLinkedIn($url)
    {
        // LinkedIn URL pattern
        $pattern = $pattern = '/^https:\/\/www\.linkedin\.com\/\w+\/update\/urn:li:\w+:\d+\/$/';
        // Check if the URL matches the pattern
        return (bool) preg_match($pattern, (string) $url);
    }


    function getLinkedInPart($url) {
        $pattern = '/https:\/\/www\.linkedin\.com\/(feed\/update\/urn:li:\w+:\d+\/)/';
        if (preg_match($pattern, $url, $matches)) {
            return $matches[1]; // Return the captured part
        }
        return null; // Return null if no match is found
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
        if ($this->validateLinkedIn($this->url)) {
            $iframeSrc = 'https://linkedin.com/embed/' . $this->getLinkedInPart($this->url);
        } else {
            return [];
        }


        $width = isset($this->config['maxwidth']) ? $this->config['maxwidth'] : 600;
        $height = isset($this->config['maxheight']) ? $this->config['maxheight'] : 350;

        return [
            'type'          => 'rich',
            'provider_name' => 'LinkedIn',
            'provider_url'  => 'https://linkedin.com',
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
