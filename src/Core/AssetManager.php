<?php

namespace EmbedPress\Core;

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
     */
    private static $assets = [
        // New build files
        'blocks-js' => [
            'file' => 'js/blocks.build.js',
            'deps' => ['wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n'],
            'contexts' => ['editor', 'frontend'],
            'type' => 'script',
            'footer' => true
        ],
        'blocks-style' => [
            'file' => 'css/blocks.style.build.css',
            'deps' => [],
            'contexts' => ['editor', 'frontend'],
            'type' => 'style'
        ],
        'blocks-editor' => [
            'file' => 'css/blocks.editor.build.css',
            'deps' => [],
            'contexts' => ['editor'],
            'type' => 'style'
        ],
        'admin-js' => [
            'file' => 'js/admin.build.js',
            'deps' => ['wp-element', 'wp-components', 'wp-i18n'],
            'contexts' => ['admin'],
            'type' => 'script',
            'footer' => true
        ],
        'admin-css' => [
            'file' => 'css/admin.build.css',
            'deps' => [],
            'contexts' => ['admin'],
            'type' => 'style'
        ],
        'frontend-js' => [
            'file' => 'js/frontend.build.js',
            'deps' => ['jquery'],
            'contexts' => ['frontend'],
            'type' => 'script',
            'footer' => true
        ],
        'components-css' => [
            'file' => 'css/components.build.css',
            'deps' => [],
            'contexts' => ['admin', 'editor'],
            'type' => 'style'
        ],

        // Legacy assets (conditional loading) - served from /static/ folder
        'embedpress-style' => [
            'file' => 'css/embedpress.css',
            'deps' => [],
            'contexts' => ['editor', 'frontend', 'elementor'],
            'type' => 'style',
            'footer' => true,
            'conditional' => true,
            'static' => true
        ],
        'plyr-css' => [
            'file' => 'css/plyr.css',
            'deps' => [],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'style',
            'conditional' => 'custom_player',
            'static' => true
        ],
        'plyr-js' => [
            'file' => 'js/plyr.polyfilled.js',
            'deps' => [],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'script',
            'conditional' => 'custom_player',
            'footer' => true,
            'static' => true
        ],
        'carousel-css' => [
            'file' => 'css/carousel.min.css',
            'deps' => [],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'style',
            'conditional' => 'carousel',
            'static' => true
        ],
        'carousel-js' => [
            'file' => 'js/carousel.min.js',
            'deps' => ['jquery'],
            'contexts' => ['frontend', 'elementor'],
            'type' => 'script',
            'conditional' => 'carousel',
            'footer' => true,
            'static' => true
        ],
        'elementor-css' => [
            'file' => 'css/embedpress-elementor.css',
            'deps' => ['embedpress-style'],
            'contexts' => ['elementor'],
            'type' => 'style',
            'static' => true
        ],
        'pdfobject' => [
            'file' => 'js/pdfobject.js',
            'deps' => [],
            'contexts' => ['frontend', 'editor', 'elementor'],
            'type' => 'script',
            'conditional' => 'pdf',
            'footer' => true,
            'static' => true
        ]
    ];

    /**
     * Initialize asset manager
     */
    public static function init()
    {
        add_action('wp_enqueue_scripts', [__CLASS__, 'enqueue_frontend_assets']);
        add_action('admin_enqueue_scripts', [__CLASS__, 'enqueue_admin_assets']);
        add_action('enqueue_block_assets', [__CLASS__, 'enqueue_block_assets']);
        add_action('enqueue_block_editor_assets', [__CLASS__, 'enqueue_editor_assets']);
        add_action('elementor/frontend/after_enqueue_styles', [__CLASS__, 'enqueue_elementor_assets']);
        add_action('elementor/editor/after_enqueue_styles', [__CLASS__, 'enqueue_elementor_editor_assets']);
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
    public static function enqueue_admin_assets($hook)
    {
        // Only load on EmbedPress admin pages
        if (strpos($hook, 'embedpress') !== false) {
            self::enqueue_assets_for_context('admin');
        }
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
    }

    /**
     * Enqueue Elementor frontend assets
     */
    public static function enqueue_elementor_assets()
    {
        if (self::has_elementor_embedpress_widgets()) {
            self::enqueue_assets_for_context('elementor');
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
     * Enqueue assets for a specific context
     */
    private static function enqueue_assets_for_context($context)
    {
        foreach (self::$assets as $handle => $asset) {
            if (in_array($context, $asset['contexts'])) {
                self::enqueue_asset($handle);
            }
        }
    }

    /**
     * Enqueue a single asset
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

        // Determine if this is a static asset or build asset
        $is_static = isset($asset['static']) && $asset['static'] === true;

        if ($is_static) {
            $file_path = EMBEDPRESS_PATH_STATIC . $asset['file'];
            $file_url = EMBEDPRESS_URL_STATIC . $asset['file'];
        } else {
            $file_path = EMBEDPRESS_PATH_BASE . 'assets/' . $asset['file'];
            $file_url = EMBEDPRESS_URL_ASSETS . $asset['file'];
        }

        if (!file_exists($file_path)) {
            return false;
        }

        $version = filemtime($file_path);
        $full_handle = 'embedpress-' . $handle;

        if ($asset['type'] === 'script') {
            wp_enqueue_script(
                $full_handle,
                $file_url,
                $asset['deps'],
                $version,
                $asset['footer'] ?? false
            );
        } else {
            wp_enqueue_style(
                $full_handle,
                $file_url,
                $asset['deps'],
                $version
            );
        }

        return true;
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
            default:
                return true;
        }
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
     * Check if page has PDF content
     */
    private static function has_pdf_content()
    {
        global $post;

        if (!$post) {
            return false;
        }

        return strpos($post->post_content, '.pdf') !== false ||
            strpos($post->post_content, 'embedpress-pdf') !== false;
    }

    /**
     * Enqueue conditional assets based on content
     */
    private static function enqueue_conditional_assets()
    {
        global $post;

        if (!$post) {
            return;
        }

        $content = $post->post_content;

        // Check for video content
        if (preg_match('/youtube|vimeo|video/i', $content)) {
            self::enqueue_asset('plyr-css');
            self::enqueue_asset('plyr-js');
        }

        // Check for carousel content
        if (preg_match('/instagram|carousel/i', $content)) {
            self::enqueue_asset('carousel-css');
            self::enqueue_asset('carousel-js');
        }

        // Check for PDF content
        if (self::has_pdf_content()) {
            self::enqueue_asset('pdfobject');
        }

        // Always load base styles for EmbedPress content
        self::enqueue_asset('embedpress-style');
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
        } else {
            $file_path = EMBEDPRESS_PATH_BASE . 'assets/' . $asset['file'];
        }

        return file_exists($file_path);
    }
}
