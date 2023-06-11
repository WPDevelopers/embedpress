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
 * @copyright   Copyright (C) 2020 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       1.0.0
 */
class SelfHosted extends ProviderAdapter implements ProviderInterface
{
    /** inline {@inheritdoc} */
    protected static $hosts = ["development.local"];
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
            '/\.(mp4|mov|avi|wmv|flv|mkv|webm|mpeg|mpg)$/i',
            (string) $url
        );
    }

    public function validateSelfHostedUrl($url)
    {
        return  (bool) preg_match(
            '/\.(mp4|mov|avi|wmv|flv|mkv|webm|mpeg|mpg)$/i',
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
        if ($this->validateSelfHostedUrl($this->url)) {
            $iframeSrc = $this->url;
        } else {
            return [];
        }

        $width = isset($this->config['maxwidth']) ? $this->config['maxwidth'] : 600;
        $height = isset($this->config['maxheight']) ? $this->config['maxheight'] : 450;

        return [
            'type'          => 'rich',
            'provider_name' => 'Self Hosted',
            'provider_url'  => site_url(),
            'title'         => 'Unknown title',
            'html'          => '<video controls width="'.esc_attr($width).'" height="'.esc_attr($height).'"> <source src="'.esc_url($iframeSrc).'" > </video>',
        ];
    }
    /** inline @inheritDoc */
    public function modifyResponse(array $response = [])
    {
        return $this->fakeResponse();
    }
}
