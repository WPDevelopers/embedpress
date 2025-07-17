<?php

namespace EmbedPress\Includes\Classes\Analytics;

defined('ABSPATH') or die("No direct script access allowed.");

/**
 * EmbedPress Pro Analytics Data Collector
 *
 * Handles all pro analytics features
 *
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2023 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       4.2.7
 */
class Pro_Data_Collector
{
    /**
     * Get pro analytics data
     *
     * @param array $args
     * @return array
     */
    public function get_pro_analytics_data($args = [])
    {
        $data = [
            'unique_viewers_per_embed' => $this->get_unique_viewers_per_embed($args),
            'geo_analytics' => $this->get_geo_analytics($args),
            'device_analytics' => $this->get_device_analytics($args),
            'referral_analytics' => $this->get_referral_analytics($args),
            'browser_analytics' => $this->get_browser_analytics($args)
        ];

        return $data;
    }

    /**
     * Get detailed content analytics (per embed)
     *
     * @param array $args
     * @return array
     */
    public function get_detailed_content_analytics($args = [])
    {
        global $wpdb;

        $content_table = $wpdb->prefix . 'embedpress_analytics_content';
        $views_table = $wpdb->prefix . 'embedpress_analytics_views';

        return $wpdb->get_results(
            "SELECT
                c.content_id,
                c.embed_type,
                c.title,
                COALESCE(c.total_views, 0) as total_views,
                COALESCE(c.total_clicks, 0) as total_clicks,
                COALESCE(c.total_impressions, 0) as total_impressions,
                COALESCE(view_counts.actual_views, 0) as actual_views,
                COALESCE(click_counts.actual_clicks, 0) as actual_clicks,
                COALESCE(impression_counts.actual_impressions, 0) as actual_impressions
             FROM $content_table c
             LEFT JOIN (
                 SELECT content_id, COUNT(*) as actual_views
                 FROM $views_table
                 WHERE interaction_type = 'view'
                 GROUP BY content_id
             ) view_counts ON c.content_id = view_counts.content_id
             LEFT JOIN (
                 SELECT content_id, COUNT(*) as actual_clicks
                 FROM $views_table
                 WHERE interaction_type = 'click'
                 GROUP BY content_id
             ) click_counts ON c.content_id = click_counts.content_id
             LEFT JOIN (
                 SELECT content_id, COUNT(*) as actual_impressions
                 FROM $views_table
                 WHERE interaction_type = 'impression'
                 GROUP BY content_id
             ) impression_counts ON c.content_id = impression_counts.content_id
             ORDER BY GREATEST(c.total_views, COALESCE(view_counts.actual_views, 0)) DESC
             LIMIT 10",
            ARRAY_A
        );
    }

    /**
     * Get unique viewers per embed
     *
     * @param array $args
     * @return array
     */
    public function get_unique_viewers_per_embed($args = [])
    {
        global $wpdb;

        $views_table = $wpdb->prefix . 'embedpress_analytics_views';
        $content_table = $wpdb->prefix . 'embedpress_analytics_content';
        $date_range = isset($args['date_range']) ? absint($args['date_range']) : 30;

        $date_condition = '';
        if ($date_range > 0) {
            $date_condition = $wpdb->prepare(
                "AND v.created_at >= DATE_SUB(NOW(), INTERVAL %d DAY)",
                $date_range
            );
        }

        return $wpdb->get_results(
            "SELECT
                c.content_id,
                c.title,
                c.embed_type,
                COUNT(DISTINCT v.session_id) as unique_viewers,
                COUNT(CASE WHEN v.interaction_type = 'view' THEN v.id END) as total_views,
                COUNT(CASE WHEN v.interaction_type = 'click' THEN v.id END) as total_clicks,
                COUNT(CASE WHEN v.interaction_type = 'impression' THEN v.id END) as total_impressions
             FROM $content_table c
             LEFT JOIN $views_table v ON c.content_id = v.content_id
             WHERE v.interaction_type IN ('view', 'click', 'impression')
             $date_condition
             GROUP BY c.content_id
             ORDER BY unique_viewers DESC
             LIMIT 20",
            ARRAY_A
        );
    }

