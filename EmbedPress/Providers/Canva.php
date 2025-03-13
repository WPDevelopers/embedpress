<?php

namespace EmbedPress\Providers;

use Embera\Provider\ProviderAdapter;
use Embera\Provider\ProviderInterface;
use Embera\Url;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Entity responsible to support Canva embeds.
 *
 * @package     EmbedPress
 * @subpackage  EmbedPress/Providers
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2023 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       1.0.0
 */
class Canva extends ProviderAdapter implements ProviderInterface
{
    /** inline {@inheritdoc} */
    protected static $hosts = ["canva.com", "www.canva.com"];

    /**
     * Method that verifies if the embed URL belongs to Canva.
     *
     * @param Url $url
     * @return  boolean
     * @since   1.0.0
     */
    public function validateUrl(Url $url)
    {
        return (bool) preg_match('~https?:\/\/(?:www\.)?canva\.com\/design\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)~i', (string) $url);
    }

    /**
     * This method fakes an OEmbed response for Canva.
     *
     * @since   1.0.0
     * @return  array
     */
    public function fakeResponse()
    {
        $src_url = urldecode($this->url);

        // Check if the URL matches a Canva design link with full structure
        if (preg_match('~https?:\/\/(?:www\.)?canva\.com\/design\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)~i', $src_url, $matches)) {
            $design_id = $matches[1];
            $unique_id = $matches[2];
            $iframeSrc = "https://www.canva.com/design/{$design_id}/{$unique_id}/view?embed";
        } else {
            return [];
        }

        $width = isset($this->config['maxwidth']) ? $this->config['maxwidth'] : 800;
        $height = isset($this->config['maxheight']) ? $this->config['maxheight'] : 600;

        return [
            'type'          => 'rich',
            'provider_name' => 'Canva',
            'provider_url'  => 'https://www.canva.com',
            'title'         => 'Canva Design',
            'html'          => '<iframe title="Canva Design" width="' . esc_attr($width) . '" height="' . esc_attr($height) . '" src="' . esc_url($iframeSrc) . '" frameborder="0" allowfullscreen></iframe>',
        ];
    }

    /** inline @inheritDoc */
    public function modifyResponse(array $response = [])
    {
        return $this->fakeResponse();
    }
}
