<?php

namespace EmbedPress\Includes\Classes;

use EmbedPress\Includes\Classes\PinterestOAuth;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Pinterest Feed fetcher service.
 *
 * Pulls pins from Pinterest profile and board URLs without using the
 * authenticated v5 API. Two ingestion paths in order of preference:
 *
 *   1. RSS — https://www.pinterest.com/{user}/feed.rss and
 *      https://www.pinterest.com/{user}/{board}.rss. No auth, returns image,
 *      link, title, description for the most recent ~25 pins.
 *   2. ld+json fallback — scrape <script type="application/ld+json"> from
 *      the public HTML page. Used only when RSS returns nothing.
 *
 * All responses are transient-cached under a key derived from the URL +
 * effective limit, with a default TTL of one hour. The fetcher does not
 * own the REST endpoint — Core.php registers /embedpress/v1/pinterest-feed
 * and delegates here.
 *
 * @package EmbedPress\Includes\Classes
 */
class PinterestFeedFetcher
{
    /**
     * Default cache TTL when none is provided (seconds). Literal rather
     * than WP's HOUR_IN_SECONDS so we don't depend on load order.
     */
    const DEFAULT_TTL = 3600;

    /**
     * Cap on the number of pins returned per fetch.
     */
    const MAX_LIMIT = 50;

    /**
     * Fetch a normalized array of pins for a profile or board URL.
     *
     * @param string $url   Pinterest profile or board URL.
     * @param int    $limit Maximum pins to return (1..MAX_LIMIT).
     * @param int    $ttl   Cache TTL in seconds; 0 disables the cache write.
     * @return array {
     *     @type string $feed_type  'profile' | 'board'
     *     @type string $username
     *     @type string $board
     *     @type array  $pins       List of pin arrays
     *     @type string $source     'rss' | 'ldjson' | 'cache'
     * }
     */
    public static function fetch($url, $limit = 12, $ttl = self::DEFAULT_TTL)
    {
        $limit = max(1, min(self::MAX_LIMIT, (int) $limit));
        $ttl   = max(0, (int) $ttl);

        $parsed = self::parseUrl($url);
        if (!$parsed) {
            return self::emptyResult();
        }

        $cache_key = 'ep_pin_feed_' . md5($url . '|' . $limit);
        $cached    = get_transient($cache_key);
        if (is_array($cached) && !empty($cached['pins'])) {
            $cached['source'] = 'cache';
            return $cached;
        }

        // Prefer the authenticated v5 API when the site has connected to
        // Pinterest — higher rate limit, structured data, no scraping.
        // Falls back to RSS, then ld+json when there's no token, the
        // username on the URL doesn't match the authenticated account, or
        // the API call errors.
        $pins   = self::fetchViaApi($parsed, $limit);
        $source = 'api';

        if (empty($pins)) {
            $pins   = self::fetchViaRss($parsed['rss_url']);
            $source = 'rss';
        }

        if (empty($pins)) {
            $pins   = self::fetchViaLdJson($parsed['html_url']);
            $source = 'ldjson';
        }

        if (empty($pins)) {
            return self::emptyResult($parsed);
        }

        $pins = array_slice($pins, 0, $limit);

        $result = [
            'feed_type' => $parsed['feed_type'],
            'username'  => $parsed['username'],
            'board'     => $parsed['board'],
            'pins'      => $pins,
            'source'    => $source,
            'profile'   => self::fetchProfile($parsed),
            'boards'    => self::fetchBoardsList($parsed),
        ];

        if ($ttl > 0) {
            set_transient($cache_key, $result, $ttl);
        }

        return $result;
    }

    /**
     * Resolve a Pinterest URL to its RSS endpoint and feed metadata.
     *
     * @param string $url
     * @return array|null
     */
    private static function parseUrl($url)
    {
        if (!is_string($url) || $url === '') {
            return null;
        }

        if (preg_match('~pinterest\.[a-z.]+/([a-zA-Z0-9_\.\-]+)/([a-zA-Z0-9_\-]+)/?$~i', $url, $m)) {
            $username = $m[1];
            $board    = $m[2];
            return [
                'feed_type' => 'board',
                'username'  => $username,
                'board'     => $board,
                'rss_url'   => "https://www.pinterest.com/{$username}/{$board}.rss",
                'html_url'  => "https://www.pinterest.com/{$username}/{$board}/",
            ];
        }

        if (preg_match('~pinterest\.[a-z.]+/([a-zA-Z0-9_\.\-]+)/?$~i', $url, $m)) {
            $username = $m[1];
            return [
                'feed_type' => 'profile',
                'username'  => $username,
                'board'     => '',
                'rss_url'   => "https://www.pinterest.com/{$username}/feed.rss",
                'html_url'  => "https://www.pinterest.com/{$username}/",
            ];
        }

        return null;
    }

