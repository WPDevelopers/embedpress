<?php
/*
 * Shortcode Settings page
 *  All undefined vars comes from 'render_settings_page' method
 */
?>
<div class="embedpress__settings background__white radius-25 p40">
	<h3><?php esc_html_e( "Shortcode", "embedpress" ); ?></h3>
	<div class="embedpress__shortcode">
		<p class="shortcode__text"><?php printf( esc_html__( "EmbedPress has direct integration with Classic, Gutenberg and Elementor Editor. But for other page editor you can use EmbedPress shortcode feature. To generate shortcode simply insert your link, click %s'Generate'%s button and then copy your shortcode. For details, check out this %sdocumentation%s.", "embedpress" ),'<strong>', '</strong>','<a class="ep-link" href="https://embedpress.com/docs/how-to-use-embedpress-shortcodes-page-builders/" target="_blank">', '</a>'); ?></p>
		<div class="shortcode__form form__inline mb30">
			<div class="form__group">
				<input type="url" id="ep-link" class="form__control" placeholder="<?php esc_attr_e( "Place your link here to generate shortcode", "embedpress" ); ?>">
			</div>
			<button class="button button__themeColor radius-10" id="ep-shortcode-btn"><?php esc_html_e( "Generate", "embedpress" ); ?></button>
		</div>
		<div class="shortcode__form form__inline">
			<div class="form__group">
				<input type="text" class="form__control" id="ep-shortcode" readonly>
			</div>
			<button class="button button__themeColor copy__button radius-10" id="ep-shortcode-cp"><i class="ep-icon ep-copy"></i></button>
		</div>
	</div>
</div>	

