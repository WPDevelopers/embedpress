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

		$client_id = isset($_POST['client_id']) ? sanitize_text_field($_POST['client_id']) : '';
		$password = isset($_POST['password']) ? sanitize_text_field($_POST['password']) : '';
		$post_id = isset($_POST['post_id']) ? absint($_POST['post_id']) : 0;
		
		$epbase64 = get_post_meta( $post_id, 'ep_base_' .$client_id, true );	
		$hash_key = get_post_meta( $post_id, 'hash_key_' .$client_id, true  );

		// Set the decryption key and initialization vector (IV)
		$key = Helper::get_hash();

		// Decode the base64 encoded cipher
		$cipher = base64_decode($epbase64);
		// Decrypt the cipher using AES-128-CBC encryption

		$wp_pass_key = hash('sha256', wp_salt(32) . md5($password));
		$iv = substr($wp_pass_key, 0, 16);

		if ($wp_pass_key === $hash_key) {
			setcookie("password_correct_", $password, time()+3600);

			$embed = openssl_decrypt($cipher, 'AES-128-CBC', $key, OPENSSL_RAW_DATA, $iv) . '<script>
			var now = new Date();
			var time = now.getTime();
			var expireTime = time + 1000 * 60 * 60 * 24 * 30;
			now.setTime(expireTime);
			document.cookie = "password_correct_'.esc_js($client_id).'='.esc_js($hash_key).'; expires=" + now.toUTCString() + "; path=/";
		</script>';

		}
		else{
			$embed = 0;
		}

		// Process the form data and return a response
		$response = array(
		'success' => true,
		'password' => $password,
		'embedHtml' => $embed,
		'post_id' => $post_id
		);

		wp_send_json($response);

	}
}



