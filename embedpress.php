<?php
/**
 * Plugin Name: EmbedPress
 * Plugin URI:  https://embedpress.com/
 * Description: EmbedPress lets you embed videos, images, posts, audio, maps and upload PDF, DOC, PPT & all other types of content into your WordPress site with one-click and showcase it beautifully for the visitors. 100+ sources supported.
 * Author: WPDeveloper
 * Author URI: https://wpdeveloper.com
 * Version: 3.3.4
 * Text Domain: embedpress
 * Domain Path: /languages
 *
 * Copyright (c) 2021 WPDeveloper
 *
 * EmbedPress plugin bootstrap file.
 *
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2021 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       1.0.0
 */

use EmbedPress\Compatibility;
use EmbedPress\Core;
use EmbedPress\CoreLegacy;
use EmbedPress\Elementor\Embedpress_Elementor_Integration;
use EmbedPress\Includes\Classes\Feature_Enhancer;
use EmbedPress\Shortcode;

defined('ABSPATH') or die("No direct script access allowed.");

define('EMBEDPRESS_PLUGIN_BASENAME', plugin_basename(__FILE__));
define('EMBEDPRESS_FILE', __FILE__);

define('EMBEDPRESS_PLUGIN_DIR_PATH', plugin_dir_path(__FILE__));
define('EMBEDPRESS_PLUGIN_DIR_URL', plugin_dir_url(__FILE__));
define('EMBEDPRESS_GUTENBERG_DIR_URL', EMBEDPRESS_PLUGIN_DIR_URL.'Gutenberg/');
define('EMBEDPRESS_GUTENBERG_DIR_PATH', EMBEDPRESS_PLUGIN_DIR_PATH.'Gutenberg/');
define('EMBEDPRESS_SETTINGS_ASSETS_URL', EMBEDPRESS_PLUGIN_DIR_URL.'EmbedPress/Ends/Back/Settings/assets/');
define('EMBEDPRESS_SETTINGS_PATH', EMBEDPRESS_PLUGIN_DIR_PATH.'EmbedPress/Ends/Back/Settings/');
define('EMBEDPRESS_PLUGIN_URL', plugins_url('/', __FILE__));

require_once EMBEDPRESS_PLUGIN_DIR_PATH . 'includes.php';

include_once ABSPATH . 'wp-admin/includes/plugin.php';

if ( ! defined('EMBEDPRESS_IS_LOADED')) {
	return;
}


add_action( 'embedpress_cache_cleanup_action', 'embedpress_cache_cleanup' );



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


add_action( 'plugins_loaded', function() {
	do_action( 'embedpress_before_init' );
} );
$editor_check = get_option('classic-editor-replace');
if ((Compatibility::isWordPress5() && ! Compatibility::isClassicalEditorActive()) || (Compatibility::isClassicalEditorActive() && 'block'=== $editor_check )) {
	$embedPressPlugin = new Core();
} else {
	$embedPressPlugin = new CoreLegacy();
}

$embedPressPlugin->initialize();
new Feature_Enhancer();


if (  is_plugin_active('elementor/elementor.php')) {
	$embedPressElements = new Embedpress_Elementor_Integration();
	$embedPressElements->init();
}

Shortcode::register();


if ( !class_exists( '\simple_html_dom') ) {
	include_once EMBEDPRESS_PATH_CORE . 'simple_html_dom.php';
}
global $embedpress_bg_process;
if( class_exists('\EmbedPress\Includes\Classes\EmbedPress_Background_Process') ) {
	$embedpress_bg_process = \EmbedPress\Includes\Classes\EmbedPress_Background_Process::instance();
}

// use \Elementor\Plugin;
// add_action('shutdown', function(){
// 	global $embedpress_bg_process, $wp_roles;
// 	if( $embedpress_bg_process->queue_empty() ) {
// 		$embedpress_bg_process->queuing_start();
// 	}
// 	if( ! $embedpress_bg_process->queue_empty() ) {
// 		$embedpress_bg_process->dispatch();
// 	}

// 	// $collections = $embedpress_bg_process->gutenberg_blocks_count( get_post( 13 ), 13 );

// 	// dump( $collections );

// 	return;
// 	global $wpdb;
// 	$post_types = array_filter(get_post_types( [ 'public' => true ] ), 'bdocs_filtered_types' );
// 	dump( $post_types );
// 	// $post_types = "'" . implode("', '", $post_types) . "'";
// 	// $post_types = implode(", ", $post_types);
// 	// $prepared_query = $wpdb->prepare("SELECT ID from $wpdb->posts WHERE post_type IN ( $post_types ) AND post_status = 'publish' LIMIT 0, 10" );
// 	// $results = $wpdb->get_col( $prepared_query );


// 	$completed_id = implode(',', [ 3867, 3866, 3865, 3864 ]);
// 	// dump( $post_types, false );
// 	// return;

// 	$types = [];
// 	foreach( $post_types as $type ) {
// 		$types[] = "post_type = '%s'";
// 	}
// 	$types_query = implode( ' OR ', $types);
// 	$query = "SELECT ID from $wpdb->posts WHERE ( $types_query ) AND post_status = '%s'";
// 	if( ! empty( $completed_id ) ) {
// 		$query .= " AND ID NOT IN ( $completed_id )";
// 	}
// 	$query .= " LIMIT 0, 20";
// 	$prepared_query = $wpdb->prepare( $query, array_merge( array_keys($post_types), ['publish'] ) );
// 	dump( $prepared_query );

// 	$results = $wpdb->get_col( $prepared_query );

// 	dump( $results );

// 	// $post = get_post(182850);

// 	// $post_types = array_filter(get_post_types( [ 'public' => true ] ), 'betterdocs_filtered_types');
// 	// dump( $post_types );

// 	// preg_match_all('/(wp:embedpress\/([a-z-]+).*)\S/', $post->post_content, $matches);

// 	// $embedpress_gutenberg_block_usages = [
// 	// 	'wp:embedpress/embedpress' => 5
// 	// ];

// 	// if( ! empty( $matches[2] ) ) {
// 	// 	// foreach( $matches[2] )
// 	// 	$array_carry = array_reduce($matches[2], function( $carry, $item ){
// 	// 		$carry[ "wp:embedpress/$item" ] = isset( $carry[ "wp:embedpress/$item" ] ) ? $carry[ "wp:embedpress/$item" ] + 1 : 1;
// 	// 		return $carry;
// 	// 	}, $embedpress_gutenberg_block_usages);
// 	// 	dump( $array_carry );
// 	// }



// });