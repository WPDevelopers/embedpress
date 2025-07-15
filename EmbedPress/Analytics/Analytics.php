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
     * Render the Analytics page with a React root div
     */
    public function render_analytics_page()
    {
?>
    <div id="embedpress-analytics-root"></div>

<?php
    }
}