    /**
     * Lightweight profile metadata (avatar, follower count, etc.) that the
     * header card renders. Only available via API v5 — RSS doesn't carry
     * any of this. Returns null when we can't authenticate or the URL
     * username doesn't match the connected account.
     */
    private static function fetchProfile(array $parsed)
    {
        if (!class_exists('\\EmbedPress\\Includes\\Classes\\PinterestOAuth')
            || !PinterestOAuth::isConnected()) {
            return null;
        }
        $account = PinterestOAuth::getAccountData();
        if (empty($account['username']) || strcasecmp($account['username'], $parsed['username']) !== 0) {
            return null;
        }

        $cache_key = 'ep_pin_profile_' . md5($account['username']);
        $cached    = \get_transient($cache_key);
        if (is_array($cached)) {
            return $cached;
        }

        $resp = PinterestOAuth::apiGet('user_account');
        if (\is_wp_error($resp) || !is_array($resp)) {
            return null;
        }

        $profile = [
            'username'        => $resp['username']        ?? $parsed['username'],
            'about'           => $resp['about']           ?? '',
            'business_name'   => $resp['business_name']   ?? '',
            'website_url'     => $resp['website_url']     ?? '',
            'profile_image'   => $resp['profile_image']   ?? '',
            'account_type'    => $resp['account_type']    ?? '',
            'follower_count'  => isset($resp['follower_count'])  ? (int) $resp['follower_count']  : null,
            'following_count' => isset($resp['following_count']) ? (int) $resp['following_count'] : null,
            'pin_count'       => isset($resp['pin_count'])       ? (int) $resp['pin_count']       : null,
            'board_count'     => isset($resp['board_count'])     ? (int) $resp['board_count']     : null,
            'profile_url'     => 'https://www.pinterest.com/' . $parsed['username'] . '/',
        ];

        \set_transient($cache_key, $profile, self::DEFAULT_TTL);
        return $profile;
    }

    /**
     * Boards list for the filter strip. API v5 only — RSS doesn't expose
     * the user's board catalogue. Returns [] for unauthenticated reads,
     * keeping the filter strip hidden.
     */
    private static function fetchBoardsList(array $parsed)
    {
        if (!class_exists('\\EmbedPress\\Includes\\Classes\\PinterestOAuth')
            || !PinterestOAuth::isConnected()) {
            return [];
        }
        $account = PinterestOAuth::getAccountData();
        if (empty($account['username']) || strcasecmp($account['username'], $parsed['username']) !== 0) {
            return [];
        }

        $cache_key = 'ep_pin_boards_list_' . md5($account['username']);
        $cached    = \get_transient($cache_key);
        if (is_array($cached)) {
            return $cached;
        }

        $resp = PinterestOAuth::apiGet('boards', ['page_size' => 100]);
        if (\is_wp_error($resp) || !is_array($resp) || empty($resp['items'])) {
            return [];
        }

        $boards = [];
        foreach ($resp['items'] as $b) {
            if (empty($b['name'])) continue;
            $boards[] = [
                'id'         => isset($b['id']) ? (string) $b['id'] : '',
                'name'       => (string) $b['name'],
                'slug'       => \sanitize_title($b['name']),
                'pin_count'  => isset($b['pin_count']) ? (int) $b['pin_count'] : 0,
                'cover_url'  => isset($b['media']['image_cover_url']) ? (string) $b['media']['image_cover_url'] : '',
            ];
        }

        \set_transient($cache_key, $boards, self::DEFAULT_TTL);
        return $boards;
    }

    /**
     * Fetch pins via Pinterest API v5 when the site is connected. Returns
     * [] when no connection exists, when the URL's username doesn't match
     * the authenticated account (API v5 is account-scoped — we can only
     * read pins from the connected user), or when any API call errors.
     *
     * For boards we look up the board id by slug via /boards then fetch
     * /boards/{id}/pins. For profiles we hit /pins directly.
     */
    private static function fetchViaApi(array $parsed, $limit)
    {
        if (!class_exists('\\EmbedPress\\Includes\\Classes\\PinterestOAuth')
            || !PinterestOAuth::isConnected()) {
            return [];
        }

        $account = PinterestOAuth::getAccountData();
        if (empty($account['username']) || strcasecmp($account['username'], $parsed['username']) !== 0) {
            // API v5 only exposes the authenticated user's own pins, so a
            // mismatched username can't be served by the API path.
            return [];
        }

        $page_size = max(1, min(100, $limit));

        if ($parsed['feed_type'] === 'board') {
            $board_id = self::resolveBoardId($parsed['board']);
            if (!$board_id) {
                return [];
            }
            $resp = PinterestOAuth::apiGet('boards/' . rawurlencode($board_id) . '/pins', [
                'page_size' => $page_size,
            ]);
        } else {
            $resp = PinterestOAuth::apiGet('pins', [
                'page_size' => $page_size,
            ]);
        }

        if (\is_wp_error($resp) || !is_array($resp) || empty($resp['items'])) {
            return [];
        }

        $pins = [];
        foreach ($resp['items'] as $item) {
            $pins[] = self::normalizeApiPin($item);
        }
        return $pins;
    }

