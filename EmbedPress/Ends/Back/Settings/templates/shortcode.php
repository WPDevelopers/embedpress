<?php
/*
 * Shortcode Settings page
 *  All undefined vars comes from 'render_settings_page' method
 */
?>
<div class="embedpress__settings background__white radius-16 p-24">
	<h3><?php esc_html_e( "Shortcode", "embedpress" ); ?></h3>
	<div class="shortcode-settings-wrapper">
		<div class="embedpress__shortcode">
			<p class="shortcode__text"><?php printf( esc_html__( "EmbedPress has direct integration with Classic, Gutenberg and Elementor Editor. But for other page editor you can use EmbedPress shortcode feature. To generate shortcode simply insert your link, click %s'Generate'%s button and then copy your shortcode. For details, check out this %sdocumentation%s.", "embedpress" ),'<strong>', '</strong>','<a class="ep-link" href="https://embedpress.com/docs/how-to-use-embedpress-shortcodes-page-builders/" target="_blank">', '</a>'); ?></p>
			<div class="shortcode__form form__inline mb-20">
				<div class="form__group">
					<input type="url" id="ep-link" class="form__control" placeholder="<?php esc_attr_e( "Place your link here to generate shortcode", "embedpress" ); ?>">
				</div>
				<button class="button button__redColor" id="ep-shortcode-btn"><?php esc_html_e( "Generate", "embedpress" ); ?></button>
			</div>
			<div class="shortcode__form form__inline">
				<div class="form__group">
					<input type="text" class="form__control" id="ep-shortcode" readonly>
				</div>
				<button class="button button__themeColor copy__button" id="ep-shortcode-cp"><i class="ep-icon ep-copy"></i><span>Copy Link</span></button>
			</div>
		</div>
		<?php if (empty($pro_active) || !$pro_active) : ?>
			<div class="embedpress-upgrade-pro-sidebar">
				<div class="gradient-color">
					<img class="embedpress-banner" src="<?php echo esc_url('https://embedpress.com/wp-content/uploads/2023/10/Mega-Page.gif'); ?>" alt="">
					
					<ul class="feature-list">
						<li><img src="<?php echo esc_url(EMBEDPRESS_SETTINGS_ASSETS_URL . 'img/check2.svg'); ?>" alt=""><?php echo esc_html__('Social Share', 'embedpress'); ?></li>
						<li><img src="<?php echo esc_url(EMBEDPRESS_SETTINGS_ASSETS_URL . 'img/check2.svg'); ?>" alt=""><?php echo esc_html__('Lazy Loading', 'embedpress'); ?></li>
						<li><img src="<?php echo esc_url(EMBEDPRESS_SETTINGS_ASSETS_URL . 'img/check2.svg'); ?>" alt=""><?php echo esc_html__('SEO Optimized', 'embedpress'); ?></li>
						<li><img src="<?php echo esc_url(EMBEDPRESS_SETTINGS_ASSETS_URL . 'img/check2.svg'); ?>" alt=""><?php echo esc_html__('Custom Branding', 'embedpress'); ?></li>
						<li><img src="<?php echo esc_url(EMBEDPRESS_SETTINGS_ASSETS_URL . 'img/check2.svg'); ?>" alt=""><?php echo esc_html__('Content Protection', 'embedpress'); ?></li>
						<li><img src="<?php echo esc_url(EMBEDPRESS_SETTINGS_ASSETS_URL . 'img/check2.svg'); ?>" alt=""><?php echo esc_html__('Custom Audio & Video Player', 'embedpress'); ?></li>
						<li><img src="<?php echo esc_url(EMBEDPRESS_SETTINGS_ASSETS_URL . 'img/check2.svg'); ?>" alt=""><?php echo esc_html__('PDF & Documents Embedding', 'embedpress'); ?></li>
						<li><img src="<?php echo esc_url(EMBEDPRESS_SETTINGS_ASSETS_URL . 'img/check2.svg'); ?>" alt=""><?php echo esc_html__('Embed From 150+ Sources', 'embedpress'); ?></li>
						<li><img src="<?php echo esc_url(EMBEDPRESS_SETTINGS_ASSETS_URL . 'img/check2.svg'); ?>" alt=""><?php echo esc_html__('Wrapper Support', 'embedpress'); ?></li>
						<li><img src="<?php echo esc_url(EMBEDPRESS_SETTINGS_ASSETS_URL . 'img/check2.svg'); ?>" alt=""><?php echo esc_html__('& Many more...', 'embedpress'); ?></li>
					</ul>

					<a class="pro-upgrade-button" target="_blank" href="<?php echo esc_url('https://wpdeveloper.com/in/upgrade-embedpress'); ?>"><?php echo esc_html__('Upgrade to Pro', 'embedpress'); ?> <img src="<?php echo esc_url(EMBEDPRESS_SETTINGS_ASSETS_URL . 'img/external-white.svg'); ?>" alt=""></a>

				</div>

			</div>
		<?php endif; ?>
	</div>
	
</div>	

