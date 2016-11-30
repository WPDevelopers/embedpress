<?php
namespace EmbedPress\Ends\Back;

use \EmbedPress\Ends\Handler as EndHandlerAbstract;
use \EmbedPress\Shortcode;
use \EmbedPress\Plugin;
use \Embera\Embera;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * The admin-facing functionality of the plugin.
 * Defines the plugin name, version, and enqueue the admin-specific stylesheets and scripts.
 *
 * @package     EmbedPress
 * @subpackage  EmbedPress/Ends/Back
 * @author      PressShack <help@pressshack.com>
 * @copyright   Copyright (C) 2016 Open Source Training, LLC. All rights reserved.
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
        $plgSettings = Plugin::getSettings();

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
            'EMBEDPRESS_URL_ASSETS' => EMBEDPRESS_URL_ASSETS,
            'displayPreviewBox'     => $plgSettings->displayPreviewBox
        ));

        $installedPlugins = Plugin::getPlugins();
        if (count($installedPlugins) > 0) {
            foreach ($installedPlugins as $pluginSlug => $pluginNamespace) {
                $scriptPath = WP_PLUGIN_DIR .'/embedpress-'. $pluginSlug .'/assets/js/plugin.js';
                if (file_exists($scriptPath)) {
                    wp_enqueue_script('embedpress-'. $pluginSlug, plugins_url('embedpress-'. $pluginSlug) .'/assets/js/embedpress.'. $pluginSlug .'.js', array($this->pluginName), $this->pluginVersion, true);
                }
            }
        }
    }

    /**
     * Method that register all stylesheets for the admin area.
     *
     * @since   1.0.0
     *
     * @return  void
     */
    public function enqueueStyles()
    {
        global $wp_scripts;
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
        $response = array(
            'data' => Shortcode::parseContent(@$_POST['subject'], true)
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
        $response = array(
            'url'             => trim(@$_GET['url']),
            'canBeResponsive' => false
        );

        if (!!strlen($response['url'])) {
            $embera = new Embera();

            $additionalServiceProviders = Plugin::getAdditionalServiceProviders();
            if (!empty($additionalServiceProviders)) {
                foreach ($additionalServiceProviders as $serviceProviderClassName => $serviceProviderUrls) {
                    Shortcode::addServiceProvider($serviceProviderClassName, $serviceProviderUrls, $embera);
                }
            }

            $urlInfo = $embera->getUrlInfo($response['url']);
            if (isset($urlInfo[$response['url']])) {
                $urlInfo = (object)$urlInfo[$response['url']];
                $response['canBeResponsive'] = Plugin::canServiceProviderBeResponsive($urlInfo->provider_alias);
            }
        }

        header('Content-Type:application/json;charset=UTF-8');
        echo json_encode($response);

        exit();
    }
}
