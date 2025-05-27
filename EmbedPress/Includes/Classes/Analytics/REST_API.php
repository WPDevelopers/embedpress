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
    /**
     * Register REST API routes
     *
     * @return void
     */
    public function register_routes()
    {
        // Track interaction endpoint (public)
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

        // Get analytics data (admin only)
        register_rest_route('embedpress/v1', '/analytics/data', [
            'methods' => 'GET',
            'callback' => [$this, 'get_analytics_data'],
            'permission_callback' => [$this, 'check_admin_permissions']
        ]);

        // Get content analytics (admin only)
        register_rest_route('embedpress/v1', '/analytics/content', [
            'methods' => 'GET',
            'callback' => [$this, 'get_content_analytics'],
            'permission_callback' => [$this, 'check_admin_permissions']
        ]);

        // Get views analytics (admin only)
        register_rest_route('embedpress/v1', '/analytics/views', [
            'methods' => 'GET',
            'callback' => [$this, 'get_views_analytics'],
            'permission_callback' => [$this, 'check_admin_permissions']
        ]);

        // Get browser analytics (admin only)
        register_rest_route('embedpress/v1', '/analytics/browser', [
            'methods' => 'GET',
            'callback' => [$this, 'get_browser_analytics'],
            'permission_callback' => [$this, 'check_admin_permissions']
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
        $data_collector = new Data_Collector();

        $args = [
            'date_range' => $request->get_param('date_range') ?: 30
        ];

        $data = $data_collector->get_analytics_data($args);

        return new \WP_REST_Response($data, 200);
    }

    /**
     * Get content analytics endpoint
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function get_content_analytics($request)
    {
        $data_collector = new Data_Collector();
        $data = $data_collector->get_total_content_by_type();

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
     * Get milestone data endpoint
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
     * @return \WP_REST_Response
     */
    public function get_unique_viewers_per_embed($request)
    {
        $data_collector = new Data_Collector();

        $args = [
            'date_range' => $request->get_param('date_range') ?: 30
        ];

        $data = $data_collector->get_unique_viewers_per_embed($args);

        return new \WP_REST_Response($data, 200);
    }

    /**
     * Get geo analytics endpoint (Pro)
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function get_geo_analytics($request)
    {
        $data_collector = new Data_Collector();

        $args = [
            'date_range' => $request->get_param('date_range') ?: 30
        ];

        $data = $data_collector->get_geo_analytics($args);

        return new \WP_REST_Response($data, 200);
    }

    /**
     * Get device analytics endpoint (Pro)
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function get_device_analytics($request)
    {
        $data_collector = new Data_Collector();

        $args = [
            'date_range' => $request->get_param('date_range') ?: 30
        ];

        $data = $data_collector->get_device_analytics($args);

        return new \WP_REST_Response($data, 200);
    }

    /**
     * Get referral analytics endpoint (Pro)
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function get_referral_analytics($request)
    {
        $data_collector = new Data_Collector();

        $args = [
            'date_range' => $request->get_param('date_range') ?: 30
        ];

        $data = $data_collector->get_referral_analytics($args);

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
}
