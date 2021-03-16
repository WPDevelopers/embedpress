<?php

namespace EmbedPress\Providers;

use Embera\Provider\ProviderAdapter;
use Embera\Provider\ProviderInterface;
use Embera\Url;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Entity responsible to support GoogleDocs embeds.
 *
 * @package     EmbedPress
 * @subpackage  EmbedPress/Providers
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2020 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       1.0.0
 */
class GoogleDocs extends ProviderAdapter implements ProviderInterface
{
    /**
     * Method that verifies if the embed URL belongs to GoogleDocs.
     *
     * @param Url $url
     * @return  boolean
     * @since   1.0.0
     *
     */
    public function validateUrl(Url $url)
    {
        return (bool) preg_match('~http[s]?:\/\/((?:www\.)?docs\.google\.com\/(?:.*/)?(?:document|presentation|spreadsheets|forms|drawings)\/[a-z0-9\/\?=_\-\.\,&%\$#\@\!\+]*)~i',
            $url);
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

        // Check the type of document
        preg_match('~google\.com/(?:.+/)?(document|presentation|spreadsheets|forms|drawings)/~i', $iframeSrc, $matches);
        $type = $matches[1];

        switch ($type) {
            case 'document':
                // Check if the url still doesn't have the embedded param, and add if needed
                if ( ! preg_match('~([?&])embedded=true~i', $iframeSrc, $matches)) {
                    if (substr_count($iframeSrc, '?')) {
                        $iframeSrc .= '&embedded=true';
                    } else {
                        $iframeSrc .= '?embedded=true';
                    }
                }
                break;

            case 'presentation':
                // Convert the /pub to /embed if needed
                if (preg_match('~/pub\?~i', $iframeSrc)) {
                    $iframeSrc = str_replace('/pub?', '/embed?', $iframeSrc);
                }
                break;

            case 'spreadsheets':
                if (substr_count($iframeSrc, '?')) {
                    $query = explode('?', $iframeSrc);
                    $query = $query[1];
                    $query = explode('&', $query);

                    if ( ! empty($query)) {
                        $hasWidgetParam  = false;
                        $hasHeadersParam = false;

                        foreach ($query as $param) {
                            if (substr_count($param, 'widget=')) {
                                $hasWidgetParam = true;
                            } elseif (substr_count($param, 'headers=')) {
                                $hasHeadersParam = true;
                            }
                        }

                        if ( ! $hasWidgetParam) {
                            $iframeSrc .= '&widget=true';
                        }

                        if ( ! $hasHeadersParam) {
                            $iframeSrc .= '&headers=false';
                        }
                    }
                } else {
                    $iframeSrc .= '?widget=true&headers=false';
                }
                break;

            case 'forms':
            case 'drawings':
                break;
        }


	    $width = isset( $this->config['maxwidth']) ? $this->config['maxwidth']: 600;
	    $height = isset( $this->config['maxheight']) ? $this->config['maxheight']: 450;
        if ($type !== 'drawings') {
            $html = '<iframe src="' . $iframeSrc . '" frameborder="0" width="'.$width.'" height="'.$height.'" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>';
        } else {
	        $width = isset( $this->config['maxwidth']) ? $this->config['maxwidth']: 960;
	        $height = isset( $this->config['maxheight']) ? $this->config['maxheight']: 720;
            $html = '<img src="' . $iframeSrc . '" width="'.$width.'" height="'.$height.'" />';
        }

        return [
            'type'          => 'rich',
            'provider_name' => 'Google Docs',
            'provider_url'  => 'https://docs.google.com',
            'title'         => 'Unknown title',
            'html'          => $html,
            'wrapper_class' => 'ose-google-docs-' . $type,
        ];
    }

    /** inline @inheritDoc */
    public function modifyResponse( array $response = [])
    {
        return $this->fakeResponse();
    }
}
