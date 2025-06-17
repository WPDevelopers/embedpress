<?php
/**
 * Debug Block Registration
 * 
 * This file helps debug EmbedPress block registration issues.
 * Include this file temporarily to debug block registration.
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Add debug hooks
add_action('init', 'embedpress_debug_block_registration', 999);
add_action('enqueue_block_editor_assets', 'embedpress_debug_editor_assets', 999);
add_action('wp_footer', 'embedpress_debug_frontend_info');
add_action('admin_footer', 'embedpress_debug_admin_info');

/**
 * Debug block registration
 */
function embedpress_debug_block_registration() {
    if (!defined('WP_DEBUG') || !WP_DEBUG) {
        return;
    }
    
    error_log('=== EmbedPress Block Registration Debug ===');
    
    // Check if block is registered
    $registry = WP_Block_Type_Registry::get_instance();
    $is_registered = $registry->is_registered('embedpress/embedpress');
    error_log('Block embedpress/embedpress registered: ' . ($is_registered ? 'YES' : 'NO'));
    
    if ($is_registered) {
        $block = $registry->get_registered('embedpress/embedpress');
        error_log('Block details: ' . print_r($block, true));
    }
    
    // Check settings
    $elements = (array) get_option(EMBEDPRESS_PLG_NAME . ":elements", []);
    $g_blocks = isset($elements['gutenberg']) ? (array) $elements['gutenberg'] : [];
    
    error_log('EmbedPress elements option: ' . print_r($elements, true));
    error_log('Gutenberg blocks: ' . print_r($g_blocks, true));
    error_log('EmbedPress block enabled: ' . (isset($g_blocks['embedpress']) ? 'YES' : 'NO'));
    
    // Check all registered blocks
    $all_blocks = $registry->get_all_registered();
    $embedpress_blocks = array_filter(array_keys($all_blocks), function($name) {
        return strpos($name, 'embedpress') !== false;
    });
    error_log('All EmbedPress blocks registered: ' . print_r($embedpress_blocks, true));
}

/**
 * Debug editor assets
 */
function embedpress_debug_editor_assets() {
    if (!defined('WP_DEBUG') || !WP_DEBUG) {
        return;
    }
    
    global $wp_scripts;
    
    error_log('=== EmbedPress Editor Assets Debug ===');
    
    // Check if our script is enqueued
    $script_handles = ['embedpress-blocks-editor', 'embedpress_blocks-cgb-block-js'];
    foreach ($script_handles as $handle) {
        $is_enqueued = wp_script_is($handle, 'enqueued');
        $is_registered = wp_script_is($handle, 'registered');
        error_log("Script {$handle} - Registered: " . ($is_registered ? 'YES' : 'NO') . ', Enqueued: ' . ($is_enqueued ? 'YES' : 'NO'));
        
        if ($is_registered && isset($wp_scripts->registered[$handle])) {
            $script = $wp_scripts->registered[$handle];
            error_log("Script {$handle} src: " . $script->src);
            error_log("Script {$handle} deps: " . print_r($script->deps, true));
        }
    }
    
    // Check if files exist
    $script_files = [
        EMBEDPRESS_PATH_BASE . 'assets/js/blocks.build.js',
        EMBEDPRESS_GUTENBERG_DIR_PATH . 'dist/blocks.build.js'
    ];
    
    foreach ($script_files as $file) {
        $exists = file_exists($file);
        error_log("File {$file} exists: " . ($exists ? 'YES' : 'NO'));
        if ($exists) {
            error_log("File {$file} size: " . filesize($file) . ' bytes');
            error_log("File {$file} modified: " . date('Y-m-d H:i:s', filemtime($file)));
        }
    }
}

/**
 * Debug frontend info
 */
function embedpress_debug_frontend_info() {
    if (!defined('WP_DEBUG') || !WP_DEBUG || !current_user_can('manage_options')) {
        return;
    }
    
    ?>
    <script>
    console.log('=== EmbedPress Frontend Debug ===');
    console.log('embedpressObj available:', typeof embedpressObj !== 'undefined');
    if (typeof embedpressObj !== 'undefined') {
        console.log('embedpressObj:', embedpressObj);
    }
    </script>
    <?php
}

/**
 * Debug admin info
 */
function embedpress_debug_admin_info() {
    if (!defined('WP_DEBUG') || !WP_DEBUG || !current_user_can('manage_options')) {
        return;
    }
    
    $screen = get_current_screen();
    if (!$screen || $screen->base !== 'post') {
        return;
    }
    
    ?>
    <script>
    console.log('=== EmbedPress Admin Debug ===');
    console.log('Current screen:', '<?php echo $screen->id; ?>');
    console.log('embedpressObj available:', typeof embedpressObj !== 'undefined');
    if (typeof embedpressObj !== 'undefined') {
        console.log('embedpressObj:', embedpressObj);
        console.log('active_blocks:', embedpressObj.active_blocks);
    }
    
    // Check if wp.blocks is available
    if (typeof wp !== 'undefined' && wp.blocks) {
        console.log('wp.blocks available');
        const blocks = wp.blocks.getBlockTypes();
        const embedpressBlocks = blocks.filter(block => block.name.includes('embedpress'));
        console.log('EmbedPress blocks registered:', embedpressBlocks.map(b => b.name));
    } else {
        console.log('wp.blocks not available');
    }
    </script>
    <?php
}

/**
 * Add admin notice for debugging
 */
add_action('admin_notices', function() {
    if (!defined('WP_DEBUG') || !WP_DEBUG || !current_user_can('manage_options')) {
        return;
    }
    
    $screen = get_current_screen();
    if (!$screen || !in_array($screen->base, ['post', 'edit'])) {
        return;
    }
    
    $elements = (array) get_option(EMBEDPRESS_PLG_NAME . ":elements", []);
    $g_blocks = isset($elements['gutenberg']) ? (array) $elements['gutenberg'] : [];
    $embedpress_enabled = isset($g_blocks['embedpress']);
    
    $registry = WP_Block_Type_Registry::get_instance();
    $is_registered = $registry->is_registered('embedpress/embedpress');
    
    ?>
    <div class="notice notice-info">
        <p><strong>EmbedPress Debug Info:</strong></p>
        <ul>
            <li>Block registered: <?php echo $is_registered ? '✅ YES' : '❌ NO'; ?></li>
            <li>Block enabled in settings: <?php echo $embedpress_enabled ? '✅ YES' : '❌ NO'; ?></li>
            <li>New block system active: <?php echo apply_filters('embedpress_use_new_block_system', true) ? '✅ YES' : '❌ NO'; ?></li>
        </ul>
        <p><em>Check browser console and error logs for more details.</em></p>
    </div>
    <?php
});
