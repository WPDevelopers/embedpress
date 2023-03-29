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

	$post_id = get_the_ID(); 
	$post = get_post($post_id);
	$tags = '';

	if (!empty($_GET['hash'])) {

		$id_value = $_GET['hash'];
		$url = get_the_permalink( $post_id );

		if (class_exists('Elementor\Plugin') && \Elementor\Plugin::$instance->db->is_built_with_elementor(get_the_ID())) {
			
			$page_settings = get_post_meta( $post_id, '_elementor_data', true );
		
			if (preg_match('/{"id":"'.$id_value.'","elType":"widget","settings":{".+?}}/', $page_settings, $match)) {
				$pdf_json = $match[0];
				$pdf_array = json_decode($pdf_json.'}', true);
				
				$title = !empty($pdf_array['settings']['embedpress_pdf_content_title']) ? $pdf_array['settings']['embedpress_pdf_content_title'] : '';

				$description = !empty($pdf_array['settings']['embedpress_pdf_content_descripiton']) ? $pdf_array['settings']['embedpress_pdf_content_descripiton'] : '';

				$image_url = !empty($pdf_array['settings']['embedpress_pdf_content_share_custom_thumbnail']['url']) ? $pdf_array['settings']['embedpress_pdf_content_share_custom_thumbnail']['url'] : '';

				// Search for the regex pattern in the string and extract the href value
				if (!empty($image_url)) {
					$tags .= "<meta name='twitter:image' content='$image_url'/>\n";
					$tags .= "<meta property='og:image' content='$image_url'/>\n";
					$tags .= "<meta property='og:url' content='$url?hash=$id_value'/>\n";
				}
				if (!empty($title)) {
					$tags .= "<meta property='og:title' content='$title'/>\n";
					$tags .= "<meta name='twitter:title' content='$title'/>\n";
				}
				if (!empty($description)) {
					$tags .= "<meta property='og:description' content='$description'/>\n";
					$tags .= "<meta name='twitter:description' content='$description'/>\n";
				}

			}
			
		} else {

			$block_content = $post->post_content;
			print_r($block_content);
			
			// Regular expression to match the id and href keys and their values
			$thumb = '/"id":"' . $id_value . '",".*?"customThumbnail":"(.*?)"/';
			$title = '/"id":"' . $id_value . '",".*?"customTitle":"(.*?)"/';
			$description = '/"id":"' . $id_value . '",".*?"customDescription":"(.*?)"/';

			// Search for the regex pattern in the string and extract the href value
			if (preg_match($thumb, $block_content, $matches1)) {
				$image_url = $matches1[1];
				$tags .= "\n<meta name='twitter:image' content='$image_url'/>\n";
				$tags .= "<meta property='og:image' content='$image_url'/>\n";
				$tags .= "<meta property='og:url' content='$url?hash=$id_value'/>\n";
			}

			if (preg_match($title, $block_content, $matches2)) {
				$title = $matches2[1];
				$tags .= "<meta property='og:title' content='$title'/>\n";
				$tags .= "<meta name='twitter:title' content='$title'/>\n";
			}
			
			if (preg_match($description, $block_content, $matches3)) {	
				$description = $matches3[1];
				$tags .= "<meta property='og:description' content='$description'/>\n";
				$tags .= "<meta name='twitter:description' content='$description'/>\n";
			}
		}
		
		$tags .= "<meta name='twitter:card' content='summary_large_image'/>\n";

		remove_action('wp_head', 'rel_canonical');

		echo $tags;

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