    /**
     * Resolve a board slug to its API id by listing the authenticated
     * user's boards. Cached per-slug for an hour so we don't hammer the
     * boards endpoint.
     */
    private static function resolveBoardId($slug)
    {
        if (!class_exists('\\EmbedPress\\Includes\\Classes\\PinterestOAuth')) {
            return '';
        }
        $cache_key = 'ep_pin_board_id_' . md5((string) $slug);
        $cached = \get_transient($cache_key);
        if (is_string($cached) && $cached !== '') {
            return $cached;
        }

        $resp = PinterestOAuth::apiGet('boards', ['page_size' => 100]);
        if (\is_wp_error($resp) || !is_array($resp) || empty($resp['items'])) {
            return '';
        }

        foreach ($resp['items'] as $board) {
            if (!isset($board['name'])) continue;
            $candidate = sanitize_title($board['name']);
            if ($candidate === $slug) {
                \set_transient($cache_key, $board['id'], self::DEFAULT_TTL);
                return $board['id'];
            }
        }

        return '';
    }

    /**
     * Convert a v5 pin object to our normalized pin shape so the rest of
     * the pipeline doesn't have to care which fetcher produced it.
     */
    private static function normalizeApiPin(array $item)
    {
        $image = '';
        if (isset($item['media']['images']) && is_array($item['media']['images'])) {
            // Prefer the largest standard size Pinterest provides.
            foreach (['600x', '564x', '236x', 'orig'] as $key) {
                if (!empty($item['media']['images'][$key]['url'])) {
                    $image = $item['media']['images'][$key]['url'];
                    break;
                }
            }
        }

        $link = isset($item['link']) ? (string) $item['link'] : '';
        if ($link === '' && !empty($item['id'])) {
            $link = 'https://www.pinterest.com/pin/' . rawurlencode($item['id']) . '/';
        }

        return [
            'id'          => isset($item['id']) ? (string) $item['id'] : md5($image ?: $link),
            'title'       => isset($item['title']) ? (string) $item['title'] : '',
            'description' => isset($item['description']) ? (string) $item['description'] : '',
            'image'       => $image,
            'link'        => $link,
            'pub_date'    => isset($item['created_at']) ? (string) $item['created_at'] : '',
            'board_name'  => isset($item['board_owner']['username']) ? (string) $item['board_owner']['username']
                : (isset($item['board_id']) ? '' : ''),
            'board_id'    => isset($item['board_id']) ? (string) $item['board_id'] : '',
            'media_type'  => isset($item['media']['media_type']) ? (string) $item['media']['media_type'] : 'image',
        ];
    }

    /**
     * Fetch + parse the public RSS endpoint. Returns [] on any failure so
     * the caller can fall back to ld+json.
     */
    private static function fetchViaRss($rss_url)
    {
        $body = self::httpGet($rss_url);
        if (empty($body)) {
            return [];
        }

        $prev = libxml_use_internal_errors(true);
        $xml  = simplexml_load_string($body);
        libxml_use_internal_errors($prev);

        if (!$xml || !isset($xml->channel->item)) {
            return [];
        }

        $pins = [];
        foreach ($xml->channel->item as $item) {
            $link        = (string) $item->link;
            $title       = (string) $item->title;
            $description = (string) $item->description;
            $pubDate     = (string) $item->pubDate;

            $image = '';
            if (preg_match('~<img[^>]+src=["\']([^"\']+)["\']~i', $description, $im)) {
                $image = $im[1];
            }

            $clean_desc = trim(wp_strip_all_tags($description));

            $pins[] = [
                'id'          => md5($link),
                'title'       => $title,
                'description' => $clean_desc,
                'image'       => $image,
                'link'        => $link,
                'pub_date'    => $pubDate,
            ];
        }

        return $pins;
    }

