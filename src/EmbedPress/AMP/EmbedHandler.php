<?php
namespace EmbedPress\AMP;


(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Entity that represents the embed modifier for AMP.
 *
 * @package     EmbedPress
 * @author      PressShack <help@pressshack.com>
 * @copyright   Copyright (C) 2017 PressShack. All rights reserved.
 * @license     GPLv2 or later
 * @since       1.4.0
 * @abstract
 */
abstract class EmbedHandler
{   
    /**
     * Process embeds to check if need to adapt for AMP pages. This is compatible
     * witht the AMP plugin from Automattic.
     *
     * @param string  $parsedContent
     * @param object  $urlData
     *
     * @return object
     */
    static function processParsedContent($parsedContent, $urlData)
    {
        // Check if we don't have the AMP plugin installed to bypass
        if (! class_exists('AMP_Base_Embed_Handler')) {
            return $parsedContent;
        }

        // Start processing

        $handlerMap = [
            'Twitter' => '\\EmbedPress\\AMP\\Adapter\\Twitter',
        ];

        // Check if we have a mapped handler
        if (isset($urlData->provider_name) && array_key_exists($urlData->provider_name, $handlerMap)) {
            $className = $handlerMap[$urlData->provider_name];
            $handler   = new $className($parsedContent, $urlData);

            // Modify the HTML according to the AMP embed handler
            $parsedContent = $handler->process();
        }

        return $parsedContent;
    }
}
