<?php
namespace EmbedPress;

use \EmbedPress\AutoLoader;
use \EmbedPress\Loader;
use \EmbedPress\Ends\Back\Handler as EndHandlerAdmin;
use \EmbedPress\Ends\Front\Handler as EndHandlerPublic;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Entity that glues together all pieces that the plugin is made of.
 *
 * @package     EmbedPress
 * @author      PressShack <help@pressshack.com>
 * @copyright   Copyright (C) 2016 Open Source Training, LLC. All rights reserved.
 * @license     GPLv2 or later
 * @since       1.0.0
 */
class Plugin
{
    /**
     * The name of the plugin.
     *
     * @since   1.0.0
     * @access  protected
     *
     * @var     string  $pluginName   The name of the plugin.
     */
    protected $pluginName;

    /**
     * The version of the plugin.
     *
     * @since   1.0.0
     * @access  protected
     *
     * @var     string  $pluginVersion  The version of the plugin.
     */
    protected $pluginVersion;

    /**
     * An instance of the plugin loader.
     *
     * @since   1.0.0
     * @access  protected
     *
     * @var     \EmbedPress\Loader  $pluginVersion  The version of the plugin.
     */
    protected $loaderInstance;

    /**
     * An associative array storing all registered/active EmbedPress plugins and their namespaces.
     *
     * @since   1.4.0
     * @access  private
     * @static
     *
     * @var     array
     */
    private static $plugins = array();

    /**
     * Initialize the plugin and set its properties.
     *
     * @since   1.0.0
     *
     * @return  void
     */
    public function __construct()
    {
        $this->pluginName = EMBEDPRESS_PLG_NAME;
        $this->pluginVersion = EMBEDPRESS_PLG_VERSION;

        $this->loaderInstance = new Loader();
    }

    /**
     * Method that retrieves the plugin name.
     *
     * @since   1.0.0
     *
     * @return  string
     */
    public function getPluginName()
    {
        return $this->pluginName;
    }

    /**
     * Method that retrieves the plugin version.
     *
     * @since   1.0.0
     *
     * @return  string
     */
    public function getPluginVersion()
    {
        return $this->pluginVersion;
    }

    /**
     * Method that retrieves the loader instance.
     *
     * @since   1.0.0
     *
     * @return  \EmbedPress\Loader
     */
    public function getLoader()
    {
        return $this->loaderInstance;
    }

    /**
     * Method responsible to connect all required hooks in order to make the plugin work.
     *
     * @since   1.0.0
     *
     * @return  void
     */
    public function initialize()
    {
        global $wp_actions;

        if (is_admin()) {
            $plgSettings = self::getSettings();

            $settingsClassNamespace = '\EmbedPress\Ends\Back\Settings';
            add_action('admin_menu', array($settingsClassNamespace, 'registerMenuItem'));
            add_action('admin_init', array($settingsClassNamespace, 'registerActions'));
            unset($settingsClassNamespace);

            add_filter('plugin_action_links_embedpress/embedpress.php', array('\EmbedPress\Plugin', 'handleActionLinks'), 10, 2);

            // Load CSS
            wp_register_style( 'embedpress-admin', plugins_url( 'embedpress/assets/css/admin.css' ) );
            wp_enqueue_style( 'embedpress-admin' );

            if ($plgSettings->enablePluginInAdmin) {
                add_action('init', array('\EmbedPress\Disabler', 'run'), 1);

                $plgHandlerAdminInstance = new EndHandlerAdmin($this->getPluginName(), $this->getPluginVersion());

                $enqueueScriptsHookName = "admin_enqueue_scripts";
                $this->loaderInstance->add_action($enqueueScriptsHookName, $plgHandlerAdminInstance, 'enqueueScripts');
                $this->loaderInstance->add_action($enqueueScriptsHookName, $plgHandlerAdminInstance, 'enqueueStyles');

                $onAjaxCallbackName = "doShortcodeReceivedViaAjax";
                $this->loaderInstance->add_action('wp_ajax_embedpress_do_ajax_request', $plgHandlerAdminInstance, $onAjaxCallbackName);
                $this->loaderInstance->add_action('wp_ajax_nopriv_embedpress_do_ajax_request', $plgHandlerAdminInstance, $onAjaxCallbackName);

                $this->loaderInstance->add_action('wp_ajax_embedpress_get_embed_url_info', $plgHandlerAdminInstance, "getUrlInfoViaAjax");

                unset($onAjaxCallbackName, $enqueueScriptsHookName, $plgHandlerAdminInstance);
            }
        } else {
            add_action('init', array('\EmbedPress\Disabler', 'run'), 1);

            $plgHandlerPublicInstance = new EndHandlerPublic($this->getPluginName(), $this->getPluginVersion());

            $enqueueScriptsHookName = "wp_enqueue_scripts";
            $this->loaderInstance->add_action($enqueueScriptsHookName, $plgHandlerPublicInstance, 'enqueueScripts');
            $this->loaderInstance->add_action($enqueueScriptsHookName, $plgHandlerPublicInstance, 'enqueueStyles');

            unset($enqueueScriptsHookName, $plgHandlerPublicInstance);
        }

        $this->loaderInstance->run();
    }

