<?php
/*
 * Twitch Settings page
 * All undefined vars comes from 'render_settings_page' method
 *  */

$twitch_settings = get_option( EMBEDPRESS_PLG_NAME.':twitch');
$embedpress_pro_video_start_time = !empty( $twitch_settings['embedpress_pro_video_start_time']) ? $twitch_settings['embedpress_pro_video_start_time'] : 0;
$embedpress_pro_twitch_autoplay = !empty( $twitch_settings['embedpress_pro_twitch_autoplay']) ? $twitch_settings['embedpress_pro_twitch_autoplay'] : 'yes';
$embedpress_pro_twitch_chat = !empty( $twitch_settings['embedpress_pro_twitch_chat']) ? $twitch_settings['embedpress_pro_twitch_chat'] : 'no';
$embedpress_pro_twitch_theme = !empty( $twitch_settings['embedpress_pro_twitch_theme']) ? $twitch_settings['embedpress_pro_twitch_theme'] : 'light';
$embedpress_pro_fs = !empty( $twitch_settings['embedpress_pro_fs']) ? $twitch_settings['embedpress_pro_fs'] : 'yes';
$embedpress_pro_twitch_mute = !empty( $twitch_settings['embedpress_pro_twitch_mute']) ? $twitch_settings['embedpress_pro_twitch_mute'] : 'yes';

?>

<div class="embedpress__settings background__white radius-25 p40">
	<h3><?php esc_html_e( "Twitch Settings", "embedpress" ); ?></h3>
	<div class="embedpress__settings__form">
		<form action="" method="post" >
			<?php
            do_action( 'embedpress_before_twitch_settings_fields');
            echo  $nonce_field ; ?>
			<div class="form__group">
				<p class="form__label" ><?php esc_html_e( "Start Time (in Seconds)", "embedpress" );   echo $pro_active ? '': ' <span class="isPro">PRO</span>';?> </p>
				<div class="form__control__wrap">
					<input type="text" name="start_time" id="start_time" class="form__control" value="" disabled>
					<p><?php esc_html_e( "You can put a custom time in seconds to start video from. Example: 500", "embedpress" ); ?></p>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label"><?php esc_html_e( "Auto Play", "embedpress" ); ?></p>
				<div class="form__control__wrap">
					<div class="input__flex">
						<label class="input__radio">
							<input type="radio" name="autoplay" value="no">
							<span><?php esc_html_e( "No", "embedpress" ); ?></span>
						</label>
						<label class="input__radio">
							<input type="radio" name="autoplay" value="yes">
							<span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
						</label>
					</div>
					<p><?php esc_html_e( "Automatically start to play the videos when the player loads.", "embedpress" ); ?></p>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label"><?php esc_html_e( "Show chat", "embedpress" );  echo $pro_active ? '': ' <span class="isPro">PRO</span>'; ?> </p>
				<div class="form__control__wrap">
					<div class="input__flex">
						<label class="input__radio">
							<input type="radio" name="show_chat" value="no" disabled>
							<span><?php esc_html_e( "No", "embedpress" ); ?></span>
						</label>
						<label class="input__radio">
							<input type="radio" name="show_chat" value="yes" disabled>
							<span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
						</label>
					</div>
					<p><?php esc_html_e( "You can show or hide chat using this settings", "embedpress" ); ?></p>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label"><?php esc_html_e( "Theme", "embedpress" );  echo $pro_active ? '': ' <span class="isPro">PRO</span>'; ?> </p>
				<div class="form__control__wrap">
					<div class="embedpress__select">
						<span><i class="ep-icon ep-caret-down"></i></span>
						<select name="theme" disabled>
							<option value="dark"><?php esc_html_e( "Dark", "embedpress" ); ?></option>
							<option value="light"><?php esc_html_e( "Light", "embedpress" ); ?></option>
						</select>
					</div>
					<p><?php esc_html_e( "Set dark or light theme for the twitch comment.", "embedpress" ); ?></p>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label"><?php esc_html_e( "Enable Fullsccreen button", "embedpress" ); ?></p>
				<div class="form__control__wrap">
                    <div class="input__flex">
                        <label class="input__radio">
                            <input type="radio" name="fs" value="no">
                            <span><?php esc_html_e( "No", "embedpress" ); ?></span>
                        </label>
                        <label class="input__radio">
                            <input type="radio" name="fs" value="yes">
                            <span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
                        </label>
                    </div>
					<p><?php esc_html_e( "Indicates whether the fullscreen button is enabled.", "embedpress" ); ?></p>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label"><?php esc_html_e( "Mute on start", "embedpress" );  echo $pro_active ? '': ' <span class="isPro">PRO</span>'; ?> </p>
				<div class="form__control__wrap">
                    <div class="input__flex">
                        <label class="input__radio">
                            <input type="radio" name="mute" value="no" disabled>
                            <span><?php esc_html_e( "No", "embedpress" ); ?></span>
                        </label>
                        <label class="input__radio">
                            <input type="radio" name="mute" value="yes" disabled>
                            <span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
                        </label>
                    </div>
					<p><?php esc_html_e( "Set it to Yes to mute the video on start.", "embedpress" ); ?></p>
				</div>
			</div>
			<?php do_action( 'embedpress_after_twitch_settings_fields'); ?>
            <button class="button button__themeColor radius-10" name="submit" value="twitch"><?php esc_html_e( 'Save Changes', 'embedpress'); ?></button>
		</form>
	</div>
</div>
