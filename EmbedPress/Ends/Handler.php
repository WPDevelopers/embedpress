<?php

namespace EmbedPress\Ends;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Modeling class to handle the plugin in different environments. I.e: public area/admin area.
 *
 * @package     EmbedPress
 * @subpackage  EmbedPress/Ends
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2020 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       1.0.0
 */
abstract class Handler
{
    /**
     * The name of the plugin.
     *
     * @since   1.0.0
     * @access  private
     *
     * @var     string $pluginName The name of the plugin.
     */
    protected $pluginName;

    /**
     * The version of the plugin.
     *
     * @since   1.0.0
     * @access  private
     *
     * @var     string $pluginVersion The version of the plugin.
     */
    protected $pluginVersion;

    /**
     * Initialize the class and set its properties.
     *
     * @since   1.0.0
     *
     * @param   string $pluginName    - The name of the plugin.
     * @param   string $pluginVersion - The version of the plugin.
     *
     * @return  void
     */
    public function __construct($pluginName, $pluginVersion)
    {
        $this->pluginName    = $pluginName;
        $this->pluginVersion = $pluginVersion;
    }

    /**
     * Method that register all scripts for the admin area.
     *
     * @since       1.0.0
     *
     * @return      void
     */
    public function enqueueScripts()
    {
    }

    /**
     * Method that register all stylesheets for the admin area.
     *
     * @since       1.0.0
     * @static
     *
     * @return      void
     */
    public static function enqueueStyles()
    {
    }
}
