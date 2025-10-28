<?php

namespace EmbedPress\Providers;

use Embera\Provider\ProviderAdapter;
use Embera\Provider\ProviderInterface;
use Embera\Url;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Entity responsible to support GoogleCalendar embeds.
 *
 * @package     EmbedPress
 * @subpackage  EmbedPress/Providers
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2023 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       1.0.0
 */
class GoogleCalendar extends ProviderAdapter implements ProviderInterface
{
    /**
     * Method that verifies if the embed URL belongs to GoogleCalendar.
     *
     * @param Url $url
     * @return  boolean
     * @since   1.0.0
     *
     */
    public function validateUrl(Url $url)
    {
        return (bool) preg_match(
            '~https?:\/\/(?:www\.)?calendar\.google\.com\/calendar\/(?:u\/\d+\/)?embed\?src=[^&]+(?:&[a-zA-Z0-9_%=.\-]+)*~i',
            $url
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
        $iframeSrc = html_entity_decode($this->url);



        $width = isset($this->config['maxwidth']) ? $this->config['maxwidth'] : 600;
        $height = isset($this->config['maxheight']) ? $this->config['maxheight'] : 450;
        $html = '<iframe src="' . esc_url($iframeSrc) . '" width="' . esc_attr($width) . '" height="' . esc_attr($height) . '" style="border:0;" frameborder="0" scrolling="no"></iframe>';


        return [
            'type'          => 'rich',
            'provider_name' => 'Google Calendar',
            'provider_url'  => 'https://calendar.google.com',
            'title'         => 'Unknown title',
            'html'          => $html,
            'wrapper_class' => 'ose-google-calendar',
        ];
    }

    /** inline @inheritDoc */
    public function modifyResponse(array $response = [])
    {
        return $this->fakeResponse();
    }
}
