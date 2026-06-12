<?php

namespace EmbedPress\Includes\Classes;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Renders Google Reviews for shortcode, Gutenberg block, and Elementor widget.
 * Single source of truth so all three surfaces produce identical markup.
 */
class GoogleReviewsRenderer
{
    const CACHE_PREFIX  = 'embedpress_gr_';
    const OPT_API_KEY   = 'embedpress_google_reviews_api_key';
    const OPT_CACHE_TTL = 'embedpress_google_reviews_cache_ttl';
    const OPT_API_MODE  = 'embedpress_google_reviews_api_mode';
    const OPT_RECENT    = 'embedpress_google_reviews_recent';
    const OPT_SAVED     = 'embedpress_google_reviews_saved';
    const RECENT_MAX    = 10;

    const ENDPOINT_LEGACY_AUTOCOMPLETE = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
    const ENDPOINT_LEGACY_DETAILS      = 'https://maps.googleapis.com/maps/api/place/details/json';
    const ENDPOINT_NEW_AUTOCOMPLETE    = 'https://places.googleapis.com/v1/places:autocomplete';
    const ENDPOINT_NEW_DETAILS         = 'https://places.googleapis.com/v1/places/';

    const DEFAULTS = [
        'place_id'   => '',
        'place_name' => '',
        'limit'      => 5,
        'min_rating' => 0,
        'layout'     => 'list',
        'show_photo' => true,
        'show_date'  => true,
        'show_stars' => true,
        'show_link'  => true,
    ];

    /**
     * Render a Google Reviews block from a set of args. Single entry point used by
     * the shortcode, Gutenberg render_callback, and Elementor widget.
     */
    public static function render(array $args): string
    {
        $args   = wp_parse_args($args, self::DEFAULTS);
        $layout = in_array($args['layout'], ['list', 'grid', 'carousel'], true) ? $args['layout'] : 'list';
        $limit  = max(1, min(5, (int) $args['limit']));

        $result = self::fetch_reviews($args['place_id']);

        if (is_wp_error($result)) {
            return self::render_error($result->get_error_message());
        }

        $reviews = $result['reviews'] ?? [];
        $meta    = $result['meta'] ?? [];

        if (!empty($args['min_rating'])) {
            $min     = (int) $args['min_rating'];
            $reviews = array_values(array_filter($reviews, function ($r) use ($min) {
                return (int) ($r['rating'] ?? 0) >= $min;
            }));
        }

        $reviews = array_slice($reviews, 0, $limit);

        if (empty($reviews)) {
            return self::render_empty();
        }

        $client_id   = 'ep-gr-' . substr(md5(wp_json_encode($args) . microtime(true)), 0, 10);
        $show_summary = !isset($args['show_summary']) || $args['show_summary'];

        ob_start();
        ?>
        <div id="<?php echo esc_attr($client_id); ?>" class="ep-google-reviews ep-google-reviews--<?php echo esc_attr($layout); ?>" data-layout="<?php echo esc_attr($layout); ?>">
            <?php
            if ($show_summary) {
                echo self::render_summary($meta, $args);
            }
            ?>
            <div class="ep-gr-items">
                <?php foreach ($reviews as $review) : ?>
                    <?php echo self::render_review($review, $args); ?>
                <?php endforeach; ?>
            </div>
            <?php if ($args['show_link'] && !empty($args['place_id'])) : ?>
                <div class="ep-gr-footer">
                    <a class="ep-gr-view-on-google" href="<?php echo esc_url('https://search.google.com/local/reviews?placeid=' . rawurlencode($args['place_id'])); ?>" target="_blank" rel="noopener nofollow">
                        <?php echo esc_html__('View on Google', 'embedpress'); ?>
                    </a>
                </div>
            <?php endif; ?>
        </div>
        <?php
        return ob_get_clean();
    }

