<?php
/**
 * EmbedPress plugin bootstrap file.
 * TODO
 *
 * @link        TODO
 * @package     EmbedPress
 * @author      OSTraining <support@ostraining.com>
 * @copyright   TODO
 * @license     TODO
 * @since       0.1
 *
 * @embedpress
 * Plugin Name: EmbedPress
 * Plugin URI:  TODO
 * Description: TODO
 * Version:     0.1
 * Author:      OSTraining.com
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
