<?php

namespace EmbedPress\Includes\Classes\Analytics;

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
    }

    /**
     * Check admin permissions
     *
     * @return bool
     */
    public function check_admin_permissions()
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
}
