<?php
defined('ABSPATH') or die("No direct script access allowed.");

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
class EmbedPressPublic
{
    /**
     * The name of this plugin.
     *
     * @since   0.1
     * @access  private
     *
     * @var     string    $pluginName   The name of this plugin.
     */
    private $pluginName;

    /**
     * The version of this plugin.
     *
     * @since   0.1
     * @access  private
     *
     * @var     string    $pluginVersion   The current version of this plugin.
     */
    private $pluginVersion;

    /**
     * Initialize the class and set its properties.
     *
     * @since   0.1
     *
     * @param   string  $pluginName     The name of the plugin.
     * @param   string  $pluginVersion  The version of this plugin.
     */
    public function __construct($pluginName, $pluginVersion)
    {
        $this->pluginName = $pluginName;
        $this->pluginVersion = $pluginVersion;
    }

    /**
     * Method that register all stylesheets for the public area.
     *
     * @since 0.1
     */
    public function enqueueStyles()
    {
        wp_enqueue_style(EMBEDPRESS_NAME, plugin_dir_url(__FILE__) .'assets/css/embedpress.css');
    }
}