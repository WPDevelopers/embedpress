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

if ( !defined( 'ABSPATH' ) ) {
	exit;
}


/**
 * Enqueue Gutenberg block assets for both frontend + backend.
 *
 * @uses {wp-editor} for WP editor styles.
 * @since 1.0.0
 */
function embedpress_blocks_cgb_block_assets() { // phpcs:ignore
	// Styles.
	wp_enqueue_style(
		'embedpress_blocks-cgb-style-css', // Handle.
		EMBEDPRESS_GUTENBERG_DIR_URL.'dist/blocks.style.build.css', // Block style CSS.
		is_admin() ? array( 'wp-editor' ) : null, // Dependency to include the CSS after it.
		filemtime( EMBEDPRESS_GUTENBERG_DIR_PATH.'dist/blocks.style.build.css' ) // Version: File modification time.
	);
}

// Hook: Frontend assets.
add_action( 'enqueue_block_assets', 'embedpress_blocks_cgb_block_assets' );

/**
 * Enqueue Gutenberg block assets for backend editor.
 *
 * @uses {wp-blocks} for block type registration & related functions.
 * @uses {wp-element} for WP Element abstraction — structure of blocks.
 * @uses {wp-i18n} to internationalize the block's text.
 * @uses {wp-editor} for WP editor styles.
 * @since 1.0.0
 */
function embedpress_blocks_cgb_editor_assets() { // phpcs:ignore
	// Scripts.
	if (! wp_script_is( 'embedpress-pdfobject') ) {
		wp_enqueue_script( 'embedpress-pdfobject', EMBEDPRESS_URL_ASSETS . 'js/pdfobject.min.js', [],
			EMBEDPRESS_VERSION );
	}

	wp_enqueue_script(
		'embedpress_blocks-cgb-block-js', // Handle.
		EMBEDPRESS_GUTENBERG_DIR_URL.'/dist/blocks.build.js', // Block.build.js: We register the block here. Built with Webpack.
		array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor','wp-components', 'embedpress-pdfobject' ), // Dependencies, defined above.
		filemtime( EMBEDPRESS_GUTENBERG_DIR_PATH . 'dist/blocks.build.js' ), // Version: File modification time.
		true // Enqueue the script in the footer.
	);
	$wistia_labels  = array(
		'watch_from_beginning'       => __( 'Watch from the beginning', 'embedpress' ),
		'skip_to_where_you_left_off' => __( 'Skip to where you left off', 'embedpress' ),
		'you_have_watched_it_before' => __( 'It looks like you\'ve watched<br />part of this video before!', 'embedpress' ),
	);
	$elements = (array) get_option( EMBEDPRESS_PLG_NAME.":elements", []);
	$active_blocks = isset( $elements['gutenberg']) ? (array) $elements['gutenberg'] : [];
	$wistia_labels  = json_encode( $wistia_labels );
	$wistia_options = null;
	if ( function_exists( 'embedpress_wisita_pro_get_options' ) ):
		$wistia_options = embedpress_wisita_pro_get_options();
	endif;
	$pars_url = wp_parse_url(get_site_url());
	$documents_cta_options = (array) get_option(EMBEDPRESS_PLG_NAME . ':document');
	wp_localize_script( 'embedpress_blocks-cgb-block-js', 'embedpressObj', array(
		'wistia_labels'  => $wistia_labels,
		'wisita_options' => $wistia_options,
		'embedpress_powered_by' => apply_filters('embedpress_document_block_powered_by',true),
		'embedpress_pro' => defined('EMBEDPRESS_PRO_PLUGIN_FILE'),
		'twitch_host' => !empty($pars_url['host'])?$pars_url['host']:'',
		'site_url' => site_url(),
		'active_blocks' => $active_blocks,
		'document_cta' => $documents_cta_options,
		'pdf_renderer' => Helper::get_pdf_renderer(),
	) );

	// Styles.
	wp_enqueue_style(
		'embedpress_blocks-cgb-block-editor-css', // Handle.
		EMBEDPRESS_GUTENBERG_DIR_URL . 'dist/blocks.editor.build.css', // Block editor CSS.
		array( 'wp-edit-blocks' ), // Dependency to include the CSS after it.
		filemtime( EMBEDPRESS_GUTENBERG_DIR_PATH . 'dist/blocks.editor.build.css' ) // Version: File modification time.
	);
}

