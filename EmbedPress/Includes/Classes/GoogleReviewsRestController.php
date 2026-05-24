<?php

namespace EmbedPress\Includes\Classes;

use WP_REST_Request;
use WP_REST_Response;
use WP_Error;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * REST endpoints powering the Google Reviews searchable picker, live preview,
 * settings save, and cache flush. All endpoints require `edit_posts` so the
 * Places API key never leaves the server.
 */
class GoogleReviewsRestController
{
    const NS = 'embedpress/v1';

    public static function register()
    {
        register_rest_route(self::NS, '/google-reviews/search', [
            'methods'             => 'GET',
            'callback'            => [__CLASS__, 'search'],
            'permission_callback' => [__CLASS__, 'can_edit'],
            'args'                => [
                'q' => ['type' => 'string', 'required' => true],
            ],
        ]);

        register_rest_route(self::NS, '/google-reviews/preview', [
            'methods'             => 'GET',
            'callback'            => [__CLASS__, 'preview'],
            'permission_callback' => [__CLASS__, 'can_edit'],
            'args'                => [
                'place_id'   => ['type' => 'string', 'required' => true],
                'place_name' => ['type' => 'string'],
                'limit'      => ['type' => 'integer', 'default' => 5],
                'min_rating' => ['type' => 'integer', 'default' => 0],
                'layout'     => ['type' => 'string', 'default' => 'list'],
                'show_photo' => ['type' => 'boolean', 'default' => true],
                'show_date'  => ['type' => 'boolean', 'default' => true],
                'show_stars' => ['type' => 'boolean', 'default' => true],
                'show_link'  => ['type' => 'boolean', 'default' => true],
            ],
        ]);

        register_rest_route(self::NS, '/google-reviews/settings', [
            [
                'methods'             => 'GET',
                'callback'            => [__CLASS__, 'get_settings'],
                'permission_callback' => [__CLASS__, 'can_manage'],
            ],
            [
                'methods'             => 'POST',
                'callback'            => [__CLASS__, 'save_settings'],
                'permission_callback' => [__CLASS__, 'can_manage'],
                'args'                => [
                    'api_key'   => ['type' => 'string'],
                    'cache_ttl' => ['type' => 'integer'],
                ],
            ],
        ]);

        register_rest_route(self::NS, '/google-reviews/clear-cache', [
            'methods'             => 'POST',
            'callback'            => [__CLASS__, 'clear_cache'],
            'permission_callback' => [__CLASS__, 'can_manage'],
        ]);

        register_rest_route(self::NS, '/google-reviews/places', [
            [
                'methods'             => 'GET',
                'callback'            => [__CLASS__, 'get_places'],
                'permission_callback' => [__CLASS__, 'can_edit'],
            ],
            [
                'methods'             => 'POST',
                'callback'            => [__CLASS__, 'post_places'],
                'permission_callback' => [__CLASS__, 'can_edit'],
                'args'                => [
                    'action'     => ['type' => 'string', 'required' => true],
                    'place_id'   => ['type' => 'string', 'required' => true],
                    'place_name' => ['type' => 'string'],
                ],
            ],
        ]);
    }

    public static function can_edit()
    {
        return current_user_can('edit_posts');
    }

    public static function can_manage()
    {
        return current_user_can('manage_options');
    }

    /**
     * Proxy Google Places Autocomplete so the API key stays server-side.
     */
    public static function search(WP_REST_Request $request)
    {
        $q = trim((string) $request->get_param('q'));
        if ($q === '' || mb_strlen($q) < 2) {
            return new WP_REST_Response(['predictions' => []], 200);
        }

        $cache_key = 'embedpress_gr_ac_' . md5(strtolower($q));
        $cached = get_transient($cache_key);
        if (is_array($cached)) {
            return new WP_REST_Response(['predictions' => $cached, 'cached' => true], 200);
        }

        $predictions = GoogleReviewsRenderer::autocomplete($q);
        if (is_wp_error($predictions)) {
            return $predictions;
        }

        set_transient($cache_key, $predictions, 5 * MINUTE_IN_SECONDS);
        return new WP_REST_Response(['predictions' => $predictions, 'api_mode' => GoogleReviewsRenderer::get_api_mode()], 200);
    }

