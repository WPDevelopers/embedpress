<?php
use Embera\Embera;
use Embera\Formatter;

defined('ABSPATH') or die("No direct script access allowed.");

/**
 * The core functionality of the plugin.
 *
 * Defines the plugin name, version, load dependencies, hooks and enqueue both admin and public assets.
 *
 * @package     EmbedPress
 * @author      Denison Martins <contact@denison.me>
 * @since       0.1
 */
class EmbedPress
{
    /**
     * The loader that's responsible for maintaining and registering all hooks that power the plugin.
     *
     * @since   0.1
     * @access  protected
     *
     * @var     EmbedPressLoader    $loader    The plugin loader.
     */
    protected $loader;

    /**
     * The name of this plugin.
     *
     * @since   0.1
     * @access  private
     *
     * @var     string    $pluginName   The name of this plugin.
     */
    protected $pluginName;

    /**
     * The version of this plugin.
     *
     * @since   0.1
     * @access  private
     *
     * @var     string    $pluginVersion   The current version of this plugin.
     */
    protected $pluginVersion;

    /**
     * The Embera library singleton used to convert urls into specific and complex HTML.
     *
     * @since   0.1
     * @access  protected
     *
     * @var     Embera\Formatter    $emberaInstance    The Embera instance
     */
    protected static $emberaInstance;

    /**
     * Initialize the class, set its properties and define the core functionality of the plugin.
     *
     * @since   0.1
     */
    public function __construct()
    {
        $this->pluginName = EMBEDPRESS_NAME;
        $this->pluginVersion = EMBEDPRESS_VERSION;

        $this->loadDependencies();

        add_action('init', array('EmbedPressShortcode', 'overrideDefaultEmbedShortcode'), 9999);

        $this->defineAdminHooks();
        $this->definePublicHooks();

        return $this;
    }

    /**
     * Load the required dependencies for this plugin and create an instance of the loader that will be used to register hooks with Wordpress.
     *
     * @since   0.1
     * @access  private
     */
    private function loadDependencies()
    {
        require_once EMBEDPRESS_LIBRARIES_PATH .'/autoload.php';
        require_once EMBEDPRESS_INCLUDES_PATH .'/EmbedPressLoader.php';
        require_once EMBEDPRESS_INCLUDES_PATH .'/EmbedPressShortcode.php';
        require_once EMBEDPRESS_ADMIN_PATH .'/EmbedPressAdmin.php';
        require_once EMBEDPRESS_PUBLIC_PATH .'/EmbedPressPublic.php';

        $this->loader = new EmbedPressLoader();
    }

    /**
     * Register all of the hooks related to the admin area functionality of the plugin.
     *
     * @since   0.1
     * @access  private
     */
    private function defineAdminHooks()
    {
        $plgAdminInstance = new EmbedPressAdmin($this->getPluginName(), $this->getVersion());
        $hookName = "admin_enqueue_scripts";

        $this->loader->add_action($hookName, $plgAdminInstance, 'enqueueScripts');
        $this->loader->add_action($hookName, $plgAdminInstance, 'enqueueStyles');

        $onAjaxCallbackName = "decodeShortcodedContentToAjax";
        $this->loader->add_action('wp_ajax_embedpress_do_ajax_request', $plgAdminInstance, $onAjaxCallbackName);
        $this->loader->add_action('wp_ajax_nopriv_embedpress_do_ajax_request', $plgAdminInstance, $onAjaxCallbackName);
    }

    /**
     * Register all of the hooks related to the public-facing functionality of the plugin
     *
     * @since   0.1
     * @access  private
     */
    private function definePublicHooks()
    {
        $plgPublicInstance = new EmbedPressPublic($this->getPluginName(), $this->getVersion());
    }

    /**
     * Run the loader to execute all of the hooks with WordPress.
     *
     * @since    1.0.0
     */
    public function run()
    {
        $this->loader->run();
    }

    /**
     * Returns the name of the plugin.
     *
     * @since   0.1
     *
     * @return  string
     */
    public function getPluginName()
    {
        return $this->pluginName;
    }

    /**
     * The reference to the class that manage the hooks with the plugin.
     *
     * @since   0.1
     *
     * @return  EmbedPressLoader
     */
    public function getLoader()
    {
        return $this->loader;
    }

    /**
     * Returns the version of the plugin.
     *
     * @since   0.1
     *
     * @return  string
     */
    public function getVersion()
    {
        return $this->pluginVersion;
    }

    /**
     * Replace a given content with its embeded HTML code.
     *
     * @since   0.1
     * @static
     *
     * @param   string      The raw content that will be replaced.
     * @param   boolean     Optional. If true, new lines at the end of the embeded code are stripped.
     * @param   array       Optional. Wordpress (frontend) throws here all shortcode properties passed to $content.
     * @return  string
     */
    public static function parseContent($content, $stripNewLine = false, $attributes = array())
    {
        if (!isset(static::$emberaInstance)) {
            static::$emberaInstance = new Formatter(new Embera, true);
        }

        if (!empty($content)) {
            $customClasses = "";
            $attributesString = "";

            if (is_array($attributes) && !empty($attributes)) {
                if (isset($attributes['class'])) {
                    if (!empty($attributes['class'])) {
                        $customClasses = ' '. $attributes['class'];
                    }

                    unset($attributes['class']);
                }

                $attrNamePrefix = "data-";
                $attributesString = [];
                foreach ($attributes as $attrName => $attrValue) {
                    $attrName = strpos($attrName, $attrNamePrefix) === 0 ? $attrName : ($attrNamePrefix . $attrName);
                    $attributesString[] = sprintf('%s="%s"', $attrName, $attrValue);
                }
                $attributesString = ' '. implode(' ', $attributesString);
            }

            static::$emberaInstance->setTemplate('<div class="osembed-wrapper ose-{provider_alias} {wrapper_class}'. $customClasses .'"'. $attributesString .'>{html}</div>');

            // Strip any remaining shortcode-code on $content
            $content = preg_replace('/(\['. EMBEDPRESS_SHORTCODE .'(?:\]|.+?\])|\[\/'. EMBEDPRESS_SHORTCODE .'\])/i', "", $content);

            $content = static::$emberaInstance->transform($content);

            if ($stripNewLine) {
                $content = preg_replace('/\n/', '', $content);
            }
        }

        return $content;
    }

    /**
     * Remove embeds rewrite rules on plugin activation.
     *
     * @since   0.1
     * @static
     */
    public static function onPluginActivationCallback()
    {
        add_filter('rewrite_rules_array', array('EmbedPressShortcode', 'disableDefaultEmbedsRewriteRules'));
        flush_rewrite_rules();
    }

    /**
     * Flush rewrite rules on plugin deactivation.
     *
     * @since   0.1
     * @static
     */
    public static function onPluginDeactivationCallback()
    {
        remove_filter('rewrite_rules_array', array('EmbedPressShortcode', 'disableDefaultEmbedsRewriteRules'));
        flush_rewrite_rules();
    }

    /**
     * Disable all TinyMCE plugins related to the embed.
     *
     * @since   0.1
     * @static
     *
     * @param   array   $plugins    An array containing enabled plugins.
     */
    public static function disableTinyMCERelatedPlugins($plugins)
    {
        return array_diff($plugins, array("wpembed", "wpview"));
    }
}