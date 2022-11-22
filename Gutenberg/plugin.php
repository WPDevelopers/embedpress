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
		EMBEDPRESS_GUTENBERG_DIR_URL . '/dist/blocks.build.js', // Block.build.js: We register the block here. Built with Webpack.
		array('wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor', 'wp-components', 'embedpress-pdfobject'), // Dependencies, defined above.
		filemtime(EMBEDPRESS_GUTENBERG_DIR_PATH . 'dist/blocks.build.js'), // Version: File modification time.
		true // Enqueue the script in the footer.
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
							'height' => [
								'type' => 'string',
								'default' => '450'
							],
							'width' => [
								'type' => 'string',
								'default' => '600'
							],
						),
					]);
				} elseif ('embedpress-pdf' === $blocks_to_register) {
					register_block_type('embedpress/embedpress-pdf', [
						'attributes'      => array(
							'powered_by' => [
								'type' => 'boolean',
								'default' => true
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

function embedpress_pdf_render_block($attributes)
{

	if (!empty($attributes['href'])) {
		$renderer = Helper::get_pdf_renderer();
		$pdf_url = $attributes['href'];
		$id = !empty($attributes['id']) ? $attributes['id'] : 'embedpress-pdf-' . rand(100, 10000);
		$width = !empty($attributes['width']) ? $attributes['width'] . 'px' : '600px';
		$height = !empty($attributes['height']) ? $attributes['height'] . 'px' : '600px';
		$gen_settings    = get_option(EMBEDPRESS_PLG_NAME);

		$powered_by = isset($gen_settings['embedpress_document_powered_by']) && 'yes' === $gen_settings['embedpress_document_powered_by'];
		if (isset($attributes['powered_by'])) {
			$powered_by = $attributes['powered_by'];
		}

		$src = $renderer . ((strpos($renderer, '?') == false) ? '?' : '&') . 'file=' . $attributes['href'];
		$hash = md5($id);
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
		<div class="embedpress-document-embed embedpress-pdf ose-document ep-doc-<?php echo esc_attr($hash) . ' ' . esc_attr($alignment) ?>">
			<div class="embedpress-inner-iframe">
				<iframe class="embedpress-embed-document-pdf <?php echo esc_attr($id); ?>" style="<?php echo esc_attr($dimension); ?>; max-width:100%; display: inline-block" src="<?php echo esc_attr($src); ?>" frameborder="0"></iframe>

				<?php do_action('embedpress_pdf_gutenberg_after_embed',  $hash, 'pdf', $attributes, $pdf_url); ?>

				<?php
					if ($powered_by) {
						printf('<p class="embedpress-el-powered">%s</p>', __('Powered By EmbedPress', 'embedpress'));
					} ?>
			</div>

		</div>
	<?php ep_pdf_block_frontend_style($attributes, 'pdf');

		return ob_get_clean();
	}
}

	function embedpress_calendar_render_block($attributes)
	{

		$id = !empty($attributes['id']) ? $attributes['id'] : 'embedpress-calendar-' . rand(100, 10000);
		$url = !empty($attributes['url']) ? $attributes['url'] : '';
		$is_private = isset($attributes['is_public']);
		$hash = md5($id);
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
			<iframe style="<?php echo esc_attr($dimension); ?>; max-width:100%; display: inline-block" src="<?php echo esc_attr($url); ?>"></iframe>
		<?php } else {
				if (is_embedpress_pro_active()) {
					echo Embedpress_Google_Helper::shortcode();
				}
			} ?>
		<?php do_action('embedpress_calendar_gutenberg_after_embed',  $hash, 'calendar', $attributes); ?>

		<?php
			if ($powered_by) {
				printf('<p class="embedpress-el-powered" style="width:'.esc_attr( $width ).'" >%s</p>', __('Powered By EmbedPress', 'embedpress'));
			} ?>

	</div>
	<?php
		return ob_get_clean();
	}


	/**
	 * FrontEnd Style for PDF Block
	 */
	function ep_pdf_block_frontend_style($attributes, $embed)
	{
		if ($embed === 'pdf') : ?>
		<script>
			{
				let x = 0;
				
				const setThemeMode = (frm, themeMode) => {
					const htmlEL = frm.getElementsByTagName("html")[0];
					if(htmlEL){
						htmlEL.setAttribute('ep-data-theme', themeMode);
					}
				}
				
				const setEmbedInterval = setInterval(() => {
					x++;
					if (document.querySelector('<?php echo esc_html('.' . $attributes['id']); ?>')) {
						const isDisplay = (selectorName) => {
							if (!selectorName) {
								selectorName = 'none';
							} else {
								selectorName = 'block';
							}

							return selectorName;
						}

						const frm = document.querySelector('<?php echo esc_html('.' . $attributes['id']); ?>').contentWindow.document;
						const otherhead = frm.getElementsByTagName("head")[0];
						const style = frm.createElement("style");
						style.setAttribute('id', 'EBiframeStyleID');

						let themeMode = '<?php echo esc_html(!empty($attributes['themeMode']) ? $attributes['themeMode'] : 'default'); ?>';
						let toolbar = <?php echo esc_html($attributes['toolbar'] ? $attributes['toolbar'] : 0); ?>;
						let presentation = <?php echo esc_html($attributes['presentation'] ? $attributes['presentation'] : 0); ?>;
						let download = <?php echo esc_html($attributes['download'] ? $attributes['download'] : 0); ?>;
						let open = <?php echo esc_html($attributes['open'] ? $attributes['open'] : 0); ?>;
						let copy_text = <?php echo esc_html($attributes['copy_text'] ? $attributes['copy_text'] : 0); ?>;
						let doc_details = <?php echo esc_html($attributes['doc_details'] ? $attributes['doc_details'] : 0); ?>;
						let doc_rotation = <?php echo esc_html($attributes['doc_rotation'] ? $attributes['doc_rotation'] : 0); ?>;
						let toolbar_position = '<?php echo esc_html($attributes['position'] ? $attributes['position'] : 0); ?>';

						toolbar = isDisplay(toolbar);
						presentation = isDisplay(presentation);
						download = isDisplay(download);
						open = isDisplay(open);
						copy_text = isDisplay(copy_text);

						
						<?php if(!defined('EMBEDPRESS_PRO_PLUGIN_FILE')): ?>
							download = 'block';
							copy_text = 'block';
						<?php endif;  ?>

						if (copy_text === 'block') {
							copy_text = 'all';
						}

						doc_details = isDisplay(doc_details);
						doc_rotation = isDisplay(doc_rotation);

						if (toolbar_position == 'top') {
							toolbar_position = 'top:0;bottom:auto;';
							settingsPos = '';
						} else {
							toolbar_position = 'bottom:0;top:auto;'
							settingsPos = `
								.findbar, .secondaryToolbar {
									top: auto;bottom: 32px;
								}
								.doorHangerRight:after{
									transform: rotate(180deg);
									bottom: -16px;
								}
								.doorHangerRight:before {
									transform: rotate(180deg);
									bottom: -18px;
								}
								
								.findbar.doorHanger:before {
									bottom: -18px;
									transform: rotate(180deg);
								}
								.findbar.doorHanger:after {
									bottom: -16px;
									transform: rotate(180deg);
								}
							`;
						}
						style.textContent = `
						.toolbar{
							display: ${toolbar}!important;
							position: absolute;
							${toolbar_position}

						}
						#secondaryToolbar{
							display: ${toolbar};
						}
						#secondaryPresentationMode, #toolbarViewerRight #presentationMode{
							display: ${presentation}!important;
						}
						#secondaryOpenFile, #toolbarViewerRight #openFile{
							display: none!important;
						}
						#secondaryDownload, #secondaryPrint, #toolbarViewerRight #print, #toolbarViewerRight #download{
							display: ${download}!important;
						}

						#pageRotateCw{
							display: ${doc_rotation}!important;
						}
						#pageRotateCcw{
							display: ${doc_rotation}!important;
						}
						#documentProperties{
							display: ${doc_details}!important;
						}
						.textLayer{
							user-select: ${copy_text}!important;
						}
						${settingsPos}
					`;
						if(frm){
							setThemeMode(frm, themeMode);
						} 
						if (otherhead) {
							if(frm.getElementById("EBiframeStyleID")){	
								frm.getElementById("EBiframeStyleID").remove();
							}
							otherhead.appendChild(style);
							clearInterval(setEmbedInterval);
						}
					}
					if (x > 50) {
						clearInterval(setEmbedInterval);
					}
				}, 100);
			}

			
		</script>
<?php
	endif;
}