    /**
     * Render the summary header: place name + overall Google rating + total
     * review count. Falls back gracefully when meta is unavailable (e.g. an
     * older cache or an API that didn't return it) — it simply renders nothing
     * rather than a half-empty header.
     */
    private static function render_summary(array $meta, array $args): string
    {
        $name   = $meta['name'] ?? ($args['place_name'] ?? '');
        $rating = isset($meta['rating']) ? (float) $meta['rating'] : 0.0;
        $total  = isset($meta['total']) ? (int) $meta['total'] : 0;

        if ($name === '' && $rating <= 0) {
            return '';
        }

        ob_start();
        ?>
        <div class="ep-gr-summary">
            <?php if ($name !== '') : ?>
                <div class="ep-gr-summary-name"><?php echo esc_html($name); ?></div>
            <?php endif; ?>
            <?php if ($rating > 0) : ?>
                <div class="ep-gr-summary-rating">
                    <span class="ep-gr-summary-score"><?php echo esc_html(number_format_i18n($rating, 1)); ?></span>
                    <span class="ep-gr-stars" role="img" aria-label="<?php /* translators: %s: average star rating out of 5 */ echo esc_attr(sprintf(__('%s out of 5 stars', 'embedpress'), number_format_i18n($rating, 1))); ?>">
                        <?php echo self::render_stars((int) round($rating)); ?>
                    </span>
                    <?php if ($total > 0) : ?>
                        <span class="ep-gr-summary-count"><?php
                            /* translators: %s: number of Google reviews */
                            echo esc_html(sprintf(_n('%s review on Google', '%s reviews on Google', $total, 'embedpress'), number_format_i18n($total)));
                        ?></span>
                    <?php endif; ?>
                </div>
            <?php endif; ?>
        </div>
        <?php
        return ob_get_clean();
    }

    /**
     * Render a single review card.
     */
    private static function render_review(array $review, array $args): string
    {
        $author   = $review['author_name'] ?? __('Anonymous', 'embedpress');
        $rating   = (int) ($review['rating'] ?? 0);
        $text     = $review['text'] ?? '';
        $photo    = $review['profile_photo_url'] ?? '';
        $time     = isset($review['time']) ? (int) $review['time'] : 0;
        // Prefer Google's relative phrasing ("a week ago") and fall back to an
        // absolute date. Matches how reviews read on Google itself.
        $relative = isset($review['relative_time']) ? (string) $review['relative_time'] : '';

        ob_start();
        ?>
        <article class="ep-gr-review" itemscope itemtype="https://schema.org/Review">
            <header class="ep-gr-review-head">
                <?php if ($args['show_photo'] && $photo) : ?>
                    <img class="ep-gr-avatar" src="<?php echo esc_url($photo); ?>" alt="" loading="lazy" width="48" height="48" referrerpolicy="no-referrer" />
                <?php elseif ($args['show_photo']) : ?>
                    <span class="ep-gr-avatar ep-gr-avatar--placeholder" aria-hidden="true"><?php echo esc_html(self::initials($author)); ?></span>
                <?php endif; ?>
                <div class="ep-gr-meta">
                    <div class="ep-gr-author" itemprop="author"><?php echo esc_html($author); ?></div>
                    <?php if ($args['show_stars']) : ?>
                        <div class="ep-gr-stars" role="img" aria-label="<?php /* translators: %d: star rating out of 5 */ echo esc_attr(sprintf(__('%d out of 5 stars', 'embedpress'), $rating)); ?>">
                            <?php echo self::render_stars($rating); ?>
                        </div>
                    <?php endif; ?>
                    <?php if ($args['show_date'] && ($relative !== '' || $time)) : ?>
                        <time class="ep-gr-date"<?php echo $time ? ' datetime="' . esc_attr(gmdate('c', $time)) . '"' : ''; ?>><?php
                            echo esc_html($relative !== '' ? $relative : date_i18n(get_option('date_format'), $time));
                        ?></time>
                    <?php endif; ?>
                </div>
            </header>
            <?php if ($text) : ?>
                <div class="ep-gr-text" itemprop="reviewBody"><?php echo esc_html($text); ?></div>
            <?php endif; ?>
        </article>
        <?php
        return ob_get_clean();
    }

