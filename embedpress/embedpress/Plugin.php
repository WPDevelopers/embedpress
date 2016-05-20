<?php
namespace EmbedPress;

use \EmbedPress\Loader;
use \EmbedPress\Layers\Admin as AdminHandler;
use \EmbedPress\Layers\HandlerPublic as PublicHandler;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

class Plugin
{
    protected $pluginName;
    protected $pluginVersion;
    protected $loaderInstance;

    public function __construct()
    {
        $this->pluginName = EMBEDPRESS_PLG_NAME;
        $this->pluginVersion = EMBEDPRESS_PLG_VERSION;

        $this->loaderInstance = new Loader();
    }

    public function getPluginName()
    {
        return $this->pluginName;
    }

    public function getPluginVersion()
    {
        return $this->pluginVersion;
    }

    public function getLoader()
    {
        return $this->loaderInstance;
    }

    public function initialize()
    {
        global $wp_actions;

        add_action('init', array('\EmbedPress\Disabler', 'run'), 1);

        if (is_admin()) {
            $plgHandlerAdminInstance = new AdminHandler($this->getPluginName(), $this->getPluginVersion());

            $enqueueScriptsHookName = "admin_enqueue_scripts";
            $this->loaderInstance->add_action($enqueueScriptsHookName, $plgHandlerAdminInstance, 'enqueueScripts');
            $this->loaderInstance->add_action($enqueueScriptsHookName, $plgHandlerAdminInstance, 'enqueueStyles');

            $onAjaxCallbackName = "doShortcodeReceivedViaAjax";
            $this->loaderInstance->add_action('wp_ajax_embedpress_do_ajax_request', $plgHandlerAdminInstance, $onAjaxCallbackName);
            $this->loaderInstance->add_action('wp_ajax_nopriv_embedpress_do_ajax_request', $plgHandlerAdminInstance, $onAjaxCallbackName);

            $this->loaderInstance->add_action('wp_ajax_embedpress_get_embed_url_info', $plgHandlerAdminInstance, "getUrlInfoViaAjax");

            unset($onAjaxCallbackName, $enqueueScriptsHookName, $plgHandlerAdminInstance);
        } else {
            $plgHandlerPublicInstance = new PublicHandler($this->getPluginName(), $this->getPluginVersion());

            $enqueueScriptsHookName = "wp_enqueue_scripts";
            $this->loaderInstance->add_action($enqueueScriptsHookName, $plgHandlerPublicInstance, 'enqueueScripts');
            $this->loaderInstance->add_action($enqueueScriptsHookName, $plgHandlerPublicInstance, 'enqueueStyles');

            unset($enqueueScriptsHookName, $plgHandlerPublicInstance);
        }

        $this->loaderInstance->run();
    }

    public static function onPluginActivationCallback()
    {
        remove_filter('rewrite_rules_array', array('\EmbedPress\Disabler', 'disableDefaultEmbedRewriteRules'));
        flush_rewrite_rules();
    }

    public static function onPluginDeactivationCallback()
    {
        remove_filter('rewrite_rules_array', array('\EmbedPress\Disabler', 'disableDefaultEmbedRewriteRules'));
        flush_rewrite_rules();
    }

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

    public static function canServiceProviderBeResponsive($serviceProviderAlias)
    {
        return in_array($serviceProviderAlias, array("dailymotion", "kickstarter", "rutube", "ted", "vimeo", "youtube", "ustream", "google-docs", "animatron", "amcharts", "on-aol-com", "animoto", "videojug"));
    }
}
