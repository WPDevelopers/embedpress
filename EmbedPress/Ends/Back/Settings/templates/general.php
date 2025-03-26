<?php
/*
 * General Settings page
 *  All undefined vars comes from 'render_settings_page' method
 */

$g_settings = get_option(EMBEDPRESS_PLG_NAME);

$lazy_load = isset($g_settings['g_lazyload']) ? intval($g_settings['g_lazyload']) : 0;
$pdf_custom_color_settings = isset($g_settings['pdf_custom_color_settings']) ? intval($g_settings['pdf_custom_color_settings']) : 0;
$turn_off_rating_help = isset($g_settings['turn_off_rating_help']) ? intval($g_settings['turn_off_rating_help']) : 0;

$custom_color = isset($g_settings['custom_color']) ? sanitize_text_field($g_settings['custom_color']) : '#333333';

$enableEmbedResizeHeight = isset($g_settings['enableEmbedResizeHeight']) ? intval($g_settings['enableEmbedResizeHeight']) : 600;
$enableEmbedResizeWidth = isset($g_settings['enableEmbedResizeWidth']) ? intval($g_settings['enableEmbedResizeWidth']) : 600;

?>

<div class="embedpress__settings  background__white radius-16 p-24">
	<h3>Global Embed iFrame</h3>
	<div class="shortcode-settings-wrapper">
		<div class="embedpress__settings embedpress_general_settings__form">
			<div class="embedpress__settings__form">
				<form action="" method="post" class="embedpress-settings-form">
					<?php
				do_action('embedpress_before_general_settings_fields');
				echo  $nonce_field;
				?>
					<div class="mb-20">
						<div class="form__group">
							<p class="form__label"><?php esc_html_e('Embed iFrame Width', 'embedpress'); ?></p>
							<div class="form__control__wrap">
								<div class="input__flex">
									<input type="number" name="enableEmbedResizeWidth" class="form__control"
										data-default="<?php echo esc_attr($enableEmbedResizeWidth); ?>"
										value="<?php echo esc_attr($enableEmbedResizeWidth); ?>">
									<span class="frame__unit">px</span>
								</div>
							</div>
						</div>
						<div class="form__group">
							<p class="form__label"><?php esc_html_e('Embed iFrame Height', 'embedpress'); ?></p>
							<div class="form__control__wrap">
								<div class="input__flex">
									<input type="number" name="enableEmbedResizeHeight" class="form__control"
										data-default="<?php echo esc_attr($enableEmbedResizeHeight); ?>"
										value="<?php echo esc_attr($enableEmbedResizeHeight); ?>">
									<span class="frame__unit">px</span>
								</div>
							</div>
						</div>
						<div class="form__group">
							<p class="form__label"><?php esc_html_e('Lazy Load', 'embedpress');
												echo !$pro_active ? ' <span class="isPro">PRO</span>' : ''; ?> </p>
							<div class="form__control__wrap">
								<label class="input__switch switch__text <?php echo $pro_active ? '' : 'isPro'; ?>">
									<input type="checkbox" name="g_lazyload"
										data-default="<?php echo esc_attr($lazy_load); ?>"
										data-value="<?php echo esc_attr($lazy_load); ?>" value="1" <?php echo $pro_active ? '' : 'disabled ';
																																														checked('1', $lazy_load) ?>>
									<span></span>
								</label>
								<?php if (!$pro_active) {
								include EMBEDPRESS_SETTINGS_PATH . 'templates/partials/alert-pro.php';
							} ?>
							</div>
						</div>
						<div class="form__group<?php echo !is_embedpress_pro_active() ? ' pdf_custom_color_settings' : ''; ?>">
							<p class="form__label"><?php echo esc_html__('PDF Custom Color', 'embedpress'); ?></p>
							<div class="form__control__wrap">
								<label class="input__switch switch__text">
									<input type="checkbox" name="pdf_custom_color_settings"
										data-default="<?php echo esc_attr($pdf_custom_color_settings); ?>"
										data-value="<?php echo esc_attr($pdf_custom_color_settings); ?>" value="1"
										<?php checked('1', $pdf_custom_color_settings) ?>>
									<span></span>
									<a href="#"
										class="logo__adjust__toggler"><?php esc_html_e("Settings", "embedpress"); ?><i
											class="ep-icon ep-caret-down"></i></a>
								</label>

								<div class="logo__adjust__wrap">
									<div class="form__control__wrap">
										<div class="input__flex">
											<input type="color" id="embedpress_pdf_global_custom_color"
												name="custom_color"
												data-default="<?php echo esc_attr($custom_color); ?>"
												data-value="<?php echo esc_attr($custom_color); ?>"
												value="<?php echo esc_attr($custom_color); ?>">
										</div>
									</div>
								</div>

							</div>
						</div>
						<div class="form__group turn_off_rating_help">
							<p class="form__label"><?php echo esc_html__('Rating & Help', 'embedpress'); ?></p>
							<div class="form__control__wrap">
								<label class="input__switch switch__text">
									<input type="checkbox" name="turn_off_rating_help"
										data-default="<?php echo esc_attr($turn_off_rating_help); ?>"
										data-value="<?php echo esc_attr($turn_off_rating_help); ?>" value="1"
										<?php checked('1', $turn_off_rating_help) ?>>
									<span></span>
								</label>

							</div>
						</div>
						<div class="form__group mb0">
							<p class="form__label"><?php
												/*translators: % means coming soon text markup*/
												printf(esc_html__('Loading Animation %s', 'embedpress'), $coming_soon);

												echo !$pro_active ? ' <span class="isPro">PRO</span>' : ''; ?>
							</p>
							<div class="form__control__wrap">
								<label class="input__switch switch__text  isPro">
									<input type="checkbox" name="g_loading_animation" data-default="1" value="1"
										disabled>
									<span></span>
								</label>
								<?php include EMBEDPRESS_SETTINGS_PATH . 'templates/partials/alert-coming-soon.php'; ?>
							</div>
						</div>
					</div>
					<?php do_action('embedpress_after_general_settings_fields');  ?>
					<button class="button button__themeColor radius-10 embedpress-submit-btn" name="submit"
						value="general"><?php esc_html_e('Save Changes', 'embedpress'); ?></button>
				</form>
			</div>
		</div>
		<?php if (empty($pro_active) || !$pro_active) : ?>
		<div class="embedpress-upgrade-pro-sidebar">
			<div class="gradient-color">
				<img class="embedpress-banner" src="<?php echo esc_url('https://embedpress.com/wp-content/uploads/2023/10/Mega-Page.gif'); ?>"
					alt="">
                    <h3 class="cart-title">Upgrade To <span>Pro</span></h3>
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

				<a class="pro-upgrade-button" target="_blank"
					href="<?php echo esc_url('https://wpdeveloper.com/in/upgrade-embedpress'); ?>"><?php echo esc_html__('Upgrade to Pro', 'embedpress'); ?><img
						src="<?php echo esc_url(EMBEDPRESS_SETTINGS_ASSETS_URL . 'img/external-white.svg'); ?>" alt=""></a>
			</div>

		</div>
		<?php endif; ?>
	</div>
</div>