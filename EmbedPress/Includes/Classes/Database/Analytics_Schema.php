<?php

namespace EmbedPress\Includes\Classes\Database;

defined('ABSPATH') or die("No direct script access allowed.");

/**
 * EmbedPress Analytics Database Schema
 *
 * Handles creation and management of analytics database tables
 *
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2025 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       4.4.0
 */
class Analytics_Schema
{
    /**
     * Database version for schema updates
     */
    const DB_VERSION = '1.0.8';

    /**
     * Create all analytics tables
     *
     * @return void
     */
    public static function create_tables()
    {

        global $wpdb;

        $charset_collate = $wpdb->get_charset_collate();

        // Check if tables need to be created or updated
        $current_version = get_option('embedpress_analytics_db_version', '0.0.0');

        // Also check if tables actually exist in database
        $tables_exist = self::check_tables_exist();

        if (version_compare($current_version, self::DB_VERSION, '<') || !$tables_exist) {

            self::create_content_table($charset_collate);
            self::create_views_table($charset_collate);
            self::create_browser_info_table($charset_collate);
            self::create_milestones_table($charset_collate);
            self::create_referrers_table($charset_collate);
            // Run migrations for existing installations
            
            // self::run_migrations($current_version);



            // Clean up old referrer visitor options (no longer needed)
            self::cleanup_old_referrer_visitor_options();

            // Update database version
            update_option('embedpress_analytics_db_version', self::DB_VERSION);

            // Log table creation for debugging
        }
    }

    /**
     * Check if all required tables exist
     *
     * @return bool
     */
    private static function check_tables_exist()
    {
        global $wpdb;

        $required_tables = [
            $wpdb->prefix . 'embedpress_analytics_content',
            $wpdb->prefix . 'embedpress_analytics_views',
            $wpdb->prefix . 'embedpress_analytics_browser_info',
            $wpdb->prefix . 'embedpress_analytics_milestones',
            $wpdb->prefix . 'embedpress_analytics_referrers'
        ];

        foreach ($required_tables as $table) {
            $table_exists = $wpdb->get_var($wpdb->prepare("SHOW TABLES LIKE %s", $table));
            if (!$table_exists) {
                return false;
            }
        }

        return true;
    }

    /**
     * Force create all tables (for debugging/repair)
     *
     * @return void
     */
    public static function force_create_tables()
    {
        global $wpdb;

        $charset_collate = $wpdb->get_charset_collate();


        self::create_content_table($charset_collate);
        self::create_views_table($charset_collate);
        self::create_browser_info_table($charset_collate);
        self::create_milestones_table($charset_collate);
        self::create_referrers_table($charset_collate);

        // Update database version
        update_option('embedpress_analytics_db_version', self::DB_VERSION);

    }

    /**
     * Create embedpress_analytics_content table
     * Tracks embedded content by type (Elementor/Gutenberg/Shortcode)
     *
     * @param string $charset_collate
     * @return void
     */
    private static function create_content_table($charset_collate)
    {
        global $wpdb;

        $table_name = $wpdb->prefix . 'embedpress_analytics_content';

        $sql = "CREATE TABLE IF NOT EXISTS $table_name (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            content_id varchar(255) NOT NULL,
            content_type varchar(50) NOT NULL DEFAULT 'unknown',
            embed_type varchar(100) NOT NULL,
            embed_url text NOT NULL,
            post_id bigint(20) unsigned DEFAULT NULL,
            page_url text DEFAULT NULL,
            title varchar(500) DEFAULT NULL,
            total_views bigint(20) unsigned DEFAULT 0,
            total_impressions bigint(20) unsigned DEFAULT 0,
            total_clicks bigint(20) unsigned DEFAULT 0,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY unique_page_embed (page_url(191), embed_type(50)),
            KEY idx_content_type (content_type),
            KEY idx_embed_type (embed_type),
            KEY idx_post_id (post_id),
            KEY idx_created_at (created_at),
            KEY idx_total_views (total_views)
        ) $charset_collate;";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }

