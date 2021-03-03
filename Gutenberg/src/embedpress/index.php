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
		$ats ='';
		if(isset( $attributes['height'])){
			$ats .='height:'. esc_attr($attributes['height']) .'px;';
			$ats .='max-height:100%;';
		}
		if(isset( $attributes['width'])){
			$ats .='width:'. esc_attr($attributes['width']) .'px;';
			$ats .='max-width:100%;';
		}
		ob_start();
		?>
		<div class="embedpress-gutenberg-wrapper" style="<?php echo esc_attr($ats);?>">
			<?php echo $embed; ?>
		</div>
		<?php
		return ob_get_clean();
	}
}
