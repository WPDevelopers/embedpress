<?php

namespace EmbedPress\Includes\Classes\Analytics;

use EmbedPress\Includes\Classes\Database\Analytics_Schema;
use EmbedPress\Includes\Classes\Analytics\License_Manager;

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
    private $license_manager;
    private $pro_collector;

    public function __construct() {
        $this->license_manager = new License_Manager();
        if ($this->license_manager->has_pro_license()) {
            $this->pro_collector = new Pro_Data_Collector();
        }
    }

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

            // Browser info is now stored from frontend via REST API
            // $this->store_browser_info($data['session_id']);
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

        // First check if content record exists
        $content_exists = $wpdb->get_var($wpdb->prepare(
            "SELECT id FROM $table_name WHERE content_id = %s",
            $content_id
        ));

        if ($content_exists) {
            // Update existing record
            $sql = "UPDATE $table_name SET $counter_field = $counter_field + 1, updated_at = %s WHERE content_id = %s";
            $wpdb->query($wpdb->prepare($sql, current_time('mysql'), $content_id));
        } else {
            // Create new record with the counter set to 1
            $insert_data = [
                'content_id' => $content_id,
                'content_type' => 'unknown', // We don't know the type at this point
                'embed_type' => 'unknown',
                'embed_url' => '',
                'post_id' => null,
                'page_url' => '',
                'title' => 'Unknown Content',
                'total_views' => $interaction_type === 'view' ? 1 : 0,
                'total_clicks' => $interaction_type === 'click' ? 1 : 0,
                'total_impressions' => $interaction_type === 'impression' ? 1 : 0,
                'created_at' => current_time('mysql'),
                'updated_at' => current_time('mysql')
            ];

            $wpdb->insert($table_name, $insert_data);
        }
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

        $geo_data = $this->get_geo_data_from_ip();

        error_log('EmbedPress Geo Debug - Geo data: ' . print_r($geo_data, true));

        $browser_data = [
            'session_id' => $session_id,
            'browser_name' => $browser_info['browser_name'],
            'browser_version' => $browser_info['browser_version'],
            'operating_system' => $browser_info['operating_system'],
            'device_type' => $browser_info['device_type'],
            'screen_resolution' => isset($_POST['screen_resolution']) ? sanitize_text_field($_POST['screen_resolution']) : null,
            'language' => isset($_POST['language']) ? sanitize_text_field($_POST['language']) : null,
            'timezone' => isset($_POST['timezone']) ? sanitize_text_field($_POST['timezone']) : null,
            'country' => $geo_data['country'],
            'city' => $geo_data['city'],
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
     * Get geo data (country and city) from IP address
     *
     * @return array
     */
    private function get_geo_data_from_ip()
    {
        $ip = $this->get_user_ip();

        if (empty($ip) || $ip === '127.0.0.1' || strpos($ip, '192.168.') === 0 || strpos($ip, '10.') === 0) {
            return ['country' => null, 'city' => null];
        }

        // Check cache first
        $cache_key = 'embedpress_geo_' . md5($ip);
        $cached_data = get_transient($cache_key);

        if ($cached_data !== false) {
            return $cached_data;
        }

        // Try to get geo data from IP using free API
        $geo_data = $this->fetch_geo_data_from_api($ip);

        // Debug logging (backend geo-location - now deprecated)
        // error_log('EmbedPress Geo Debug - IP: ' . $ip);
        // error_log('EmbedPress Geo Debug - Result: ' . print_r($geo_data, true));

        // Cache the result for 24 hours
        set_transient($cache_key, $geo_data, DAY_IN_SECONDS);

        return $geo_data;
    }

    /**
     * Get country from IP address (backward compatibility)
     *
     * @return string|null
     */
    private function get_country_from_ip()
    {
        $geo_data = $this->get_geo_data_from_ip();
        return $geo_data['country'];
    }

    /**
     * Fetch geo data (country and city) from geo-location API
     *
     * @param string $ip
     * @return array
     */
    private function fetch_geo_data_from_api($ip)
    {
        // Try multiple free geo-location services
        $services = [
            'ip-api.com' => "http://ip-api.com/json/{$ip}?fields=country,city",
            'ipapi.co' => "https://ipapi.co/{$ip}/json/",
            'ipinfo.io' => "https://ipinfo.io/{$ip}/json"
        ];

        foreach ($services as $service_name => $url) {
            // Debug logging (backend geo-location - now deprecated)
            // error_log("EmbedPress Geo Debug - Trying service: $service_name with URL: $url");

            $response = wp_remote_get($url, [
                'timeout' => 5,
                'user-agent' => 'EmbedPress Analytics'
            ]);

            if (is_wp_error($response)) {
                // error_log("EmbedPress Geo Debug - Error with $service_name: " . $response->get_error_message());
                continue;
            }

            $body = wp_remote_retrieve_body($response);
            // error_log("EmbedPress Geo Debug - Response from $service_name: " . $body);

            $country = null;
            $city = null;

            switch ($service_name) {
                case 'ip-api.com':
                    $data = json_decode($body, true);
                    if (isset($data['country']) && !empty($data['country'])) {
                        $country = $data['country'];
                    }
                    if (isset($data['city']) && !empty($data['city'])) {
                        $city = $data['city'];
                    }
                    break;

                case 'ipapi.co':
                    $data = json_decode($body, true);
                    if (isset($data['country_name']) && !empty($data['country_name']) && $data['country_name'] !== 'Undefined') {
                        $country = $data['country_name'];
                    }
                    if (isset($data['city']) && !empty($data['city']) && $data['city'] !== 'Undefined') {
                        $city = $data['city'];
                    }
                    break;

                case 'ipinfo.io':
                    $data = json_decode($body, true);
                    if (isset($data['country']) && !empty($data['country'])) {
                        if (strlen($data['country']) === 2) {
                            // Convert country code to country name
                            $country = $this->get_country_name_from_code($data['country']);
                        } else {
                            $country = $data['country'];
                        }
                    }
                    if (isset($data['city']) && !empty($data['city'])) {
                        $city = $data['city'];
                    }
                    break;
            }

            if (!empty($country) && $country !== 'Unknown') {
                return [
                    'country' => $country,
                    'city' => $city
                ];
            }
        }

        return ['country' => null, 'city' => null];
    }

    /**
     * Convert country code to country name
     *
     * @param string $code
     * @return string|null
     */
    private function get_country_name_from_code($code)
    {
        $countries = [
            'US' => 'United States',
            'GB' => 'United Kingdom',
            'CA' => 'Canada',
            'AU' => 'Australia',
            'DE' => 'Germany',
            'FR' => 'France',
            'IT' => 'Italy',
            'ES' => 'Spain',
            'NL' => 'Netherlands',
            'BE' => 'Belgium',
            'CH' => 'Switzerland',
            'AT' => 'Austria',
            'SE' => 'Sweden',
            'NO' => 'Norway',
            'DK' => 'Denmark',
            'FI' => 'Finland',
            'PL' => 'Poland',
            'CZ' => 'Czech Republic',
            'HU' => 'Hungary',
            'RO' => 'Romania',
            'BG' => 'Bulgaria',
            'HR' => 'Croatia',
            'SI' => 'Slovenia',
            'SK' => 'Slovakia',
            'LT' => 'Lithuania',
            'LV' => 'Latvia',
            'EE' => 'Estonia',
            'IE' => 'Ireland',
            'PT' => 'Portugal',
            'GR' => 'Greece',
            'CY' => 'Cyprus',
            'MT' => 'Malta',
            'LU' => 'Luxembourg',
            'JP' => 'Japan',
            'KR' => 'South Korea',
            'CN' => 'China',
            'IN' => 'India',
            'BR' => 'Brazil',
            'MX' => 'Mexico',
            'AR' => 'Argentina',
            'CL' => 'Chile',
            'CO' => 'Colombia',
            'PE' => 'Peru',
            'VE' => 'Venezuela',
            'ZA' => 'South Africa',
            'EG' => 'Egypt',
            'NG' => 'Nigeria',
            'KE' => 'Kenya',
            'MA' => 'Morocco',
            'TN' => 'Tunisia',
            'DZ' => 'Algeria',
            'RU' => 'Russia',
            'UA' => 'Ukraine',
            'BY' => 'Belarus',
            'TR' => 'Turkey',
            'IL' => 'Israel',
            'SA' => 'Saudi Arabia',
            'AE' => 'United Arab Emirates',
            'QA' => 'Qatar',
            'KW' => 'Kuwait',
            'BH' => 'Bahrain',
            'OM' => 'Oman',
            'JO' => 'Jordan',
            'LB' => 'Lebanon',
            'SY' => 'Syria',
            'IQ' => 'Iraq',
            'IR' => 'Iran',
            'AF' => 'Afghanistan',
            'PK' => 'Pakistan',
            'BD' => 'Bangladesh',
            'LK' => 'Sri Lanka',
            'NP' => 'Nepal',
            'BT' => 'Bhutan',
            'MV' => 'Maldives',
            'TH' => 'Thailand',
            'VN' => 'Vietnam',
            'MY' => 'Malaysia',
            'SG' => 'Singapore',
            'ID' => 'Indonesia',
            'PH' => 'Philippines',
            'MM' => 'Myanmar',
            'KH' => 'Cambodia',
            'LA' => 'Laos',
            'BN' => 'Brunei',
            'TL' => 'East Timor',
            'NZ' => 'New Zealand',
            'FJ' => 'Fiji',
            'PG' => 'Papua New Guinea',
            'SB' => 'Solomon Islands',
            'VU' => 'Vanuatu',
            'NC' => 'New Caledonia',
            'PF' => 'French Polynesia',
            'WS' => 'Samoa',
            'TO' => 'Tonga',
            'KI' => 'Kiribati',
            'TV' => 'Tuvalu',
            'NR' => 'Nauru',
            'PW' => 'Palau',
            'FM' => 'Micronesia',
            'MH' => 'Marshall Islands'
        ];

        return isset($countries[strtoupper($code)]) ? $countries[strtoupper($code)] : null;
    }

    /**
     * Get total content count by type (using stored options data)
     * Shows actual embedded content counts so admins can see usage without visiting frontend
     *
     * @return array
     */
    public function get_total_content_by_type()
    {
        global $wpdb;

        $table_name = $wpdb->prefix . 'embedpress_analytics_content';

        // Get actual embedded content counts from stored options (JSON-encoded data)
        $elementor_raw = get_option('elementor_source_data');
        $gutenberg_raw = get_option('gutenberg_source_data');

        // Decode JSON data
        $elementor = json_decode($elementor_raw, true);
        $gutenberg = json_decode($gutenberg_raw, true);

        $data = [
            'elementor' => 0,
            'gutenberg' => 0,
            'shortcode' => 0,
            'total' => 0
        ];

        // Count Elementor embeds
        if ($elementor && is_array($elementor)) {
            $data['elementor'] = count($elementor);
        }

        // Count Gutenberg embeds
        if ($gutenberg && is_array($gutenberg)) {
            $data['gutenberg'] = count($gutenberg);
        }

        // For shortcode count, we can check analytics database as fallback
        $shortcode_count = $wpdb->get_var(
            "SELECT COUNT(*) FROM $table_name WHERE content_type = 'shortcode'"
        );

        $data['shortcode'] = (int) $shortcode_count;

        // Calculate total
        $data['total'] = $data['elementor'] + $data['gutenberg'] + $data['shortcode'];

        return $data;
    }

    /**
     * Get views analytics - Free version
     * Only includes total views and basic daily views
     */
    public function get_views_analytics($args = []) {
        global $wpdb;

        $content_table = $wpdb->prefix . 'embedpress_analytics_content';
        $views_table = $wpdb->prefix . 'embedpress_analytics_views';

        $date_range = isset($args['date_range']) ? $args['date_range'] : 30;
        $start_date = date('Y-m-d', strtotime("-$date_range days"));

        // Total views with fallback
        $total_views = $wpdb->get_var(
            "SELECT SUM(total_views) FROM $content_table"
        );

        if (!$total_views) {
            $total_views = $wpdb->get_var(
                "SELECT COUNT(*) FROM $views_table WHERE interaction_type = 'view'"
            );
        }

        // Basic daily views for the chart
        $daily_views = $wpdb->get_results($wpdb->prepare(
            "SELECT DATE(created_at) as date, COUNT(*) as views
             FROM $views_table
             WHERE interaction_type = 'view' AND DATE(created_at) >= %s
             GROUP BY DATE(created_at)
             ORDER BY date ASC",
            $start_date
        ), ARRAY_A);

        // For pro users, get detailed content analytics
        $top_content = [];
        if ($this->license_manager->has_pro_license() && $this->pro_collector) {
            $top_content = $this->pro_collector->get_detailed_content_analytics($args);
        }

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
     * Get total unique viewers - Free version
     * Only includes total unique viewers count
     */
    public function get_total_unique_viewers($args = []) {
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

        // Count unique sessions (free version uses session-based tracking)
        $count = $wpdb->get_var(
            "SELECT COUNT(DISTINCT session_id)
             FROM $views_table
             WHERE interaction_type IN ('view', 'impression')
             $date_condition"
        );

        return absint($count);
    }

    /**
     * Get unique viewers per embed (Pro feature)
     *
     * @param array $args
     * @return array
     */
    public function get_unique_viewers_per_embed($args = [])
    {
        // Check if pro feature is available
        if (!License_Manager::has_analytics_feature('unique_viewers_per_embed')) {
            return [];
        }

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

        $results = $wpdb->get_results(
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

        // If no real data, return sample data for testing
        if (empty($results)) {
            $results = [
                [
                    'content_id' => 'sample_1',
                    'title' => 'YouTube Video: How to Use EmbedPress',
                    'embed_type' => 'youtube',
                    'unique_viewers' => 156,
                    'total_views' => 324,
                    'total_clicks' => 89,
                    'total_impressions' => 456
                ],
                [
                    'content_id' => 'sample_2',
                    'title' => 'Vimeo Video: Product Demo',
                    'embed_type' => 'vimeo',
                    'unique_viewers' => 89,
                    'total_views' => 178,
                    'total_clicks' => 45,
                    'total_impressions' => 234
                ],
                [
                    'content_id' => 'sample_3',
                    'title' => 'Google Maps: Office Location',
                    'embed_type' => 'googlemaps',
                    'unique_viewers' => 67,
                    'total_views' => 145,
                    'total_clicks' => 32,
                    'total_impressions' => 189
                ],
                [
                    'content_id' => 'sample_4',
                    'title' => 'Twitter Tweet Embed',
                    'embed_type' => 'twitter',
                    'unique_viewers' => 45,
                    'total_views' => 98,
                    'total_clicks' => 23,
                    'total_impressions' => 134
                ],
                [
                    'content_id' => 'sample_5',
                    'title' => 'Instagram Post',
                    'embed_type' => 'instagram',
                    'unique_viewers' => 38,
                    'total_views' => 82,
                    'total_clicks' => 18,
                    'total_impressions' => 112
                ]
            ];
        }

        return $results;
    }

    /**
     * Get geo-location analytics (Pro feature)
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
     * Get device analytics (Pro feature)
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
     * Get referral source analytics (Pro feature)
     *
     * @param array $args
     * @return array
     */
    public function get_referral_analytics($args = [])
    {
        // Check if pro feature is available
        if (!License_Manager::has_analytics_feature('referral_tracking')) {
            return [];
        }

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

        $referrers = $wpdb->get_results(
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

        // If no real data, return sample data for testing
        if (empty($referrers)) {
            $referrers = [
                ['referrer_source' => 'Direct', 'visitors' => 180, 'total_visits' => 320],
                ['referrer_source' => 'Google', 'visitors' => 145, 'total_visits' => 280],
                ['referrer_source' => 'Facebook', 'visitors' => 89, 'total_visits' => 165],
                ['referrer_source' => 'Twitter', 'visitors' => 67, 'total_visits' => 125],
                ['referrer_source' => 'LinkedIn', 'visitors' => 45, 'total_visits' => 85],
                ['referrer_source' => 'YouTube', 'visitors' => 38, 'total_visits' => 72]
            ];
        }

        return $referrers;
    }

    /**
     * Get total clicks count
     *
     * @return int
     */
    public function get_total_clicks()
    {
        global $wpdb;

        $content_table = $wpdb->prefix . 'embedpress_analytics_content';
        $views_table = $wpdb->prefix . 'embedpress_analytics_views';

        // First try to get total clicks from content table
        $total_clicks = $wpdb->get_var(
            "SELECT SUM(total_clicks) FROM $content_table"
        );

        // If content table has no data or returns null, count directly from views table
        if (!$total_clicks) {
            $total_clicks = $wpdb->get_var(
                "SELECT COUNT(*) FROM $views_table WHERE interaction_type = 'click'"
            );
        }

        error_log(print_r($total_clicks, true));

        return (int) $total_clicks;
    }

    /**
     * Get total impressions count
     *
     * @return int
     */
    public function get_total_impressions()
    {
        global $wpdb;

        $content_table = $wpdb->prefix . 'embedpress_analytics_content';
        $views_table = $wpdb->prefix . 'embedpress_analytics_views';

        // First try to get total impressions from content table
        $total_impressions = $wpdb->get_var(
            "SELECT SUM(total_impressions) FROM $content_table"
        );

        // If content table has no data or returns null, count directly from views table
        if (!$total_impressions) {
            $total_impressions = $wpdb->get_var(
                "SELECT COUNT(*) FROM $views_table WHERE interaction_type = 'impression'"
            );
        }

        return (int) $total_impressions;
    }

    /**
     * Sync content table counters with actual data from views table
     * This method fixes any discrepancies between the content table counters and actual view data
     *
     * @return array Results of the sync operation
     */
    public function sync_content_counters()
    {
        global $wpdb;

        $content_table = $wpdb->prefix . 'embedpress_analytics_content';
        $views_table = $wpdb->prefix . 'embedpress_analytics_views';

        // Get actual counts from views table
        $actual_counts = $wpdb->get_results(
            "SELECT
                content_id,
                SUM(CASE WHEN interaction_type = 'view' THEN 1 ELSE 0 END) as actual_views,
                SUM(CASE WHEN interaction_type = 'click' THEN 1 ELSE 0 END) as actual_clicks,
                SUM(CASE WHEN interaction_type = 'impression' THEN 1 ELSE 0 END) as actual_impressions
             FROM $views_table
             GROUP BY content_id",
            ARRAY_A
        );

        $updated_count = 0;
        $results = [];

        foreach ($actual_counts as $counts) {
            $content_id = $counts['content_id'];

            // Update content table with actual counts
            $updated = $wpdb->update(
                $content_table,
                [
                    'total_views' => $counts['actual_views'],
                    'total_clicks' => $counts['actual_clicks'],
                    'total_impressions' => $counts['actual_impressions'],
                    'updated_at' => current_time('mysql')
                ],
                ['content_id' => $content_id]
            );

            if ($updated !== false) {
                $updated_count++;
                $results[] = [
                    'content_id' => $content_id,
                    'views' => $counts['actual_views'],
                    'clicks' => $counts['actual_clicks'],
                    'impressions' => $counts['actual_impressions']
                ];
            }
        }

        return [
            'updated_count' => $updated_count,
            'results' => $results
        ];
    }

    /**
     * Get clicks analytics
     *
     * @param array $args
     * @return array
     */
    public function get_clicks_analytics($args = [])
    {
        global $wpdb;

        $content_table = $wpdb->prefix . 'embedpress_analytics_content';
        $views_table = $wpdb->prefix . 'embedpress_analytics_views';

        $date_range = isset($args['date_range']) ? $args['date_range'] : 30; // days
        $start_date = date('Y-m-d', strtotime("-$date_range days"));

        // Total clicks
        $total_clicks = $this->get_total_clicks();

        // Daily clicks for the chart
        $daily_clicks = $wpdb->get_results($wpdb->prepare(
            "SELECT DATE(created_at) as date, COUNT(*) as clicks
             FROM $views_table
             WHERE interaction_type = 'click' AND DATE(created_at) >= %s
             GROUP BY DATE(created_at)
             ORDER BY date ASC",
            $start_date
        ), ARRAY_A);

        // Top clicked content
        $top_clicked_content = $wpdb->get_results(
            "SELECT content_id, embed_type, title, total_views, total_clicks, total_impressions
             FROM $content_table
             WHERE total_clicks > 0
             ORDER BY total_clicks DESC
             LIMIT 10",
            ARRAY_A
        );

        return [
            'total_clicks' => $total_clicks,
            'daily_clicks' => $daily_clicks,
            'top_clicked_content' => $top_clicked_content
        ];
    }

    /**
     * Get impressions analytics
     *
     * @param array $args
     * @return array
     */
    public function get_impressions_analytics($args = [])
    {
        global $wpdb;

        $views_table = $wpdb->prefix . 'embedpress_analytics_views';

        $date_range = isset($args['date_range']) ? $args['date_range'] : 30; // days
        $start_date = date('Y-m-d', strtotime("-$date_range days"));

        // Total impressions
        $total_impressions = $this->get_total_impressions();

        // Daily impressions for the chart
        $daily_impressions = $wpdb->get_results($wpdb->prepare(
            "SELECT DATE(created_at) as date, COUNT(*) as impressions
             FROM $views_table
             WHERE interaction_type = 'impression' AND DATE(created_at) >= %s
             GROUP BY DATE(created_at)
             ORDER BY date ASC",
            $start_date
        ), ARRAY_A);

        return [
            'total_impressions' => $total_impressions,
            'daily_impressions' => $daily_impressions
        ];
    }

    /**
     * Get analytics data - Free version
     *
     * @param array $args
     * @return array
     */
    public function get_analytics_data($args = []) {
        $data = [
            'content_by_type' => $this->get_total_content_by_type(),
            'views_analytics' => $this->get_views_analytics($args),
            'clicks_analytics' => $this->get_clicks_analytics($args),
            'impressions_analytics' => $this->get_impressions_analytics($args),
            'total_unique_viewers' => $this->get_total_unique_viewers($args),
            'total_clicks' => $this->get_total_clicks(),
            'total_impressions' => $this->get_total_impressions()
        ];

        // Add pro features if available
        if ($this->license_manager->has_pro_license() && $this->pro_collector) {
            $pro_data = $this->pro_collector->get_pro_analytics_data($args);
            $data = array_merge($data, $pro_data);
        }

        return $data;
    }
}
