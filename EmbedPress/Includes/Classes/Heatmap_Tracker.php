<?php

namespace EmbedPress\Includes\Classes;

defined('ABSPATH') or die("No direct script access allowed.");

/**
 * Drop-off Heatmap
 *
 * Stores anonymous "viewer reached this 1-percent bucket" counts per
 * video. Storage is a single WP option per video URL hash (`embedpress_heatmap_<md5>`)
 * containing a 100-element integer array — keeps the schema migration
 * free for v1 and the per-video data well under the option size limits.
 *
 * No IPs, cookies, or user IDs are recorded. Each sample write only
 * increments a counter for the bucket the viewer is currently in.
 */
class Heatmap_Tracker
{
    const BUCKETS = 100;

    public function __construct()
    {
        add_action('rest_api_init', [$this, 'register_routes']);
    }

    public function register_routes()
    {
        register_rest_route('embedpress/v1', '/heatmap/sample', [
            'methods'             => 'POST',
            'callback'            => [$this, 'handle_sample'],
            'permission_callback' => '__return_true',
            'args' => [
                'video_url' => [
                    'required' => true,
                    'type'     => 'string',
                    'sanitize_callback' => 'esc_url_raw',
                ],
                'bucket' => [
                    'required' => true,
                    'type'     => 'integer',
                ],
            ],
        ]);

        register_rest_route('embedpress/v1', '/heatmap/data', [
            'methods'             => 'GET',
            'callback'            => [$this, 'handle_data'],
            'permission_callback' => function () {
                return current_user_can('edit_posts');
            },
            'args' => [
                'video_url' => [
                    'required' => true,
                    'type'     => 'string',
                    'sanitize_callback' => 'esc_url_raw',
                ],
            ],
        ]);
    }

    public function handle_sample(\WP_REST_Request $request)
    {
        $video_url = (string) $request->get_param('video_url');
        $bucket    = (int) $request->get_param('bucket');
        if (!$video_url || $bucket < 0 || $bucket >= self::BUCKETS) {
            return new \WP_REST_Response(['message' => 'bad bucket'], 400);
        }

        $key = self::option_key($video_url);
        $data = get_option($key, null);
        if (!is_array($data) || count($data) !== self::BUCKETS) {
            $data = array_fill(0, self::BUCKETS, 0);
        }
        $data[$bucket] = ((int) $data[$bucket]) + 1;
        update_option($key, $data, false);

        return new \WP_REST_Response(['message' => 'ok'], 200);
    }

    public function handle_data(\WP_REST_Request $request)
    {
        $video_url = (string) $request->get_param('video_url');
        $key = self::option_key($video_url);
        $data = get_option($key, null);
        if (!is_array($data) || count($data) !== self::BUCKETS) {
            $data = array_fill(0, self::BUCKETS, 0);
        }
        return new \WP_REST_Response([
            'video_url' => $video_url,
            'buckets'   => array_map('intval', $data),
        ], 200);
    }

    public static function option_key($video_url)
    {
        return 'embedpress_heatmap_' . md5($video_url);
    }
}
