<?php

namespace EmbedPress\Includes\Classes;

defined('ABSPATH') or die("No direct script access allowed.");

/**
 * Course Completion Tracker
 *
 * Receives `video-completed` POST callbacks from the custom player and
 * fires `embedpress_video_completed` so LMS adapters (LearnDash,
 * TutorLMS, LifterLMS, etc.) can mark the corresponding lesson complete.
 *
 * Server-side anti-skip guard: rejects callbacks whose watched_seconds
 * is less than 85 % of total_seconds. Adapters should still verify
 * lesson ownership before crediting completion.
 */
class Completion_Tracker
{
    const MIN_WATCH_RATIO = 0.85;

    public function __construct()
    {
        add_action('rest_api_init', [$this, 'register_routes']);
    }

    public function register_routes()
    {
        register_rest_route('embedpress/v1', '/completion', [
            'methods'             => 'POST',
            'callback'            => [$this, 'handle_completion'],
            'permission_callback' => '__return_true',
            'args' => [
                'video_url' => [
                    'required' => true,
                    'type'     => 'string',
                    'sanitize_callback' => 'esc_url_raw',
                ],
                'watched_seconds' => [
                    'required' => true,
                    'type'     => 'number',
                ],
                'total_seconds' => [
                    'required' => true,
                    'type'     => 'number',
                ],
            ],
        ]);
    }

    public function handle_completion(\WP_REST_Request $request)
    {
        $watched = (float) $request->get_param('watched_seconds');
        $total   = (float) $request->get_param('total_seconds');
        if ($total <= 0) {
            return new \WP_REST_Response(['message' => 'Invalid duration'], 400);
        }
        if ($watched / $total < self::MIN_WATCH_RATIO) {
            return new \WP_REST_Response(['message' => 'Insufficient watch time'], 422);
        }

        $payload = [
            'video_url'       => (string) $request->get_param('video_url'),
            'user_id'         => get_current_user_id(),
            'watched_seconds' => $watched,
            'total_seconds'   => $total,
            'page_url'        => isset($_SERVER['HTTP_REFERER']) ? esc_url_raw($_SERVER['HTTP_REFERER']) : '',
            'completed_at'    => current_time('mysql'),
        ];

        /**
         * Fires when a viewer completes a video.
         * LMS adapters hook here to mark the corresponding lesson complete.
         */
        do_action('embedpress_video_completed', $payload);

        return new \WP_REST_Response(['message' => 'ok'], 200);
    }
}
