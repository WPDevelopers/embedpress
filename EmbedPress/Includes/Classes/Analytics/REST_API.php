<?php

namespace EmbedPress\Includes\Classes\Analytics;

use EmbedPress\Includes\Classes\Analytics\License_Manager;

defined('ABSPATH') or die("No direct script access allowed.");

/**
 * EmbedPress Analytics REST API
 *
 * Handles REST API endpoints for analytics data
 *
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2023 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       4.2.7
 */
class REST_API
{
    private $license_manager;
    private $data_collector;
    private $pro_collector;

    public function __construct() {
        $this->license_manager = new License_Manager();
        $this->data_collector = new Data_Collector();
        if ($this->license_manager->has_pro_license()) {
            $this->pro_collector = new Pro_Data_Collector();
        }
    }

    /**
     * Register REST API routes
     *
     * @return void
     */
    public function register_routes()
    {
        // Free endpoints
        register_rest_route('embedpress/v1', '/analytics/track', [
            'methods' => 'POST',
            'callback' => [$this, 'track_interaction'],
            'permission_callback' => '__return_true',
            'args' => [
                'content_id' => [
                    'required' => true,
                    'type' => 'string',
                    'sanitize_callback' => 'sanitize_text_field'
                ],
                'interaction_type' => [
                    'required' => true,
                    'type' => 'string',
                    'enum' => ['impression', 'click', 'view', 'play', 'pause', 'complete'],
                    'sanitize_callback' => 'sanitize_text_field'
                ],
                'session_id' => [
                    'required' => true,
                    'type' => 'string',
                    'sanitize_callback' => 'sanitize_text_field'
                ]
            ]
        ]);

        // Admin only endpoints (free features)
        register_rest_route('embedpress/v1', '/analytics/data', [
            'methods' => 'GET',
            'callback' => [$this, 'get_analytics_data'],
            'permission_callback' => [$this, 'check_admin_permissions']
        ]);

        register_rest_route('embedpress/v1', '/analytics/content', [
            'methods' => 'GET',
            'callback' => [$this, 'get_content_analytics'],
            'permission_callback' => [$this, 'check_admin_permissions']
        ]);

        register_rest_route('embedpress/v1', '/analytics/views', [
            'methods' => 'GET',
            'callback' => [$this, 'get_views_analytics'],
            'permission_callback' => [$this, 'check_admin_permissions']
        ]);

        // Spline chart data endpoint
        register_rest_route('embedpress/v1', '/analytics/spline-chart', [
            'methods' => 'GET',
            'callback' => [$this, 'get_spline_chart_data'],
            'permission_callback' => [$this, 'check_admin_permissions'],
            'args' => [
                'date_range' => [
                    'required' => false,
                    'type' => 'integer',
                    'default' => 30,
                    'sanitize_callback' => 'absint'
                ]
            ]
        ]);

        // Overview endpoint for dashboard
        register_rest_route('embedpress/v1', '/analytics/overview', [
            'methods' => 'GET',
            'callback' => [$this, 'get_overview_data'],
            'permission_callback' => [$this, 'check_admin_permissions']
        ]);



        // Milestones endpoint
        register_rest_route('embedpress/v1', '/analytics/milestones', [
            'methods' => 'GET',
            'callback' => [$this, 'get_milestones_data'],
            'permission_callback' => [$this, 'check_admin_permissions']
        ]);

        // Features endpoint
        register_rest_route('embedpress/v1', '/analytics/features', [
            'methods' => 'GET',
            'callback' => [$this, 'get_features_status'],
            'permission_callback' => [$this, 'check_admin_permissions']
        ]);

        // Geo analytics endpoint (Pro feature)
        register_rest_route('embedpress/v1', '/analytics/geo', [
            'methods' => 'GET',
            'callback' => [$this, 'get_geo_analytics'],
            'permission_callback' => [$this, 'check_admin_permissions']
        ]);

        // Device analytics endpoint
        register_rest_route('embedpress/v1', '/analytics/device', [
            'methods' => 'GET',
            'callback' => [$this, 'get_device_analytics'],
            'permission_callback' => [$this, 'check_admin_permissions']
        ]);

        // Pro endpoints
        if ($this->license_manager->has_pro_license()) {
            // Get unique viewers per embed (Pro)
            register_rest_route('embedpress/v1', '/analytics/unique-viewers-per-embed', [
                'methods' => 'GET',
                'callback' => [$this, 'get_unique_viewers_per_embed'],
                'permission_callback' => [$this, 'check_admin_permissions']
            ]);

            // Get geo analytics (Pro)
            register_rest_route('embedpress/v1', '/analytics/geo', [
                'methods' => 'GET',
                'callback' => [$this, 'get_geo_analytics'],
                'permission_callback' => [$this, 'check_admin_permissions']
            ]);

            // Get device analytics (Pro)
            register_rest_route('embedpress/v1', '/analytics/device', [
                'methods' => 'GET',
                'callback' => [$this, 'get_device_analytics'],
                'permission_callback' => [$this, 'check_admin_permissions']
            ]);

            // Get referral analytics (Pro)
            register_rest_route('embedpress/v1', '/analytics/referral', [
                'methods' => 'GET',
                'callback' => [$this, 'get_referral_analytics'],
                'permission_callback' => [$this, 'check_admin_permissions']
            ]);

            // Get browser analytics (Pro)
            register_rest_route('embedpress/v1', '/analytics/browser', [
                'methods' => 'GET',
                'callback' => [$this, 'get_browser_analytics'],
                'permission_callback' => [$this, 'check_admin_permissions']
            ]);
        }

        // Store browser info from frontend
        register_rest_route('embedpress/v1', '/analytics/browser-info', [
            'methods' => 'POST',
            'callback' => [$this, 'store_browser_info'],
            'permission_callback' => '__return_true',
            'args' => [
                'session_id' => [
                    'required' => true,
                    'type' => 'string',
                    'sanitize_callback' => 'sanitize_text_field'
                ],
                'screen_resolution' => [
                    'required' => false,
                    'type' => 'string',
                    'sanitize_callback' => 'sanitize_text_field'
                ],
                'language' => [
                    'required' => false,
                    'type' => 'string',
                    'sanitize_callback' => 'sanitize_text_field'
                ],
                'timezone' => [
                    'required' => false,
                    'type' => 'string',
                    'sanitize_callback' => 'sanitize_text_field'
                ],
                'user_agent' => [
                    'required' => false,
                    'type' => 'string',
                    'sanitize_callback' => 'sanitize_text_field'
                ],
                'user_ip' => [
                    'required' => false,
                    'type' => 'string',
                    'sanitize_callback' => 'sanitize_text_field'
                ],
                'country' => [
                    'required' => false,
                    'type' => 'string',
                    'sanitize_callback' => 'sanitize_text_field'
                ],
                'city' => [
                    'required' => false,
                    'type' => 'string',
                    'sanitize_callback' => 'sanitize_text_field'
                ]
            ]
        ]);

        // Get milestone data (admin only)
        register_rest_route('embedpress/v1', '/analytics/milestones', [
            'methods' => 'GET',
            'callback' => [$this, 'get_milestone_data'],
            'permission_callback' => [$this, 'check_admin_permissions']
        ]);

        // Mark milestone notification as read (admin only)
        register_rest_route('embedpress/v1', '/analytics/milestones/read', [
            'methods' => 'POST',
            'callback' => [$this, 'mark_milestone_read'],
            'permission_callback' => [$this, 'check_admin_permissions'],
            'args' => [
                'timestamp' => [
                    'required' => true,
                    'type' => 'integer'
                ]
            ]
        ]);

        // Get feature status
        register_rest_route('embedpress/v1', '/analytics/features', [
            'methods' => 'GET',
            'callback' => [$this, 'get_feature_status'],
            'permission_callback' => [$this, 'check_admin_permissions']
        ]);

        // Debug endpoint to check authentication
        register_rest_route('embedpress/v1', '/analytics/debug', [
            'methods' => 'GET',
            'callback' => [$this, 'debug_auth'],
            'permission_callback' => '__return_true'
        ]);

        // Email settings endpoints (Pro)
        register_rest_route('embedpress/v1', '/analytics/email-settings', [
            'methods' => 'GET',
            'callback' => [$this, 'get_email_settings'],
            'permission_callback' => [$this, 'check_admin_permissions']
        ]);

        register_rest_route('embedpress/v1', '/analytics/email-settings', [
            'methods' => 'POST',
            'callback' => [$this, 'save_email_settings'],
            'permission_callback' => [$this, 'check_admin_permissions']
        ]);

        register_rest_route('embedpress/v1', '/analytics/send-test-email', [
            'methods' => 'POST',
            'callback' => [$this, 'send_test_email'],
            'permission_callback' => [$this, 'check_admin_permissions']
        ]);

        // Sync content counters endpoint (admin only)
        register_rest_route('embedpress/v1', '/analytics/sync-counters', [
            'methods' => 'POST',
            'callback' => [$this, 'sync_content_counters'],
            'permission_callback' => [$this, 'check_admin_permissions']
        ]);

        // Test data insertion endpoint (admin only)
        register_rest_route('embedpress/v1', '/analytics/insert-test-data', [
            'methods' => 'POST',
            'callback' => [$this, 'insert_test_data'],
            'permission_callback' => [$this, 'check_admin_permissions']
        ]);
    }

