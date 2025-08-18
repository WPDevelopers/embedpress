<?php

namespace EmbedPress\Includes\Classes;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Helper class for handling permalink compatibility across different WordPress permalink structures
 *
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2023 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       1.0.0
 */
class PermalinkHelper
{
    /**
     * Get permalink-compatible REST URL that works with all permalink structures
     * 
     * This method ensures that REST API URLs work correctly regardless of the 
     * WordPress permalink structure setting:
     * - Plain permalinks (/?p=123): Uses /?rest_route=/path format
     * - Pretty permalinks (/post-name/): Uses /wp-json/path format
     * 
     * @param string $path The REST API path (e.g., 'embedpress/v1/oembed/provider')
     * @return string The properly formatted REST URL
     */
    public static function get_rest_url($path)
    {
        // For consistency and reliability, always use WordPress core's get_rest_url function
        // which handles all permalink structures correctly
        return get_rest_url(null, $path);
    }

    /**
     * Check if the current site is using pretty permalinks
     * 
     * @return bool True if pretty permalinks are enabled, false otherwise
     */
    public static function has_pretty_permalinks()
    {
        $permalink_structure = get_option('permalink_structure');
        return !empty($permalink_structure);
    }

    /**
     * Get the appropriate REST API base URL for the current permalink structure
     * 
     * @return string The base REST API URL
     */
    public static function get_rest_base_url()
    {
        // Use WordPress core function to get the base REST URL
        return get_rest_url();
    }

    /**
     * Construct a full REST API URL for a given namespace and endpoint
     * 
     * @param string $namespace The REST API namespace (e.g., 'embedpress/v1')
     * @param string $endpoint The specific endpoint (e.g., 'oembed/provider')
     * @return string The complete REST API URL
     */
    public static function build_rest_url($namespace, $endpoint = '')
    {
        $path = $namespace;
        if (!empty($endpoint)) {
            $path .= '/' . ltrim($endpoint, '/');
        }
        
        return self::get_rest_url($path);
    }

    /**
     * Get JavaScript-compatible REST URL data for frontend use
     * 
     * This method returns an array of REST URL information that can be
     * localized to JavaScript for frontend API calls
     * 
     * @param string $namespace The REST API namespace
     * @return array Array containing REST URL information
     */
    public static function get_js_rest_data($namespace = 'embedpress/v1')
    {
        return [
            'restUrl' => self::get_rest_url($namespace . '/'),
            'restBase' => self::get_rest_base_url(),
            'hasPrettyPermalinks' => self::has_pretty_permalinks(),
            'namespace' => $namespace,
        ];
    }
}
