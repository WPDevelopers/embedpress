<?php

namespace EmbedPress\Providers;

use Embera\Provider\ProviderAdapter;
use Embera\Provider\ProviderInterface;
use Embera\Url;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Entity responsible to support Giphy embeds.
 *
 * @package     EmbedPress
 * @subpackage  EmbedPress/Providers
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2023 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       1.5.0
 */
class Giphy extends ProviderAdapter implements ProviderInterface
{
    /**
     * The regex which identifies Giphy URLs.
     *
     * @since   1.5.0
     * @access  private
     *
     * @var     string
     */
    private $urlRegexPattern = '~http[s]?:\/\/(?:www\.)?giphy\.com\/(?:gifs|clips)\/(?:[a-zA-Z0-9\-]+\-)?([a-zA-Z0-9]+)(?:[^\w\-]|$)|i.giphy\.com\/([a-zA-Z0-9]+)(\.gif)~';

    /**
     * Method that verifies if the embed URL belongs to Giphy.
     *
     * @param Url $url
     * @return  boolean
     * @since   1.5.0
     *
     */

    public function validateUrl(Url $url)
    {
        $urlString = (string) $url;

        if (preg_match($this->urlRegexPattern, $urlString, $matches)) {
            // Check which group matched and extract the GIF ID
            $gifId = isset($matches[1]) && !empty($matches[1]) ? $matches[1] : (isset($matches[2]) ? $matches[2] : null);
            return $gifId;
        }

        return false;
    }

    /**
     * This method fakes an Oembed response.
     *
     * @since   1.5.0
     *
     * @return  array
     */
    public function fakeResponse()
    {
        $url = $this->getUrl();

        if (preg_match($this->urlRegexPattern, $url, $matches)) {
            $gifId = count($matches) > 3 && strtolower($matches[3]) === ".gif" ? $matches[2] : $matches[1];
            $width = isset($this->config['maxwidth']) ? $this->config['maxwidth'] : 400;
            $height = isset($this->config['maxheight']) ? $this->config['maxheight'] : 400;
            $html = '<a href="https://giphy.com/gifs/' . $gifId . '">' .
                '<img src="https://media.giphy.com/media/' . $gifId . '/giphy.gif" alt="" width="' . esc_attr($width) . '" height="' . esc_attr($height) . '">' .
                '</a>';

            $response = [
                'type'          => 'image',
                'provider_name' => 'Giphy',
                'provider_url'  => 'https://giphy.com',
                'url'           => $url,
                'html'          => $html,
            ];
        } else {
            $response = [];
        }

        return $response;
    }
    /** inline @inheritDoc */
    public function modifyResponse(array $response = [])
    {
        return $this->fakeResponse();
    }
}