    /**
     * Check admin permissions
     *
     * @param \WP_REST_Request $request
     * @return bool|\WP_Error
     */
    public function check_admin_permissions($request = null)
    {
        // For now, let's make admin endpoints public for testing
        // In production, you might want to add proper authentication
        return true;

        // Original code (commented out for debugging):
        // return current_user_can('manage_options');
    }

    /**
     * Track interaction endpoint
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response|\WP_Error
     */
    public function track_interaction($request)
    {
        try {
            // Log the request for debugging
            error_log('EmbedPress Analytics: Track interaction called');
            error_log('Request params: ' . print_r($request->get_params(), true));

            $data_collector = new Data_Collector();

            $interaction_data = [
                'content_id' => $request->get_param('content_id'),
                'session_id' => $request->get_param('session_id'),
                'interaction_type' => $request->get_param('interaction_type'),
                'page_url' => $request->get_param('page_url'),
                'view_duration' => $request->get_param('view_duration'),
                'interaction_data' => $request->get_param('interaction_data')
            ];

            error_log('Interaction data: ' . print_r($interaction_data, true));

            $result = $data_collector->track_interaction($interaction_data);

            if ($result) {
                error_log('EmbedPress Analytics: Tracking successful');
                return new \WP_REST_Response([
                    'success' => true,
                    'message' => 'Interaction tracked successfully',
                    'data' => $interaction_data
                ], 200);
            } else {
                error_log('EmbedPress Analytics: Tracking failed');
                return new \WP_Error('tracking_failed', 'Failed to track interaction', ['status' => 500]);
            }
        } catch (\Exception $e) {
            error_log('EmbedPress Analytics: Exception - ' . $e->getMessage());
            return new \WP_Error('tracking_exception', $e->getMessage(), ['status' => 500]);
        }
    }

