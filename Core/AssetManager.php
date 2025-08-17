<?php

namespace EmbedPress\Core;

// Include LocalizationManager
// require_once __DIR__ . '/LocalizationManager.php';

use Embedpress\Core\LocalizationManager;

/**
 * EmbedPress Asset Manager
 *
 * Centralized asset management for JS/CSS files across blocks, Elementor, admin, and frontend
 * Handles new build files from Vite build system
 */
class AssetManager
{
    /**
     * Asset definitions with context-based loading
     */
    private static $assets = [

        // 🔧 Scripts (Ordered by Priority)
        // ----------------------------------

        // Priority 5: Common build assets (depend on vendor libraries)
        'common-js' => [
            'file' => 'js/common.build.js',
            'deps' => ['jquery'],
            'contexts' => ['frontend', 'elementor', 'editor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-common',
            'priority' => 5,
        ],
        // Vendor assets (copied to assets folder for consistency)
        // Priority 1-5: Core vendor libraries
        'plyr-css' => [
            'file' => 'css/plyr.css',
            'deps' => [],
            'contexts' => ['frontend', 'elementor', 'editor'],
            'type' => 'style',
            'handle' => 'embedpress-plyr-css',
            'priority' => 1,
        ],
        'carousel-vendor-css' => [
            'file' => 'css/carousel.min.css',
            'deps' => [],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'style',
            'handle' => 'embedpress-carousel-vendor-css',
            'priority' => 1,
        ],
        'glider-css' => [
            'file' => 'css/glider.min.css',
            'deps' => [],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'style',
            'handle' => 'embedpress-glider-css',
            'priority' => 1,
        ],
        'plyr-js' => [
            'file' => 'js/plyr.js',
            'deps' => ['jquery'],
            'contexts' => ['frontend', 'elementor', 'editor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-plyr',
            'priority' => 2,
        ],
        'plyr-polyfilled-js' => [
            'file' => 'js/plyr.polyfilled.js',
            'deps' => ['jquery'],
            'contexts' => ['frontend', 'elementor', 'editor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-plyr-polyfilled',
            'priority' => 2,
        ],
        'carousel-vendor-js' => [
            'file' => 'js/carousel.min.js',
            'deps' => ['jquery'],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-carousel-vendor',
            'priority' => 2,
        ],
        'glider-js' => [
            'file' => 'js/glider.min.js',
            'deps' => ['jquery'],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-glider',
            'priority' => 2,
        ],
        'pdfobject-js' => [
            'file' => 'js/pdfobject.js',
            'deps' => [],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-pdfobject',
            'priority' => 2,
        ],
        'embed-ui-vendor-js' => [
            'file' => 'js/embed-ui.min.js',
            'deps' => ['jquery'],
            'contexts' => ['frontend', 'elementor', 'editor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-embed-ui-vendor',
            'priority' => 2,
        ],
        'bootstrap-js' => [
            'file' => 'js/bootstrap.min.js',
            'deps' => ['jquery'],
            'contexts' => ['admin'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-bootstrap',
            'priority' => 2,
        ],
        'bootbox-js' => [
            'file' => 'js/bootbox.min.js',
            'deps' => ['jquery', 'embedpress-bootstrap'],
            'contexts' => ['admin'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-bootbox',
            'priority' => 3,
        ],
        // Priority 5-6: Build assets that depend on vendor libraries
        'admin-common-js' => [
            'file' => 'js/admin-common.build.js',
            'deps' => ['jquery', 'wp-color-picker', 'embedpress-bootstrap', 'embedpress-bootbox'],
            'contexts' => ['admin'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-admin-common',
            'priority' => 5,
        ],
        'initplyr-js' => [
            'file' => 'js/initplyr.build.js',
            'deps' => ['jquery', 'embedpress-plyr'],
            'contexts' => ['frontend', 'elementor', 'editor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-initplyr',
            'priority' => 5,
        ],
        'preview-js' => [
            'file' => 'js/preview.build.js',
            'deps' => ['jquery'],
            'contexts' => ['frontend', 'elementor', 'admin'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-preview',
            'priority' => 5,
        ],
        'preview-css' => [
            'file' => 'css/preview.build.css',
            'deps' => [],
            'contexts' => ['frontend', 'elementor', 'admin'],
            'type' => 'style',
            'handle' => 'embedpress-preview-css',
            'priority' => 5,
        ],
        // Priority 7-10: Application-specific build assets
        'admin-js' => [
            'file' => 'js/admin.build.js',
            'deps' => ['wp-element', 'wp-components', 'wp-i18n', 'embedpress-admin-common'],
            'contexts' => ['admin'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-admin',
            'priority' => 7,
        ],


        'analytics-js' => [
            'file' => 'js/analytics.build.js',
            'deps' => ['react', 'react-dom'],
            'contexts' => ['admin'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-analytics',
            'priority' => 7,
            'page' => 'embedpress-analytics'
        ],
        'analytics-css' => [
            'file' => 'css/analytics.build.css',
            'deps' => [],
            'contexts' => ['admin'],
            'type' => 'style',
            'handle' => 'embedpress-analytics-css',
            'priority' => 7,
            'page' => 'embedpress-analytics'
        ],

        'settings-js' => [
            'file' => 'js/settings.build.js',
            'deps' => ['jquery', 'wp-color-picker', 'embedpress-bootstrap', 'embedpress-bootbox'],
            'contexts' => ['settings'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'ep-settings-script',
            'priority' => 7,
        ],
        'settings-css' => [
            'file' => 'css/settings.build.css',
            'deps' => ['wp-color-picker'],
            'contexts' => ['admin'],
            'type' => 'style',
            'handle' => 'ep-settings-style',
            'priority' => 7,
            'page' => 'embedpress'
        ],
        'admin-common-css' => [
            'file' => 'css/admin-common.build.css',
            'deps' => [],
            'contexts' => ['admin'],
            'type' => 'style',
            'handle' => 'embedpress-admin-common-css',
            'priority' => 6,
        ],

        'frontend-js' => [
            'file' => 'js/frontend.build.js',
            'deps' => ['jquery', 'embedpress-common'],
            'contexts' => ['frontend'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-frontend',
            'priority' => 10,
        ],
        'blocks-js' => [
            'file' => 'js/blocks.build.js',
            'deps' => ['wp-blocks', 'wp-i18n', 'wp-element', 'wp-api-fetch', 'wp-is-shallow-equal', 'wp-editor', 'wp-components'],
            'contexts' => ['editor', 'frontend'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-blocks',
            'priority' => 10,
        ],

        'gallery-js' => [
            'file' => 'js/gallery.build.js',
            'deps' => ['jquery', 'embedpress-common'],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-gallery',
            'priority' => 15,
        ],
        'document-viewer-js' => [
            'file' => 'js/document-viewer.build.js',
            'deps' => ['jquery', 'embedpress-common'],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-document-viewer',
            'priority' => 15,
        ],

        'ads-js' => [
            'file' => 'js/ads.build.js',
            'deps' => ['jquery', 'embedpress-common'],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-ads',
            'priority' => 15,
        ],
        'gutenberg-js' => [
            'file' => 'js/gutenberg.build.js',
            'deps' => ['wp-blocks', 'wp-element'],
            'contexts' => ['editor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-gutenberg',
            'priority' => 15,
        ],
        'elementor-js' => [
            'file' => 'js/elementor.build.js',
            'deps' => ['jquery'],
            'contexts' => ['elementor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-elementor',
            'priority' => 15,
        ],

        // 🎨 Styles (Ordered by Priority)
        // ----------------------------------

        'common-css' => [
            'file' => 'css/common.build.css',
            'deps' => [],
            'contexts' => ['frontend', 'elementor', 'editor'],
            'type' => 'style',
            'handle' => 'embedpress-common-css',
            'priority' => 5,
        ],
        'blocks-css' => [
            'file' => 'css/blocks.build.css',
            'deps' => [],
            'contexts' => ['editor', 'frontend'],
            'type' => 'style',
            'handle' => 'embedpress-blocks-css',
            'priority' => 10,
        ],

        'elementor-css' => [
            'file' => 'css/elementor.build.css',
            'deps' => [],
            'contexts' => ['elementor'],
            'type' => 'style',
            'handle' => 'embedpress-elementor-css',
            'priority' => 15,
        ],
    ];

    /**
     * Initialize asset manager
     */
    public static function init()
    {
        // Use proper priorities to ensure correct load order
        add_action('wp_enqueue_scripts', [__CLASS__, 'enqueue_frontend_assets'], 5);
        add_action('admin_enqueue_scripts', [__CLASS__, 'enqueue_admin_assets'], 5);
        add_action('enqueue_block_assets', [__CLASS__, 'enqueue_block_assets'], 5);
        add_action('enqueue_block_editor_assets', [__CLASS__, 'enqueue_editor_assets'], 5);
        add_action('elementor/frontend/after_enqueue_styles', [__CLASS__, 'enqueue_elementor_assets'], 5);
        add_action('elementor/editor/after_enqueue_styles', [__CLASS__, 'enqueue_elementor_editor_assets'], 5);

        // Prevent conflicts by deregistering legacy assets when new system is active
        add_action('wp_enqueue_scripts', [__CLASS__, 'deregister_legacy_assets'], 1);
        add_action('admin_enqueue_scripts', [__CLASS__, 'deregister_legacy_assets'], 1);
    }

    /**
     * Enqueue frontend assets
     */
    public static function enqueue_frontend_assets()
    {
        self::enqueue_assets_for_context('frontend');

        // Setup frontend localization
        LocalizationManager::setup_frontend_localization();
    }

    /**
     * Enqueue admin assets
     */
    public static function enqueue_admin_assets($hook = '')
    {
        self::enqueue_assets_for_context('admin', $hook);

        // Load settings assets only on EmbedPress settings pages
        if (strpos($hook, 'embedpress') !== false) {
            self::enqueue_assets_for_context('settings', $hook);

            // Ensure wp-color-picker is loaded for settings page
            wp_enqueue_style('wp-color-picker');

            // Ensure media scripts are loaded
            if (!did_action('wp_enqueue_media')) {
                wp_enqueue_media();
            }
        }

        // Setup admin localization
        LocalizationManager::setup_admin_localization($hook);
    }

    /**
     * Enqueue block assets (both editor and frontend)
     */
    public static function enqueue_block_assets()
    {
        // This runs on both frontend and editor for blocks
        // For frontend, we don't need the editor scripts
        if (is_admin()) {
            self::enqueue_assets_for_context('editor');
        }
    }

    /**
     * Enqueue editor-only assets
     */
    public static function enqueue_editor_assets()
    {
        // Ensure editor assets are loaded
        self::enqueue_assets_for_context('editor');

        // Setup editor localization
        LocalizationManager::setup_editor_localization();
    }

    /**
     * Enqueue Elementor frontend assets
     */
    public static function enqueue_elementor_assets()
    {
        self::enqueue_assets_for_context('elementor');

        // Setup Elementor localization
        LocalizationManager::setup_elementor_localization();
    }

    /**
     * Enqueue Elementor editor assets
     */
    public static function enqueue_elementor_editor_assets()
    {
        self::enqueue_assets_for_context('elementor');
    }

    /**
     * Enqueue assets for a specific context
     */
    private static function enqueue_assets_for_context($context, $hook = '')
    {

        $assets_to_enqueue = [];

        // Collect assets for this context
        foreach (self::$assets as $key => $asset) {
            if (in_array($context, $asset['contexts'])) {
                // Check if asset has page restriction
                if (isset($asset['page']) && !empty($asset['page'])) {
                    // Only enqueue if we're on the specified page
                    if (strpos($hook, $asset['page']) !== false) {
                        $assets_to_enqueue[] = array_merge($asset, ['key' => $key]);
                    }
                    // If page doesn't match, don't enqueue this asset
                } else {
                    // No page restriction, enqueue normally
                    $assets_to_enqueue[] = array_merge($asset, ['key' => $key]);
                }
            }
        }

        // Sort by priority
        usort($assets_to_enqueue, function ($a, $b) {
            return $a['priority'] - $b['priority'];
        });


        // Enqueue assets
        foreach ($assets_to_enqueue as $asset) {
            self::enqueue_single_asset($asset);
        }
    }

    /**
     * Enqueue a single asset
     */
    private static function enqueue_single_asset($asset)
    {
        // All assets are build files from Vite
        $file_url = EMBEDPRESS_PLUGIN_DIR_URL . 'assets/' . $asset['file'];
        $file_path = EMBEDPRESS_PLUGIN_DIR_PATH . '/assets/' . $asset['file'];

        // Check if file exists
        if (!file_exists($file_path)) {
            return;
        }

        $version = filemtime($file_path);


        if ($asset['type'] === 'script') {

            wp_enqueue_script(
                $asset['handle'],
                $file_url,
                $asset['deps'],
                $version,
                $asset['footer']
            );

            // Only add module type for ES modules (not for IIFE builds)
            // Our Vite builds are now IIFE format, so we don't need module type
            // add_filter('script_loader_tag', function($tag, $handle) use ($asset) {
            //     if ($handle === $asset['handle']) {
            //         return str_replace('<script ', '<script type="module" ', $tag);
            //     }
            //     return $tag;
            // }, 10, 2);

            // Temporary debug for blocks script
            if ($asset['handle'] === 'embedpress-blocks') {
                error_log('EmbedPress: Successfully enqueued blocks script: ' . $file_url);
            }
        } elseif ($asset['type'] === 'style') {
            wp_enqueue_style(
                $asset['handle'],
                $file_url,
                $asset['deps'],
                $version,
                isset($asset['media']) ? $asset['media'] : 'all'
            );
        }
    }

    /**
     * Deregister legacy assets to prevent conflicts
     */
    public static function deregister_legacy_assets()
    {
        $legacy_handles = [
            'embedpress-front',
            'gutenberg-general',
            'embedpress_blocks-cgb-block-js',
            'embedpress_blocks-cgb-style-css',
            'embedpress_blocks-cgb-editor-css'
        ];

        foreach ($legacy_handles as $handle) {
            wp_deregister_script($handle);
            wp_deregister_style($handle);
        }
    }

    /**
     * Get asset URL
     */
    public static function get_asset_url($file)
    {
        return EMBEDPRESS_PLUGIN_DIR_URL . 'assets/' . $file;
    }



    /**
     * Check if asset exists
     */
    public static function asset_exists($file)
    {
        $plugin_path = dirname(dirname(dirname(__DIR__)));
        return file_exists($plugin_path . '/assets/' . $file);
    }
}
