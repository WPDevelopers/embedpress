<?php

/**
 * Blocks Initializer
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since   1.0.0
 * @package CGB
 */

// Exit if accessed directly.
use EmbedPress\Includes\Classes\Helper;

if (!defined('ABSPATH')) {
	exit;
}


/**
 * Enqueue Gutenberg block assets for both frontend + backend.
 *
 * @uses {wp-editor} for WP editor styles.
 * @since 1.0.0
 */
function embedpress_blocks_cgb_block_assets()
{ // phpcs:ignore
	// Styles.
	wp_enqueue_style(
		'embedpress_blocks-cgb-style-css', // Handle.
		EMBEDPRESS_GUTENBERG_DIR_URL . 'dist/blocks.style.build.css', // Block style CSS.
		is_admin() ? array('wp-editor') : null, // Dependency to include the CSS after it.
		filemtime(EMBEDPRESS_GUTENBERG_DIR_PATH . 'dist/blocks.style.build.css') // Version: File modification time.
	);
}

// Hook: Frontend assets.
add_action('enqueue_block_assets', 'embedpress_blocks_cgb_block_assets');

/**
 * Enqueue Gutenberg block assets for backend editor.
 *
 * @uses {wp-blocks} for block type registration & related functions.
 * @uses {wp-element} for WP Element abstraction — structure of blocks.
 * @uses {wp-i18n} to internationalize the block's text.
 * @uses {wp-editor} for WP editor styles.
 * @since 1.0.0
 */

function embedpress_blocks_cgb_editor_assets()
{ // phpcs:ignore
	// Scripts.
	if (!wp_script_is('embedpress-pdfobject')) {
		wp_enqueue_script(
			'embedpress-pdfobject',
			EMBEDPRESS_URL_ASSETS . 'js/pdfobject.min.js',
			[],
			EMBEDPRESS_VERSION
		);
	}

	wp_enqueue_script(
		'embedpress_blocks-cgb-block-js', // Handle.
		EMBEDPRESS_GUTENBERG_DIR_URL . 'dist/blocks.build.js', // Block.build.js: We register the block here. Built with Webpack.
		array('wp-blocks', 'wp-i18n', 'wp-element', 'wp-api-fetch', 'wp-is-shallow-equal', 'wp-editor', 'wp-components', 'embedpress-pdfobject'), // Dependencies, defined above.
		filemtime(EMBEDPRESS_GUTENBERG_DIR_PATH . 'dist/blocks.build.js'), // Version: File modification time.
		true // Enqueue the script in the footer.
	);
	
	wp_enqueue_script(
		'embedpress_documents_viewer_script', EMBEDPRESS_PLUGIN_DIR_URL . 'assets/js/documents-viewer-script.js', array( 'wp-blocks', 'wp-dom-ready', 'wp-edit-post' ), EMBEDPRESS_PLUGIN_VERSION, true 
	);

	$wistia_labels  = array(
		'watch_from_beginning'       => __('Watch from the beginning', 'embedpress'),
		'skip_to_where_you_left_off' => __('Skip to where you left off', 'embedpress'),
		'you_have_watched_it_before' => __('It looks like you\'ve watched<br />part of this video before!', 'embedpress'),
	);
	$elements = (array) get_option(EMBEDPRESS_PLG_NAME . ":elements", []);
	$active_blocks = isset($elements['gutenberg']) ? (array) $elements['gutenberg'] : [];

	$wistia_labels  = json_encode($wistia_labels);
	$wistia_options = null;
	if (function_exists('embedpress_wisita_pro_get_options')) :
		$wistia_options = embedpress_wisita_pro_get_options();
	endif;
	$pars_url = wp_parse_url(get_site_url());
	$documents_cta_options = (array) get_option(EMBEDPRESS_PLG_NAME . ':document');
	wp_localize_script('embedpress_blocks-cgb-block-js', 'embedpressObj', array(
		'wistia_labels'  => $wistia_labels,
		'wisita_options' => $wistia_options,
		'embedpress_powered_by' => apply_filters('embedpress_document_block_powered_by', true),
		'embedpress_pro' => defined('EMBEDPRESS_PRO_PLUGIN_FILE'),
		'twitch_host' => !empty($pars_url['host']) ? $pars_url['host'] : '',
		'site_url' => site_url(),
		'active_blocks' => $active_blocks,
		'document_cta' => $documents_cta_options,
		'pdf_renderer' => Helper::get_pdf_renderer(),
		'is_pro_plugin_active' => defined('EMBEDPRESS_SL_ITEM_SLUG'),
		'ajaxurl' => admin_url('admin-ajax.php'),
		'source_nonce' => wp_create_nonce('source_nonce_embedpress'),
		'can_upload_media' => current_user_can( 'upload_files' )

	));

	// Styles.
	wp_enqueue_style(
		'embedpress_blocks-cgb-block-editor-css', // Handle.
		EMBEDPRESS_GUTENBERG_DIR_URL . 'dist/blocks.editor.build.css', // Block editor CSS.
		array('wp-edit-blocks'), // Dependency to include the CSS after it.
		filemtime(EMBEDPRESS_GUTENBERG_DIR_PATH . 'dist/blocks.editor.build.css') // Version: File modification time.
	);
}