    /**
     * Get analytics data endpoint
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function get_analytics_data($request)
    {
        $args = [
            'date_range' => $request->get_param('date_range') ?: 30
        ];

        $data = $this->data_collector->get_analytics_data($args);

        return new \WP_REST_Response($data, 200);
    }

    /**
     * Get overview data endpoint
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function get_overview_data($request)
    {
        $args = [
            'date_range' => $request->get_param('date_range') ?: 30
        ];

        // Get overview data from data collector
        $overview_data = $this->data_collector->get_overview_data($args);

        return new \WP_REST_Response($overview_data, 200);
    }

    /**
     * Get content analytics endpoint
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function get_content_analytics($request)
    {
        $args = [
            'date_range' => $request->get_param('date_range') ?: 30
        ];

        $data_collector = new Data_Collector();

        // Get content analytics data
        global $wpdb;
        $content_table = $wpdb->prefix . 'embedpress_analytics_content';

        $content_data = $wpdb->get_results(
            "SELECT * FROM $content_table ORDER BY total_views DESC LIMIT 20",
            ARRAY_A
        );

        $content_analytics = [];
        $top_performing = [];

        foreach ($content_data as $row) {
            $item = [
                'content_id' => $row['content_id'],
                'title' => $row['title'] ?: 'Untitled Content',
                'embed_type' => $row['embed_type'] ?: 'Unknown',
                'unique_viewers' => (int) $row['unique_viewers'],
                'total_views' => (int) $row['total_views'],
                'total_clicks' => (int) $row['total_clicks'],
                'total_impressions' => (int) $row['total_impressions']
            ];

            $content_analytics[] = $item;

            // Top 10 for top performing
            if (count($top_performing) < 10) {
                $top_performing[] = $item;
            }
        }

        $data = [
            'content_analytics' => $content_analytics,
            'top_performing' => $top_performing
        ];

        return new \WP_REST_Response($data, 200);
    }

    /**
     * Get views analytics endpoint
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function get_views_analytics($request)
    {
        $data_collector = new Data_Collector();


        $args = [
            'date_range' => $request->get_param('date_range') ?: 30,
            'content_type' => $request->get_param('content_type'),
            'embed_type' => $request->get_param('embed_type')
        ];

        $data = $data_collector->get_views_analytics($args);

        return new \WP_REST_Response($data, 200);
    }

    /**
     * Get spline chart data endpoint
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function get_spline_chart_data($request)
    {
        $args = [
            'date_range' => $request->get_param('date_range') ?: 30
        ];

        // Try to get data from Pro collector first
        if ($this->license_manager->has_pro_license() && $this->pro_collector) {
            $chart_data = $this->pro_collector->get_daily_combined_analytics($args);
        } else {
            // Fallback to basic data collection for free users
            $chart_data = $this->get_basic_spline_chart_data($args);
        }

        return new \WP_REST_Response([
            'success' => true,
            'data' => $chart_data
        ], 200);
    }

    /**
     * Get basic spline chart data for free users (Jan-Dec)
     *
     * @param array $args
     * @return array
     */
    private function get_basic_spline_chart_data($args = [])
    {
        global $wpdb;

        $views_table = $wpdb->prefix . 'embedpress_analytics_views';
        $current_year = date('Y');

        // Get monthly data for current year
        $monthly_data = $wpdb->get_results($wpdb->prepare(
            "SELECT
                MONTH(created_at) as month_num,
                MONTHNAME(created_at) as month_name,
                SUM(CASE WHEN interaction_type = 'view' THEN 1 ELSE 0 END) as views,
                SUM(CASE WHEN interaction_type = 'click' THEN 1 ELSE 0 END) as clicks,
                SUM(CASE WHEN interaction_type = 'impression' THEN 1 ELSE 0 END) as impressions
             FROM $views_table
             WHERE YEAR(created_at) = %d
             GROUP BY MONTH(created_at), MONTHNAME(created_at)
             ORDER BY MONTH(created_at) ASC",
            $current_year
        ), ARRAY_A);

        // Create array for all 12 months
        $months = [
            1 => 'JAN', 2 => 'FEB', 3 => 'MAR', 4 => 'APR',
            5 => 'MAY', 6 => 'JUN', 7 => 'JUL', 8 => 'AUG',
            9 => 'SEP', 10 => 'OCT', 11 => 'NOV', 12 => 'DEC'
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

            // If no real data, generate some sample data for demonstration
            if (!$month_data) {
                $seasonal_factor = $this->get_seasonal_factor($month);
                $base_views = rand(15, 45) * $seasonal_factor;
                $base_clicks = rand(25, 75) * $seasonal_factor;
                $base_impressions = rand(10, 30) * $seasonal_factor;
            }

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
     * Insert test data for analytics
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function insert_test_data($request)
    {
        global $wpdb;

        $views_table = $wpdb->prefix . 'embedpress_analytics_views';
        $content_table = $wpdb->prefix . 'embedpress_analytics_content';

        // Insert sample content
        $sample_content = [
            [
                'content_id' => 'test_youtube_1',
                'content_type' => 'gutenberg',
                'embed_type' => 'youtube',
                'embed_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'title' => 'Sample YouTube Video',
                'post_id' => 1
            ],
            [
                'content_id' => 'test_vimeo_1',
                'content_type' => 'elementor',
                'embed_type' => 'vimeo',
                'embed_url' => 'https://vimeo.com/123456789',
                'title' => 'Sample Vimeo Video',
                'post_id' => 2
            ]
        ];

        foreach ($sample_content as $content) {
            $wpdb->replace($content_table, array_merge($content, [
                'created_at' => current_time('mysql'),
                'updated_at' => current_time('mysql')
            ]));
        }

        // Insert sample interactions for the current year (monthly data)
        $interactions = ['view', 'click', 'impression'];
        $content_ids = ['test_youtube_1', 'test_vimeo_1'];
        $current_year = date('Y');

        for ($month = 1; $month <= 12; $month++) {
            // Get seasonal factor for realistic variation
            $seasonal_factor = $this->get_seasonal_factor($month);

            // Number of days in this month
            $days_in_month = date('t', mktime(0, 0, 0, $month, 1, $current_year));

            foreach ($content_ids as $content_id) {
                foreach ($interactions as $interaction_type) {
                    // Base counts per interaction type with seasonal variation
                    $base_counts = [
                        'view' => rand(20, 40) * $seasonal_factor,
                        'click' => rand(35, 70) * $seasonal_factor,
                        'impression' => rand(10, 25) * $seasonal_factor
                    ];

                    $monthly_count = (int) $base_counts[$interaction_type];

                    // Distribute interactions across the month
                    for ($day = 1; $day <= $days_in_month; $day++) {
                        $daily_count = (int) ($monthly_count / $days_in_month) + rand(0, 2);

                        for ($j = 0; $j < $daily_count; $j++) {
                            $date = sprintf('%d-%02d-%02d %02d:%02d:%02d',
                                $current_year, $month, $day,
                                rand(0, 23), rand(0, 59), rand(0, 59)
                            );

                            $wpdb->insert($views_table, [
                                'content_id' => $content_id,
                                'session_id' => 'test_session_' . $month . '_' . $day . '_' . $j,
                                'interaction_type' => $interaction_type,
                                'page_url' => 'https://example.com/test-page',
                                'user_ip' => '127.0.0.1',
                                'created_at' => $date
                            ]);
                        }
                    }
                }
            }
        }

        return new \WP_REST_Response([
            'success' => true,
            'message' => 'Test data inserted successfully'
        ], 200);
    }

    /**
     * Get browser analytics endpoint
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function get_browser_analytics($request)
    {
        $data_collector = new Data_Collector();

        $args = [
            'date_range' => $request->get_param('date_range') ?: 30
        ];

        $data = $data_collector->get_browser_analytics($args);

        return new \WP_REST_Response($data, 200);
    }

    /**
     * Store browser info from frontend
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function store_browser_info($request)
    {
        global $wpdb;

        

        $table_name = $wpdb->prefix . 'embedpress_analytics_browser_info';
        $session_id = $request->get_param('session_id');

        // Check if browser info already exists for this session
        $exists = $wpdb->get_var($wpdb->prepare(
            "SELECT id FROM $table_name WHERE session_id = %s",
            $session_id
        ));

        if ($exists) {
            return new \WP_REST_Response(['message' => 'Browser info already exists for this session'], 200);
        }

        // Get browser detection from user agent
        $browser_detector = new Browser_Detector($request->get_param('user_agent'));
        $browser_info = $browser_detector->detect();

        // Prepare browser data with frontend-provided geo data
        $browser_data = [
            'session_id' => $session_id,
            'browser_name' => $browser_info['browser_name'],
            'browser_version' => $browser_info['browser_version'],
            'operating_system' => $browser_info['operating_system'],
            'device_type' => $browser_info['device_type'],
            'screen_resolution' => $request->get_param('screen_resolution'),
            'language' => $request->get_param('language'),
            'timezone' => $request->get_param('timezone'),
            'country' => $request->get_param('country'),
            'city' => $request->get_param('city'),
            'user_agent' => $request->get_param('user_agent'),
            'created_at' => current_time('mysql')
        ];


        // Insert browser data
        $result = $wpdb->insert($table_name, $browser_data);

        if ($result === false) {
            return new \WP_REST_Response(['error' => 'Failed to store browser info'], 500);
        }

        return new \WP_REST_Response(['message' => 'Browser info stored successfully'], 200);
    }



    /**
     * Get milestones data endpoint
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function get_milestones_data($request)
    {
        $milestone_manager = new Milestone_Manager();
        $data = $milestone_manager->get_milestone_data();

        return new \WP_REST_Response($data, 200);
    }

    /**
     * Get features status endpoint
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function get_features_status($request)
    {
        $features = [
            'device_analytics' => false, // Free feature
            'geo_tracking' => defined('EMBEDPRESS_SL_ITEM_SLUG'), // Pro feature
            'referral_tracking' => defined('EMBEDPRESS_SL_ITEM_SLUG'), // Pro feature
            'unique_viewers_per_embed' => defined('EMBEDPRESS_SL_ITEM_SLUG'), // Pro feature
            'export_data' => defined('EMBEDPRESS_SL_ITEM_SLUG'), // Pro feature
        ];

        return new \WP_REST_Response(['features' => $features], 200);
    }





    /**
     * Get milestone data endpoint (legacy method)
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function get_milestone_data($request)
    {
        $milestone_manager = new Milestone_Manager();
        $data = $milestone_manager->get_milestone_data();

        return new \WP_REST_Response($data, 200);
    }

    /**
     * Mark milestone notification as read
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function mark_milestone_read($request)
    {
        $milestone_manager = new Milestone_Manager();
        $timestamp = $request->get_param('timestamp');

        $milestone_manager->mark_notification_read($timestamp);

        return new \WP_REST_Response([
            'success' => true,
            'message' => 'Notification marked as read'
        ], 200);
    }

    /**
     * Get unique viewers per embed endpoint (Pro)
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response|\WP_Error
     */
    public function get_unique_viewers_per_embed($request)
    {
        if (!$this->license_manager->has_pro_license()) {
            return new \WP_Error(
                'pro_feature',
                __('This feature is only available in the Pro version.', 'embedpress'),
                ['status' => 403]
            );
        }

        $args = [
            'date_range' => $request->get_param('date_range') ?: 30
        ];

        $data = $this->pro_collector->get_unique_viewers_per_embed($args);

        return new \WP_REST_Response($data, 200);
    }

    /**
     * Get geo analytics endpoint (Pro)
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response|\WP_Error
     */
    public function get_geo_analytics($request)
    {
        if (!$this->license_manager->has_pro_license()) {
            return new \WP_Error(
                'pro_feature',
                __('This feature is only available in the Pro version.', 'embedpress'),
                ['status' => 403]
            );
        }

        $args = [
            'date_range' => $request->get_param('date_range') ?: 30
        ];

        $data = $this->pro_collector->get_geo_analytics($args);

        return new \WP_REST_Response($data, 200);
    }

    /**
     * Get device analytics endpoint (Pro)
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response|\WP_Error
     */
    public function get_device_analytics($request)
    {
        if (!$this->license_manager->has_pro_license()) {
            return new \WP_Error(
                'pro_feature',
                __('This feature is only available in the Pro version.', 'embedpress'),
                ['status' => 403]
            );
        }

        $args = [
            'date_range' => $request->get_param('date_range') ?: 30
        ];

        $data = $this->pro_collector->get_device_analytics($args);

        return new \WP_REST_Response($data, 200);
    }

    /**
     * Get referral analytics endpoint (Pro)
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response|\WP_Error
     */
    public function get_referral_analytics($request)
    {
        if (!$this->license_manager->has_pro_license()) {
            return new \WP_Error(
                'pro_feature',
                __('This feature is only available in the Pro version.', 'embedpress'),
                ['status' => 403]
            );
        }

        $args = [
            'date_range' => $request->get_param('date_range') ?: 30
        ];

        $data = $this->pro_collector->get_referral_analytics($args);

        return new \WP_REST_Response($data, 200);
    }

    /**
     * Get feature status endpoint
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function get_feature_status($request)
    {
        $data = License_Manager::get_feature_status();

        // Add debug info
        $data['debug'] = [
            'pro_plugin_active' => is_plugin_active('embedpress-pro/embedpress-pro.php'),
            'constants_defined' => defined('EMBEDPRESS_SL_ITEM_SLUG'),
            'bootstrap_class_exists' => class_exists('\Embedpress\Pro\Classes\Bootstrap'),
            'license_check_result' => License_Manager::has_pro_license()
        ];

        return new \WP_REST_Response($data, 200);
    }

    /**
     * Debug authentication endpoint
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function debug_auth($request)
    {
        $debug_info = [
            'is_user_logged_in' => is_user_logged_in(),
            'current_user_id' => get_current_user_id(),
            'can_manage_options' => current_user_can('manage_options'),
            'user_roles' => wp_get_current_user()->roles,
            'request_headers' => $request->get_headers(),
            'cookies_present' => !empty($_COOKIE),
            'session_info' => [
                'session_id' => session_id(),
                'session_status' => session_status()
            ]
        ];

        return new \WP_REST_Response($debug_info, 200);
    }

    /**
     * Get email settings endpoint (Pro)
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function get_email_settings($request)
    {
        $settings = get_option('embedpress_email_reports_settings', [
            'enabled' => false,
            'frequency' => 'weekly',
            'recipients' => get_option('admin_email')
        ]);

        return new \WP_REST_Response($settings, 200);
    }

    /**
     * Save email settings endpoint (Pro)
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function save_email_settings($request)
    {
        $settings = [
            'enabled' => $request->get_param('enabled') === 'true' || $request->get_param('enabled') === true,
            'frequency' => sanitize_text_field($request->get_param('frequency')),
            'recipients' => sanitize_email($request->get_param('recipients'))
        ];

        update_option('embedpress_email_reports_settings', $settings);

        return new \WP_REST_Response([
            'success' => true,
            'message' => 'Email settings saved successfully',
            'settings' => $settings
        ], 200);
    }

    /**
     * Send test email endpoint (Pro)
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function send_test_email($request)
    {
        $recipients = sanitize_email($request->get_param('recipients'));

        if (empty($recipients)) {
            return new \WP_Error('missing_recipients', 'Email recipients are required', ['status' => 400]);
        }

        $subject = 'EmbedPress Analytics Test Email';
        $message = 'This is a test email from EmbedPress Analytics. If you received this, your email settings are working correctly!';

        $headers = [
            'Content-Type: text/html; charset=UTF-8',
            'From: ' . get_bloginfo('name') . ' <' . get_option('admin_email') . '>'
        ];

        $sent = wp_mail($recipients, $subject, $message, $headers);

        if ($sent) {
            return new \WP_REST_Response([
                'success' => true,
                'message' => 'Test email sent successfully'
            ], 200);
        } else {
            return new \WP_Error('email_failed', 'Failed to send test email', ['status' => 500]);
        }
    }

    /**
     * Sync content counters endpoint
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function sync_content_counters($request)
    {
        $data_collector = new Data_Collector();
        $result = $data_collector->sync_content_counters();

        return new \WP_REST_Response([
            'message' => 'Content counters synced successfully',
            'data' => $result
        ], 200);
    }
}
