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
     * Build date condition for SQL queries
     *
     * @param array $args
     * @param string $date_column
     * @return string
     */
    private function build_date_condition($args = [], $date_column = 'created_at')
    {
        global $wpdb;

        $date_condition = '';

        // Check if specific start_date and end_date are provided
        if (!empty($args['start_date']) && !empty($args['end_date'])) {
            $start_date = sanitize_text_field($args['start_date']);
            $end_date = sanitize_text_field($args['end_date']);

            // Validate date format (YYYY-MM-DD)
            if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $start_date) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $end_date)) {
                $date_condition = $wpdb->prepare(
                    "AND DATE($date_column) BETWEEN %s AND %s",
                    $start_date,
                    $end_date
                );
            }
        } else {
            // Fall back to date_range (number of days)
            $date_range = isset($args['date_range']) ? absint($args['date_range']) : 30;

            if ($date_range > 0) {
                $date_condition = $wpdb->prepare(
                    "AND $date_column >= DATE_SUB(NOW(), INTERVAL %d DAY)",
                    $date_range
                );
            }
        }
        return $date_condition;
    }

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
        $date_condition = $this->build_date_condition($args, 'created_at');

        $order_by_total_views = isset($args['order_by_total_views']) ? (bool) $args['order_by_total_views'] : false;

        // Handle limit parameter
        $limit = isset($args['limit']) ? (int) $args['limit'] : 20;
        $limit_clause = $limit > 0 ? "LIMIT $limit" : '';

        // Build the date condition for subqueries
        $subquery_date_condition = '';
        if (!empty($date_condition)) {
            $subquery_date_condition = str_replace('AND ', 'AND ', $date_condition);
        }

        if (!empty($date_condition)) {
            // Date filtering applied
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
             INNER JOIN (
                 SELECT DISTINCT content_id
                 FROM $views_table
                 WHERE 1=1 $subquery_date_condition
             ) active_content ON c.content_id = active_content.content_id
             LEFT JOIN (
                 SELECT content_id,
                        (COUNT(CASE WHEN interaction_type = 'view' THEN 1 END) +
                         COALESCE(SUM(CASE WHEN (interaction_type = 'combined' OR interaction_type = '' OR interaction_type IS NULL) THEN JSON_EXTRACT(interaction_data, '$.view_count') END), 0)) as actual_views
                 FROM $views_table
                 WHERE (interaction_type = 'view' OR interaction_type = 'combined' OR interaction_type = '' OR interaction_type IS NULL) $subquery_date_condition
                 GROUP BY content_id
             ) view_counts ON c.content_id = view_counts.content_id
             LEFT JOIN (
                 SELECT content_id,
                        (COUNT(CASE WHEN interaction_type = 'click' THEN 1 END) +
                         COALESCE(SUM(CASE WHEN (interaction_type = 'combined' OR interaction_type = '' OR interaction_type IS NULL) THEN JSON_EXTRACT(interaction_data, '$.click_count') END), 0)) as actual_clicks
                 FROM $views_table
                 WHERE (interaction_type = 'click' OR interaction_type = 'combined' OR interaction_type = '' OR interaction_type IS NULL) $subquery_date_condition
                 GROUP BY content_id
             ) click_counts ON c.content_id = click_counts.content_id
             LEFT JOIN (
                 SELECT content_id,
                        (COUNT(CASE WHEN interaction_type = 'impression' THEN 1 END) +
                         COALESCE(SUM(CASE WHEN (interaction_type = 'combined' OR interaction_type = '' OR interaction_type IS NULL) THEN JSON_EXTRACT(interaction_data, '$.impression_count') END), 0)) as actual_impressions
                 FROM $views_table
                 WHERE (interaction_type = 'impression' OR interaction_type = 'combined' OR interaction_type = '' OR interaction_type IS NULL) $subquery_date_condition
                 GROUP BY content_id
             ) impression_counts ON c.content_id = impression_counts.content_id
             ORDER BY " . ($order_by_total_views ? "COALESCE(c.total_views, 0)" : "COALESCE(view_counts.actual_views, 0)") . " DESC
             $limit_clause",
                ARRAY_A
            );
        } else {
            // No date filtering
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
                 SELECT content_id,
                        (COUNT(CASE WHEN interaction_type = 'view' THEN 1 END) +
                         COALESCE(SUM(CASE WHEN (interaction_type = 'combined' OR interaction_type = '' OR interaction_type IS NULL) THEN JSON_EXTRACT(interaction_data, '$.view_count') END), 0)) as actual_views
                 FROM $views_table
                 WHERE interaction_type IN ('view', 'combined', '') OR interaction_type IS NULL
                 GROUP BY content_id
             ) view_counts ON c.content_id = view_counts.content_id
             LEFT JOIN (
                 SELECT content_id,
                        (COUNT(CASE WHEN interaction_type = 'click' THEN 1 END) +
                         COALESCE(SUM(CASE WHEN (interaction_type = 'combined' OR interaction_type = '' OR interaction_type IS NULL) THEN JSON_EXTRACT(interaction_data, '$.click_count') END), 0)) as actual_clicks
                 FROM $views_table
                 WHERE interaction_type IN ('click', 'combined', '') OR interaction_type IS NULL
                 GROUP BY content_id
             ) click_counts ON c.content_id = click_counts.content_id
             LEFT JOIN (
                 SELECT content_id,
                        (COUNT(CASE WHEN interaction_type = 'impression' THEN 1 END) +
                         COALESCE(SUM(CASE WHEN (interaction_type = 'combined' OR interaction_type = '' OR interaction_type IS NULL) THEN JSON_EXTRACT(interaction_data, '$.impression_count') END), 0)) as actual_impressions
                 FROM $views_table
                 WHERE interaction_type IN ('impression', 'combined', '') OR interaction_type IS NULL
                 GROUP BY content_id
             ) impression_counts ON c.content_id = impression_counts.content_id
             ORDER BY COALESCE(c.total_views, 0) DESC
             $limit_clause",
                ARRAY_A
            );
        }
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
        $date_condition = $this->build_date_condition($args, 'v.created_at');

        return $wpdb->get_results(
            "SELECT
                c.content_id,
                c.title,
                c.embed_type,
                COUNT(DISTINCT v.session_id) as unique_viewers,
                (COUNT(CASE WHEN v.interaction_type = 'view' THEN v.id END) +
                 COALESCE(SUM(CASE WHEN (v.interaction_type = 'combined' OR v.interaction_type = '' OR v.interaction_type IS NULL) THEN JSON_EXTRACT(v.interaction_data, '$.view_count') END), 0)) as total_views,
                (COUNT(CASE WHEN v.interaction_type = 'click' THEN v.id END) +
                 COALESCE(SUM(CASE WHEN (v.interaction_type = 'combined' OR v.interaction_type = '' OR v.interaction_type IS NULL) THEN JSON_EXTRACT(v.interaction_data, '$.click_count') END), 0)) as total_clicks,
                (COUNT(CASE WHEN v.interaction_type = 'impression' THEN v.id END) +
                 COALESCE(SUM(CASE WHEN (v.interaction_type = 'combined' OR v.interaction_type = '' OR v.interaction_type IS NULL) THEN JSON_EXTRACT(v.interaction_data, '$.impression_count') END), 0)) as total_impressions
             FROM $content_table c
             LEFT JOIN $views_table v ON c.content_id = v.content_id
             WHERE (v.interaction_type IN ('view', 'click', 'impression', 'combined') OR v.interaction_type = '' OR v.interaction_type IS NULL)
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
        $date_condition = $this->build_date_condition($args, 'v.created_at');

        // Get country distribution with separate clicks, views, impressions
        $countries = $wpdb->get_results(
            "SELECT
                COALESCE(b.country, 'Unknown') as country,
                COUNT(DISTINCT v.session_id) as visitors,
                (COUNT(CASE WHEN v.interaction_type = 'view' THEN v.id END) +
                 COALESCE(SUM(CASE WHEN (v.interaction_type = 'combined' OR v.interaction_type = '' OR v.interaction_type IS NULL) THEN JSON_EXTRACT(v.interaction_data, '$.view_count') END), 0)) as views,
                (COUNT(CASE WHEN v.interaction_type = 'click' THEN v.id END) +
                 COALESCE(SUM(CASE WHEN (v.interaction_type = 'combined' OR v.interaction_type = '' OR v.interaction_type IS NULL) THEN JSON_EXTRACT(v.interaction_data, '$.click_count') END), 0)) as clicks,
                (COUNT(CASE WHEN v.interaction_type = 'impression' THEN v.id END) +
                 COALESCE(SUM(CASE WHEN (v.interaction_type = 'combined' OR v.interaction_type = '' OR v.interaction_type IS NULL) THEN JSON_EXTRACT(v.interaction_data, '$.impression_count') END), 0)) as impressions,
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


        // Return real data only - no sample data fallback
        if (empty($countries)) {
            $countries = [];
        }

        if (empty($cities)) {
            $cities = [];
        }

        return [
            'countries' => $countries,
            'cities' => $cities
        ];
    }

    /**
     * Get combined monthly analytics for spline chart (Jan-Dec)
     *
     * @param array $args
     * @return array
     */
    public function get_daily_combined_analytics($args = [])
    {
        global $wpdb;

        $views_table = $wpdb->prefix . 'embedpress_analytics_views';
        $date_condition = $this->build_date_condition($args, 'created_at');

        // If date filtering is applied, return empty data for past dates
        if (!empty($date_condition)) {
            // Check if the date range has any data
            $has_data = $wpdb->get_var(
                "SELECT COUNT(*) FROM $views_table WHERE 1=1 $date_condition"
            );

            if (!$has_data) {
                // Return empty monthly data for all months
                $chart_data = [];
                $months = [
                    1 => 'JAN',
                    2 => 'FEB',
                    3 => 'MAR',
                    4 => 'APR',
                    5 => 'MAY',
                    6 => 'JUN',
                    7 => 'JUL',
                    8 => 'AUG',
                    9 => 'SEP',
                    10 => 'OCT',
                    11 => 'NOV',
                    12 => 'DEC'
                ];

                for ($month = 1; $month <= 12; $month++) {
                    $chart_data[] = [
                        'month' => $months[$month],
                        'views' => 0,
                        'clicks' => 0,
                        'impressions' => 0
                    ];
                }

                return $chart_data;
            }
        }

        $current_year = date('Y');

        // Get monthly data for current year
        $monthly_data = $wpdb->get_results($wpdb->prepare(
            "SELECT
                MONTH(created_at) as month_num,
                MONTHNAME(created_at) as month_name,
                (SUM(CASE WHEN interaction_type = 'view' THEN 1 ELSE 0 END) +
                 COALESCE(SUM(CASE WHEN (interaction_type = 'combined' OR interaction_type = '' OR interaction_type IS NULL) THEN JSON_EXTRACT(interaction_data, '$.view_count') END), 0)) as views,
                (SUM(CASE WHEN interaction_type = 'click' THEN 1 ELSE 0 END) +
                 COALESCE(SUM(CASE WHEN (interaction_type = 'combined' OR interaction_type = '' OR interaction_type IS NULL) THEN JSON_EXTRACT(interaction_data, '$.click_count') END), 0)) as clicks,
                (SUM(CASE WHEN interaction_type = 'impression' THEN 1 ELSE 0 END) +
                 COALESCE(SUM(CASE WHEN (interaction_type = 'combined' OR interaction_type = '' OR interaction_type IS NULL) THEN JSON_EXTRACT(interaction_data, '$.impression_count') END), 0)) as impressions
             FROM $views_table
             WHERE YEAR(created_at) = %d
             GROUP BY MONTH(created_at), MONTHNAME(created_at)
             ORDER BY MONTH(created_at) ASC",
            $current_year
        ), ARRAY_A);

        // Create array for all 12 months
        $months = [
            1 => 'JAN',
            2 => 'FEB',
            3 => 'MAR',
            4 => 'APR',
            5 => 'MAY',
            6 => 'JUN',
            7 => 'JUL',
            8 => 'AUG',
            9 => 'SEP',
            10 => 'OCT',
            11 => 'NOV',
            12 => 'DEC'
        ];

        $chart_data = [];

        for ($month = 1; $month <= 12; $month++) {
            // Find data for this month
            $month_data = null;
            foreach ($monthly_data as $data) {
                if ((int) $data['month_num'] === $month) {
                    $month_data = $data;
                    break;
                }
            }

            // Add some realistic variation to the data if no real data exists
            $base_views = $month_data ? (int) $month_data['views'] : 0;
            $base_clicks = $month_data ? (int) $month_data['clicks'] : 0;
            $base_impressions = $month_data ? (int) $month_data['impressions'] : 0;

            $chart_data[] = [
                'month' => $months[$month],
                'views' => (int) $base_views,
                'clicks' => (int) $base_clicks,
                'impressions' => (int) $base_impressions
            ];
        }

        return $chart_data;
    }

    /**
     * Get seasonal factor for realistic data variation
     *
     * @param int $month
     * @return float
     */
    private function get_seasonal_factor($month)
    {
        // Simulate seasonal trends (higher activity in certain months)
        $factors = [
            1 => 0.8,  // Jan - lower after holidays
            2 => 0.9,  // Feb
            3 => 1.1,  // Mar - spring increase
            4 => 1.0,  // Apr
            5 => 0.9,  // May
            6 => 0.8,  // Jun - summer dip
            7 => 1.2,  // Jul - summer peak
            8 => 1.0,  // Aug
            9 => 1.3,  // Sep - back to school/work
            10 => 1.4, // Oct - peak activity
            11 => 1.5, // Nov - holiday season
            12 => 1.2  // Dec - holiday season
        ];

        return $factors[$month] ?? 1.0;
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
        $date_condition = $this->build_date_condition($args, 'v.created_at');

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

        // Return real data only - no sample data fallback
        if (empty($devices)) {
            $devices = [];
        }

        if (empty($resolutions)) {
            $resolutions = [];
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
        $date_condition = $this->build_date_condition($args, 'created_at');

        $results = $wpdb->get_results(
            "SELECT
                CASE
                    WHEN referrer_url IS NULL OR referrer_url = '' THEN 'Direct'
                    WHEN referrer_url LIKE '%google.%' THEN 'Google'
                    WHEN referrer_url LIKE '%facebook.%' OR referrer_url LIKE '%l.facebook.com%' OR referrer_url LIKE '%fbclid%' THEN 'Facebook'
                    WHEN referrer_url LIKE '%twitter.%' OR referrer_url LIKE '%t.co%' THEN 'Twitter'
                    WHEN referrer_url LIKE '%linkedin.%' THEN 'LinkedIn'
                    WHEN referrer_url LIKE '%youtube.%' THEN 'YouTube'
                    WHEN referrer_url LIKE '%instagram.%' THEN 'Instagram'
                    WHEN referrer_url LIKE '%tiktok.%' THEN 'TikTok'
                    ELSE SUBSTRING_INDEX(SUBSTRING_INDEX(referrer_url, '/', 3), '/', -1)
                END as referrer_source,
                COUNT(DISTINCT session_id) as visitors,
                COUNT(*) as total_visits,
                referrer_url
             FROM $views_table
             WHERE (interaction_type IN ('view', 'impression', 'combined') OR interaction_type = '' OR interaction_type IS NULL)
             $date_condition
             GROUP BY referrer_source, referrer_url
             ORDER BY visitors DESC
             LIMIT 100",
            ARRAY_A
        );

        // Process results to extract UTM parameters and calculate percentages
        $total_visits_sum = 0;

        // First pass: calculate total visits for percentage calculation
        foreach ($results as $result) {
            $total_visits_sum += intval($result['total_visits']);
        }

        // Group by source and extract UTM parameters
        $grouped_sources = [];
        foreach ($results as $result) {
            $source = $result['referrer_source'];
            $utm_source = $this->extract_utm_parameter($result['referrer_url'], 'utm_source');
            $utm_medium = $this->extract_utm_parameter($result['referrer_url'], 'utm_medium');
            $utm_campaign = $this->extract_utm_parameter($result['referrer_url'], 'utm_campaign');

            // Use UTM source if available, otherwise use referrer source
            if (!empty($utm_source)) {
                $source = $utm_source;
                if (!empty($utm_medium)) {
                    $source .= ' (' . $utm_medium . ')';
                }
                if (!empty($utm_campaign)) {
                    $source .= ' - ' . $utm_campaign;
                }
            }

            if (!isset($grouped_sources[$source])) {
                $grouped_sources[$source] = [
                    'source' => $source,
                    'visitors' => 0,
                    'total_visits' => 0,
                    'utm_data' => [
                        'utm_source' => $utm_source,
                        'utm_medium' => $utm_medium,
                        'utm_campaign' => $utm_campaign
                    ]
                ];
            }

            $grouped_sources[$source]['visitors'] += intval($result['visitors']);
            $grouped_sources[$source]['total_visits'] += intval($result['total_visits']);
        }

        // Calculate percentages and format final results
        foreach ($grouped_sources as &$source_data) {
            $percentage = $total_visits_sum > 0 ? round(($source_data['total_visits'] / $total_visits_sum) * 100, 1) : 0;
            $source_data['percentage'] = $percentage;
        }

        // Sort by visitors and limit to top 20
        uasort($grouped_sources, function($a, $b) {
            return $b['visitors'] - $a['visitors'];
        });

        $final_results = array_slice(array_values($grouped_sources), 0, 20);

        // Return structured data for frontend
        return [
            'referral_sources' => $final_results,
            'total_sources' => count($final_results),
            'total_visits' => $total_visits_sum
        ];
    }

    /**
     * Extract UTM parameter from URL
     *
     * @param string $url
     * @param string $parameter
     * @return string
     */
    private function extract_utm_parameter($url, $parameter)
    {
        if (empty($url)) {
            return '';
        }

        $parsed_url = parse_url($url);
        if (!isset($parsed_url['query'])) {
            return '';
        }

        parse_str($parsed_url['query'], $query_params);
        return isset($query_params[$parameter]) ? sanitize_text_field($query_params[$parameter]) : '';
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
        $date_condition = $this->build_date_condition($args, 'created_at');

        // Browser distribution
        $browsers = $wpdb->get_results(
            "SELECT browser_name, COUNT(*) as count
             FROM $table_name
             WHERE browser_name IS NOT NULL
             $date_condition
             GROUP BY browser_name
             ORDER BY count DESC",
            ARRAY_A
        );

        // Operating system distribution
        $os = $wpdb->get_results(
            "SELECT operating_system, COUNT(*) as count
             FROM $table_name
             WHERE operating_system IS NOT NULL
             $date_condition
             GROUP BY operating_system
             ORDER BY count DESC",
            ARRAY_A
        );

        // Device type distribution
        $devices = $wpdb->get_results(
            "SELECT device_type, COUNT(*) as count
             FROM $table_name
             WHERE device_type IS NOT NULL
             $date_condition
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
