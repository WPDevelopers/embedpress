<?php

/**
 * Plugin Name: EmbedPress
 * Plugin URI:  https://embedpress.com/
 * Description: EmbedPress lets you embed videos, images, posts, audio, maps and upload PDF, DOC, PPT & all other types of content into your WordPress site with one-click and showcase it beautifully for the visitors. 150+ sources supported.
 * Author: WPDeveloper
 * Author URI: https://wpdeveloper.com
 * Version: 4.2.9
 * Text Domain: embedpress
 * Domain Path: /languages
 *
 * Copyright (c) 2023 WPDeveloper
 *
 * EmbedPress plugin bootstrap file.
 *
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2023 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       1.0.0
 */

use EmbedPress\Compatibility;
use EmbedPress\Core;
use EmbedPress\CoreLegacy;
use EmbedPress\Elementor\Embedpress_Elementor_Integration;
use EmbedPress\Includes\Classes\Feature_Enhancer;
use EmbedPress\Includes\Classes\Extend_Elementor_Controls;
use EmbedPress\Includes\Classes\Extend_CustomPlayer_Controls;
use EmbedPress\Includes\Classes\Helper;
use EmbedPress\Shortcode;


defined('ABSPATH') or die("No direct script access allowed.");


define('EMBEDPRESS_PLUGIN_BASENAME', plugin_basename(__FILE__));
define('EMBEDPRESS_FILE', __FILE__);

if (!defined('EMBEDPRESS_PLUGIN_VERSION')) {

    if (defined('EMBEDPRESS_DEV_MODE') && EMBEDPRESS_DEV_MODE) {
        define('EMBEDPRESS_PLUGIN_VERSION', time());
    } else {
        define('EMBEDPRESS_PLUGIN_VERSION', '4.2.9');
    }

}

define('EMBEDPRESS_PLUGIN_DIR_PATH', plugin_dir_path(__FILE__));
define('EMBEDPRESS_PLUGIN_DIR_URL', plugin_dir_url(__FILE__));
define('EMBEDPRESS_GUTENBERG_DIR_URL', EMBEDPRESS_PLUGIN_DIR_URL . 'Gutenberg/');
define('EMBEDPRESS_GUTENBERG_DIR_PATH', EMBEDPRESS_PLUGIN_DIR_PATH . 'Gutenberg/');
define('EMBEDPRESS_SETTINGS_ASSETS_URL', EMBEDPRESS_PLUGIN_DIR_URL . 'EmbedPress/Ends/Back/Settings/assets/');
define('EMBEDPRESS_SETTINGS_PATH', EMBEDPRESS_PLUGIN_DIR_PATH . 'EmbedPress/Ends/Back/Settings/');
define('EMBEDPRESS_PLUGIN_URL', plugins_url('/', __FILE__));


require_once EMBEDPRESS_PLUGIN_DIR_PATH . 'includes.php';

include_once ABSPATH . 'wp-admin/includes/plugin.php';

if (!defined('EMBEDPRESS_IS_LOADED')) {
    return;
}

add_action('embedpress_cache_cleanup_action', 'embedpress_cache_cleanup');


if (!empty($_GET['hash'])) {
    remove_action('wp_head', 'rel_canonical');
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


add_action('plugins_loaded', function () {
    do_action('embedpress_before_init');
});
$editor_check = get_option('classic-editor-replace');

if (isset($_GET['classic-editor']) || isset($_POST['action']) && $_POST['action'] == 'embedpress_do_ajax_request') {
    $embedPressPlugin = new CoreLegacy();
} elseif ((Compatibility::isWordPress5() && !Compatibility::isClassicalEditorActive()) || (Compatibility::isClassicalEditorActive() && 'block' === $editor_check)) {
    $embedPressPlugin = new Core();
} else {
    $embedPressPlugin = new CoreLegacy();
}

$embedPressPlugin->initialize();
new Feature_Enhancer();
new Extend_Elementor_Controls();
new Extend_CustomPlayer_Controls();

new Helper();


if (is_plugin_active('elementor/elementor.php')) {
    $embedPressElements = new Embedpress_Elementor_Integration();
    $embedPressElements->init();
}

Shortcode::register();

if (!class_exists('\simple_html_dom')) {
    include_once EMBEDPRESS_PATH_CORE . 'simple_html_dom.php';
}


/**
 * Check is embedpress-pro active
 */
$is_pro_active = false;
if (class_exists('EmbedPress_Licensing')) {
    $is_pro_active = true;
}

add_action('wp_enqueue_scripts', 'load_scripts');
function load_scripts()
{
    Shortcode::shortcode_scripts();
}