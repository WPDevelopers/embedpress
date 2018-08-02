<?php
namespace EmbedPress\ThirdParty;

use \EmbedPress\Shortcode;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Entity responsible for adding support for the Beaver Builder.
 *
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2018 EmbedPress. All rights reserved.
 * @license     GPLv2 or later
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
    	$content = Shortcode::do_shortcode(array(), $content);

        return $content;
    }
}