// Hook: Editor assets.
add_action('enqueue_block_editor_assets', 'embedpress_blocks_cgb_editor_assets');


function embedpress_block_category($categories, $post)
{
	return array_merge(
		$categories,
		array(
			array(
				'slug'  => 'embedpress',
				'title' => 'EmbedPress',
				'icon'  => '',
			),
		)
	);
}
$wp_version = get_bloginfo('version', 'display');
if (version_compare($wp_version, '5.8', '>=')) {
	add_filter('block_categories_all', 'embedpress_block_category', 10, 2);
} else {
	add_filter('block_categories', 'embedpress_block_category', 10, 2);
}




foreach (glob(EMBEDPRESS_GUTENBERG_DIR_PATH . 'block-backend/*.php') as $block_logic) {
	require_once $block_logic;
}

/**
 * Registers the embedpress gutneberg block on server.
 */

function embedpress_gutenberg_register_all_block()
{
	if (function_exists('register_block_type')) :

		$elements = (array) get_option(EMBEDPRESS_PLG_NAME . ":elements", []);
		$g_blocks = isset($elements['gutenberg']) ? (array) $elements['gutenberg'] : [];
		$blocks_to_registers = ['twitch-block', 'google-slides-block', 'google-sheets-block', 'google-maps-block', 'google-forms-block', 'google-drawings-block', 'google-docs-block', 'embedpress', 'embedpress-pdf', 'embedpress-calendar', 'document'];

		foreach ($blocks_to_registers as $blocks_to_register) {
			if (!empty($g_blocks[$blocks_to_register])) {
				if ('embedpress' === $blocks_to_register) {
					register_block_type('embedpress/embedpress', [
						'render_callback' => 'embedpress_render_block',
						'attributes'      => array(
							'clientId' => [
								'type' => 'string',
							],
							'height' => [
								'type' => 'string',
								'default' => '450'
							],
							'width' => [
								'type' => 'string',
								'default' => '600'
							],
							'lockContent' => [
								'type' => 'boolean',
								'default' => false
							],
							'lockHeading' => [
								'type' => 'string',
								'default' => 'Content Locked'
							],
							'lockSubHeading' => [
								'type' => 'string',
								'default' => 'Content is locked and requires password to access it.'
							],
							'lockErrorMessage' => [
								'type' => 'string',
								'default' => 'Oops, that wasn\'t the right password. Try again.'
							],
							'passwordPlaceholder' => [
								'type' => 'string',
								'default' => 'Password'
							],
							'submitButtonText' => [
								'type' => 'string',
								'default' => 'Unlock'
							],
							'submitUnlockingText' => [
								'type' => 'string',
								'default' => 'Unlocking'
							],
							'enableFooterMessage' => [
								'type' => 'boolean',
								'default' => false
							],
							'footerMessage' => [
								'type' => 'string',
								'default' => 'In case you don\'t have the password, kindly reach out to content owner or administrator to request access.'
							],
							'contentPassword' => [
								'type' => 'string',
								'default' => '',
							],
							'contentShare' => [
								'type' => 'boolean',
								'default' => false
							],
							'sharePosition' => [
								'type' => 'string',
								'default' => 'right'
							],
							'customTitle' => [
								'type' => 'string',
								'default' => ''
							],
							'customDescription' => [
								'type' => 'string',
								'default' => ''
							],
							'customThumbnail' => [
								'type' => 'string',
								'default' => ''
							],
							
							'videosize' => [
								'type' => 'string',
								'default' => 'fixed'
							],
							
							'loadmore' => [
								'type' => 'boolean',
								'default' => false
							],
							//Youtube Attributes
							'starttime' => [
								'type' => 'string',
							],
							'endtime' => [
								'type' => 'string',
							],
							'autoplay' => [
								'type' => 'boolean',
								'default' => false
							],
							'controls' => [
								'type' => 'string',
							],
							'progressbarcolor' => [
								'type' => 'string',
							],
							'videoannotations' => [
								'type' => 'string',
							],
							'closedcaptions' => [
								'type' => 'boolean',
								'default' => true
							],
							'relatedvideos' => [
								'type' => 'boolean',
								'default' => true
							],
							'fullscreen' => [
								'type' => 'boolean',
								'default' => true
							],
							
							'modestbranding' => [
								'type' => 'string',
							],
							// custom player attributes
							'customPlayer' => [
								'type' => 'boolean',
								'default' => false
							],
							
							'posterThumbnail' => [
								'type' => 'string',
								'default' => ''
							],
							
							'playerPreset' => [
								'type' => 'string',
								'default' => ''
							],
							
							'playerColor' => [
								'type' => 'string',
								'default' => '#2e2e99'
							],
							
							'playerPip' => [
								'type' => 'boolean',
								'default' => false
							],
							
							'playerRestart' => [
								'type' => 'boolean',
								'default' => true
							],
							
							'playerRewind' => [
								'type' => 'boolean',
								'default' => true
							],
							
							'playerFastForward' => [
								'type' => 'boolean',
								'default' => true
							],
							'playerTooltip' => [
								'type' => 'boolean',
								'default' => true
							],
							'playerHideControls' => [
								'type' => 'boolean',
								'default' => true
							],
							'playerDownload' => [
								'type' => 'boolean',
								'default' => true
							],
							//Wistia Attributes
							'wstarttime' => [
								'type' => 'string',
							],
							'wautoplay' => [
								'type' => 'boolean',
								'default' => true
							],
							'scheme' => [
								'type' => 'string',
							],
							'captions' => [
								'type' => 'boolean',
								'default' => true
							],
							'playbutton' => [
								'type' => 'boolean',
								'default' => true
							],
							'smallplaybutton' => [
								'type' => 'boolean',
								'default' => true
							],
							'playbar' => [
								'type' => 'boolean',
								'default' => true
							],
							'resumable' => [
								'type' => 'boolean',
								'default' => true
							],
							'wistiafocus' => [
								'type' => 'boolean',
								'default' => true
							],
							'volumecontrol' => [
								'type' => 'boolean',
								'default' => true
							],
							'volume' => [
								'type' => 'number',
								'default' => 100
							],
							'rewind' => [
								'type' => 'boolean',
								'default' => false
							],
							'wfullscreen' => [
								'type' => 'boolean',
								'default' => true
							],

							// Vimeo attributes
							'vstarttime' => [
								'type' => 'string',
							],
							'vautoplay' => [
								'type' => 'boolean',
								'default' => false
							],
							'vscheme' => [
								'type' => 'string',
							],
							'vtitle' => [
								'type' => 'boolean',
								'default' => true
							],
							'vauthor' => [
								'type' => 'boolean',
								'default' => true
							],
							'vavatar' => [
								'type' => 'boolean',
								'default' => true
							],
							'vloop' => [
								'type' => 'boolean',
								'default' => false
							],
							'vautopause' => [
								'type' => 'boolean',
								'default' => false
							],
							'vdnt' => [
								'type' => 'boolean',
								'default' => false
							],

							// Calendly attributes
							'cEmbedType' => array(
								'type' => 'string',
								'default' => 'inline'
							),
							'calendlyData' => array(
								'type' => 'boolean',
								'default' => false
							),
							'hideCookieBanner' => array(
								'type' => 'boolean',
								'default' => false
							),
							'hideEventTypeDetails' => array(
								'type' => 'boolean',
								'default' => false
							),
							'cBackgroundColor' => array(
								'type' => 'string',
								'default' => 'ffffff'
							),
							'cTextColor' => array(
								'type' => 'string',
								'default' => '1A1A1A'
							),
							'cButtonLinkColor' => array(
								'type' => 'string',
								'default' => '0000FF'
							),
							'cPopupButtonText' => array(
								'type' => 'string',
								'default' => 'Schedule time with me'
							),
							'cPopupButtonBGColor' => array(
								'type' => 'string',
								'default' => '#0000FF'
							),
							'cPopupButtonTextColor' => array(
								'type' => 'string',
								'default' => '#FFFFFF'
							),
							'cPopupLinkText' => array(
								'type' => 'string',
								'default' => 'Schedule time with me'
							),

							//Ad attributes
							'adManager' => [
								'type' => 'boolean',
								'default' => false
							],
							'adSource' => [
								'type' => 'string',
								'default' => 'video'
							],
							'adContent' => [
								'type' => 'object',
							],
							'adWidth' => array(
								'type' => 'string',
								'default' => '300'
							),
							'adHeight' => array(
								'type' => 'string',
								'default' => '200'
							),
							'adXPosition' => array(
								'type' => 'number',
								'default' => 25
							),
							'adYPosition' => array(
								'type' => 'number',
								'default' => 10
							),
							'adUrl' => [
								'type' => 'string',
								'default' => ''
							],
							'adStart' => [
								'type' => 'string',
								'default' => '10'
							],
							'adSkipButton' => [
								'type' => 'boolean',
								'default' => true
							],
							'adSkipButtonAfter' => [
								'type' => 'string',
								'default' => '5'
							]

						),
					]);
				} elseif ('embedpress-pdf' === $blocks_to_register) {
					register_block_type('embedpress/embedpress-pdf', [
						'attributes'      => array(
							'powered_by' => [
								'type' => 'boolean',
								'default' => true
							],
							'lockContent' => [
								'type' => 'boolean',
								'default' => false
							],
							'lockHeading' => [
								'type' => 'string',
								'default' => 'Content Locked'
							],
							'lockSubHeading' => [
								'type' => 'string',
								'default' => 'Content is locked and requires password to access it.'
							],
							'passwordPlaceholder' => [
								'type' => 'string',
								'default' => 'Password'
							],
							'submitButtonText' => [
								'type' => 'string',
								'default' => 'Unlock'
							],
							'submitUnlockingText' => [
								'type' => 'string',
								'default' => 'Unlocking'
							],
							'lockErrorMessage' => [
								'type' => 'string',
								'default' => 'Oops, that wasn\'t the right password. Try again.'
							],
							'enableFooterMessage' => [
								'type' => 'boolean',
								'default' => false
							],
							'footerMessage' => [
								'type' => 'string',
								'default' => 'In case you don\'t have the password, kindly reach out to content owner or administrator to request access.'
							],
							'contentPassword' => [
								'type' => 'string',
								'default' => ''
							],
							'contentShare' => [
								'type' => 'boolean',
								'default' => false
							],
							'sharePosition' => [
								'type' => 'string',
								'default' => 'right'
							],
							'presentation' => [
								'type' => "boolean",
								'default' => true,
							],

							'position' => [
								'type' => "string",
								'default' => 'top',
							],

							'print' => [
								'type' => "boolean",
								'default' => true,
							],

							'download' => [
								'type' => "boolean",
								'default' => true,
							],
							'open' => [
								'type' => "boolean",
								'default' => true,
							],
							'copy_text' => [
								'type' => "boolean",
								'default' => true,
							],
							'add_text' => [
								'type' => "boolean",
								'default' => true,
							],
							'draw' => [
								'type' => "boolean",
								'default' => true,
							],
							'toolbar' => [
								'type' => "boolean",
								'default' => true,
							],
							'doc_details' => [
								'type' => "boolean",
								'default' => true,
							],
							'doc_rotation' => [
								'type' => "boolean",
								'default' => true,
							],
							'unitoption' => [
								'type' => "string",
								'default' => '%',
							],

							//Ad attributes
							'adManager' => [
								'type' => 'boolean',
								'default' => false
							],
							'adSource' => [
								'type' => 'string',
								'default' => 'video'
							],
							'adContent' => [
								'type' => 'object',
							],
							'adWidth' => array(
								'type' => 'string',
								'default' => '300'
							),
							'adHeight' => array(
								'type' => 'string',
								'default' => '200'
							),
							'adXPosition' => array(
								'type' => 'number',
								'default' => 25
							),
							'adYPosition' => array(
								'type' => 'number',
								'default' => 20
							),
							'adUrl' => [
								'type' => 'string',
								'default' => ''
							],
							'adStart' => [
								'type' => 'string',
								'default' => '10'
							],
							'adSkipButton' => [
								'type' => 'boolean',
								'default' => true
							],
							'adSkipButtonAfter' => [
								'type' => 'string',
								'default' => '5'
							]
						),
						'render_callback' => 'embedpress_pdf_render_block',
					]);
				} elseif ('embedpress-calendar' === $blocks_to_register) {
					register_block_type('embedpress/embedpress-calendar', [
						'render_callback' => 'embedpress_calendar_render_block',
					]);
				} else {
					register_block_type('embedpress/' . $blocks_to_register);
				}
			} else {

				if (WP_Block_Type_Registry::get_instance()->is_registered('embedpress/' . $blocks_to_register)) {
					unregister_block_type('embedpress/' . $blocks_to_register);
				}
			}
		}

	endif;
}

