<?php
namespace EmbedPress\Ends\Front;

use \EmbedPress\Ends\Handler as EndHandlerAbstract;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * The public-facing functionality of the plugin.
 * Defines the plugin name, version, and enqueue the public-specific stylesheets and scripts.
 *
 * @package     EmbedPress
 * @subpackage  EmbedPress/Ends/Front
 * @author      PressShack <help@pressshack.com>
 * @copyright   Copyright (C) 2016 Open Source Training, LLC. All rights reserved.
 * @license     GPLv2 or later
 * @since       1.0
 */
class Handler extends EndHandlerAbstract
{
    /**
     * Method that register all scripts for the admin area.
     *
     * @since 1.0
     */
    public function enqueueScripts()
    {}

    /**
     * Method that register all stylesheets for the public area.
     *
     * @since 1.0
     */
    public function enqueueStyles()
    {
        wp_enqueue_style(EMBEDPRESS_NAME, EMBEDPRESS_URL_ASSETS .'css/embedpress.css');

    }
}