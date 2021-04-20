<?php
/*
 * General Settings page */
?>
<div class="embedpress__settings background__white radius-25 p40">
	<h3>Global Embed Iframe</h3>
	<div class="embedpress__settings__form">
		<form action="" method="post">
			<div class="form__group">
				<p class="form__label"><?php esc_html_e( 'Embed Iframe Height', 'embedpress'); ?></p>
				<div class="form__control__wrap">
					<div class="input__flex">
						<input type="number" name="g_height" class="form__control" value="5">
						<span class="frame__unit">px</span>
					</div>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label"><?php esc_html_e( 'Embed Iframe Width', 'embedpress'); ?></p>
				<div class="form__control__wrap">
					<div class="input__flex">
						<input type="number" name="g_width" class="form__control" value="5">
						<span class="frame__unit">px</span>
					</div>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label"><?php esc_html_e( 'Lazy Load', 'embedpress'); ?></p>
				<div class="form__control__wrap">
					<label class="input__switch switch__text">
						<input type="checkbox" name="g_lazyload">
						<span></span>
					</label>
				</div>
			</div>
			<div class="form__group mb0">
				<p class="form__label"><?php esc_html_e( 'Loading Animation', 'embedpress'); ?> <span class="isPro">PRO</span></p>
				<div class="form__control__wrap">
					<label class="input__switch switch__text">
						<input type="checkbox" name="g_loading_animation" disabled>
						<span></span>
					</label>
				</div>
			</div>
            <button class="button button__themeColor radius-10"><?php esc_html_e( 'Save Changes', 'embedpress'); ?></button>
        </form>
	</div>
</div>
