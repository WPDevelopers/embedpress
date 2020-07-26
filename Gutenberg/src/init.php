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
		plugins_url( 'dist/blocks.style.build.css', dirname( __FILE__ ) ), // Block style CSS.
		array( 'wp-editor' ) // Dependency to include the CSS after it.
	// filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.style.build.css' ) // Version: File modification time.
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
	wp_enqueue_script(
		'embedpress_blocks-cgb-block-js', // Handle.
		plugins_url( '/dist/blocks.build.js', dirname( __FILE__ ) ), // Block.build.js: We register the block here. Built with Webpack.
		array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor','embedpress-pdfobject' ), // Dependencies, defined above.
		// filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.build.js' ), // Version: File modification time.
		true // Enqueue the script in the footer.
	);
	$wistia_labels  = array(
		'watch_from_beginning'       => __( 'Watch from the beginning', 'embedpress-wistia' ),
		'skip_to_where_you_left_off' => __( 'Skip to where you left off', 'embedpress-wistia' ),
		'you_have_watched_it_before' => __( 'It looks like you\'ve watched<br />part of this video before!', 'embedpress-wistia' ),
	);
	$wistia_labels  = json_encode( $wistia_labels );
	$wistia_options = null;
	if ( function_exists( 'embedpress_wisita_pro_get_options' ) ):
		$wistia_options = embedpress_wisita_pro_get_options();
	endif;
	$pars_url = wp_parse_url(get_site_url());
	wp_localize_script( 'embedpress_blocks-cgb-block-js', 'embedpressObj', array(
		'wistia_labels'  => $wistia_labels,
		'wisita_options' => $wistia_options,
		'embedpress_powered_by' => apply_filters('embedpress_document_block_powered_by',true),
		'embedpress_pro' => defined('EMBEDPRESS_PRO_PLUGIN_FILE'),
		'twitch_host' => !empty($pars_url['host'])?$pars_url['host']:''
	) );

	// Styles.
	wp_enqueue_style(
		'embedpress_blocks-cgb-block-editor-css', // Handle.
		plugins_url( 'dist/blocks.editor.build.css', dirname( __FILE__ ) ), // Block editor CSS.
		array( 'wp-edit-blocks' ) // Dependency to include the CSS after it.
	// filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.editor.build.css' ) // Version: File modification time.
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

add_filter( 'block_categories', 'embedpress_block_category', 10, 2 );

/**
 * Registers the embedpress gutneberg block on server.
 */

function embedpress_gutenberg_register_all_block() {
	if ( function_exists( 'register_block_type' ) ) :
		register_block_type( 'embedpress/twitch-block' );
		register_block_type( 'embedpress/google-slides-block' );
		register_block_type( 'embedpress/google-sheets-block' );
		register_block_type( 'embedpress/google-maps-block' );
		register_block_type( 'embedpress/google-forms-block' );
		register_block_type( 'embedpress/google-drawings-block' );
		register_block_type( 'embedpress/google-docs-block' );
	endif;
}

add_action( 'init', 'embedpress_gutenberg_register_all_block' );


foreach ( glob( plugin_dir_path( __FILE__ ) . '*/index.php' ) as $block_logic ) {
	require $block_logic;
}


