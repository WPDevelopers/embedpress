<?php
// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
/**
 * It renders gutenberg block of embedpress on the frontend
 * @param array $attributes
 */
function embedpress_render_block($attributes){
	if ( !empty( $attributes['embedHTML']) ) {
		$embed         = apply_filters( 'embedpress_gutenberg_embed', $attributes['embedHTML'], $attributes );
		ob_start();
		?>
		<div class="embedpress-gutenberg-wrapper">
			<?php echo $embed; ?>
		</div>
		<?php
		return ob_get_clean();
	}
}
