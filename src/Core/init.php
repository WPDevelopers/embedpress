<?php

/**
 * EmbedPress Core Initialization
 * 
 * This file initializes core EmbedPress functionality including the asset manager
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Include the AssetManager and LocalizationManager classes
require_once EMBEDPRESS_PATH_BASE . 'src/Core/AssetManager.php';
require_once EMBEDPRESS_PATH_BASE . 'src/Core/LocalizationManager.php';

// Include Analytics class
require_once EMBEDPRESS_PATH_BASE . 'EmbedPress/Analytics/Analytics.php';

// Initialize AssetManager and LocalizationManager when WordPress is ready
add_action('init', function() {
    \EmbedPress\Core\AssetManager::init();
    \EmbedPress\Core\LocalizationManager::init();
}, 5); // Early priority to ensure it's loaded before other components

// Initialize Analytics class for admin
add_action('admin_init', function() {
    if (is_admin()) {
        new \EmbedPress\Analytics\Analytics();
    }
}, 10);
