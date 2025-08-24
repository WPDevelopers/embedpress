<?php

/**
 * EmbedPress Blocks Initialization
 * 
 * This file initializes the new EmbedPress block system
 * using the centralized structure in the src/Blocks directory.
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

use EmbedPress\Gutenberg\BlockManager;


/**
 * Initialize the block manager
 */
function embedpress_init_blocks() {
    // Only initialize if we have the required WordPress functions
    if (!function_exists('register_block_type')) {
        return;
    }

    // Initialize the block manager instance
    BlockManager::get_instance();

    // Register block category if it doesn't exist
    // add_filter('block_categories_all', 'embedpress_register_block_category', 10, 2);
}

/**
 * Register EmbedPress block category
 */
function embedpress_register_block_category($categories, $post = null) {
    // Check if category already exists
    foreach ($categories as $category) {
        if ($category['slug'] === 'embedpress') {
            return $categories;
        }
    }
}

/**
 * Check if we should use the block system
 */
function embedpress_should_use_blocks() {
    // For now, we'll use a filter to allow enabling/disabling the block system
    return apply_filters('embedpress_use_new_block_system', true);
}

// Initialize the block system
if (embedpress_should_use_blocks()) {
    add_action('init', 'embedpress_init_blocks', 5);
}
