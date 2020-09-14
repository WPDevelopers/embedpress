<?php
defined('ABSPATH') or die("No direct script access allowed.");

/**
 * File responsible for defining basic general constants used by the plugin.
 *
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2020 WPDeveloper. All rights reserved.
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
    define('EMBEDPRESS_VERSION', "2.6.1");
    /**
     * @deprecated 2.2.0
     */
    define('EMBEDPRESS_PLG_VERSION', EMBEDPRESS_VERSION);
}

if ( ! defined('EMBEDPRESS_PRO_VERSION')) {
    define('EMBEDPRESS_PRO_VERSION', "2.4.2");
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

if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require_once __DIR__ . '/vendor/autoload.php';
}
// Run the plugin autoload script
if ( ! defined('EMBEDPRESS_IS_LOADED')) {
    require_once EMBEDPRESS_PATH_BASE . "autoloader.php";
}

// Includes the Gutenberg blocks for EmbedPress
require_once __DIR__ . '/Gutenberg/plugin.php';