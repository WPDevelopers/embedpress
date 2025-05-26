<?php

namespace EmbedPress\Includes\Classes\Analytics;

use EmbedPress\Includes\Classes\Database\Analytics_Schema;

defined('ABSPATH') or die("No direct script access allowed.");

/**
 * EmbedPress Analytics Data Collector
 * 
 * Handles data collection and storage for analytics
 * 
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2023 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       4.2.7
 */
class Data_Collector
{
    /**
     * Track content creation
     *
     * @param string $content_id
     * @param string $content_type
     * @param array $data
     * @return bool
     */
    public function track_content_creation($content_id, $content_type, $data = [])
    {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'embedpress_analytics_content';
        
        $insert_data = [
            'content_id' => sanitize_text_field($content_id),
            'content_type' => sanitize_text_field($content_type),
            'embed_type' => isset($data['embed_type']) ? sanitize_text_field($data['embed_type']) : '',
            'embed_url' => isset($data['embed_url']) ? esc_url_raw($data['embed_url']) : '',
            'post_id' => isset($data['post_id']) ? absint($data['post_id']) : get_the_ID(),
            'page_url' => isset($data['page_url']) ? esc_url_raw($data['page_url']) : get_permalink(),
            'title' => isset($data['title']) ? sanitize_text_field($data['title']) : get_the_title(),
            'created_at' => current_time('mysql'),
            'updated_at' => current_time('mysql')
        ];

        // Use INSERT ... ON DUPLICATE KEY UPDATE to handle existing content
        $sql = "INSERT INTO $table_name (content_id, content_type, embed_type, embed_url, post_id, page_url, title, created_at, updated_at) 
                VALUES (%s, %s, %s, %s, %d, %s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE 
                embed_type = VALUES(embed_type),
                embed_url = VALUES(embed_url),
                post_id = VALUES(post_id),
                page_url = VALUES(page_url),
                title = VALUES(title),
                updated_at = VALUES(updated_at)";

        $result = $wpdb->query($wpdb->prepare($sql, 
            $insert_data['content_id'],
            $insert_data['content_type'],
            $insert_data['embed_type'],
            $insert_data['embed_url'],
            $insert_data['post_id'],
            $insert_data['page_url'],
            $insert_data['title'],
            $insert_data['created_at'],
            $insert_data['updated_at']
        ));

        return $result !== false;
    }

    /**
     * Track interaction (view, click, impression, etc.)
     *
     * @param array $data
     * @return bool
     */
    public function track_interaction($data)
    {
        global $wpdb;
        
        $views_table = $wpdb->prefix . 'embedpress_analytics_views';
        $content_table = $wpdb->prefix . 'embedpress_analytics_content';
        
        // Insert interaction record
        $interaction_data = [
            'content_id' => sanitize_text_field($data['content_id']),
            'session_id' => sanitize_text_field($data['session_id']),
            'user_ip' => $this->get_user_ip(),
            'user_agent' => isset($_SERVER['HTTP_USER_AGENT']) ? sanitize_text_field($_SERVER['HTTP_USER_AGENT']) : '',
            'referrer_url' => isset($_SERVER['HTTP_REFERER']) ? esc_url_raw($_SERVER['HTTP_REFERER']) : '',
            'page_url' => isset($data['page_url']) ? esc_url_raw($data['page_url']) : '',
            'interaction_type' => sanitize_text_field($data['interaction_type']),
            'interaction_data' => isset($data['interaction_data']) ? wp_json_encode($data['interaction_data']) : null,
            'view_duration' => isset($data['view_duration']) ? absint($data['view_duration']) : 0,
            'created_at' => current_time('mysql')
        ];

        $result = $wpdb->insert($views_table, $interaction_data);

        if ($result) {
            // Update content table counters
            $this->update_content_counters($data['content_id'], $data['interaction_type']);
            
            // Store browser info if not already stored for this session
            $this->store_browser_info($data['session_id']);
        }

        return $result !== false;
    }

    /**
     * Update content counters
     *
     * @param string $content_id
     * @param string $interaction_type
     * @return void
     */
    private function update_content_counters($content_id, $interaction_type)
    {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'embedpress_analytics_content';
        
        $counter_field = '';
        switch ($interaction_type) {
            case 'view':
                $counter_field = 'total_views';
                break;
            case 'click':
                $counter_field = 'total_clicks';
                break;
            case 'impression':
                $counter_field = 'total_impressions';
                break;
            default:
                return;
        }

        $sql = "UPDATE $table_name SET $counter_field = $counter_field + 1, updated_at = %s WHERE content_id = %s";
        $wpdb->query($wpdb->prepare($sql, current_time('mysql'), $content_id));
    }

    /**
     * Store browser information
     *
     * @param string $session_id
     * @return void
     */
    private function store_browser_info($session_id)
    {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'embedpress_analytics_browser_info';
        
        // Check if browser info already exists for this session
        $exists = $wpdb->get_var($wpdb->prepare(
            "SELECT id FROM $table_name WHERE session_id = %s",
            $session_id
        ));

        if ($exists) {
            return;
        }

        $browser_detector = new Browser_Detector();
        $browser_info = $browser_detector->detect();

        $browser_data = [
            'session_id' => $session_id,
            'browser_name' => $browser_info['browser_name'],
            'browser_version' => $browser_info['browser_version'],
            'operating_system' => $browser_info['operating_system'],
            'device_type' => $browser_info['device_type'],
            'screen_resolution' => isset($_POST['screen_resolution']) ? sanitize_text_field($_POST['screen_resolution']) : null,
            'language' => isset($_POST['language']) ? sanitize_text_field($_POST['language']) : null,
            'timezone' => isset($_POST['timezone']) ? sanitize_text_field($_POST['timezone']) : null,
            'country' => $this->get_country_from_ip(),
            'user_agent' => isset($_SERVER['HTTP_USER_AGENT']) ? sanitize_text_field($_SERVER['HTTP_USER_AGENT']) : '',
            'created_at' => current_time('mysql')
        ];

        $wpdb->insert($table_name, $browser_data);
    }

    /**
     * Get user IP address
     *
     * @return string
     */
    private function get_user_ip()
    {
        $ip_keys = ['HTTP_X_FORWARDED_FOR', 'HTTP_X_REAL_IP', 'HTTP_CLIENT_IP', 'REMOTE_ADDR'];
        
        foreach ($ip_keys as $key) {
            if (!empty($_SERVER[$key])) {
                $ip = $_SERVER[$key];
                if (strpos($ip, ',') !== false) {
                    $ip = trim(explode(',', $ip)[0]);
                }
                if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                    return $ip;
                }
            }
        }
        
        return isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '';
    }

