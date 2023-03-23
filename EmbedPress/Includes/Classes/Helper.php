<?php

namespace EmbedPress\Includes\Classes;

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

	public static function get_file_title($url){
		return get_the_title(attachment_url_to_postid( $url ));
	}


	public function lock_content_form_handler()
	{
		// print_r($embedHTML);

		$client_id = $_POST['client_id'];
		$password = $_POST['password'];
		$epbase64 = $_POST['epbase'];
		$hash_key = $_POST['hash_key'];

		// echo $client_id;


		// Set the decryption key and initialization vector (IV)
		$key = "g72@QKgEcANy8%D7xq8%@n%#";
		$iv = "^ZCC$93vsbyYjz01";

		// Decode the base64 encoded cipher
		$cipher = base64_decode($epbase64);
		// Decrypt the cipher using AES-128-CBC encryption

		if (md5($password) === $hash_key) {
			setcookie("password_correct_", $password, time() + 3600);

			$embed = openssl_decrypt($cipher, 'AES-128-CBC', $key, OPENSSL_RAW_DATA, $iv) . '<script>
		var now = new Date();
		var time = now.getTime();
		var expireTime = time + 1000 * 60 * 60 * 24 * 30;
		now.setTime(expireTime);
		document.cookie = "password_correct_' . $client_id . '=' . $password . '; expires=" + now.toUTCString() + "; path=/";
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

	public static function display_password_form($client_id='', $embedHtml='', $pass_hash_key='')
	{
		// Set the encryption key and initialization vector (IV)
		$key = "g72@QKgEcANy8%D7xq8%@n%#";
		$iv = "^ZCC$93vsbyYjz01";

		// Encrypt the plaintext using AES-128-CBC encryption
		$cipher = openssl_encrypt($embedHtml, 'AES-128-CBC', $key, OPENSSL_RAW_DATA, $iv);

		// Base64 encode the encrypted cipher
		$encrypted_data = base64_encode($cipher);

		$lock_icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><g fill="#6354a5" class="color134563 svgShape"><path d="M46.3 28.7h-3v-6.4C43.3 16.1 38.2 11 32 11c-6.2 0-11.3 5.1-11.3 11.3v6.4h-3v-6.4C17.7 14.4 24.1 8 32 8s14.3 6.4 14.3 14.3v6.4" fill="#6354a5" class="color000000 svgShape"></path><path d="M44.8 55.9H19.2c-2.6 0-4.8-2.2-4.8-4.8V31.9c0-2.6 2.2-4.8 4.8-4.8h25.6c2.6 0 4.8 2.2 4.8 4.8v19.2c0 2.7-2.2 4.8-4.8 4.8zM19.2 30.3c-.9 0-1.6.7-1.6 1.6v19.2c0 .9.7 1.6 1.6 1.6h25.6c.9 0 1.6-.7 1.6-1.6V31.9c0-.9-.7-1.6-1.6-1.6H19.2z" fill="#6354a5" class="color000000 svgShape"></path><path d="M35.2 36.7c0 1.8-1.4 3.2-3.2 3.2s-3.2-1.4-3.2-3.2 1.4-3.2 3.2-3.2 3.2 1.5 3.2 3.2" fill="#6354a5" class="color000000 svgShape"></path><path d="M32.8 36.7h-1.6l-1.6 9.6h4.8l-1.6-9.6" fill="#6354a5" class="color000000 svgShape"></path></g></svg>';

		echo '
		<div class="password-form-container">
			<h2>Content Locked</h2>
			<p>This content is currently locked and requires a password to access.

				<form class="password-form" method="post" class="password-form">
					
					<div class="password-field">
						<span class="lock-icon">' . $lock_icon . '</span>
						<input type="password" name="pass_' . esc_attr($client_id) . '" placeholder="' . esc_attr__('Enter password', 'embedpress') . '" required>
					</div>
					<input type="hidden" name="ep_client_id" value="' . esc_attr($client_id) . '">
					<input type="hidden" name="ep_base_' . esc_attr($client_id) . '" value="' . esc_attr($encrypted_data) . '">
					<input type="hidden" name="hash_key_' . esc_attr($client_id) . '" value="' . esc_attr($pass_hash_key) . '">
					<input type="submit" name="password_submit" value="Unlock">
				</form>
				<p class="need-access-message">If you don\'t have the password, please contact the content owner or administrator to request access.</p>
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

	public static function generate_tpen_graph_meta_tags($title, $description, $image_url, $url) {
		$tags = "<meta property='og:title' content='$title'/>";
		$tags .= "<meta property='og:description' content='$description'/>";
		$tags .= "<meta property='og:image' content='$image_url'/>";
		$tags .= "<meta property='og:url' content='$url'/>";
		$tags .= "<meta name='twitter:card' content='summary_large_image'/>";
		$tags .= "<meta name='twitter:title' content='$title'/>";
		$tags .= "<meta name='twitter:description' content='$description'/>";
		$tags .= "<meta name='twitter:image' content='$image_url'/>";
		
		return $tags;
	}
	
	public static function add_share_meta_tags($meta_tags){

		echo $meta_tags;
	}

	public static function generate_social_share_meta($client_id){

		// Example string that contains an embedpress PDF block
		// $pdf_block = '<!-- wp:embedpress/embedpress-pdf {"id":"embedpress-pdf-1679464318234","contentShare":true,"customThumbnail":"http://development.local/wp-content/uploads/2022/09/IMG_20220906_103416-scaled.jpg","href":"http://development.local/wp-content/uploads/2022/09/computer_programming.pdf","draw":false,"fileName":"computer_programming","mime":"application/pdf","align":"center"} /-->

		// <!-- wp:embedpress/embedpress-pdf {"id":"embedpress-pdf-1679568771118","contentShare":true,"customThumbnail":"http://development.local/wp-content/uploads/2022/09/pexels-pixabay-50686-1.jpg","href":"http://development.local/wp-content/uploads/2022/11/sample.pdf","draw":false,"fileName":"sample","mime":"application/pdf","align":"center"} /-->';

		$post_id = get_the_ID(  ); // replace with the ID of the post you want to retrieve
		$post = get_post( $post_id );
		$pdf_block = $post->post_content;

		// ID to search for
		$id_value = $client_id;

		// Regular expression to match the id and href keys and their values
		$regex = '/"id":"'.$id_value.'",".*?"customThumbnail":"(.*?)"/';

		// Search for the regex pattern in the string and extract the href value
		if (preg_match($regex, $pdf_block, $matches)) {
			// print_r($matches);
			$href_value = $matches[1];
			echo $href_value;
		} else {
			echo "No matching ID found in the string.";
		}
	}


	public static function embed_content_share($content_title='', $content_id='', $share_position='right', $custom_thumnail = '' ){

		$page_url = get_permalink().'?hash='.$content_id;

		$meta_tags = self::generate_tpen_graph_meta_tags($content_title, 'this test description', $custom_thumnail, $page_url);
		
		// self::generate_social_share_meta('embedpress-pdf-1679464318234');

		// echo $page_url;

		$social_icons = '<div class="social-share share-position-'.esc_attr( $share_position ).'">';
		$social_icons .= '<a href="https://www.facebook.com/sharer/sharer.php?u=' . $page_url . '" class="social-icon facebook" target="_blank">
		<svg width="64px" height="64px" viewBox="0 -6 512 512" xmlns="http://www.w3.org/2000/svg" fill="#000000">
			<g id="SVGRepo_bgCarrier" stroke-width="0"/>

			<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>

			<g id="SVGRepo_iconCarrier">

			<path fill="#475a96" d="M0 0h512v500H0z"/>

			<path d="M375.717 112.553H138.283c-8.137 0-14.73 6.594-14.73 14.73v237.434c0 8.135 6.594 14.73 14.73 14.73h127.826V276.092h-34.781v-40.28h34.781v-29.705c0-34.473 21.055-53.244 51.807-53.244 14.73 0 27.391 1.097 31.08 1.587v36.026l-21.328.01c-16.725 0-19.963 7.947-19.963 19.609v25.717h39.887l-5.193 40.28h-34.693v103.355h68.012c8.135 0 14.73-6.596 14.73-14.73V127.283c-.001-8.137-6.596-14.73-14.731-14.73z" fill="#ffffff"/>
			</g>
			</svg>
					</a>';
					$social_icons .= '<a href="https://twitter.com/intent/tweet?url=' . $page_url . '&text=' . $content_title . '" class="social-icon twitter" target="_blank">
					<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 248 204">
				<path fill="#ffffff"
					d="M221.95 51.29c.15 2.17.15 4.34.15 6.53 0 66.73-50.8 143.69-143.69 143.69v-.04c-27.44.04-54.31-7.82-77.41-22.64 3.99.48 8 .72 12.02.73 22.74.02 44.83-7.61 62.72-21.66-21.61-.41-40.56-14.5-47.18-35.07 7.57 1.46 15.37 1.16 22.8-.87-23.56-4.76-40.51-25.46-40.51-49.5v-.64c7.02 3.91 14.88 6.08 22.92 6.32C11.58 63.31 4.74 33.79 18.14 10.71c25.64 31.55 63.47 50.73 104.08 52.76-4.07-17.54 1.49-35.92 14.61-48.25 20.34-19.12 52.33-18.14 71.45 2.19 11.31-2.23 22.15-6.38 32.07-12.26-3.77 11.69-11.66 21.62-22.2 27.93 10.01-1.18 19.79-3.86 29-7.95-6.78 10.16-15.32 19.01-25.2 26.16z" />
			</svg>
					</a>';
					$social_icons .= '<a href="http://pinterest.com/pin/create/button/?url=' . $page_url . '&media=' .$custom_thumnail . '&description=' . $content_title . '" class="social-icon pinterest" target="_blank">
					
						
						
			<svg xmlns="http://www.w3.org/2000/svg" height="800" width="1200" viewBox="-36.42015 -60.8 315.6413 364.8"><path d="M121.5 0C54.4 0 0 54.4 0 121.5 0 173 32 217 77.2 234.7c-1.1-9.6-2-24.4.4-34.9 2.2-9.5 14.2-60.4 14.2-60.4s-3.6-7.3-3.6-18c0-16.9 9.8-29.5 22-29.5 10.4 0 15.4 7.8 15.4 17.1 0 10.4-6.6 26-10.1 40.5-2.9 12.1 6.1 22 18 22 21.6 0 38.2-22.8 38.2-55.6 0-29.1-20.9-49.4-50.8-49.4-34.6 0-54.9 25.9-54.9 52.7 0 10.4 4 21.6 9 27.7 1 1.2 1.1 2.3.8 3.5-.9 3.8-3 12.1-3.4 13.8-.5 2.2-1.8 2.7-4.1 1.6-15.2-7.1-24.7-29.2-24.7-47.1 0-38.3 27.8-73.5 80.3-73.5 42.1 0 74.9 30 74.9 70.2 0 41.9-26.4 75.6-63 75.6-12.3 0-23.9-6.4-27.8-14 0 0-6.1 23.2-7.6 28.9-2.7 10.6-10.1 23.8-15.1 31.9 11.4 3.5 23.4 5.4 36 5.4 67.1 0 121.5-54.4 121.5-121.5C243 54.4 188.6 0 121.5 0z" fill="#fff"/></svg>

					</a>';
					$social_icons .= '<a href="http://www.linkedin.com/shareArticle?mini=true&url=' . $page_url . '&title=' . $content_title . '&source=' . get_bloginfo('name') . '" class="social-icon linkedin" target="_blank">
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
		$social_icons .= '</div>';
		
		echo  $social_icons ;
	}


}

?>
