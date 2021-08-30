<?php

namespace EmbedPress;

use EmbedPress\Ends\Back\Handler as EndHandlerAdmin;
use EmbedPress\Ends\Back\Settings\EmbedpressSettings;
use EmbedPress\Ends\Front\Handler as EndHandlerPublic;
use EmbedPress\Includes\Traits\Shared;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Entity that glues together all pieces that the plugin is made of, for WordPress before 5.0.
 *
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2020 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       1.0.0
 */
class CoreLegacy
{
    use Shared;
    /**
     * The name of the plugin.
     *
     * @since   1.0.0
     * @access  protected
     *
     * @var     string $pluginName The name of the plugin.
     */
    protected $pluginName;

    /**
     * The version of the plugin.
     *
     * @since   1.0.0
     * @access  protected
     *
     * @var     string $pluginVersion The version of the plugin.
     */
    protected $pluginVersion;

    /**
     * An instance of the plugin loader.
     * @since   1.0.0
     * @access  protected
     * @var     Loader $pluginVersion The version of the plugin.
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
    private static $plugins = [];

    /**
     * Initialize the plugin and set its properties.
     *
     * @since   1.0.0
     *
     * @return  void
     */
    public function __construct()
    {
        $this->pluginName    = EMBEDPRESS_PLG_NAME;
        $this->pluginVersion = EMBEDPRESS_VERSION;

        $this->loaderInstance = new Loader();
        add_action('admin_notices',[$this,'embedpress_admin_notice']);
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
     * @return  Loader
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
	        new EmbedpressSettings();
	        $plgSettings = self::getSettings();
            $this->admin_notice();

            add_filter('plugin_action_links_embedpress/embedpress.php',
                ['\\EmbedPress\\CoreLegacy', 'handleActionLinks'], 10, 2);

            add_action('admin_enqueue_scripts', ['\\EmbedPress\\Ends\\Back\\Handler', 'enqueueStyles']);
            add_action('wp_ajax_embedpress_notice_dismiss', ['\\EmbedPress\\Ends\\Back\\Handler', 'embedpress_notice_dismiss']);
            add_action('init', ['\\EmbedPress\\DisablerLegacy', 'run'], 1);
            add_action('init', [$this, 'configureTinyMCE'], 1);

            $plgHandlerAdminInstance = new EndHandlerAdmin($this->getPluginName(), $this->getPluginVersion());

            if ( $plgSettings->enablePluginInAdmin ) {
                $this->loaderInstance->add_action('admin_enqueue_scripts', $plgHandlerAdminInstance, 'enqueueScripts');
            }

            $onAjaxCallbackName = "doShortcodeReceivedViaAjax";
            $this->loaderInstance->add_action('wp_ajax_embedpress_do_ajax_request', $plgHandlerAdminInstance,
                $onAjaxCallbackName);
            $this->loaderInstance->add_action('wp_ajax_nopriv_embedpress_do_ajax_request', $plgHandlerAdminInstance,
                $onAjaxCallbackName);

            $this->loaderInstance->add_action('wp_ajax_embedpress_get_embed_url_info', $plgHandlerAdminInstance,
                "getUrlInfoViaAjax");

            unset($onAjaxCallbackName, $plgHandlerAdminInstance);
        } else {
            add_action('init', ['\\EmbedPress\\DisablerLegacy', 'run'], 1);

	        $plgSettings = Core::getSettings();

	        if (!is_admin() && $plgSettings->enablePluginInFront ) {
		        $plgHandlerPublicInstance = new EndHandlerPublic($this->getPluginName(), $this->getPluginVersion());

		        $this->loaderInstance->add_action('wp_enqueue_scripts', $plgHandlerPublicInstance, 'enqueueScripts');
		        $this->loaderInstance->add_action('wp_enqueue_scripts', $plgHandlerPublicInstance, 'enqueueStyles');

		        unset($plgHandlerPublicInstance);
	        }

        }

        // Add support for embeds on AMP pages
        add_filter('pp_embed_parsed_content', ['\\EmbedPress\\AMP\\EmbedHandler', 'processParsedContent'], 10, 3);

