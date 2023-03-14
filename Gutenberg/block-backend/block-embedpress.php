<?php
// Exit if accessed directly.
if (!defined('ABSPATH')) {
	exit;
}
/**
 * It renders gutenberg block of embedpress on the frontend
 * @param array $attributes
 */

 use EmbedPress\Providers\Youtube;
 
 
add_action('wp_ajax_lock_content_form_handler', 'lock_content_form_handler');
add_action('wp_ajax_nopriv_lock_content_form_handler', 'lock_content_form_handler');

function lock_content_form_handler() {
	// print_r($embedHTML);

	$password = $_POST['password'];
	
	// Process the form data and return a response
	$response = array(
	  'success' => true,
	  'password' => $password,
	  'embedHtml' => '<h1>This is emebed htmls</h1>'
	);
	
	echo json_encode($response);
	
	wp_die();
}

//Custom Logo 
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


// Add the password form to the password-form div
function display_password_form($pass_id, $submit_id) {
	echo '<form class="password-form" method="post" class="password-form">';
	echo '<label for="password">Enter the password to view this content:</label>';
	echo '<input type="password" id="password" name="password_'.esc_attr( $pass_id ).'" required>';
	echo '<input type="hidden" name="password_id" value="password_'.esc_attr( $pass_id ).'">';
	echo '<input type="submit" name="password_submit" value="Submit">';
	echo '<div id="password-error" style="display:none;"></div>';
	echo '</form>';
}     
  
// Check if the user has already entered the correct password
function is_password_correct($pass_id) {
	if (isset($_COOKIE['password_correct_'.$pass_id])) {
	  return $_COOKIE['password_correct_'.$pass_id];
	} else {
	  return false;
	}
  }

  function set_password_cookie($pass_id){
 // Check if the password form has been submitted
	setcookie("password_correct_".$pass_id, $_POST['password_'.$pass_id], time()+3600); 
  }

if (isset($_POST['password_submit'])) {
	if (isset($_POST['password']) && !empty($_POST['password'])) {
		setcookie("password_correct_".$_POST['password'], $_POST['password_'.$_POST['password']], time()+3600);
	}
 }

function embedpress_render_block($attributes)
{	
	$pass_id = md5($attributes['clientId']);
	$submit_id = md5($attributes['clientId']);

	if (!empty($attributes['embedHTML'])) {
		$embed         = apply_filters('embedpress_gutenberg_embed', $attributes['embedHTML'], $attributes);
	
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
			<div id="lock-content">

				<?php 
					// if(empty($attributes['lockContent'])){
					// 	echo $embed;
					// }
					// else{

					// 	if (isset($_POST['password_submit']) && isset($_POST['password_'.$pass_id]) && !empty($_POST['password_'.$pass_id])) {
					// 		$password = $_POST['password_'.$pass_id];
					// 		if ($password == $attributes['contentPassword']) {
					// 			echo $embed;
					// 		} else {
					// 		echo '<p class="password-error">Incorrect password. Please try again.</p>';
					// 		display_password_form($pass_id, $submit_id);
					// 		}
					// 	} elseif (is_password_correct($pass_id) && $attributes['contentPassword'] === $_COOKIE['password_correct_'.$pass_id]) {
					// 		echo $embed;
					// 	} else {
					// 		display_password_form($pass_id, $submit_id);
					// 	}
					// }

					if(empty($attributes['lockContent'])){
						echo $embed;
						
					} else {
						display_password_form($pass_id, $submit_id);
					}
					
					// echo json_encode($response);
					
  
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