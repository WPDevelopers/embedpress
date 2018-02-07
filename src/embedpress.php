<?php
/**
 * EmbedPress plugin bootstrap file.
 *
 * @link        https://embedpress.com
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2018 EmbedPress. All rights reserved.
 * @license     GPLv2 or later
 * @since       1.0.0
 *
 * @embedpress
 * Plugin Name: EmbedPress
 * Plugin URI:  https://embedpress.com/
 * Version:     2.0.3b1
 * Description: WordPress supports around 35 embed sources, but PublishPress Embeds adds over 40 more, including Facebook, Google Maps, Google Docs, UStream! Just use the URL!
 * Author:      EmbedPress
 * Author URI:  http://embedpress.com
*/

use \EmbedPress\Core;

require_once plugin_dir_path(__FILE__) .'includes.php';

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

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

$embedPressPlugin = new Core();
$embedPressPlugin->initialize();
