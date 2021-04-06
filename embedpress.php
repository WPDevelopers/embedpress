<?php
/**
 * Plugin Name: EmbedPress
 * Plugin URI:  https://embedpress.com/
 * Description: EmbedPress lets you embed videos, images, posts, audio, maps and uplaoad PDF, DOC, PPT & all other types of content into your WordPress site with one-click and showcase it beautifully for the visitors. 100+ sources supported.
 * Author: WPDeveloper
 * Author URI: https://wpdeveloper.net
 * Version: 2.7.6
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

defined('ABSPATH') or die("No direct script access allowed.");

define('EMBEDPRESS_PLUGIN_BASENAME', plugin_basename(__FILE__));
define('EMBEDPRESS_FILE', __FILE__);

define('EMBEDPRESS_PLUGIN_DIR_PATH', plugin_dir_path(__FILE__));
define('EMBEDPRESS_PLUGIN_DIR_URL', plugin_dir_url(__FILE__));
define('EMBEDPRESS_GUTENBERG_DIR_URL', plugin_dir_url(__FILE__).'Gutenberg/');
define('EMBEDPRESS_GUTENBERG_DIR_PATH', plugin_dir_path(__FILE__).'Gutenberg/');

define('EMBEDPRESS_PLUGIN_URL', plugins_url('/', __FILE__));

require_once plugin_dir_path(__FILE__) . 'includes.php';

include_once ABSPATH . 'wp-admin/includes/plugin.php';

if ( ! defined('EMBEDPRESS_IS_LOADED')) {
    return;
}

function onPluginActivationCallback()
{
    \EmbedPress\Core::onPluginActivationCallback();
}

function onPluginDeactivationCallback()
{
    \EmbedPress\Core::onPluginDeactivationCallback();
}

register_activation_hook(__FILE__, 'onPluginActivationCallback');
register_deactivation_hook(__FILE__, 'onPluginDeactivationCallback');


if ( ! is_plugin_active('gutenberg/gutenberg.php')) {
    add_action( 'plugins_loaded', function() {
        do_action( 'embedpress_before_init' );
    } );
    $editor_check = get_option('classic-editor-replace');
    if ((Compatibility::isWordPress5() && ! Compatibility::isClassicalEditorActive()) || (Compatibility::isClassicalEditorActive() && 'block'=== $editor_check )) {
        $embedPressPlugin = new \EmbedPress\Core();
    } else {
        $embedPressPlugin = new \EmbedPress\CoreLegacy();
    }
    $embedPressPlugin->initialize();
}

if (  is_plugin_active('elementor/elementor.php')) {
    $embedPressElements = new \EmbedPress\Elementor\Embedpress_Elementor_Integration();
    $embedPressElements->init();
}
