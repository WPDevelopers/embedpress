<?php
/*
 * Twitch Settings page */
?>

<div class="embedpress__settings background__white radius-25 p40">
	<h3><?php esc_html_e( "Twitch Settings", "embedpress" ); ?></h3>
	<div class="embedpress__settings__form">
		<form action="" method="post" >
			<?php
            do_action( 'embedpress_before_twitch_settings_fields');
            echo  $nonce_field ; ?>
			<div class="form__group">
				<p class="form__label"><?php esc_html_e( "Start Time (in Seconds)", "embedpress" ); ?></p>
				<div class="form__control__wrap">
					<input type="text" class="form__control">
					<p><?php esc_html_e( "You can put a custom time in seconds to start video from. Example: 500", "embedpress" ); ?></p>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label"><?php esc_html_e( "Auto Play", "embedpress" ); ?></p>
				<div class="form__control__wrap">
					<div class="input__flex">
						<label class="input__radio">
							<input type="radio" name="autoplay">
							<span><?php esc_html_e( "No", "embedpress" ); ?></span>
						</label>
						<label class="input__radio">
							<input type="radio" name="autoplay">
							<span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
						</label>
					</div>
					<p><?php esc_html_e( "Automatically start to play the videos when the player loads.", "embedpress" ); ?></p>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label"><?php esc_html_e( "Show chat", "embedpress" ); ?> <span class="isPro">Pro</span></p>
				<div class="form__control__wrap">
					<div class="input__flex">
						<label class="input__radio">
							<input type="radio" name="fullbutton" disabled>
							<span><?php esc_html_e( "No", "embedpress" ); ?></span>
						</label>
						<label class="input__radio">
							<input type="radio" name="fullbutton" disabled>
							<span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
						</label>
					</div>
					<p><?php esc_html_e( "You can show or hide chat using this settings", "embedpress" ); ?></p>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label"><?php esc_html_e( "Theme", "embedpress" ); ?></p>
				<div class="form__control__wrap">
					<div class="embedpress__select">
						<span><i class="ep-icon ep-caret-down"></i></span>
						<select>
							<option value=""><?php esc_html_e( "Dark", "embedpress" ); ?></option>
							<option value=""><?php esc_html_e( "Light", "embedpress" ); ?></option>
						</select>
					</div>
					<p><?php esc_html_e( "Set dark or light theme for the twitch comment.", "embedpress" ); ?></p>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label"><?php esc_html_e( "Enable Fullsccreen button", "embedpress" ); ?> <span class="isPro">Pro</span></p>
				<div class="form__control__wrap">
					<div class="embedpress__select">
						<span><i class="ep-icon ep-caret-down"></i></span>
						<select disabled>
							<option value=""><?php esc_html_e( "Yes", "embedpress" ); ?></option>
							<option value=""><?php esc_html_e( "No", "embedpress" ); ?></option>
						</select>
					</div>
					<p><?php esc_html_e( "Indicates whether the fullscreen button is enabled.", "embedpress" ); ?></p>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label"><?php esc_html_e( "Mute on start", "embedpress" ); ?></p>
				<div class="form__control__wrap">
					<div class="embedpress__select">
						<span><i class="ep-icon ep-caret-down"></i></span>
						<select>
							<option value=""><?php esc_html_e( "Yes", "embedpress" ); ?></option>
							<option value=""><?php esc_html_e( "No", "embedpress" ); ?></option>
						</select>
					</div>
					<p><?php esc_html_e( "Set it to Yes to mute the video on start.", "embedpress" ); ?></p>
				</div>
			</div>
			<?php do_action( 'embedpress_after_twitch_settings_fields'); ?>
            <button class="button button__themeColor radius-10" name="submit" value="twitch"><?php esc_html_e( 'Save Changes', 'embedpress'); ?></button>
		</form>
	</div>
</div>
