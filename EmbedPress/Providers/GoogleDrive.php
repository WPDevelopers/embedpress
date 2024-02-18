<?php

namespace EmbedPress\Providers;

use Embera\Provider\ProviderAdapter;
use Embera\Provider\ProviderInterface;
use Embera\Url;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Entity responsible to support Googledrive embeds.
 *
 * @package     EmbedPress
 * @subpackage  EmbedPress/Providers
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2023 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       1.0.0
 */
class GoogleDrive extends ProviderAdapter implements ProviderInterface
{
    /** inline {@inheritdoc} */
    protected static $hosts = ["google.com", "google.com.*", "drive.google.com", "goo.gl", "google.co.*"];
    /**
     * Method that verifies if the embed URL belongs to Googledrive.
     *
     * @param Url $url
     * @return  boolean
     * @since   1.0.0
     *
     */
    public function validateUrl(Url $url)
    {
        return  (bool) preg_match(
            '~http[s]?:\/\/(?:(?:(?:www\.|drive\.)?(?:google\.com?))|(?:goo\.gl))(?:\.[a-z]{2})?\/(?:drive\/)?(?:place\/)?(?:[a-z0-9\/%+\-_]*)?([a-z0-9\/%,+\-_=!:@\.&*\$#?\']*)~i',
            (string) $url
        );
    }

    public function validateGoogleDriveUrl($url)
    {
        return  (bool) preg_match(
            '~http[s]?:\/\/(?:(?:(?:www\.|drive\.)?(?:google\.com?))|(?:goo\.gl))(?:\.[a-z]{2})?\/(?:drive\/)?(?:place\/)?(?:[a-z0-9\/%+\-_]*)?([a-z0-9\/%,+\-_=!:@\.&*\$#?\']*)~i',
            (string) $url
        );
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
        if (preg_match('/^https:\/\/drive\.google\.com\/file\/d\/(.+?)\/.*$/', $src_url, $matches)) {
            $file_id = $matches[1];
            $iframeSrc = 'https://drive.google.com/file/d/' . $file_id . '/preview';
        } else {
            return [];
        }

        $width = isset($this->config['maxwidth']) ? $this->config['maxwidth'] : 600;
        $height = isset($this->config['maxheight']) ? $this->config['maxheight'] : 450;

        return [
            'type'          => 'rich',
            'provider_name' => 'Google drive',
            'provider_url'  => 'https://drive.google.com',
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
