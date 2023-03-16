<?php

use EmbedPress\Includes\Classes\Helper;

// Exit if accessed directly.
if (!defined('ABSPATH')) {
	exit;
}
/**
 * It renders gutenberg block of embedpress on the frontend
 * @param array $attributes
 */
 
if(!function_exists('lock_content_form_handler')){
	add_action('wp_ajax_lock_content_form_handler', 'lock_content_form_handler');
	add_action('wp_ajax_nopriv_lock_content_form_handler', 'lock_content_form_handler');

	function lock_content_form_handler() {
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

		if(md5($password) === $hash_key){
			setcookie("password_correct_", $password, time()+3600); 

			$embed = openssl_decrypt($cipher, 'AES-128-CBC', $key, OPENSSL_RAW_DATA, $iv) . '<script>
			var now = new Date();
			var time = now.getTime();
			var expireTime = time + 1000 * 60 * 60 * 24 * 30;
			now.setTime(expireTime);
			document.cookie = "password_correct_'.$client_id.'='.$password.'; expires=" + now.toUTCString() + "; path=/";
		</script>';

		}
		else{
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
}
//Custom Logo 

if(!function_exists('customLogo')){
	function customLogo($embedHTML, $atts){
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
}

// Add the password form to the password-form div
// if(!function_exists('display_password_form')){
// 	function display_password_form($client_id, $embedHtml, $pass_hash_key) {

// 		// Set the encryption key and initialization vector (IV)
// 		$key = "g72@QKgEcANy8%D7xq8%@n%#";
// 		$iv = "^ZCC$93vsbyYjz01";

// 		// Encrypt the plaintext using AES-128-CBC encryption
// 		$cipher = openssl_encrypt($embedHtml, 'AES-128-CBC', $key, OPENSSL_RAW_DATA, $iv);

// 		// Base64 encode the encrypted cipher
// 		$encrypted_data = base64_encode($cipher);

// 		$lock_icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><g fill="#6354a5" class="color134563 svgShape"><path d="M46.3 28.7h-3v-6.4C43.3 16.1 38.2 11 32 11c-6.2 0-11.3 5.1-11.3 11.3v6.4h-3v-6.4C17.7 14.4 24.1 8 32 8s14.3 6.4 14.3 14.3v6.4" fill="#6354a5" class="color000000 svgShape"></path><path d="M44.8 55.9H19.2c-2.6 0-4.8-2.2-4.8-4.8V31.9c0-2.6 2.2-4.8 4.8-4.8h25.6c2.6 0 4.8 2.2 4.8 4.8v19.2c0 2.7-2.2 4.8-4.8 4.8zM19.2 30.3c-.9 0-1.6.7-1.6 1.6v19.2c0 .9.7 1.6 1.6 1.6h25.6c.9 0 1.6-.7 1.6-1.6V31.9c0-.9-.7-1.6-1.6-1.6H19.2z" fill="#6354a5" class="color000000 svgShape"></path><path d="M35.2 36.7c0 1.8-1.4 3.2-3.2 3.2s-3.2-1.4-3.2-3.2 1.4-3.2 3.2-3.2 3.2 1.5 3.2 3.2" fill="#6354a5" class="color000000 svgShape"></path><path d="M32.8 36.7h-1.6l-1.6 9.6h4.8l-1.6-9.6" fill="#6354a5" class="color000000 svgShape"></path></g></svg>';

// 		echo '
// 			<div class="password-form-container">
// 			<h2>Content Locked</h2>
// 			<p>This content is currently locked and requires a password to access.

// 				<form class="password-form" method="post" class="password-form">
					
// 					<div class="password-field">
// 						<span class="lock-icon">'.$lock_icon.'</span>
// 						<input type="password" name="pass_' . esc_attr( $client_id ) . '" placeholder="'.esc_attr__( 'Enter password', 'embedpress' ).'" required>
// 					</div>
// 					<input type="hidden" name="ep_client_id" value="' . esc_attr( $client_id ) . '">
// 					<input type="hidden" name="ep_base_' . esc_attr( $client_id ) . '" value="' . esc_attr( $encrypted_data ) . '">
// 					<input type="hidden" name="hash_key_' . esc_attr( $client_id ) . '" value="' . esc_attr( $pass_hash_key ) . '">
// 					<input type="submit" name="password_submit" value="Unlock">
// 				</form>
// 				<p class="need-access-message">If you don\'t have the password, please contact the content owner or administrator to request access.</p>
// 			</div>
// 		';

// 	}     
// }

// // Check if the user has already entered the correct password
// if(!function_exists('is_password_correct')){
// 	function is_password_correct($client_id) {
// 		if (isset($_COOKIE['password_correct_'.$client_id])) {
// 		return $_COOKIE['password_correct_'.$client_id];
// 		} else {
// 		return false;
// 		}
// 	}
// }

function embedpress_render_block($attributes)
{	
	$client_id = md5($attributes['clientId']);
	$pass_hash_key = isset($attributes['contentPassword']) ? md5($attributes['contentPassword']): ''; 

	if (!empty($attributes['embedHTML'])) {
		$embed  = apply_filters('embedpress_gutenberg_embed', $attributes['embedHTML'], $attributes);
	
		$aligns = [
			'left' => 'alignleft',
			'right' => 'alignright',
			'wide' => 'alignwide',
			'full' => 'alignfull',
			'center' => 'aligncenter',
		];
		if (isset($attributes['align'])) {
			$alignment = isset($aligns[$attributes['align']]) ? $aligns[$attributes['align']] . ' clear' : '';
		} else {
			$alignment = 'aligncenter'; // default alignment is center in js, so keeping same here
		}
		$embed = customLogo($embed, $attributes);

		ob_start();
		?>
		<div class="embedpress-gutenberg-wrapper">
			<div class="wp-block-embed__wrapper <?php echo esc_attr($alignment) ?> <?php if($attributes['videosize'] == 'responsive') echo esc_attr( 'ep-video-responsive' ); ?>">
				<div id="lock-content_<?php echo esc_attr( $client_id )?>">
					<?php 
						if(empty($attributes['lockContent']) || (!empty(Helper::is_password_correct($client_id)) && ($attributes['contentPassword'] === $_COOKIE['password_correct_'.$client_id])) ){
							echo $embed;
						} else {
							Helper::display_password_form($client_id, $embed, $pass_hash_key);
						}
					?>

				</div>
			</div>
		</div>
		<?php

		echo embedpress_render_block_style($attributes);
		

		return ob_get_clean();


	}
}

/**
 * Make style function for embedpress render block
 */

function embedpress_render_block_style($attributes)
{
	
	$uniqid = !empty($attributes['url']) ? '.ose-uid-' . md5($attributes['url']) : '';

	$_iscustomlogo = '';

	if(!empty($attributes['customlogo'])){
		$_iscustomlogo = $uniqid.' img.watermark.ep-custom-logo {
			display: block !important;
		}';
	}
	$youtubeStyles = '<style>
		' . esc_attr($uniqid) . ' {
			width: ' . esc_attr($attributes['width']) . 'px !important;
			height: ' . esc_attr($attributes['height']) . 'px;
			max-width: 100%;
		}

		' . esc_attr($uniqid) . '>iframe {
			height: ' . esc_attr($attributes['height']) . 'px !important;
			max-height: ' . esc_attr($attributes['height']) . 'px !important;
			width: 100%;
		}

		' . esc_attr($uniqid) . ' .wistia_embed {
			max-width: 100%;
		}

		.alignright .ose-wistia' . esc_attr($uniqid) .'{
			margin-left: auto;
		}
		.alignleft .ose-wistia' . esc_attr($uniqid) .'{
			margin-right: auto;
		}
		.aligncenter .ose-wistia' . esc_attr($uniqid) .'{
			margin: auto;
		}
		'.$uniqid.' img.watermark{
			display: none;
		}
		'.$_iscustomlogo.'
	</style>';

	if($attributes['videosize'] == 'responsive') {
		$youtubeStyles = '<style>
		' . esc_attr($uniqid) . ' {
			position: relative;
			width: ' . esc_attr($attributes['width']) . 'px !important;
			height: 0;
			padding-top: 56.25%;
			max-width: 100%;
		  }

		  .ose-wistia{
			height: auto !important;
			padding-top: 0;
		  }
		
		  ' . esc_attr($uniqid) . ' > iframe {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		  }

		  .ep-video-responsive{
			display: inline-block!important;
			max-width: 100%;
		  }
		  '.$uniqid.' img.watermark{
				display: none;
			}
		  '.$_iscustomlogo.'
	</style>';
	}

	return $youtubeStyles;
}
?>