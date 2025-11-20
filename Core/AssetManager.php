<?php

namespace EmbedPress\Core;

// Include LocalizationManager
// require_once __DIR__ . '/LocalizationManager.php';

use Embedpress\Core\LocalizationManager;
use EmbedPress\Includes\Classes\Helper;

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
     * Cache for content detection to avoid multiple checks
     */
    private static $has_embedpress_content = null;

    /**
     * Cache for custom player detection
     */
    private static $custom_player_enabled = null;

    /**
     * Cache for detected embed types on current page
     */
    private static $detected_embed_types = null;

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
            'condition' => 'custom_player', // Only load if custom player is enabled
            'providers' => ['youtube', 'vimeo', 'video', 'audio'], // Only for these providers
        ],
        'carousel-vendor-css' => [
            'file' => 'css/carousel.min.css',
            'deps' => [],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'style',
            'handle' => 'embedpress-carousel-vendor-css',
            'priority' => 1,
            'providers' => ['youtube-channel', 'youtube-live', 'instagram', 'opensea'], // Only for carousel-based embeds
        ],
        'glider-css' => [
            'file' => 'css/glider.min.css',
            'deps' => [],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'style',
            'handle' => 'embedpress-glider-css',
            'priority' => 1,
            'providers' => ['youtube-channel', 'youtube-live', 'instagram', 'opensea'], // Only for carousel-based embeds
        ],
        'plyr-js' => [
            'file' => 'js/vendor/plyr.js',
            'deps' => ['jquery'],
            'contexts' => ['frontend', 'elementor', 'editor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-plyr',
            'priority' => 2,
            'condition' => 'custom_player', // Only load if custom player is enabled
            'providers' => ['youtube', 'vimeo', 'video', 'audio'], // Only for these providers
        ],
        'carousel-vendor-js' => [
            'file' => 'js/vendor/carousel.min.js',
            'deps' => ['jquery'],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-carousel-vendor',
            'priority' => 2,
            'providers' => ['youtube-channel', 'youtube-live', 'instagram', 'opensea'], // Only for carousel-based embeds
        ],
        'glider-js' => [
            'file' => 'js/vendor/glider.min.js',
            'deps' => ['jquery'],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-glider',
            'priority' => 2,
            'providers' => ['youtube-channel', 'youtube-live', 'instagram', 'opensea'], // Only for carousel-based embeds
        ],
        'pdfobject-js' => [
            'file' => 'js/vendor/pdfobject.js',
            'deps' => [],
            'contexts' => ['frontend', 'elementor', 'editor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-pdfobject',
            'priority' => 2,
            'providers' => ['pdf', 'document'], // Only for PDF/document embeds
        ],
        'vimeo-player-js' => [
            'file' => 'js/vendor/vimeo-player.js',
            'deps' => [],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-vimeo-player',
            'priority' => 2,
            'providers' => ['vimeo'], // Only for Vimeo embeds
        ],
        'ytiframeapi-js' => [
            'file' => 'js/vendor/ytiframeapi.js',
            'deps' => [],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-ytiframeapi',
            'priority' => 2,
            'providers' => ['youtube', 'youtube-channel', 'youtube-live', 'youtube-shorts'], // Only for YouTube embeds
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
            'contexts' => ['editor'],
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
            'condition' => 'has_content', // Load for any EmbedPress content (ads can be on any embed)
        ],
        'analytics-tracker-js' => [
            'file' => 'js/analytics-tracker.js',
            'deps' => ['jquery'],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-analytics-tracker',
            'priority' => 15,
            'condition' => 'has_content', // Load for any EmbedPress content (analytics track all embeds)
        ],
        'carousel-js' => [
            'file' => 'js/carousel.js',
            'deps' => ['jquery', 'embedpress-carousel-vendor'],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-carousel',
            'priority' => 15,
            'providers' => ['youtube-channel', 'youtube-live', 'instagram', 'opensea'], // Only for carousel-based embeds
        ],
        'documents-viewer-js' => [
            'file' => 'js/documents-viewer-script.js',
            'deps' => ['jquery'],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-documents-viewer',
            'priority' => 15,
            'providers' => ['document', 'google-docs', 'google-sheets', 'google-slides'], // Only for document embeds
        ],
        'front-js' => [
            'file' => 'js/front.js',
            'deps' => ['jquery'],
            'contexts' => ['frontend', 'editor', 'elementor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-front',
            'priority' => 15,
            'condition' => 'has_content', // Core script - load for any EmbedPress content
        ],
        'gallery-justify-js' => [
            'file' => 'js/gallery-justify.js',
            'deps' => ['jquery'],
            'contexts' => ['editor', 'frontend', 'elementor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-gallery-justify',
            'priority' => 15,
            'providers' => ['google-photos', 'instagram'], // Only for gallery-based embeds
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
            'condition' => 'custom_player', // Only load if custom player is enabled
            'providers' => ['youtube', 'vimeo', 'video', 'audio'], // Only for these providers
        ],
        'instafeed-js' => [
            'file' => 'js/instafeed.js',
            'deps' => ['jquery'],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-instafeed',
            'priority' => 15,
            'providers' => ['instagram'], // Only for Instagram embeds
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
        'feature-notices-js' => [
            'file' => 'js/feature-notices.js',
            'deps' => ['jquery'],
            'contexts' => ['admin'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-feature-notices',
            'priority' => 15,
            // 'page' => 'embedpress'
        ],
        'preview-js' => [
            'file' => 'js/preview.js',
            'deps' => ['jquery'],
            'contexts' => ['classic_editor'],
            'type' => 'script',
            'footer' => true,
            'handle' => 'embedpress-preview',
            'priority' => 15,
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
            // 'page' => 'embedpress'
        ],
        'feature-notices-css' => [
            'file' => 'css/feature-notices.css',
            'deps' => [],
            'contexts' => ['admin'],
            'type' => 'style',
            'handle' => 'embedpress-feature-notices',
            'priority' => 5,
        ],

        'el-icon-css' => [
            'file' => 'css/el-icon.css',
            'deps' => [],
            'contexts' => ['elementor-editor'],
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
        'modal-css' => [
            'file' => 'css/modal.css',
            'deps' => [],
            'contexts' => ['editor', 'classic_editor'],
            'type' => 'style',
            'handle' => 'embedpress-classic-editor-modal',
            'priority' => 6,
        ],
        'meetup-events-css' => [
            'file' => 'css/meetup-events.css',
            'deps' => ['embedpress-css'],
            'contexts' => ['frontend', 'editor', 'elementor'],
            'type' => 'style',
            'handle' => 'embedpress-meetup-events',
            'providers' => ['meetup'], // Only for Meetup embeds
            'priority' => 6,
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
        // Register all assets early so they're available as dependencies for Elementor and other plugins
        add_action('wp_enqueue_scripts', [__CLASS__, 'register_all_assets'], 1);
        add_action('admin_enqueue_scripts', [__CLASS__, 'register_all_assets'], 1);

        // Use proper priorities to ensure correct load order
        add_action('wp_enqueue_scripts', [__CLASS__, 'enqueue_frontend_assets'], 5);
        add_action('admin_enqueue_scripts', [__CLASS__, 'enqueue_admin_assets'], 5);
        add_action('admin_enqueue_scripts', [__CLASS__, 'enqueue_classic_editor_assets'], 5);
        add_action('enqueue_block_assets', [__CLASS__, 'enqueue_block_assets'], 5);


        add_action('enqueue_block_editor_assets', [__CLASS__, 'enqueue_editor_assets'], 5);

        // Elementor preview (frontend iframe) - enqueue after scripts are enqueued
        add_action('elementor/frontend/after_enqueue_scripts', [__CLASS__, 'enqueue_elementor_assets'], 5);

        // In Elementor editor, WP_Scripts registry is reset; re-register our assets before enqueuing
        add_action('elementor/editor/before_enqueue_scripts', [__CLASS__, 'register_all_assets'], 1);
        // Elementor editor panel (admin) - enqueue after editor scripts are enqueued
        add_action('elementor/editor/after_enqueue_scripts', [__CLASS__, 'enqueue_elementor_editor_assets'], 5);
    }

    /**
     * Register all assets early so they're available as dependencies
     * This is crucial for Elementor widgets that declare script/style dependencies
     */
    public static function register_all_assets()
    {
        foreach (self::$assets as $key => $asset) {
            $file_url  = EMBEDPRESS_PLUGIN_DIR_URL . 'assets/' . $asset['file'];
            $file_path = EMBEDPRESS_PLUGIN_DIR_PATH . '/assets/' . $asset['file'];

            if (!file_exists($file_path)) {
                continue;
            }

            $version = filemtime($file_path);

            // Register (not enqueue) all assets
            if ($asset['type'] === 'script') {
                wp_register_script(
                    $asset['handle'],
                    $file_url,
                    $asset['deps'],
                    $version,
                    !empty($asset['footer'])
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
                wp_register_style(
                    $asset['handle'],
                    $file_url,
                    $asset['deps'],
                    $version,
                    $asset['media'] ?? 'all'
                );
            }
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

    public static function enqueue_classic_editor_assets()
    {

        // Ensure editor assets are loaded
        self::enqueue_assets_for_context('classic_editor');

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
        // In Elementor editor, load only elementor and elementor-editor contexts
        // Do NOT load 'editor' context - that's for Gutenberg only
        self::enqueue_assets_for_context('elementor');
        self::enqueue_assets_for_context('elementor-editor');

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
     * Enqueue a single asset (assumes asset is already registered)
     */
    private static function enqueue_single_asset($asset)
    {
        $file_path = EMBEDPRESS_PLUGIN_DIR_PATH . '/assets/' . $asset['file'];

        if (! file_exists($file_path)) {
            return;
        }

        // Check if we should load this asset based on current context
        if (!self::should_load_asset($asset)) {
            return;
        }

        // Enqueue the already-registered asset
        if ($asset['type'] === 'script') {
            wp_enqueue_script($asset['handle']);
        } elseif ($asset['type'] === 'style') {
            wp_enqueue_style($asset['handle']);
        }
    }

    /**
     * Determine if an asset should be loaded based on current context
     */
    private static function should_load_asset($asset)
    {
        // Check conditional loading requirements first
        if (isset($asset['condition'])) {
            if (!self::check_asset_condition($asset['condition'])) {
                return false;
            }
        }

        // Check provider-specific loading
        if (isset($asset['providers']) && !empty($asset['providers'])) {
            if (!self::check_provider_match($asset['providers'])) {
                return false;
            }
        }

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

            // Check if we're in classic editor (not Gutenberg)
            $is_classic_editor = false;
            if ($pagenow === 'post.php' || $pagenow === 'post-new.php') {
                // Check if classic editor is being used
                if (
                    isset($_GET['classic-editor']) ||
                    (function_exists('use_block_editor_for_post_type') &&
                        isset($_GET['post']) &&
                        !use_block_editor_for_post_type(get_post_type($_GET['post'])))
                ) {
                    $is_classic_editor = true;
                }
                // Also check if Classic Editor plugin is active and set to classic mode
                if (
                    class_exists('Classic_Editor') &&
                    get_option('classic-editor-replace') === 'classic'
                ) {
                    $is_classic_editor = true;
                }
            }
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
                    // Load ONLY in Gutenberg editor (not in Elementor editor or other admin pages)
                    if ($is_gutenberg_editor && !$is_elementor_editor) {
                        return true;
                    }
                    break;
                case 'classic_editor':
                    // Load only in classic editor (TinyMCE)
                    if ($is_classic_editor) {
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

                case 'elementor-editor':

                    // Load only in Elementor editor (not preview or frontend)
                    if ($is_elementor_editor) {
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
        if (! class_exists('\Elementor\Plugin')) {
            return false;
        }

        if (is_singular()) {
            $post_id = get_the_ID();
            if (empty($post_id) || ! is_numeric($post_id)) {
                return false;
            }

            $document = \Elementor\Plugin::$instance->documents->get($post_id);

            if ($document && method_exists($document, 'is_built_with_elementor')) {
                return (bool) $document->is_built_with_elementor();
            }
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

    /**
     * Check if an asset condition is met
     *
     * @param string $condition The condition to check
     * @return bool
     */
    private static function check_asset_condition($condition)
    {
        switch ($condition) {
            case 'custom_player':
                return self::is_custom_player_enabled();

            case 'has_content':
                // In Elementor editor, always load core scripts with has_content condition
                // because we can't detect unsaved content
                if (class_exists('\Elementor\Plugin')) {
                    $elementor = \Elementor\Plugin::$instance;
                    if (isset($elementor->editor) && $elementor->editor->is_edit_mode()) {
                        return true;
                    }
                }
                return self::has_embedpress_content();

            case 'always':
            default:
                return true;
        }
    }

    /**
     * Check if custom player is enabled on the current page
     *
     * @return bool
     */
    private static function is_custom_player_enabled()
    {
        // Cache the result to avoid multiple checks
        if (self::$custom_player_enabled !== null) {
            return self::$custom_player_enabled;
        }

        // In Elementor editor, always load custom player scripts to allow live preview
        // because we can't detect unsaved widget settings
        if (class_exists('\Elementor\Plugin')) {
            $elementor = \Elementor\Plugin::$instance;
            if (isset($elementor->editor) && $elementor->editor->is_edit_mode()) {
                self::$custom_player_enabled = true;
                return true;
            }
        }

        global $post;

        if (!$post) {
            self::$custom_player_enabled = false;
            return false;
        }

        $content = $post->post_content;

        // Check for custom player in Gutenberg blocks
        if (function_exists('has_blocks') && has_blocks($content)) {
            $blocks = parse_blocks($content);
            if (self::has_custom_player_in_blocks($blocks)) {
                self::$custom_player_enabled = true;
                return true;
            }
        }

        // Check for custom player in Elementor
        if (class_exists('\Elementor\Plugin')) {
            $document = \Elementor\Plugin::$instance->documents->get($post->ID);
            if ($document && method_exists($document, 'is_built_with_elementor') && $document->is_built_with_elementor()) {
                // Check Elementor meta for custom player settings
                $elementor_data = get_post_meta($post->ID, '_elementor_data', true);
                if ($elementor_data && is_string($elementor_data) && (strpos($elementor_data, 'emberpress_custom_player') !== false || strpos($elementor_data, '"customPlayer":true') !== false)) {
                    self::$custom_player_enabled = true;
                    return true;
                }
            }
        }

        // Check for custom player in shortcodes (look for customPlayer attribute)
        if (has_shortcode($content, 'embedpress')) {
            if (is_string($content) && (strpos($content, 'customPlayer') !== false || strpos($content, 'custom_player') !== false)) {
                self::$custom_player_enabled = true;
                return true;
            }
        }

        self::$custom_player_enabled = false;
        return false;
    }

    /**
     * Check if blocks contain custom player settings
     *
     * @param array $blocks
     * @return bool
     */
    private static function has_custom_player_in_blocks($blocks)
    {
        foreach ($blocks as $block) {
            // Check if this is an EmbedPress block with custom player enabled
            $block_name = $block['blockName'] ?? '';
            if ($block_name && strpos($block_name, 'embedpress/') === 0) {
                if (isset($block['attrs']['customPlayer']) && $block['attrs']['customPlayer']) {
                    return true;
                }
            }

            // Recursively check inner blocks
            if (!empty($block['innerBlocks'])) {
                if (self::has_custom_player_in_blocks($block['innerBlocks'])) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Check if current page has EmbedPress content
     *
     * @return bool
     */
    private static function has_embedpress_content()
    {
        // Cache the result to avoid multiple checks
        if (self::$has_embedpress_content !== null) {
            return self::$has_embedpress_content;
        }

        global $post;

        if (!$post) {
            self::$has_embedpress_content = false;
            return false;
        }

        $content = $post->post_content;

        // Check for EmbedPress shortcodes
        if (has_shortcode($content, 'embedpress')) {
            self::$has_embedpress_content = true;
            return true;
        }

        // Check for EmbedPress Gutenberg blocks
        $embedpress_blocks = [
            'embedpress/embedpress',
            'embedpress/google-docs-block',
            'embedpress/google-sheets-block',
            'embedpress/google-slides-block',
            'embedpress/google-forms-block',
            'embedpress/google-drawings-block',
            'embedpress/google-maps-block',
            'embedpress/youtube-block',
            'embedpress/vimeo-block',
            'embedpress/wistia-block',
            'embedpress/twitch-block',
            'embedpress/embedpress-pdf',
            'embedpress/document',
            'embedpress/embedpress-calendar'
        ];

        foreach ($embedpress_blocks as $block_name) {
            if (has_block($block_name, $post)) {
                self::$has_embedpress_content = true;
                return true;
            }
        }

        // Check for Elementor EmbedPress widgets
        if (class_exists('\Elementor\Plugin')) {
            $document = \Elementor\Plugin::$instance->documents->get($post->ID);
            if ($document && method_exists($document, 'is_built_with_elementor') && $document->is_built_with_elementor()) {
                $elementor_data = get_post_meta($post->ID, '_elementor_data', true);
                if ($elementor_data && is_string($elementor_data) && (strpos($elementor_data, 'embedpress') !== false || strpos($elementor_data, 'Embedpress') !== false)) {
                    self::$has_embedpress_content = true;
                    return true;
                }
            }
        }

        self::$has_embedpress_content = false;
        return false;
    }

    /**
     * Check if any of the required providers match the detected embed types
     *
     * @param array $required_providers List of providers this asset needs
     * @return bool
     */
    private static function check_provider_match($required_providers)
    {
        // In Elementor editor, always load provider scripts to allow live preview
        // because we can't detect unsaved widgets from _elementor_data
        if (class_exists('\Elementor\Plugin')) {
            $elementor = \Elementor\Plugin::$instance;
            if (isset($elementor->editor) && $elementor->editor->is_edit_mode()) {
                return true;
            }
        }

        $detected_types = self::detect_embed_types();

        // If no embeds detected, don't load
        if (empty($detected_types)) {
            return false;
        }

        // Check if any required provider matches detected types
        foreach ($required_providers as $provider) {
            if (in_array($provider, $detected_types)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Detect all embed types on the current page
     *
     * @return array List of detected embed types
     */
    private static function detect_embed_types()
    {
        // Cache the result to avoid multiple checks
        if (self::$detected_embed_types !== null) {
            return self::$detected_embed_types;
        }

        self::$detected_embed_types = [];

        global $post;

        if (!$post) {
            return self::$detected_embed_types;
        }

        $content = $post->post_content;

        // Detect from Gutenberg blocks
        if (function_exists('has_blocks') && has_blocks($content)) {
            $blocks = parse_blocks($content);
            self::$detected_embed_types = array_merge(
                self::$detected_embed_types,
                self::detect_types_from_blocks($blocks)
            );
        }

        // Detect from shortcodes
        self::$detected_embed_types = array_merge(
            self::$detected_embed_types,
            self::detect_types_from_shortcodes($content)
        );

        // Detect from Elementor
        if (class_exists('\Elementor\Plugin')) {
            $document = \Elementor\Plugin::$instance->documents->get($post->ID);
            if ($document && method_exists($document, 'is_built_with_elementor') && $document->is_built_with_elementor()) {
                self::$detected_embed_types = array_merge(
                    self::$detected_embed_types,
                    self::detect_types_from_elementor($post->ID)
                );
            }
        }

        // Remove duplicates
        self::$detected_embed_types = array_unique(self::$detected_embed_types);

        return self::$detected_embed_types;
    }

    /**
     * Detect embed types from Gutenberg blocks
     *
     * @param array $blocks
     * @return array
     */
    private static function detect_types_from_blocks($blocks)
    {
        $types = [];

        foreach ($blocks as $block) {
            // Map block names to embed types
            $block_name = $block['blockName'] ?? '';

            if ($block_name && strpos($block_name, 'embedpress/') === 0) {
                // Extract type from block name
                if ($block_name === 'embedpress/embedpress') {
                    // Generic block - detect from URL
                    $url = $block['attrs']['url'] ?? '';
                    $types = array_merge($types, self::detect_type_from_url($url));
                } elseif ($block_name === 'embedpress/embedpress-pdf') {
                    $types[] = 'pdf';
                } elseif ($block_name === 'embedpress/document') {
                    $types[] = 'document';
                } elseif ($block_name === 'embedpress/youtube-block') {
                    $types[] = 'youtube';
                } elseif ($block_name === 'embedpress/vimeo-block') {
                    $types[] = 'vimeo';
                } elseif ($block_name === 'embedpress/google-docs-block') {
                    $types[] = 'google-docs';
                } elseif ($block_name === 'embedpress/google-sheets-block') {
                    $types[] = 'google-sheets';
                } elseif ($block_name === 'embedpress/google-slides-block') {
                    $types[] = 'google-slides';
                } elseif ($block_name === 'embedpress/wistia-block') {
                    $types[] = 'wistia';
                } elseif ($block_name === 'embedpress/twitch-block') {
                    $types[] = 'twitch';
                }
            }

            // Recursively check inner blocks
            if (!empty($block['innerBlocks'])) {
                $types = array_merge($types, self::detect_types_from_blocks($block['innerBlocks']));
            }
        }

        return $types;
    }

    /**
     * Detect embed types from shortcodes
     *
     * @param string $content
     * @return array
     */
    private static function detect_types_from_shortcodes($content)
    {
        $types = [];

        if (!is_string($content)) {
            return $types;
        }

        // Find all embedpress shortcodes with URL attribute (with or without quotes)
        // Matches: [embedpress url="..."], [embedpress url='...'], [embedpress url=...]
        if (preg_match_all('/\[embedpress[^\]]*url=["\']?([^"\'\s\]]+)["\']?[^\]]*\]/i', $content, $matches)) {
            foreach ($matches[1] as $url) {
                $types = array_merge($types, self::detect_type_from_url($url));
            }
        }

        // Find embedpress shortcodes with URL between tags
        // Matches: [embedpress]URL[/embedpress]
        if (preg_match_all('/\[embedpress[^\]]*\]([^\[]+)\[\/embedpress\]/i', $content, $matches)) {
            foreach ($matches[1] as $url) {
                $url = trim($url);
                if (!empty($url)) {
                    $types = array_merge($types, self::detect_type_from_url($url));
                }
            }
        }

        return $types;
    }

    /**
     * Detect embed types from Elementor
     *
     * @param int $post_id
     * @return array
     */
    private static function detect_types_from_elementor($post_id)
    {
        $types = [];
        $elementor_data = get_post_meta($post_id, '_elementor_data', true);

        if (!$elementor_data || !is_string($elementor_data)) {
            return $types;
        }

        // Decode JSON data
        $data = json_decode($elementor_data, true);
        if (!$data || !is_array($data)) {
            return $types;
        }

        // Recursively search for EmbedPress widgets
        $types = self::detect_types_from_elementor_data($data);

        return $types;
    }

    /**
     * Recursively detect types from Elementor data
     *
     * @param array $data
     * @return array
     */
    private static function detect_types_from_elementor_data($data)
    {
        $types = [];

        if (!is_array($data)) {
            return $types;
        }

        foreach ($data as $element) {
            if (!is_array($element)) {
                continue;
            }

            // Check if this is an EmbedPress widget
            $widget_type = $element['widgetType'] ?? '';
            if ($widget_type && (strpos($widget_type, 'embedpress') !== false || strpos($widget_type, 'Embedpress') !== false)) {
                // Get the embed source
                $settings = $element['settings'] ?? [];
                $source = $settings['embedpress_pro_embeded_source'] ?? '';
                $url = $settings['embedpress_embeded_link'] ?? '';

                if ($source) {
                    $types[] = $source;
                } elseif ($url) {
                    $types = array_merge($types, self::detect_type_from_url($url));
                }
            }

            // Recursively check elements
            if (isset($element['elements'])) {
                $types = array_merge($types, self::detect_types_from_elementor_data($element['elements']));
            }
        }

        return $types;
    }

    /**
     * Detect embed type from URL using Embera's provider detection
     *
     * @param string $url
     * @return array
     */
    private static function detect_type_from_url($url)
    {
        $types = [];

        if (empty($url) || !is_string($url)) {
            return $types;
        }

        // Use Helper class which leverages Embera's built-in provider detection
        if (class_exists('\EmbedPress\Includes\Classes\Helper')) {
            $provider_name = Helper::get_provider_name($url);

            if (!empty($provider_name)) {
                // Normalize provider name to lowercase for consistency
                $provider_name = strtolower($provider_name);

                // Map provider names to asset provider keys
                $provider_map = [
                    'youtube' => 'youtube',
                    'youtubechannel' => 'youtube-channel',
                    'vimeo' => 'vimeo',
                    'instagram' => 'instagram',
                    'instagramfeed' => 'instagram',
                    'opensea' => 'opensea',
                    'wistia' => 'wistia',
                    'twitch' => 'twitch',
                    'meetup' => 'meetup',
                    'googledocs' => 'google-docs',
                    'googlesheets' => 'google-sheets',
                    'googleslides' => 'google-slides',
                ];

                // Check if provider name matches our map
                if (isset($provider_map[$provider_name])) {
                    $types[] = $provider_map[$provider_name];
                    return $types;
                }

                // Check for document types from Helper's response
                if (strpos($provider_name, 'document_') === 0) {
                    $types[] = 'document';
                    return $types;
                }
            }
        }

        // Fallback to manual detection for special cases not handled by Embera
        $url_lower = strtolower($url);

        // YouTube special cases (channel, live, shorts)
        if (strpos($url_lower, 'youtube.com') !== false || strpos($url_lower, 'youtu.be') !== false) {
            if (strpos($url_lower, '/channel/') !== false || strpos($url_lower, '/c/') !== false || strpos($url_lower, '/@') !== false) {
                $types[] = 'youtube-channel';
            } elseif (strpos($url_lower, '/live') !== false) {
                $types[] = 'youtube-live';
            } elseif (strpos($url_lower, '/shorts/') !== false) {
                $types[] = 'youtube-shorts';
            } else {
                $types[] = 'youtube';
            }
        }
        // PDF detection
        elseif (preg_match('/\.pdf$/i', $url)) {
            $types[] = 'pdf';
        }
        // Document detection
        elseif (preg_match('/\.(doc|docx|ppt|pptx|xls|xlsx)$/i', $url)) {
            $types[] = 'document';
        }
        // Self-hosted video
        elseif (preg_match('/\.(mp4|mov|avi|wmv|flv|mkv|webm|mpeg|mpg)$/i', $url)) {
            $types[] = 'video';
        }
        // Self-hosted audio
        elseif (preg_match('/\.(mp3|wav|ogg|aac)$/i', $url)) {
            $types[] = 'audio';
        }

        return $types;
    }
}
