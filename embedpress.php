<?php
/**
 * Plugin Name: EmbedPress
 * Plugin URI:  https://embedpress.com/
 * Description: WordPress supports around 35 embed sources, but PublishPress Embeds adds over 40 more, including
 * Facebook, Google Maps, Google Docs, UStream! Just use the URL!
 * Author:EmbedPress
 * Author URI:http://embedpress.com
 * Version: 2.3.3
 * Text Domain: embedpress
 * Domain Path: /languages
 *
 * Copyright (c) 2018 EmbedPress
 *
 * EmbedPress plugin bootstrap file.
 *
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2018 EmbedPress. All rights reserved.
 * @license     GPLv2 or later
 * @since       1.0.0
 */

use EmbedPress\Compatibility;

defined('ABSPATH') or die("No direct script access allowed.");

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
    if (Compatibility::isWordPress5() && ! Compatibility::isClassicalEditorActive()) {
        $embedPressPlugin = new \EmbedPress\Core();
    } else {
        $embedPressPlugin = new \EmbedPress\CoreLegacy();
    }

    $embedPressPlugin->initialize();
}
