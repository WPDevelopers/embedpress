<?php

namespace EmbedPress;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Entity responsible for replace the WordPress default embed-related shortcodes with the EmbedPress one.
 *
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2020 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       1.0.0
 */
class DisablerLegacy
{
    /**
     * Method that replaces the embed shortcodes.
     *
     * @since   1.0.0
     *
     * @return  void
     */
    public static function run()
    {
        self::disableNativeEmbedHooks();

        Shortcode::register();
    }

    /**
     * Disable all actions/filters related to the embed. This is required to make sure our "shortcode" overrides the
     * WordPress one.
     *
     * @since   1.0.0
     * @access  protected
     * @static
     *
     * @return  void
     */
    protected static function disableNativeEmbedHooks()
    {
        global $wp, $wp_embed;

        // Remove the embed query var.
        $wp->public_query_vars = array_diff($wp->public_query_vars, ["embed"]);

        // Remove the REST API endpoint.
        remove_action('rest_api_init', 'wp_oembed_register_route');

        // Turn off oEmbed auto discovery.
        add_filter('embed_oembed_discover', '__return_false');

        // Don't filter oEmbed results.
        remove_filter('oembed_dataparse', 'wp_filter_oembed_result', 10);

        // Remove oEmbed discovery links.
        remove_action('wp_head', 'wp_oembed_add_discovery_links');

        // Remove oEmbed-specific JavaScript from the front-end and back-end.
        remove_action('wp_head', 'wp_oembed_add_host_js');

        // Disable all TinyMCE plugins embed-related.
        add_filter('tiny_mce_plugins', ['\\EmbedPress\\DisablerLegacy', 'disableDefaultEmbedTinyMCERelatedPlugins']);

        remove_action('rest_api_init', 'wp_oembed_register_route');

        // Remove embed-related scripts from the queue
        remove_action('embed_head', 'enqueue_embed_scripts');
        remove_action('embed_head', 'wp_print_head_scripts');

        add_filter('load_default_embeds', false);

        wp_embed_unregister_handler("video");
        wp_embed_unregister_handler("youtube_embed_url");
        wp_embed_unregister_handler("googlevideo");

        // Remove all embeds rewrite rules.
        add_filter('rewrite_rules_array', ['\\EmbedPress\\DisablerLegacy', 'disableDefaultEmbedRewriteRules']);

        // Disable the method that determines if default embed handlers should be loaded.
        add_filter('wp_maybe_load_embeds', '__return_false');

        // Disable the method that transform any URL from content to {@link WP_Embed::shortcode()}.
        remove_filter('the_content', [$wp_embed, 'run_shortcode'], 8);
        remove_filter('the_content', [$wp_embed, 'autoembed'], 8);

        // Remove {@link WP_Embed::shortcode()} from execution.
        remove_shortcode(EMBEDPRESS_SHORTCODE);

        // Attempts to embed all URLs in a post.
        add_filter('the_content', ['\\EmbedPress\\Ends\\Front\\Handler', 'autoEmbedUrls']);

        wp_deregister_script('wp-embed');

        add_filter('http_request_host_is_external', ['\\EmbedPress\\CoreLegacy', 'allowApiHost'], 10, 3);

        add_action('tiny_mce_before_init', ['\\EmbedPress\\Ends\\Front\\Handler', 'renderPreviewBoxInEditors']);
    }

    /**
     * Remove all rewrite rules related to embeds.
     *
     * @since   1.0.0
     * @static
     *
     * @param   array $rules WordPress rewrite rules.
     *
     * @return  array
     */
    public static function disableDefaultEmbedRewriteRules($rules)
    {
        if (count($rules) > 0) {
            foreach ($rules as $rule => $rewrite) {
                if (strpos($rewrite, 'embed=true') !== false) {
                    unset($rules[$rule]);
                }
            }
        }

        return $rules;
    }

    /**
     * Disable all TinyMCE plugins related to the embed.
     *
     * @since   1.0.0
     * @static
     *
     * @param   array $plugins An array containing enabled plugins.
     *
     * @return  array
     */
    public static function disableDefaultEmbedTinyMCERelatedPlugins($plugins)
    {
        $blackListedPlugins = ["wpembed", "wpview"];

        return array_diff($plugins, $blackListedPlugins);
    }
}
