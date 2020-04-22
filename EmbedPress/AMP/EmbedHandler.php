<?php

namespace EmbedPress\AMP;


(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Entity that represents the embed modifier for AMP.
 *
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2020 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       1.4.0
 * @abstract
 */
abstract class EmbedHandler
{
    /**
     * Process embeds to check if need to adapt for AMP pages. This is compatible
     * witht the AMP plugin from Automattic.
     *
     * @param string $parsedContent
     * @param object $urlData
     * @param array  $attributes
     *
     * @return object
     */
    static function processParsedContent($parsedContent, $urlData, $attributes)
    {
        // Check if we don't have the AMP plugin installed to bypass
        if ( ! class_exists('AMP_Base_Embed_Handler')) {
            return $parsedContent;
        }

        // Start processing

        $handlerMap = [
            'twitter' => '\\EmbedPress\\AMP\\Adapter\\Twitter',
            'reddit'  => '\\EmbedPress\\AMP\\Adapter\\Reddit',
        ];

        $providerName = strtolower($urlData->provider_name);

        // Check if we have a mapped handler
        if (isset($urlData->provider_name) && array_key_exists($providerName, $handlerMap)) {

            $className = $handlerMap[$providerName];
            $handler   = new $className($parsedContent, $urlData, $attributes);

            // Modify the HTML according to the AMP embed handler
            $parsedContent = $handler->process();
        }

        return $parsedContent;
    }
}
