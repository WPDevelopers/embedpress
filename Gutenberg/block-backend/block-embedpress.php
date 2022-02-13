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
		$aligns = [
			'left' => 'alignleft',
			'right' => 'alignright',
			'wide' => 'alignwide',
			'full' => 'alignfull',
			'center' => 'aligncenter',
		];
		if ( isset($attributes['align']) ) {
			$alignment = isset($aligns[$attributes['align']]) ? $aligns[$attributes['align']] .' clear' : '';
		}else{
			$alignment = 'aligncenter'; // default alignment is center in js, so keeping same here
		}
		ob_start();
		?>
		<div class="embedpress-gutenberg-wrapper">
			<div class="wp-block-embed__wrapper <?php echo esc_attr($alignment) ?>">
				<?php echo $embed; ?>
			</div>
		</div>
		<?php
		return ob_get_clean();
	}
}
