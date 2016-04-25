<?php
defined('ABSPATH') or die("No direct script access allowed.");

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
class EmbedPressAdmin
{
    /**
     * The name of the plugin.
     *
     * @since   0.1
     * @access  private
     *
     * @var     string    $pluginName    The name of the plugin.
     */
    private $pluginName;

    /**
     * The version of the plugin.
     *
     * @since   0.1
     * @access  private
     *
     * @var     string    $pluginVersion     The version of the plugin.
     */
    private $pluginVersion;

    /**
     * Initialize the class and set its properties.
     *
     * @since   0.1
     *
     * @param   string    $pluginName - The name of the plugin.
     * @param   string    $pluginVersion - The version of the plugin.
     */
    public function __construct($pluginName, $pluginVersion)
    {
        $this->pluginName = $pluginName;
        $this->pluginVersion = $pluginVersion;
    }

    /**
     * Method that register all scripts for the admin area.
     *
     * @since 0.1
     */
    public function enqueueScripts()
    {
        $assetsPath = plugin_dir_url(__FILE__) .'assets';
        wp_enqueue_script("bootbox-bootstrap", $assetsPath .'/js/bootbox-bootstrap.min.js', array('jquery'), $this->pluginVersion, true);
        wp_enqueue_script("bootbox", $assetsPath .'/js/bootbox.min.js', array('jquery', 'bootbox-bootstrap'), $this->pluginVersion, true);
        wp_enqueue_script($this->pluginName, $assetsPath .'/js/preview.js', array('jquery', 'bootbox'), $this->pluginVersion, true);
        wp_localize_script($this->pluginName, '$data', array(
            'previewSettings'      => array(
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
    public function enqueueStyles()
    {
        global $wp_scripts;

        $assetsPath = plugin_dir_url(__FILE__) .'assets';

        wp_enqueue_style('bootbox-bootstrap', $assetsPath .'/css/bootbox-bootstrap.min.css');
        wp_enqueue_style($this->pluginName, $assetsPath .'/css/preview.css');
    }

    /**
     * Method that receive a string via AJAX and return the decoded-shortcoded-version of that string.
     *
     * @since 0.1
     */
    public function decodeShortcodedContentToAjax()
    {
        $response = array(
            'data' => array(
                'content' => EmbedPress::parseContent(@$_POST['subject'], true)
            )
        );

        header('Content-Type:application/json;charset=UTF-8');
        echo json_encode($response);

        exit();
    }
}