<?php
/**
 * Plugin Name: EmbedPress
 * Plugin URI:  https://embedpress.com/
 * Description: EmbedPress lets you embed videos, images, posts, audio, maps and uplaoad PDF, DOC, PPT & all other types of content into your WordPress site with one-click and showcase it beautifully for the visitors. 100+ sources supported.
 * Author: WPDeveloper
 * Author URI: https://wpdeveloper.net
 * Version: 3.0.2
 * Text Domain: embedpress
 * Domain Path: /languages
 *
 * Copyright (c) 2021 WPDeveloper
 *
 * EmbedPress plugin bootstrap file.
 *
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2021 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       1.0.0
 */

use EmbedPress\Compatibility;
use EmbedPress\Core;
use EmbedPress\CoreLegacy;
use EmbedPress\Elementor\Embedpress_Elementor_Integration;
use EmbedPress\Includes\Classes\Feature_Enhancer;

defined('ABSPATH') or die("No direct script access allowed.");

define('EMBEDPRESS_PLUGIN_BASENAME', plugin_basename(__FILE__));
define('EMBEDPRESS_FILE', __FILE__);

define('EMBEDPRESS_PLUGIN_DIR_PATH', plugin_dir_path(__FILE__));
define('EMBEDPRESS_PLUGIN_DIR_URL', plugin_dir_url(__FILE__));
define('EMBEDPRESS_GUTENBERG_DIR_URL', EMBEDPRESS_PLUGIN_DIR_URL.'Gutenberg/');
define('EMBEDPRESS_GUTENBERG_DIR_PATH', EMBEDPRESS_PLUGIN_DIR_PATH.'Gutenberg/');
define('EMBEDPRESS_SETTINGS_ASSETS_URL', EMBEDPRESS_PLUGIN_DIR_URL.'EmbedPress/Ends/Back/Settings/assets/');
define('EMBEDPRESS_SETTINGS_PATH', EMBEDPRESS_PLUGIN_DIR_PATH.'EmbedPress/Ends/Back/Settings/');
define('EMBEDPRESS_PLUGIN_URL', plugins_url('/', __FILE__));

require_once EMBEDPRESS_PLUGIN_DIR_PATH . 'includes.php';

include_once ABSPATH . 'wp-admin/includes/plugin.php';

if ( ! defined('EMBEDPRESS_IS_LOADED')) {
    return;
}
function is_embedpress_pro_active() {
	if ( ! function_exists( 'is_plugin_active') ) {
		include_once ABSPATH . 'wp-admin/includes/plugin.php';
	}

	return is_plugin_active('embedpress-pro/embedpress-pro.php');
}

/**
 * Get the version of the currently activated embedpress pro plugin dynamically
 * @return false|mixed
 */
function get_embedpress_pro_version() {
	if ( is_embedpress_pro_active() ) {
		$p = wp_get_active_and_valid_plugins();
		$p = array_filter( $p, function ( $plugin){
			return !empty( strpos( $plugin, 'embedpress-pro'));
		});
		$p = array_values( $p);
		if ( !empty( $p[0]) ) {
			$d = get_plugin_data($p[0]);
			if ( isset( $d['Version']) ) {
				return $d['Version'];
			}
			return false;
		}
		return false;
	}
	return false;

}

function onPluginActivationCallback()
{
    Core::onPluginActivationCallback();
}

function onPluginDeactivationCallback()
{
    Core::onPluginDeactivationCallback();
}

register_activation_hook(__FILE__, 'onPluginActivationCallback');
register_deactivation_hook(__FILE__, 'onPluginDeactivationCallback');


if ( ! is_plugin_active('gutenberg/gutenberg.php')) {
    add_action( 'plugins_loaded', function() {
        do_action( 'embedpress_before_init' );
    } );
    $editor_check = get_option('classic-editor-replace');
    if ((Compatibility::isWordPress5() && ! Compatibility::isClassicalEditorActive()) || (Compatibility::isClassicalEditorActive() && 'block'=== $editor_check )) {
        $embedPressPlugin = new Core();
    } else {
        $embedPressPlugin = new CoreLegacy();
    }

    $embedPressPlugin->initialize();
	new Feature_Enhancer();
}

if (  is_plugin_active('elementor/elementor.php')) {
    $embedPressElements = new Embedpress_Elementor_Integration();
    $embedPressElements->init();
}