    /**
     * Create embedpress_analytics_views table
     * Tracks individual views/interactions with embedded content
     *
     * @param string $charset_collate
     * @return void
     */
    private static function create_views_table($charset_collate)
    {
        global $wpdb;

        $table_name = $wpdb->prefix . 'embedpress_analytics_views';

        $sql = "CREATE TABLE IF NOT EXISTS $table_name (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            content_id varchar(255) NOT NULL,
            user_id varchar(255) DEFAULT NULL,
            session_id varchar(255) NOT NULL,
            user_ip varchar(45) DEFAULT NULL,
            user_agent text DEFAULT NULL,
            referrer_url text DEFAULT NULL,
            page_url text DEFAULT NULL,
            interaction_type enum('impression', 'click', 'view', 'play', 'pause', 'complete') NOT NULL DEFAULT 'impression',
            interaction_data json DEFAULT NULL,
            view_duration int(11) unsigned DEFAULT 0,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY idx_content_id (content_id(191)),
            KEY idx_user_id (user_id(191)),
            KEY idx_session_id (session_id(191)),
            KEY idx_interaction_type (interaction_type),
            KEY idx_created_at (created_at),
            KEY idx_user_ip (user_ip),
            KEY idx_content_interaction (content_id(191), interaction_type),
            KEY idx_daily_stats (content_id(191), interaction_type, created_at),
            KEY idx_user_content_interaction (user_id(100), content_id(100), interaction_type),
            KEY idx_deduplication (user_id(100), content_id(100), interaction_type, created_at)
        ) $charset_collate;";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }

    /**
     * Create embedpress_analytics_browser_info table
     * Tracks browser and device information for analytics
     *
     * @param string $charset_collate
     * @return void
     */
    private static function create_browser_info_table($charset_collate)
    {
        global $wpdb;

        $table_name = $wpdb->prefix . 'embedpress_analytics_browser_info';

        $sql = "CREATE TABLE IF NOT EXISTS $table_name (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            user_id varchar(255) DEFAULT NULL,
            session_id varchar(255) NOT NULL,
            browser_fingerprint varchar(64) DEFAULT NULL,
            browser_name varchar(100) DEFAULT NULL,
            browser_version varchar(50) DEFAULT NULL,
            operating_system varchar(100) DEFAULT NULL,
            device_type enum('desktop', 'mobile', 'tablet', 'unknown') DEFAULT 'unknown',
            screen_resolution varchar(20) DEFAULT NULL,
            language varchar(10) DEFAULT NULL,
            timezone varchar(50) DEFAULT NULL,
            country varchar(100) DEFAULT NULL,
            city varchar(100) DEFAULT NULL,
            user_agent text DEFAULT NULL,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY unique_user_fingerprint (user_id(191), browser_fingerprint(50)),
            KEY idx_user_id (user_id(191)),
            KEY idx_session_id (session_id(191)),
            KEY idx_browser_fingerprint (browser_fingerprint),
            KEY idx_browser_name (browser_name),
            KEY idx_operating_system (operating_system),
            KEY idx_device_type (device_type),
            KEY idx_country (country),
            KEY idx_created_at (created_at)
        ) $charset_collate;";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }

    /**
     * Create embedpress_analytics_milestones table
     * Tracks milestone achievements for upsell features
     *
     * @param string $charset_collate
     * @return void
     */
    private static function create_milestones_table($charset_collate)
    {
        global $wpdb;

        $table_name = $wpdb->prefix . 'embedpress_analytics_milestones';

        $sql = "CREATE TABLE IF NOT EXISTS $table_name (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            milestone_type enum('total_views', 'total_embeds', 'daily_views', 'monthly_views') NOT NULL,
            milestone_value bigint(20) unsigned NOT NULL,
            achieved_value bigint(20) unsigned NOT NULL,
            is_notified tinyint(1) DEFAULT 0,
            achieved_at datetime DEFAULT CURRENT_TIMESTAMP,
            notified_at datetime DEFAULT NULL,
            PRIMARY KEY (id),
            KEY idx_milestone_type (milestone_type),
            KEY idx_milestone_value (milestone_value),
            KEY idx_is_notified (is_notified),
            KEY idx_achieved_at (achieved_at)
        ) $charset_collate;";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }

    /**
     * Create embedpress_analytics_referrers table
     * Tracks referrer URLs with optimized view and click counting
     *
     * @param string $charset_collate
     * @return void
     */
    private static function create_referrers_table($charset_collate)
    {
        global $wpdb;

        $table_name = $wpdb->prefix . 'embedpress_analytics_referrers';

        $sql = "CREATE TABLE IF NOT EXISTS $table_name (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            referrer_url text NOT NULL,
            referrer_domain varchar(255) NOT NULL,
            referrer_source varchar(100) DEFAULT NULL,
            utm_source varchar(100) DEFAULT NULL,
            utm_medium varchar(100) DEFAULT NULL,
            utm_campaign varchar(255) DEFAULT NULL,
            utm_term varchar(255) DEFAULT NULL,
            utm_content varchar(255) DEFAULT NULL,
            total_views bigint(20) unsigned DEFAULT 0,
            total_clicks bigint(20) unsigned DEFAULT 0,
            unique_visitors bigint(20) unsigned DEFAULT 0,
            first_visit datetime DEFAULT CURRENT_TIMESTAMP,
            last_visit datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY unique_referrer_url (referrer_url(191)),
            KEY idx_referrer_domain (referrer_domain(191)),
            KEY idx_referrer_source (referrer_source),
            KEY idx_utm_source (utm_source),
            KEY idx_utm_medium (utm_medium),
            KEY idx_utm_campaign (utm_campaign(191)),
            KEY idx_total_views (total_views),
            KEY idx_total_clicks (total_clicks),
            KEY idx_unique_visitors (unique_visitors),
            KEY idx_first_visit (first_visit),
            KEY idx_last_visit (last_visit),
            KEY idx_created_at (created_at)
        ) $charset_collate;";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }


