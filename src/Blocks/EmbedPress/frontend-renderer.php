<?php

/**
 * EmbedPress Frontend Renderer
 *
 * Handles frontend rendering of static content saved in the database
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}


// Footer scripts removed - content is now saved directly in the database

// AJAX handlers removed - content is now saved directly in the database

/**
 * Check if a URL is from a dynamic provider
 * This function is still needed for the render callback logic
 */
function embedpress_is_dynamic_provider($url) {
    $dynamic_providers = [
        'photos.app.goo.gl',
        'photos.google.com',
        'instagram.com',
        'opensea.io',
    ];

    foreach ($dynamic_providers as $provider) {
        if (strpos($url, $provider) !== false) {
            return true;
        }
    }

    return false;
}

// Static embed generation functions removed - content is now saved directly in the database
