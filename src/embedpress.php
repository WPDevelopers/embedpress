<?php
/**
 * PublishPress Embeds plugin bootstrap file.
 *
 * @link        https://pressshack.com/embedpress/
 * @package     EmbedPress
 * @author      PressShack <help@pressshack.com>
 * @copyright   Copyright (C) 2017 PressShack. All rights reserved.
 * @license     GPLv2 or later
 * @since       1.0.0
 *
 * @embedpress
 * Plugin Name: PublishPress Embeds
 * Plugin URI:  https://pressshack.com/embedpress/
 * Version:     2.0.0
 * Description: PublishPress Embeds provides embeds for major sites, from YouTube and Twitch videos, to Google Maps and Docs, to Soundcloud and Spotify audio files.
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
