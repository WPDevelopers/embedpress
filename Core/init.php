<?php

/**
 * EmbedPress Core Initialization
 * 
 * This file initializes core EmbedPress functionality including the asset manager
 */

use EmbedPress\Core\AssetManager;
use EmbedPress\Core\LocalizationManager;

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Include the AssetManager and LocalizationManager classes
require_once EMBEDPRESS_PLUGIN_DIR_PATH . 'Core/AssetManager.php';
require_once EMBEDPRESS_PLUGIN_DIR_PATH . 'Core/LocalizationManager.php';

// Include Analytics class
require_once EMBEDPRESS_PATH_BASE . 'EmbedPress/Analytics/Analytics.php';

// Initialize AssetManager and LocalizationManager when WordPress is ready
add_action('init', function() {
    AssetManager::init();
    LocalizationManager::init();
}, 5); // Early priority to ensure it's loaded before other components
