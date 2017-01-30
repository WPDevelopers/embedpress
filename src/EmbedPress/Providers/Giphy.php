<?php
namespace EmbedPress\Providers;

use \Embera\Adapters\Service as EmberaService;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Entity responsible to support Giphy embeds.
 *
 * @package     EmbedPress
 * @subpackage  EmbedPress/Providers
 * @author      PressShack <help@pressshack.com>
 * @copyright   Copyright (C) 2017 Open Source Training, LLC. All rights reserved.
 * @license     GPLv2 or later
 * @since       @todo
 */
class Giphy extends EmberaService
{
    /**
     * The regex which identifies Giphy urls.
     *
     * @since   @todo
     * @access  private
     *
     * @var     string
     */
    private $urlRegexPattern = '~http[s]?:\/\/(?:www\.)?giphy\.com\/gifs\/([a-zA-Z0-9\-]+)|i.giphy\.com\/([a-zA-Z0-9\-]+)(\.gif)~';

    /**
     * Method that verifies if the embed URL belongs to Giphy.
     *
     * @since   @todo
     *
     * @return  boolean
     */
    public function validateUrl()
    {
        return preg_match($this->urlRegexPattern, $this->url);
    }

    /**
     * This method fakes an Oembed response.
     *
     * @since   @todo
     *
     * @return  array
     */
    public function fakeResponse()
    {
        $url = $this->getUrl();

        if (preg_match($this->urlRegexPattern, $url, $matches)) {
            $gifId = count($matches) > 3 && strtolower($matches[3]) === ".gif" ? $matches[2] : $matches[1];

            $html = ''.
                '<a href="https://giphy.com/gifs/'. $gifId .'">'.
                    '<img src="https://media.giphy.com/media/'. $gifId .'/giphy.gif" alt="" width="{width}" height="{height}">'.
                '</a>';

            $response = array(
                'type'          => 'image',
                'provider_name' => 'Giphy',
                'provider_url'  => 'https://giphy.com',
                'url'           => $url,
                'html'          => $html
            );
        } else {
            $response = array();
        }

        return $response;
    }
}