    /**
     * Get geo analytics
     *
     * @param array $args
     * @return array
     */
    public function get_geo_analytics($args = [])
    {
        // Check if pro feature is available
        if (!License_Manager::has_analytics_feature('geo_tracking')) {
            return [];
        }

        global $wpdb;

        $browser_table = $wpdb->prefix . 'embedpress_analytics_browser_info';
        $views_table = $wpdb->prefix . 'embedpress_analytics_views';
        $date_range = isset($args['date_range']) ? absint($args['date_range']) : 30;

        $date_condition = '';
        if ($date_range > 0) {
            $date_condition = $wpdb->prepare(
                "AND v.created_at >= DATE_SUB(NOW(), INTERVAL %d DAY)",
                $date_range
            );
        }

        // Get country distribution
        $countries = $wpdb->get_results(
            "SELECT
                COALESCE(b.country, 'Unknown') as country,
                COUNT(DISTINCT v.session_id) as visitors,
                COUNT(v.id) as total_interactions
             FROM $browser_table b
             INNER JOIN $views_table v ON b.session_id = v.session_id
             WHERE 1=1 $date_condition
             GROUP BY b.country
             ORDER BY visitors DESC
             LIMIT 20",
            ARRAY_A
        );

        // Get city distribution for top countries
        $cities = $wpdb->get_results(
            "SELECT
                COALESCE(b.country, 'Unknown') as country,
                COALESCE(b.city, 'Unknown') as city,
                COUNT(DISTINCT v.session_id) as visitors
             FROM $browser_table b
             INNER JOIN $views_table v ON b.session_id = v.session_id
             WHERE 1=1 $date_condition
             GROUP BY b.country, b.city
             ORDER BY visitors DESC
             LIMIT 50",
            ARRAY_A
        );

        error_log(print_r($countries, true));

        // If no real data, return sample data for testing
        if (empty($countries)) {
            $countries = [
                ['country' => 'United States', 'visitors' => 150, 'total_interactions' => 320],
                ['country' => 'United Kingdom', 'visitors' => 89, 'total_interactions' => 180],
                ['country' => 'Canada', 'visitors' => 67, 'total_interactions' => 145],
                ['country' => 'Germany', 'visitors' => 45, 'total_interactions' => 98],
                ['country' => 'France', 'visitors' => 38, 'total_interactions' => 82]
            ];
        }

        if (empty($cities)) {
            $cities = [
                ['country' => 'United States', 'city' => 'New York', 'visitors' => 45],
                ['country' => 'United States', 'city' => 'Los Angeles', 'visitors' => 38],
                ['country' => 'United Kingdom', 'city' => 'London', 'visitors' => 52],
                ['country' => 'Canada', 'city' => 'Toronto', 'visitors' => 28],
                ['country' => 'Germany', 'city' => 'Berlin', 'visitors' => 22]
            ];
        }

        return [
            'countries' => $countries,
            'cities' => $cities
        ];
    }

