<?php

namespace EmbedPress\Includes\Classes;

use EmbedPress\Providers\TemplateLayouts\YoutubeLayout;
use EmbedPress\Shortcode;

use Elementor\Plugin;


if (!defined('ABSPATH')) {
	exit;
} // Exit if accessed directly

class Helper
{

	/**
	 * Parse a query string into an associative array.
	 *
	 * If multiple values are found for the same key, the value of that key
	 * value pair will become an array. This function does not parse nested
	 * PHP style arrays into an associative array (e.g., foo[a]=1&foo[b]=2 will
	 * be parsed into ['foo[a]' => '1', 'foo[b]' => '2']).
	 *
	 * @param string   $str         Query string to parse
	 * @param int|bool $urlEncoding How the query string is encoded
	 *
	 * @return array
	 */

	public function __construct()
	{
		add_action('wp_ajax_lock_content_form_handler', [$this, 'lock_content_form_handler']);
		add_action('wp_ajax_nopriv_lock_content_form_handler', [$this, 'lock_content_form_handler']);


		add_action('wp_ajax_loadmore_data_handler', [$this, 'loadmore_data_handler']);
		add_action('wp_ajax_nopriv_loadmore_data_handler', [$this, 'loadmore_data_handler']);


		add_action('wp_ajax_fetch_video_description', [$this, 'ajax_video_popup_description']);
		add_action('wp_ajax_nopriv_fetch_video_description', [$this, 'ajax_video_popup_description']);
	}

	public function ajax_video_popup_description()
	{
		if (isset($_POST['vid'])) {
			$api_key = self::get_api_key();
			$vid = sanitize_text_field($_POST['vid']);

			$video_data = Helper::get_youtube_video_data($api_key, $vid);

			if ($video_data) {
				ob_start();
				?>
				<div class="video-description">
					<?php echo YoutubeLayout::generate_youtube_video_description($video_data); ?>
				</div>
		<?php
						$description_html = ob_get_clean();
						wp_send_json_success(['description' => $description_html]);
					} else {
						wp_send_json_error(['error' => 'Failed to fetch video data.']);
					}
				} else {
					wp_send_json_error(['error' => 'Invalid video ID.']);
				}
			}

			public static function get_api_key()
			{
				$settings = (array) get_option(EMBEDPRESS_PLG_NAME . ':youtube', []);
				return !empty($settings['api_key']) ? $settings['api_key'] : '';
			}

			public static function parse_query($str, $urlEncoding = true)
			{
				$result = [];

				if ($str === '') {
					return $result;
				}

				if ($urlEncoding === true) {
					$decoder = function ($value) {
						return rawurldecode(str_replace('+', ' ', $value));
					};
				} elseif ($urlEncoding === PHP_QUERY_RFC3986) {
					$decoder = 'rawurldecode';
				} elseif ($urlEncoding === PHP_QUERY_RFC1738) {
					$decoder = 'urldecode';
				} else {
					$decoder = function ($str) {
						return $str;
					};
				}

				foreach (explode('&', $str) as $kvp) {
					$parts = explode('=', $kvp, 2);
					$key = $decoder($parts[0]);
					$value = isset($parts[1]) ? $decoder($parts[1]) : null;
					if (!isset($result[$key])) {
						$result[$key] = $value;
					} else {
						if (!is_array($result[$key])) {
							$result[$key] = [$result[$key]];
						}
						$result[$key][] = $value;
					}
				}

				return $result;
			}
			public static function get_pdf_renderer()
			{
				// $renderer = EMBEDPRESS_URL_ASSETS . 'pdf/web/viewer.html';

				$renderer = admin_url('admin-ajax.php?action=get_viewer');

				// @TODO; apply settings query args here
				return $renderer;
			}

			public static  function get_extension_from_file_url($url)
			{
				$urlSplit = explode(".", $url);
				$ext = end($urlSplit);
				return $ext;
			}

			public static function is_file_url($url)
			{
				$pattern = '/\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/i';
				return preg_match($pattern, $url) === 1;
			}

			public static function is_opensea($url)
			{
				return strpos($url, "opensea.io") !== false;
			}
			public static function is_youtube_channel($url)
			{
				return (bool) (preg_match('~(?:https?:\/\/)?(?:www\.)?(?:youtube.com\/)(?:channel\/|c\/|user\/|@)(\w+)~i', (string) $url));
			}

			public static function is_youtube($url)
			{
				return (bool) (preg_match('~(?:https?://)?(?:www\.)?(?:youtube\.com|youtu\.be)/watch\?v=([^&]+)~i', (string) $url));
			}

			// Saved sources data temporary in wp_options table
			public static function get_source_data($blockid, $source_url, $source_option_name, $source_temp_option_name)
			{


				if (self::is_youtube_channel($source_url)) {
					$source_name = 'YoutubeChannel';
				} else if (self::is_youtube($source_url)) {
					$source_name = 'Youtube';
				} else if (!empty(self::is_file_url($source_url))) {
					$source_name = 'document_' . self::get_extension_from_file_url($source_url);
				} else if (self::is_opensea($source_url)) {
					$source_name  = 'OpenSea';
				} else {
					Shortcode::get_embera_instance();
					$collectios = Shortcode::get_collection();
					$provider = $collectios->findProviders($source_url);

					if (!empty($provider[$source_url])) {
						$source_name = $provider[$source_url]->getProviderName();
					} else {
						$host = parse_url($source_url, PHP_URL_HOST);
						if ($host) {
							$parts = explode('.', $host);
							if (count($parts) > 1) {
								$source_name = $parts[1];
							} else {
								// Handle the case where the host doesn't have at least two parts
								$source_name = $host;
							}
						} else {
							// Handle the case where parse_url fails
							$source_name = 'unknown';
						}
					}
				}

				if (!empty($blockid) && $blockid != 'undefined') {
					$sources = json_decode(get_option($source_temp_option_name), true);

					if (!$sources) {
						$sources = array();
					}
					$exists = false;

					foreach ($sources as $i => $source) {
						if ($source['id'] === $blockid) {
							$sources[$i]['source']['name'] = $source_name;
							$sources[$i]['source']['url'] = $source_url;
							$exists = true;
							break;
						}
					}

					if (!$exists) {
						$sources[] = array('id' => $blockid, 'source' => array('name' => $source_name, 'url' => $source_url, 'count' => 1));
					}

					update_option($source_temp_option_name, json_encode($sources));
				}
			}

			// Saved source data when post updated
			public static function get_save_source_data_on_post_update($source_option_name, $source_temp_option_name)
			{

				if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
					return;
				}
				$temp_data = json_decode(get_option($source_temp_option_name), true);
				$source_data = json_decode(get_option($source_option_name), true);
				if (!$temp_data) {
					$temp_data = array();
				}
				if (!$source_data) {
					$source_data = array();
				}

				$sources = array_merge($temp_data, $source_data);

				$unique_sources = array();
				foreach ($sources as $source) {
					$unique_sources[$source['id']] = $source;
				}

				$unique_sources = array_values($unique_sources);

				delete_option($source_temp_option_name);

