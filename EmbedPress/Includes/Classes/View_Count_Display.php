<?php

namespace EmbedPress\Includes\Classes;

use EmbedPress\Includes\Classes\Analytics\Data_Collector;

defined('ABSPATH') or die("No direct script access allowed.");

/**
 * Public-facing PDF / Document view-count badge.
 *
 * Works uniformly across Gutenberg blocks, the [embedpress] shortcode, and the
 * Elementor PDF / Document widgets — all of which already emit a wrapper with
 * `data-embed-type="PDF"` or `data-embed-type="Document"`. The frontend script
 * discovers those wrappers, fetches the per-embed view count from the REST
 * endpoint registered here, and injects a `.ep-view-count` badge into the DOM.
 *
 * Reads from the existing analytics views table — no schema change.
 */
class View_Count_Display
{
    const REST_NAMESPACE = 'embedpress/v1';

    /**
     * Embed-type marker values we treat as PDF/document.
     *
     * Gutenberg blocks emit `PDF` / `Document`; the [embedpress] shortcode
     * uses provider strings like `document_pdf`, `document_doc`,
     * `document_ppt`, etc.; the Elementor PDF widget uses `PDF`.
     */
    public static function get_supported_types()
    {
        return apply_filters('embedpress_view_count_supported_types', [
            'PDF',
            'Document',
            'document',
            'document_pdf',
            'document_doc',
            'document_docx',
            'document_ppt',
            'document_pptx',
            'document_xls',
            'document_xlsx',
        ]);
    }

    /**
     * Master toggle for the visitor-facing view-count badge.
     * Independent of `embedpress_analytics_tracking_enabled`: when this is on
     * the badge renders (and self-records views) regardless of whether the
     * analytics dashboard / tracker is enabled.
     */
    const OPTION_ENABLED = 'embedpress_show_visitor_view_count';
    const OPTION_DOWNLOAD_ENABLED = 'embedpress_show_download_counter';

    public static function is_enabled()
    {
        return (bool) apply_filters(
            'embedpress_show_view_count',
            get_option(self::OPTION_ENABLED, false)
        );
    }

    public static function is_download_enabled()
    {
        return (bool) apply_filters(
            'embedpress_show_download_counter',
            get_option(self::OPTION_DOWNLOAD_ENABLED, false)
        );
    }

    public static function register()
    {
        add_action('rest_api_init', [self::class, 'register_rest_route']);
        add_action('wp_enqueue_scripts', [self::class, 'enqueue_assets']);
    }

    public static function register_rest_route()
    {
        register_rest_route(self::REST_NAMESPACE, '/analytics/view-count', [
            'methods'             => 'GET',
            'permission_callback' => '__return_true',
            'args'                => [
                'content_id' => [
                    'required'          => true,
                    'sanitize_callback' => 'sanitize_text_field',
                ],
            ],
            'callback' => [self::class, 'rest_get_view_count'],
        ]);

        register_rest_route(self::REST_NAMESPACE, '/analytics/view-count/track', [
            'methods'             => 'POST',
            'permission_callback' => '__return_true',
            'args'                => [
                'content_id' => [
                    'required'          => true,
                    'sanitize_callback' => 'sanitize_text_field',
                ],
                'session_id' => [
                    'required'          => false,
                    'sanitize_callback' => 'sanitize_text_field',
                ],
                'embed_url' => [
                    'required'          => false,
                    'sanitize_callback' => 'esc_url_raw',
                ],
                'embed_type' => [
                    'required'          => false,
                    'sanitize_callback' => 'sanitize_text_field',
                ],
            ],
            'callback' => [self::class, 'rest_track_view'],
        ]);

        register_rest_route(self::REST_NAMESPACE, '/analytics/download-count', [
            'methods'             => 'GET',
            'permission_callback' => '__return_true',
            'args'                => [
                'content_id' => [
                    'required'          => true,
                    'sanitize_callback' => 'sanitize_text_field',
                ],
            ],
            'callback' => [self::class, 'rest_get_download_count'],
        ]);

        register_rest_route(self::REST_NAMESPACE, '/analytics/view-count/download', [
            'methods'             => 'POST',
            'permission_callback' => '__return_true',
            'args'                => [
                'content_id' => [
                    'required'          => true,
                    'sanitize_callback' => 'sanitize_text_field',
                ],
                'session_id' => [
                    'required'          => false,
                    'sanitize_callback' => 'sanitize_text_field',
                ],
                'embed_url' => [
                    'required'          => false,
                    'sanitize_callback' => 'esc_url_raw',
                ],
                'embed_type' => [
                    'required'          => false,
                    'sanitize_callback' => 'sanitize_text_field',
                ],
            ],
            'callback' => [self::class, 'rest_track_download'],
        ]);
    }

