<?php
namespace EmbedPress\Ends\Back;

use \EmbedPress\Ends\Handler as EndHandlerAbstract;
use \EmbedPress\Shortcode;
use \EmbedPress\Core;
use \Embera\Embera;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * The admin-facing functionality of the plugin.
 * Defines the plugin name, version, and enqueue the admin-specific stylesheets and scripts.
 *
 * @package     EmbedPress
 * @subpackage  EmbedPress/Ends/Back
 * @author      PressShack <help@pressshack.com>
 * @copyright   Copyright (C) 2017 Open Source Training, LLC. All rights reserved.
 * @license     GPLv2 or later
 * @since       1.0.0
 */
class Handler extends EndHandlerAbstract
{
    /**
     * Method that register all scripts for the admin area.
     *
     * @since   1.0.0
     *
     * @return  void
     */
    public function enqueueScripts()
    {
        $plgSettings = Core::getSettings();

        wp_enqueue_script("bootbox-bootstrap", EMBEDPRESS_URL_ASSETS .'js/vendor/bootstrap/bootstrap.min.js', array('jquery'), $this->pluginVersion, true);
        wp_enqueue_script("bootbox", EMBEDPRESS_URL_ASSETS .'js/vendor/bootbox.min.js', array('jquery', 'bootbox-bootstrap'), $this->pluginVersion, true);
        wp_enqueue_script($this->pluginName, EMBEDPRESS_URL_ASSETS .'js/preview.js', array('jquery', 'bootbox'), $this->pluginVersion, true);
        wp_localize_script($this->pluginName, '$data', array(
            'previewSettings'       => array(
                'juriRoot'   => get_site_url() .'/',
                'versionUID' => $this->pluginVersion,
                'debug'      => true
            ),
            'EMBEDPRESS_SHORTCODE'  => EMBEDPRESS_SHORTCODE,
            'EMBEDPRESS_URL_ASSETS' => EMBEDPRESS_URL_ASSETS
        ));

        $installedPlugins = Core::getPlugins();
        if (count($installedPlugins) > 0) {
            foreach ($installedPlugins as $plgSlug => $plgNamespace) {
                $plgScriptPathRelative = "assets/js/embedpress.{$plgSlug}.js";
                $plgName = "embedpress-{$plgSlug}";

                if (file_exists(WP_PLUGIN_DIR . "/{$plgName}/{$plgScriptPathRelative}")) {
                    wp_enqueue_script($plgName, plugins_url($plgName) .'/'. $plgScriptPathRelative, array($this->pluginName), $this->pluginVersion, true);
                }
            }
        }
    }

    /**
     * Method that register all stylesheets for the admin area.
     *
     * @since   1.0.0
     * @static
     *
     * @return  void
     */
    public static function enqueueStyles()
    {
        wp_enqueue_style('embedpress-admin', plugins_url('embedpress/assets/css/admin.css'));
    }

    /**
     * Method that receive a string via AJAX and return the decoded-shortcoded-version of that string.
     *
     * @since   1.0.0
     *
     * @return  void
     */
    public function doShortcodeReceivedViaAjax()
    {
        $subject = isset($_POST['subject']) ? $_POST['subject'] : "";

        $response = array(
            'data' => Shortcode::parseContent($subject, true)
        );

        header('Content-Type:application/json;charset=UTF-8');
        echo json_encode($response);

        exit();
    }

    /**
     * Method that receive an url via AJAX and return the info about that url/embed.
     *
     * @since   1.0.0
     *
     * @return  void
     */
    public function getUrlInfoViaAjax()
    {
        $url = isset($_GET['url']) ? trim($_GET['url']) : "";

        $response = array(
            'url'             => $url,
            'canBeResponsive' => false
        );

        if (!!strlen($response['url'])) {
            $embera = new Embera();

            $additionalServiceProviders = Core::getAdditionalServiceProviders();
            if (!empty($additionalServiceProviders)) {
                foreach ($additionalServiceProviders as $serviceProviderClassName => $serviceProviderUrls) {
                    Shortcode::addServiceProvider($serviceProviderClassName, $serviceProviderUrls, $embera);
                }
            }

            $urlInfo = $embera->getUrlInfo($response['url']);
            if (isset($urlInfo[$response['url']])) {
                $urlInfo = (object)$urlInfo[$response['url']];
                $response['canBeResponsive'] = Core::canServiceProviderBeResponsive($urlInfo->provider_alias);
            }
        }

        header('Content-Type:application/json;charset=UTF-8');
        echo json_encode($response);

        exit();
    }
}
