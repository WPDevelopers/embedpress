<?php
/**
 * EmbedPress plugin bootstrap file.
 *
 * @link        http://pressshack.com/embedpress/
 * @package     EmbedPress
 * @author      PressShack <help@pressshack.com>
 * @copyright   Copyright (C) 2016 Open Source Training, LLC. All rights reserved.
 * @license     GPLv2 or later
 * @since       1.0.0
 *
 * @embedpress
 * Plugin Name: EmbedPress
 * Plugin URI:  http://pressshack.com/embedpress/
 * Version:     1.2.0
 * Description: WordPress supports around 35 embed sources, but EmbedPress adds over 40 more, including Facebook, Google Maps, Google Docs, UStream! Just use the URL!
 * Author:      PressShack
 * Author URI:  http://pressshack.com/
*/

use \EmbedPress\Plugin;

require_once plugin_dir_path(__FILE__) .'includes.php';

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

function onPluginActivationCallback()
{
    Plugin::onPluginActivationCallback();
}

function onPluginDeactivationCallback()
{
    Plugin::onPluginDeactivationCallback();
}

register_activation_hook(__FILE__, 'onPluginActivationCallback');
register_deactivation_hook(__FILE__, 'onPluginDeactivationCallback');

$embedPressPlugin = new Plugin();
$embedPressPlugin->initialize();