    public static function rest_get_download_count($request)
    {
        $content_id = (string) $request->get_param('content_id');
        $count      = (new Data_Collector())->get_download_count_by_content_id($content_id);

        return rest_ensure_response([
            'content_id' => $content_id,
            'count'      => (int) $count,
        ]);
    }

    /**
     * Self-record a download click. Mirrors rest_track_view but writes a row
     * tagged as a download (interaction_type=click, source=download in JSON).
     * Session-deduped per day so a single visitor clicking N times only
     * registers once.
     */
    public static function rest_track_download($request)
    {
        if (!self::is_download_enabled()) {
            return rest_ensure_response(['recorded' => false, 'count' => 0]);
        }

        global $wpdb;
        $content_id = (string) $request->get_param('content_id');
        $session_id = (string) ($request->get_param('session_id') ?: '');
        $embed_url  = (string) ($request->get_param('embed_url') ?: '');
        $embed_type = (string) ($request->get_param('embed_type') ?: '');

        if ($content_id === '' || $session_id === '') {
            return new \WP_Error('embedpress_invalid_args', 'content_id and session_id are required', ['status' => 400]);
        }

        $table = $wpdb->prefix . 'embedpress_analytics_views';

        // Every download click increments the badge — record one row per
        // download rather than deduping per session/day. A download is an
        // intentional action, so downloading the same file again counts again.
        $wpdb->insert($table, [
            'content_id'       => $content_id,
            'session_id'       => $session_id,
            'user_id'          => $session_id,
            'interaction_type' => 'click',
            'user_ip'          => self::get_ip(),
            'page_url'         => isset($_SERVER['HTTP_REFERER']) ? esc_url_raw(wp_unslash($_SERVER['HTTP_REFERER'])) : '',
            'interaction_data' => wp_json_encode([
                'embed_type' => $embed_type,
                'embed_url'  => $embed_url,
                'source'     => 'download',
            ]),
            'created_at'       => current_time('mysql'),
        ]);

        $count = (new Data_Collector())->get_download_count_by_content_id($content_id);
        return rest_ensure_response([
            'recorded'   => true,
            'content_id' => $content_id,
            'count'      => (int) $count,
        ]);
    }

    public static function rest_get_view_count($request)
    {
        $content_id = (string) $request->get_param('content_id');
        $count      = (new Data_Collector())->get_view_count_by_content_id($content_id);

        return rest_ensure_response([
            'content_id' => $content_id,
            'count'      => (int) $count,
        ]);
    }

    /**
     * Self-record a 'view' row for the visitor-view-count badge.
     *
     * Writes to the existing analytics views table so the count is consistent
     * with what the analytics dashboard sees, but the write path is independent
     * of `embedpress_analytics_tracking_enabled` — the badge feature has its
     * own toggle and is allowed to grow its count even when the dashboard
     * tracker is disabled.
     *
     * Per-day per-session dedup avoids double-counting when the analytics
     * tracker is ALSO active for the same session.
     */
    public static function rest_track_view($request)
    {
        if (!self::is_enabled()) {
            return rest_ensure_response(['recorded' => false, 'count' => 0]);
        }

        global $wpdb;
        $content_id = (string) $request->get_param('content_id');
        $session_id = (string) ($request->get_param('session_id') ?: '');
        $embed_url  = (string) ($request->get_param('embed_url') ?: '');
        $embed_type = (string) ($request->get_param('embed_type') ?: '');

        if ($content_id === '' || $session_id === '') {
            return new \WP_Error('embedpress_invalid_args', 'content_id and session_id are required', ['status' => 400]);
        }

        $table = $wpdb->prefix . 'embedpress_analytics_views';

        // Every view increments the badge — record one row per request rather
        // than deduping per session/day. The badge is a raw view tally (hit
        // counter), so a repeat visit or refresh counts again.
        $wpdb->insert($table, [
            'content_id'       => $content_id,
            'session_id'       => $session_id,
            'user_id'          => $session_id,
            'interaction_type' => 'view',
            'user_ip'          => self::get_ip(),
            'page_url'         => isset($_SERVER['HTTP_REFERER']) ? esc_url_raw(wp_unslash($_SERVER['HTTP_REFERER'])) : '',
            'interaction_data' => wp_json_encode([
                'embed_type' => $embed_type,
                'embed_url'  => $embed_url,
                'source'     => 'visitor_view_count',
            ]),
            'created_at'       => current_time('mysql'),
        ]);

        $count = (new Data_Collector())->get_view_count_by_content_id($content_id);
        return rest_ensure_response([
            'recorded'   => true,
            'content_id' => $content_id,
            'count'      => (int) $count,
        ]);
    }

