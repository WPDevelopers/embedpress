<?php
/*
 * General Settings page */
?>
<div class="embedpress__settings background__white radius-25 p40">
	<h3>Global Embed Iframe</h3>
	<div class="embedpress__settings__form">
		<form action="" method="post">
            <?php
            do_action( 'embedpress_before_general_settings_fields');
            echo  $nonce_field ;
            ?>
			<div class="form__group">
				<p class="form__label"><?php esc_html_e( 'Embed Iframe Height', 'embedpress'); ?></p>
				<div class="form__control__wrap">
					<div class="input__flex">
						<input type="number" name="enableEmbedResizeHeight" class="form__control" value="550">
						<span class="frame__unit">px</span>
					</div>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label"><?php esc_html_e( 'Embed Iframe Width', 'embedpress'); ?></p>
				<div class="form__control__wrap">
					<div class="input__flex">
						<input type="number" name="enableEmbedResizeWidth" class="form__control" value="600">
						<span class="frame__unit">px</span>
					</div>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label"><?php esc_html_e( 'Lazy Load', 'embedpress'); ?></p>
				<div class="form__control__wrap">
					<label class="input__switch switch__text">
						<input type="checkbox" name="g_lazyload" value="yes" checked>
						<span></span>
					</label>
				</div>
			</div>
			<div class="form__group mb0">
				<p class="form__label"><?php esc_html_e( 'Loading Animation', 'embedpress'); ?> <span class="isPro">PRO</span></p>
				<div class="form__control__wrap">
					<label class="input__switch switch__text">
						<input type="checkbox" name="g_loading_animation" value="yes" disabled>
						<span></span>
					</label>
				</div>
			</div>
            <?php do_action( 'embedpress_after_general_settings_fields');  ?>
            <button class="button button__themeColor radius-10" name="submit" value="general"><?php esc_html_e( 'Save Changes', 'embedpress'); ?></button>
        </form>
	</div>
</div>
