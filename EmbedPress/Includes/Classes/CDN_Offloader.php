<?php

namespace EmbedPress\Includes\Classes;

defined('ABSPATH') or die("No direct script access allowed.");

/**
 * Built-In CDN Offloading
 *
 * v1: BunnyCDN Storage support. New video uploads are queued to a
 * single-event cron, mirrored to the configured storage zone, and the
 * resulting CDN URL is stored as `_embedpress_cdn_url` postmeta.
 *
 * The renderer rewrites `<video>` / `<source>` URLs to the CDN URL when
 * present. If the CDN URL is unreachable the browser will fail the
 * resource load — sites that need a cross-CDN fallback can hook
 * `embedpress_cdn_url` to add their own logic.
 *
 * Settings live in the `embedpress_cdn_settings` option:
 *   [
 *     'enabled'       => true|false,
 *     'provider'      => 'bunnycdn',
 *     'storage_zone'  => 'my-zone',
 *     'access_key'    => '...',
 *     'pull_zone_url' => 'https://my-zone.b-cdn.net',
 *   ]
 */
class CDN_Offloader
{
    const META_KEY     = '_embedpress_cdn_url';
    const CRON_HOOK    = 'embedpress_cdn_offload';
    const SETTINGS_KEY = 'embedpress_cdn_settings';

    public function __construct()
    {
        add_action('add_attachment', [$this, 'maybe_queue_offload']);
        add_action(self::CRON_HOOK, [$this, 'offload_attachment']);
    }

    public static function get_settings()
    {
        $defaults = [
            'enabled'       => false,
            'provider'      => 'bunnycdn',
            'storage_zone'  => '',
            'access_key'    => '',
            'pull_zone_url' => '',
        ];
        $settings = get_option(self::SETTINGS_KEY, []);
        if (!is_array($settings)) $settings = [];
        return apply_filters('embedpress_cdn_settings', array_merge($defaults, $settings));
    }

    public function maybe_queue_offload($attachment_id)
    {
        $settings = self::get_settings();
        if (empty($settings['enabled']) || empty($settings['storage_zone']) || empty($settings['access_key'])) return;
        if (!self::is_video_attachment($attachment_id)) return;
        wp_schedule_single_event(time() + 5, self::CRON_HOOK, [$attachment_id]);
    }

    public function offload_attachment($attachment_id)
    {
        $settings = self::get_settings();
        if (empty($settings['enabled'])) return;
        if (get_post_meta($attachment_id, self::META_KEY, true)) return; // already done
        $file = get_attached_file($attachment_id);
        if (!$file || !file_exists($file)) return;

        $cdn_url = self::upload_to_bunnycdn($file, basename($file), $settings);
        if ($cdn_url) {
            update_post_meta($attachment_id, self::META_KEY, esc_url_raw($cdn_url));
        }
    }

    /**
     * PUT the file to BunnyCDN Storage. Returns the public pull-zone URL on success.
     */
    private static function upload_to_bunnycdn($local_path, $remote_name, $settings)
    {
        $contents = @file_get_contents($local_path);
        if ($contents === false) return '';
        $endpoint = sprintf('https://storage.bunnycdn.com/%s/%s', rawurlencode($settings['storage_zone']), rawurlencode($remote_name));
        $resp = wp_remote_request($endpoint, [
            'method'  => 'PUT',
            'timeout' => 60,
            'headers' => [
                'AccessKey'    => $settings['access_key'],
                'Content-Type' => 'application/octet-stream',
            ],
            'body'    => $contents,
        ]);
        if (is_wp_error($resp)) return '';
        if ((int) wp_remote_retrieve_response_code($resp) >= 300) return '';
        $base = rtrim($settings['pull_zone_url'], '/');
        if (!$base) return '';
        return $base . '/' . rawurlencode($remote_name);
    }

    public static function is_video_attachment($attachment_id)
    {
        $type = get_post_mime_type($attachment_id);
        return $type && strpos($type, 'video/') === 0;
    }

    /**
     * Resolve the CDN URL for a given origin URL by attachment lookup.
     */
    public static function cdn_url_for($origin_url)
    {
        if (!$origin_url) return '';
        $attachment_id = attachment_url_to_postid($origin_url);
        if (!$attachment_id) return '';
        $cdn = get_post_meta($attachment_id, self::META_KEY, true);
        return $cdn ? apply_filters('embedpress_cdn_url', $cdn, $origin_url, $attachment_id) : '';
    }
}