    private static function render_stars(int $rating): string
    {
        $rating = max(0, min(5, $rating));
        $out    = '';
        for ($i = 1; $i <= 5; $i++) {
            $out .= '<span class="ep-gr-star ' . ($i <= $rating ? 'is-filled' : 'is-empty') . '" aria-hidden="true">★</span>';
        }
        return $out;
    }

    private static function initials(string $name): string
    {
        $parts = preg_split('/\s+/', trim($name)) ?: [];
        $first = mb_substr($parts[0] ?? '', 0, 1);
        $last  = isset($parts[1]) ? mb_substr($parts[1], 0, 1) : '';
        return strtoupper($first . $last);
    }

    private static function render_empty(): string
    {
        return '<div class="ep-google-reviews ep-google-reviews--empty">'
            . esc_html__('No reviews to display yet.', 'embedpress')
            . '</div>';
    }

    private static function render_error(string $message): string
    {
        if (!current_user_can('edit_posts')) {
            return '';
        }
        return '<div class="ep-google-reviews ep-google-reviews--error">'
            . esc_html(sprintf(/* translators: %s: error message from Google API */ __('Google Reviews error: %s', 'embedpress'), $message))
            . '</div>';
    }

    /**
     * Fetch reviews for a place_id from the Google Places API, with a
     * transient cache to stay under quota. Returns up to 5 reviews
     * (Places API hard cap) or a WP_Error if the request fails.
     *
     * Routes through self::dispatch() so we transparently support both the
     * legacy Places API and Places API (New). The dispatcher probes once,
     * persists the working mode, and falls back if the stored mode goes
     * stale (e.g. legacy gets disabled mid-project).
     *
     * @return array|\WP_Error
     */
    public static function fetch_reviews(string $place_id)
    {
        if ($place_id === '') {
            return new \WP_Error('embedpress_gr_missing_place', __('No place selected.', 'embedpress'));
        }
        if (!preg_match('/^[A-Za-z0-9_\-]+$/', $place_id)) {
            return new \WP_Error('embedpress_gr_invalid_place', __('Invalid place identifier.', 'embedpress'));
        }

        $api_key = self::get_api_key();
        if ($api_key === '') {
            return new \WP_Error('embedpress_gr_missing_key', __('Google Places API key is not configured.', 'embedpress'));
        }

        $cache_key = self::CACHE_PREFIX . md5($place_id);
        $cached    = get_transient($cache_key);
        if (is_array($cached)) {
            return self::normalize_result($cached);
        }

        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log('embedpress-gr: API call for place_id=' . $place_id);
        }

        $result = self::dispatch('details', $api_key, ['place_id' => $place_id]);
        if (is_wp_error($result)) {
            self::cache_error($cache_key, $result->get_error_message());
            return $result;
        }

