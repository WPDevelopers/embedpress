<?php
namespace EmbedPress\Layers;

use \EmbedPress\Layers\Handler;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * The public-facing functionality of the plugin.
 * Defines the plugin name, version, and enqueue the public-specific stylesheets and scripts.
 *
 * @package     EmbedPress
 * @subpackage  EmbedPress/Public
 * @author      OSTraining <support@ostraining.com>
 * @copyright   TODO
 * @license     TODO
 * @since       0.1
 */
class HandlerPublic extends Handler
{
    /**
     * Method that register all scripts for the admin area.
     *
     * @since 0.1
     */
    public function enqueueScripts() {}

    /**
     * Method that register all stylesheets for the public area.
     *
     * @since 0.1
     */
    public function enqueueStyles()
    {
        wp_enqueue_style(EMBEDPRESS_NAME, EMBEDPRESS_URL_ADMIN_ASSETS .'css/osembed.css');

    }
}