    /**
     * Get country from IP address
     *
     * @return string|null
     */
    private function get_country_from_ip()
    {
        // Simple implementation - in production, you might want to use a GeoIP service
        $ip = $this->get_user_ip();
        
        if (empty($ip) || $ip === '127.0.0.1' || strpos($ip, '192.168.') === 0) {
            return null;
        }

        // You can integrate with services like MaxMind GeoIP, ipapi.co, etc.
        // For now, return null
        return null;
    }

    /**
     * Get total content count by type
     *
     * @return array
     */
    public function get_total_content_by_type()
    {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'embedpress_analytics_content';
        
        $results = $wpdb->get_results(
            "SELECT content_type, COUNT(*) as count 
             FROM $table_name 
             GROUP BY content_type",
            ARRAY_A
        );

        $data = [
            'elementor' => 0,
            'gutenberg' => 0,
            'shortcode' => 0,
            'total' => 0
        ];

        foreach ($results as $result) {
            $data[$result['content_type']] = (int) $result['count'];
            $data['total'] += (int) $result['count'];
        }

        return $data;
    }

    /**
     * Get views analytics
     *
     * @param array $args
     * @return array
     */
    public function get_views_analytics($args = [])
    {
        global $wpdb;
        
        $content_table = $wpdb->prefix . 'embedpress_analytics_content';
        $views_table = $wpdb->prefix . 'embedpress_analytics_views';
        
        $date_range = isset($args['date_range']) ? $args['date_range'] : 30; // days
        $start_date = date('Y-m-d', strtotime("-$date_range days"));
        
        // Total views
        $total_views = $wpdb->get_var(
            "SELECT SUM(total_views) FROM $content_table"
        );

        // Daily views for the chart
        $daily_views = $wpdb->get_results($wpdb->prepare(
            "SELECT DATE(created_at) as date, COUNT(*) as views 
             FROM $views_table 
             WHERE interaction_type = 'view' AND DATE(created_at) >= %s
             GROUP BY DATE(created_at) 
             ORDER BY date ASC",
            $start_date
        ), ARRAY_A);

        // Top performing content
        $top_content = $wpdb->get_results(
            "SELECT content_id, embed_type, title, total_views, total_clicks, total_impressions 
             FROM $content_table 
             ORDER BY total_views DESC 
             LIMIT 10",
            ARRAY_A
        );

        return [
            'total_views' => (int) $total_views,
            'daily_views' => $daily_views,
            'top_content' => $top_content
        ];
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

    /**
     * Get analytics data
     *
     * @param array $args
     * @return array
     */
    public function get_analytics_data($args = [])
    {
        return [
            'content_by_type' => $this->get_total_content_by_type(),
            'views_analytics' => $this->get_views_analytics($args),
            'browser_analytics' => $this->get_browser_analytics($args)
        ];
    }
}
