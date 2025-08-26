<?php

namespace EmbedPress\Includes\Classes;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Helper class for handling WordPress permalink structures and REST API URLs
 * 
 * This class provides compatibility for EmbedPress with different WordPress permalink structures,
 * particularly fixing issues with Plain Permalinks (?p=123) where REST API URLs need to use
 * query parameters instead of pretty URLs.
 *
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2023 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       4.3.1
 */
class PermalinkHelper
{
    /**
     * Get REST API URL with proper permalink structure support
     * 
     * This method ensures that REST API URLs work correctly regardless of the WordPress
     * permalink structure setting. It handles both pretty permalinks and plain permalinks.
     * 
     * @param string $path The REST API path (e.g., 'embedpress/v1/oembed/youtube')
     * @param int|null $blog_id Optional. Blog ID. Default null for current blog.
     * @param string $scheme Optional. URL scheme. Default 'rest'.
     * @return string The properly formatted REST API URL
     * @since 4.3.1
     */
    public static function get_rest_url($path = '/', $blog_id = null, $scheme = 'rest')
    {
        // Ensure path starts with forward slash
        if (!empty($path) && $path[0] !== '/') {
            $path = '/' . $path;
        }
        
        // Use WordPress core function which handles permalink structure automatically
        return get_rest_url($blog_id, $path, $scheme);
    }
    
    /**
     * Check if WordPress is using pretty permalinks
     * 
     * @return bool True if using pretty permalinks, false for plain permalinks
     * @since 4.3.1
     */
    public static function is_using_pretty_permalinks()
    {
        $permalink_structure = get_option('permalink_structure');
        return !empty($permalink_structure);
    }
    
    /**
     * Get the permalink structure type
     * 
     * @return string The permalink structure type ('plain', 'pretty', or 'custom')
     * @since 4.3.1
     */
    public static function get_permalink_structure_type()
    {
        $permalink_structure = get_option('permalink_structure');
        
        if (empty($permalink_structure)) {
            return 'plain';
        }
        
        // Check for common pretty permalink structures
        $common_structures = [
            '/%year%/%monthnum%/%day%/%postname%/',
            '/%year%/%monthnum%/%postname%/',
            '/%postname%/',
            '/archives/%post_id%',
        ];
        
        if (in_array($permalink_structure, $common_structures)) {
            return 'pretty';
        }
        
        return 'custom';
    }
    
    /**
     * Generate a REST API URL that's compatible with the current permalink structure
     * 
     * This method provides additional compatibility checks and fallbacks for edge cases
     * where the standard get_rest_url() might not work as expected.
     * 
     * @param string $namespace The REST API namespace (e.g., 'embedpress/v1')
     * @param string $route The REST API route (e.g., 'oembed/youtube')
     * @param array $query_args Optional query arguments to append
     * @return string The complete REST API URL
     * @since 4.3.1
     */
    public static function build_rest_url($namespace, $route = '', $query_args = [])
    {
        // Construct the full path
        $path = '/' . trim($namespace, '/');
        if (!empty($route)) {
            $path .= '/' . trim($route, '/');
        }
        
        // Get the base REST URL
        $url = self::get_rest_url($path);
        
        // Add query arguments if provided
        if (!empty($query_args)) {
            $url = add_query_arg($query_args, $url);
        }
        
        return $url;
    }
    
    /**
     * Validate that a REST API URL is accessible
     * 
     * This method can be used to test if REST API endpoints are working correctly
     * with the current permalink structure.
     * 
     * @param string $url The REST API URL to test
     * @return bool True if the URL is accessible, false otherwise
     * @since 4.3.1
     */
    public static function validate_rest_url($url)
    {
        // Basic URL validation
        if (!filter_var($url, FILTER_VALIDATE_URL)) {
            return false;
        }
        
        // Check if it's a REST API URL
        $rest_prefix = rest_get_url_prefix();
        if (strpos($url, $rest_prefix) === false && strpos($url, 'rest_route=') === false) {
            return false;
        }
        
        return true;
    }
    
}