add_action('init', 'embedpress_gutenberg_register_all_block');

function getParamData($attributes)
{

	$urlParamData = array(
		'themeMode' =>  !empty($attributes['themeMode']) ? $attributes['themeMode'] : 'default',
		'toolbar' =>  !empty($attributes['toolbar']) ? 'true' : 'false',
		'position' =>  $attributes['position'],
		'presentation' =>  !empty($attributes['presentation']) ? 'true' : 'false',
		'download' =>  !empty($attributes['download']) ? 'true' : 'false',
		'copy_text' =>  !empty($attributes['copy_text']) ? 'true' : 'false',
		'add_text' =>  !empty($attributes['add_text']) ? 'true' : 'false',
		'draw' =>  !empty($attributes['draw']) ? 'true' : 'false',
		'doc_rotation' => !empty($attributes['doc_rotation']) ? 'true' : 'false',
		'doc_details' =>  !empty($attributes['doc_details']) ? 'true' : 'false',
	);

	if($urlParamData['themeMode'] == 'custom') {
		$urlParamData['customColor'] = !empty($attributes['customColor']) ? $attributes['customColor'] : '#403A81';
	}

	return "#key=" . base64_encode(mb_convert_encoding(http_build_query($urlParamData), 'UTF-8'));

}

function embedpress_pdf_render_block($attributes)
{


if (!empty($attributes['href'])) {
	$renderer = Helper::get_pdf_renderer();
	$pdf_url = $attributes['href'];
	$id = !empty($attributes['id']) ? $attributes['id'] : 'embedpress-pdf-' . rand(100, 10000);
	$client_id = md5($id);
	

	$unitoption = !empty($attributes['unitoption']) ? $attributes['unitoption'] : 'px';
	$width = !empty($attributes['width']) ? $attributes['width'] . $unitoption : '600px';
	
	if($unitoption == '%'){
		$width_class = ' ep-percentage-width';
	}
	else{
		$width_class = 'ep-fixed-width';
	}
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

	
	
	$height = !empty($attributes['height']) ? $attributes['height'] . 'px' : '600px';
	$gen_settings    = get_option(EMBEDPRESS_PLG_NAME);

	$powered_by = isset($gen_settings['embedpress_document_powered_by']) && 'yes' === $gen_settings['embedpress_document_powered_by'];
	if (isset($attributes['powered_by'])) {
		$powered_by = $attributes['powered_by'];
	}

	$src = $renderer . ((strpos($renderer, '?') == false) ? '?' : '&') . 'file=' . urlencode($attributes['href']) . getParamData($attributes);

	$pass_hash_key = isset($attributes['contentPassword']) ? md5($attributes['contentPassword']): ''; 

	$aligns = [
		'left' => 'ep-alignleft',
		'right' => 'ep-alignright',
		'center' => 'ep-aligncenter',
		'wide' => 'ep-alignwide',
		'full' => 'ep-alignfull'
	];
	$alignment = isset($attributes['align']) && isset($aligns[$attributes['align']]) ? $aligns[$attributes['align']] : '';
	$dimension = "width:$width;height:$height";
	ob_start();
	?>


	<?php

		$embed_code = '<iframe title="' . esc_attr(Helper::get_file_title($attributes['href'])) . '" class="embedpress-embed-document-pdf ' . esc_attr($id) . '" style="' . esc_attr($dimension) . '; max-width:100%; display: inline-block" src="' . esc_url($src) . '" frameborder="0" oncontextmenu="return false;"></iframe> ';
			
		if ($powered_by) {
			$embed_code .= sprintf('<p class="embedpress-el-powered">%s</p>', __('Powered By EmbedPress', 'embedpress'));
		}
		
		$url = !empty($attributes['href']) ? $attributes['href'] : '';

		$adsAtts = '';
		if(!empty($attributes['adManager'])) {
			$ad = base64_encode(json_encode($attributes));
			$adsAtts = "data-ad-id=$client_id data-ad-attrs=$ad class=ad-mask";
		}
	?>

	<div id="ep-gutenberg-content-<?php echo esc_attr( $client_id )?>" class="ep-gutenberg-content <?php echo  esc_attr( $alignment.' '.$width_class.' '.$content_share_class.' '.$share_position_class.' '.$content_protection_class);  ?> ">
		<div class="embedpress-inner-iframe <?php if ($unitoption === '%') { echo esc_attr('emebedpress-unit-percent'); }  ?> ep-doc-<?php echo esc_attr($client_id); ?>"<?php if ($unitoption === '%' && !empty($attributes['width'])) { $style_attr = 'max-width:' . $attributes['width'] . '%'; } else { $style_attr = 'max-width:100%'; } ?> style="<?php echo esc_attr($style_attr); ?>" id="<?php echo esc_attr($id); ?>">
			<div <?php echo esc_attr( $adsAtts ); ?> >
				<?php 
					do_action('embedpress_pdf_gutenberg_after_embed',  $client_id, 'pdf', $attributes, $pdf_url);
					$embed = $embed_code;
					if(empty($attributes['lockContent']) || empty($attributes['contentPassword']) || (!empty(Helper::is_password_correct($client_id)) && ($hash_pass === $password_correct)) ){
						
						$custom_thumbnail = isset($attributes['customThumbnail']) ? $attributes['customThumbnail'] : '';
						
						echo '<div class="ep-embed-content-wraper">';
							$embed = '<div class="position-'.esc_attr( $share_position ).'-wraper gutenberg-pdf-wraper">';
							$embed .= $embed_code;
							$embed.= '</div>';
							
							if(!empty($attributes['contentShare'])) {
								$content_id = $attributes['id'];
								$embed .= Helper::embed_content_share($content_id, $attributes);
							}
							echo $embed;
						echo '</div>';
					} else {
						if(!empty($attributes['contentShare'])) {
							$content_id = $attributes['clientId'];
							$embed = '<div class="position-'.esc_attr( $share_position ).'-wraper gutenberg-pdf-wraper">';
							$embed .= $embed_code;
							$embed.= '</div>';	
							$embed .= Helper::embed_content_share($content_id, $attributes);
						}
						echo '<div class="ep-embed-content-wraper">';
								Helper::display_password_form($client_id, $embed, $pass_hash_key, $attributes);
						echo '</div>';
					}
				?>

				<?php 
					if(!empty($attributes['adManager'])) {
						$embed .= Helper::generateAdTemplate($client_id, $attributes, 'gutenberg');
					}
				?>
			</div>			
		</div>
	</div>
<?php
		return ob_get_clean();
	}
}

