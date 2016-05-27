<?php
/**
 * EmbedPress plugin bootstrap file.
 *
 * @link        https://github.com/OSTraining/EmbedPress
 * @package     EmbedPress
 * @author      OSTraining <support@ostraining.com>
 * @copyright   2016 Open Source Training, LLC, All rights reserved.
 * @license     TODO
 * @since       0.1
 *
 * @embedpress
 * Plugin Name: EmbedPress
 * Plugin URI:  TODO - Will be provided by WordPress team once the plugin package is submited and approved by them.
 * Description: EmbedPress lets you embed anything in WordPress! Also, you can enhance their uniqueness by passing custom parameters to each one of them.
 * Version:     0.1
 * Author:      OSTraining
 * Author URI:  http://www.ostraining.com
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
