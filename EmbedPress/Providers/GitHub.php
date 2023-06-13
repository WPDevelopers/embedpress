<?php

namespace EmbedPress\Providers;

use Embera\Provider\ProviderAdapter;
use Embera\Provider\ProviderInterface;
use Embera\Url;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Entity responsible to support GitHub embeds.
 *
 * @package     EmbedPress
 * @subpackage  EmbedPress/Providers
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2023 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       1.0.0
 */
class GitHub extends ProviderAdapter implements ProviderInterface
{
    /** inline {@inheritdoc} */
    protected static $hosts = ["github.com", "gist.github.com"];
    /**
     * Method that verifies if the embed URL belongs to GitHub.
     *
     * @param Url $url
     * @return  boolean
     * @since   1.0.0
     *
     */
    public function validateUrl(Url $url)
    {
        return  (bool) preg_match(
            '/^(https?:\/\/)?gist\.github\.com\/([A-Za-z0-9_-]+\/)?([A-Za-z0-9]+)$/i',
            (string) $url
        );
    }

    public function validateGitHubUrl($url)
    {
        return  (bool) preg_match(
            '/^(https?:\/\/)?gist\.github\.com\/([A-Za-z0-9_-]+\/)?([A-Za-z0-9]+)$/i',
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
        if ($this->validateGitHubUrl($src_url)) {
            $gist_url = $src_url . '.js';
            $response = wp_remote_get($gist_url);

            
            if (is_array($response) && !is_wp_error($response)) {
                $code = wp_remote_retrieve_body($response);
                $gist_html = str_replace('\n', '', $code);

                $code = wp_unslash( $gist_html );
                $code  = explode("document.write('", $code);
                $code[1] = substr($code[1], 0, -3);
                $code[2] = substr($code[2], 0, -3);
                
                $code = implode("", $code);

            }
        } else {
            return [];
        }

        $width = isset($this->config['maxwidth']) ? $this->config['maxwidth'] : 600;
        $height = isset($this->config['maxheight']) ? $this->config['maxheight'] : 450;

        return [
            'type'          => 'rich',
            'provider_name' => 'GitHub',
            'provider_url'  => 'https://gist.github.com',
            'title'         => 'Unknown title',
            'html'          => $code,
        ];
    }
    /** inline @inheritDoc */
    public function modifyResponse(array $response = [])
    {
        return $this->fakeResponse();
    }
}
