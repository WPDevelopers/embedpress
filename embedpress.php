<?php

/**
 * Plugin Name: EmbedPress
 * Plugin URI:  https://embedpress.com/
 * Description: EmbedPress lets you embed videos, images, posts, audio, maps and upload PDF, DOC, PPT & all other types of content into your WordPress site with one-click and showcase it beautifully for the visitors. 150+ sources supported.
 * Author: WPDeveloper
 * Author URI: https://wpdeveloper.com
 * Version: 3.6.7
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
define('EMBEDPRESS_GUTENBERG_DIR_URL', EMBEDPRESS_PLUGIN_DIR_URL . 'Gutenberg/');
define('EMBEDPRESS_GUTENBERG_DIR_PATH', EMBEDPRESS_PLUGIN_DIR_PATH . 'Gutenberg/');
define('EMBEDPRESS_SETTINGS_ASSETS_URL', EMBEDPRESS_PLUGIN_DIR_URL . 'EmbedPress/Ends/Back/Settings/assets/');
define('EMBEDPRESS_SETTINGS_PATH', EMBEDPRESS_PLUGIN_DIR_PATH . 'EmbedPress/Ends/Back/Settings/');
define('EMBEDPRESS_PLUGIN_URL', plugins_url('/', __FILE__));

require_once EMBEDPRESS_PLUGIN_DIR_PATH . 'includes.php';

include_once ABSPATH . 'wp-admin/includes/plugin.php';

if (!defined('EMBEDPRESS_IS_LOADED')) {
	return;
}


add_action('embedpress_cache_cleanup_action', 'embedpress_cache_cleanup');
 





if (!empty($_GET['hash'])) {
	remove_action('wp_head', 'rel_canonical'); 
}

add_action('wp_head', 'generate_social_share_meta');

function generate_social_share_meta()
{
	$post_id = get_the_ID(); // replace with the ID of the post you want to retrieve
	$post = get_post($post_id);
	$block_content = $post->post_content;

	if (!empty($_GET['hash'])) {
		// ID to search for
		$id_value = $_GET['hash'];

		// Regular expression to match the id and href keys and their values
		$regex = '/"id":"' . $id_value . '",".*?"customThumbnail":"(.*?)"/';

		// Search for the regex pattern in the string and extract the href value
		if (preg_match($regex, $block_content, $matches)) {
			// print_r($matches);
			$image_url = $matches[1];

			// $tags = "<meta property='og:title' content='$title'/>";
			// $tags .= "<meta property='og:description' content='$description'/>";
			$tags = "<meta property='og:image' content='$image_url'/>";
			// $tags .= "<meta property='og:url' content='$url'/>";
			$tags .= "<meta name='twitter:card' content='summary_large_image'/>";
			// $tags .= "<meta name='twitter:title' content='$title'/>";
			// $tags .= "<meta name='twitter:description' content='$description'/>";
			$tags .= "<meta name='twitter:image' content='$image_url'/>";

			echo $tags;
		}
	}
}

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


add_action('plugins_loaded', function () {
	do_action('embedpress_before_init');
});
$editor_check = get_option('classic-editor-replace');
if ((Compatibility::isWordPress5() && !Compatibility::isClassicalEditorActive()) || (Compatibility::isClassicalEditorActive() && 'block' === $editor_check)) {
	$embedPressPlugin = new Core();
} else {
	$embedPressPlugin = new CoreLegacy();
}

$embedPressPlugin->initialize();
new Feature_Enhancer();


if (is_plugin_active('elementor/elementor.php')) {
	$embedPressElements = new Embedpress_Elementor_Integration();
	$embedPressElements->init();
}

Shortcode::register();

if (!class_exists('\simple_html_dom')) {
	include_once EMBEDPRESS_PATH_CORE . 'simple_html_dom.php';
}


/**
 * Check is embedpress-pro active
 */
$is_pro_active = false;
if (class_exists('EmbedPress_Licensing')) {
	$is_pro_active = true;
}
