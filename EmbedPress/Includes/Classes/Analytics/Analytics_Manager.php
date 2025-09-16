<?php

namespace EmbedPress\Includes\Classes\Analytics;

use EmbedPress\Includes\Classes\Analytics\License_Manager;
use EmbedPress\Includes\Classes\Analytics\Email_Reports;
use EmbedPress\Includes\Classes\Analytics\Content_Cache_Manager;

use EmbedPress\Includes\Classes\Database\Analytics_Schema;

defined('ABSPATH') or die("No direct script access allowed.");

/**
 * EmbedPress Analytics Manager
 *
 * Main class for managing analytics data collection and reporting
 *
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2023 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       4.2.7
 */
class Analytics_Manager
{
    /**
     * Single instance of the class
     *
     * @var Analytics_Manager
     */
    private static $instance = null;

    /**
     * Data collector instance
     *
     * @var Data_Collector
     */
    private $data_collector;

    /**
     * Milestone manager instance
     *
     * @var Milestone_Manager
     */
    private $milestone_manager;

    /**
     * Email reports instance
     *
     * @var Email_Reports
     */
    private $email_reports;

    /**
     * Content cache manager instance
     *
     * @var Content_Cache_Manager
     */
    private $cache_manager;



    /**
     * Get single instance
     *
     * @return Analytics_Manager
     */
    public static function get_instance()
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Constructor
     */
    private function __construct()
    {
        $this->init_dependencies();
        $this->init_hooks();
    }

    /**
     * Initialize dependencies
     *
     * @return void
     */
    private function init_dependencies()
    {
        $this->data_collector = new Data_Collector();
        $this->milestone_manager = new Milestone_Manager();
        $this->cache_manager = new Content_Cache_Manager();

        // Initialize email reports for pro users
        if (License_Manager::has_analytics_feature('email_reports')) {
            $this->email_reports = new Email_Reports();
        } else {
            $this->email_reports = null;
        }
    }

    /**
     * Initialize hooks
     *
     * @return void
     */
    private function init_hooks()
    {

        // Initialize database tables on plugin use
        add_action('init', [$this, 'ensure_tables_exist']);

        // Note: Frontend tracking script is now handled by AssetManager + LocalizationManager

        // Track content creation
        add_action('embedpress_content_embedded', [$this, 'track_content_creation'], 10, 3);


        // REST API
        add_action('rest_api_init', [$this, 'register_rest_routes']);

        // Daily milestone check
        add_action('embedpress_daily_milestone_check', [$this->milestone_manager, 'check_milestones']);
        if (!wp_next_scheduled('embedpress_daily_milestone_check')) {
            wp_schedule_event(time(), 'daily', 'embedpress_daily_milestone_check');
        }
    }

    /**
     * Ensure database tables exist
     *
     * @return void
     */
    public function ensure_tables_exist()
    {
        Analytics_Schema::create_tables();
    }



    /**
     * Check if current page has embedded content
     *
     * @return bool
     */
    public function has_embedded_content()
    {
        global $post;

        if (!$post) {
            return false;
        }

        // Check for shortcodes
        if (has_shortcode($post->post_content, 'embedpress')) {
            return true;
        }

        // Check for all EmbedPress Gutenberg blocks
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

        foreach ($embedpress_blocks as $block_type) {
            if (has_block($block_type, $post)) {
                return true;
            }
        }

        // Check for Elementor widgets (if Elementor is active)
        if (class_exists('\Elementor\Plugin')) {
            $elementor_data = get_post_meta($post->ID, '_elementor_data', true);
            if (!empty($elementor_data) && strpos($elementor_data, 'embedpress') !== false) {
                return true;
            }
        }

        return false;
    }



    /**
     * Track content creation
     *
     * @param string $content_id
     * @param string $content_type
     * @param array $data
     * @return void
     */
    public function track_content_creation($content_id, $content_type, $data = [])
    {
        $this->data_collector->track_content_creation($content_id, $content_type, $data);
    }

    /**
     * Enqueue admin scripts and styles
     *
     * @param string $hook
     * @return void
     */
    public function enqueue_admin_scripts($hook)
    {
        if (strpos($hook, 'embedpress-analytics') === false) {
            return;
        }
        


        wp_localize_script('embedpress-analytics', 'embedpress_analytics_admin', [
            'ajax_url' => admin_url('admin-ajax.php'),
            'rest_url' => rest_url('embedpress/v1/analytics/'),
            'nonce' => wp_create_nonce('embedpress_analytics_admin')
        ]);
    }

    /**
     * Register REST API routes
     *
     * @return void
     */
    public function register_rest_routes()
    {
        $rest_api = new REST_API();
        $rest_api->register_routes();
    }

    /**
     * Get analytics data
     *
     * @param array $args
     * @return array
     */
    public function get_analytics_data($args = [])
    {
        return $this->data_collector->get_analytics_data($args);
    }

    /**
     * Get total embedded content count by type
     *
     * @return array
     */
    public function get_total_content_by_type()
    {
        return $this->data_collector->get_total_content_by_type();
    }

    /**
     * Get views analytics
     *
     * @param array $args
     * @return array
     */
    public function get_views_analytics($args = [])
    {
        return $this->data_collector->get_views_analytics($args);
    }

    /**
     * Get browser analytics
     *
     * @param array $args
     * @return array
     */
    public function get_browser_analytics($args = [])
    {
        return $this->data_collector->get_browser_analytics($args);
    }

    /**
     * Get milestone data
     *
     * @return array
     */
    public function get_milestone_data()
    {
        return $this->milestone_manager->get_milestone_data();
    }

    /**
     * Track interaction
     *
     * @param array $data
     * @return bool
     */
    public function track_interaction($data)
    {
        return $this->data_collector->track_interaction($data);
    }

    /**
     * Get email reports instance
     *
     * @return Email_Reports|null
     */
    public function get_email_reports()
    {
        return $this->email_reports;
    }

    /**
     * Add admin notice for database cleanup if needed
     *
     * @return void
     */
    public function add_cleanup_admin_notice()
    {
        // Only show to administrators
        if (!current_user_can('manage_options')) {
            return;
        }

        // Check if cleanup has been run recently
        $last_cleanup = get_option('embedpress_analytics_last_cleanup', 0);
        $cleanup_interval = 30 * DAY_IN_SECONDS; // 30 days

        if (time() - $last_cleanup > $cleanup_interval) {
            add_action('admin_notices', [$this, 'display_cleanup_notice']);
        }
    }

    /**
     * Display cleanup admin notice
     *
     * @return void
     */
    public function display_cleanup_notice()
    {
        ?>
        <div class="notice notice-info is-dismissible">
            <p>
                <strong><?php _e('EmbedPress Analytics:', 'embedpress'); ?></strong>
                <?php _e('Your analytics database may contain redundant data. Consider running a cleanup to improve performance.', 'embedpress'); ?>
                <a href="<?php echo admin_url('admin.php?page=embedpress-analytics#cleanup'); ?>" class="button button-secondary">
                    <?php _e('Go to Analytics Cleanup', 'embedpress'); ?>
                </a>
            </p>
        </div>
        <?php
    }
}
