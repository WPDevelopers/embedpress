<?php


/**
 * Renders the `embedpress/youtube` block on server.
 *
 * @param array $attributes The block attributes.
 *
 * @return false|string
 */
function embedpress_gutenberg_render_block_youtube( $attributes )
{
	ob_start();
	$align = 'align' . ( isset( $attributes[ 'align' ] ) ? $attributes[ 'align' ] : 'center' );
	$youtube_params = apply_filters( 'embedpress_gutenberg_youtube_params', [] );
	$iframeUrl = $attributes[ 'iframeSrc' ];
	foreach ( $youtube_params as $param => $value ) {
		$iframeUrl = add_query_arg( $param, $value, $iframeUrl );
	}

	?>
	<div class="ose-youtube wp-block-embed-youtube <?php echo $align; ?>">
		<iframe src="<?php echo $iframeUrl; ?>"
		        allowtransparency="true"
		        allowfullscreen="true"
		        frameborder="0"
		        width="640" height="360">
		</iframe>
	</div>
	<?php
	return ob_get_clean();
}

/**
 * Registers the `embedpress/youtube-block` block on server.
 */
function embedpress_gutenberg_register_block_youtube()
{
	if ( function_exists( 'register_block_type' ) ) :
		register_block_type( 'embedpress/youtube-block', [
			'style'         => 'embedpress_youtube-cgb-style-css',
			// Enqueue blocks.build.js in the editor only.
			'editor_script' => 'embedpress_youtube-cgb-block-js',
			// Enqueue blocks.editor.build.css in the editor only.
			'editor_style'  => 'embedpress_youtube-cgb-block-editor-css',

			'attributes'      => [
				'url'       => [
					'type'    => 'string',
					'default' => ''
				],
				'iframeSrc' => [
					'type'    => 'string',
					'default' => ''
				],
				'mediaId'   => [
					'type'    => 'string',
					'default' => ''
				]
			],
			'render_callback' => 'embedpress_gutenberg_render_block_youtube',
		] );
	endif;
}

add_action( 'init', 'embedpress_gutenberg_register_block_youtube' );
