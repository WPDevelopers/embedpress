<?php
namespace EmbedPress;

use EmbedPress\Shortcode;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

class Disabler
{
    public function run()
    {
        self::overrideDefaultEmbedShortcode();

        Shortcode::register();
    }

    /**
     * Disable all actions/filters related to the embed. This is required to make sure our "shortcode" overrides the WordPress one.
     *
     * @since   0.1
     * @static
     */
    protected static function overrideDefaultEmbedShortcode() {
        global $wp;

        // Remove the embed query var.
        $wp->public_query_vars = array_diff($wp->public_query_vars, array("embed"));

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
        add_filter('tiny_mce_plugins', array('EmbedPress\Disabler', 'disableDefaultEmbedTinyMCERelatedPlugins'));

        remove_action('rest_api_init', 'wp_oembed_register_route');

        // Remove embed-related scripts from the queue
        remove_action('embed_head', 'enqueue_embed_scripts');
        remove_action('embed_head', 'wp_print_head_scripts');

        wp_embed_unregister_handler("video");
        wp_embed_unregister_handler("youtube_embed_url");
        wp_embed_unregister_handler("googlevideo");

        // Remove all embeds rewrite rules.
        add_filter('rewrite_rules_array', array('EmbedPress\Disabler', 'disableDefaultEmbedRewriteRules'));

        // Disable the method that determines if default embed handlers should be loaded.
        add_filter('wp_maybe_load_embeds', '__return_false');

        // Disable the method that transform any URL from content to {@link WP_Embed::shortcode()}.
        remove_filter('the_content', array('WP_Embed', 'autoembed'), 8);

        // Remove {@link WP_Embed::shortcode()} from execution.
        remove_shortcode(EMBEDPRESS_SHORTCODE);
    }

    /**
     * Remove all rewrite rules related to embeds.
     *
     * @since   0.1
     *
     * @param   array   $rules  WordPress rewrite rules.
     * @return  array
     */
    public static function disableDefaultEmbedRewriteRules() {
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
     * @since   0.1
     * @static
     *
     * @param   array   $plugins    An array containing enabled plugins.
     */
    public static function disableDefaultEmbedTinyMCERelatedPlugins($plugins) {
        $blackListedPlugins = ["wpembed", "wpview"];

        return array_diff($plugins, $blackListedPlugins);
    }
}