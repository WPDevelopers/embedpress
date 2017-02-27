<?php
defined('ABSPATH') or die("No direct script access allowed.");

/**
 * File responsible for defining basic general constants used by the plugin.
 *
 * @package     EmbedPress
 * @author      PressShack <help@pressshack.com>
 * @copyright   Copyright (C) 2017 Open Source Training, LLC. All rights reserved.
 * @license     GPLv2 or later
 * @since       1.0.0
 */

if (!defined('EMBEDPRESS')) {
    define('EMBEDPRESS', "EmbedPress");
}

if (!defined('EMBEDPRESS_PLG_NAME')) {
    define('EMBEDPRESS_PLG_NAME', strtolower(EMBEDPRESS));
}

if (!defined('EMBEDPRESS_PLG_VERSION')) {
    define('EMBEDPRESS_PLG_VERSION', "1.6.0rc2");
}

if (!defined('EMBEDPRESS_PATH_BASE')) {
    define('EMBEDPRESS_PATH_BASE', plugin_dir_path(__FILE__));
}

if (!defined('EMBEDPRESS_PATH_CORE')) {
    define('EMBEDPRESS_PATH_CORE', EMBEDPRESS_PATH_BASE ."EmbedPress/");
}

if (!defined('EMBEDPRESS_PATH_LIBRARIES')) {
    define('EMBEDPRESS_PATH_LIBRARIES', EMBEDPRESS_PATH_BASE ."library/");
}

if (!defined('EMBEDPRESS_URL_ASSETS')) {
    define('EMBEDPRESS_URL_ASSETS', plugins_url(EMBEDPRESS_PLG_NAME) ."/assets/");
}

if (!defined('EMBEDPRESS_NAMESPACE')) {
    define('EMBEDPRESS_NAMESPACE', "\\EmbedPress");
}

if (!defined('EMBEDPRESS_AUTOLOADER_NAME')) {
    define('EMBEDPRESS_AUTOLOADER_NAME', "AutoLoader");
}

if (!defined('EMBEDPRESS_SHORTCODE')) {
    define('EMBEDPRESS_SHORTCODE', "embed");
}

if (!defined('EMBEDPRESS_LICENSES_API_HOST')) {
    define('EMBEDPRESS_LICENSES_API_HOST', "pressshack.com");
}

if (!defined('EMBEDPRESS_LICENSES_API_URL')) {
    define('EMBEDPRESS_LICENSES_API_URL', "http://pressshack.com");
}

if (!defined('EMBEDPRESS_LICENSES_MORE_INFO_URL')) {
    define('EMBEDPRESS_LICENSES_MORE_INFO_URL', "https://pressshack.com/embedpress/docs/activate-license");
}

// Run libraries's autoload script
require_once EMBEDPRESS_PATH_LIBRARIES ."autoload.php";
// Run the plugin autoload script
require_once EMBEDPRESS_PATH_BASE ."autoloader.php";