    /**
     * Run database migrations for version updates
     * Only new migration: normalize index prefixes to be utf8mb4-safe
     *
     * @param string $current_version
     * @return void
     */
    private static function run_migrations($current_version)
    {
        global $wpdb;

        if (version_compare($current_version, '1.0.8', '<')) {
            // Content table: ensure unique_page_embed uses (page_url(191), embed_type(50))
            $table = $wpdb->prefix . 'embedpress_analytics_content';
            $exists = $wpdb->get_var($wpdb->prepare("SHOW TABLES LIKE %s", $table));
            if ($exists) {
                $idx = $wpdb->get_results("SHOW INDEX FROM $table WHERE Key_name = 'unique_page_embed'");
                $needs_update = true;
                if (!empty($idx)) {
                    $ok_page = false; $ok_embed = false;
                    foreach ($idx as $r) {
                        if ($r->Column_name === 'page_url' && intval($r->Sub_part) === 191) { $ok_page = true; }
                        if ($r->Column_name === 'embed_type' && intval($r->Sub_part) === 50) { $ok_embed = true; }
                    }
                    $needs_update = !($ok_page && $ok_embed);
                }
                if ($needs_update) {
                    $has_key = $wpdb->get_var("SHOW INDEX FROM $table WHERE Key_name = 'unique_page_embed'");
                    if ($has_key) {
                        $wpdb->query("ALTER TABLE $table DROP INDEX unique_page_embed");
                    }
                    $wpdb->query("ALTER TABLE $table ADD UNIQUE KEY unique_page_embed (page_url(191), embed_type(50))");
                }
            }

            // Views table: normalize index prefixes
            $table = $wpdb->prefix . 'embedpress_analytics_views';
            if ($wpdb->get_var($wpdb->prepare("SHOW TABLES LIKE %s", $table))) {
                if ($wpdb->get_var("SHOW INDEX FROM $table WHERE Key_name = 'idx_content_id'")) {
                    $wpdb->query("ALTER TABLE $table DROP INDEX idx_content_id");
                }
                $wpdb->query("ALTER TABLE $table ADD INDEX idx_content_id (content_id(191))");

                if ($wpdb->get_var("SHOW INDEX FROM $table WHERE Key_name = 'idx_user_id'")) {
                    $wpdb->query("ALTER TABLE $table DROP INDEX idx_user_id");
                }
                $wpdb->query("ALTER TABLE $table ADD INDEX idx_user_id (user_id(191))");

                if ($wpdb->get_var("SHOW INDEX FROM $table WHERE Key_name = 'idx_session_id'")) {
                    $wpdb->query("ALTER TABLE $table DROP INDEX idx_session_id");
                }
                $wpdb->query("ALTER TABLE $table ADD INDEX idx_session_id (session_id(191))");

                if ($wpdb->get_var("SHOW INDEX FROM $table WHERE Key_name = 'idx_content_interaction'")) {
                    $wpdb->query("ALTER TABLE $table DROP INDEX idx_content_interaction");
                }
                $wpdb->query("ALTER TABLE $table ADD INDEX idx_content_interaction (content_id(191), interaction_type)");

                if ($wpdb->get_var("SHOW INDEX FROM $table WHERE Key_name = 'idx_daily_stats'")) {
                    $wpdb->query("ALTER TABLE $table DROP INDEX idx_daily_stats");
                }
                $wpdb->query("ALTER TABLE $table ADD INDEX idx_daily_stats (content_id(191), interaction_type, created_at)");

                if ($wpdb->get_var("SHOW INDEX FROM $table WHERE Key_name = 'idx_user_content_interaction'")) {
                    $wpdb->query("ALTER TABLE $table DROP INDEX idx_user_content_interaction");
                }
                $wpdb->query("ALTER TABLE $table ADD INDEX idx_user_content_interaction (user_id(100), content_id(100), interaction_type)");

                if ($wpdb->get_var("SHOW INDEX FROM $table WHERE Key_name = 'idx_deduplication'")) {
                    $wpdb->query("ALTER TABLE $table DROP INDEX idx_deduplication");
                }
                $wpdb->query("ALTER TABLE $table ADD INDEX idx_deduplication (user_id(100), content_id(100), interaction_type, created_at)");
            }

            // Browser info: normalize prefixes
            $table = $wpdb->prefix . 'embedpress_analytics_browser_info';
            if ($wpdb->get_var($wpdb->prepare("SHOW TABLES LIKE %s", $table))) {
                if ($wpdb->get_var("SHOW INDEX FROM $table WHERE Key_name = 'unique_user_fingerprint'")) {
                    $wpdb->query("ALTER TABLE $table DROP INDEX unique_user_fingerprint");
                }
                $wpdb->query("ALTER TABLE $table ADD UNIQUE KEY unique_user_fingerprint (user_id(191), browser_fingerprint(50))");

                if ($wpdb->get_var("SHOW INDEX FROM $table WHERE Key_name = 'idx_user_id'")) {
                    $wpdb->query("ALTER TABLE $table DROP INDEX idx_user_id");
                }
                $wpdb->query("ALTER TABLE $table ADD INDEX idx_user_id (user_id(191))");

                if ($wpdb->get_var("SHOW INDEX FROM $table WHERE Key_name = 'idx_session_id'")) {
                    $wpdb->query("ALTER TABLE $table DROP INDEX idx_session_id");
                }
                $wpdb->query("ALTER TABLE $table ADD INDEX idx_session_id (session_id(191))");
            }

            // Referrers: normalize prefixes
            $table = $wpdb->prefix . 'embedpress_analytics_referrers';
            if ($wpdb->get_var($wpdb->prepare("SHOW TABLES LIKE %s", $table))) {
                if ($wpdb->get_var("SHOW INDEX FROM $table WHERE Key_name = 'unique_referrer_url'")) {
                    $wpdb->query("ALTER TABLE $table DROP INDEX unique_referrer_url");
                }
                $wpdb->query("ALTER TABLE $table ADD UNIQUE KEY unique_referrer_url (referrer_url(191))");

                if ($wpdb->get_var("SHOW INDEX FROM $table WHERE Key_name = 'idx_referrer_domain'")) {
                    $wpdb->query("ALTER TABLE $table DROP INDEX idx_referrer_domain");
                }
                $wpdb->query("ALTER TABLE $table ADD INDEX idx_referrer_domain (referrer_domain(191))");

                if ($wpdb->get_var("SHOW INDEX FROM $table WHERE Key_name = 'idx_utm_campaign'")) {
                    $wpdb->query("ALTER TABLE $table DROP INDEX idx_utm_campaign");
                }
                $wpdb->query("ALTER TABLE $table ADD INDEX idx_utm_campaign (utm_campaign(191))");
            }
        }
    }

