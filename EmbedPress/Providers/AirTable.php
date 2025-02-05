<?php

namespace EmbedPress\Providers;

use Embera\Provider\ProviderAdapter;
use Embera\Provider\ProviderInterface;
use Embera\Url;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Entity responsible to support AirTable embeds.
 *
 * @package     EmbedPress
 * @subpackage  EmbedPress/Providers
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2023 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       1.0.0
 */
class AirTable extends ProviderAdapter implements ProviderInterface
{
    /** inline {@inheritdoc} */
    protected static $hosts = ["airtable.com"];
    /**
     * Method that verifies if the embed URL belongs to AirTable.
     *
     * @param Url $url
     * @return  boolean
     * @since   1.0.0
     *
     */
    public function validateUrl(Url $url)
    {
        return (bool) preg_match(
            '~^https:\/\/airtable\.com\/app[a-zA-Z0-9]+\/shr[a-zA-Z0-9]+$~',
            (string) $url
        );
    }

    public function validateAirtableUrl($url)
    {
        return (bool) preg_match(
            '~^https:\/\/airtable\.com\/app[a-zA-Z0-9]+\/shr[a-zA-Z0-9]+$~',
            (string) $url
        );
    }

    public function getAirtableIds($url)
    {
        $pattern = '~^https:\/\/airtable\.com\/([a-zA-Z0-9]+\/[a-zA-Z0-9]+)$~';

        if (preg_match($pattern, (string) $url, $matches)) {
            return $matches[1]; // Extracts "appXXXXX/shrXXXXX"
        }

        return null; // Return null if the URL is invalid
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

        $ids = $this->getAirtableIds($src_url);
        $embed_url = "https://airtable.com/embed/" . $ids;


        $width = isset($this->config['maxwidth']) ? $this->config['maxwidth'] : 600;
        $height = isset($this->config['maxheight']) ? $this->config['maxheight'] : 450;

        return [
            'type'          => 'rich',
            'provider_name' => 'AirTable',
            'provider_url'  => 'https://airtable.com',
            'title'         => 'Unknown title',
            'html'          => '<iframe title=""  width="' . esc_attr($width) . '" height="' . esc_attr($height) . '" src="' . esc_url($embed_url) . '" frameborder="0"></iframe>',
        ];
    }
    /** inline @inheritDoc */
    public function modifyResponse(array $response = [])
    {
        return $this->fakeResponse();
    }
}