// Hook: Editor assets.
add_action( 'enqueue_block_editor_assets', 'embedpress_blocks_cgb_editor_assets' );


function embedpress_block_category( $categories, $post ) {
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
$wp_version = get_bloginfo( 'version', 'display' );
if ( version_compare( $wp_version, '5.8', '>=') ) {
	add_filter( 'block_categories_all', 'embedpress_block_category', 10, 2 );

}else{
	add_filter( 'block_categories', 'embedpress_block_category', 10, 2 );
}




foreach ( glob( EMBEDPRESS_GUTENBERG_DIR_PATH . 'block-backend/*.php' ) as $block_logic ) {
	require_once $block_logic;
}

/**
 * Registers the embedpress gutneberg block on server.
 */

function embedpress_gutenberg_register_all_block() {
	if ( function_exists( 'register_block_type' ) ) :

		$elements = (array) get_option( EMBEDPRESS_PLG_NAME.":elements", []);
		$g_blocks = isset( $elements['gutenberg']) ? (array) $elements['gutenberg'] : [];
		$blocks_to_registers = [ 'twitch-block', 'google-slides-block','google-sheets-block', 'google-maps-block', 'google-forms-block', 'google-drawings-block', 'google-docs-block', 'embedpress', 'embedpress-pdf'];

		foreach ( $blocks_to_registers as $blocks_to_register ) {
			if ( !empty($g_blocks[$blocks_to_register]) ) {
				if ( 'embedpress' === $blocks_to_register ) {
					register_block_type( 'embedpress/embedpress', [
						'render_callback' => 'embedpress_render_block',
					]);
				}elseif ( 'embedpress-pdf' === $blocks_to_register ) {
					register_block_type( 'embedpress/embedpress-pdf', [
						'render_callback' => 'embedpress_pdf_render_block',
					]);
				}else{
					register_block_type( 'embedpress/'.$blocks_to_register );
				}
			}else{
				if ( WP_Block_Type_Registry::get_instance()->is_registered( 'embedpress/'.$blocks_to_register) ) {
					unregister_block_type( 'embedpress/'.$blocks_to_register );
				}
			}
		}

	endif;
}

add_action( 'init', 'embedpress_gutenberg_register_all_block' );

function embedpress_pdf_render_block( $attributes ){

	if ( !empty( $attributes['href']) ) {
		$renderer = Helper::get_pdf_renderer();
		$pdf_url = $attributes['href'];
		$id = !empty( $attributes['id']) ? $attributes['id'] : 'embedpress-pdf-'.rand(100, 10000);
		$width = !empty( $attributes['width']) ? $attributes['width'].'px' : '600px';
		$height = !empty( $attributes['height']) ? $attributes['height'].'px' : '600px';
		$gen_settings    = get_option( EMBEDPRESS_PLG_NAME);
		$powered_by = isset( $gen_settings['embedpress_document_powered_by']) && 'yes' === $gen_settings['embedpress_document_powered_by'];
		if ( isset( $attributes['powered_by']) ) {
			$powered_by = $attributes['powered_by'];
		}

		$src = $renderer . ((strpos($renderer, '?') == false) ? '?' : '&') . 'file=' . $attributes['href'];
		$hash = md5( $id );
		$aligns = [
			'left' => 'alignleft',
			'right' => 'alignright',
			'wide' => 'alignwide',
			'full' => 'alignfull'
		];
		$alignment = isset($attributes['align']) && isset($aligns[$attributes['align']])?$aligns[$attributes['align']]:'';
		$dimension = "width:$width;height:$height";
		ob_start();
		?>
		<div class="embedpress-document-embed embedpress-pdf ose-document ep-doc-<?php echo esc_attr( $hash) .' '. esc_attr($alignment) ?>">
			<iframe style="<?php echo esc_attr( $dimension); ?>; max-width:100%; display: inline-block"  src="<?php echo esc_attr(  $src); ?>"
			        frameborder="0"></iframe>

			<?php do_action( 'embedpress_pdf_gutenberg_after_embed',  $hash, 'pdf', $attributes, $pdf_url); ?>

			<?php
			if ($powered_by ) {
				printf( '<p class="embedpress-el-powered">%s</p>', __( 'Powered By EmbedPress', 'embedpress' ) );
			}?>

		</div>
		<?php
		return ob_get_clean();
	}
}
