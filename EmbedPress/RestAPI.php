<?php

namespace EmbedPress;

use EmbedPress\Includes\Classes\Helper;
use Embera\Embera;
use WP_Error as WP_ErrorAlias;
use WP_REST_Request;
use WP_REST_Response;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Entity responsible for maintaining and registering all hooks that power the plugin.
 *
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2023 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       1.0.0
 */
class RestAPI
{
    /**
     * @param  WP_REST_Request  $request
     *
     * @return WP_REST_Response | WP_ErrorAlias
     */
    public static function oembed($request)
    {
        // Prevent infinite recursion: this endpoint IS the oembed provider,
        // so if it triggers another oembed fetch that resolves back here, stop immediately.
        static $is_processing = false;
        if ($is_processing) {
            return new WP_ErrorAlias(
                'embedpress_recursion',
                'Recursive oEmbed request detected',
                ['status' => 508]
            );
        }
        $is_processing = true;

        $url = esc_url_raw($request->get_param('url'));
		$playlist_id = $request->get_param( 'list');
	    if ( !empty( $playlist_id) ) {
		    $url .= "&list=$playlist_id";
		}

		$atts = $request->get_params();


        if (empty($url)) {
            $is_processing = false;
            return new WP_ErrorAlias('embedpress_invalid_url', 'Invalid Embed URL', ['status' => 404]);
        }

        // Validate URL has a proper scheme to reject malformed URLs early
        if (!preg_match('#^https?://#i', $url)) {
            $is_processing = false;
            return new WP_ErrorAlias('embedpress_invalid_url', 'Invalid URL scheme', ['status' => 400]);
        }

        $atts = Helper::removeQuote($atts);

        // Map Meetup-specific Gutenberg attributes to shortcode attributes
        if (!empty($url) && strpos($url, 'meetup.com') !== false) {
            if (isset($atts['meetupOrderBy'])) {
                $atts['orderby'] = $atts['meetupOrderBy'];
            }
            if (isset($atts['meetupOrder'])) {
                $atts['order'] = $atts['meetupOrder'];
            }
            if (isset($atts['meetupPerPage'])) {
                $atts['per_page'] = $atts['meetupPerPage'];
            }
            if (isset($atts['meetupEnablePagination'])) {
                $atts['enable_pagination'] = $atts['meetupEnablePagination'];
            }
            if (isset($atts['meetupTimezone'])) {
                $atts['timezone'] = $atts['meetupTimezone'];
            }
            if (isset($atts['meetupDateFormat'])) {
                $atts['date_format'] = $atts['meetupDateFormat'];
            }
            if (isset($atts['meetupTimeFormat'])) {
                $atts['time_format'] = $atts['meetupTimeFormat'];
            }
        }

        $urlInfo = Shortcode::parseContent( $url, true, $atts);
        $is_processing = false;
        if (empty($urlInfo)) {
            return new WP_ErrorAlias('embedpress_invalid_url', 'Invalid Embed URL', ['status' => 404]);
        }
        return new WP_REST_Response($urlInfo, 200);
    }

    /**
     * Lazy-load next page of YouTube playlist items for the queue layout.
     * Returns rendered <li class="ep-yt-queue__item"> markup so the JS can
     * just .insertAdjacentHTML — no client-side templating needed.
     *
     * GET /wp-json/embedpress/v1/youtube-playlist-items
     *   playlist_id  PL… / RD… / UU…
     *   page_token   YouTube pageToken from the prior response
     *   page_size    items per request (1–50, default 6)
     *   offset       starting index for the data-index attribute
     */
    public static function youtube_playlist_items($request)
    {
        $playlist_id = (string) $request->get_param('playlist_id');
        $page_token  = (string) $request->get_param('page_token');
        $page_size   = (int) $request->get_param('page_size');
        $offset      = (int) $request->get_param('offset');

        if (empty($playlist_id) || empty($page_token)) {
            return new WP_REST_Response(['html' => '', 'next_page_token' => ''], 200);
        }
        $page_size = $page_size > 0 && $page_size <= 50 ? $page_size : 6;

        $settings = (array) get_option(EMBEDPRESS_PLG_NAME . ':youtube', []);
        $api_key  = !empty($settings['api_key']) ? $settings['api_key'] : '';
        if (empty($api_key)) {
            return new WP_REST_Response(['html' => '', 'next_page_token' => ''], 200);
        }

        $endpoint = 'https://www.googleapis.com/youtube/v3/playlistItems?' . http_build_query([
            'part'       => 'snippet,status,contentDetails',
            'playlistId' => $playlist_id,
            'maxResults' => $page_size,
            'pageToken'  => $page_token,
            'key'        => $api_key,
        ]);

        $transient_key = 'ep_yt_queue_page_' . md5($endpoint);
        $json          = get_transient($transient_key);
        if (empty($json)) {
            $resp = wp_remote_get($endpoint, ['timeout' => 30]);
            if (is_wp_error($resp)) {
                return new WP_REST_Response(['html' => '', 'next_page_token' => ''], 200);
            }
            $json = json_decode(wp_remote_retrieve_body($resp));
            if (empty($json) || !empty($json->error)) {
                set_transient($transient_key, $json, 10);
                return new WP_REST_Response(['html' => '', 'next_page_token' => ''], 200);
            }
            set_transient($transient_key, $json, MINUTE_IN_SECONDS * 20);
        }

        $layout = (string) $request->get_param('layout');

        // Pro layouts (library/spotlight/cinema/magazine) ship their own
        // per-item markup, so let the Pro plugin filter the HTML when its
        // layout is asked for. If no Pro filter is registered, we fall back
        // to queue items below — matches the front-render fallback.
        $pro_layouts = ['library', 'spotlight', 'cinema', 'magazine'];
        if (in_array($layout, $pro_layouts, true)) {
            $html = apply_filters(
                'embedpress/youtube_playlist_pro_items_html',
                '',
                $layout,
                $json,
                ['hideprivate' => false, 'thumbnail' => 'medium'],
                $offset
            );
            if ($html === '') {
                $html = \EmbedPress\Providers\TemplateLayouts\YoutubeLayout::render_queue_items(
                    $json,
                    ['hideprivate' => false, 'thumbnail' => 'medium'],
                    $offset,
                    ''
                );
            }
        } elseif ($layout === 'theatre') {
            $html = \EmbedPress\Providers\TemplateLayouts\YoutubeLayout::render_theatre_cards(
                $json,
                ['hideprivate' => false, 'thumbnail' => 'medium'],
                $offset,
                ''
            );
        } else {
            $html = \EmbedPress\Providers\TemplateLayouts\YoutubeLayout::render_queue_items(
                $json,
                ['hideprivate' => false, 'thumbnail' => 'medium'],
                $offset,
                ''
            );
        }

        return new WP_REST_Response([
            'html'            => $html,
            'next_page_token' => isset($json->nextPageToken) ? $json->nextPageToken : '',
        ], 200);
    }
}
