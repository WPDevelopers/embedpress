<?php
/**
 * Debug EmbedPress Blocks
 * 
 * Temporary file to debug block registration issues.
 * Add this to wp-admin to see what's happening.
 */

// Check if we're in WordPress admin
if (!defined('ABSPATH')) {
    exit;
}

// Add debug info to admin footer
add_action('admin_footer', function() {
    if (get_current_screen()->base !== 'post') {
        return;
    }
    
    echo '<script>console.log("=== EmbedPress Debug Info ===");</script>';
    
    // Check block settings
    $elements = (array) get_option(EMBEDPRESS_PLG_NAME . ":elements", []);
    $g_blocks = isset($elements['gutenberg']) ? (array) $elements['gutenberg'] : [];
    
    echo '<script>console.log("EmbedPress elements option:", ' . json_encode($elements) . ');</script>';
    echo '<script>console.log("Gutenberg blocks:", ' . json_encode($g_blocks) . ');</script>';
    
    // Check if embedpress block is enabled
    $embedpress_enabled = !empty($g_blocks['embedpress']);
    echo '<script>console.log("EmbedPress block enabled:", ' . ($embedpress_enabled ? 'true' : 'false') . ');</script>';
    
    // Check if new build files exist
    $new_blocks_file = EMBEDPRESS_PATH_BASE . 'public/blocks.js';
    $blocks_file_exists = file_exists($new_blocks_file);
    echo '<script>console.log("New blocks.js exists:", ' . ($blocks_file_exists ? 'true' : 'false') . ');</script>';
    echo '<script>console.log("Blocks file path:", "' . $new_blocks_file . '");</script>';
    
    // Check registered blocks
    if (function_exists('WP_Block_Type_Registry')) {
        $registry = WP_Block_Type_Registry::get_instance();
        $registered_blocks = $registry->get_all_registered();
        $embedpress_blocks = array_filter(array_keys($registered_blocks), function($name) {
            return strpos($name, 'embedpress/') === 0;
        });
        echo '<script>console.log("Registered EmbedPress blocks:", ' . json_encode($embedpress_blocks) . ');</script>';
    }
    
    echo '<script>console.log("=== End EmbedPress Debug ===");</script>';
});

// Force enable the embedpress block for testing
add_action('init', function() {
    $elements = (array) get_option(EMBEDPRESS_PLG_NAME . ":elements", []);
    
    // If no gutenberg settings exist, create default ones
    if (!isset($elements['gutenberg'])) {
        $elements['gutenberg'] = [];
    }
    
    // Force enable the embedpress block
    if (empty($elements['gutenberg']['embedpress'])) {
        $elements['gutenberg']['embedpress'] = 1;
        update_option(EMBEDPRESS_PLG_NAME . ":elements", $elements);
        error_log('EmbedPress: Force enabled embedpress block');
    }
}, 5); // Run early
?>
