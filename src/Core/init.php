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

// Initialize AssetManager and LocalizationManager when WordPress is ready
add_action('init', function() {
    \EmbedPress\Core\AssetManager::init();
    \EmbedPress\Core\LocalizationManager::init();
}, 5); // Early priority to ensure it's loaded before other components
