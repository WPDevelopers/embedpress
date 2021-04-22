<?php
/*
 * Wistia Settings page
 * all undefined vars comes from EmbedPressSettings.php or sometime from main-template.php
 * */

?>

<div class="embedpress__settings background__white radius-25 p40">
	<h3><?php esc_html_e( "Wistia Settings", "embedpress" ); ?></h3>
	<div class="embedpress__settings__form">
		<form action="" method="post" >
			<?php echo  $nonce_field ; ?>
			<div class="form__group">
				<p class="form__label"><?php esc_html_e( "Fullscreen Button", "embedpress" ); ?></p>
				<div class="form__control__wrap">
					<div class="input__flex">
						<label class="input__radio">
							<input type="radio" value="0" name="display_fullscreen_button">
							<span><?php esc_html_e( "No", "embedpress" ); ?></span>
						</label>
						<label class="input__radio">
							<input type="radio" value="1" name="display_fullscreen_button" checked>
							<span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
						</label>
					</div>
					<p><?php esc_html_e( "Indicates whether the fullscreen button is visible.", "embedpress" ); ?></p>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label"><?php esc_html_e( "Playbar", "embedpress" ); ?></p>
				<div class="form__control__wrap">
					<div class="input__flex">
						<label class="input__radio">
							<input type="radio" value="0" name="display_playbar">
							<span><?php esc_html_e( "No", "embedpress" ); ?></span>
						</label>
						<label class="input__radio">
							<input type="radio" value="1" name="display_playbar" checked>
							<span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
						</label>
					</div>
					<p><?php esc_html_e( "Indicates whether the playbar is visible.", "embedpress" ); ?></p>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label"><?php esc_html_e( "Small Play Button", "embedpress" ); ?></p>
				<div class="form__control__wrap">
					<div class="input__flex">
						<label class="input__radio">
							<input type="radio" value="0" name="small_play_button">
							<span><?php esc_html_e( "No", "embedpress" ); ?></span>
						</label>
						<label class="input__radio">
							<input type="radio" value="1" name="small_play_button" checked>
							<span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
						</label>
					</div>
					<p><?php esc_html_e( "Indicates whether the small play button is visible on the bottom left.", "embedpress" ); ?></p>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label"><?php esc_html_e( "Volume Control", "embedpress" ); ?> <span class="isPro">Pro</span></p>
				<div class="form__control__wrap">
					<div class="input__flex">
						<label class="input__radio">
							<input type="radio" value="0" name="display_volume_control" disabled>
							<span><?php esc_html_e( "No", "embedpress" ); ?></span>
						</label>
						<label class="input__radio">
							<input type="radio" value="1" name="display_volume_control" disabled checked>
							<span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
						</label>
					</div>
					<p><?php esc_html_e( "Indicates whether the volume control is visible.", "embedpress" ); ?></p>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label"><?php esc_html_e( "Auto Play", "embedpress" ); ?></p>
				<div class="form__control__wrap">
					<div class="input__flex">
						<label class="input__radio">
							<input type="radio" value="0" name="autoplay" checked>
							<span><?php esc_html_e( "No", "embedpress" ); ?></span>
						</label>
						<label class="input__radio">
							<input type="radio" value="1" name="autoplay">
							<span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
						</label>
					</div>
					<p><?php esc_html_e( "Automatically start to play the videos when the player loads.", "embedpress" ); ?></p>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label"><?php esc_html_e( "Volume", "embedpress" ); ?></p>
				<div class="form__control__wrap">
					<input type="number" class="form__control" value="100" name="volume">
					<p><?php esc_html_e( "Start the video with a custom volume level. Set values between 0 and 100.", "embedpress" ); ?></p>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label"><?php esc_html_e( "Color", "embedpress" ); ?></p>
				<div class="form__control__wrap">
                    <input type="text" name="player_color" value="#00adef">
					<a href="#" class="button radius-10">Select Color</a>
					<p><?php esc_html_e( "Specify the color of the video controls.", "embedpress" ); ?></p>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label"><?php esc_html_e( "Plugin: Resumable", "embedpress" ); ?></p>
				<div class="form__control__wrap">
					<div class="input__flex">
						<label class="input__radio">
							<input type="radio" value="0" name="plugin_resumable">
							<span><?php esc_html_e( "No", "embedpress" ); ?></span>
						</label>
						<label class="input__radio">
							<input type="radio" value="1" name="plugin_resumable">
							<span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
						</label>
					</div>
					<p><?php esc_html_e( "Indicates whether the Resumable plugin is active. Allow to resume the video or start from the begining.", "embedpress" ); ?></p>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label"><?php esc_html_e( "Plugin: Captions", "embedpress" ); ?> <span class="isPro">Pro</span></p>
				<div class="form__control__wrap">
					<div class="input__flex">
						<label class="input__radio">
							<input type="radio" value="0" name="plugin_captions" disabled>
							<span><?php esc_html_e( "No", "embedpress" ); ?></span>
						</label>
						<label class="input__radio">
							<input type="radio" value="1" name="plugin_captions" disabled>
							<span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
						</label>
					</div>
					<p><?php esc_html_e( "Indicates whether the Captions plugin is active.", "embedpress" ); ?></p>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label"><?php esc_html_e( "Captions Enabled By Default", "embedpress" ); ?> <span class="isPro">Pro</span></p>
				<div class="form__control__wrap">
					<div class="input__flex">
						<label class="input__radio">
							<input type="radio" value="0" name="plugin_captions_default" disabled>
							<span><?php esc_html_e( "No", "embedpress" ); ?></span>
						</label>
						<label class="input__radio">
							<input type="radio" value="1" name="plugin_captions_default" disabled>
							<span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
						</label>
					</div>
					<p><?php esc_html_e( "Indicates whether the Captions are enabled by default.", "embedpress" ); ?></p>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label">Plugin: Focus</p>
				<div class="form__control__wrap">
					<div class="input__flex">
						<label class="input__radio">
							<input type="radio" value="0" name="plugin_focus">
							<span><?php esc_html_e( "No", "embedpress" ); ?></span>
						</label>
						<label class="input__radio">
							<input type="radio" value="1" name="plugin_focus">
							<span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
						</label>
					</div>
					<p><?php esc_html_e( "Indicates whether the Focus plugin is active.", "embedpress" ); ?></p>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label"><?php esc_html_e( "Plugin: Rewind", "embedpress" ); ?></p>
				<div class="form__control__wrap">
					<div class="input__flex">
						<label class="input__radio">
							<input type="radio" value="0" name="plugin_rewind">
							<span><?php esc_html_e( "No", "embedpress" ); ?></span>
						</label>
						<label class="input__radio">
							<input type="radio" value="1" name="plugin_rewind">
							<span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
						</label>
					</div>
					<p><?php esc_html_e( "Indicates whether the Rewind plugin is active.", "embedpress" ); ?></p>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label"><?php esc_html_e( "Rewind time (seconds)", "embedpress" ); ?></p>
				<div class="form__control__wrap">
					<input type="text" class="form__control" value="10" name="plugin_rewind_time">
					<p><?php esc_html_e( "The amount of time to rewind, in seconds.", "embedpress" ); ?></p>
				</div>
			</div>
            <button class="button button__themeColor radius-10" name="submit" value="wistia"><?php esc_html_e( 'Save Changes', 'embedpress'); ?></button>
		</form>
	</div>
</div>
