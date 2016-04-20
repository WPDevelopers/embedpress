<?php
class EmbedPressShortcode
{
    /**
     * Disable all actions/filters related to the embed. This is required to make sure our "shortcode" overrides the WordPress one.
     *
     * @since   0.1
     * @static
     */
    public static function removeDefaultEmbedDependencies()
    {
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
        add_filter('tiny_mce_plugins', array('EmbedPress', 'disableTinyMCERelatedPlugins' ));

        // Remove all embeds rewrite rules.
        add_filter('rewrite_rules_array', array('EmbedPress', 'disableDefaultEmbedsRewriteRules' ));

        // Remove the "embed" shortcode
        remove_shortcode(EMBEDPRESS_SHORTCODE);
    }

    /**
     * Register the plugin shortcode into WordPress.
     *
     * @since   0.1
     * @static
     */
    public static function register()
    {
        add_shortcode(EMBEDPRESS_SHORTCODE, array('EmbedPressShortcode', 'decode'));
    }

    /**
     * Remove all rewrite rules related to embeds.
     *
     * @since   0.1
     *
     * @param   array   $rules  WordPress rewrite rules.
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
     * Method that converts the plugin shortcoded-string into its complex content.
     *
     * @since   0.1
     * @static
     *
     * @param   array     $attributes   @TODO
     * @param   string    $subject      The given string
     * @return  string
     */
    public static function decode($attributes, $subject = null)
    {
        $decodedSubject = EmbedPress::parseContent($subject, true);

        return $decodedSubject;
    }
}