<?php

/**
 * EmbedPress Block Render Callbacks
 * 
 * This file includes all the necessary render callback functions
 * for EmbedPress blocks to work with the new block system.
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Include the original render functions from the old system
// This ensures compatibility while we transition to the new structure
require_once EMBEDPRESS_PATH_BASE . 'Gutenberg/block-backend/block-embedpress.php';

// You can add additional render callbacks here as needed
// or create new ones specifically for the new block system
