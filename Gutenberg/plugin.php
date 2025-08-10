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
	wp_register_style(
		'embedpress_blocks-cgb-style-css', // Handle.
		EMBEDPRESS_GUTENBERG_DIR_URL . 'dist/blocks.style.build.css', // Block style CSS.
		is_admin() ? array('wp-editor') : null, // Dependency to include the CSS after it.
		filemtime(EMBEDPRESS_GUTENBERG_DIR_PATH . 'dist/blocks.style.build.css') // Version: File modification time.
	);
}

// Hook: Frontend assets.
add_action('enqueue_block_assets', 'embedpress_blocks_cgb_block_assets');

if (!function_exists('get_options_value')) {


	 function get_options_value($key)
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
}
if (!function_exists('get_branding_value')) {
	function get_branding_value($key, $provider)
	{
		$settings = get_option(EMBEDPRESS_PLG_NAME . ':' . $provider, []);

		if (isset($settings['branding']) && $settings['branding'] === 'yes'  && isset($settings[$key])) {
			return $settings[$key];
		}
		return '';
	}
}


/**
 * Enqueue Gutenberg block assets for backend editor.
 *
 * @uses {wp-blocks} for block type registration & related functions.
 * @uses {wp-element} for WP Element abstraction — structure of blocks.
 * @uses {wp-i18n} to internationalize the block's text.
 * @uses {wp-editor} for WP editor styles.
 * @since 1.0.0
 */

if (!function_exists('embedpress_get_user_roles')) {
	function embedpress_get_user_roles()
	{
		global $wp_roles; // Access global roles object
		$user_roles = [];

		if (isset($wp_roles->roles) && is_array($wp_roles->roles)) {
			foreach ($wp_roles->roles as $role_key => $role_data) {
				$user_roles[] = [
					'value' => $role_key,       // Machine-readable key
					'label' => $role_data['name'], // Human-readable name
				];
			}
		}

		return $user_roles;
	}
}

