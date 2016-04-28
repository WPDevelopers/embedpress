<?php
namespace EmbedPress\Layers;

use EmbedPress\Layers\Handler;
use EmbedPress\Shortcode;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * The admin-facing functionality of the plugin.
 * Defines the plugin name, version, and enqueue the admin-specific stylesheets and scripts.
 *
 * @package     EmbedPress
 * @subpackage  EmbedPress/Admin
 * @author      OSTraining <support@ostraining.com>
 * @copyright   TODO
 * @license     TODO
 * @since       0.1
 */
class Admin extends Handler
{
    /**
     * Method that register all scripts for the admin area.
     *
     * @since 0.1
     */
    public function enqueueScripts() {
        wp_enqueue_script($this->pluginName, plugin_dir_url(__FILE__) .'admin-assets/js/preview.js', array('jquery', 'jquery-ui-dialog'), $this->pluginVersion, true);
        wp_localize_script($this->pluginName, '$data', array(
            'previewSettings'     => array(
                'juriRoot'   => get_site_url() .'/',
                'versionUID' => $this->pluginVersion,
                'debug'      => true
            ),
            'EMBEDPRESS_SHORTCODE' => EMBEDPRESS_SHORTCODE
        ));
    }

    /**
     * Method that register all stylesheets for the admin area.
     *
     * @since 0.1
     */
    public function enqueueStyles() {
        global $wp_scripts;

        wp_enqueue_style('jquery-ui-css', "http://ajax.googleapis.com/ajax/libs/jqueryui/". $wp_scripts->registered['jquery-ui-core']->ver ."/themes/ui-lightness/jquery-ui.min.css");
    }

    /**
     * Method that receive a string via AJAX and return the decoded-shortcoded-version of that string.
     *
     * @since 0.1
     */
    public function doShortcodeReceivedViaAjax()
    {
        $response = array(
            'data' => array(
                'content' => Shortcode::parseContent(@$_POST['subject'], true)
            )
        );

        header('Content-Type:application/json;charset=UTF-8');
        echo json_encode($response);

        exit();
    }
}