    /**
     * Server-rendered preview of the Google Reviews block. The editor & the
     * settings-page shortcode generator both use this so what they see is
     * exactly what the frontend will render.
     */
    public static function preview(WP_REST_Request $request)
    {
        $args = [
            'place_id'   => sanitize_text_field((string) $request->get_param('place_id')),
            'place_name' => sanitize_text_field((string) $request->get_param('place_name')),
            'limit'      => (int) $request->get_param('limit'),
            'min_rating' => (int) $request->get_param('min_rating'),
            'layout'     => sanitize_key((string) $request->get_param('layout')),
            'show_photo' => (bool) $request->get_param('show_photo'),
            'show_date'  => (bool) $request->get_param('show_date'),
            'show_stars' => (bool) $request->get_param('show_stars'),
            'show_link'  => (bool) $request->get_param('show_link'),
        ];
        return new WP_REST_Response([
            'html'         => GoogleReviewsRenderer::render($args),
            'stylesheet'   => EMBEDPRESS_URL_STATIC . 'css/google-reviews.css?ver=' . EMBEDPRESS_VERSION,
        ], 200);
    }

    public static function get_settings()
    {
        return new WP_REST_Response([
            'api_key_configured' => GoogleReviewsRenderer::get_api_key() !== '',
            'api_key_masked'     => self::mask_key(GoogleReviewsRenderer::get_api_key()),
            'cache_ttl'          => GoogleReviewsRenderer::get_cache_ttl(),
            'api_mode'           => GoogleReviewsRenderer::get_api_mode(),
        ], 200);
    }

    public static function save_settings(WP_REST_Request $request)
    {
        $api_key = $request->get_param('api_key');
        if (is_string($api_key) && $api_key !== '') {
            // Allow a sentinel "***" to mean "leave the key alone" so the
            // masked-display flow doesn't accidentally wipe it.
            if (trim($api_key) !== '***') {
                $previous = GoogleReviewsRenderer::get_api_key();
                update_option(GoogleReviewsRenderer::OPT_API_KEY, sanitize_text_field($api_key));
                // Key changed → invalidate the cached API variant so the next
                // call re-probes which endpoint family this key is enabled for.
                if (trim($api_key) !== $previous) {
                    GoogleReviewsRenderer::set_api_mode('auto');
                }
            }
        } elseif ($api_key === '') {
            delete_option(GoogleReviewsRenderer::OPT_API_KEY);
            GoogleReviewsRenderer::set_api_mode('auto');
        }

        $ttl = $request->get_param('cache_ttl');
        if ($ttl !== null) {
            $ttl = (int) $ttl;
            if ($ttl > 0) {
                update_option(GoogleReviewsRenderer::OPT_CACHE_TTL, $ttl);
            }
        }

        return self::get_settings();
    }

    public static function clear_cache()
    {
        $deleted = GoogleReviewsRenderer::clear_cache();
        return new WP_REST_Response(['deleted' => $deleted], 200);
    }

    /**
     * Return the user-curated recent + saved place lists.
     */
    public static function get_places()
    {
        return new WP_REST_Response(GoogleReviewsRenderer::get_places_lists(), 200);
    }

    /**
     * Mutate the recent/saved lists. action ∈ {recent, save, unsave}.
     *
     *   recent → push to head of the recent list (rotates at RECENT_MAX)
     *   save   → add to the explicit saved list
     *   unsave → remove from the saved list
     */
    public static function post_places(WP_REST_Request $request)
    {
        $action     = sanitize_key((string) $request->get_param('action'));
        $place_id   = sanitize_text_field((string) $request->get_param('place_id'));
        $place_name = sanitize_text_field((string) $request->get_param('place_name'));

        if ($place_id === '') {
            return new WP_Error('embedpress_gr_missing_place', __('place_id is required.', 'embedpress'), ['status' => 400]);
        }

        switch ($action) {
            case 'recent':
                GoogleReviewsRenderer::remember_recent_place($place_id, $place_name);
                break;
            case 'save':
                GoogleReviewsRenderer::toggle_saved_place($place_id, $place_name, true);
                break;
            case 'unsave':
                GoogleReviewsRenderer::toggle_saved_place($place_id, $place_name, false);
                break;
            default:
                return new WP_Error('embedpress_gr_bad_action', __('Unknown action.', 'embedpress'), ['status' => 400]);
        }

        return new WP_REST_Response(GoogleReviewsRenderer::get_places_lists(), 200);
    }

    private static function mask_key(string $key): string
    {
        if ($key === '') return '';
        $len = mb_strlen($key);
        if ($len <= 6) return str_repeat('*', $len);
        return mb_substr($key, 0, 4) . str_repeat('*', max(0, $len - 8)) . mb_substr($key, -4);
    }
}
