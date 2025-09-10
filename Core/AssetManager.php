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
     * Track which handles should be treated as ES modules
     */
    private static $module_handles = [];

    /**
     * Track if the global module filter has been added
     */
    private static $module_filter_added = false;

    /**
     * Asset definitions with context-based loading
     */
    private static $assets = [

        // 🔧 Scripts (Ordered by Priority)
        // ----------------------------------

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
            'file' => 'js/vendor/plyr.js',
            'deps' => ['jquery'],
            'contexts' => ['frontend', 'elementor', 'editor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-plyr',
            'priority' => 2,
        ],
        'plyr-polyfilled-js' => [
            'file' => 'js/vendor/plyr.polyfilled.js',
            'deps' => ['jquery'],
            'contexts' => ['frontend', 'elementor', 'editor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-plyr-polyfilled',
            'priority' => 2,
        ],
        'carousel-vendor-js' => [
            'file' => 'js/vendor/carousel.min.js',
            'deps' => ['jquery'],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-carousel-vendor',
            'priority' => 2,
        ],
        'glider-js' => [
            'file' => 'js/vendor/glider.min.js',
            'deps' => ['jquery'],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-glider',
            'priority' => 2,
        ],
        'pdfobject-js' => [
            'file' => 'js/vendor/pdfobject.js',
            'deps' => [],
            'contexts' => ['frontend', 'elementor', 'editor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-pdfobject',
            'priority' => 2,
        ],
        'vimeo-player-js' => [
            'file' => 'js/vendor/vimeo-player.js',
            'deps' => [],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-vimeo-player',
            'priority' => 2,
        ],
        'ytiframeapi-js' => [
            'file' => 'js/vendor/ytiframeapi.js',
            'deps' => [],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-ytiframeapi',
            'priority' => 2,
        ],
        'bootstrap-js' => [
            'file' => 'js/vendor/bootstrap/bootstrap.min.js',
            'deps' => ['jquery'],
            'contexts' => ['admin'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-bootstrap',
            'priority' => 2,
            'page' => 'embedpress'
        ],
        'bootbox-js' => [
            'file' => 'js/vendor/bootbox.min.js',
            'deps' => ['jquery', 'embedpress-bootstrap'],
            'contexts' => ['admin'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-bootbox',
            'priority' => 3,
            'page' => 'embedpress'
        ],
        // Priority 5-6: Main application build assets
        'admin-js' => [
            'file' => 'js/admin.build.js',
            'deps' => [],
            'contexts' => ['admin'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-admin',
            'priority' => 5,
            'page' => 'embedpress'
        ],
        // Priority 7-10: Blocks
        'blocks-js' => [
            'file' => 'js/blocks.build.js',
            'deps' => ['wp-blocks', 'wp-i18n', 'wp-element', 'wp-api-fetch', 'wp-is-shallow-equal', 'wp-editor', 'wp-components'],
            'contexts' => ['editor', 'frontend'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-blocks-editor',
            'priority' => 10,
        ],
        'blocks-editor-style' => [
            'file' => 'css/blocks.build.css',
            'deps' => [],
            'contexts' => ['editor'],
            'type' => 'style',
            'handle' => 'embedpress-blocks-editor-style',
            'priority' => 10,
        ],
        'blocks-style' => [
            'file' => 'css/blocks.build.css',
            'deps' => [],
            'contexts' => ['frontend', 'editor'],
            'type' => 'style',
            'handle' => 'embedpress-blocks-style',
            'priority' => 10,
        ],

        // Priority 15-20: Legacy JS files
        'admin-legacy-js' => [
            'file' => 'js/admin.js',
            'deps' => ['jquery'],
            'contexts' => ['admin'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-admin-legacy',
            'priority' => 15,
            'page' => 'embedpress'
        ],
        'ads-js' => [
            'file' => 'js/sponsored.js',
            'deps' => ['jquery', 'embedpress-front'],
            'contexts' => ['editor', 'frontend', 'elementor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-ads',
            'priority' => 16,
        ],
        'analytics-tracker-js' => [
            'file' => 'js/analytics-tracker.js',
            'deps' => ['jquery'],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-analytics-tracker',
            'priority' => 15,
        ],
        'carousel-js' => [
            'file' => 'js/carousel.js',
            'deps' => ['jquery', 'embedpress-carousel-vendor'],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-carousel',
            'priority' => 15,
        ],
        'documents-viewer-js' => [
            'file' => 'js/documents-viewer-script.js',
            'deps' => ['jquery'],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-documents-viewer',
            'priority' => 15,
        ],
        'front-js' => [
            'file' => 'js/front.js',
            'deps' => ['jquery'],
            'contexts' => ['frontend', 'editor', 'elementor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-front',
            'priority' => 15,
        ],
        'gallery-justify-js' => [
            'file' => 'js/gallery-justify.js',
            'deps' => ['jquery'],
            'contexts' => ['editor', 'frontend', 'elementor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-gallery-justify',
            'priority' => 15,
        ],
        'gutenberg-script-js' => [
            'file' => 'js/gutneberg-script.js',
            'deps' => ['wp-blocks', 'wp-element'],
            'contexts' => ['editor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-gutenberg-script',
            'priority' => 15,
        ],
        'init-plyr-js' => [
            'file' => 'js/initplyr.js',
            'deps' => ['jquery', 'embedpress-plyr'],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-init-plyr',
            'priority' => 15,
        ],
        'instafeed-js' => [
            'file' => 'js/instafeed.js',
            'deps' => ['jquery'],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-instafeed',
            'priority' => 15,
        ],
        'license-js' => [
            'file' => 'js/license.js',
            'deps' => ['jquery'],
            'contexts' => ['admin'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-license',
            'priority' => 15,
            'page' => 'embedpress'
        ],
        'preview-js' => [
            'file' => 'js/preview.js',
            'deps' => ['jquery'],
            'contexts' => ['admin'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-preview',
            'priority' => 15,
            'page' => 'embedpress'
        ],
        'settings-js' => [
            'file' => 'js/settings.js',
            'deps' => ['jquery', 'wp-color-picker'],
            'contexts' => ['admin'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-settings',
            'priority' => 15,
            'page' => 'embedpress'
        ],

        // 🎨 Styles (Ordered by Priority)
        // ----------------------------------

        // Build CSS files (analytics.build.css is handled by Analytics.php)

        // Legacy CSS files
        'admin-notices-css' => [
            'file' => 'css/admin-notices.css',
            'deps' => [],
            'contexts' => ['admin'],
            'type' => 'style',
            'handle' => 'embedpress-admin-notices',
            'priority' => 5,
            'page' => 'embedpress'
        ],

        'el-icon-css' => [
            'file' => 'css/el-icon.css',
            'deps' => [],
            'contexts' => ['admin', 'frontend', 'elementor'],
            'type' => 'style',
            'handle' => 'embedpress-el-icon',
            'priority' => 5,
        ],
        'embedpress-elementor-css' => [
            'file' => 'css/embedpress-elementor.css',
            'deps' => [],
            'contexts' => ['elementor'],
            'type' => 'style',
            'handle' => 'embedpress-elementor-css',
            'priority' => 5,
        ],
        'embedpress-css' => [
            'file' => 'css/embedpress.css',
            'deps' => [],
            'contexts' => ['editor', 'frontend', 'elementor'],
            'type' => 'style',
            'handle' => 'embedpress-css',
            'priority' => 5,
        ],
        'font-css' => [
            'file' => 'css/font.css',
            'deps' => [],
            'contexts' => ['admin', 'frontend', 'elementor'],
            'type' => 'style',
            'handle' => 'embedpress-font',
            'priority' => 5,
        ],
        'preview-css' => [
            'file' => 'css/preview.css',
            'deps' => [],
            'contexts' => ['admin'],
            'type' => 'style',
            'handle' => 'embedpress-preview-css',
            'priority' => 5,
            'page' => 'embedpress'
        ],
        'settings-icons-css' => [
            'file' => 'css/settings-icons.css',
            'deps' => [],
            'contexts' => ['admin'],
            'type' => 'style',
            'handle' => 'embedpress-settings-icons',
            'priority' => 5,
            'page' => 'embedpress'
        ],
        'settings-css' => [
            'file' => 'css/settings.css',
            'deps' => [],
            'contexts' => ['admin'],
            'type' => 'style',
            'handle' => 'embedpress-settings-css',
            'priority' => 5,
            'page' => 'embedpress'
        ],
        'admin-css' => [
            'file' => 'css/admin.css',
            'deps' => [],
            'contexts' => ['admin'],
            'type' => 'style',
            'handle' => 'embedpress-admin-css',
            'priority' => 5,
            'page' => 'embedpress'
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
        // In Elementor editor, we need both elementor and editor context assets
        self::enqueue_assets_for_context('elementor');
        self::enqueue_assets_for_context('editor');

        // Setup Elementor editor localization
        LocalizationManager::setup_elementor_localization();
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
        $file_url  = EMBEDPRESS_PLUGIN_DIR_URL . 'assets/' . $asset['file'];
        $file_path = EMBEDPRESS_PLUGIN_DIR_PATH . '/assets/' . $asset['file'];

        if (! file_exists($file_path)) {
            return;
        }

        $version = filemtime($file_path);

        // Check if we should load this asset based on current context
        if (!self::should_load_asset($asset)) {
            return;
        }

        // Enqueue asset
        if ($asset['type'] === 'script') {
            wp_enqueue_script(
                $asset['handle'],
                $file_url,
                $asset['deps'],
                $version,
                ! empty($asset['footer'])
            );

            // Add module attribute for ES modules (only build files)
            if (strpos($asset['file'], '.build.js') !== false) {
                // Track this handle as a module
                self::$module_handles[] = $asset['handle'];

                // Add the global filter only once
                if (!self::$module_filter_added) {
                    self::$module_filter_added = true;
                    add_filter('script_loader_tag', [__CLASS__, 'add_module_attribute'], 10, 2);
                }
            }
        } elseif ($asset['type'] === 'style') {

            wp_enqueue_style(
                $asset['handle'],
                $file_url,
                $asset['deps'],
                $version,
                $asset['media'] ?? 'all'
            );
        }
    }

    /**
     * Determine if an asset should be loaded based on current context
     */
    private static function should_load_asset($asset)
    {
        // Get current environment state
        $is_admin = is_admin();
        $is_elementor_editor = false;
        $is_elementor_preview = false;
        $is_gutenberg_editor = false;

        // Check Elementor states
        if (class_exists('\Elementor\Plugin')) {
            $elementor = \Elementor\Plugin::$instance;

            if (isset($elementor->editor)) {
                $is_elementor_editor = $elementor->editor->is_edit_mode();
            }

            if (isset($elementor->preview)) {
                $is_elementor_preview = $elementor->preview->is_preview_mode();
            }
        }

        // Check if we're in Gutenberg editor
        if ($is_admin) {
            global $pagenow;
            $is_gutenberg_editor = (
                $pagenow === 'post.php' ||
                $pagenow === 'post-new.php' ||
                $pagenow === 'site-editor.php'
            ) && function_exists('use_block_editor_for_post_type');
        }

        // Asset loading logic based on contexts
        foreach ($asset['contexts'] as $context) {
            switch ($context) {
                case 'frontend':
                    // Load on frontend (not in any editor or admin)
                    if (!$is_admin && !$is_elementor_editor && !$is_elementor_preview) {
                        return true;
                    }
                    break;

                case 'admin':
                    // Load in WordPress admin (but not in Elementor editor)
                    if ($is_admin && !$is_elementor_editor && !$is_elementor_preview) {
                        // Check if asset has page restriction
                        if (isset($asset['page'])) {
                            return self::is_embedpress_admin_page($asset['page']);
                        }
                        return true;
                    }
                    break;

                case 'editor':
                    // Load in Gutenberg editor or when editing posts
                    if ($is_gutenberg_editor || ($is_admin && !$is_elementor_editor)) {
                        return true;
                    }
                    break;

                case 'elementor':
                    // Load in Elementor editor, preview, or frontend when Elementor is rendering
                    if ($is_elementor_editor || $is_elementor_preview) {
                        return true;
                    }
                    // Also load on frontend if Elementor content is present
                    if (!$is_admin && self::has_elementor_content()) {
                        return true;
                    }
                    break;

                case 'settings':
                    // Load only on EmbedPress settings pages
                    if ($is_admin && !$is_elementor_editor && !$is_elementor_preview) {
                        return true;
                    }
                    break;
            }
        }

        // Check if this is an individual block script and if it should be loaded
        if (strpos($asset['handle'], 'embedpress-block-') === 0) {
            return self::should_load_individual_block($asset['handle']);
        }

        return false;
    }

    /**
     * Check if we're on an EmbedPress admin page
     */
    private static function is_embedpress_admin_page($page_type)
    {
        global $pagenow;

        // Get current page
        $current_page = isset($_GET['page']) ? $_GET['page'] : '';

        switch ($page_type) {
            case 'embedpress':
                // Check if we're on any EmbedPress admin page
                return (
                    strpos($current_page, 'embedpress') !== false ||
                    $pagenow === 'admin.php' && strpos($current_page, 'embedpress') !== false
                );
            case 'embedpress-analytics':
                return $current_page === 'embedpress-analytics';
            default:
                return false;
        }
    }

    /**
     * Check if individual block should be loaded based on active blocks
     */
    private static function should_load_individual_block($handle)
    {
        // Get active blocks from settings
        $elements = (array) get_option(EMBEDPRESS_PLG_NAME . ":elements", []);
        $active_blocks = isset($elements['gutenberg']) ? (array) $elements['gutenberg'] : [];

        // Map handles to block names
        $block_map = [
            'embedpress-block-embedpress' => 'embedpress',
            'embedpress-block-document' => 'document',
            'embedpress-block-pdf' => 'embedpress-pdf',
            'embedpress-block-calendar' => 'embedpress-calendar',
            'embedpress-block-google-docs' => 'google-docs',
            'embedpress-block-google-drawings' => 'google-drawings',
            'embedpress-block-google-forms' => 'google-forms',
            'embedpress-block-google-maps' => 'google-maps',
            'embedpress-block-google-sheets' => 'google-sheets',
            'embedpress-block-google-slides' => 'google-slides',
            'embedpress-block-twitch' => 'twitch',
            'embedpress-block-wistia' => 'wistia',
            'embedpress-block-youtube' => 'youtube'
        ];

        $block_name = isset($block_map[$handle]) ? $block_map[$handle] : '';

        // If no block name found or no active blocks set, load all blocks (default behavior)
        if (empty($block_name) || empty($active_blocks)) {
            return true;
        }

        // Check if this specific block is active
        return in_array($block_name, $active_blocks);
    }

    /**
     * Check if current page has Elementor content
     */
    private static function has_elementor_content()
    {
        if (!class_exists('\Elementor\Plugin')) {
            return false;
        }

        // Check if we're on a singular post/page
        if (is_singular()) {
            $post_id = get_the_ID();
            return \Elementor\Plugin::$instance->documents->get($post_id)->is_built_with_elementor();
        }

        return false;
    }


    /**
     * Get asset URL
     */
    public static function get_asset_url($file)
    {
        return EMBEDPRESS_PLUGIN_DIR_URL . 'assets/' . $file;
    }



    /**
     * Add module attribute to script tags for ES modules
     */
    public static function add_module_attribute($tag, $handle)
    {
        if (in_array($handle, self::$module_handles)) {
            // Only add type="module" if it doesn't already exist
            if (strpos($tag, 'type="module"') === false) {
                return str_replace('<script ', '<script type="module" ', $tag);
            }
        }
        return $tag;
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
