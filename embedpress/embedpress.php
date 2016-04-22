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

defined('ABSPATH') or die("No direct script access allowed.");

require plugin_dir_path(__FILE__) .'defines.php';
require EMBEDPRESS_INCLUDES_PATH .'/EmbedPress.php';

register_activation_hook(EMBEDPRESS_NAME, array('EmbedPress', 'onPluginActivationCallback'));
register_deactivation_hook(EMBEDPRESS_NAME, array('EmbedPress', 'onPluginDeactivationCallback'));

(new EmbedPress())->run();
