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

        $reviews = self::fetch_reviews($args['place_id']);

        if (is_wp_error($reviews)) {
            return self::render_error($reviews->get_error_message());
        }

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

        $client_id = 'ep-gr-' . substr(md5(wp_json_encode($args) . microtime(true)), 0, 10);

        ob_start();
        ?>
        <div id="<?php echo esc_attr($client_id); ?>" class="ep-google-reviews ep-google-reviews--<?php echo esc_attr($layout); ?>" data-layout="<?php echo esc_attr($layout); ?>">
            <?php foreach ($reviews as $review) : ?>
                <?php echo self::render_review($review, $args); ?>
            <?php endforeach; ?>
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
     * Render a single review card.
     */
    private static function render_review(array $review, array $args): string
    {
        $author = $review['author_name'] ?? __('Anonymous', 'embedpress');
        $rating = (int) ($review['rating'] ?? 0);
        $text   = $review['text'] ?? '';
        $photo  = $review['profile_photo_url'] ?? '';
        $time   = isset($review['time']) ? (int) $review['time'] : 0;

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
                    <?php if ($args['show_date'] && $time) : ?>
                        <time class="ep-gr-date" datetime="<?php echo esc_attr(gmdate('c', $time)); ?>"><?php echo esc_html(date_i18n(get_option('date_format'), $time)); ?></time>
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
            return $cached;
        }

        $url = add_query_arg(
            [
                'place_id' => $place_id,
                'fields'   => 'reviews',
                'reviews_sort' => 'newest',
                'key'      => $api_key,
            ],
            'https://maps.googleapis.com/maps/api/place/details/json'
        );

        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log('embedpress-gr: API call for place_id=' . $place_id);
        }

        $response = wp_remote_get($url, ['timeout' => 8]);
        if (is_wp_error($response)) {
            self::cache_error($cache_key, $response->get_error_message());
            return $response;
        }

        $code = wp_remote_retrieve_response_code($response);
        if ((int) $code !== 200) {
            $msg = sprintf(/* translators: %d: HTTP status code */ __('Google Places returned HTTP %d.', 'embedpress'), (int) $code);
            self::cache_error($cache_key, $msg);
            return new \WP_Error('embedpress_gr_http', $msg);
        }

        $body = json_decode(wp_remote_retrieve_body($response), true);
        $status = $body['status'] ?? 'UNKNOWN_ERROR';
        if ($status !== 'OK') {
            $msg = sprintf(/* translators: %s: Google API error status */ __('Google Places error: %s', 'embedpress'), $status);
            self::cache_error($cache_key, $msg);
            return new \WP_Error('embedpress_gr_api_' . strtolower($status), $msg);
        }

        $raw = $body['result']['reviews'] ?? [];
        $reviews = [];
        foreach ($raw as $r) {
            $reviews[] = [
                'author_name'       => isset($r['author_name']) ? (string) $r['author_name'] : '',
                'rating'            => isset($r['rating']) ? (int) $r['rating'] : 0,
                'text'              => isset($r['text']) ? (string) $r['text'] : '',
                'time'              => isset($r['time']) ? (int) $r['time'] : 0,
                'profile_photo_url' => isset($r['profile_photo_url']) ? esc_url_raw($r['profile_photo_url']) : '',
            ];
        }

        set_transient($cache_key, $reviews, self::get_cache_ttl());
        return $reviews;
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
