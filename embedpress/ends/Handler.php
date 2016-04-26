<?php
namespace EmbedPress\Ends;

abstract class Handler
{
    /**
     * The name of the plugin.
     *
     * @since   0.1
     * @access  private
     *
     * @var     string    $pluginName    The name of the plugin.
     */
    protected $pluginName;

    /**
     * The version of the plugin.
     *
     * @since   0.1
     * @access  private
     *
     * @var     string    $pluginVersion     The version of the plugin.
     */
    protected $pluginVersion;

    /**
     * Initialize the class and set its properties.
     *
     * @since   0.1
     *
     * @param   string    $pluginName - The name of the plugin.
     * @param   string    $pluginVersion - The version of the plugin.
     */
    public function __construct($pluginName, $pluginVersion) {
        $this->pluginName = $pluginName;
        $this->pluginVersion = $pluginVersion;
    }

    /**
     * Method that register all scripts for the admin area.
     *
     * @since 0.1
     */
    abstract public function enqueueScripts();

    /**
     * Method that register all stylesheets for the admin area.
     *
     * @since 0.1
     */
    abstract public function enqueueStyles();
}