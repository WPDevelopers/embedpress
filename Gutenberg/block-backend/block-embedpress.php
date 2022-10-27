<?php
// Exit if accessed directly.

use EmbedPress\Providers\Youtube;

if (!defined('ABSPATH')) {
	exit;
}
/**
 * It renders gutenberg block of embedpress on the frontend
 * @param array $attributes
 */


function embedpress_render_block($attributes)
{



	if (!empty($attributes['embedHTML'])) {
		$embed         = apply_filters('embedpress_gutenberg_embed', $attributes['embedHTML'], $attributes);
		$aligns = [
			'left' => 'alignleft',
			'right' => 'alignright',
			'wide' => 'alignwide',
			'full' => 'alignfull',
			'center' => 'aligncenter',
		];
		if (isset($attributes['align'])) {
			$alignment = isset($aligns[$attributes['align']]) ? $aligns[$attributes['align']] . ' clear' : '';
		} else {
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


		echo embedpress_render_block_style($attributes);

		return ob_get_clean();
	}
}

/**
 * Make style function for embedpress render block
 */

function embedpress_render_block_style($attributes)
{
	$uniqid = '.ose-uid-' . md5($attributes['url']);
	$youtubeStyles = '<style>
		' . esc_attr($uniqid) . ' {
			width: ' . esc_attr($attributes['width']) . 'px !important;
			height: ' . esc_attr($attributes['height']) . 'px;
		}

		' . esc_attr($uniqid) . '>iframe {
			height: ' . esc_attr($attributes['height']) . 'px !important;
			max-height: ' . esc_attr($attributes['height']) . 'px !important;
			width: 100%;
		}
	</style>';

	return $youtubeStyles;
}