    private static function get_ip()
    {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '';
        return is_string($ip) ? substr(sanitize_text_field($ip), 0, 45) : '';
    }

    /**
     * Does the current singular post/page contain an embed that opts INTO the
     * counter at the per-embed level (data-ep-views="on" / data-ep-downloads="on")?
     * This lets a single embed show its badge even when the global option is off,
     * which is the whole point of the per-embed toggle. Elementor pages store the
     * markup in post meta, not post_content, so we scan a serialized snapshot of
     * the post when available.
     */
    private static function post_has_optin()
    {
        if (!is_singular()) {
            return false;
        }
        $post = get_post();
        if (!$post) {
            return false;
        }
        $haystack = (string) $post->post_content;
        // Gutenberg saves the rendered data-ep-* attributes into post_content.
        if (strpos($haystack, 'data-ep-views="on"') !== false
            || strpos($haystack, 'data-ep-downloads="on"') !== false) {
            return true;
        }

        // Elementor stores SETTINGS (not rendered HTML) in _elementor_data, so
        // detect the widget toggle keys there — the rendered data-ep-views="on"
        // attribute doesn't exist until render time. Covers PDF + Document
        // widgets (embedpress_pdf_* / embedpress_doc_*).
        $elementor = get_post_meta($post->ID, '_elementor_data', true);
        if (is_string($elementor) && $elementor !== '') {
            foreach ([
                'embedpress_pdf_show_view_count',
                'embedpress_pdf_show_download_count',
                'embedpress_doc_show_view_count',
                'embedpress_doc_show_download_count',
            ] as $key) {
                // Matches "<key>":"yes" with optional JSON backslash-escaping.
                if (preg_match('/' . preg_quote($key, '/') . '\\\\?"\s*:\s*\\\\?"yes/', $elementor)) {
                    return true;
                }
            }
            // Also catch already-rendered attributes if present.
            if (strpos($elementor, 'data-ep-views\\"on') !== false
                || strpos($elementor, 'data-ep-downloads\\"on') !== false) {
                return true;
            }
        }

        return false;
    }

    public static function enqueue_assets()
    {
        if (is_admin()) {
            return;
        }
        // Rendering is driven solely by the per-embed toggle, so ship the asset
        // only when the current page has an embed that opts in
        // (data-ep-views="on" / data-ep-downloads="on"). The global option no
        // longer renders a badge on its own.
        if (!self::post_has_optin()) {
            return;
        }

        wp_enqueue_script(
            'embedpress-view-count',
            plugins_url('assets/js/ep-view-count.js', EMBEDPRESS_FILE),
            [],
            EMBEDPRESS_VERSION,
            true
        );

        wp_localize_script('embedpress-view-count', 'embedpressViewCount', [
            'restUrl'           => esc_url_raw(rest_url(self::REST_NAMESPACE . '/analytics/view-count')),
            'trackUrl'          => esc_url_raw(rest_url(self::REST_NAMESPACE . '/analytics/view-count/track')),
            'downloadUrl'       => esc_url_raw(rest_url(self::REST_NAMESPACE . '/analytics/download-count')),
            'downloadTrackUrl'  => esc_url_raw(rest_url(self::REST_NAMESPACE . '/analytics/view-count/download')),
            'viewEnabled'       => self::is_enabled(),
            'downloadEnabled'   => self::is_download_enabled(),
            // Count-badge positioning is a Pro feature — only the default
            // ('below') placement is free. The frontend ignores any Pro
            // position when Pro is inactive so the badge falls back to default.
            'isPro'             => Helper::is_pro_active(),
            'types'             => array_values(self::get_supported_types()),
            'labels'            => [
                /* translators: %s: formatted number of views */
                'singular'         => __('%s view', 'embedpress'),
                /* translators: %s: formatted number of views */
                'plural'           => __('%s views', 'embedpress'),
                'downloadButton'   => __('Download', 'embedpress'),
                /* translators: %s: formatted number of downloads */
                'downloadSingular' => __('%s download', 'embedpress'),
                /* translators: %s: formatted number of downloads */
                'downloadPlural'   => __('%s downloads', 'embedpress'),
            ],
        ]);
    }
}