				update_option($source_option_name, json_encode($unique_sources));
			}

			//Delete source data from option table when widget is removed
			public static function get_delete_source_data($blockid, $source_option_name, $source_temp_option_name)
			{
				if (!empty($blockid) && $blockid != 'undefined') {
					$sources = json_decode(get_option($source_option_name), true);
					$temp_sources = json_decode(get_option($source_temp_option_name), true);
					if ($sources) {
						foreach ($sources as $i => $source) {
							if ($source['id'] === $blockid) {
								unset($sources[$i]);
								break;
							}
						}
						update_option($source_option_name, json_encode(array_values($sources)));
					}
					if ($temp_sources) {
						foreach ($temp_sources as $i => $source) {
							if ($source['id'] === $blockid) {
								unset($temp_sources[$i]);
								break;
							}
						}
						update_option($source_temp_option_name, json_encode(array_values($temp_sources)));
					}
				}
				wp_die();
			}

			//Delete source temporary data when reload without update or publish
			public static function get_delete_source_temp_data_on_reload($source_temp_option_name)
			{
				$source_temp_data = json_decode(get_option($source_temp_option_name), true);
				if ($source_temp_data) {
					delete_option($source_temp_option_name);
				}
			}

			public static function get_file_title($url)
			{
				return get_the_title(attachment_url_to_postid($url));
			}

			public static function get_hash()
			{
				$hash_key = get_option(EMBEDPRESS_PLG_NAME . '_hash_key');
				if (!$hash_key) {
					$hash_key = wp_hash_password(wp_generate_password(30));
					update_option(EMBEDPRESS_PLG_NAME . '_hash_key', $hash_key);
				}
				return $hash_key;
			}

			public function lock_content_form_handler()
			{

				$client_id = isset($_POST['client_id']) ? sanitize_text_field($_POST['client_id']) : '';
				$password = isset($_POST['password']) ? sanitize_text_field($_POST['password']) : '';
				$post_id = isset($_POST['post_id']) ? absint($_POST['post_id']) : 0;

				$epbase64 = get_post_meta($post_id, 'ep_base_' . $client_id, false);
				$hash_key = get_post_meta($post_id, 'hash_key_' . $client_id, false);

				// Set the decryption key and initialization vector (IV)
				$key = self::get_hash();

				// Decode the base64 encoded cipher
				$cipher = base64_decode($epbase64);
				// Decrypt the cipher using AES-128-CBC encryption

				$wp_pass_key = hash('sha256', wp_salt(32) . md5($password));
				$iv = substr($wp_pass_key, 0, 16);
				if ($wp_pass_key === $hash_key) {
					setcookie("password_correct_", $password, time() + 3600);

					$embed = openssl_decrypt($cipher, 'AES-128-CBC', $key, OPENSSL_RAW_DATA, $iv) . '<script>
		const now = new Date();
		const time = now.getTime();
		const expireTime = time + 1000 * 60 * 60 * 24 * 30;
		now.setTime(expireTime);
		document.cookie = "password_correct_' . esc_js($client_id) . '=' . esc_js($hash_key) . '; expires=" + now.toUTCString() + "; path=/";
	</script>';
				} else {
					$embed = 0;
				}

				// Process the form data and return a response
				$response = array(
					'success' => true,
					'password' => $password,
					'embedHtml' => $embed,
				);

				wp_send_json($response);
			}

			public static function display_password_form($client_id = '', $embedHtml = '', $pass_hash_key = '', $attributes = [])
			{
				$lock_heading = !empty($attributes['lockHeading']) ? sanitize_text_field($attributes['lockHeading']) : '';
				$lock_subheading = !empty($attributes['lockSubHeading']) ? sanitize_text_field($attributes['lockSubHeading']) : '';
				$lock_error_message = !empty($attributes['lockErrorMessage']) ? sanitize_text_field($attributes['lockErrorMessage']) : '';
				$footer_message = !empty($attributes['footerMessage']) ? sanitize_text_field($attributes['footerMessage']) : '';
				$password_placeholder = !empty($attributes['passwordPlaceholder']) ? sanitize_text_field($attributes['passwordPlaceholder']) : '';
				$button_text = !empty($attributes['submitButtonText']) ? sanitize_text_field($attributes['submitButtonText']) : '';
				$unlocking_text = !empty($attributes['submitUnlockingText']) ? sanitize_text_field($attributes['submitUnlockingText']) : '';
				$enable_footer_message = !empty($attributes['enableFooterMessage']) ? sanitize_text_field($attributes['enableFooterMessage']) : '';


				// Set the encryption key and initialization vector (IV)
				$key = self::get_hash();

				$salt = wp_salt(32);
				$wp_hash_key = hash('sha256', $salt . $pass_hash_key);
				$iv = substr($wp_hash_key, 0, 16);


				// Encrypt the plaintext using AES-128-CBC encryption
				$cipher = openssl_encrypt($embedHtml, 'AES-128-CBC', $key, OPENSSL_RAW_DATA, $iv);

				// Base64 encode the encrypted cipher
				$encrypted_data = base64_encode($cipher);

				update_post_meta(get_the_ID(), 'ep_base_' . $client_id, $encrypted_data);
				update_post_meta(get_the_ID(), 'hash_key_' . $client_id, $wp_hash_key);

				$lock_icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><g fill="#6354a5" class="color134563 svgShape"><path d="M46.3 28.7h-3v-6.4C43.3 16.1 38.2 11 32 11c-6.2 0-11.3 5.1-11.3 11.3v6.4h-3v-6.4C17.7 14.4 24.1 8 32 8s14.3 6.4 14.3 14.3v6.4" fill="#6354a5" class="color000000 svgShape"></path><path d="M44.8 55.9H19.2c-2.6 0-4.8-2.2-4.8-4.8V31.9c0-2.6 2.2-4.8 4.8-4.8h25.6c2.6 0 4.8 2.2 4.8 4.8v19.2c0 2.7-2.2 4.8-4.8 4.8zM19.2 30.3c-.9 0-1.6.7-1.6 1.6v19.2c0 .9.7 1.6 1.6 1.6h25.6c.9 0 1.6-.7 1.6-1.6V31.9c0-.9-.7-1.6-1.6-1.6H19.2z" fill="#6354a5" class="color000000 svgShape"></path><path d="M35.2 36.7c0 1.8-1.4 3.2-3.2 3.2s-3.2-1.4-3.2-3.2 1.4-3.2 3.2-3.2 3.2 1.5 3.2 3.2" fill="#6354a5" class="color000000 svgShape"></path><path d="M32.8 36.7h-1.6l-1.6 9.6h4.8l-1.6-9.6" fill="#6354a5" class="color000000 svgShape"></path></g></svg>';

				echo '
		<div class="password-form-container">
			<h2>' . esc_html($lock_heading) . '</h2>
			<p>' . esc_html($lock_subheading) . ' </p>
				<form class="password-form" method="post" class="password-form" data-unlocking-text="' . esc_attr($unlocking_text) . '">

					<div class="password-field">
						<span class="lock-icon">' . $lock_icon . '</span>
						<input type="password" name="pass_' . esc_attr($client_id) . '" placeholder="' . esc_attr($password_placeholder) . '" required>
					</div>
					<input type="hidden" name="ep_client_id" value="' . esc_attr($client_id) . '">
					<input type="hidden" name="post_id" value="' . esc_attr(get_the_ID()) . '">

					<input type="submit" name="password_submit" value="' . esc_attr($button_text) . '">
					<div class="error-message hidden">' . esc_html($lock_error_message) . '</div>
				</form>
				' . (!empty($enable_footer_message) ? '<p class="need-access-message">' . esc_html($footer_message) . '</p>' : '') . '
			</div>
		';
			}

			// Check if the user has already entered the correct password
			public static function is_password_correct($client_id)
			{
				if (isset($_COOKIE['password_correct_' . $client_id])) {
					return $_COOKIE['password_correct_' . $client_id];
				} else {
					return false;
				}
			}

			public static function customLogo($embedHTML, $atts)
			{
				$x = !empty($atts['logoX']) ? $atts['logoX'] : 0;
				$y = !empty($atts['logoY']) ? $atts['logoY'] : 0;
				$uniqid = !empty($atts['url']) ? '.ose-uid-' . md5($atts['url']) : '';

				$brandUrl = !empty($atts['customlogoUrl']) ? $atts['customlogoUrl'] : '';
				$opacity = !empty($atts['logoOpacity']) ? $atts['logoOpacity'] : '';

				$cssClass = !empty($atts['url']) ? '.ose-uid-' . md5($atts['url']) : '.ose-youtube';



				ob_start(); ?>
		<style type="text/css">
			<?php echo esc_html($cssClass); ?> {
				position: relative;
			}

			<?php echo esc_html($cssClass); ?>.watermark {
				border: 0;
				position: absolute;
				bottom: <?php echo esc_html($y); ?>%;
				right: <?php echo esc_html($x); ?>%;
				max-width: 150px;
				max-height: 75px;
				opacity: 0.25;
				z-index: 5;
				-o-transition: opacity 0.5s ease-in-out;
				-moz-transition: opacity 0.5s ease-in-out;
				-webkit-transition: opacity 0.5s ease-in-out;
				transition: opacity 0.5s ease-in-out;
				opacity: <?php echo esc_html($opacity); ?>;
			}

			<?php echo esc_html($cssClass); ?>.watermark:hover {
				opacity: 1;
			}
		</style>
		<?php


				$style = ob_get_clean();

				if (!class_exists('\simple_html_dom')) {
					include_once EMBEDPRESS_PATH_CORE . 'simple_html_dom.php';
				}

				$cta    = '';
				$img = '';

				if (!empty($atts['customlogo'])) {
					$img = '<img src="' . esc_url($atts['customlogo']) . '"/>';

					$imgDom = str_get_html($img);
					$imgDom = $imgDom->find('img', 0);
					$imgDom->setAttribute('class', 'watermark ep-custom-logo');
					$imgDom->removeAttribute('style');
					$imgDom->setAttribute('width', 'auto');
					$imgDom->setAttribute('height', 'auto');
					ob_start();
					echo $imgDom;

					$cta .= ob_get_clean();

					$imgDom->clear();
					unset($img, $imgDom);

					if (!empty($brandUrl)) {
						$cta = '<a href="' . esc_url($brandUrl) . '" target="_blank">' . $cta . '</a>';
					}
					$dom     = str_get_html($embedHTML);

					$wrapDiv = $dom->find($uniqid, 0);

					if (!empty($wrapDiv) && is_object($wrapDiv)) {
						$wrapDiv->innertext .= $cta;
					}

					ob_start();
					echo $wrapDiv;

					$markup = ob_get_clean();

					$dom->clear();
					unset($dom, $wrapDiv);

					$embedHTML = $style . $markup;
				}

				return $embedHTML;
			}


			public static function embed_content_share($content_id = '', $attributes = [])
			{
				$share_position = !empty($attributes['sharePosition']) ? $attributes['sharePosition'] : 'right';
				$custom_thumnail = !empty($attributes['customThumbnail']) ? $attributes['customThumbnail'] : '';
				$custom_title = !empty($attributes['customTitle']) ? $attributes['customTitle'] : '';
				$custom_description = !empty($attributes['customDescription']) ? $attributes['customDescription'] : '';

				// Create a unique hash based on content attributes
				$content_hash = md5($custom_thumnail . $custom_title . $custom_description . $content_id);

				// Encode for URL usage
				$custom_thumnail = urlencode($custom_thumnail);
				$custom_title = urlencode($custom_title);
				$custom_description = urlencode($custom_description);

				// Get social share options with defaults
				$facebook_enabled = isset($attributes['shareFacebook']) ? $attributes['shareFacebook'] !== false : true;
				$twitter_enabled = isset($attributes['shareTwitter']) ? $attributes['shareTwitter'] !== false : true;
				$pinterest_enabled = isset($attributes['sharePinterest']) ? $attributes['sharePinterest'] !== false : true;
				$linkedin_enabled = isset($attributes['shareLinkedin']) ? $attributes['shareLinkedin'] !== false : true;
				$style = isset($attributes['width']) ? 'style="max-width: '.esc_attr($attributes['width']).'px;"' : '';


				$page_url = urlencode(get_permalink() . '?hash=' . $content_id . '&unique=' . $content_hash);

				$social_icons = '<div class="ep-social-share-wraper"'.$style.' ><div class="ep-social-share share-position-' . esc_attr($share_position) . '">';


				// Facebook
				if ($facebook_enabled) {
					$social_icons .= '<a href="https://www.facebook.com/sharer/sharer.php?u=' . $page_url . '" class="ep-social-icon facebook" target="_blank">
			<svg width="64px" height="64px" fill="#000000" viewBox="0 -6 512 512" xmlns="http://www.w3.org/2000/svg">
			<path d="M0 0h512v500H0z" fill="#475a96"/>
			<path d="m375.72 112.55h-237.43c-8.137 0-14.73 6.594-14.73 14.73v237.43c0 8.135 6.594 14.73 14.73 14.73h127.83v-103.36h-34.781v-40.28h34.781v-29.705c0-34.473 21.055-53.244 51.807-53.244 14.73 0 27.391 1.097 31.08 1.587v36.026l-21.328 0.01c-16.725 0-19.963 7.947-19.963 19.609v25.717h39.887l-5.193 40.28h-34.693v103.36h68.012c8.135 0 14.73-6.596 14.73-14.73v-237.43c-1e-3 -8.137-6.596-14.73-14.731-14.73z" fill="#fff"/>
			</svg>
			</a>';
				}

				// Twitter
				if ($twitter_enabled) {
					$social_icons .= '<a href="https://twitter.com/intent/tweet?url=' . $page_url . '&text=' . $custom_title . '" class="ep-social-icon twitter" target="_blank">
				<svg viewBox="0 0 24 24" aria-hidden="true" fill="#fff" class="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-lrsllp r-1nao33i r-16y2uox r-8kz0gk"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g></svg>
			</a>';
				}

				// Pinterest
				if ($pinterest_enabled) {
					$social_icons .= '<a href="http://pinterest.com/pin/create/button/?url=' . $page_url . '&media=' . $custom_thumnail . '&description=' . $custom_description . '" class="ep-social-icon pinterest" target="_blank">

				<svg xmlns="http://www.w3.org/2000/svg" height="800" width="1200" viewBox="-36.42015 -60.8 315.6413 364.8"><path d="M121.5 0C54.4 0 0 54.4 0 121.5 0 173 32 217 77.2 234.7c-1.1-9.6-2-24.4.4-34.9 2.2-9.5 14.2-60.4 14.2-60.4s-3.6-7.3-3.6-18c0-16.9 9.8-29.5 22-29.5 10.4 0 15.4 7.8 15.4 17.1 0 10.4-6.6 26-10.1 40.5-2.9 12.1 6.1 22 18 22 21.6 0 38.2-22.8 38.2-55.6 0-29.1-20.9-49.4-50.8-49.4-34.6 0-54.9 25.9-54.9 52.7 0 10.4 4 21.6 9 27.7 1 1.2 1.1 2.3.8 3.5-.9 3.8-3 12.1-3.4 13.8-.5 2.2-1.8 2.7-4.1 1.6-15.2-7.1-24.7-29.2-24.7-47.1 0-38.3 27.8-73.5 80.3-73.5 42.1 0 74.9 30 74.9 70.2 0 41.9-26.4 75.6-63 75.6-12.3 0-23.9-6.4-27.8-14 0 0-6.1 23.2-7.6 28.9-2.7 10.6-10.1 23.8-15.1 31.9 11.4 3.5 23.4 5.4 36 5.4 67.1 0 121.5-54.4 121.5-121.5C243 54.4 188.6 0 121.5 0z" fill="#fff"/></svg>

			</a>';
				}

				// LinkedIn
				if ($linkedin_enabled) {
					$social_icons .= '<a href="https://www.linkedin.com/shareArticle?mini=true&url=' . $page_url. '" class="ep-social-icon linkedin" target="_blank">

			<svg fill="#ffffff" height="800px" width="800px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
				viewBox="0 0 310 310" xml:space="preserve">
			<g id="XMLID_801_">
				<path id="XMLID_802_" d="M72.16,99.73H9.927c-2.762,0-5,2.239-5,5v199.928c0,2.762,2.238,5,5,5H72.16c2.762,0,5-2.238,5-5V104.73
					C77.16,101.969,74.922,99.73,72.16,99.73z"/>
				<path id="XMLID_803_" d="M41.066,0.341C18.422,0.341,0,18.743,0,41.362C0,63.991,18.422,82.4,41.066,82.4
					c22.626,0,41.033-18.41,41.033-41.038C82.1,18.743,63.692,0.341,41.066,0.341z"/>
				<path id="XMLID_804_" d="M230.454,94.761c-24.995,0-43.472,10.745-54.679,22.954V104.73c0-2.761-2.238-5-5-5h-59.599
					c-2.762,0-5,2.239-5,5v199.928c0,2.762,2.238,5,5,5h62.097c2.762,0,5-2.238,5-5v-98.918c0-33.333,9.054-46.319,32.29-46.319
					c25.306,0,27.317,20.818,27.317,48.034v97.204c0,2.762,2.238,5,5,5H305c2.762,0,5-2.238,5-5V194.995
					C310,145.43,300.549,94.761,230.454,94.761z"/>
			</g>
			</svg>
		</a>';
				}

				$social_icons .= '</div></div>';

				return $social_icons;
			}

			public static function ep_get_elementor_widget_settings($page_settings = '', $id = '', $widgetType = '') {
				if (empty($page_settings)) {
					return [];
				}

				$data = json_decode($page_settings, true);
				$element_setting =  null;

				Plugin::$instance->db->iterate_data($data, function ($element) use (&$element_setting, $widgetType, $id) {

					if ($element['id'] == $id && $element['elType'] == 'widget' && $element['widgetType'] == $widgetType) {
						$element_setting[] = $element['settings'];
					}

				});

				return $element_setting;
			}



			public static function ep_get_popup_icon()
			{
				$svg = '<div class="ep-doc-popup-icon" ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" xml:space="preserve"><path fill="#fff" d="M5 3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-6l-2-2v8H5V5h8l-2-2H5zm9 0 2.7 2.7-7.5 7.5 1.7 1.7 7.5-7.5L21 10V3h-7z"/><path style="fill:none" d="M0 0h24v24H0z"/></svg></div>';

				return $svg;
			}
			public static function ep_get_download_icon()
			{
				$svg = '<div class="ep-doc-download-icon" ><svg width="25" height="25" viewBox="0 0 0.6 0.6" xmlns="http://www.w3.org/2000/svg"><path fill="#fff" fill-rule="evenodd" d="M.525.4A.025.025 0 0 1 .55.422v.053A.075.075 0 0 1 .479.55H.125A.075.075 0 0 1 .05.479V.425A.025.025 0 0 1 .1.422v.053A.025.025 0 0 0 .122.5h.353A.025.025 0 0 0 .5.478V.425A.025.025 0 0 1 .525.4ZM.3.05a.025.025 0 0 1 .025.025v.24L.357.283A.025.025 0 0 1 .39.281l.002.002a.025.025 0 0 1 .002.033L.392.318.317.393.316.394.314.395.311.397.308.398.305.399.301.4H.295L.292.399.289.398.287.397.285.395A.025.025 0 0 1 .283.393L.208.318A.025.025 0 0 1 .241.281l.002.002.032.032v-.24A.025.025 0 0 1 .3.05Z"/></svg></div>';

				return $svg;
			}

			public static function ep_get_print_icon()
			{
				$svg = '<div class="ep-doc-print-icon" ><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24">
		<path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" fill="#fff"/>
		</svg></div>';

				return $svg;
			}

			public static function ep_get_fullscreen_icon()
			{
				$svg = '<div class="ep-doc-fullscreen-icon"><svg width="25" height="25" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<path d="m3 15 .117.007a1 1 0 0 1 .876.876L4 16v4h4l.117.007a1 1 0 0 1 0 1.986L8 22H3l-.117-.007a1 1 0 0 1-.876-.876L2 21v-5l.007-.117a1 1 0 0 1 .876-.876L3 15Zm18 0a1 1 0 0 1 .993.883L22 16v5a1 1 0 0 1-.883.993L21 22h-5a1 1 0 0 1-.117-1.993L16 20h4v-4a1 1 0 0 1 .883-.993L21 15ZM8 2a1 1 0 0 1 .117 1.993L8 4H4v4a1 1 0 0 1-.883.993L3 9a1 1 0 0 1-.993-.883L2 8V3a1 1 0 0 1 .883-.993L3 2h5Zm13 0 .117.007a1 1 0 0 1 .876.876L22 3v5l-.007.117a1 1 0 0 1-.876.876L21 9l-.117-.007a1 1 0 0 1-.876-.876L20 8V4h-4l-.117-.007a1 1 0 0 1 0-1.986L16 2h5Z" fill="#fff"/>
	  	</svg></div>';

				return $svg;
			}
			public static function ep_get_minimize_icon()
			{
				$svg = '<div class="ep-doc-minimize-icon" style="display:none"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" style="enable-background:new 0 0 385.331 385.331" xml:space="preserve" width="20" height="20"><path fill="#fff" d="M13.751 8.131h5.62c0.355 0 0.619 -0.28 0.619 -0.634 0 -0.355 -0.265 -0.615 -0.619 -0.614h-4.995V1.878c0 -0.355 -0.27 -0.624 -0.624 -0.624s-0.624 0.27 -0.624 0.624v5.62c0 0.002 0.001 0.003 0.001 0.004 0 0.002 -0.001 0.003 -0.001 0.005 0 0.348 0.276 0.625 0.624 0.624zM6.244 1.259c-0.354 0 -0.614 0.265 -0.614 0.619v4.995H0.624c-0.355 0 -0.624 0.27 -0.624 0.624 0 0.355 0.27 0.624 0.624 0.624h5.62c0.002 0 0.003 -0.001 0.004 -0.001 0.002 0 0.003 0.001 0.005 0.001 0.348 0 0.624 -0.276 0.624 -0.624V1.878c0 -0.354 -0.28 -0.619 -0.634 -0.619zm0.005 10.61H0.629c-0.355 0.001 -0.619 0.28 -0.619 0.634 0 0.355 0.265 0.615 0.619 0.614h4.995v5.005c0 0.355 0.27 0.624 0.624 0.624 0.355 0 0.624 -0.27 0.624 -0.624V12.502c0 -0.002 -0.001 -0.003 -0.001 -0.004 0 -0.002 0.001 -0.003 0.001 -0.005 0 -0.348 -0.276 -0.624 -0.624 -0.624zm13.127 0H13.756c-0.002 0 -0.003 0.001 -0.004 0.001 -0.002 0 -0.003 -0.001 -0.005 -0.001 -0.348 0 -0.624 0.276 -0.624 0.624v5.62c0 0.355 0.28 0.619 0.634 0.619 0.354 0.001 0.614 -0.265 0.614 -0.619v-4.995H19.376c0.355 0 0.624 -0.27 0.624 -0.624s-0.27 -0.624 -0.624 -0.625z"/><g/><g/><g/><g/><g/><g/></svg></div>';

				return $svg;
			}
			public static function ep_get_draw_icon()
			{
				$svg = '<div class="ep-doc-draw-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m15 7.5 2.5 2.5m-10 10L19.25 8.25c0.69 -0.69 0.69 -1.81 0 -2.5v0c-0.69 -0.69 -1.81 -0.69 -2.5 0L5 17.5V20h2.5Zm0 0h8.379C17.05 20 18 19.05 18 17.879v0c0 -0.563 -0.224 -1.103 -0.621 -1.5L17 16M4.5 5c2 -2 5.5 -1 5.5 1 0 2.5 -6 2.5 -6 5 0 0.876 0.533 1.526 1.226 2" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>';

				return $svg;
			}

			public static function get_insta_video_icon()
			{
				$svg = '<svg class="insta-video-icon" aria-label="Clip" class="x1lliihq x1n2onr6" color="#FFF" fill="#FFF" height="20" viewBox="1.111 1.111 24.444 24.447" width="20">
		<path d="m14.248 1.111 3.304 5.558h-6.2L8.408 1.146c.229-.014.466-.024.713-.03l.379-.005Zm2.586 0h.331c3.4 0 4.964.838 6.267 2.097a6.674 6.674 0 0 1 1.773 3.133l.078.328H20.14l-3.307-5.558ZM6.093 1.53l2.74 5.139H1.382a6.678 6.678 0 0 1 4.38-5.033ZM16.91 15.79l-5.05-2.916a1.01 1.01 0 0 0-1.507.742l-.009.133v5.831a1.011 1.011 0 0 0 1.394.933l.121-.059 5.05-2.916a1.01 1.01 0 0 0 .111-1.674l-.111-.076-5.05-2.916ZM1.132 8.891h24.404l.017.4.003.21v7.666c0 3.401-.839 4.966-2.098 6.267-1.279 1.238-2.778 2.062-5.922 2.121l-.371.003H9.501c-3.4 0-4.963-.839-6.267-2.099-1.238-1.278-2.06-2.776-2.12-5.922l-.003-.37V9.501l.003-.21Z" fill-rule="evenodd" /></svg>';

				return $svg;
			}

			public static function get_insta_image_carousel_icon()
			{
				$svg = '<svg aria-label="Carousel" class="x1lliihq x1n2onr6" color="#FFF" fill="#FFF" height="25" viewBox="0 0 43.636 43.636" width="25">
		<path d="M31.636 27V10a4.695 4.695 0 0 0-4.727-4.727H10A4.695 4.695 0 0 0 5.273 10v17A4.695 4.695 0 0 0 10 31.727h17c2.545-.091 4.636-2.182 4.636-4.727zm4-13.364v14.636c0 4.091-3.364 7.455-7.455 7.455H13.545c-.545 0-.818.636-.455 1 .909 1 2.182 1.636 3.727 1.636h12.182a9.35 9.35 0 0 0 9.364-9.364V16.818a5.076 5.076 0 0 0-1.636-3.727c-.455-.364-1.091 0-1.091.545z" /></svg>';

				return $svg;
			}

			public static function get_insta_image_icon()
			{
				$svg = '<svg width="22" height="22" viewBox="0 0 0.6 0.6" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M.175.05A.125.125 0 0 0 .05.175v.25A.125.125 0 0 0 .175.55h.25A.125.125 0 0 0 .55.425v-.25A.125.125 0 0 0 .425.05h-.25ZM.2.225a.025.025 0 1 1 .05 0 .025.025 0 0 1-.05 0ZM.225.15a.075.075 0 1 0 0 .15.075.075 0 0 0 0-.15Zm.138.205A.025.025 0 0 1 .398.351l.048.042A.025.025 0 1 0 .479.355L.43.312a.075.075 0 0 0-.107.011l-.04.05a.024.024 0 0 1-.032.005.074.074 0 0 0-.099.015L.118.432a.025.025 0 0 0 .038.033l.035-.04A.024.024 0 0 1 .223.42.074.074 0 0 0 .322.405l.04-.05Z" fill="#fff"/></svg>';

				return $svg;
			}

			public static function get_insta_like_icon()
			{
				$svg = '<svg version="1.1" id="Uploaded to svgrepo.com" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 0.8 0.8" xml:space="preserve"><path d="M.225.25C.225.264.214.275.2.275S.175.264.175.25.186.225.2.225.225.236.225.25zM.75.3C.75.453.589.582.485.65a1.06 1.06 0 0 1-.073.044.025.025 0 0 1-.024 0A1.049 1.049 0 0 1 .315.65C.211.582.05.453.05.3a.2.2 0 0 1 .2-.2.199.199 0 0 1 .15.068A.199.199 0 0 1 .55.1a.2.2 0 0 1 .2.2zM.25.25a.05.05 0 1 0-.1 0 .05.05 0 0 0 .1 0z" style="fill:#fff"/></svg>';

				return $svg;
			}
			public static function get_insta_comment_icon()
			{
				$svg = '<svg fill="#fff" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 2.5 2.5" xml:space="preserve"><path d="M2.374.446a.063.063 0 0 0-.061-.057H.991a.063.063 0 0 0-.063.057H.927v.328h.559c.029 0 .053.022.056.051h.001v.731h.275l.162.162a.063.063 0 0 0 .116-.035v-.127h.217a.063.063 0 0 0 .06-.051h.002V.446h-.001z"/><path d="M1.361.899H.18A.056.056 0 0 0 .125.95v.946h.001a.057.057 0 0 0 .054.045h.194v.113a.057.057 0 0 0 .104.032l.145-.145h.738c.027 0 .05-.02.056-.045h.001V.95h-.001a.056.056 0 0 0-.056-.051z"/></svg>';

				return $svg;
			}
			public static function get_instagram_icon()
			{
				$svg = '<svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" xml:space="preserve" width="1285" height="400"><style>.st0{fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10}</style><path class="st0" d="M14.375 19.375h-8.75c-2.75 0-5-2.25-5-5v-8.75c0-2.75 2.25-5 5-5h8.75c2.75 0 5 2.25 5 5v8.75c0 2.75-2.25 5-5 5z"/><path class="st0" d="M14.375 10A4.375 4.375 0 0 1 10 14.375 4.375 4.375 0 0 1 5.625 10a4.375 4.375 0 0 1 8.75 0zm1.25-5.625A.625.625 0 0 1 15 5a.625.625 0 0 1-.625-.625.625.625 0 0 1 1.25 0z"/></svg>';

				return $svg;
			}

			public static function get_google_presentation_url($embedded_url)
			{
				$parsed_url = parse_url($embedded_url);
				$base_url = $parsed_url['scheme'] . '://' . $parsed_url['host'] . $parsed_url['path'];
				$base_url = strtok($base_url, '?');
				$base_url = rtrim($base_url, '/');
				return $base_url;
			}

			public static function check_media_format($url)
			{
				$pattern1 = '/\.(mp4|mov|avi|wmv|flv|mkv|webm|mpeg|mpg)$/i';
				$pattern2 = '/\.(mp3|wav|ogg|aac)$/i';

				$isVideo = preg_match($pattern1, $url);
				$isAudio = preg_match($pattern2, $url);

				$is_self_hosted = false;
				$format = '';

				if (!empty($isVideo) || !empty($isAudio)) {
					$is_self_hosted = true;
					if (!empty($isVideo)) {
						$format = 'video';
					} else if (!empty($isAudio)) {
						$format = 'audio';
					}
				}

				if (!$is_self_hosted) {
					return [
						'selhosted' => false,
					];
				}

				return [
					'selhosted' => true,
					'format' => $format,
				];
			}

			// Ajax Methods get instagram feed data
			public function loadmore_data_handler()
			{
				$connected_account_type = isset($_POST['connected_account_type']) ? sanitize_text_field($_POST['connected_account_type']) : 'personal';
				$hashtag_id = isset($_POST['hashtag_id']) ? sanitize_text_field($_POST['hashtag_id']) : '';
				$feed_type = isset($_POST['feed_type']) ? sanitize_text_field($_POST['feed_type']) : 'user_aacount_type';
				$user_id = isset($_POST['user_id']) ? sanitize_text_field($_POST['user_id']) : '';
				$loadmore_key = isset($_POST['loadmore_key']) ? sanitize_text_field($_POST['loadmore_key']) : '';
				$nonce = isset($_POST['_nonce']) ? sanitize_text_field($_POST['_nonce']) : '';
				$params = isset($_POST['params']) ? sanitize_text_field($_POST['params']) : '';
				// $params = json_decode($params, true);
				$params = stripslashes($params); // Remove extra backslashes
				$params = json_decode($params, true);

				// Verify nonce
				if (!wp_verify_nonce($nonce, 'ep_nonce')) {
					wp_send_json_error('Invalid nonce');
					wp_die(); // Terminate script execution if nonce is invalid
				}

				$feeds_data = get_option('ep_instagram_feed_data');
				$user_data = $feeds_data[$user_id]['feed_userinfo'];

				if ($feed_type == 'hashtag_type') {
					$feeds_data = get_option('ep_instagram_hashtag_feed');
				}


				$profile_picture_url = isset($user_data['profile_picture_url']) ? $user_data['profile_picture_url'] : '';

				if ($feed_type === 'user_account_type' && isset($feeds_data[$loadmore_key]['feed_posts'])) {
					$feed_posts = $feeds_data[$loadmore_key]['feed_posts'];
				} else if ($feed_type === 'hashtag_type' && isset($feeds_data[$loadmore_key])) {
					$feed_posts = $feeds_data[$loadmore_key];
				} else {
					$feed_posts = ['error'];
				}


				if (is_array($feed_posts) && count($feed_posts) > 0) {
					$loaded_posts = isset($_POST['loaded_posts']) ? intval($_POST['loaded_posts']) : 0;
					$posts_per_page = isset($_POST['posts_per_page']) ? intval($_POST['posts_per_page']) : 0;

					$post_index = $loaded_posts + 1;
					$start_index = $loaded_posts;

					$next_posts = array_slice($feed_posts, $start_index, $posts_per_page);

					ob_start();

					if (is_array($next_posts) && count($next_posts) > 0) :
						foreach ($next_posts as $post) :
							$caption = !empty($post['caption']) ? $post['caption'] : '';
							$media_type = !empty($post['media_type']) ? $post['media_type'] : '';
							$media_url = !empty($post['media_url']) ? $post['media_url'] : '';
							$permalink = !empty($post['permalink']) ? $post['permalink'] : '';
							$timestamp = !empty($post['timestamp']) ? $post['timestamp'] : '';
							$username = !empty($post['username']) ? $post['username'] : '';
							$like_count = !empty($post['like_count']) ? $post['like_count'] : 0;
							$comments_count = !empty($post['comments_count']) ? $post['comments_count'] : 0;

							$post['profile_picture_url'] = $profile_picture_url;
							$post['show_likes_count'] = isset($params['show_likes_count']) ? $params['show_likes_count'] : false;
							$post['show_comments_count'] = isset($params['show_comments_count']) ? $params['show_comments_count'] : false;
							$post['popup_follow_button'] = isset($params['popup_follow_button']) ? $params['popup_follow_button'] : true;
							$post['popup_follow_button_text'] = isset($params['popup_follow_button_text']) ? $params['popup_follow_button_text'] : 'Follow';
							?>

					<div class="insta-gallery-item cg-carousel__slide js-carousel__slide" data-insta-postid="<?php echo esc_attr($post['id']) ?>" data-postindex="<?php echo esc_attr($post_index); ?>" data-postdata="<?php echo htmlspecialchars(json_encode($post), ENT_QUOTES, 'UTF-8'); ?>" data-media-type="<?php echo esc_attr($media_type); ?>">
						<?php

											if (!empty($hashtag_id) && $media_type == 'CAROUSEL_ALBUM') {
												if (isset($post['children']['data'][0]['media_url'])) {
													$hashtag_media_url = $post['children']['data'][0]['media_url'];
													$hashtag_media_type = $post['children']['data'][0]['media_type'];

													if ($hashtag_media_type == 'VIDEO') {
														echo '<video class="insta-gallery-image" src="' . esc_url($hashtag_media_url) . '"></video>';
													} else {
														echo ' <img class="insta-gallery-image" src="' . esc_url($hashtag_media_url) . '" alt="' . esc_attr('image') . '">';
													}
												}
											} else {
												if ($media_type == 'VIDEO') {
													echo '<video class="insta-gallery-image" src="' . esc_url($media_url) . '"></video>';
												} else {
													echo ' <img class="insta-gallery-image" src="' . esc_url($media_url) . '" alt="' . esc_attr('image') . '">';
												}
											}
											?>

						<div class="insta-gallery-item-type">
							<div class="insta-gallery-item-type-icon">
								<?php
													if ($media_type == 'VIDEO') {
														echo Helper::get_insta_video_icon();
													} else if ($media_type == 'CAROUSEL_ALBUM') {
														echo Helper::get_insta_image_carousel_icon();
													} else {
														echo Helper::get_insta_image_icon();
													}
													?>
							</div>
						</div>
						<div class="insta-gallery-item-info">
							<?php if (strtolower($connected_account_type) === 'business') : ?>
								<div class="insta-item-reaction-count">
									<div class="insta-gallery-item-likes">
										<?php echo Helper::get_insta_like_icon();
																echo esc_html($like_count); ?>
									</div>
									<div class="insta-gallery-item-comments">
										<?php echo Helper::get_insta_comment_icon();
																echo esc_html($comments_count); ?>
									</div>
								</div>
							<?php else : ?>
								<div class="insta-gallery-item-permalink">
									<?php echo Helper::get_instagram_icon(); ?>
								</div>
							<?php endif; ?>
						</div>
					</div>

<?php $post_index++;
				endforeach;
			endif;

			$feed_item = ob_get_clean();

			$next_start_index = $start_index + count($next_posts);

			wp_send_json(array(
				'html' => $feed_item,
				'next_post_index' => $next_start_index,
				'total_feed_posts' => count($feed_posts)
			));
		} else {
			wp_send_json('');
		}
	}

	public static function getCalendlyUuid($url)
	{
		$pattern = '/\/([0-9a-fA-F-]+)$/';
		if (preg_match($pattern, $url, $matches)) {
			$uuid = $matches[1];
			return $uuid;
		}
		return '';
	}

	public static function getCalendlyUserInfo($access_token)
	{
		$transient_name = 'calendly_user_info_' . $access_token;
		$user_info = get_transient($transient_name);
		if (false === $user_info) {
			$user_endpoint = 'https://api.calendly.com/users/me';
			$headers = array(
				'Authorization' => "Bearer $access_token",
				'Content-Type' => 'application/json',
			);
			$args = array(
				'headers' => $headers,
			);
			$response = wp_remote_get($user_endpoint, $args);
			if (!is_wp_error($response) && 200 === wp_remote_retrieve_response_code($response)) {
				$user_info = wp_remote_retrieve_body($response);
				set_transient($transient_name, $user_info, 3600);
			} else {
				return false;
			}
		}

		return $user_info;
	}



	public static function getCalaendlyEventTypes($user_uri, $access_token)
	{
		// Attempt to retrieve the data from the transient
		$events_list = get_transient('calendly_events_list_' . md5($access_token));

		if (false === $events_list) {
			// If the data is not in the transient, fetch it from the API
			$events_endpoint = "https://api.calendly.com/event_types?user=$user_uri";

			$headers = array(
				'Authorization' => "Bearer $access_token",
				'Content-Type' => 'application/json',
			);

			$args = array(
				'headers' => $headers,
			);

			$response = wp_remote_get($events_endpoint, $args);

			if (!is_wp_error($response)) {
				$body = wp_remote_retrieve_body($response);
				$events_list = json_decode($body, true);

				// Store the data in a transient for a specified time (e.g., 1 hour)
				set_transient('calendly_events_list', $events_list, HOUR_IN_SECONDS);

				return $events_list;
			}
		}

		return $events_list;
	}

	public static function getListEventInvitee($uuid, $access_token)
	{
		// Attempt to retrieve the data from the transient
		$invitee_list = get_transient('calendly_invitee_list_' . md5($access_token));

		if (false === $invitee_list) {
			// If the data is not in the transient, fetch it from the API
			$events_endpoint = "https://api.calendly.com/scheduled_events/$uuid/invitees";

			$headers = array(
				'Authorization' => "Bearer $access_token",
				'Content-Type' => 'application/json',
			);

			$args = array(
				'headers' => $headers,
			);

			$response = wp_remote_get($events_endpoint, $args);

			if (!is_wp_error($response)) {
				$body = wp_remote_retrieve_body($response);
				$invitee_list = json_decode($body, true);

				// Store the data in a transient for a specified time (e.g., 1 hour)
				set_transient('calendly_invitee_list', $invitee_list, HOUR_IN_SECONDS);

				return $invitee_list;
			}
		}

		return $invitee_list;
	}

	public static function getCalaendlyScheduledEvents($user_uri, $access_token)
	{
		// Attempt to retrieve the data from the transient
		$events_list = get_transient('calendly_events_list_' . md5($access_token));

		if (false === $events_list) {
			// If the data is not in the transient, fetch it from the API
			$events_endpoint = "https://api.calendly.com/scheduled_events?user=$user_uri";

			$headers = array(
				'Authorization' => "Bearer $access_token",
				'Content-Type' => 'application/json',
			);

			$args = array(
				'headers' => $headers,
			);

			$response = wp_remote_get($events_endpoint, $args);

			if (!is_wp_error($response)) {
				$body = wp_remote_retrieve_body($response);
				$events_list = json_decode($body, true);

				// Store the data in a transient for a specified time (e.g., 1 hour)
				set_transient('calendly_events_list', $events_list, HOUR_IN_SECONDS);

				return $events_list;
			}
		}

		return $events_list;
	}


	public static function parseDuration($durationString)
	{
		list($minutes, $seconds) = explode(':', $durationString);
		return intval($minutes) * 60 + intval($seconds);
	}




	public static function is_pro_active()
	{
		if (defined('EMBEDPRESS_SL_ITEM_SLUG')) {
			return true;
		}
		return false;
	}


	public static function getInstagramUserInfo($accessToken, $accountType, $userId, $is_sync = false)
	{
		if ($is_sync) {
			// If $is_sync is true, don't use transient
			$use_transient = false;
		} else {
			// If $is_sync is false, use transient
			$transient_key = 'instagram_user_info_' . $userId;
			$use_transient = true;
		}

		if ($use_transient && false !== ($userInfo = get_transient($transient_key))) {
			// If transient exists, return cached user info
			return $userInfo;
		}

		if (strtolower($accountType) === 'business') {
			$api_url = 'https://graph.facebook.com/' . $userId . '?fields=biography,id,username,website,followers_count,media_count,profile_picture_url,name&access_token=' . $accessToken;
		} else {
			$api_url = "https://graph.instagram.com/me?fields=id,username,account_type,media_count,followers_count,biography,website&access_token={$accessToken}";
		}

		$connected_account_type = $accountType;

		$userInfoResponse = wp_remote_get($api_url);

		if (is_wp_error($userInfoResponse)) {
			echo 'Error: Unable to retrieve Instagram user information.';
		} else {
			$userInfoBody = wp_remote_retrieve_body($userInfoResponse);
			$userInfo = json_decode($userInfoBody, true);

			$userInfo['connected_account_type'] = $connected_account_type;
			$userInfo['access_token'] = $accessToken;


			if (!isset($userInfo['profile_picture_url'])) {
				$userInfo['profile_picture_url'] = '';
			}

			// If not using transient, cache the user info for an hour
			if ($use_transient) {
				set_transient($transient_key, $userInfo, HOUR_IN_SECONDS);
			}

			return $userInfo;
		}
	}


	// Get Instagram posts, videos, reels
	public static function getInstagramPosts($access_token, $account_type, $userId, $limit = 100, $is_sync = false)
	{
		if ($is_sync) {
			// If $is_sync is true, don't use transient
			$use_transient = false;
		} else {
			// If $is_sync is false, use transient
			$transient_key = 'instagram_posts_' . $userId;
			$use_transient = true;
		}

		if ($use_transient && false !== ($posts = get_transient($transient_key))) {
			// If transient exists, return cached posts
			return $posts;
		}

		if (strtolower($account_type) === 'business') {
			$api_url = 'https://graph.facebook.com/v17.0/' . $userId . '/media?fields=media_url,media_product_type,thumbnail_url,caption,id,media_type,timestamp,username,comments_count,like_count,permalink,children%7Bmedia_url,id,media_type,timestamp,permalink,thumbnail_url%7D&limit=' . $limit . '&access_token=' . $access_token;
		} else {
			$api_url = "https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,children{media_url,id,media_type},permalink,timestamp,username,thumbnail_url&limit=$limit&access_token=$access_token";
		}

		$postsResponse = wp_remote_get($api_url);

		if (is_wp_error($postsResponse)) {
			echo 'Error: Unable to retrieve Instagram posts.';
		} else {
			$postsBody = wp_remote_retrieve_body($postsResponse);
			$posts = json_decode($postsBody, true);

			if (empty($posts['data'])) {
				return 'Please add Instagram Access Token';
			}

			// If not using transient, cache the posts for an hour
			if ($use_transient) {
				set_transient($transient_key, $posts['data'], HOUR_IN_SECONDS);
			}

			return $posts['data'];
		}
	}

	public static function get_enable_settings_data_for_scripts($settings)
	{
		$settings_data = [
			'enabled_ads' => isset($settings['adManager']) && $settings['adManager'] === 'yes' ? 'yes' : '',

			'enabled_custom_player' => isset($settings['emberpress_custom_player']) && $settings['emberpress_custom_player'] === 'yes' ? 'yes' : '',

			'enabled_instafeed' => isset($settings['embedpress_pro_embeded_source']) && $settings['embedpress_pro_embeded_source'] === 'instafeed' ? 'yes' : '',

			'enabled_docs_custom_viewer' => isset($settings['embedpress_document_viewer']) && $settings['embedpress_document_viewer'] === 'custom' ? 'yes' : '',
		];

		update_option('enabled_elementor_scripts', $settings_data);
	}

	public static function get_options_value($key)
	{
		$g_settings = get_option(EMBEDPRESS_PLG_NAME);

		if(isset($g_settings['enableEmbedResizeWidth']) && $g_settings['enableEmbedResizeWidth'] == 1){
			$g_settings['enableEmbedResizeWidth'] = 600;
			update_option(EMBEDPRESS_PLG_NAME, $g_settings);
		}
		if(isset($g_settings['enableEmbedResizeHeight']) && $g_settings['enableEmbedResizeHeight'] == 1){
			$g_settings['enableEmbedResizeHeight'] = 600;
			update_option(EMBEDPRESS_PLG_NAME, $g_settings);
		}

		if (isset($g_settings[$key])) {
			return $g_settings[$key];
		}

		return '';
	}



	public static function get_branding_value($key, $provider)
	{
		$settings = get_option(EMBEDPRESS_PLG_NAME . ':' . $provider, []);

		if (isset($settings['branding']) && $settings['branding'] === 'yes'  && isset($settings[$key])) {
			return $settings[$key];
		}
		return '';
	}


	public static function format_number($number)
	{
		if ($number >= 1000000000) {
			return number_format($number / 1000000000, 1) . 'b';
		} elseif ($number >= 1000000) {
			return number_format($number / 1000000, 1) . 'm';
		} elseif ($number >= 1000) {
			return number_format($number / 1000, 1) . 'k';
		} else {
			return $number;
		}
	}

	public static function get_id($item)
	{
		$vid = isset($item->snippet->resourceId->videoId) ? $item->snippet->resourceId->videoId : null;
		$vid = $vid ? $vid : (isset($item->id->videoId) ? $item->id->videoId : null);
		$vid = $vid ? $vid : (isset($item->id) ? $item->id : null);
		return $vid;
	}

	public static function clean_api_error($raw_message)
	{
		return htmlspecialchars(strip_tags(preg_replace('@&key=[^& ]+@i', '&key=*******', $raw_message)));
	}

	public static function clean_api_error_html($raw_message)
	{
		$clean_html = '';
		if ((defined('REST_REQUEST') && REST_REQUEST) || current_user_can('manage_options')) {
			$clean_html = '<div>' . __('EmbedPress: ', 'embedpress') . self::clean_api_error($raw_message) . '</div>';
		}
		return $clean_html;
	}

	public static function get_thumbnail_url($item, $quality, $privacyStatus)
	{
		$url = "";
		if ($privacyStatus == 'private') {
			$url = EMBEDPRESS_URL_ASSETS . 'images/youtube/private.png';
		} elseif (isset($item->snippet->thumbnails->{$quality}->url)) {
			$url = $item->snippet->thumbnails->{$quality}->url;
		} elseif (isset($item->snippet->thumbnails->medium->url)) {
			$url = $item->snippet->thumbnails->medium->url;
		} elseif (isset($item->snippet->thumbnails->default->url)) {
			$url = $item->snippet->thumbnails->default->url;
		} elseif (isset($item->snippet->thumbnails->high->url)) {
			$url = $item->snippet->thumbnails->high->url;
		} else {
			$url = EMBEDPRESS_URL_ASSETS . 'images/youtube/deleted-video-thumb.png';
		}
		return $url;
	}

	public static function compare_vid_date($a, $b)
	{
		$dateA = strtotime($a->snippet->publishedAt);
		$dateB = strtotime($b->snippet->publishedAt);

		// Sort in descending order (newest first)
		return $dateB - $dateA;
	}


	public static function get_youtube_video_data($api_key, $video_id)
	{
		// Set a unique transient name based on the video ID
		$transient_name = 'youtube_video_data_' . $video_id;

		// Try to get data from the transient cache
		$video_data = get_transient($transient_name);

		// If no cached data, fetch from the API
		if ($video_data === false) {
			// YouTube Data API URL
			$url = "https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id={$video_id}&key={$api_key}";

			// Fetch the data from the API
			$response = wp_remote_get($url);

			if (is_wp_error($response)) {
				return false; // Return false if there is an error
			}

			$body = wp_remote_retrieve_body($response);
			$video_data = json_decode($body, true);

			if (isset($video_data['items'][0])) {
				$video_data = $video_data['items'][0];

				// Cache the data in a transient for 12 hours
				set_transient($transient_name, $video_data, 24 * HOUR_IN_SECONDS);
			} else {
				return false; // Return false if no data found
			}
		}

		return $video_data;
	}

	public static function trimTitle($title, $wordCount)
	{
		$words = explode(' ', $title);

		if (count($words) <= $wordCount) {
			return $title; // No trimming needed
		}

		$trimmedWords = array_slice($words, 0, $wordCount);

		return implode(' ', $trimmedWords) . ' ...';
	}

	public static function timeAgo($datetime)
	{
		$now = new \DateTime();
		$date = new \DateTime($datetime);
		$interval = $now->diff($date);

		if ($interval->y > 0) {
			return $interval->y . ' year' . ($interval->y > 1 ? 's' : '') . ' ago';
		} elseif ($interval->m > 0) {
			return $interval->m . ' month' . ($interval->m > 1 ? 's' : '') . ' ago';
		} elseif ($interval->d > 0) {
			return $interval->d . ' day' . ($interval->d > 1 ? 's' : '') . ' ago';
		} elseif ($interval->h > 0) {
			return $interval->h . ' hour' . ($interval->h > 1 ? 's' : '') . ' ago';
		} elseif ($interval->i > 0) {
			return $interval->i . ' minute' . ($interval->i > 1 ? 's' : '') . ' ago';
		} else {
			return 'just now';
		}
	}

	public static function removeQuote($attributes)
	{
		$parsedAttributes = [];

		$regex = '/^on.*/i';

		foreach ($attributes as $key => $value) {
			if (is_string($value)) {
				$cleanValue = str_replace(['"', "'"], '', $value);
			} else {
				$cleanValue = $value;
			}

			if (!preg_match($regex, $key)) {
				$parsedAttributes[$key] = $cleanValue;
			}
		}

		return $parsedAttributes;
	}

	public static function getBooleanParam($param, $default = false)
	{
		return isset($param) && is_string($param) && ($param == 'true' || $param == 'yes') ? 'true' : ($default ? 'true' : 'false');
	}

	public static function has_allowed_roles($allowed_roles = [])
	{

		if (empty($allowed_roles) || (count($allowed_roles) == 1 && empty($allowed_roles[0]))) {
			return true;
		}
		$current_user = wp_get_current_user();
		$user_roles = $current_user->roles;

		return !empty(array_intersect($user_roles, $allowed_roles));
	}

	public static function get_elementor_global_color($settings, $key)
	{

		$global_color = $settings[$key];

		if (isset($settings['__globals__'][$key])) {
			$color_setting = $settings['__globals__'][$key];

			if (strpos($color_setting, 'globals/colors?id=') === 0) {
				// It's a global color reference
				$global_id = str_replace('globals/colors?id=', '', $color_setting);

				$kit  = Plugin::$instance->kits_manager->get_current_settings();

				$system_colors = isset($kit['system_colors']) ? $kit['system_colors'] : [];
				$custom_colors = isset($kit['custom_colors']) ? $kit['custom_colors'] : [];
				$global_colors = array_merge($system_colors, $custom_colors);

				foreach ($global_colors as $color) {

					if ($color['_id'] === $global_id) {
						$global_color = $color['color'];  // Found a match, set the color
						break;
					}
				}
			}
		}
		return $global_color;
	}
}
