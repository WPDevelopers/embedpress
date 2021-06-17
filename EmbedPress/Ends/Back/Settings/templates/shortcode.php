<?php
/*
 * Shortcode Settings page
 *  All undefined vars comes from 'render_settings_page' method
 */
?>
<div class="embedpress__settings background__white radius-25 p40">
	<h3>Shortcode</h3>
	<div class="embedpress__settings__form">
		<form action="" method="post" class="embedpress-settings-form">

			<div class="form__group">

				<p class="form__label">
					<?php esc_html_e( 'Sample Label', 'embedpress'); echo !$pro_active ? ' <span class="isPro">PRO</span>' : ''; ?>
				</p>

				<div class="form__control__wrap">

					<label class="input__switch switch__text <?php echo $pro_active ? '': 'isPro'; ?>">
						<input type="checkbox" name="shortcode" data-default="" data-value="" value="1">
						<span></span>
					</label>

					<?php if ( !$pro_active ) {  include EMBEDPRESS_SETTINGS_PATH . 'templates/partials/alert-pro.php'; } ?>

				</div>
			</div>


			<button class="button button__themeColor radius-10 embedpress-submit-btn" name="submit" value="shortcode"><?php esc_html_e( 'Save Changes', 'embedpress'); ?></button>
		</form>
	</div>
</div>