        // Add support for our embeds on Beaver Builder. Without this it only run the native embeds.
        add_filter('fl_builder_before_render_shortcodes',
            ['\\EmbedPress\\ThirdParty\\BeaverBuilder', 'before_render_shortcodes']);

        $this->start_plugin_tracking();
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
        add_filter('rewrite_rules_array', ['\\EmbedPress\\DisablerLegacy', 'disableDefaultEmbedRewriteRules']);
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
        remove_filter('rewrite_rules_array', ['\\EmbedPress\\DisablerLegacy', 'disableDefaultEmbedRewriteRules']);
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
        $additionalProvidersFilePath = EMBEDPRESS_PATH_BASE . 'providers.php';
        if (file_exists($additionalProvidersFilePath)) {
            include $additionalProvidersFilePath;
            if (isset($additionalServiceProviders)) {
                return apply_filters( 'embedpress_additional_service_providers', $additionalServiceProviders);
            }
        }

        return apply_filters( 'embedpress_additional_service_providers', []);
    }

    /**
     * Method that checks if an embed of a given service provider can be responsive.
     *
     * @since   1.0.0
     * @static
     *
     * @param   string $serviceProviderAlias The service's slug.
     *
     * @return  boolean
     */
    public static function canServiceProviderBeResponsive($serviceProviderAlias)
    {
        return in_array($serviceProviderAlias, [
            "dailymotion",
            "kickstarter",
            "rutube",
            "ted",
            "vimeo",
            "youtube",
            "ustream",
            "google-docs",
            "animatron",
            "amcharts",
            "on-aol-com",
            "animoto",
            "videojug",
            'issuu',
        ]);
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
        $settings = get_option(EMBEDPRESS_PLG_NAME);

        if ( ! isset($settings['enablePluginInAdmin'])) {
            $settings['enablePluginInAdmin'] = true;
        }

        if ( ! isset($settings['enablePluginInFront'])) {
            $settings['enablePluginInFront'] = true;
        }

        return (object)$settings;
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
        $settingsLink = '<a href="' . admin_url('admin.php?page=embedpress') . '" aria-label="' . __('Open settings page',
                'embedpress') . '">' . __('Settings', 'embedpress') . '</a>';

        array_unshift($links, $settingsLink);
	    if ( !is_embedpress_pro_active() ) {
		    $links[] = '<a href="https://wpdeveloper.net/in/upgrade-embedpress" target="_blank" class="embedpress-go-pro-action" style="color: green">'.__('Go Pro', 'embedpress').'</a>';
	    }
	    return $links;
    }


    /**
     * Method that ensures the API's url are whitelisted to WordPress external requests.
     *
     * @since   1.4.0
     * @static
     *
     * @param   boolean $isAllowed
     * @param   string  $host
     * @param   string  $url
     *
     * @return  boolean
     */
    public static function allowApiHost($isAllowed, $host, $url)
    {
        if ($host === EMBEDPRESS_LICENSES_API_HOST) {
            $isAllowed = true;
        }

        return $isAllowed;
    }

    /**
     * Add filters to configure the TinyMCE editor.
     *
     * @since   1.6.2
     */
    public function configureTinyMCE()
    {
        add_filter('teeny_mce_before_init', [$this, 'hookOnPaste']);
        add_filter('tiny_mce_before_init', [$this, 'hookOnPaste']);
    }

    /**
     * Hook the onPaste methof to the paste_preprocess config in the editor.
     *
     * @since   1.6.2
     *
     * @param  array $mceInit
     *
     * @return array
     */
    public function hookOnPaste($mceInit)
    {
        $settings = self::getSettings();

        if (isset($settings->enablePluginInAdmin) && $settings->enablePluginInAdmin) {
            // We hook here because the onPaste is sometimes called after the content was already added to the editor.
            // If you copy text from the editor and paste there, it will give no way to use a normal onPaste event hook
            // to modify the input since it was already injected.
            $mceInit['paste_preprocess'] = 'function (plugin, args) { if (typeof EmbedPress !== "undefined") {EmbedPress.onPaste(plugin, args); } }';
        }


        return $mceInit;
    }
}
