<?php
defined('ABSPATH') or die("No direct script access allowed.");

/**
 * File responsible for defining basic general constants used by the plugin.
 *
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2021 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       1.0.0
 */


if ( ! defined('EMBEDPRESS')) {

    define('EMBEDPRESS', "EmbedPress");
}

if ( ! defined('EMBEDPRESS_PLG_NAME')) {
    define('EMBEDPRESS_PLG_NAME', 'embedpress');
}

if ( ! defined('EMBEDPRESS_VERSION')) {
    define('EMBEDPRESS_VERSION', "3.2.1");
    /**
     * @deprecated 2.2.0
     */
    define('EMBEDPRESS_PLG_VERSION', EMBEDPRESS_VERSION);
}


if ( ! defined('EMBEDPRESS_ROOT')) {
    define('EMBEDPRESS_ROOT', dirname(__FILE__));
}

if ( ! defined('EMBEDPRESS_PATH_BASE')) {
    define('EMBEDPRESS_PATH_BASE', plugin_dir_path(__FILE__));
}

if ( ! defined('EMBEDPRESS_PATH_CORE')) {
    define('EMBEDPRESS_PATH_CORE', EMBEDPRESS_PATH_BASE . "EmbedPress/");
}

if ( ! defined('EMBEDPRESS_URL_ASSETS')) {
    define('EMBEDPRESS_URL_ASSETS', plugins_url(EMBEDPRESS_PLG_NAME) . "/assets/");
}

if ( ! defined('EMBEDPRESS_NAMESPACE')) {
    define('EMBEDPRESS_NAMESPACE', "\\EmbedPress");
}

if ( ! defined('EMBEDPRESS_AUTOLOADER_NAME')) {
    define('EMBEDPRESS_AUTOLOADER_NAME', "AutoLoader");
}

if ( ! defined('EMBEDPRESS_SHORTCODE')) {
    define('EMBEDPRESS_SHORTCODE', "embed");
}

if ( ! defined('EMBEDPRESS_LICENSES_API_HOST')) {
    define('EMBEDPRESS_LICENSES_API_HOST', "embedpress.com");
}

if ( ! defined('EMBEDPRESS_LICENSES_API_URL')) {
    define('EMBEDPRESS_LICENSES_API_URL', "https://embedpress.com");
}

if ( ! defined('EMBEDPRESS_LICENSES_MORE_INFO_URL')) {
    define('EMBEDPRESS_LICENSES_MORE_INFO_URL', "https://embedpress.com/docs/activate-license");
}
function embedpress_cache_cleanup( ){
	$dirname = wp_get_upload_dir()['basedir'].'/embedpress';
	if ( file_exists( $dirname) ) {
		$files = glob($dirname.'/*');
		//@TODO; delete files only those start with 'mu_'
		foreach($files as $file) {
			if(is_file($file))
				unlink($file);
		}
	}
}

function embedpress_schedule_cache_cleanup( ){
	if ( ! wp_next_scheduled( 'embedpress_cache_cleanup_action' ) ) {
		wp_schedule_event( time(), 'daily', 'embedpress_cache_cleanup_action' );
	}
}
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require_once __DIR__ . '/vendor/autoload.php';
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
// Run the plugin autoload script
if ( ! defined('EMBEDPRESS_IS_LOADED')) {
    require_once EMBEDPRESS_PATH_BASE . "autoloader.php";
}

// Includes the Gutenberg blocks for EmbedPress
require_once __DIR__ . '/Gutenberg/plugin.php';