function embedpress_calendar_render_block($attributes)
{

	$id = !empty($attributes['id']) ? $attributes['id'] : 'embedpress-calendar-' . rand(100, 10000);
	$url = !empty($attributes['url']) ? $attributes['url'] : '';
	$is_private = isset($attributes['is_public']);
	$client_id = md5($id);
	$width = !empty($attributes['width']) ? $attributes['width'] . 'px' : '600px';
	$height = !empty($attributes['height']) ? $attributes['height'] . 'px' : '600px';
	$gen_settings    = get_option(EMBEDPRESS_PLG_NAME);
	$powered_by = isset($gen_settings['embedpress_document_powered_by']) && 'yes' === $gen_settings['embedpress_document_powered_by'];
	if (isset($attributes['powered_by'])) {
		$powered_by = $attributes['powered_by'];
	}

	$aligns = [
		'left' => 'alignleft',
		'right' => 'alignright',
		'wide' => 'alignwide',
		'full' => 'alignfull'
	];
	$alignment = isset($attributes['align']) && isset($aligns[$attributes['align']]) ? $aligns[$attributes['align']] : '';
	$dimension = "width:$width;height:$height";
	ob_start();
	?>
<div class="embedpress-calendar-gutenberg embedpress-calendar ose-calendar <?php echo esc_attr($alignment) ?>" style="<?php echo esc_attr($dimension); ?>; max-width:100%;">

	<?php
		if (!empty($url) && !$is_private) {
			?>
		<iframe title="<?php echo esc_attr(Helper::get_file_title($url)); ?>" style="<?php echo esc_attr($dimension); ?>; max-width:100%; display: inline-block" src="<?php echo esc_url($url); ?>"></iframe>
	<?php } else {
			if (is_embedpress_pro_active()) {
				echo Embedpress_Google_Helper::shortcode();
			}
		} ?>
	<?php do_action('embedpress_calendar_gutenberg_after_embed',  $client_id, 'calendar', $attributes); ?>

	<?php
		if ($powered_by) {
			printf('<p class="embedpress-el-powered" style="width:' . esc_attr($width) . '" >%s</p>', __('Powered By EmbedPress', 'embedpress'));
		} ?>

</div>
<?php
	return ob_get_clean();
}