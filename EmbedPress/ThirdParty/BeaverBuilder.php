<?php

namespace EmbedPress\ThirdParty;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Entity responsible for adding support for the Beaver Builder.
 *
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2020 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       1.0.0
 */
class BeaverBuilder
{
    /**
     * Method that replaces the embed shortcodes, before Beaver calls WP's native embed shortcode.
     * It forces that when it runs $wp_embed->run_shortcode.
     *
     * @param string $content
     *
     * @return  string
     */
    public static function before_render_shortcodes($content)
    {
        global $shortcode_tags;

        // Back up current registered shortcodes and clear them all out
        $orig_shortcode_tags = $shortcode_tags;
        remove_all_shortcodes();

        add_shortcode(EMBEDPRESS_SHORTCODE, ['\\EmbedPress\\Shortcode', 'do_shortcode']);

        // Do the shortcode (only the [embed] one is registered)
        $content = do_shortcode($content, true);

        // Put the original shortcodes back
        $shortcode_tags = $orig_shortcode_tags;

        return $content;
    }
}