    /**
     * Callback called right after the plugin has been activated.
     *
     * @since   1.0.0
     * @static
     *
     * @return  void
     */
    public static function onPluginActivationCallback()
    {
        add_filter('rewrite_rules_array', array('\EmbedPress\Disabler', 'disableDefaultEmbedRewriteRules'));
        flush_rewrite_rules();
    }

    /**
     * Callback called right after the plugin has been deactivated.
     *
     * @since   1.0.0
     * @static
     *
     * @return  void
     */
    public static function onPluginDeactivationCallback()
    {
        remove_filter('rewrite_rules_array', array('\EmbedPress\Disabler', 'disableDefaultEmbedRewriteRules'));
        flush_rewrite_rules();
    }

    /**
     * Method that retrieves all additional service providers defined in the ~<plugin_root_path>/providers.php file.
     *
     * @since   1.0.0
     * @static
     *
     * @return  array
     */
    public static function getAdditionalServiceProviders()
    {
        $additionalProvidersFilePath = EMBEDPRESS_PATH_BASE .'providers.php';
        if (file_exists($additionalProvidersFilePath)) {
            include $additionalProvidersFilePath;

            if (isset($additionalServiceProviders)) {
                return $additionalServiceProviders;
            }
        }

        return array();
    }

    /**
     * Method that checks if an embed of a given service provider can be responsive.
     *
     * @since   1.0.0
     * @static
     *
     * @param   string      $serviceProviderAlias The service's slug.
     * @return  boolean
     */
    public static function canServiceProviderBeResponsive($serviceProviderAlias)
    {
        return in_array($serviceProviderAlias, array("dailymotion", "kickstarter", "rutube", "ted", "vimeo", "youtube", "ustream", "google-docs", "animatron", "amcharts", "on-aol-com", "animoto", "videojug"));
    }

    /**
     * Method that retrieves the plugin settings defined by the user.
     *
     * @since   1.0.0
     * @static
     *
     * @return  object
     */
    public static function getSettings()
    {
        $settings = get_option("embedpress_options");

        if (!isset($settings['displayPreviewBox'])) {
            $settings['displayPreviewBox'] = true;
        }

        if (!isset($settings['enablePluginInAdmin'])) {
            $settings['enablePluginInAdmin'] = true;
        }

        return (object)$settings;
    }

    /**
     * Method that register an EmbedPress plugin.
     *
     * @since   1.4.0
     * @static
     *
     * @param   array       $pluginMeta Associative array containing plugin's name, slug and namespace
     * @return  void
     */
    public static function registerPlugin($pluginMeta)
    {
        $pluginMeta = json_decode(json_encode($pluginMeta));

        if (empty($pluginMeta->name) || empty($pluginMeta->slug) || empty($pluginMeta->namespace)) {
            return;
        }

        if (!isset(self::$plugins[$pluginMeta->slug])) {
            AutoLoader::register($pluginMeta->namespace, WP_PLUGIN_DIR .'/'. EMBEDPRESS_PLG_NAME .'-'. $pluginMeta->slug .'/'. $pluginMeta->name);

            $plugin = "{$pluginMeta->namespace}\Plugin";
            if (!empty(@$plugin::SLUG)) {
                self::$plugins[$pluginMeta->slug] = $pluginMeta->namespace;

                $bsFilePath = $plugin::PATH . EMBEDPRESS_PLG_NAME .'-'. $plugin::SLUG .'.php';

                register_activation_hook($bsFilePath, array($plugin::NMSPC, 'onActivationCallback'));
                register_deactivation_hook($bsFilePath, array($plugin::NMSPC, 'onDeactivationCallback'));

                add_action('admin_init', array($plugin, 'onLoadAdminCallback'));

                add_action(EMBEDPRESS_PLG_NAME .':'. $plugin::SLUG .':settings:register', array($plugin, 'registerSettings'));
                add_action(EMBEDPRESS_PLG_NAME .':settings:render:tab', array($plugin, 'renderTab'));

                $plugin::registerEvents();
            }
        }
    }

    /**
     * Retrieve all registered plugins.
     *
     * @since   1.4.0
     * @static
     *
     * @return  array
     */
    public static function getPlugins()
    {
        return self::$plugins;
    }

    /**
     * Handle links displayed below the plugin name in the WordPress Installed Plugins page.
     *
     * @since   1.4.0
     * @static
     *
     * @return  array
     */
    public static function handleActionLinks($links, $file)
    {
        $settingsLink = '<a href="'. admin_url('admin.php?page=embedpress') .'" aria-label="'. __('Open settings page', 'embedpress') .'">'. __('Settings', 'embedpress') .'</a>';

        array_unshift($links, $settingsLink);

        return $links;
    }
}
