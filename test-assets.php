<?php
/**
 * Test file to verify AssetManager is working
 * 
 * Add this to your WordPress admin to test:
 * /wp-admin/admin.php?page=test-embedpress-assets
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Add admin menu for testing
add_action('admin_menu', function() {
    add_submenu_page(
        'tools.php',
        'Test EmbedPress Assets',
        'Test EmbedPress Assets',
        'manage_options',
        'test-embedpress-assets',
        'test_embedpress_assets_page'
    );
});

function test_embedpress_assets_page() {
    ?>
    <div class="wrap">
        <h1>EmbedPress Asset Manager Test</h1>
        
        <h2>Asset Status</h2>
        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th>Asset</th>
                    <th>File Path</th>
                    <th>Exists</th>
                    <th>URL</th>
                </tr>
            </thead>
            <tbody>
                <?php
                $assets_to_test = [
                    'blocks-js' => 'js/blocks.build.js',
                    'blocks-style' => 'css/blocks.style.build.css',
                    'blocks-editor' => 'css/blocks.editor.build.css',
                    'admin-js' => 'js/admin.build.js',
                    'admin-css' => 'css/admin.build.css',
                    'frontend-js' => 'js/frontend.build.js',
                    'components-css' => 'css/components.build.css'
                ];
                
                foreach ($assets_to_test as $handle => $file) {
                    $file_path = EMBEDPRESS_PATH_BASE . 'assets/' . $file;
                    $file_url = EMBEDPRESS_URL_ASSETS . $file;
                    $exists = file_exists($file_path);
                    
                    echo '<tr>';
                    echo '<td><strong>' . esc_html($handle) . '</strong></td>';
                    echo '<td><code>' . esc_html($file) . '</code></td>';
                    echo '<td>' . ($exists ? '✅ Yes' : '❌ No') . '</td>';
                    echo '<td><a href="' . esc_url($file_url) . '" target="_blank">View</a></td>';
                    echo '</tr>';
                }
                ?>
            </tbody>
        </table>
        
        <h2>WordPress Hooks Status</h2>
        <p>Check if AssetManager hooks are registered:</p>
        <ul>
            <li><strong>wp_enqueue_scripts:</strong> <?php echo has_action('wp_enqueue_scripts', 'EmbedPress\Core\AssetManager::enqueue_frontend_assets') ? '✅ Registered' : '❌ Not registered'; ?></li>
            <li><strong>admin_enqueue_scripts:</strong> <?php echo has_action('admin_enqueue_scripts', 'EmbedPress\Core\AssetManager::enqueue_admin_assets') ? '✅ Registered' : '❌ Not registered'; ?></li>
            <li><strong>enqueue_block_assets:</strong> <?php echo has_action('enqueue_block_assets', 'EmbedPress\Core\AssetManager::enqueue_block_assets') ? '✅ Registered' : '❌ Not registered'; ?></li>
            <li><strong>enqueue_block_editor_assets:</strong> <?php echo has_action('enqueue_block_editor_assets', 'EmbedPress\Core\AssetManager::enqueue_editor_assets') ? '✅ Registered' : '❌ Not registered'; ?></li>
        </ul>
        
        <h2>Test Asset Loading</h2>
        <p>Click the button below to manually trigger asset loading:</p>
        <button type="button" onclick="testAssetLoading()" class="button button-primary">Test Asset Loading</button>
        
        <div id="test-results" style="margin-top: 20px;"></div>
        
        <script>
        function testAssetLoading() {
            const resultsDiv = document.getElementById('test-results');
            resultsDiv.innerHTML = '<p>Testing asset loading...</p>';
            
            // Test if AssetManager class exists
            fetch('<?php echo admin_url('admin-ajax.php'); ?>', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'action=test_embedpress_assets&nonce=<?php echo wp_create_nonce('test_embedpress_assets'); ?>'
            })
            .then(response => response.json())
            .then(data => {
                resultsDiv.innerHTML = '<h3>Test Results:</h3><pre>' + JSON.stringify(data, null, 2) + '</pre>';
            })
            .catch(error => {
                resultsDiv.innerHTML = '<p style="color: red;">Error: ' + error.message + '</p>';
            });
        }
        </script>
    </div>
    <?php
}

// AJAX handler for testing
add_action('wp_ajax_test_embedpress_assets', function() {
    check_ajax_referer('test_embedpress_assets', 'nonce');
    
    $results = [
        'asset_manager_class_exists' => class_exists('EmbedPress\Core\AssetManager'),
        'constants' => [
            'EMBEDPRESS_PATH_BASE' => defined('EMBEDPRESS_PATH_BASE') ? EMBEDPRESS_PATH_BASE : 'Not defined',
            'EMBEDPRESS_URL_ASSETS' => defined('EMBEDPRESS_URL_ASSETS') ? EMBEDPRESS_URL_ASSETS : 'Not defined'
        ],
        'asset_files' => []
    ];
    
    // Test asset files
    $assets_to_test = [
        'blocks-js' => 'js/blocks.build.js',
        'blocks-style' => 'css/blocks.style.build.css',
        'admin-js' => 'js/admin.build.js',
        'frontend-js' => 'js/frontend.build.js'
    ];
    
    foreach ($assets_to_test as $handle => $file) {
        $file_path = EMBEDPRESS_PATH_BASE . 'assets/' . $file;
        $results['asset_files'][$handle] = [
            'path' => $file_path,
            'exists' => file_exists($file_path),
            'size' => file_exists($file_path) ? filesize($file_path) : 0
        ];
    }
    
    wp_send_json_success($results);
});
?>
