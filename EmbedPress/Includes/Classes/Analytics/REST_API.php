<?php

namespace EmbedPress\Includes\Classes\Analytics;

use EmbedPress\Includes\Classes\Analytics\License_Manager;
use EmbedPress\Includes\Classes\Analytics\Browser_Detector;

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

    public function __construct()
    {
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
                'user_id' => [
                    'required' => false,
                    'type' => 'string',
                    'sanitize_callback' => 'sanitize_text_field',
                    'description' => 'Persistent user ID from cookie'
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
            'permission_callback' => [$this, 'check_admin_permissions'],
            'args' => [
                'date_range' => [
                    'required' => false,
                    'type' => 'integer',
                    'default' => 30,
                    'sanitize_callback' => 'absint'
                ],
                'start_date' => [
                    'required' => false,
                    'type' => 'string',
                    'sanitize_callback' => 'sanitize_text_field'
                ],
                'end_date' => [
                    'required' => false,
                    'type' => 'string',
                    'sanitize_callback' => 'sanitize_text_field'
                ],
                'content_type' => [
                    'required' => false,
                    'type' => 'string',
                    'enum' => ['all', 'elementor', 'gutenberg', 'shortcode'],
                    'default' => 'all',
                    'sanitize_callback' => 'sanitize_text_field'
                ]
            ]
        ]);

        // Embed details endpoint (Pro feature)
        register_rest_route('embedpress/v1', '/analytics/embed-details', [
            'methods' => 'GET',
            'callback' => [$this, 'get_embed_details'],
            'permission_callback' => [$this, 'check_admin_permissions'],
            'args' => [
                'type' => [
                    'required' => false,
                    'type' => 'string',
                    'sanitize_callback' => 'sanitize_text_field'
                ],
                'limit' => [
                    'required' => false,
                    'type' => 'integer',
                    'default' => 20
                ],
                'offset' => [
                    'required' => false,
                    'type' => 'integer',
                    'default' => 0
                ]
            ]
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

        // Browser analytics endpoint
        register_rest_route('embedpress/v1', '/analytics/browser', [
            'methods' => 'GET',
            'callback' => [$this, 'get_browser_analytics'],
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



            // Get referral analytics (Enhanced for all users)
            register_rest_route('embedpress/v1', '/analytics/referral', [
                'methods' => 'GET',
                'callback' => [$this, 'get_referral_analytics'],
                'permission_callback' => [$this, 'check_admin_permissions'],
                'args' => [
                    'date_range' => [
                        'required' => false,
                        'type' => 'integer',
                        'default' => 30,
                        'sanitize_callback' => 'absint'
                    ],
                    'start_date' => [
                        'required' => false,
                        'type' => 'string',
                        'sanitize_callback' => 'sanitize_text_field'
                    ],
                    'end_date' => [
                        'required' => false,
                        'type' => 'string',
                        'sanitize_callback' => 'sanitize_text_field'
                    ],
                    'limit' => [
                        'required' => false,
                        'type' => 'integer',
                        'default' => 50,
                        'sanitize_callback' => 'absint'
                    ],
                    'order_by' => [
                        'required' => false,
                        'type' => 'string',
                        'default' => 'total_views',
                        'enum' => ['total_views', 'total_clicks', 'unique_visitors', 'last_visit'],
                        'sanitize_callback' => 'sanitize_text_field'
                    ]
                ]
            ]);

            // Export analytics data (Pro)
            register_rest_route('embedpress/v1', '/analytics/export', [
                'methods' => 'GET',
                'callback' => [$this, 'export_analytics_data'],
                'permission_callback' => [$this, 'check_admin_permissions'],
                'args' => [
                    'format' => [
                        'required' => false,
                        'type' => 'string',
                        'enum' => ['csv', 'excel', 'pdf'],
                        'default' => 'csv',
                        'sanitize_callback' => 'sanitize_text_field'
                    ],
                    'date_range' => [
                        'required' => false,
                        'type' => 'integer',
                        'default' => 30,
                        'sanitize_callback' => 'absint'
                    ],
                    'start_date' => [
                        'required' => false,
                        'type' => 'string',
                        'sanitize_callback' => 'sanitize_text_field'
                    ],
                    'end_date' => [
                        'required' => false,
                        'type' => 'string',
                        'sanitize_callback' => 'sanitize_text_field'
                    ]
                ]
            ]);
        }

        // Store browser info from frontend
        register_rest_route('embedpress/v1', '/analytics/browser-info', [
            'methods' => 'POST',
            'callback' => [$this, 'store_browser_info'],
            'permission_callback' => '__return_true',
            'args' => [
                'user_id' => [
                    'required' => false,
                    'type' => 'string',
                    'sanitize_callback' => 'sanitize_text_field'
                ],
                'session_id' => [
                    'required' => true,
                    'type' => 'string',
                    'sanitize_callback' => 'sanitize_text_field'
                ],
                'browser_fingerprint' => [
                    'required' => false,
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

        // Sync content counters endpoint (admin only)
        register_rest_route('embedpress/v1', '/analytics/sync-counters', [
            'methods' => 'POST',
            'callback' => [$this, 'sync_content_counters'],
            'permission_callback' => [$this, 'check_admin_permissions']
        ]);





        // Analytics tracking setting endpoints
        register_rest_route('embedpress/v1', '/analytics/tracking-setting', [
            'methods' => ['GET', 'POST'],
            'callback' => [$this, 'handle_tracking_setting'],
            'permission_callback' => [$this, 'check_admin_permissions']
        ]);

        // Cleanup redundant analytics data endpoint
        register_rest_route('embedpress/v1', '/analytics/cleanup-redundant-data', [
            'methods' => 'POST',
            'callback' => [$this, 'cleanup_redundant_data'],
            'permission_callback' => [$this, 'check_admin_permissions'],
            'args' => [
                'cleanup_type' => [
                    'required' => false,
                    'type' => 'string',
                    'enum' => ['duplicate_interactions', 'redundant_browser_info', 'all'],
                    'default' => 'all',
                    'sanitize_callback' => 'sanitize_text_field'
                ]
            ]
        ]);

        // Performance statistics endpoint
        register_rest_route('embedpress/v1', '/analytics/performance-stats', [
            'methods' => 'GET',
            'callback' => [$this, 'get_performance_stats'],
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
        return current_user_can('manage_options');
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

            $data_collector = new Data_Collector();

            // Get data from JSON body (for POST requests)
            $json_data = $request->get_json_params();

            $interaction_data = [
                'content_id' => $json_data['content_id'] ?? $request->get_param('content_id'),
                'user_id' => $json_data['user_id'] ?? $request->get_param('user_id'),
                'session_id' => $json_data['session_id'] ?? $request->get_param('session_id'),
                'interaction_type' => $json_data['interaction_type'] ?? $request->get_param('interaction_type'),
                'page_url' => $json_data['page_url'] ?? $request->get_param('page_url'),
                'view_duration' => $json_data['view_duration'] ?? $request->get_param('view_duration'),
                'interaction_data' => $json_data['interaction_data'] ?? $request->get_param('interaction_data'),
                'original_referrer' => $json_data['original_referrer'] ?? $request->get_param('original_referrer')
            ];


            $result = $data_collector->track_interaction($interaction_data);

            if ($result) {
                return new \WP_REST_Response([
                    'success' => true,
                    'message' => 'Interaction tracked successfully',
                    'data' => $interaction_data
                ], 200);
            } else {
                return new \WP_Error('tracking_failed', 'Failed to track interaction', ['status' => 500]);
            }
        } catch (\Exception $e) {
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
            'date_range' => $request->get_param('date_range') ?: 30,
            'start_date' => $request->get_param('start_date'),
            'end_date' => $request->get_param('end_date')
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
            'date_range' => $request->get_param('date_range') ?: 30,
            'start_date' => $request->get_param('start_date'),
            'end_date' => $request->get_param('end_date'),
            'content_type' => $request->get_param('content_type') ?: 'all'
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
            'date_range' => $request->get_param('date_range') ?: 30,
            'start_date' => $request->get_param('start_date'),
            'end_date' => $request->get_param('end_date'),
            'limit' => 50 // full list limit
        ];

        if ($this->license_manager->has_pro_license() && $this->pro_collector) {
            $content_analytics = $this->pro_collector->get_detailed_content_analytics($args);

            $top_args = $args;
            $top_args['order_by_total_views'] = true;
            $top_args['limit'] = 10; // top 5 performing

            $top_performing = $this->pro_collector->get_detailed_content_analytics($top_args);
        } else {
            $content_analytics = [];
            $top_performing = [];
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
            'embed_type' => $request->get_param('embed_type'),
            'start_date' => $request->get_param('start_date'),
            'end_date' => $request->get_param('end_date')
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
        // Check if pro license is active for advanced analytics
        if (!$this->license_manager->has_pro_license()) {
            return new \WP_REST_Response([
                'success' => false,
                'data' => [],
                'message' => __('This feature is only available in the Pro version.', 'embedpress')
            ], 403);
        }

        $args = [
            'date_range' => $request->get_param('date_range') ?: 30,
            'start_date' => $request->get_param('start_date'),
            'end_date' => $request->get_param('end_date')
        ];

        // Use Pro collector for licensed users
        if ($this->pro_collector) {
            $chart_data = $this->pro_collector->get_daily_combined_analytics($args);
        } else {
            $chart_data = [];
        }

        return new \WP_REST_Response([
            'success' => true,
            'data' => $chart_data
        ], 200);
    }







    /**
     * Get browser analytics endpoint (Pro feature)
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function get_browser_analytics($request)
    {
        // Check if pro license is active for browser analytics
        if (!$this->license_manager->has_pro_license()) {
            return new \WP_REST_Response([
                'success' => false,
                'data' => [],
                'message' => __('This feature is only available in the Pro version.', 'embedpress')
            ], 403);
        }

        $args = [
            'date_range' => $request->get_param('date_range') ?: 30,
            'start_date' => $request->get_param('start_date'),
            'end_date' => $request->get_param('end_date')
        ];

        // Use Pro collector for licensed users
        if ($this->pro_collector) {
            $data = $this->pro_collector->get_browser_analytics($args);
        } else {
            $data = [];
        }

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
        $user_id = $request->get_param('user_id');
        $browser_fingerprint = $request->get_param('browser_fingerprint');

        // Get user identifier - prefer user_id from cookie, fallback to session (same logic as Data_Collector)
        $session_id = $request->get_param('session_id');
        $user_identifier = isset($user_id) && !empty($user_id) && $user_id !== 'null' && $user_id !== '0'
            ? $user_id
            : $session_id;

        // Check if browser info already exists for this user_identifier and fingerprint combination
        if ($user_identifier && $browser_fingerprint) {
            $exists = $wpdb->get_var($wpdb->prepare(
                "SELECT id FROM $table_name WHERE session_id = %s AND browser_fingerprint = %s",
                $user_identifier,
                $browser_fingerprint
            ));

            if ($exists) {
                return new \WP_REST_Response(['message' => 'Browser info already exists for this user and fingerprint'], 200);
            }
        }

        // Get browser detection from user agent
        $browser_detector = new Browser_Detector($request->get_param('user_agent'));
        $browser_info = $browser_detector->detect();

        // Prepare browser data with frontend-provided geo data
        // Use user_identifier for user_id to ensure uniqueness
        $browser_data = [
            'user_id' => $user_identifier, // Use user_identifier instead of raw user_id
            'session_id' => $user_identifier, // Store user_identifier in session_id field for consistency
            'browser_fingerprint' => $browser_fingerprint,
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
            'date_range' => $request->get_param('date_range') ?: 30,
            'start_date' => $request->get_param('start_date'),
            'end_date' => $request->get_param('end_date')
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
            'date_range' => $request->get_param('date_range') ?: 30,
            'start_date' => $request->get_param('start_date'),
            'end_date' => $request->get_param('end_date')
        ];

        $data = $this->pro_collector->get_geo_analytics($args);

        return new \WP_REST_Response($data, 200);
    }

    /**
     * Get device analytics endpoint (Pro feature)
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function get_device_analytics($request)
    {
        // Check if pro license is active for device analytics
        if (!$this->license_manager->has_pro_license()) {
            return new \WP_REST_Response([
                'success' => false,
                'data' => [],
                'message' => __('This feature is only available in the Pro version.', 'embedpress')
            ], 403);
        }

        $args = [
            'date_range' => $request->get_param('date_range') ?: 30,
            'start_date' => $request->get_param('start_date'),
            'end_date' => $request->get_param('end_date')
        ];

        // Use Pro collector for licensed users
        if ($this->pro_collector) {
            $data = $this->pro_collector->get_device_analytics($args);
        } else {
            $data = [];
        }

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
        $args = [
            'date_range' => $request->get_param('date_range') ?: 30,
            'start_date' => $request->get_param('start_date'),
            'end_date' => $request->get_param('end_date'),
            'limit' => $request->get_param('limit') ?: 50,
            'order_by' => $request->get_param('order_by') ?: 'total_views'
        ];

        // Use new optimized referrer analytics for all users
        $data = $this->data_collector->get_referrer_analytics($args);

        // For pro users, enhance with additional data from the old system if available
        if ($this->license_manager->has_pro_license() && $this->pro_collector) {
            try {
                $legacy_data = $this->pro_collector->get_referral_analytics($args);

                // Merge or enhance data if needed
                if (isset($legacy_data['referrers']) && !empty($legacy_data['referrers'])) {
                    $data['legacy_data'] = $legacy_data;
                }
            } catch (\Exception $e) {
                // If legacy data fails, continue with new data
                // Silently continue without logging sensitive error details
            }
        }

        return new \WP_REST_Response([
            'success' => true,
            'data' => $data,
            'is_pro' => $this->license_manager->has_pro_license()
        ], 200);
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



        return new \WP_REST_Response($data, 200);
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

    /**
     * Cleanup unknown entries endpoint
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function cleanup_unknown_entries($request)
    {
        global $wpdb;

        $content_table = $wpdb->prefix . 'embedpress_analytics_content';
        $views_table = $wpdb->prefix . 'embedpress_analytics_views';

        // Delete content entries with unknown or empty embed_type
        $content_deleted = $wpdb->query(
            "DELETE FROM $content_table WHERE embed_type = 'unknown' OR embed_type = ''"
        );

        // Delete view entries for content that no longer exists or has unknown embed_type
        $views_deleted = $wpdb->query(
            "DELETE v FROM $views_table v
             LEFT JOIN $content_table c ON v.content_id = c.content_id
             WHERE c.content_id IS NULL OR c.embed_type = 'unknown' OR c.embed_type = ''"
        );

        return new \WP_REST_Response([
            'message' => 'Unknown entries cleaned up successfully',
            'data' => [
                'content_entries_deleted' => $content_deleted,
                'view_entries_deleted' => $views_deleted
            ]
        ], 200);
    }

    /**
     * Get detailed embed data for the modal (Pro feature)
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function get_embed_details($request)
    {
        // Check if pro features are available
        if (!$this->license_manager->has_pro_license()) {
            return new \WP_REST_Response([
                'error' => 'This is a Pro feature. Please upgrade to access detailed embed data.',
                'data' => []
            ], 403);
        }

        global $wpdb;

        $type = $request->get_param('type');
        $limit = $request->get_param('limit') ?: 20;
        $offset = $request->get_param('offset') ?: 0;

        // Clear cache and get fresh counts
        $this->data_collector->clear_content_count_cache();
        $content_by_type = $this->data_collector->get_total_content_by_type();

        // Get detailed embed data from WordPress posts
        $where_clause = '';
        if ($type && $type !== 'all') {
            $where_clause = $wpdb->prepare(' AND post_content LIKE %s', '%' . $type . '%');
        }

        $posts = $wpdb->get_results($wpdb->prepare(
            "SELECT ID, post_title, post_type, post_content, post_modified, post_status
             FROM {$wpdb->posts}
             WHERE post_status IN ('publish', 'draft', 'private')
             AND post_type NOT IN ('revision', 'attachment', 'nav_menu_item')
             AND (post_content LIKE %s OR post_content LIKE %s OR post_content LIKE %s)
             {$where_clause}
             ORDER BY post_modified DESC
             LIMIT %d OFFSET %d",
            '%embedpress%',
            '%elementor%embedpress%',
            '%[embedpress%',
            $limit,
            $offset
        ));

        $detailed_data = [];

        foreach ($posts as $post) {
            $embed_info = $this->analyze_post_embeds($post);
            if (!empty($embed_info)) {
                // Group embeds by type for this post
                $embed_counts = [];
                foreach ($embed_info as $embed) {
                    $key = $embed['type'] . '_' . $embed['source'];
                    if (!isset($embed_counts[$key])) {
                        $embed_counts[$key] = [
                            'post_id' => $post->ID,
                            'post_title' => $post->post_title,
                            'post_type' => $post->post_type,
                            'embed_type' => $embed['type'],
                            'source' => $embed['source'],
                            'embed_count' => 0,
                            'modified_date' => $post->post_modified,
                            'view_url' => get_permalink($post->ID),
                            'edit_url' => get_edit_post_link($post->ID, 'raw')
                        ];
                    }
                    $embed_counts[$key]['embed_count']++;
                }

                $detailed_data = array_merge($detailed_data, array_values($embed_counts));
            }
        }

        // Check if there are more posts available by trying to fetch one more
        $check_more_posts = $wpdb->get_results($wpdb->prepare(
            "SELECT ID FROM {$wpdb->posts}
             WHERE post_status IN ('publish', 'draft', 'private')
             AND post_type NOT IN ('revision', 'attachment', 'nav_menu_item')
             AND (post_content LIKE %s OR post_content LIKE %s OR post_content LIKE %s)
             {$where_clause}
             ORDER BY post_modified DESC
             LIMIT 1 OFFSET %d",
            '%embedpress%',
            '%elementor%embedpress%',
            '%[embedpress%',
            $offset + $limit
        ));

        $has_more = count($check_more_posts) > 0;

        $response_data = [
            'summary' => $content_by_type,
            'data' => $detailed_data,
            'has_more' => $has_more
        ];

        return new \WP_REST_Response($response_data, 200);
    }

    /**
     * Analyze a post to find embed information
     *
     * @param object $post
     * @return array
     */
    private function analyze_post_embeds($post)
    {
        $embeds = [];
        $content = $post->post_content;

        // Check for Gutenberg blocks
        if (function_exists('has_blocks') && has_blocks($content)) {
            $blocks = parse_blocks($content);
            $gutenberg_embeds = $this->find_embedpress_blocks($blocks);
            foreach ($gutenberg_embeds as $embed_type) {
                $embeds[] = [
                    'type' => $embed_type,
                    'source' => 'gutenberg'
                ];
            }
        }

        // Check for shortcodes with better detection
        $shortcode_patterns = [
            '/\[embedpress[^_\]]*\]/' => 'general',
            '/\[embedpress_pdf[^\]]*\]/' => 'pdf',
            '/\[embedpress_document[^\]]*\]/' => 'document',
            '/\[embedpress_calendar[^\]]*\]/' => 'calendar'
        ];

        foreach ($shortcode_patterns as $pattern => $type) {
            if (preg_match_all($pattern, $content, $matches)) {
                foreach ($matches[0] as $match) {
                    $embeds[] = [
                        'type' => $type,
                        'source' => 'shortcode'
                    ];
                }
            }
        }

        // Check for Elementor widgets
        if (class_exists('\Elementor\Plugin')) {
            $elementor_data = get_post_meta($post->ID, '_elementor_data', true);
            if (!empty($elementor_data)) {
                $elementor_embeds = $this->find_elementor_embedpress_widgets($elementor_data);
                foreach ($elementor_embeds as $embed_type) {
                    $embeds[] = [
                        'type' => $embed_type,
                        'source' => 'elementor'
                    ];
                }
            }
        }

        return $embeds;
    }

    /**
     * Find EmbedPress blocks in parsed blocks
     *
     * @param array $blocks
     * @return array
     */
    private function find_embedpress_blocks($blocks)
    {
        $embed_types = [];
        $embedpress_blocks = [
            'embedpress/embedpress' => 'general',
            'embedpress/pdf' => 'pdf',
            'embedpress/document' => 'document',
            'embedpress/embedpress-pdf' => 'pdf',
            'embedpress/embedpress-calendar' => 'calendar',
            'embedpress/google-docs-block' => 'google-docs',
            'embedpress/google-slides-block' => 'google-slides',
            'embedpress/google-sheets-block' => 'google-sheets',
            'embedpress/google-forms-block' => 'google-forms',
            'embedpress/google-drawings-block' => 'google-drawings',
            'embedpress/google-maps-block' => 'google-maps',
            'embedpress/youtube-block' => 'youtube',
            'embedpress/vimeo-block' => 'vimeo',
            'embedpress/twitch-block' => 'twitch',
            'embedpress/wistia-block' => 'wistia'
        ];

        foreach ($blocks as $block) {
            if (isset($embedpress_blocks[$block['blockName']])) {
                $embed_types[] = $embedpress_blocks[$block['blockName']];
            }

            // Check inner blocks recursively
            if (!empty($block['innerBlocks'])) {
                $inner_embeds = $this->find_embedpress_blocks($block['innerBlocks']);
                $embed_types = array_merge($embed_types, $inner_embeds);
            }
        }

        return $embed_types;
    }

    /**
     * Find EmbedPress widgets in Elementor data
     *
     * @param string $elementor_data
     * @return array
     */
    private function find_elementor_embedpress_widgets($elementor_data)
    {
        $embed_types = [];

        // Handle both string and array cases for elementor data
        if (is_string($elementor_data)) {
            $data = json_decode($elementor_data, true);
        } else {
            // Data might already be an array in older versions
            $data = $elementor_data;
        }

        if (is_array($data)) {
            $embed_types = $this->search_elementor_widgets_recursive($data);
        }

        return $embed_types;
    }

    /**
     * Recursively search for EmbedPress widgets in Elementor data
     *
     * @param array $elements
     * @return array
     */
    private function search_elementor_widgets_recursive($elements)
    {
        $embed_types = [];
        $embedpress_widgets = [
            'embedpres_elementor' => 'embedpress',      // Main EmbedPress widget
            'embedpress_pdf' => 'pdf',                  // PDF widget
            'embedpres_document' => 'document',         // Document widget
            'embedpress-calendar' => 'calendar'         // Calendar widget (if exists)
        ];

        foreach ($elements as $element) {
            if (isset($element['widgetType']) && isset($embedpress_widgets[$element['widgetType']])) {
                $embed_types[] = $embedpress_widgets[$element['widgetType']];
            }

            if (!empty($element['elements'])) {
                $child_embeds = $this->search_elementor_widgets_recursive($element['elements']);
                $embed_types = array_merge($embed_types, $child_embeds);
            }
        }

        return $embed_types;
    }





    /**
     * Export analytics data endpoint (Pro feature)
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function export_analytics_data($request)
    {
        // Check if pro license is active
        if (!$this->license_manager->has_pro_license()) {
            return new \WP_REST_Response([
                'success' => false,
                'message' => __('Export feature requires EmbedPress Pro license.', 'embedpress')
            ], 403);
        }

        $format = $request->get_param('format') ?: 'csv';
        $date_range = $request->get_param('date_range') ?: 30;
        $start_date = $request->get_param('start_date');
        $end_date = $request->get_param('end_date');

        try {
            // Get comprehensive analytics data
            $args = [
                'date_range' => $date_range,
                'start_date' => $start_date,
                'end_date' => $end_date,
                'limit' => 1000 // Get more data for export
            ];

            // Get all analytics data
            $analytics_data = $this->data_collector->get_analytics_data($args);
            $content_analytics = [];
            $views_data = $this->data_collector->get_views_analytics($args);
            $device_data = $this->data_collector->get_device_analytics($args);

            // Merge views data into analytics data
            if (!empty($views_data)) {
                $analytics_data['views_analytics'] = $views_data;
            }

            // Add device data
            if (!empty($device_data)) {
                $analytics_data['device_analytics'] = $device_data;
            }

            if ($this->pro_collector) {
                $content_analytics = $this->pro_collector->get_detailed_content_analytics($args);

                // Get additional pro data
                $geo_data = $this->pro_collector->get_geo_analytics($args);
                $referral_data = $this->pro_collector->get_referral_analytics($args);

                if (!empty($geo_data)) {
                    $analytics_data['geo_analytics'] = $geo_data;
                }

                if (!empty($referral_data)) {
                    $analytics_data['referral_analytics'] = $referral_data;
                }
            }

            // Create export file
            $exporter = new \EmbedPress\Includes\Classes\Analytics\Export_Manager();
            $export_result = $exporter->export_data($format, $analytics_data, $content_analytics, $args);

            if ($export_result['success']) {
                // Check if this is a frontend export (PDF)
                if (isset($export_result['frontend_export']) && $export_result['frontend_export']) {
                    return new \WP_REST_Response([
                        'success' => true,
                        'frontend_export' => true,
                        'export_type' => $export_result['export_type'],
                        'html_content' => $export_result['html_content'],
                        'filename' => $export_result['filename'],
                        'message' => __('Export HTML prepared successfully.', 'embedpress')
                    ], 200);
                } else {
                    // Backend-generated file (CSV, Excel)
                    return new \WP_REST_Response([
                        'success' => true,
                        'download_url' => $export_result['download_url'],
                        'filename' => $export_result['filename'],
                        'message' => __('Export completed successfully.', 'embedpress')
                    ], 200);
                }
            } else {
                return new \WP_REST_Response([
                    'success' => false,
                    'message' => $export_result['message'] ?: __('Export failed.', 'embedpress')
                ], 500);
            }

        } catch (\Exception $e) {
            return new \WP_REST_Response([
                'success' => false,
                'message' => __('Export failed: ', 'embedpress') . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Handle analytics tracking setting (GET/POST)
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function handle_tracking_setting($request)
    {
        $method = $request->get_method();

        if ($method === 'GET') {
            // Get current tracking setting
            $enabled = get_option('embedpress_analytics_tracking_enabled', true);

            return new \WP_REST_Response([
                'success' => true,
                'enabled' => (bool) $enabled
            ], 200);
        }

        if ($method === 'POST') {
            // Update tracking setting
            $enabled = $request->get_param('enabled');

            if ($enabled === null) {
                return new \WP_REST_Response([
                    'success' => false,
                    'message' => __('Missing enabled parameter', 'embedpress')
                ], 400);
            }

            $enabled = (bool) $enabled;
            update_option('embedpress_analytics_tracking_enabled', $enabled);

            return new \WP_REST_Response([
                'success' => true,
                'enabled' => $enabled,
                'message' => $enabled
                    ? __('Analytics tracking enabled', 'embedpress')
                    : __('Analytics tracking disabled', 'embedpress')
            ], 200);
        }

        return new \WP_REST_Response([
            'success' => false,
            'message' => __('Method not allowed', 'embedpress')
        ], 405);
    }

    /**
     * Cleanup redundant analytics data
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function cleanup_redundant_data($request)
    {
        global $wpdb;

        $cleanup_type = $request->get_param('cleanup_type') ?: 'all';
        $results = [];

        try {
            if ($cleanup_type === 'duplicate_interactions' || $cleanup_type === 'all') {
                $results['duplicate_interactions'] = $this->cleanup_duplicate_interactions();
            }

            if ($cleanup_type === 'redundant_browser_info' || $cleanup_type === 'all') {
                $results['redundant_browser_info'] = $this->cleanup_redundant_browser_info();
            }

            return new \WP_REST_Response([
                'success' => true,
                'message' => 'Cleanup completed successfully',
                'results' => $results
            ], 200);

        } catch (\Exception $e) {
            return new \WP_Error('cleanup_failed', $e->getMessage(), ['status' => 500]);
        }
    }

    /**
     * Cleanup duplicate interactions (same user, content, type within 1 hour)
     *
     * @return array
     */
    private function cleanup_duplicate_interactions()
    {
        global $wpdb;

        $views_table = $wpdb->prefix . 'embedpress_analytics_views';

        // Find and remove duplicate interactions within 1 hour window
        $duplicates_removed = $wpdb->query("
            DELETE v1 FROM $views_table v1
            INNER JOIN $views_table v2
            WHERE v1.id > v2.id
            AND v1.user_id = v2.user_id
            AND v1.content_id = v2.content_id
            AND v1.interaction_type = v2.interaction_type
            AND v1.user_id IS NOT NULL
            AND v2.user_id IS NOT NULL
            AND TIMESTAMPDIFF(MINUTE, v2.created_at, v1.created_at) <= 60
        ");

        return [
            'duplicates_removed' => $duplicates_removed,
            'description' => 'Removed duplicate interactions within 1-hour windows'
        ];
    }

    /**
     * Cleanup redundant browser info (keep only latest per user/fingerprint)
     *
     * @return array
     */
    private function cleanup_redundant_browser_info()
    {
        global $wpdb;

        $browser_table = $wpdb->prefix . 'embedpress_analytics_browser_info';

        // Remove duplicate browser info entries, keeping only the latest per user/fingerprint
        $duplicates_removed = $wpdb->query("
            DELETE b1 FROM $browser_table b1
            INNER JOIN $browser_table b2
            WHERE b1.id < b2.id
            AND b1.user_id = b2.user_id
            AND b1.browser_fingerprint = b2.browser_fingerprint
            AND b1.user_id IS NOT NULL
            AND b2.user_id IS NOT NULL
            AND b1.browser_fingerprint IS NOT NULL
            AND b2.browser_fingerprint IS NOT NULL
        ");

        // Also remove entries without user_id or browser_fingerprint (old format)
        $old_format_removed = $wpdb->query("
            DELETE FROM $browser_table
            WHERE user_id IS NULL OR browser_fingerprint IS NULL
        ");

        return [
            'duplicates_removed' => $duplicates_removed,
            'old_format_removed' => $old_format_removed,
            'description' => 'Removed duplicate browser info and old format entries'
        ];
    }

    /**
     * Get performance statistics endpoint
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function get_performance_stats($request)
    {
        $data_collector = new Data_Collector();
        $stats = $data_collector->get_performance_stats();

        return new \WP_REST_Response([
            'success' => true,
            'data' => $stats
        ], 200);
    }

}
