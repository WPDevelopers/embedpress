<?php
/**
 * Plugin Name: EmbedPress
 * Plugin URI:  https://embedpress.com/
 * Description: WordPress supports around 35 embed sources, but PublishPress Embeds adds over 40 more, including
 * Facebook, Google Maps, Google Docs, UStream! Just use the URL!
 * Author: WPDeveloper
 * Author URI: https://wpdeveloper.net
 * Version: 2.4.0
 * Text Domain: embedpress
 * Domain Path: /languages
 *
 * Copyright (c) 2020 WPDeveloper
 *
 * EmbedPress plugin bootstrap file.
 *
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2020 WPDeveloper. All rights reserved.
 * @license     GPLv2 or later
 * @since       1.0.0
 */

use EmbedPress\Compatibility;

defined('ABSPATH') or die("No direct script access allowed.");

define('EMBEDPRESS_PLUGIN_BASENAME', plugin_basename(__FILE__));
define('EMBEDPRESS_FILE', __FILE__);

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
    if (Compatibility::isWordPress5() && ! Compatibility::isClassicalEditorActive()) {
        $embedPressPlugin = new \EmbedPress\Core();
    } else {
        $embedPressPlugin = new \EmbedPress\CoreLegacy();
    }
    $embedPressPlugin->initialize();
}

add_action('admin_notices',function(){
	if (is_plugin_active('embedpress-pro/embedpress-pro.php')) {
		return;
	}

	$plugin_list = [
		'embedpress-vimeo/embedpress-vimeo.php',
		'embedpress-wistia/embedpress-wistia.php',
		'embedpress-youtube/embedpress-youtube.php',
	];
	$active_plugins = get_option('active_plugins');
	foreach($active_plugins as $plugin){
		if(in_array($plugin,$plugin_list)){
			$msg = '<strong>[Good News]</strong> Introducing <strong>EmbedPress Pro</strong>! And as existing Loyal User you get Unlimited Sites access to EmbedPress Pro for free. Please update and claim your free license to continue. <br/><strong>[<a href="https://embedpress.com/ep-loyal-users" target="_blank" rel="noopener">Details</a>] - [<a href="https://embedpress.com/new-pro-2020-free" target="_blank" rel="noopener">Get EmbedPress Pro for Free</a>]</strong>';
			echo '<div class="notice notice-info is-dismissible">
					<p>'.$msg.'</p>
				</div>';
			break;
		}
	}
});