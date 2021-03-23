<?php

/**
 * Renders the `unity-gutenberg/post-slider` block on server.
 *
 * @param array $attributes The block attributes.
 *
 * @return string Returns the post slider.
 */
function embedpress_gutenberg_render_block_wistia( $attributes )
{
	ob_start();
	if ( !empty( $attributes ) && !empty( $attributes[ 'url' ] ) ) :
		preg_match( '~medias/(.*)~i', $attributes[ 'url' ], $matches );
		$id = false;
		if ( isset( $matches[ 1 ] ) ) {
			$id = $matches[ 1 ];
		}
		$align = 'align' . ( isset( $attributes[ 'align' ] ) ? $attributes[ 'align' ] : 'center' );
		if ( !empty( $id ) ) :
			?>
			<div class="ose-wistia wp-block-embed-youtube <?php echo $align; ?>" id="wistia_<?php echo $id; ?>">
				<iframe src="<?php echo $attributes[ 'iframeSrc' ]; ?>" allowtransparency="true" frameborder="0"
				        class="wistia_embed" name="wistia_embed" width="600" height="330"></iframe>
				<?php
				do_action( 'embedpress_gutenberg_wistia_block_after_embed', $attributes ); ?>
			</div>
		<?php
		endif;
	endif;
	return ob_get_clean();
}

/**
 * Registers the `embedpress/wistia-block` block on server.
 */
function embedpress_gutenberg_register_block_wistia()
{
	if ( function_exists( 'register_block_type' ) ) :
		register_block_type( 'embedpress/wistia-block', [
			'attributes'      => [
				'url'       => [
					'type' => 'string',
				],
				'iframeSrc' => [
					'type' => 'string',
				],
			],
			'render_callback' => 'embedpress_gutenberg_render_block_wistia',
		] );
	endif;
}

add_action( 'init', 'embedpress_gutenberg_register_block_wistia' );
