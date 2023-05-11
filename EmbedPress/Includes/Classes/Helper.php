<?php

namespace EmbedPress\Includes\Classes;
use EmbedPress\Shortcode;

if ( !defined('ABSPATH') ) {
	exit;
} // Exit if accessed directly

class Helper {

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
	
	public function __construct () {
		add_action('wp_ajax_lock_content_form_handler', [$this, 'lock_content_form_handler']);
		add_action('wp_ajax_nopriv_lock_content_form_handler', [$this, 'lock_content_form_handler']);
		add_action( 'wp_head', [$this, 'ep_add_meta_tags'] );
	}

	public function ep_add_meta_tags() {
		echo 'abstract';
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
			$decoder = function ($str) { return $str; };
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
	public static function get_pdf_renderer() {
		$renderer = EMBEDPRESS_URL_ASSETS . 'pdf/web/viewer.html';
		// @TODO; apply settings query args here
		return $renderer;
	}

	public static  function get_extension_from_file_url($url) {
		$urlSplit = explode(".", $url);
		$ext = end($urlSplit);
		return $ext;
	}
	
	public static function is_file_url($url) {
		$pattern = '/\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/i';
		return preg_match($pattern, $url) === 1;
	}

	public static function is_opensea($url) {
		return strpos($url, "opensea.io") !== false;
	}
	public static function is_youtube_channel($url) {
		return (bool) (preg_match('~(?:https?:\/\/)?(?:www\.)?(?:youtube.com\/)(?:channel\/|c\/|user\/|@)(\w+)~i', (string) $url));
	}

	public static function is_youtube($url) {
		return (bool) (preg_match('~(?:https?://)?(?:www\.)?(?:youtube\.com|youtu\.be)/watch\?v=([^&]+)~i', (string) $url));
	}

	// Saved sources data temporary in wp_options table
	public static function get_source_data($blockid, $source_url, $source_option_name, $source_temp_option_name) {
		
		
		if(self::is_youtube_channel($source_url)){
			$source_name = 'YoutubeChannel'; 
		}
		else if(self::is_youtube($source_url)){
			$source_name = 'Youtube'; 
		}
		else if (!empty(self::is_file_url($source_url))) {
			$source_name = 'document_' . self::get_extension_from_file_url($source_url);
		}
		else if(self::is_opensea($source_url)){
			$source_name  = 'OpenSea';
		}
		else{
			Shortcode::get_embera_instance();
			$collectios = Shortcode::get_collection();
			$provider = $collectios->findProviders($source_url);
			if(!empty($provider[$source_url])){
				$source_name = $provider[$source_url]->getProviderName();
			}
			else{
				$source_name = 'Unknown Source';
			}
		}
		
		if(!empty($blockid) && $blockid != 'undefined'){
			$sources = json_decode(get_option($source_temp_option_name), true);

			if(!$sources) {
				$sources = array();
			}
			$exists = false;
			
			foreach($sources as $i => $source) {
				if ($source['id'] === $blockid) {
					$sources[$i]['source']['name'] = $source_name;
					$sources[$i]['source']['url'] = $source_url;
					$exists = true;
					break;
				}
			}

			if(!$exists) {
				$sources[] = array('id' => $blockid, 'source' => array('name' => $source_name, 'url' => $source_url, 'count' => 1));
			}
			
			update_option($source_temp_option_name, json_encode($sources));
		}
	}

	// Saved source data when post updated
	public static function get_save_source_data_on_post_update( $source_option_name, $source_temp_option_name ) {

		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		} 
		$temp_data = json_decode(get_option($source_temp_option_name), true);
		$source_data = json_decode(get_option($source_option_name), true);
		if(!$temp_data) {
			$temp_data = array();
		}
		if(!$source_data) {
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
	public static function get_delete_source_data($blockid, $source_option_name, $source_temp_option_name) {
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
	public static function get_delete_source_temp_data_on_reload($source_temp_option_name) {
		$source_temp_data = json_decode(get_option($source_temp_option_name), true);
		if ($source_temp_data ) {
			delete_option( $source_temp_option_name );
		}
	}

	public static function get_file_title($url){
		return get_the_title(attachment_url_to_postid( $url ));
	}


	public function lock_content_form_handler()
	{
		
		$client_id = isset($_POST['client_id']) ? $_POST['client_id'] : '';
		$password = isset($_POST['password']) ? $_POST['password'] : ''; 
		$epbase64 = isset($_POST['epbase']) ? $_POST['epbase'] : '';
		$hash_key = isset($_POST['hash_key']) ? $_POST['hash_key'] : '';

		// Set the decryption key and initialization vector (IV)
		$key = "g72@QKgEcANy8%D7xq8%@n%#";
		$iv = "^ZCC$93vsbyYjz01";

		// Decode the base64 encoded cipher
		$cipher = base64_decode($epbase64);
		// Decrypt the cipher using AES-128-CBC encryption

		$wp_pass_key = hash('sha256', wp_salt(32) . md5($password));

		if ($wp_pass_key === $hash_key) {
			setcookie("password_correct_", $password, time() + 3600);

		$embed = openssl_decrypt($cipher, 'AES-128-CBC', $key, OPENSSL_RAW_DATA, $iv) . '<script>
		var now = new Date();
		var time = now.getTime();
		var expireTime = time + 1000 * 60 * 60 * 24 * 30;
		now.setTime(expireTime);
		document.cookie = "password_correct_' . $client_id . '=' . $hash_key . '; expires=" + now.toUTCString() + "; path=/";
	</script>';
		} else {
			$embed = 0;
		}

		// Process the form data and return a response
		$response = array(
			'success' => true,
			'password' => $password,
			'embedHtml' => $embed
		);

		echo json_encode($response);

		wp_die();
	}

	public static function display_password_form($client_id='', $embedHtml='', $pass_hash_key='', $attributes = [])
	{
		$lock_heading = !empty($attributes['lockHeading']) ? $attributes['lockHeading'] : '';
		$lock_subheading = !empty($attributes['lockSubHeading']) ? $attributes['lockSubHeading'] : '';
		$lock_error_message = !empty($attributes['lockErrorMessage']) ? $attributes['lockErrorMessage'] : '';
		$footer_message = !empty($attributes['footerMessage']) ? $attributes['footerMessage'] : '';
		$password_placeholder = !empty($attributes['passwordPlaceholder']) ? $attributes['passwordPlaceholder'] : '';
		$button_text = !empty($attributes['submitButtonText']) ? $attributes['submitButtonText'] : '';
		$unlocking_text = !empty($attributes['submitUnlockingText']) ? $attributes['submitUnlockingText'] : '';
		$enable_footer_message = !empty($attributes['enableFooterMessage']) ? $attributes['enableFooterMessage'] : '';

		// Set the encryption key and initialization vector (IV)
		$key = "g72@QKgEcANy8%D7xq8%@n%#";
		$iv = "^ZCC$93vsbyYjz01";

		$salt = wp_salt(32);
		$wp_hash_key = hash('sha256', $salt . $pass_hash_key);


		// Encrypt the plaintext using AES-128-CBC encryption
		$cipher = openssl_encrypt($embedHtml, 'AES-128-CBC', $key, OPENSSL_RAW_DATA, $iv);

		// Base64 encode the encrypted cipher
		$encrypted_data = base64_encode($cipher);

		$lock_icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><g fill="#6354a5" class="color134563 svgShape"><path d="M46.3 28.7h-3v-6.4C43.3 16.1 38.2 11 32 11c-6.2 0-11.3 5.1-11.3 11.3v6.4h-3v-6.4C17.7 14.4 24.1 8 32 8s14.3 6.4 14.3 14.3v6.4" fill="#6354a5" class="color000000 svgShape"></path><path d="M44.8 55.9H19.2c-2.6 0-4.8-2.2-4.8-4.8V31.9c0-2.6 2.2-4.8 4.8-4.8h25.6c2.6 0 4.8 2.2 4.8 4.8v19.2c0 2.7-2.2 4.8-4.8 4.8zM19.2 30.3c-.9 0-1.6.7-1.6 1.6v19.2c0 .9.7 1.6 1.6 1.6h25.6c.9 0 1.6-.7 1.6-1.6V31.9c0-.9-.7-1.6-1.6-1.6H19.2z" fill="#6354a5" class="color000000 svgShape"></path><path d="M35.2 36.7c0 1.8-1.4 3.2-3.2 3.2s-3.2-1.4-3.2-3.2 1.4-3.2 3.2-3.2 3.2 1.5 3.2 3.2" fill="#6354a5" class="color000000 svgShape"></path><path d="M32.8 36.7h-1.6l-1.6 9.6h4.8l-1.6-9.6" fill="#6354a5" class="color000000 svgShape"></path></g></svg>';

		echo '
		<div class="password-form-container">
			<h2>'.esc_html( $lock_heading ).'</h2>
			<p>'.esc_html( $lock_subheading ).' </p>
				<form class="password-form" method="post" class="password-form" data-unlocking-text="'.esc_attr( $unlocking_text ).'">
					
					<div class="password-field">
						<span class="lock-icon">' . $lock_icon . '</span>
						<input type="password" name="pass_' . esc_attr($client_id) . '" placeholder="' . esc_attr($password_placeholder) . '" required>
					</div>
					<input type="hidden" name="ep_client_id" value="' . esc_attr($client_id) . '">
					<input type="hidden" name="ep_base_' . esc_attr($client_id) . '" value="' . esc_attr($encrypted_data) . '">
					<input type="hidden" name="hash_key_' . esc_attr($client_id) . '" value="' . esc_attr($wp_hash_key ) . '">
					<input type="submit" name="password_submit" value="'.esc_attr( $button_text ).'">
					<div class="error-message hidden">'.esc_html( $lock_error_message ).'</div>
				</form>
				' . ( ! empty( $enable_footer_message ) ? '<p class="need-access-message">' . esc_html( $footer_message ) . '</p>' : '' ) . '
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

	public static function customLogo($embedHTML, $atts){
		$x = !empty($atts['logoX']) ? $atts['logoX'] : 0;
		$y = !empty($atts['logoY']) ? $atts['logoY'] : 0;
		$uniqid = !empty($atts['url'])? '.ose-uid-' . md5($atts['url']): '';
		
		$brandUrl = !empty($atts['customlogoUrl']) ? $atts['customlogoUrl'] : '';
		$opacity = !empty($atts['logoOpacity']) ? $atts['logoOpacity'] : '';
		
		$cssClass = !empty( $atts['url'] ) ? '.ose-uid-' . md5( $atts['url'] ) : '.ose-youtube';



		ob_start(); ?>
		<style type="text/css">
			<?php echo esc_html($cssClass); ?>
			{
				position: relative;
			}
			
			<?php echo esc_html($cssClass); ?> .watermark {
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

			<?php echo esc_html($cssClass); ?>
			.watermark:hover {
				opacity: 1;
			}
		</style>
		<?php 


		$style = ob_get_clean();

		if ( ! class_exists( '\simple_html_dom' ) ) {
			include_once EMBEDPRESS_PATH_CORE . 'simple_html_dom.php';
		}

		$cta    = '';
		$img = '';

		if(!empty($atts['customlogo'])){
			$img = '<img src="'.esc_url($atts['customlogo']).'"/>';

			$imgDom = str_get_html( $img );
			$imgDom = $imgDom->find( 'img', 0 );
			$imgDom->setAttribute( 'class', 'watermark ep-custom-logo' );
			$imgDom->removeAttribute( 'style' );
			$imgDom->setAttribute( 'width', 'auto' );
			$imgDom->setAttribute( 'height', 'auto' );
			ob_start();
			echo $imgDom;

			$cta .= ob_get_clean();

			$imgDom->clear();
			unset( $img, $imgDom );	

			if ( !empty($brandUrl) ) {
				$cta = '<a href="'.esc_url($brandUrl).'" target="_blank">'.$cta.'</a>';
			}
			$dom     = str_get_html( $embedHTML );		

			$wrapDiv = $dom->find( $uniqid, 0 );		

			if ( ! empty( $wrapDiv ) && is_object( $wrapDiv ) ) {
				$wrapDiv->innertext .= $cta;
			}

			ob_start();
			echo $wrapDiv;
			
			$markup = ob_get_clean();
			
			$dom->clear();
			unset( $dom, $wrapDiv );

			$embedHTML = $style . $markup;

		}

		return $embedHTML;

	}


	public static function embed_content_share($content_id='', $attributes = []){

		$share_position = !empty($attributes['sharePosition']) ? $attributes['sharePosition'] : 'right';
		$custom_thumnail = !empty($attributes['customThumbnail']) ? urlencode($attributes['customThumbnail']) : '';
		$custom_title = !empty($attributes['customTitle']) ? urlencode($attributes['customTitle']) : '';
		$custom_description = !empty($attributes['customDescription']) ? urlencode($attributes['customDescription']) : '';
	
		$page_url = urlencode(get_permalink().'?hash='.$content_id);
		
		$social_icons = '<div class="ep-social-share-wraper"><div class="ep-social-share share-position-'.esc_attr( $share_position ).'">';
		$social_icons .= '<a href="https://www.facebook.com/sharer/sharer.php?u=' . $page_url . '" class="ep-social-icon facebook" target="_blank">
			<svg width="64px" height="64px" fill="#000000" viewBox="0 -6 512 512" xmlns="http://www.w3.org/2000/svg">
			<path d="M0 0h512v500H0z" fill="#475a96"/>
			<path d="m375.72 112.55h-237.43c-8.137 0-14.73 6.594-14.73 14.73v237.43c0 8.135 6.594 14.73 14.73 14.73h127.83v-103.36h-34.781v-40.28h34.781v-29.705c0-34.473 21.055-53.244 51.807-53.244 14.73 0 27.391 1.097 31.08 1.587v36.026l-21.328 0.01c-16.725 0-19.963 7.947-19.963 19.609v25.717h39.887l-5.193 40.28h-34.693v103.36h68.012c8.135 0 14.73-6.596 14.73-14.73v-237.43c-1e-3 -8.137-6.596-14.73-14.731-14.73z" fill="#fff"/>
			</svg>
			</a>';
			$social_icons .= '<a href="https://twitter.com/intent/tweet?url=' . $page_url . '&text=' . $custom_title . '" class="ep-social-icon twitter" target="_blank">
			<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 248 204">
				<path fill="#ffffff"
					d="M221.95 51.29c.15 2.17.15 4.34.15 6.53 0 66.73-50.8 143.69-143.69 143.69v-.04c-27.44.04-54.31-7.82-77.41-22.64 3.99.48 8 .72 12.02.73 22.74.02 44.83-7.61 62.72-21.66-21.61-.41-40.56-14.5-47.18-35.07 7.57 1.46 15.37 1.16 22.8-.87-23.56-4.76-40.51-25.46-40.51-49.5v-.64c7.02 3.91 14.88 6.08 22.92 6.32C11.58 63.31 4.74 33.79 18.14 10.71c25.64 31.55 63.47 50.73 104.08 52.76-4.07-17.54 1.49-35.92 14.61-48.25 20.34-19.12 52.33-18.14 71.45 2.19 11.31-2.23 22.15-6.38 32.07-12.26-3.77 11.69-11.66 21.62-22.2 27.93 10.01-1.18 19.79-3.86 29-7.95-6.78 10.16-15.32 19.01-25.2 26.16z" />
			</svg>
			</a>';
			$social_icons .= '<a href="http://pinterest.com/pin/create/button/?url=' . $page_url . '&media=' .$custom_thumnail . '&description=' . $custom_description . '" class="ep-social-icon pinterest" target="_blank">
			
				<svg xmlns="http://www.w3.org/2000/svg" height="800" width="1200" viewBox="-36.42015 -60.8 315.6413 364.8"><path d="M121.5 0C54.4 0 0 54.4 0 121.5 0 173 32 217 77.2 234.7c-1.1-9.6-2-24.4.4-34.9 2.2-9.5 14.2-60.4 14.2-60.4s-3.6-7.3-3.6-18c0-16.9 9.8-29.5 22-29.5 10.4 0 15.4 7.8 15.4 17.1 0 10.4-6.6 26-10.1 40.5-2.9 12.1 6.1 22 18 22 21.6 0 38.2-22.8 38.2-55.6 0-29.1-20.9-49.4-50.8-49.4-34.6 0-54.9 25.9-54.9 52.7 0 10.4 4 21.6 9 27.7 1 1.2 1.1 2.3.8 3.5-.9 3.8-3 12.1-3.4 13.8-.5 2.2-1.8 2.7-4.1 1.6-15.2-7.1-24.7-29.2-24.7-47.1 0-38.3 27.8-73.5 80.3-73.5 42.1 0 74.9 30 74.9 70.2 0 41.9-26.4 75.6-63 75.6-12.3 0-23.9-6.4-27.8-14 0 0-6.1 23.2-7.6 28.9-2.7 10.6-10.1 23.8-15.1 31.9 11.4 3.5 23.4 5.4 36 5.4 67.1 0 121.5-54.4 121.5-121.5C243 54.4 188.6 0 121.5 0z" fill="#fff"/></svg>
	
			</a>';
	
			$social_icons .= '<a href="https://www.linkedin.com/sharing/share-offsite/?url='.$page_url.'&title='.$custom_title.'&summary='.$custom_description.'&source=LinkedIn" class="ep-social-icon linkedin" target="_blank">
	
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
		$social_icons .= '</div></div>';
		
		return  $social_icons ;
	}


	
	public static function ep_get_elementor_widget_settings($page_settings = '', $id = '', $widgetType = ''){

		$data = json_decode($page_settings, true);

		// Search for the element with the given ID
		$element = null;
		foreach ($data as $section) {
			foreach ($section['elements'] as $column) {
				foreach ($column['elements'] as $el) {
					if ($el['id'] == $id && $el['elType'] == 'widget' && $el['widgetType'] == $widgetType) {
						$element = $el;
						break 3;
					}
				}
			}
		}

		// Output the element code
		if ($element) {
			return $element;;
		} 

	}	

	public static function ep_get_popup_icon() {
		$svg = '<div class="ep-doc-popup-icon" ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" xml:space="preserve"><path fill="#fff" d="M5 3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-6l-2-2v8H5V5h8l-2-2H5zm9 0 2.7 2.7-7.5 7.5 1.7 1.7 7.5-7.5L21 10V3h-7z"/><path style="fill:none" d="M0 0h24v24H0z"/></svg></div>';

		return $svg;
	}
	public static function ep_get_download_icon() {
		$svg = '<div class="ep-doc-download-icon" ><svg width="25" height="25" viewBox="0 0 0.6 0.6" xmlns="http://www.w3.org/2000/svg"><path fill="#fff" fill-rule="evenodd" d="M.525.4A.025.025 0 0 1 .55.422v.053A.075.075 0 0 1 .479.55H.125A.075.075 0 0 1 .05.479V.425A.025.025 0 0 1 .1.422v.053A.025.025 0 0 0 .122.5h.353A.025.025 0 0 0 .5.478V.425A.025.025 0 0 1 .525.4ZM.3.05a.025.025 0 0 1 .025.025v.24L.357.283A.025.025 0 0 1 .39.281l.002.002a.025.025 0 0 1 .002.033L.392.318.317.393.316.394.314.395.311.397.308.398.305.399.301.4H.295L.292.399.289.398.287.397.285.395A.025.025 0 0 1 .283.393L.208.318A.025.025 0 0 1 .241.281l.002.002.032.032v-.24A.025.025 0 0 1 .3.05Z"/></svg></div>';

		return $svg;
	}

	public static function ep_get_print_icon() {
		$svg = '<div class="ep-doc-print-icon" ><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24">
		<path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" fill="#fff"/>
		</svg></div>';

		return $svg;
	}

	public static function ep_get_fullscreen_icon() {
		$svg = '<div class="ep-doc-fullscreen-icon"><svg width="25" height="25" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<path d="m3 15 .117.007a1 1 0 0 1 .876.876L4 16v4h4l.117.007a1 1 0 0 1 0 1.986L8 22H3l-.117-.007a1 1 0 0 1-.876-.876L2 21v-5l.007-.117a1 1 0 0 1 .876-.876L3 15Zm18 0a1 1 0 0 1 .993.883L22 16v5a1 1 0 0 1-.883.993L21 22h-5a1 1 0 0 1-.117-1.993L16 20h4v-4a1 1 0 0 1 .883-.993L21 15ZM8 2a1 1 0 0 1 .117 1.993L8 4H4v4a1 1 0 0 1-.883.993L3 9a1 1 0 0 1-.993-.883L2 8V3a1 1 0 0 1 .883-.993L3 2h5Zm13 0 .117.007a1 1 0 0 1 .876.876L22 3v5l-.007.117a1 1 0 0 1-.876.876L21 9l-.117-.007a1 1 0 0 1-.876-.876L20 8V4h-4l-.117-.007a1 1 0 0 1 0-1.986L16 2h5Z" fill="#fff"/>
	  	</svg></div>';
		
		return $svg;
	}
	public static function ep_get_minimize_icon() {
		$svg = '<div class="ep-doc-minimize-icon" style="display:none"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" style="enable-background:new 0 0 385.331 385.331" xml:space="preserve" width="20" height="20"><path fill="#fff" d="M13.751 8.131h5.62c0.355 0 0.619 -0.28 0.619 -0.634 0 -0.355 -0.265 -0.615 -0.619 -0.614h-4.995V1.878c0 -0.355 -0.27 -0.624 -0.624 -0.624s-0.624 0.27 -0.624 0.624v5.62c0 0.002 0.001 0.003 0.001 0.004 0 0.002 -0.001 0.003 -0.001 0.005 0 0.348 0.276 0.625 0.624 0.624zM6.244 1.259c-0.354 0 -0.614 0.265 -0.614 0.619v4.995H0.624c-0.355 0 -0.624 0.27 -0.624 0.624 0 0.355 0.27 0.624 0.624 0.624h5.62c0.002 0 0.003 -0.001 0.004 -0.001 0.002 0 0.003 0.001 0.005 0.001 0.348 0 0.624 -0.276 0.624 -0.624V1.878c0 -0.354 -0.28 -0.619 -0.634 -0.619zm0.005 10.61H0.629c-0.355 0.001 -0.619 0.28 -0.619 0.634 0 0.355 0.265 0.615 0.619 0.614h4.995v5.005c0 0.355 0.27 0.624 0.624 0.624 0.355 0 0.624 -0.27 0.624 -0.624V12.502c0 -0.002 -0.001 -0.003 -0.001 -0.004 0 -0.002 0.001 -0.003 0.001 -0.005 0 -0.348 -0.276 -0.624 -0.624 -0.624zm13.127 0H13.756c-0.002 0 -0.003 0.001 -0.004 0.001 -0.002 0 -0.003 -0.001 -0.005 -0.001 -0.348 0 -0.624 0.276 -0.624 0.624v5.62c0 0.355 0.28 0.619 0.634 0.619 0.354 0.001 0.614 -0.265 0.614 -0.619v-4.995H19.376c0.355 0 0.624 -0.27 0.624 -0.624s-0.27 -0.624 -0.624 -0.625z"/><g/><g/><g/><g/><g/><g/></svg></div>';
		
		return $svg;
	}
	public static function ep_get_draw_icon() {
		$svg = '<div class="ep-doc-draw-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m15 7.5 2.5 2.5m-10 10L19.25 8.25c0.69 -0.69 0.69 -1.81 0 -2.5v0c-0.69 -0.69 -1.81 -0.69 -2.5 0L5 17.5V20h2.5Zm0 0h8.379C17.05 20 18 19.05 18 17.879v0c0 -0.563 -0.224 -1.103 -0.621 -1.5L17 16M4.5 5c2 -2 5.5 -1 5.5 1 0 2.5 -6 2.5 -6 5 0 0.876 0.533 1.526 1.226 2" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>';
		
		return $svg;
	}

	public static function get_google_presentation_url($embedded_url){
		$parsed_url = parse_url($embedded_url);
		$base_url = $parsed_url['scheme'] . '://' . $parsed_url['host'] . $parsed_url['path'];
		$base_url = strtok($base_url, '?');
		$base_url = rtrim($base_url, '/');
		return $base_url;

	}
	
}

?>
