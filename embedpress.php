<?php
/**
 * EmbedPress plugin bootstrap file.
 *
 * @link        http://pressshack.com/embedpress/
 * @package     EmbedPress
 * @author      PressShack <help@pressshack.com>
 * @copyright   Copyright (C) 2016 Open Source Training, LLC. All rights reserved.
 * @license     GPLv2 or later
 * @since       1.0
 *
 * @embedpress
 * Plugin Name: EmbedPress
 * Plugin URI:  TODO - Will be provided by WordPress team once the plugin package is submited and approved by them.
 * Description: EmbedPress lets you embed anything in WordPress! Also, you can enhance their uniqueness by passing custom parameters to each one of them.
 * Version:     1.0
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

(new Plugin())->initialize();
