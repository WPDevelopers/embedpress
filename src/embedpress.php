<?php
/**
 * EmbedPress plugin bootstrap file.
 *
 * @link        https://pressshack.com/embedpress/
 * @package     EmbedPress
 * @author      PressShack <help@pressshack.com>
 * @copyright   Copyright (C) 2017 Open Source Training, LLC. All rights reserved.
 * @license     GPLv2 or later
 * @since       1.0.0
 *
 * @embedpress
 * Plugin Name: EmbedPress
 * Plugin URI:  https://pressshack.com/embedpress/
 * Version:     1.6.3
 * Description: WordPress supports around 35 embed sources, but EmbedPress adds over 40 more, including Facebook, Google Maps, Google Docs, UStream! Just use the URL!
 * Author:      PressShack
 * Author URI:  http://pressshack.com
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
