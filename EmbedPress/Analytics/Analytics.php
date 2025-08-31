<?php

namespace EmbedPress\Analytics;

/**
 * EmbedPress Analytics Page Handler
 * 
 * Manages the standalone analytics page with React component mounting
 */
class Analytics
{
    /**
     * Initialize hooks
     */
    public function __construct()
    {
        add_action('admin_menu', [$this, 'register_submenu']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_analytics_scripts']);
    }

    /**
     * Register the submenu page under EmbedPress menu
     */
    public function register_submenu()
    {
        add_submenu_page(
            'embedpress',                    // Parent slug
            __('Analytics', 'embedpress'),   // Page title
            __('Analytics', 'embedpress'),   // Menu title
            'manage_options',                // Capability
            'embedpress-analytics',          // Menu slug
            [$this, 'render_analytics_page'] // Callback to render page
        );
    }

    /**
     * Enqueue analytics scripts and styles
     */
    public function enqueue_analytics_scripts($hook)
    {
        // Only load on the analytics page
        if ($hook !== 'embedpress_page_embedpress-analytics') {
            return;
        }

        // Enqueue the analytics script (this should be built by Vite)
        wp_enqueue_script(
            'embedpress-analytics',
            EMBEDPRESS_URL_ASSETS . 'js/analytics.build.js',
            ['wp-element'],
            EMBEDPRESS_PLUGIN_VERSION,
            true
        );

        // Add module attribute for ES modules
        add_filter('script_loader_tag', function($tag, $handle) {
            if ($handle === 'embedpress-analytics') {
                return str_replace('<script ', '<script type="module" ', $tag);
            }
            return $tag;
        }, 10, 2);

        // Enqueue analytics styles
        wp_enqueue_style(
            'embedpress-analytics',
            EMBEDPRESS_URL_ASSETS . 'css/analytics.build.css',
            [],
            EMBEDPRESS_PLUGIN_VERSION
        );

        // Localize script with API settings
        $tracking_enabled = get_option('embedpress_analytics_tracking_enabled', true);
        wp_localize_script('embedpress-analytics', 'embedpressAnalyticsData', [
            'restUrl' => rest_url('embedpress/v1/analytics/'),
            'nonce' => wp_create_nonce('wp_rest'),
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'cacheNonce' => wp_create_nonce('embedpress_clear_cache'),
            'isProActive' => defined('EMBEDPRESS_SL_ITEM_SLUG'),
            'currentUser' => wp_get_current_user()->ID,
            'siteUrl' => site_url(),
            'trackingEnabled' => (bool) $tracking_enabled,
        ]);

        // Also make WordPress REST API settings available
        wp_localize_script('embedpress-analytics', 'wpApiSettings', [
            'root' => rest_url(),
            'nonce' => wp_create_nonce('wp_rest'),
        ]);
    }

    /**
     * Render the Analytics page with a React root div
     */
    public function render_analytics_page()
    {
?>
    <div id="embedpress-analytics-root"></div>

<?php
    }
}
