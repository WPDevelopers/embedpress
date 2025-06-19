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

/**
 * Initialize frontend rendering for EmbedPress blocks
 */
function embedpress_init_frontend_renderer() {
    add_action('wp_enqueue_scripts', 'embedpress_enqueue_frontend_assets');
    // No need for footer scripts since content is saved in database
}
add_action('init', 'embedpress_init_frontend_renderer');

/**
 * Enqueue frontend assets for EmbedPress blocks
 */
function embedpress_enqueue_frontend_assets() {
    // Only enqueue if we have EmbedPress blocks on the page
    if (has_block('embedpress/embedpress')) {
        wp_enqueue_style(
            'embedpress-frontend-renderer',
            EMBEDPRESS_URL_ASSETS . 'css/frontend-renderer.css',
            [],
            EMBEDPRESS_PLUGIN_VERSION
        );

        // Only enqueue JavaScript for enhanced functionality (social sharing, etc.)
        wp_enqueue_script(
            'embedpress-frontend-renderer',
            EMBEDPRESS_URL_ASSETS . 'js/frontend-renderer.js',
            ['jquery'],
            EMBEDPRESS_PLUGIN_VERSION,
            true
        );
    }
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
