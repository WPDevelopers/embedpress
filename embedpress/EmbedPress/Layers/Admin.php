<?php
namespace EmbedPress\Layers;

use \EmbedPress\Layers\Handler;
use \EmbedPress\Shortcode;
use \EmbedPress\Plugin;
use \Embera\Embera;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * The admin-facing functionality of the plugin.
 * Defines the plugin name, version, and enqueue the admin-specific stylesheets and scripts.
 *
 * @package     EmbedPress
 * @subpackage  EmbedPress/Layers
 * @author      OSTraining <support@ostraining.com>
 * @copyright   2016 Alledia.com, All rights reserved
 * @license     GPLv2 or later
 * @since       0.1
 */
class Admin extends Handler
{
    /**
     * Method that register all scripts for the admin area.
     *
     * @since 0.1
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
    }

    /**
     * Method that register all stylesheets for the admin area.
     *
     * @since 0.1
     */
    public function enqueueStyles()
    {
        global $wp_scripts;

        wp_enqueue_style('bootbox-bootstrap', EMBEDPRESS_URL_ASSETS .'css/vendor/bootstrap/bootstrap.min.css');
        wp_enqueue_style($this->pluginName, EMBEDPRESS_URL_ASSETS .'css/preview.css');
    }

    /**
     * Method that receive a string via AJAX and return the decoded-shortcoded-version of that string.
     *
     * @since 0.1
     */
    public function doShortcodeReceivedViaAjax()
    {
        $response = array(
            'data' => array(
                'content' => Shortcode::parseContent(@$_POST['subject'], true)
            )
        );

        header('Content-Type:application/json;charset=UTF-8');
        echo json_encode($response);

        exit();
    }

    /**
     * Method that receive an url via AJAX and return the info about that url/embed.
     *
     * @since 0.1
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