        set_transient($cache_key, $result, self::get_cache_ttl());
        return self::normalize_result($result);
    }

    /**
     * Accept both the legacy flat-array review shape (older caches) and the
     * current `{reviews, meta}` shape, and always return the latter. Keeps
     * pre-existing transients valid after the meta/header change.
     */
    private static function normalize_result($data): array
    {
        if (isset($data['reviews']) && is_array($data['reviews'])) {
            return [
                'reviews' => array_values($data['reviews']),
                'meta'    => isset($data['meta']) && is_array($data['meta']) ? $data['meta'] : [],
            ];
        }
        // Legacy flat list of reviews (no meta available).
        return ['reviews' => array_values((array) $data), 'meta' => []];
    }

    /**
     * Run a Places autocomplete query, normalized across legacy + New API.
     * Returns a list of `{place_id, description, main_text, secondary_text}`
     * arrays or a WP_Error. Caller is responsible for caching.
     *
     * @return array|\WP_Error
     */
    public static function autocomplete(string $q)
    {
        $api_key = self::get_api_key();
        if ($api_key === '') {
            return new \WP_Error('embedpress_gr_no_key', __('Google Places API key is not configured.', 'embedpress'), ['status' => 400]);
        }
        return self::dispatch('autocomplete', $api_key, ['q' => $q]);
    }

    /**
     * Dispatch a Places API call against whichever variant is enabled for
     * the user's key. Tries the stored mode first; on a permission-class
     * failure, transparently tries the other and updates the stored mode
     * so future calls go direct.
     *
     * $op is 'autocomplete' or 'details'.
     *
     * @return array|\WP_Error
     */
    private static function dispatch(string $op, string $api_key, array $params)
    {
        $mode = self::get_api_mode();

        $try = function (string $variant) use ($op, $api_key, $params) {
            if ($variant === 'new') {
                return $op === 'autocomplete'
                    ? self::call_new_autocomplete($api_key, (string) ($params['q'] ?? ''))
                    : self::call_new_details($api_key, (string) ($params['place_id'] ?? ''));
            }
            return $op === 'autocomplete'
                ? self::call_legacy_autocomplete($api_key, (string) ($params['q'] ?? ''))
                : self::call_legacy_details($api_key, (string) ($params['place_id'] ?? ''));
        };

        // Order: try stored mode first; if 'auto', try New first (it's the
        // only variant available to GCP projects created after 2025-03-01).
        $first  = in_array($mode, ['new', 'legacy'], true) ? $mode : 'new';
        $second = $first === 'new' ? 'legacy' : 'new';

        $result = $try($first);
        if (!is_wp_error($result)) {
            self::set_api_mode($first);
            return $result;
        }

        if (!self::is_api_not_enabled_error($result)) {
            // A real error (bad query, network, etc.) — don't waste a second call.
            return $result;
        }

        $alt = $try($second);
        if (!is_wp_error($alt)) {
            self::set_api_mode($second);
            return $alt;
        }

        // Both failed. Surface whichever message is more informative.
        return self::is_api_not_enabled_error($alt) ? $result : $alt;
    }

    /**
     * Heuristic: does this WP_Error look like "the API variant isn't enabled
     * for this project" (vs. a key being invalid, quota exceeded, etc.)?
     */
    private static function is_api_not_enabled_error(\WP_Error $err): bool
    {
        $code = strtolower((string) $err->get_error_code());
        if (
            str_contains($code, 'request_denied')
            || str_contains($code, 'permission_denied')
            || str_contains($code, 'failed_precondition')
            || str_contains($code, 'http_403')
        ) {
            return true;
        }
        $msg = strtolower((string) $err->get_error_message());
        return str_contains($msg, 'legacy api') || str_contains($msg, 'has not been used in project') || str_contains($msg, 'is not enabled');
    }

    /**
     * Legacy Places API: autocomplete. Returns normalized predictions.
     *
     * @return array|\WP_Error
     */
    private static function call_legacy_autocomplete(string $api_key, string $q)
    {
        $url = add_query_arg([
            'input' => $q,
            'types' => 'establishment',
            'key'   => $api_key,
        ], self::ENDPOINT_LEGACY_AUTOCOMPLETE);

        $response = wp_remote_get($url, ['timeout' => 6]);
        if (is_wp_error($response)) {
            return new \WP_Error('embedpress_gr_http', $response->get_error_message(), ['status' => 502]);
        }
        $body = json_decode(wp_remote_retrieve_body($response), true);
        $err  = self::legacy_status_error($body);
        if ($err) return $err;

        $predictions = [];
        foreach (($body['predictions'] ?? []) as $p) {
            $predictions[] = [
                'place_id'       => isset($p['place_id']) ? (string) $p['place_id'] : '',
                'description'    => isset($p['description']) ? (string) $p['description'] : '',
                'main_text'      => isset($p['structured_formatting']['main_text']) ? (string) $p['structured_formatting']['main_text'] : '',
                'secondary_text' => isset($p['structured_formatting']['secondary_text']) ? (string) $p['structured_formatting']['secondary_text'] : '',
            ];
        }
        return $predictions;
    }

    /**
     * Legacy Places API: place details (reviews only). Returns normalized
     * review list.
     *
     * @return array|\WP_Error
     */
    private static function call_legacy_details(string $api_key, string $place_id)
    {
        $url = add_query_arg([
            'place_id'     => $place_id,
            // Pull place meta (name + overall rating + total) alongside the
            // reviews so the summary header needs no extra API call.
            'fields'       => 'name,rating,user_ratings_total,reviews',
            'reviews_sort' => 'newest',
            'key'          => $api_key,
        ], self::ENDPOINT_LEGACY_DETAILS);

        $response = wp_remote_get($url, ['timeout' => 8]);
        if (is_wp_error($response)) {
            return new \WP_Error('embedpress_gr_http', $response->get_error_message());
        }
        $code = (int) wp_remote_retrieve_response_code($response);
        if ($code !== 200) {
            return new \WP_Error('embedpress_gr_http_' . $code, sprintf(/* translators: %d: HTTP status code */ __('Google Places returned HTTP %d.', 'embedpress'), $code));
        }
        $body = json_decode(wp_remote_retrieve_body($response), true);
        $err  = self::legacy_status_error($body);
        if ($err) return $err;

        $result = $body['result'] ?? [];
        $reviews = [];
        foreach (($result['reviews'] ?? []) as $r) {
            $reviews[] = [
                'author_name'       => isset($r['author_name']) ? (string) $r['author_name'] : '',
                'rating'            => isset($r['rating']) ? (int) $r['rating'] : 0,
                'text'              => isset($r['text']) ? (string) $r['text'] : '',
                'time'              => isset($r['time']) ? (int) $r['time'] : 0,
                // Google's own "a week ago" phrasing — preferred over an
                // absolute date for review recency.
                'relative_time'     => isset($r['relative_time_description']) ? (string) $r['relative_time_description'] : '',
                'profile_photo_url' => isset($r['profile_photo_url']) ? esc_url_raw($r['profile_photo_url']) : '',
            ];
        }
        return [
            'reviews' => $reviews,
            'meta'    => [
                'name'   => isset($result['name']) ? (string) $result['name'] : '',
                'rating' => isset($result['rating']) ? (float) $result['rating'] : 0.0,
                'total'  => isset($result['user_ratings_total']) ? (int) $result['user_ratings_total'] : 0,
            ],
        ];
    }

    /**
     * Convert a legacy Places response body into a WP_Error if its `status`
     * indicates failure. Returns null on success.
     */
    private static function legacy_status_error($body): ?\WP_Error
    {
        if (!is_array($body)) {
            return new \WP_Error('embedpress_gr_bad_response', __('Invalid response from Google Places.', 'embedpress'));
        }
        $status = $body['status'] ?? 'UNKNOWN_ERROR';
        if ($status === 'OK' || $status === 'ZERO_RESULTS') return null;
        $error_message = isset($body['error_message']) ? (string) $body['error_message'] : '';
        $msg = $error_message !== ''
            ? sprintf(/* translators: 1: Google API error status, 2: Google API error message */ __('Google Places error: %1$s — %2$s', 'embedpress'), $status, $error_message)
            : sprintf(/* translators: %s: Google API error status */ __('Google Places error: %s', 'embedpress'), $status);
        $msg .= self::friendly_api_hint($status, $error_message);
        return new \WP_Error('embedpress_gr_api_' . strtolower($status), $msg, ['status' => 502]);
    }

    /**
     * Translate Google's terse/cryptic API statuses into an actionable hint
     * for the site admin. Google often returns a bare "The caller does not
     * have permission" with no remediation; this appends the concrete fix
     * (which is almost always a Cloud Console setting, not a plugin bug).
     *
     * Returns an empty string for non-error / unknown statuses so the base
     * message is unchanged.
     */
    private static function friendly_api_hint(string $status, string $message = ''): string
    {
        $status  = strtoupper($status);
        $message = strtolower($message);

        // Billing not enabled — Places API (New) requires an active billing account.
        if (strpos($message, 'billing') !== false) {
            return ' ' . __('Enable billing for your project in the Google Cloud Console — the Places API requires an active billing account.', 'embedpress');
        }

        // API not enabled on the project, or the legacy API is deprecated.
        if (
            strpos($message, 'has not been used') !== false
            || strpos($message, 'is not enabled') !== false
            || strpos($message, 'not activated') !== false
            || strpos($message, 'legacy api') !== false
            || $status === 'SERVICE_DISABLED'
        ) {
            return ' ' . __('Enable "Places API (New)" for your project in the Google Cloud Console (APIs & Services → Library), then wait a few minutes for it to take effect.', 'embedpress');
        }

        // Permission denied with no detail — almost always API-not-enabled or a
        // key restriction blocking the Places API.
        if ($status === 'PERMISSION_DENIED' || $status === 'REQUEST_DENIED') {
            return ' ' . __('Check that "Places API (New)" is enabled for your project and that your API key is not restricted from calling it (APIs & Services → Credentials → your key → API restrictions). Server-side calls also require the key to allow application restriction "None" or your server IP.', 'embedpress');
        }

        // Quota / rate limit.
        if ($status === 'RESOURCE_EXHAUSTED' || $status === 'OVER_QUERY_LIMIT') {
            return ' ' . __('Your Google Places API quota has been exceeded. Check your usage and quotas in the Google Cloud Console.', 'embedpress');
        }

        // Bad / unauthorized key.
        if ($status === 'UNAUTHENTICATED' || $status === 'INVALID_ARGUMENT' || strpos($message, 'api key not valid') !== false) {
            return ' ' . __('Your Google Places API key appears to be invalid. Re-copy it from the Google Cloud Console (APIs & Services → Credentials).', 'embedpress');
        }

        return '';
    }

    /**
     * Places API (New): autocomplete. Returns normalized predictions.
     *
     * @return array|\WP_Error
     */
    private static function call_new_autocomplete(string $api_key, string $q)
    {
        $response = wp_remote_post(self::ENDPOINT_NEW_AUTOCOMPLETE, [
            'timeout' => 6,
            'headers' => [
                'Content-Type'    => 'application/json',
                'X-Goog-Api-Key'  => $api_key,
            ],
            'body' => wp_json_encode([
                'input'                 => $q,
                'includedPrimaryTypes'  => ['establishment'],
            ]),
        ]);
        if (is_wp_error($response)) {
            return new \WP_Error('embedpress_gr_http', $response->get_error_message(), ['status' => 502]);
        }
        $body = json_decode(wp_remote_retrieve_body($response), true);
        $code = (int) wp_remote_retrieve_response_code($response);
        $err  = self::new_api_error($body, $code);
        if ($err) return $err;

        $predictions = [];
        foreach (($body['suggestions'] ?? []) as $s) {
            $p = $s['placePrediction'] ?? null;
            if (!$p) continue;
            $predictions[] = [
                'place_id'       => isset($p['placeId']) ? (string) $p['placeId'] : '',
                'description'    => isset($p['text']['text']) ? (string) $p['text']['text'] : '',
                'main_text'      => isset($p['structuredFormat']['mainText']['text']) ? (string) $p['structuredFormat']['mainText']['text'] : '',
                'secondary_text' => isset($p['structuredFormat']['secondaryText']['text']) ? (string) $p['structuredFormat']['secondaryText']['text'] : '',
            ];
        }
        return $predictions;
    }

    /**
     * Places API (New): place details (reviews). Returns normalized review list.
     *
     * @return array|\WP_Error
     */
    private static function call_new_details(string $api_key, string $place_id)
    {
        // The New API uses place resource names (`places/PLACE_ID`); a bare
        // place_id is also accepted at this endpoint.
        $response = wp_remote_get(self::ENDPOINT_NEW_DETAILS . rawurlencode($place_id), [
            'timeout' => 8,
            'headers' => [
                'X-Goog-Api-Key'    => $api_key,
                // Place meta (name + overall rating + total) alongside reviews.
                'X-Goog-FieldMask'  => 'displayName,rating,userRatingCount,reviews',
            ],
        ]);
        if (is_wp_error($response)) {
            return new \WP_Error('embedpress_gr_http', $response->get_error_message());
        }
        $body = json_decode(wp_remote_retrieve_body($response), true);
        $code = (int) wp_remote_retrieve_response_code($response);
        $err  = self::new_api_error($body, $code);
        if ($err) return $err;

        $reviews = [];
        foreach (($body['reviews'] ?? []) as $r) {
            $time = 0;
            if (!empty($r['publishTime'])) {
                $t    = strtotime((string) $r['publishTime']);
                $time = $t ? $t : 0;
            }
            $reviews[] = [
                'author_name'       => isset($r['authorAttribution']['displayName']) ? (string) $r['authorAttribution']['displayName'] : '',
                'rating'            => isset($r['rating']) ? (int) $r['rating'] : 0,
                'text'              => isset($r['text']['text']) ? (string) $r['text']['text'] : (isset($r['originalText']['text']) ? (string) $r['originalText']['text'] : ''),
                'time'              => $time,
                // Google's own "a week ago" phrasing — preferred over an
                // absolute date for review recency.
                'relative_time'     => isset($r['relativePublishTimeDescription']) ? (string) $r['relativePublishTimeDescription'] : '',
                'profile_photo_url' => isset($r['authorAttribution']['photoUri']) ? esc_url_raw((string) $r['authorAttribution']['photoUri']) : '',
            ];
        }
        return [
            'reviews' => $reviews,
            'meta'    => [
                'name'   => isset($body['displayName']['text']) ? (string) $body['displayName']['text'] : '',
                'rating' => isset($body['rating']) ? (float) $body['rating'] : 0.0,
                'total'  => isset($body['userRatingCount']) ? (int) $body['userRatingCount'] : 0,
            ],
        ];
    }

    /**
     * Convert a Places API (New) response into a WP_Error if it indicates
     * failure. The new API uses Google's standard error envelope
     * `{ error: { code, message, status } }` plus a non-200 HTTP status.
     */
    private static function new_api_error($body, int $http_code): ?\WP_Error
    {
        if (is_array($body) && isset($body['error']) && is_array($body['error'])) {
            $status  = (string) ($body['error']['status'] ?? 'UNKNOWN_ERROR');
            $message = (string) ($body['error']['message'] ?? '');
            $msg = $message !== ''
                ? sprintf(/* translators: 1: Google API error status, 2: Google API error message */ __('Google Places error: %1$s — %2$s', 'embedpress'), $status, $message)
                : sprintf(/* translators: %s: Google API error status */ __('Google Places error: %s', 'embedpress'), $status);
            $msg .= self::friendly_api_hint($status, $message);
            return new \WP_Error('embedpress_gr_api_' . strtolower($status), $msg, ['status' => 502]);
        }
        if ($http_code !== 200) {
            return new \WP_Error('embedpress_gr_http_' . $http_code, sprintf(/* translators: %d: HTTP status code */ __('Google Places returned HTTP %d.', 'embedpress'), $http_code));
        }
        if (!is_array($body)) {
            return new \WP_Error('embedpress_gr_bad_response', __('Invalid response from Google Places.', 'embedpress'));
        }
        return null;
    }

    /**
     * Cache an error briefly so we don't hammer the API while the user fixes
     * the underlying problem (bad key, quota exceeded, etc.).
     */
    private static function cache_error(string $cache_key, string $message)
    {
        set_transient($cache_key . '_err', $message, 5 * MINUTE_IN_SECONDS);
    }

    public static function get_api_key(): string
    {
        if (defined('EMBEDPRESS_GOOGLE_REVIEWS_API_KEY') && EMBEDPRESS_GOOGLE_REVIEWS_API_KEY) {
            return (string) EMBEDPRESS_GOOGLE_REVIEWS_API_KEY;
        }
        $key = get_option(self::OPT_API_KEY, '');
        return is_string($key) ? trim($key) : '';
    }

    /**
     * Which Places API variant the user's key is enabled for.
     * 'new' | 'legacy' | 'auto'. 'auto' means we'll probe on the next call.
     */
    public static function get_api_mode(): string
    {
        $mode = (string) get_option(self::OPT_API_MODE, 'auto');
        return in_array($mode, ['new', 'legacy', 'auto'], true) ? $mode : 'auto';
    }

    public static function set_api_mode(string $mode): void
    {
        if (!in_array($mode, ['new', 'legacy', 'auto'], true)) return;
        if ($mode === self::get_api_mode()) return;
        update_option(self::OPT_API_MODE, $mode);
    }

    /**
     * Return the list of recently-used and explicitly-saved places. Each
     * entry is `{place_id, place_name, used_at|saved_at}`. Saved entries
     * persist indefinitely; recent rotates at RECENT_MAX.
     */
    public static function get_places_lists(): array
    {
        $recent = get_option(self::OPT_RECENT, []);
        $saved  = get_option(self::OPT_SAVED, []);
        return [
            'recent' => is_array($recent) ? array_values($recent) : [],
            'saved'  => is_array($saved) ? array_values($saved) : [],
        ];
    }

    /**
     * Push a place to the head of the "recent" list, deduped by place_id.
     * No-op if place_id is empty. Trims to RECENT_MAX.
     */
    public static function remember_recent_place(string $place_id, string $place_name): void
    {
        $place_id = trim($place_id);
        if ($place_id === '') return;
        $recent = get_option(self::OPT_RECENT, []);
        if (!is_array($recent)) $recent = [];
        $recent = array_values(array_filter($recent, function ($p) use ($place_id) {
            return is_array($p) && ($p['place_id'] ?? '') !== $place_id;
        }));
        array_unshift($recent, [
            'place_id'   => $place_id,
            'place_name' => sanitize_text_field($place_name),
            'used_at'    => time(),
        ]);
        if (count($recent) > self::RECENT_MAX) {
            $recent = array_slice($recent, 0, self::RECENT_MAX);
        }
        update_option(self::OPT_RECENT, $recent);
    }

    /**
     * Add or remove a place from the explicit "saved" list.
     */
    public static function toggle_saved_place(string $place_id, string $place_name, bool $save): void
    {
        $place_id = trim($place_id);
        if ($place_id === '') return;
        $saved = get_option(self::OPT_SAVED, []);
        if (!is_array($saved)) $saved = [];
        $saved = array_values(array_filter($saved, function ($p) use ($place_id) {
            return is_array($p) && ($p['place_id'] ?? '') !== $place_id;
        }));
        if ($save) {
            array_unshift($saved, [
                'place_id'   => $place_id,
                'place_name' => sanitize_text_field($place_name),
                'saved_at'   => time(),
            ]);
        }
        update_option(self::OPT_SAVED, $saved);
    }

    public static function get_cache_ttl(): int
    {
        $ttl = (int) get_option(self::OPT_CACHE_TTL, 6 * HOUR_IN_SECONDS);
        return $ttl > 0 ? $ttl : 6 * HOUR_IN_SECONDS;
    }

    /**
     * Flush all Google Reviews transients (the cache + error markers).
     * Returns the number of rows deleted.
     */
    public static function clear_cache(): int
    {
        global $wpdb;
        $like = $wpdb->esc_like('_transient_' . self::CACHE_PREFIX) . '%';
        $like_timeout = $wpdb->esc_like('_transient_timeout_' . self::CACHE_PREFIX) . '%';
        $a = (int) $wpdb->query($wpdb->prepare("DELETE FROM {$wpdb->options} WHERE option_name LIKE %s", $like));
        $b = (int) $wpdb->query($wpdb->prepare("DELETE FROM {$wpdb->options} WHERE option_name LIKE %s", $like_timeout));
        return $a + $b;
    }

    /**
     * Enqueue the frontend stylesheet. Safe to call multiple times. Also
     * registers an `init` hook so the Gutenberg editor pulls the same CSS
     * into the editor iframe (ServerSideRender returns raw HTML so the
     * editor needs our stylesheet to render the cards correctly).
     */
    public static function enqueue_assets()
    {
        if (!wp_style_is('embedpress-google-reviews', 'registered')) {
            wp_register_style(
                'embedpress-google-reviews',
                EMBEDPRESS_URL_STATIC . 'css/google-reviews.css',
                [],
                EMBEDPRESS_VERSION
            );
        }
        wp_enqueue_style('embedpress-google-reviews');
    }

    /**
     * Hook for `enqueue_block_editor_assets` — load the frontend stylesheet
     * inside the block editor so ServerSideRender output renders correctly.
     */
    public static function enqueue_editor_assets()
    {
        self::enqueue_assets();
    }
}
