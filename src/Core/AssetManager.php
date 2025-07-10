<?php

namespace EmbedPress\Core;


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
        // Core build files (loaded everywhere)
        'common-js' => [
            'file' => 'js/common.build.js',
            'deps' => ['jquery'],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-common',
            'priority' => 5
        ],
        'common-css' => [
            'file' => 'css/style.build.css',
            'deps' => [],
            'contexts' => ['frontend', 'elementor', 'editor'],
            'type' => 'style',
            'handle' => 'embedpress-style',
            'priority' => 5
        ],

        // Admin build files
        'admin-common-js' => [
            'file' => 'js/admin-common.build.js',
            'deps' => ['jquery', 'wp-color-picker'],
            'contexts' => ['admin'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-admin-common',
            'priority' => 5
        ],
        'admin-js' => [
            'file' => 'js/admin.build.js',
            'deps' => ['wp-element', 'wp-components', 'wp-i18n', 'embedpress-admin-common'],
            'contexts' => ['admin'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-admin',
            'priority' => 10
        ],

        // Gutenberg blocks
        'blocks-js' => [
            'file' => 'js/blocks.build.js',
            'deps' => ['wp-blocks', 'wp-i18n', 'wp-element', 'wp-api-fetch', 'wp-is-shallow-equal', 'wp-editor', 'wp-components', 'embedpress-pdfobject'],
            'contexts' => ['editor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-blocks',
            'priority' => 10
        ],

        // Frontend
        'frontend-js' => [
            'file' => 'js/frontend.build.js',
            'deps' => ['jquery', 'embedpress-common'],
            'contexts' => ['frontend'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-frontend',
            'priority' => 10
        ],

        // Block-specific assets (loaded conditionally)
        'video-player-js' => [
            'file' => 'js/video-player.build.js',
            'deps' => ['jquery', 'embedpress-common'],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-video-player',
            'priority' => 15,
            'conditional' => 'video_blocks'
        ],
        'carousel-js' => [
            'file' => 'js/carousel.build.js',
            'deps' => ['jquery', 'embedpress-common'],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-carousel',
            'priority' => 15,
            'conditional' => 'carousel_blocks'
        ],
        'pdf-viewer-js' => [
            'file' => 'js/pdf-viewer.build.js',
            'deps' => ['jquery', 'embedpress-common'],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-pdf-viewer',
            'priority' => 15,
            'conditional' => 'pdf_blocks'
        ],
        'gallery-js' => [
            'file' => 'js/gallery.build.js',
            'deps' => ['jquery', 'embedpress-common'],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-gallery',
            'priority' => 15,
            'conditional' => 'gallery_blocks'
        ],
        'document-viewer-js' => [
            'file' => 'js/document-viewer.build.js',
            'deps' => ['jquery', 'embedpress-common', 'wp-blocks', 'wp-dom-ready', 'wp-edit-post'],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-document-viewer',
            'priority' => 15,
            'conditional' => 'document_blocks'
        ],
        'embed-ui-js' => [
            'file' => 'js/embed-ui.build.js',
            'deps' => ['jquery', 'embedpress-common'],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-embed-ui',
            'priority' => 15,
            'conditional' => 'embed_ui_blocks'
        ],
        'ads-js' => [
            'file' => 'js/ads.build.js',
            'deps' => ['jquery', 'embedpress-common'],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-ads',
            'priority' => 15,
            'conditional' => 'ads_enabled'
        ],
        'vendor-js' => [
            'file' => 'js/vendor.build.js',
            'deps' => ['jquery'],
            'contexts' => ['frontend', 'elementor', 'admin'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-vendor',
            'priority' => 5
        ],
        'gutenberg-js' => [
            'file' => 'js/gutenberg.build.js',
            'deps' => ['wp-blocks', 'wp-element'],
            'contexts' => ['editor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-gutenberg',
            'priority' => 15
        ],
        'elementor-js' => [
            'file' => 'js/elementor.build.js',
            'deps' => ['jquery'],
            'contexts' => ['elementor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-elementor',
            'priority' => 15
        ]
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
    }

    /**
     * Enqueue admin assets
     */
    public static function enqueue_admin_assets()
    {
        self::enqueue_assets_for_context('admin');
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
        // Temporary debug
        error_log('EmbedPress: enqueue_editor_assets called');

        // Ensure editor assets are loaded
        self::enqueue_assets_for_context('editor');
    }

    /**
     * Enqueue Elementor frontend assets
     */
    public static function enqueue_elementor_assets()
    {
        self::enqueue_assets_for_context('elementor');
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
    private static function enqueue_assets_for_context($context)
    {

        $assets_to_enqueue = [];

        // Collect assets for this context
        foreach (self::$assets as $key => $asset) {
            if (in_array($context, $asset['contexts'])) {
                $assets_to_enqueue[] = array_merge($asset, ['key' => $key]);
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

        $file_url = EMBEDPRESS_PLUGIN_DIR_URL . 'assets/' . $asset['file'];
        $file_path = EMBEDPRESS_PLUGIN_DIR_PATH . '/assets/' . $asset['file'];

        // Check if file exists
        if (!file_exists($file_path)) {
            return;
        }

        error_log('EmbedPress: enqueue_single_asset called for ' . $asset['handle'] . ' at ' . $file_url);

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
