<?php

namespace EmbedPress\Core;

// Include LocalizationManager
require_once __DIR__ . '/LocalizationManager.php';

/**
 * EmbedPress Asset Manager
 *
 * Centralized asset management for JS/CSS files across blocks, Elementor, admin, and frontend
 * Handles both new build files and legacy assets
 */
class AssetManager
{
    /**
     * Asset definitions with context-based loading
     * Handler names match legacy system for compatibility
     */
    private static $assets = [
        // New build files - using consistent naming
        'blocks-js' => [
            'file' => 'js/blocks.build.js',
            'deps' => ['wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n'],
            'contexts' => ['editor', 'frontend'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress_blocks-cgb-block-js', // Match legacy Gutenberg handle
            'priority' => 10
        ],
        'blocks-style' => [
            'file' => 'css/blocks.style.build.css',
            'deps' => [],
            'contexts' => ['editor', 'frontend'],
            'type' => 'style',
            'handle' => 'embedpress_blocks-cgb-style-css', // Match legacy Gutenberg handle
            'priority' => 10
        ],
        'blocks-editor' => [
            'file' => 'css/blocks.editor.build.css',
            'deps' => ['wp-edit-blocks'],
            'contexts' => ['editor'],
            'type' => 'style',
            'handle' => 'embedpress_blocks-cgb-editor-css', // Match legacy Gutenberg handle
            'priority' => 10
        ],
        'admin-js' => [
            'file' => 'js/admin.build.js',
            'deps' => ['wp-element', 'wp-components', 'wp-i18n'],
            'contexts' => ['admin'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-admin-js',
            'priority' => 10
        ],
        'admin-css' => [
            'file' => 'css/admin.build.css',
            'deps' => [],
            'contexts' => ['admin'],
            'type' => 'style',
            'handle' => 'embedpress-admin',
            'priority' => 10
        ],
        'frontend-js' => [
            'file' => 'js/frontend.build.js',
            'deps' => ['jquery'],
            'contexts' => ['frontend'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-front',
            'priority' => 10
        ],
        'components-css' => [
            'file' => 'css/components.build.css',
            'deps' => [],
            'contexts' => ['admin', 'editor'],
            'type' => 'style',
            'handle' => 'embedpress-components',
            'priority' => 5 // Load early for base components
        ],

        // Legacy assets - using exact legacy handler names for compatibility
        'embedpress-style' => [
            'file' => 'css/embedpress.css',
            'deps' => [],
            'contexts' => ['editor', 'frontend', 'elementor'],
            'type' => 'style',
            // 'conditional' => true,
            'static' => true,
            'handle' => 'embedpress-style', // Exact legacy handle
            'priority' => 5, // Load early as base styles
            'media' => 'all'
        ],
        'plyr-css' => [
            'file' => 'css/plyr.css',
            'deps' => [],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'style',
            // 'conditional' => 'custom_player',
            'static' => true,
            'handle' => 'plyr', // Exact legacy handle
            'priority' => 15,
            'media' => 'all'
        ],
        'plyr-js' => [
            'file' => 'js/plyr.polyfilled.js',
            'deps' => [],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'script',
            // 'conditional' => 'custom_player',
            'footer' => true,
            'static' => true,
            'handle' => 'plyr.polyfilled', // Exact legacy handle
            'priority' => 15
        ],
        'plyr-init' => [
            'file' => 'js/initplyr.js',
            'deps' => ['plyr.polyfilled'],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'script',
            // 'conditional' => 'custom_player',
            'footer' => true,
            'static' => true,
            'handle' => 'initplyr', // Exact legacy handle
            'priority' => 20
        ],
        'carousel-css' => [
            'file' => 'css/carousel.min.css',
            'deps' => [],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'style',
            // // 'conditional' => 'carousel',
            'static' => true,
            'handle' => 'cg-carousel', // Exact legacy handle
            'priority' => 15,
            'media' => 'all'
        ],
        'carousel-js' => [
            'file' => 'js/carousel.min.js',
            'deps' => ['jquery'],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'script',
            // // 'conditional' => 'carousel',
            'footer' => true,
            'static' => true,
            'handle' => 'cg-carousel', // Exact legacy handle for JS
            'priority' => 15
        ],
        'carousel-init' => [
            'file' => 'js/initCarousel.js',
            'deps' => ['jquery', 'cg-carousel'],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'script',
            // // 'conditional' => 'carousel',
            'footer' => true,
            'static' => true,
            'handle' => 'init-carousel', // Exact legacy handle
            'priority' => 20
        ],
        'elementor-css' => [
            'file' => 'css/embedpress-elementor.css',
            'deps' => ['embedpress-style'],
            'contexts' => ['elementor'],
            'type' => 'style',
            'static' => true,
            'handle' => 'embedpress-elementor-css',
            'priority' => 10,
            'media' => 'all'
        ],
        'pdfobject' => [
            'file' => 'js/pdfobject.js',
            'deps' => [],
            'contexts' => ['frontend', 'editor', 'elementor'],
            'type' => 'script',
            // 'conditional' => 'pdf',
            'footer' => true,
            'static' => true,
            'handle' => 'embedpress-pdfobject', // Exact legacy handle
            'priority' => 10
        ],
        'vimeo-player' => [
            'file' => 'js/vimeo-player.js',
            'deps' => ['jquery'],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'script',
            // 'conditional' => 'custom_player',
            'footer' => true,
            'static' => true,
            'handle' => 'vimeo-player', // Exact legacy handle
            'priority' => 15
        ],
        'license-js' => [
            'file' => 'js/license.js',
            'deps' => ['jquery', 'wp-i18n', 'wp-url'],
            'contexts' => ['admin'],
            'type' => 'script',
            'footer' => true,
            'static' => true,
            'handle' => 'embedpress-lisence', // Exact legacy handle (with typo)
            'priority' => 10
        ],
        'gutenberg-script' => [
            'file' => 'js/gutneberg-script.js',
            'deps' => ['wp-data'],
            'contexts' => ['editor'],
            'type' => 'script',
            'footer' => false,
            'static' => true,
            'handle' => 'gutenberg-general', // Exact legacy handle
            'priority' => 10
        ],
        'documents-viewer' => [
            'file' => 'js/documents-viewer-script.js',
            'deps' => ['jquery'],
            'contexts' => ['frontend', 'editor'],
            'type' => 'script',
            'footer' => true,
            'static' => true,
            'handle' => 'embedpress_documents_viewer_script', // Exact legacy handle
            'priority' => 10
        ],
        'ads-js' => [
            'file' => 'js/ads.js',
            'deps' => ['jquery', 'wp-data'],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'script',
            // 'conditional' => 'ads',
            'footer' => true,
            'static' => true,
            'handle' => 'embedpress-ads', // Exact legacy handle
            'priority' => 15
        ],
        'bootstrap-js' => [
            'file' => 'js/vendor/bootstrap/bootstrap.min.js',
            'deps' => ['jquery'],
            'contexts' => ['admin'],
            'type' => 'script',
            'footer' => false,
            'static' => true,
            'handle' => 'bootbox-bootstrap', // Exact legacy handle
            'priority' => 5
        ],
        'bootbox-js' => [
            'file' => 'js/vendor/bootbox.min.js',
            'deps' => ['jquery', 'bootbox-bootstrap'],
            'contexts' => ['admin'],
            'type' => 'script',
            'footer' => true,
            'static' => true,
            'handle' => 'bootbox', // Exact legacy handle
            'priority' => 6
        ],
        'preview-js' => [
            'file' => 'js/preview.js',
            'deps' => ['jquery', 'bootbox'],
            'contexts' => ['admin'],
            'type' => 'script',
            'footer' => true,
            'static' => true,
            'handle' => 'embedpress', // Exact legacy handle
            'priority' => 7
        ],
        'embed-ui' => [
            'file' => 'js/embed-ui.min.js',
            'deps' => ['jquery'],
            'contexts' => ['frontend', 'admin'],
            'type' => 'script',
            'footer' => true,
            'static' => true,
            'handle' => 'embedpress-google-photos-album', // Exact legacy handle
            'priority' => 15
        ],
        'gallery-justify' => [
            'file' => 'js/gallery-justify.js',
            'deps' => ['jquery', 'embedpress-google-photos-album'],
            'contexts' => ['editor', 'frontend', 'elementor'],
            'type' => 'script',
            'footer' => true,
            'static' => true,
            'handle' => 'embedpress-google-photos-gallery-justify', // Exact legacy handle
            'priority' => 16
        ],
        'admin-js-static' => [
            'file' => 'js/admin.js',
            'deps' => ['jquery', 'wp-i18n', 'wp-url'],
            'contexts' => ['admin'],
            'type' => 'script',
            'footer' => true,
            'static' => true,
            'handle' => 'embedpress-admin', // Exact legacy handle
            'priority' => 10
        ],
        'settings-js' => [
            'file' => 'js/settings.js',
            'deps' => ['jquery', 'wp-color-picker'],
            'contexts' => ['admin'],
            'type' => 'script',
            'footer' => true,
            'static' => true,
            'handle' => 'ep-settings', // Exact legacy handle
            'priority' => 10
        ],
        'settings-script' => [
            'file' => 'EmbedPress/Ends/Back/Settings/assets/js/settings.js',
            'deps' => ['jquery', 'wp-color-picker'],
            'contexts' => ['admin'],
            'type' => 'script',
            'footer' => true,
            'static' => false, // This is in the plugin directory, not static
            'handle' => 'ep-settings-script', // Exact legacy handle
            'priority' => 10,
            'admin_page' => 'embedpress' // Only load on EmbedPress admin pages
        ],
        'settings-style' => [
            'file' => 'EmbedPress/Ends/Back/Settings/assets/css/style.css',
            'deps' => [],
            'contexts' => ['admin'],
            'type' => 'style',
            'static' => false, // This is in the plugin directory, not static
            'handle' => 'ep-settings-style', // Exact legacy handle
            'priority' => 10,
            'media' => 'all',
            'admin_page' => 'embedpress' // Only load on EmbedPress admin pages
        ],
        'settings-icon-style' => [
            'file' => 'EmbedPress/Ends/Back/Settings/assets/css/icon/style.css',
            'deps' => [],
            'contexts' => ['admin'],
            'type' => 'style',
            'static' => false, // This is in the plugin directory, not static
            'handle' => 'ep-settings-icon-style', // Exact legacy handle
            'priority' => 10,
            'media' => 'all',
            'admin_page' => 'embedpress' // Only load on EmbedPress admin pages
        ],


        'admin-style' => [
            'file' => 'css/admin.css',
            'deps' => [],
            'contexts' => ['admin'],
            'type' => 'style',
            'static' => true,
            'handle' => 'embedpress-admin', // Exact legacy handle
            'priority' => 10,
            'media' => 'all'
        ],
        'elementor-style' => [
            'file' => 'css/embedpress-elementor.css',
            'deps' => [],
            'contexts' => ['elementor'],
            'type' => 'style',
            'static' => true,
            'handle' => 'embedpress-elementor', // Exact legacy handle
            'priority' => 10,
            'media' => 'all'
        ],
        'el-icon-style' => [
            'file' => 'css/el-icon.css',
            'deps' => [],
            'contexts' => ['admin', 'elementor'],
            'type' => 'style',
            'static' => true,
            'handle' => 'el-icon', // Exact legacy handle
            'priority' => 10,
            'media' => 'all'
        ],
        'preview-style' => [
            'file' => 'css/preview.css',
            'deps' => [],
            'contexts' => ['admin'],
            'type' => 'style',
            'static' => true,
            'handle' => 'embedpress-preview', // Exact legacy handle
            'priority' => 10,
            'media' => 'all'
        ],

        // Static JavaScript Assets (from /static/ folder)
        'frontend-static-js' => [
            'file' => 'js/front.js',
            'deps' => ['jquery'],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'script',
            'footer' => true,
            'static' => true,
            'handle' => 'embedpress-front-legacy', // Different handle for legacy front.js
            'priority' => 10
        ],


        // PDF Flip Book Assets (from /static/pdf-flip-book/ folder)
        'html2canvas' => [
            'file' => 'pdf-flip-book/js/html2canvas.min.js',
            'deps' => ['jquery'],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'script',
            // 'conditional' => 'pdf',
            'footer' => true,
            'static' => true,
            'handle' => 'html2canvass', // Exact legacy handle (with typo)
            'priority' => 10
        ],
        'three-js' => [
            'file' => 'pdf-flip-book/js/three.min.js',
            'deps' => ['jquery'],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'script',
            // 'conditional' => 'pdf',
            'footer' => true,
            'static' => true,
            'handle' => 'threes', // Exact legacy handle
            'priority' => 11
        ],
        'pdf-js' => [
            'file' => 'pdf-flip-book/js/pdf.min.js',
            'deps' => ['jquery'],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'script',
            // 'conditional' => 'pdf',
            'footer' => true,
            'static' => true,
            'handle' => 'pdfs', // Exact legacy handle
            'priority' => 12
        ],
        '3dflipbook-js' => [
            'file' => 'pdf-flip-book/js/3dflipbook.min.js',
            'deps' => ['jquery'],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'script',
            // 'conditional' => 'pdf',
            'footer' => true,
            'static' => true,
            'handle' => '3dflipbooks', // Exact legacy handle
            'priority' => 13
        ],
        'pdf-flip-book-js' => [
            'file' => 'pdf-flip-book/js/pdf-flip-book.js',
            'deps' => ['jquery'],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'script',
            // 'conditional' => 'pdf',
            'footer' => true,
            'static' => true,
            'handle' => 'embedpress-pdf-flip-book', // Exact legacy handle
            'priority' => 14
        ],
        '3dflipbook-style' => [
            'file' => 'pdf-flip-book/css/3dflipbook.min.css',
            'deps' => [],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'style',
            // 'conditional' => 'pdf',
            'static' => true,
            'handle' => '3dflipbooks', // Exact legacy handle
            'priority' => 10,
            'media' => 'all'
        ],
        'pdf-flip-book-style' => [
            'file' => 'pdf-flip-book/css/pdf-flip-book.css',
            'deps' => [],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'style',
            // 'conditional' => 'pdf',
            'static' => true,
            'handle' => 'embedpress-pdf-flip-book', // Exact legacy handle
            'priority' => 11,
            'media' => 'all'
        ],

        // Additional static assets that were being enqueued
        'instafeed' => [
            'file' => 'js/instafeed.js',
            'deps' => ['jquery'],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'script',
            // 'conditional' => 'carousel',
            'footer' => true,
            'static' => true,
            'handle' => 'instafeed', // Exact legacy handle
            'priority' => 10
        ],
        'glider-js' => [
            'file' => 'js/glider.min.js',
            'deps' => ['jquery'],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'script',
            'footer' => true,
            'static' => true,
            'handle' => 'glider', // Exact legacy handle
            'priority' => 10
        ],
        'glider-style' => [
            'file' => 'css/glider.min.css',
            'deps' => [],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'style',
            'static' => true,
            'handle' => 'glider-css', // Exact legacy handle
            'priority' => 10,
            'media' => 'all'
        ],
        'ytiframeapi' => [
            'file' => 'js/ytiframeapi.js',
            'deps' => ['jquery'],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'script',
            'footer' => true,
            'static' => true,
            'handle' => 'ytiframeapi', // Exact legacy handle
            'priority' => 10
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
        add_action('wp_enqueue_scripts', [__CLASS__, 'prevent_legacy_conflicts'], 1);
        add_action('admin_enqueue_scripts', [__CLASS__, 'prevent_legacy_conflicts'], 1);

        // Add debug info for admin users
        if (defined('WP_DEBUG') && WP_DEBUG && current_user_can('manage_options')) {
            add_action('wp_footer', [__CLASS__, 'debug_asset_info'], 999);
            add_action('admin_footer', [__CLASS__, 'debug_asset_info'], 999);
        }
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
    public static function enqueue_admin_assets($hook)
    {
        // Load general admin assets on all admin pages
        foreach (self::$assets as $handle => $asset) {
            if (in_array('admin', $asset['contexts']) && !isset($asset['admin_page'])) {
                self::enqueue_asset($handle);
            }
        }

        // Load EmbedPress-specific admin assets only on EmbedPress pages
        if (strpos($hook, 'embedpress') !== false) {
            foreach (self::$assets as $handle => $asset) {
                if (in_array('admin', $asset['contexts']) &&
                    isset($asset['admin_page']) &&
                    $asset['admin_page'] === 'embedpress') {
                    self::enqueue_asset($handle);
                }
            }
        }

        // Setup admin localization scripts
        LocalizationManager::setup_admin_localization($hook);
    }

    /**
     * Enqueue block assets (both frontend and editor)
     */
    public static function enqueue_block_assets()
    {
        // Check if we have EmbedPress blocks on the page
        if (self::has_embedpress_blocks()) {
            self::enqueue_asset('blocks-style');
            self::enqueue_asset('frontend-js');

            // Conditionally load legacy assets based on block content
            self::enqueue_conditional_assets();
        }
    }

    /**
     * Enqueue editor-only assets
     */
    public static function enqueue_editor_assets()
    {
        self::enqueue_assets_for_context('editor');

        // Ensure localization scripts are properly attached
        LocalizationManager::setup_editor_localization();
    }

    /**
     * Enqueue Elementor frontend assets
     */
    public static function enqueue_elementor_assets()
    {
        if (self::has_elementor_embedpress_widgets()) {
            self::enqueue_assets_for_context('elementor');

            // Setup Elementor widget localization
            LocalizationManager::setup_elementor_localization();
        }
    }

    /**
     * Enqueue Elementor editor assets
     */
    public static function enqueue_elementor_editor_assets()
    {
        self::enqueue_asset('elementor-css');
        self::enqueue_asset('components-css');
    }

    /**
     * Enqueue assets for a specific context with proper priority ordering
     */
    private static function enqueue_assets_for_context($context)
    {
        // Collect assets for this context
        $context_assets = [];
        foreach (self::$assets as $handle => $asset) {
            if (in_array($context, $asset['contexts'])) {
                $context_assets[$handle] = $asset;
            }
        }

        // Sort by priority (lower numbers load first)
        uasort($context_assets, function($a, $b) {
            $priority_a = isset($a['priority']) ? $a['priority'] : 10;
            $priority_b = isset($b['priority']) ? $b['priority'] : 10;
            return $priority_a - $priority_b;
        });

        // Enqueue in priority order
        foreach ($context_assets as $handle => $asset) {
            self::enqueue_asset($handle);
        }
    }

    /**
     * Enqueue a single asset with proper handler names and priorities
     */
    private static function enqueue_asset($handle)
    {
        if (!isset(self::$assets[$handle])) {
            return false;
        }

        $asset = self::$assets[$handle];

        // Check conditional loading
        if (isset($asset['conditional']) && $asset['conditional'] !== true) {
            if (!self::should_load_conditional_asset($asset['conditional'])) {
                return false;
            }
        }

        // Determine if this is a static asset, build asset, or plugin directory asset
        $is_static = isset($asset['static']) && $asset['static'] === true;

        if ($is_static) {
            $file_path = EMBEDPRESS_PATH_STATIC . $asset['file'];
            $file_url = EMBEDPRESS_URL_STATIC . $asset['file'];
        } elseif (strpos($asset['file'], 'EmbedPress/') === 0) {
            // Plugin directory asset (like settings files)
            $file_path = EMBEDPRESS_PATH_BASE . $asset['file'];
            $file_url = plugins_url(EMBEDPRESS_PLG_NAME) . '/' . $asset['file'];
        } else {
            // Build asset
            $file_path = EMBEDPRESS_PATH_BASE . 'assets/' . $asset['file'];
            $file_url = EMBEDPRESS_URL_ASSETS . $asset['file'];
        }

        if (!file_exists($file_path)) {
            return false;
        }

        $version = filemtime($file_path);

        // Use custom handle if specified, otherwise use prefixed handle
        $enqueue_handle = isset($asset['handle']) ? $asset['handle'] : 'embedpress-' . $handle;

        // Prevent conflicts by deregistering existing assets with same handle
        if ($asset['type'] === 'script') {
            if (wp_script_is($enqueue_handle, 'registered')) {
                wp_deregister_script($enqueue_handle);
            }

            wp_register_script(
                $enqueue_handle,
                $file_url,
                $asset['deps'],
                $version,
                $asset['footer'] ?? false
            );

            wp_enqueue_script($enqueue_handle);
        } else {
            if (wp_style_is($enqueue_handle, 'registered')) {
                wp_deregister_style($enqueue_handle);
            }

            wp_register_style(
                $enqueue_handle,
                $file_url,
                $asset['deps'],
                $version,
                isset($asset['media']) ? $asset['media'] : 'all'
            );

            wp_enqueue_style($enqueue_handle);
        }

        return true;
    }

    /**
     * Prevent conflicts with legacy asset loading
     */
    public static function prevent_legacy_conflicts()
    {
        // List of legacy handles that might conflict
        $legacy_handles = [
            'embedpress-style',
            'plyr',
            'cg-carousel',
            'embedpress-pdfobject',
            'plyr.polyfilled',
            'initplyr',
            'vimeo-player',
            'init-carousel',
            'embedpress-lisence',
            'embedpress-front',
            'gutenberg-general',
            'embedpress_blocks-cgb-block-js',
            'embedpress_blocks-cgb-style-css',
            'embedpress_blocks-cgb-editor-css'
        ];

        // Only deregister if AssetManager is handling the assets
        $use_asset_manager = apply_filters('embedpress_use_asset_manager', true);

        if ($use_asset_manager) {
            foreach ($legacy_handles as $handle) {
                // Deregister scripts
                if (wp_script_is($handle, 'registered') && !wp_script_is($handle, 'enqueued')) {
                    wp_deregister_script($handle);
                }

                // Deregister styles
                if (wp_style_is($handle, 'registered') && !wp_style_is($handle, 'enqueued')) {
                    wp_deregister_style($handle);
                }
            }
        }
    }

    /**
     * Check if conditional asset should be loaded
     */
    private static function should_load_conditional_asset($condition)
    {
        $enabled_features = get_option('enabled_elementor_scripts', []);

        switch ($condition) {
            case 'custom_player':
                return isset($enabled_features['enabled_custom_player']) &&
                    $enabled_features['enabled_custom_player'] === 'yes';
            case 'carousel':
                return isset($enabled_features['enabled_instafeed']) &&
                    $enabled_features['enabled_instafeed'] === 'yes';
            case 'pdf':
                return self::has_pdf_content();
            case 'ads':
                return isset($enabled_features['enabled_ads']) &&
                    $enabled_features['enabled_ads'] === 'yes';
            default:
                return true;
        }
    }

    /**
     * Check if page has PDF content
     */
    private static function has_pdf_content()
    {
        global $post;

        if (!$post) {
            return false;
        }

        // Check for PDF blocks or shortcodes
        if (has_blocks($post->post_content)) {
            $blocks = parse_blocks($post->post_content);
            foreach ($blocks as $block) {
                if (in_array($block['blockName'], ['embedpress/pdf', 'embedpress/document'])) {
                    return true;
                }
            }
        }

        // Check for PDF shortcodes
        if (strpos($post->post_content, '[embedpress_pdf') !== false ||
            strpos($post->post_content, '[embedpress') !== false) {
            return true;
        }

        return false;
    }

    /**
     * Check if page has EmbedPress blocks
     */
    private static function has_embedpress_blocks()
    {
        global $post;

        if (!$post || !has_blocks($post->post_content)) {
            return false;
        }

        return has_block('embedpress/embedpress', $post);
    }

    /**
     * Check if page has Elementor EmbedPress widgets
     */
    private static function has_elementor_embedpress_widgets()
    {
        if (!class_exists('\Elementor\Plugin')) {
            return false;
        }

        global $post;
        if (!$post) {
            return false;
        }

        $elementor_data = get_post_meta($post->ID, '_elementor_data', true);
        if (empty($elementor_data)) {
            return false;
        }

        return strpos($elementor_data, 'embedpress') !== false;
    }



    /**
     * Enqueue conditional assets based on content with proper dependency order
     */
    private static function enqueue_conditional_assets()
    {
        global $post;

        if (!$post) {
            return;
        }

        $content = $post->post_content;

        // Always load base styles first
        self::enqueue_asset('embedpress-style');

        // Check for video content and load in dependency order
        if (preg_match('/youtube|vimeo|video/i', $content)) {
            self::enqueue_asset('plyr-css');
            self::enqueue_asset('plyr-js');
            self::enqueue_asset('plyr-init');
            self::enqueue_asset('vimeo-player');
        }

        // Check for carousel content and load in dependency order
        if (preg_match('/instagram|carousel/i', $content)) {
            self::enqueue_asset('carousel-css');
            self::enqueue_asset('carousel-js');
            self::enqueue_asset('carousel-init');
        }

        // Check for PDF content
        if (self::has_pdf_content()) {
            self::enqueue_asset('pdfobject');
        }
    }

    /**
     * Get asset URL for external use
     */
    public static function get_asset_url($handle)
    {
        if (!isset(self::$assets[$handle])) {
            return false;
        }

        $asset = self::$assets[$handle];
        $is_static = isset($asset['static']) && $asset['static'] === true;

        if ($is_static) {
            return EMBEDPRESS_URL_STATIC . $asset['file'];
        } elseif (strpos($asset['file'], 'EmbedPress/') === 0) {
            // Plugin directory asset (like settings files)
            return plugins_url(EMBEDPRESS_PLG_NAME) . '/' . $asset['file'];
        } else {
            return EMBEDPRESS_URL_ASSETS . $asset['file'];
        }
    }

    /**
     * Check if asset exists
     */
    public static function asset_exists($handle)
    {
        if (!isset(self::$assets[$handle])) {
            return false;
        }

        $asset = self::$assets[$handle];
        $is_static = isset($asset['static']) && $asset['static'] === true;

        if ($is_static) {
            $file_path = EMBEDPRESS_PATH_STATIC . $asset['file'];
        } elseif (strpos($asset['file'], 'EmbedPress/') === 0) {
            // Plugin directory asset (like settings files)
            $file_path = EMBEDPRESS_PATH_BASE . $asset['file'];
        } else {
            $file_path = EMBEDPRESS_PATH_BASE . 'assets/' . $asset['file'];
        }

        return file_exists($file_path);
    }

    /**
     * Get all registered asset handles for debugging
     */
    public static function get_registered_handles()
    {
        $handles = [];
        foreach (self::$assets as $handle => $asset) {
            $enqueue_handle = isset($asset['handle']) ? $asset['handle'] : 'embedpress-' . $handle;
            $handles[$handle] = [
                'enqueue_handle' => $enqueue_handle,
                'type' => $asset['type'],
                'contexts' => $asset['contexts'],
                'priority' => isset($asset['priority']) ? $asset['priority'] : 10,
                'exists' => self::asset_exists($handle)
            ];
        }
        return $handles;
    }

    /**
     * Force enqueue specific asset (for debugging)
     */
    public static function force_enqueue($handle)
    {
        if (!isset(self::$assets[$handle])) {
            return false;
        }

        // Temporarily disable conditional checks
        $asset = self::$assets[$handle];
        $original_conditional = isset($asset['conditional']) ? $asset['conditional'] : null;
        self::$assets[$handle]['conditional'] = true;

        $result = self::enqueue_asset($handle);

        // Restore original conditional setting
        if ($original_conditional !== null) {
            self::$assets[$handle]['conditional'] = $original_conditional;
        } else {
            unset(self::$assets[$handle]['conditional']);
        }

        return $result;
    }

    /**
     * Get asset loading order for a context
     */
    public static function get_loading_order($context)
    {
        $context_assets = [];
        foreach (self::$assets as $handle => $asset) {
            if (in_array($context, $asset['contexts'])) {
                $context_assets[$handle] = isset($asset['priority']) ? $asset['priority'] : 10;
            }
        }

        asort($context_assets);
        return array_keys($context_assets);
    }

    /**
     * Debug asset information (only for admin users with WP_DEBUG enabled)
     */
    public static function debug_asset_info()
    {
        if (!current_user_can('manage_options') || !defined('WP_DEBUG') || !WP_DEBUG) {
            return;
        }

        global $wp_scripts, $wp_styles;

        $embedpress_scripts = [];
        $embedpress_styles = [];

        // Find all EmbedPress-related enqueued assets
        if (isset($wp_scripts->queue)) {
            foreach ($wp_scripts->queue as $handle) {
                if (strpos($handle, 'embedpress') !== false ||
                    strpos($handle, 'plyr') !== false ||
                    strpos($handle, 'cg-carousel') !== false) {
                    $embedpress_scripts[] = $handle;
                }
            }
        }

        if (isset($wp_styles->queue)) {
            foreach ($wp_styles->queue as $handle) {
                if (strpos($handle, 'embedpress') !== false ||
                    strpos($handle, 'plyr') !== false ||
                    strpos($handle, 'cg-carousel') !== false) {
                    $embedpress_styles[] = $handle;
                }
            }
        }

        if (!empty($embedpress_scripts) || !empty($embedpress_styles)) {
            echo '<!-- EmbedPress AssetManager Debug Info -->';
            echo '<script>console.log("EmbedPress Scripts:", ' . json_encode($embedpress_scripts) . ');</script>';
            echo '<script>console.log("EmbedPress Styles:", ' . json_encode($embedpress_styles) . ');</script>';
            echo '<script>console.log("AssetManager Handles:", ' . json_encode(self::get_registered_handles()) . ');</script>';

            // Debug localization variables
            echo '<script>';
            echo 'console.log("Checking localization variables...");';
            echo 'if (typeof $data !== "undefined") { console.log("$data is defined:", $data); } else { console.log("$data is NOT defined"); }';
            echo 'if (typeof embedpressObj !== "undefined") { console.log("embedpressObj is defined:", embedpressObj); } else { console.log("embedpressObj is NOT defined"); }';
            echo 'console.log("Localization Status:", ' . json_encode(LocalizationManager::debug_localization_status()) . ');';
            echo '</script>';
        }
    }

}