    /**
     * Get device analytics
     *
     * @param array $args
     * @return array
     */
    public function get_device_analytics($args = [])
    {
        // Check if pro feature is available
        if (!License_Manager::has_analytics_feature('device_analytics')) {
            return [];
        }

        global $wpdb;

        $browser_table = $wpdb->prefix . 'embedpress_analytics_browser_info';
        $views_table = $wpdb->prefix . 'embedpress_analytics_views';
        $date_range = isset($args['date_range']) ? absint($args['date_range']) : 30;

        $date_condition = '';
        if ($date_range > 0) {
            $date_condition = $wpdb->prepare(
                "AND v.created_at >= DATE_SUB(NOW(), INTERVAL %d DAY)",
                $date_range
            );
        }

        // Device type distribution
        $devices = $wpdb->get_results(
            "SELECT
                b.device_type,
                COUNT(DISTINCT v.session_id) as visitors,
                COUNT(v.id) as total_interactions
             FROM $browser_table b
             INNER JOIN $views_table v ON b.session_id = v.session_id
             WHERE 1=1 $date_condition
             GROUP BY b.device_type
             ORDER BY visitors DESC",
            ARRAY_A
        );

        // Screen resolution distribution
        $resolutions = $wpdb->get_results(
            "SELECT
                b.screen_resolution,
                COUNT(DISTINCT v.session_id) as visitors
             FROM $browser_table b
             INNER JOIN $views_table v ON b.session_id = v.session_id
             WHERE b.screen_resolution IS NOT NULL AND b.screen_resolution != ''
             $date_condition
             GROUP BY b.screen_resolution
             ORDER BY visitors DESC
             LIMIT 10",
            ARRAY_A
        );

        // If no real data, return sample data for testing
        if (empty($devices)) {
            $devices = [
                ['device_type' => 'desktop', 'visitors' => 245, 'total_interactions' => 520],
                ['device_type' => 'mobile', 'visitors' => 189, 'total_interactions' => 380],
                ['device_type' => 'tablet', 'visitors' => 67, 'total_interactions' => 145]
            ];
        }

        if (empty($resolutions)) {
            $resolutions = [
                ['screen_resolution' => '1920x1080', 'visitors' => 156],
                ['screen_resolution' => '1366x768', 'visitors' => 89],
                ['screen_resolution' => '375x667', 'visitors' => 78],
                ['screen_resolution' => '414x896', 'visitors' => 65],
                ['screen_resolution' => '768x1024', 'visitors' => 45]
            ];
        }

        return [
            'devices' => $devices,
            'resolutions' => $resolutions
        ];
    }

    /**
     * Get referral analytics
     *
     * @param array $args
     * @return array
     */
    public function get_referral_analytics($args = [])
    {
        global $wpdb;

        $views_table = $wpdb->prefix . 'embedpress_analytics_views';
        $date_range = isset($args['date_range']) ? absint($args['date_range']) : 30;

        $date_condition = '';
        if ($date_range > 0) {
            $date_condition = $wpdb->prepare(
                "AND created_at >= DATE_SUB(NOW(), INTERVAL %d DAY)",
                $date_range
            );
        }

        return $wpdb->get_results(
            "SELECT
                CASE
                    WHEN referrer_url IS NULL OR referrer_url = '' THEN 'Direct'
                    WHEN referrer_url LIKE '%google.%' THEN 'Google'
                    WHEN referrer_url LIKE '%facebook.%' THEN 'Facebook'
                    WHEN referrer_url LIKE '%twitter.%' THEN 'Twitter'
                    WHEN referrer_url LIKE '%linkedin.%' THEN 'LinkedIn'
                    WHEN referrer_url LIKE '%youtube.%' THEN 'YouTube'
                    ELSE SUBSTRING_INDEX(SUBSTRING_INDEX(referrer_url, '/', 3), '/', -1)
                END as referrer_source,
                COUNT(DISTINCT session_id) as visitors,
                COUNT(*) as total_visits
             FROM $views_table
             WHERE interaction_type IN ('view', 'impression')
             $date_condition
             GROUP BY referrer_source
             ORDER BY visitors DESC
             LIMIT 20",
            ARRAY_A
        );
    }

    /**
     * Get browser analytics
     *
     * @param array $args
     * @return array
     */
    public function get_browser_analytics($args = [])
    {
        global $wpdb;

        $table_name = $wpdb->prefix . 'embedpress_analytics_browser_info';

        // Browser distribution
        $browsers = $wpdb->get_results(
            "SELECT browser_name, COUNT(*) as count
             FROM $table_name
             WHERE browser_name IS NOT NULL
             GROUP BY browser_name
             ORDER BY count DESC",
            ARRAY_A
        );

        // Operating system distribution
        $os = $wpdb->get_results(
            "SELECT operating_system, COUNT(*) as count
             FROM $table_name
             WHERE operating_system IS NOT NULL
             GROUP BY operating_system
             ORDER BY count DESC",
            ARRAY_A
        );

        // Device type distribution
        $devices = $wpdb->get_results(
            "SELECT device_type, COUNT(*) as count
             FROM $table_name
             GROUP BY device_type
             ORDER BY count DESC",
            ARRAY_A
        );

        return [
            'browsers' => $browsers,
            'operating_systems' => $os,
            'devices' => $devices
        ];
    }
}