function embedpress_blocks_cgb_editor_assets()
{ // phpcs:ignore
	// Scripts.

	$elements = (array) get_option(EMBEDPRESS_PLG_NAME . ":elements", []);
	$g_blocks = isset($elements['gutenberg']) ? (array) $elements['gutenberg'] : [];

	if (!wp_script_is('embedpress-pdfobject')) {
		wp_enqueue_script(
			'embedpress-pdfobject',
			EMBEDPRESS_URL_ASSETS . 'js/pdfobject.js',
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

	if (!empty($g_blocks['document'])) {
		wp_enqueue_script(
			'embedpress_documents_viewer_script',
			EMBEDPRESS_PLUGIN_DIR_URL . 'assets/js/documents-viewer-script.js',
			array('wp-blocks', 'wp-dom-ready', 'wp-edit-post'),
			EMBEDPRESS_PLUGIN_VERSION,
			true
		);
	}

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
	$current_user = wp_get_current_user();

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
		'can_upload_media' => current_user_can('upload_files'),
		'EMBEDPRESS_URL_ASSETS' => EMBEDPRESS_URL_ASSETS,
		'iframe_width' => get_options_value('enableEmbedResizeWidth'),
		'iframe_height' => get_options_value('enableEmbedResizeHeight'),
		'pdf_custom_color' => get_options_value('custom_color'),
		'pdf_custom_color' => get_options_value('custom_color'),
		'youtube_brand_logo_url' => get_branding_value('logo_url', 'youtube'),
		'vimeo_brand_logo_url' => get_branding_value('logo_url', 'vimeo'),
		'wistia_brand_logo_url' => get_branding_value('logo_url', 'wistia'),
		'twitch_brand_logo_url' => get_branding_value('logo_url', 'twitch'),
		'dailymotion_brand_logo_url' => get_branding_value('logo_url', 'dailymotion'),
		'user_roles' => embedpress_get_user_roles(),
		'current_user' => $current_user->data,
		'is_embedpress_feedback_submited' => get_option('embedpress_feedback_submited'),
		'turn_off_rating_help' => get_options_value('turn_off_rating_help'),

	));

	// Styles.
	wp_enqueue_style(
		'embedpress_blocks-cgb-block-editor-css', // Handle.
		EMBEDPRESS_GUTENBERG_DIR_URL . 'dist/blocks.editor.build.css', // Block editor CSS.
		array('wp-edit-blocks'), // Dependency to include the CSS after it.
		filemtime(EMBEDPRESS_GUTENBERG_DIR_PATH . 'dist/blocks.editor.build.css') // Version: File modification time.
	);
	wp_enqueue_style('embedpress_blocks-cgb-style-css');
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
						// 'style' => [
						// 	'plyr',
						// ],
						// 'script' => [
						// 	'plyr.polyfilled',
						// 	'initplyr',
						// 	'vimeo-player',
						// 	'embedpress-front',
						// 	'embedpress-ads',
						// ],
						'attributes'      => array(
							'clientId' => [
								'type' => 'string',
							],
							'height' => [
								'type' => 'string',
								'default' => get_options_value('enableEmbedResizeHeight')
							],
							'width' => [
								'type' => 'string',
								'default' => get_options_value('enableEmbedResizeWidth')
							],
							'lockContent' => [
								'type' => 'boolean',
								'default' => false
							],
							'protectionType' => [
								'type' => 'string',
								'default' => 'password'
							],
							'userRole' => [
								'type' => 'array',
								'default' => []
							],
							'protectionMessage' => [
								'type' => 'string',
								'default' => 'You do not have access to this content. Only users with the following roles can view it: [user_roles]'
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
							'shareFacebook' => [
								'type' => 'boolean',
								'default' => true
							],
							'shareTwitter' => [
								'type' => 'boolean',
								'default' => true
							],
							'sharePinterest' => [
								'type' => 'boolean',
								'default' => true
							],
							'shareLinkedin' => [
								'type' => 'boolean',
								'default' => true
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
							'muteVideo' => [
								'type' => 'boolean',
								'default' => true
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
							'pagesize' => [
								'type' => 'number',
							],
							// custom player attributes
							'autoPause' => [
								'type' => 'boolean',
								'default' => false
							],
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

							// instaFeed attributes
							'instaLayout' => [
								'type' => 'string',
								'default' => 'insta-grid',
							],
							'instafeedFeedType' => [
								'type' => 'string',
								'default' => 'user_account_type',
							],
							'instafeedAccountType' => [
								'type' => 'string',
								'default' => 'personal',
							],
							'instafeedProfileImage' => [
								'type' => 'boolean',
								'default' => true,
							],
							'instafeedProfileImageUrl' => [
								'type' => 'string',
								'default' => '',
							],
							'instafeedFollowBtn' => [
								'type' => 'boolean',
								'default' => true,
							],
							'instafeedFollowBtnLabel' => [
								'type' => 'string',
								'default' => 'Follow',
							],
							'instafeedPostsCount' => [
								'type' => 'boolean',
								'default' => true,
							],
							'instafeedPostsCountText' => [
								'type' => 'string',
								'default' => '[count] posts',
							],
							'instafeedFollowersCount' => [
								'type' => 'boolean',
								'default' => true,
							],
							'instafeedFollowersCountText' => [
								'type' => 'string',
								'default' => '[count] followers',
							],
							'instafeedAccName' => [
								'type' => 'boolean',
								'default' => true,
							],
							'instafeedColumns' => [
								'type' => 'string',
								'default' => '3',
							],
							'instafeedColumnsGap' => [
								'type' => 'string',
								'default' => '5',
							],
							'instafeedPostsPerPage' => [
								'type' => 'string',
								'default' => '12',
							],
							'instafeedTab' => [
								'type' => 'boolean',
								'default' => true,
							],
							'instafeedLikesCount' => [
								'type' => 'boolean',
								'default' => true,
							],
							'instafeedCommentsCount' => [
								'type' => 'boolean',
								'default' => true,
							],
							'instafeedPopup' => [
								'type' => 'boolean',
								'default' => true,
							],
							'instafeedPopupFollowBtn' => [
								'type' => 'boolean',
								'default' => true,
							],
							'instafeedPopupFollowBtnLabel' => [
								'type' => 'string',
								'default' => 'Follow',
							],
							'instafeedLoadmore' => [
								'type' => 'boolean',
								'default' => true,
							],
							'instafeedLoadmoreLabel' => [
								'type' => 'string',
								'default' => 'Load More',
							],
							'slidesShow' => [
								'type' => 'string',
								'default' => '4',
							],
							'slidesScroll' => [
								'type' => 'string',
								'default' => '4',
							],
							'carouselAutoplay' => [
								'type' => 'boolean',
								'default' => false,
							],
							'autoplaySpeed' => [
								'type' => 'string',
								'default' => '3000',
							],
							'transitionSpeed' => [
								'type' => 'string',
								'default' => '1000',
							],
							'carouselLoop' => [
								'type' => 'boolean',
								'default' => true,
							],
							'carouselArrows' => [
								'type' => 'boolean',
								'default' => true,
							],
							'carouselSpacing' => [
								'type' => 'string',
								'default' => '0',
							],
							'carouselDots' => [
								'type' => 'boolean',
								'default' => false,
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
							'clientId' => [
								'type' => 'string',
							],
							// 'height' => [
							// 	'type' => 'string',
							// 	'default' => (int) get_options_value('enableEmbedResizeHeight')
							// ],
							// 'width' => [
							// 	'type' => 'string',
							// 	'default' =>  (int) get_options_value('enableEmbedResizeWidth')
							// ],
							'customColor' => [
								'type' => 'string',
								'default' => get_options_value('custom_color')
							],
							'powered_by' => [
								'type' => 'boolean',
								'default' => true
							],
							'lockContent' => [
								'type' => 'boolean',
								'default' => false
							],
							'protectionType' => [
								'type' => 'string',
								'default' => 'password'
							],
							'userRole' => [
								'type' => 'array',
								'default' => []
							],
							'protectionMessage' => [
								'type' => 'string',
								'default' => 'You do not have access to this content. Only users with the following roles can view it: [user_roles]'
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
							'shareFacebook' => [
								'type' => 'boolean',
								'default' => true
							],
							'shareTwitter' => [
								'type' => 'boolean',
								'default' => true
							],
							'sharePinterest' => [
								'type' => 'boolean',
								'default' => true
							],
							'shareLinkedin' => [
								'type' => 'boolean',
								'default' => true
							],
							'presentation' => [
								'type' => "boolean",
								'default' => true,
							],
							'lazyLoad' => [
								'type' => "boolean",
								'default' => false,
							],

							'position' => [
								'type' => "string",
								'default' => 'top',
							],
							'flipbook_toolbar_position' => [
								'type' => "string",
								'default' => 'bottom',
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
							'selection_tool' => [
								'type' => "string",
								'default' => '0',
							],
							'scrolling' => [
								'type' => "string",
								'default' => '-1',
							],
							'spreads' => [
								'type' => "string",
								'default' => '-1',
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
							'add_image' => [
								'type' => "boolean",
								'default' => true,
							],
							'unitoption' => [
								'type' => "string",
								'default' => '%',
							],
							'zoomIn' => [
								'type' => "boolean",
								'default' => true,
							],
							'zoomOut' => [
								'type' => "boolean",
								'default' => true,
							],
							'fitView' => [
								'type' => "boolean",
								'default' => true,
							],
							'bookmark' => [
								'type' => "boolean",
								'default' => true,
							],
							//Spreaker
							'theme' => array(
								'type' => 'string',
								'default' => 'light',
							),
							'color' => array(
								'type' => 'string',
								'default' => '',
							),
							'coverImageUrl' => array(
								'type' => 'string',
								'default' => '',
							),
							'playlist' => array(
								'type' => 'boolean',
								'default' => false,
							),
							'playlistContinuous' => array(
								'type' => 'boolean',
								'default' => false,
							),
							'playlistLoop' => array(
								'type' => 'boolean',
								'default' => false,
							),
							'playlistAutoupdate' => array(
								'type' => 'boolean',
								'default' => true,
							),
							'chaptersImage' => array(
								'type' => 'boolean',
								'default' => true,
							),
							'episodeImagePosition' => array(
								'type' => 'string',
								'default' => 'right',
							),
							'hideLikes' => array(
								'type' => 'boolean',
								'default' => false,
							),
							'hideComments' => array(
								'type' => 'boolean',
								'default' => false,
							),
							'hideSharing' => array(
								'type' => 'boolean',
								'default' => false,
							),
							'hideLogo' => array(
								'type' => 'boolean',
								'default' => false,
							),
							'hideEpisodeDescription' => array(
								'type' => 'boolean',
								'default' => false,
							),
							'hidePlaylistDescriptions' => array(
								'type' => 'boolean',
								'default' => false,
							),
							'hidePlaylistImages' => array(
								'type' => 'boolean',
								'default' => false,
							),
							'hideDownload' => array(
								'type' => 'boolean',
								'default' => false,
							),
							'mode' => array(
								'type' => 'string',
								'default' => 'carousel'
							),
							'imageWidth' => array(
								'type' => 'number',
								'default' => 800
							),
							'imageHeight' => array(
								'type' => 'number',
								'default' => 600
							),
							'playerAutoplay' => array(
								'type' => 'boolean',
								'default' => false
							),
							'delay' => array(
								'type' => 'number',
								'default' => 5
							),
							'repeat' => array(
								'type' => 'boolean',
								'default' => true
							),
							'mediaitemsAspectRatio' => array(
								'type' => 'boolean',
								'default' => true
							),
							'mediaitemsEnlarge' => array(
								'type' => 'boolean',
								'default' => false
							),
							'mediaitemsStretch' => array(
								'type' => 'boolean',
								'default' => false
							),
							'mediaitemsCover' => array(
								'type' => 'boolean',
								'default' => false
							),
							'backgroundColor' => array(
								'type' => 'string',
								'default' => ''
							),
							'expiration' => array(
								'type' => 'number',
								'default' => 60
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
				} elseif ('document' === $blocks_to_register) {
					register_block_type('embedpress/' . $blocks_to_register, [
						// 'render_callback' => 'embedpress_document_render_block',
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
		'position' =>  $attributes['position'] ?? 'top',
		'presentation' =>  !empty($attributes['presentation']) ? 'true' : 'false',
		'lazyLoad' =>  !empty($attributes['lazyLoad']) ? 'true' : 'false',
		'download' =>  !empty($attributes['download']) ? 'true' : 'false',
		'copy_text' =>  !empty($attributes['copy_text']) ? 'true' : 'false',
		'add_text' =>  !empty($attributes['add_text']) ? 'true' : 'false',
		'draw' =>  !empty($attributes['draw']) ? 'true' : 'false',
		'doc_rotation' => !empty($attributes['doc_rotation']) ? 'true' : 'false',
		'add_image' => !empty($attributes['add_image']) ? 'true' : 'false',
		'doc_details' =>  !empty($attributes['doc_details']) ? 'true' : 'false',
		'zoom_in' =>  !empty($attributes['zoomIn'])  ? 'true' : 'false',
		'zoom_out' => !empty($attributes['zoomOut'])  ? 'true' : 'false',
		'fit_view' => !empty($attributes['fitView'])  ? 'true' : 'false',
		'bookmark' => !empty($attributes['bookmark'])  ? 'true' : 'false',
		'flipbook_toolbar_position' => !empty($attributes['flipbook_toolbar_position'])  ? $attributes['flipbook_toolbar_position'] : 'bottom',
		'selection_tool' => isset($attributes['selection_tool']) ? esc_attr($attributes['selection_tool']) : '0',
		'scrolling' => isset($attributes['scrolling']) ? esc_attr($attributes['scrolling']) : '-1',
		'spreads' => isset($attributes['spreads']) ? esc_attr($attributes['spreads']) : '-1',
	);

	if ($urlParamData['themeMode'] == 'custom') {
		$urlParamData['customColor'] = !empty($attributes['customColor']) ? $attributes['customColor'] : '#403A81';
	}

	if (isset($attributes['viewerStyle']) && $attributes['viewerStyle'] == 'flip-book') {
		return "&key=" . base64_encode(mb_convert_encoding(http_build_query($urlParamData), 'UTF-8'));
	}

	return "#key=" . base64_encode(mb_convert_encoding(http_build_query($urlParamData), 'UTF-8'));
}

function embedpress_pdf_block_scripts($attributes)
{

	$script_handles = [];

	$script_handles[] = 'embedpress-pdfobject';
	$script_handles[] = 'embedpress-remove-round-button';
	$script_handles[] = 'embedpress-front';

	if (!empty($attributes['adManager'])) {
		$script_handles[] = 'embedpress-ads';
	}

	foreach ($script_handles as $handle) {
		wp_enqueue_script($handle);
	}

	$style_handles = [
		'embedpress_blocks-cgb-style-css',
		'embedpress-style'
	];

	foreach ($style_handles as $handle) {
		wp_enqueue_style($handle, false, [], EMBEDPRESS_PLUGIN_VERSION);
	}
}

if (!function_exists('has_content_allowed_roles')) {
	function has_content_allowed_roles($allowed_roles = [])
	{

		if ((count($allowed_roles) === 1 && empty($allowed_roles[0]))) {
			return true;
		}

		$current_user = wp_get_current_user();
		$user_roles = $current_user->roles;

		return !empty(array_intersect($user_roles, $allowed_roles));
	}
}



function embedpress_pdf_render_block($attributes)
{
	embedpress_pdf_block_scripts($attributes);

	if (!empty($attributes['href'])) {
		$renderer = Helper::get_pdf_renderer();
		$pdf_url = $attributes['href'];
		$id = !empty($attributes['id']) ? $attributes['id'] : 'embedpress-pdf-' . rand(100, 10000);
		$client_id = md5($id);


		$unitoption = !empty($attributes['unitoption']) ? $attributes['unitoption'] : 'px';
		$width = !empty($attributes['width']) ? $attributes['width'] . $unitoption : (get_options_value('enableEmbedResizeWidth') ?: 600) . 'px';


		if ($unitoption == '%') {
			$width_class = ' ep-percentage-width';
		} else {
			$width_class = 'ep-fixed-width';
		}
		$content_share_class = '';
		$share_position_class = '';
		$share_position = isset($attributes['sharePosition']) ? $attributes['sharePosition'] : 'right';

		if (!empty($attributes['contentShare'])) {
			$content_share_class = 'ep-content-share-enabled';
			$share_position_class = 'ep-share-position-' . $share_position;
		}

		$password_correct = isset($_COOKIE['password_correct_' . $client_id]) ? $_COOKIE['password_correct_' . $client_id] : '';
		$hash_pass = hash('sha256', wp_salt(32) . md5(isset($attributes['contentPassword']) ? $attributes['contentPassword'] : ''));


		$content_protection_class = 'ep-content-protection-enabled';
		if (empty($attributes['lockContent']) || empty($attributes['contentPassword']) || $hash_pass === $password_correct) {
			$content_protection_class = 'ep-content-protection-disabled';
		}


		$height = !empty($attributes['height'])
			? $attributes['height'] . 'px'
			: (get_options_value('enableEmbedResizeHeight') ?: 600) . 'px';

		$gen_settings    = get_option(EMBEDPRESS_PLG_NAME);

		$powered_by = isset($gen_settings['embedpress_document_powered_by']) && 'yes' === $gen_settings['embedpress_document_powered_by'];
		if (isset($attributes['powered_by'])) {
			$powered_by = $attributes['powered_by'];
		}

		$src = $renderer . ((strpos($renderer, '?') == false) ? '?' : '&') . 'file=' . urlencode($attributes['href']) . getParamData($attributes);

		$pass_hash_key = isset($attributes['contentPassword']) ? md5($attributes['contentPassword']) : '';

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

				$url = !empty($attributes['href']) ? $attributes['href'] : '';

				$embed_code = '<iframe title="' . esc_attr(Helper::get_file_title($attributes['href'])) . '" class="embedpress-embed-document-pdf ' . esc_attr($id) . '" style="' . esc_attr($dimension) . '; max-width:100%; display: inline-block" src="' . esc_url($src) . '" frameborder="0" oncontextmenu="return false;"></iframe> ';

				if (isset($attributes['viewerStyle']) && $attributes['viewerStyle'] === 'flip-book') {
					$src = urlencode($url) . getParamData($attributes);
					$embed_code = '<iframe title="' . esc_attr(Helper::get_file_title($attributes['href'])) . '" class="embedpress-embed-document-pdf ' . esc_attr($id) . '" style="' . esc_attr($dimension) . '; max-width:100%; display: inline-block" src="' . esc_url(EMBEDPRESS_URL_ASSETS . 'pdf-flip-book/viewer.html?file=' . $src) . '" frameborder="0" oncontextmenu="return false;"></iframe> ';
				}
				if ($powered_by) {
					$embed_code .= sprintf('<p class="embedpress-el-powered">%s</p>', __('Powered By EmbedPress', 'embedpress'));
				}

				$adsAtts = '';
				if (!empty($attributes['adManager'])) {
					$ad = base64_encode(json_encode($attributes));
					$adsAtts = "data-sponsored-id=$client_id data-sponsored-attrs=$ad class=sponsored-mask";
				}
				?>

		<div id="ep-gutenberg-content-<?php echo esc_attr($client_id) ?>" class="ep-gutenberg-content <?php echo  esc_attr($alignment . ' ' . $width_class . ' ' . $content_share_class . ' ' . $share_position_class . ' ' . $content_protection_class);  ?> ">
			<div class="embedpress-inner-iframe <?php if ($unitoption === '%') {
															echo esc_attr('emebedpress-unit-percent');
														}  ?> ep-doc-<?php echo esc_attr($client_id); ?>" <?php if ($unitoption === '%' && !empty($attributes['width'])) {
																														$style_attr = 'max-width:' . $attributes['width'] . '%';
																													} else {
																														$style_attr = 'max-width:100%';
																													} ?> style="<?php echo esc_attr($style_attr); ?>" id="<?php echo esc_attr($id); ?>">
				<div <?php echo esc_attr($adsAtts); ?>>
					<?php
							do_action('embedpress_pdf_gutenberg_after_embed',  $client_id, 'pdf', $attributes, $pdf_url);
							$embed = $embed_code;

							if (
								!apply_filters('embedpress/is_allow_rander', false) ||
								empty($attributes['lockContent']) || ($attributes['protectionType'] == 'password' && empty($attributes['contentPassword'])) || ($attributes['protectionType'] == 'password' && (!empty(Helper::is_password_correct($client_id))) && ($hash_pass === $password_correct)) || ($attributes['protectionType'] == 'user-role' && has_content_allowed_roles($attributes['userRole']))
							) {

								$custom_thumbnail = isset($attributes['customThumbnail']) ? $attributes['customThumbnail'] : '';

								echo '<div class="ep-embed-content-wraper">';
								$embed = '<div class="position-' . esc_attr($share_position) . '-wraper gutenberg-pdf-wraper">';
								$embed .= $embed_code;
								$embed .= '</div>';

								if (!empty($attributes['contentShare'])) {
									$content_id = $attributes['id'];
									$embed .= Helper::embed_content_share($content_id, $attributes);
								}
								echo $embed;
								echo '</div>';
							} else {
								if (!empty($attributes['contentShare'])) {
									$content_id = $attributes['clientId'];
									$embed = '<div class="position-' . esc_attr($share_position) . '-wraper gutenberg-pdf-wraper">';
									$embed .= $embed_code;
									$embed .= '</div>';
									$embed .= Helper::embed_content_share($content_id, $attributes);
								}
								echo '<div class="ep-embed-content-wraper">';
								if ($attributes['protectionType'] == 'password') {
									do_action('embedpress/display_password_form', $client_id, $embed, $pass_hash_key, $attributes);
								} else {
									do_action('embedpress/content_protection_content', $client_id, $attributes['protectionMessage'],  $attributes['userRole']);
								}
								echo '</div>';
							}

							?>

					<?php
							if (!empty($attributes['adManager'])) {
								$embed = apply_filters('embedpress/generate_ad_template', $embed, $client_id, $attributes, 'gutenberg');
							}
							?>
				</div>
			</div>
		</div>
	<?php
			return ob_get_clean();
		}
	}

	function isGoogleCalendar($url)
	{
		$pattern = '/^https:\/\/calendar\.google\.com\/calendar\/embed\?.*$/';
		return preg_match($pattern, $url);
	}

	function embedpress_calendar_render_block($attributes)
	{

		$id = !empty($attributes['id']) ? $attributes['id'] : 'embedpress-calendar-' . rand(100, 10000);
		$url = !empty($attributes['url']) ? $attributes['url'] : '';

		if (!isGoogleCalendar($url)) {
			return;
		}

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
				do_action('embedpress_google_helper_shortcode', 10);
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

function embedpress_document_block_scripts()
{
	// Exit if this is the admin panel
	if (is_admin()) {
		return;
	}

	global $post;

	// Check for the presence of the 'embedpress/document' block
	$block_exists = false;

	if (function_exists('has_block')) {
		$block_exists = has_block('embedpress/document');
	} elseif (isset($post->post_content)) {
		// Fallback for older WordPress versions
		$block_exists = strpos($post->post_content, '<!-- wp:embedpress/document') !== false;
	}

	// If the block exists, enqueue the scripts and styles
	if ($block_exists) {
		$script_handles = [
			'embedpress-pdfobject',
			'embedpress-front',
			'embedpress_documents_viewer_script'
		];

		foreach ($script_handles as $handle) {
			wp_enqueue_script($handle);
		}

		$style_handles = [
			'embedpress_blocks-cgb-style-css',
			'embedpress-style'
		];

		foreach ($style_handles as $handle) {
			wp_enqueue_style($handle, false, [], EMBEDPRESS_PLUGIN_VERSION);
		}
	}
}
add_action('wp_enqueue_scripts', 'embedpress_document_block_scripts');