function embedpress_render_block($attributes)
{

	// echo '<pre>';
	// print_r($attributes);
	// echo '</pre>';


	$client_id = !empty($attributes['clientId']) ? md5($attributes['clientId']) : '';
	$block_id = !empty($attributes['clientId']) ? $attributes['clientId'] : '';
	$custom_player = !empty($attributes['customPlayer']) ? $attributes['customPlayer'] : 0;

	$cEmbedType = !empty($attributes['cEmbedType']) ? ' '.$attributes['cEmbedType'] : '';

	$_custom_player = '';
	$_player_options = '';

	if (!empty($custom_player)) {

		$is_self_hosted = Helper::check_media_format($attributes['url']);


		$_custom_player = 'data-playerid="' . esc_attr($client_id) . '"';
		$player_preset = !empty($attributes['playerPreset']) ? $attributes['playerPreset'] : 'preset-default';
		$player_color = !empty($attributes['playerColor']) ? $attributes['playerColor'] : '';
		$poster_thumbnail = !empty($attributes['posterThumbnail']) ? $attributes['posterThumbnail'] : '';
		$player_pip = !empty($attributes['playerPip']) ? true : false;
		$player_restart = !empty($attributes['playerRestart']) ? true : false;
		$player_rewind = !empty($attributes['playerRewind']) ? true : false;
		$player_fastForward = !empty($attributes['playerFastForward']) ? true : false;
		$player_tooltip = !empty($attributes['playerTooltip']) ? true : false;
		$player_hide_controls = !empty($attributes['playerHideControls']) ? true : false;
		$player_download = !empty($attributes['playerDownload']) ? true : false;

		$playerOptions = [
			'rewind' => $player_rewind,
			'restart' => $player_restart,
			'pip' => $player_pip,
			'poster_thumbnail' => $poster_thumbnail,
			'player_color' => $player_color,
			'player_preset' => $player_preset,
			'fast_forward' => $player_fastForward,
			'player_tooltip' => $player_tooltip,
			'hide_controls' => $player_hide_controls,
			'download' => $player_download,
		];

		if(!empty($attributes['fullscreen'])){
			$playerOptions['fullscreen'] = $attributes['fullscreen'];
		}

		if(!empty($is_self_hosted['selhosted'])){
			$playerOptions['self_hosted'] = $is_self_hosted['selhosted'];
			$playerOptions['hosted_format'] = $is_self_hosted['format'];
		}

		//Youtube options
		if(!empty($attributes['starttime'])){
			$playerOptions['start'] = $attributes['starttime'];
		}
		if(!empty($attributes['endtime'])){
			$playerOptions['end'] = $attributes['endtime'];
		}
		if(!empty($attributes['relatedvideos'])){
			$playerOptions['rel'] = $attributes['relatedvideos'];
		}

		//vimeo options
		if(!empty($attributes['vstarttime'])){
			$playerOptions['t'] = $attributes['vstarttime'];
		}
		if(!empty($attributes['vautoplay'])){
			$playerOptions['vautoplay'] = $attributes['vautoplay'];
		}
		if(!empty($attributes['vautopause'])){
			$playerOptions['autopause'] = $attributes['vautopause'];
		}
		if(!empty($attributes['vdnt'])){
			$playerOptions['dnt'] = $attributes['vdnt'];
		}

		$playerOptionsString = json_encode($playerOptions);
		$_player_options = 'data-options=\'' . htmlentities($playerOptionsString, ENT_QUOTES) . '\'';
	}

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

		$password_correct = isset($_COOKIE['password_correct_'.$client_id]) ? $_COOKIE['password_correct_'.$client_id] : '';
		$hash_pass = hash('sha256', wp_salt(32) . md5(isset($attributes['contentPassword']) ? $attributes['contentPassword'] : ''));

		$content_protection_class = 'ep-content-protection-enabled';
		if(empty($attributes['lockContent']) || empty($attributes['contentPassword']) || $hash_pass === $password_correct) {
			$content_protection_class = 'ep-content-protection-disabled';
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

		$adsAtts = '';

		if(!empty($attributes['adManager'])) {
			$ad = base64_encode(json_encode($attributes));
			$adsAtts = "data-ad-id=$client_id data-ad-attrs=$ad class=ad-mask";
		}

		ob_start();
		?>
		<div class="embedpress-gutenberg-wrapper <?php echo esc_attr( $alignment.' '.$content_share_class.' '.$share_position_class.' '.$content_protection_class); echo esc_attr( $cEmbedType ); ?>" id="<?php echo esc_attr($block_id); ?>">
			<?php
				$share_position = isset($attributes['sharePosition']) ? $attributes['sharePosition'] : 'right';
				$custom_thumbnail = isset($attributes['customThumbnail']) ? $attributes['customThumbnail'] : '';
			?>
			<div class="wp-block-embed__wrapper <?php if(!empty($attributes['contentShare'])) echo esc_attr( 'position-'.$share_position.'-wraper'); ?>  <?php if($attributes['videosize'] == 'responsive') echo esc_attr( 'ep-video-responsive' ); ?>">
				<div id="ep-gutenberg-content-<?php echo esc_attr( $client_id )?>" class="ep-gutenberg-content">
					<div <?php echo esc_attr( $adsAtts ); ?> >
						<div  class="ep-embed-content-wraper <?php !empty($custom_player) ? esc_attr_e($player_preset) : ''; ?>" <?php echo $_custom_player; ?> <?php echo $_player_options; ?>>
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
						<?php 
							if(!empty($attributes['adManager'])) {
								$embed .= Helper::generateAdTemplate($client_id, $attributes, 'gutenberg');
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
	$client_id = !empty($attributes['clientId']) ? $attributes['clientId'] : '';

	$custom_player = !empty($attributes['customPlayer']) ? $attributes['customPlayer'] : 0;
	$player_color = !empty($attributes['playerColor']) ? $attributes['playerColor'] : '';
	$player_pip = !empty($attributes['playerPip']) ? 'block' : 'none';
	$logoX = !empty($attributes['logoX']) ? $attributes['logoX'] : 5;
	$logoY = !empty($attributes['logoY']) ? $attributes['logoX'] : 10;
	$logoOpacity = !empty($attributes['logoOpacity']) ? $attributes['logoOpacity'] : '1';
	$player_pip = !empty($attributes['playerPip']) ? 'block' : 'none';

	$playerStyle = '';

	if (!empty($custom_player)) {
		$playerStyle = '
		[data-playerid="' . md5($client_id). '"] {
			--plyr-color-main: ' . ($player_color && strlen($player_color) === 7
				? 'rgba(' . hexdec(substr($player_color, 1, 2)) . ', ' . hexdec(substr($player_color, 3, 2)) . ', ' . hexdec(substr($player_color, 5, 2)) . ', .8)!important;'
				: 'rgba(0, 0, 0, .8)!important;'
			) . ';
		}
		[data-playerid="' . md5($client_id). '"].custom-player-preset-3, [data-playerid="' . md5($client_id). '"].custom-player-preset-4 {
			--plyr-color-main: ' . ($player_color && strlen($player_color) === 7
				? 'rgb(' . hexdec(substr($player_color, 1, 2)) . ', ' . hexdec(substr($player_color, 3, 2)) . ', ' . hexdec(substr($player_color, 5, 2)) . ')!important;'
				: 'rgba(0, 0, 0, .8)!important;'
			) . ';
		}
		[data-playerid="' . md5($client_id). '"] [data-plyr="pip"] {
			display: '.$player_pip.';
		}

		[data-playerid="' . md5($client_id). '"] .plyr{
			width: ' . esc_attr($attributes['width']) . 'px !important;
			height: ' . esc_attr($attributes['height']) . 'px!important;
			max-height: ' . esc_attr($attributes['height']) . 'px!important;
		}
		';
	}


	$_iscustomlogo = '';

	if(!empty($attributes['customlogo'])){
		$_iscustomlogo = $uniqid.' img.watermark.ep-custom-logo {
			display: block !important;
		}
		

		#ep-gutenberg-content-'. md5($client_id).' img.watermark {
			border: 0;
			position: absolute;
			bottom: '.esc_attr($logoY).'%;
			right: '.esc_attr($logoX).'%;
			max-width: 150px;
			max-height: 75px;
			-o-transition: opacity 0.5s ease-in-out;
			-moz-transition: opacity 0.5s ease-in-out;
			-webkit-transition: opacity 0.5s ease-in-out;
			transition: opacity 0.5s ease-in-out;
			z-index:1;
			opacity: '.esc_attr($logoOpacity).';
		}
		#ep-gutenberg-content-'. md5($client_id).' img.watermark:hover {
			opacity: 1;
		}
		';
	}
	$youtubeStyles = '<style>
		.ose-youtube' . esc_attr($uniqid) . ' {
			width: ' . esc_attr($attributes['width']) . 'px !important;
			height: ' . esc_attr($attributes['height']) . 'px!important;
			max-height: ' . esc_attr($attributes['height']) . 'px !important;
			max-width: 100%;
		}

		.ose-youtube' . esc_attr($uniqid) . '>iframe {
			height: ' . esc_attr($attributes['height']) . 'px !important;
			max-height: ' . esc_attr($attributes['height']) . 'px !important;
			width: 100%;
			position: relative !important;
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
		'.$playerStyle.'

		

	</style>';

	if($attributes['videosize'] == 'responsive') {

		$width = isset($attributes['width']) ? $attributes['width'] : 600;
		$height = $width * (9/16);


		$youtubeStyles = '<style>
		.ose-youtube' . esc_attr($uniqid) . ' {
			position: relative;
			width: ' . esc_attr($attributes['width']) . 'px !important;
			height: ' . esc_attr($height) . 'px !important;
			max-width: 100%;
		  }

		  .ose-wistia{
			height: auto !important;
			padding-top: 0;
		  }

		  .ose-youtube' . esc_attr($uniqid) . ' > iframe {
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
		'.$playerStyle.'

	</style>';
	}

	return $youtubeStyles;
}
?>
