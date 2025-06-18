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

// Include the AssetManager class
require_once EMBEDPRESS_PATH_BASE . 'src/Core/AssetManager.php';

// Initialize AssetManager when WordPress is ready
add_action('init', function() {
    \EmbedPress\Core\AssetManager::init();
}, 5); // Early priority to ensure it's loaded before other components