    /**
     * Drop all analytics tables
     * Used for plugin uninstallation
     *
     * @return void
     */
    public static function drop_tables()
    {
        global $wpdb;

        $tables = [
            $wpdb->prefix . 'embedpress_analytics_content',
            $wpdb->prefix . 'embedpress_analytics_views',
            $wpdb->prefix . 'embedpress_analytics_browser_info',
            $wpdb->prefix . 'embedpress_analytics_milestones',
            $wpdb->prefix . 'embedpress_analytics_referrers'
        ];

        foreach ($tables as $table) {
            $wpdb->query("DROP TABLE IF EXISTS $table");
        }

        // Remove database version option
        delete_option('embedpress_analytics_db_version');
    }



    /**
     * Get table names with prefix
     *
     * @return array
     */
    public static function get_table_names()
    {
        global $wpdb;

        return [
            'content' => $wpdb->prefix . 'embedpress_analytics_content',
            'views' => $wpdb->prefix . 'embedpress_analytics_views',
            'browser_info' => $wpdb->prefix . 'embedpress_analytics_browser_info',
            'milestones' => $wpdb->prefix . 'embedpress_analytics_milestones',
            'referrers' => $wpdb->prefix . 'embedpress_analytics_referrers'
        ];
    }

    /**
     * Clean up old referrer visitor options that are no longer needed
     * These were used before we switched to using the views table for tracking
     *
     * @return void
     */
    private static function cleanup_old_referrer_visitor_options()
    {
        global $wpdb;

        // Get all options that match the old referrer visitor pattern
        $options = $wpdb->get_results(
            "SELECT option_name FROM {$wpdb->options}
             WHERE option_name LIKE 'embedpress_referrer_visitors_%'"
        );

        // Delete each option
        foreach ($options as $option) {
            delete_option($option->option_name);
        }

        // Log cleanup if any options were found
        if (!empty($options)) {
            error_log('EmbedPress: Cleaned up ' . count($options) . ' old referrer visitor options');
        }
    }
}
