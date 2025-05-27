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
 * @copyright   Copyright (C) 2023 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       4.2.7
 */
class Analytics_Schema
{
    /**
     * Database version for schema updates
     */
    const DB_VERSION = '1.0.0';

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


        if (version_compare($current_version, self::DB_VERSION, '<')) {

            self::create_content_table($charset_collate);
            self::create_views_table($charset_collate);
            self::create_browser_info_table($charset_collate);
            self::create_milestones_table($charset_collate);

            // Update database version
            update_option('embedpress_analytics_db_version', self::DB_VERSION);
        }
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
            content_type enum('elementor', 'gutenberg', 'shortcode') NOT NULL,
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
            UNIQUE KEY unique_content (content_id, content_type),
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
            KEY idx_content_id (content_id),
            KEY idx_session_id (session_id),
            KEY idx_interaction_type (interaction_type),
            KEY idx_created_at (created_at),
            KEY idx_user_ip (user_ip),
            KEY idx_content_interaction (content_id, interaction_type),
            KEY idx_daily_stats (content_id, interaction_type, created_at)
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
            session_id varchar(255) NOT NULL,
            browser_name varchar(100) DEFAULT NULL,
            browser_version varchar(50) DEFAULT NULL,
            operating_system varchar(100) DEFAULT NULL,
            device_type enum('desktop', 'mobile', 'tablet', 'unknown') DEFAULT 'unknown',
            screen_resolution varchar(20) DEFAULT NULL,
            language varchar(10) DEFAULT NULL,
            timezone varchar(50) DEFAULT NULL,
            country varchar(5) DEFAULT NULL,
            city varchar(100) DEFAULT NULL,
            user_agent text DEFAULT NULL,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY unique_session (session_id),
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
            $wpdb->prefix . 'embedpress_analytics_milestones'
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
            'milestones' => $wpdb->prefix . 'embedpress_analytics_milestones'
        ];
    }
}
