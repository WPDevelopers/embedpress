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

		$client_id = isset($_POST['client_id']) ? $_POST['client_id'] : '';
		$password = isset($_POST['password']) ? $_POST['password'] : ''; 
		$epbase64 = isset($_POST['epbase']) ? $_POST['epbase'] : '';
		$hash_key = isset($_POST['hash_key']) ? $_POST['hash_key'] : '';

		// echo $client_id;


		// Set the decryption key and initialization vector (IV)
		$key = "g72@QKgEcANy8%D7xq8%@n%#";
		$iv = "^ZCC$93vsbyYjz01";

		// Decode the base64 encoded cipher
		$cipher = base64_decode($epbase64);
		// Decrypt the cipher using AES-128-CBC encryption

		$wp_pass_key = hash('sha256', wp_salt(32) . md5($password));
		if ($wp_pass_key === $hash_key) {
			setcookie("password_correct_", $password, time()+3600); 

			$embed = openssl_decrypt($cipher, 'AES-128-CBC', $key, OPENSSL_RAW_DATA, $iv) . '<script>
			var now = new Date();
			var time = now.getTime();
			var expireTime = time + 1000 * 60 * 60 * 24 * 30;
			now.setTime(expireTime);
			document.cookie = "password_correct_'.$client_id.'='.$hash_key.'; expires=" + now.toUTCString() + "; path=/";
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


function embedpress_render_block($attributes)
{	

	$client_id = !empty($attributes['clientId']) ? md5($attributes['clientId']) : '';
	$block_id = !empty($attributes['clientId']) ? $attributes['clientId'] : '';

	$pass_hash_key = isset($attributes['contentPassword']) ? md5($attributes['contentPassword']): ''; 

	if (!empty($attributes['embedHTML'])) {
		$embed  = apply_filters('embedpress_gutenberg_embed', $attributes['embedHTML'], $attributes);

		$content_share_class = '';
		$share_position_class = '';
		$share_position = isset($attributes['sharePosition']) ? $attributes['sharePosition'] : 'right';

		if(!empty($attributes['contentShare'])) {
			$content_share_class = 'ep-content-share-enabled';
			$share_position_class = 'ep-share-position-'.$share_position;
		}
		$content_protection_class = '';
		if(!empty($attributes['lockContent']) && !empty($attributes['contentPassword'])) {
			$content_protection_class = 'ep-content-protection-enabled';
		}
	
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
		$embed = Helper::customLogo($embed, $attributes);
		$url = !empty($attributes['href']) ? $attributes['href'] : '';

		ob_start();
		?>
		<div class="embedpress-gutenberg-wrapper <?php echo  esc_attr( $alignment.' '.$content_share_class.' '.$share_position_class.' '.$content_protection_class);  ?>" id="<?php echo esc_attr($block_id); ?>">
			<?php 
				$share_position = isset($attributes['sharePosition']) ? $attributes['sharePosition'] : 'right';
				$custom_thumbnail = isset($attributes['customThumbnail']) ? $attributes['customThumbnail'] : '';
			?>
			<div class="wp-block-embed__wrapper <?php if(!empty($attributes['contentShare'])) echo esc_attr( 'position-'.$share_position.'-wraper'); ?>  <?php if($attributes['videosize'] == 'responsive') echo esc_attr( 'ep-video-responsive' ); ?>">
				<div id="ep-gutenberg-content-<?php echo esc_attr( $client_id )?>" class="ep-gutenberg-content">
					<div class="ep-embed-content-wraper">
						<?php 
							$hash_pass = hash('sha256', wp_salt(32) . md5($attributes['contentPassword']));
							$password_correct = isset($_COOKIE['password_correct_'.$client_id]) ? $_COOKIE['password_correct_'.$client_id] : '';
							if(empty($attributes['lockContent']) || empty($attributes['contentPassword'])  || (!empty(Helper::is_password_correct($client_id)) && ($hash_pass === $password_correct)) ){
								
								if(!empty($attributes['contentShare'])) {
									$content_id = $attributes['clientId'];
									$embed .= Helper::embed_content_share($content_id, $attributes);
								}
								echo $embed;
							} else {
								if(!empty($attributes['contentShare'])) {
									$content_id = $attributes['clientId'];
									$embed .= Helper::embed_content_share($content_id, $attributes);
								}
								Helper::display_password_form($client_id, $embed, $pass_hash_key, $attributes);
							}
						?>
					</div>
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

		$width = isset($attributes['width']) ? $attributes['width'] : 600;
		$height = $width * (9/16);


		$youtubeStyles = '<style>
		' . esc_attr($uniqid) . ' {
			position: relative;
			width: ' . esc_attr($attributes['width']) . 'px !important;
			height: ' . esc_attr($height) . 'px !important;
			max-width: 100%;
		  }

		  .ose-wistia{
			height: auto !important;
			padding-top: 0;
		  }
		
		  ' . esc_attr($uniqid) . ' > iframe {
			width: 100%;
			height: 100%;
			max-height:100%;
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