<?php

namespace EmbedPress\Providers;

use Embera\Provider\ProviderAdapter;
use Embera\Provider\ProviderInterface;
use Embera\Url;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Entity responsible to support Calendly embeds.
 *
 * @package     EmbedPress
 * @subpackage  EmbedPress/Providers
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2023 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       1.0.0
 */
class Calendly extends ProviderAdapter implements ProviderInterface
{
    /** inline {@inheritdoc} */
    protected static $hosts = ["calendly.com"];
    /**
     * Method that verifies if the embed URL belongs to Calendly.
     *
     * @param Url $url
     * @return  boolean
     * @since   1.0.0
     *
     */
    public function validateUrl(Url $url)
    {
        return  (bool) preg_match(
            "/^https:\/\/calendly\.com\/.*/",
            (string) $url
        );
    }

    public function validateCalendly($url)
    {
        return  (bool) preg_match(
            "/^https:\/\/calendly\.com\/.*/",
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
        
        $width = isset($this->config['maxwidth']) ? $this->config['maxwidth'] : 600;
        $height = isset($this->config['maxheight']) ? $this->config['maxheight'] : 350;
        
        // Check if the url is already converted to the embed format  
        if ($this->validateCalendly($src_url)) {
            $html =    '<script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>
            <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">
            <div class="calendly-inline-widget" data-url="'.esc_url($this->url).'" style="min-width:'. $width.'px;height:'.$height.'px;"></div>';
        } else {
            $html = '';
        }


        return [
            'type'          => 'rich',
            'provider_name' => 'Calendly',
            'provider_url'  => 'https://calendly.com',
            'title'         => 'Unknown title',
            'html'          => $html,
        ];
    }
    /** inline @inheritDoc */
    public function modifyResponse(array $response = [])
    {
        return $this->fakeResponse();
    }
}