    /**
     * Scrape ld+json from the public HTML page. Last-resort fallback —
     * Pinterest aggressively bot-blocks, and the markup churns. We accept
     * a thin, best-effort result here and let RSS carry the happy path.
     */
    private static function fetchViaLdJson($html_url)
    {
        $body = self::httpGet($html_url, true);
        if (empty($body)) {
            return [];
        }

        if (!preg_match_all(
            '~<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>~is',
            $body,
            $blocks
        )) {
            return [];
        }

        $pins = [];
        foreach ($blocks[1] as $json) {
            $data = json_decode(trim($json), true);
            if (!is_array($data)) {
                continue;
            }

            $items = [];
            if (isset($data['itemListElement']) && is_array($data['itemListElement'])) {
                $items = $data['itemListElement'];
            } elseif (isset($data['mainEntity']['itemListElement']) && is_array($data['mainEntity']['itemListElement'])) {
                $items = $data['mainEntity']['itemListElement'];
            }

            foreach ($items as $entry) {
                $node = isset($entry['item']) ? $entry['item'] : $entry;
                if (!is_array($node)) {
                    continue;
                }

                $link  = isset($node['url']) ? $node['url'] : (isset($node['@id']) ? $node['@id'] : '');
                $title = isset($node['name']) ? $node['name'] : '';
                $desc  = isset($node['description']) ? $node['description'] : '';
                $image = '';

                if (isset($node['image'])) {
                    if (is_string($node['image'])) {
                        $image = $node['image'];
                    } elseif (is_array($node['image'])) {
                        $image = isset($node['image']['url']) ? $node['image']['url']
                              : (isset($node['image'][0]) ? $node['image'][0] : '');
                    }
                }

                if ($link === '' && $image === '') {
                    continue;
                }

                $pins[] = [
                    'id'          => md5($link ?: $image),
                    'title'       => (string) $title,
                    'description' => (string) $desc,
                    'image'       => (string) $image,
                    'link'        => (string) $link,
                    'pub_date'    => '',
                ];
            }
        }

        return $pins;
    }

    /**
     * Single chokepoint for HTTP calls so we can swap headers, UA, and
     * timeouts in one place. ld+json calls need a desktop UA — Pinterest
     * returns a bot-block stub for the WP default.
     */
    private static function httpGet($url, $browser_ua = false)
    {
        $args = [
            'timeout'    => 12,
            'redirection' => 3,
            'headers'    => [
                'Accept' => 'application/rss+xml, text/xml, text/html, */*;q=0.8',
            ],
        ];

        if ($browser_ua) {
            $args['headers']['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) '
                . 'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
        }

        $response = wp_remote_get($url, $args);
        if (is_wp_error($response)) {
            return '';
        }

        $code = (int) wp_remote_retrieve_response_code($response);
        if ($code < 200 || $code >= 300) {
            return '';
        }

        return (string) wp_remote_retrieve_body($response);
    }

    private static function emptyResult($parsed = null)
    {
        return [
            'feed_type' => $parsed['feed_type'] ?? '',
            'username'  => $parsed['username'] ?? '',
            'board'     => $parsed['board'] ?? '',
            'pins'      => [],
            'source'    => 'empty',
        ];
    }

    /**
     * REST callback for /embedpress/v1/pinterest-feed.
     */
    public static function restCallback($request)
    {
        $url   = esc_url_raw($request->get_param('url'));
        $limit = (int) $request->get_param('limit');
        $ttl   = $request->get_param('ttl');

        if (empty($url) || !preg_match('~^https?://(?:[a-z]{2,3}\.)?pinterest\.[a-z.]+/~i', $url)) {
            return new \WP_Error(
                'embedpress_pinterest_invalid_url',
                'Invalid Pinterest URL',
                ['status' => 400]
            );
        }

        $effective_ttl = $ttl === null ? self::DEFAULT_TTL : max(0, (int) $ttl);

        $result = self::fetch($url, $limit > 0 ? $limit : 12, $effective_ttl);
        return new \WP_REST_Response($result, 200);
    }

    /**
     * Register the REST route. Called from Core::registerOEmbedRestRoutes.
     */
    public static function registerRoute()
    {
        register_rest_route(
            'embedpress/v1',
            '/pinterest-feed',
            [
                'methods'             => \WP_REST_Server::READABLE,
                'callback'            => [__CLASS__, 'restCallback'],
                'permission_callback' => '__return_true',
                'args'                => [
                    'url'   => ['required' => true, 'type' => 'string'],
                    'limit' => ['type' => 'integer'],
                    'ttl'   => ['type' => 'integer'],
                ],
            ]
        );
    }
}
