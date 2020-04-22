<?php

namespace EmbedPress\Providers;

use Embera\Adapters\Service as EmberaService;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Entity responsible to support GoogleMaps embeds.
 *
 * @package     EmbedPress
 * @subpackage  EmbedPress/Providers
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2020 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       1.0.0
 */
class GoogleMaps extends EmberaService
{
    /**
     * Method that verifies if the embed URL belongs to GoogleMaps.
     *
     * @since   1.0.0
     *
     * @return  boolean
     */
    public function validateUrl()
    {
        return preg_match('~http[s]?:\/\/(?:(?:(?:www\.|maps\.)?(?:google\.com?))|(?:goo\.gl))(?:\.[a-z]{2})?\/(?:maps\/)?(?:place\/)?(?:[a-z0-9\/%+\-_]*)?([a-z0-9\/%,+\-_=!:@\.&*\$#?\']*)~i',
            $this->url);
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
        $iframeSrc = '';

        // Check if the url is already converted to the embed format
        if (preg_match('~(maps/embed|output=embed)~i', $this->url)) {
            $iframeSrc = $this->url;
        } else {
            // Extract coordinates and zoom from the url
            if (preg_match('~@(-?[0-9\.]+,-?[0-9\.]+).+,([0-9\.]+[a-z])~i', $this->url, $matches)) {
                $iframeSrc = 'https://maps.google.com/maps?hl=en&ie=UTF8&ll=' . $matches[1] . '&spn=' . $matches[1] . '&t=m&z=' . round($matches[2]) . '&output=embed';
            } else {
                return [];
            }
        }

        return [
            'type'          => 'rich',
            'provider_name' => 'Google Maps',
            'provider_url'  => 'https://maps.google.com',
            'title'         => 'Unknown title',
            'html'          => '<iframe width="600" height="450" src="' . $iframeSrc . '" frameborder="0"></iframe>',
        ];
    }
}
