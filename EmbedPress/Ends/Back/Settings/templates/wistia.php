<?php
/*
 * Wistia Settings page
 * all undefined vars comes from EmbedPressSettings.php or sometime from main-template.php
 * */
$wis_settings = get_option( EMBEDPRESS_PLG_NAME.':wistia' );
$autoplay = !empty( $wis_settings['autoplay']) ? $wis_settings['autoplay'] : 0;
$display_fullscreen_button = !empty( $wis_settings['display_fullscreen_button']) ? $wis_settings['display_fullscreen_button'] : 0;
$display_playbar = !empty( $wis_settings['display_playbar']) ? $wis_settings['display_playbar'] : 0;
$small_play_button = !empty( $wis_settings['small_play_button']) ? $wis_settings['small_play_button'] : 0;
$display_volume_control = !empty( $wis_settings['display_volume_control']) ? $wis_settings['display_volume_control'] : 0;
$volume = !empty( $wis_settings['volume']) ? $wis_settings['volume'] : 0;
$player_color = !empty( $wis_settings['player_color']) ? $wis_settings['player_color'] : '#00adef';
$plugin_resumable = !empty( $wis_settings['plugin_resumable']) ? $wis_settings['plugin_resumable'] : 0;
$plugin_captions = !empty( $wis_settings['plugin_captions']) ? $wis_settings['plugin_captions'] : 0;
$plugin_captions_default = !empty( $wis_settings['plugin_captions_default']) ? $wis_settings['plugin_captions_default'] : 0;
$plugin_focus = !empty( $wis_settings['plugin_focus']) ? $wis_settings['plugin_focus'] : 0;
$plugin_rewind = !empty( $wis_settings['plugin_rewind']) ? $wis_settings['plugin_rewind'] : 0;
$plugin_rewind_time = !empty( $wis_settings['plugin_rewind_time']) ? $wis_settings['plugin_rewind_time'] : 0;
?>

<div class="embedpress__settings background__white radius-25 p40">
	<h3><?php esc_html_e( "Wistia Settings", "embedpress" ); ?></h3>
	<div class="embedpress__settings__form">
		<form action="" method="post" >
			<?php
			do_action( 'embedpress_before_wistia_settings_fields');
            echo  $nonce_field ;
            ?>
			<div class="form__group">
				<p class="form__label"><?php esc_html_e( "Fullscreen Button", "embedpress" ); ?></p>
				<div class="form__control__wrap">
					<div class="input__flex">
						<label class="input__radio">
							<input type="radio" value="0" name="display_fullscreen_button" <?php  checked( '0', $display_fullscreen_button); ?>>
							<span><?php esc_html_e( "No", "embedpress" ); ?></span>
						</label>
						<label class="input__radio">
							<input type="radio" value="1" name="display_fullscreen_button" <?php  checked( '1', $display_fullscreen_button); ?>>
							<span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
						</label>
					</div>
					<p><?php esc_html_e( "Indicates whether the fullscreen button is visible.", "embedpress" ); ?></p>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label"><?php esc_html_e( "Playbar", "embedpress" ); echo $pro_active ? '': ' <span class="isPro">PRO</span>'; ?> </p>
				<div class="form__control__wrap">
					<div class="input__flex  <?php echo $pro_active ? '': 'isPro'; ?>">
						<label class="input__radio">
							<input type="radio" value="0" name="display_playbar" <?php echo $pro_active ? '' : 'disabled'; checked( '0', $display_playbar); ?>>
							<span><?php esc_html_e( "No", "embedpress" ); ?></span>
						</label>
						<label class="input__radio">
							<input type="radio" value="1" name="display_playbar" <?php echo $pro_active ? '' : 'disabled'; checked( '1', $display_playbar); ?>>
							<span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
						</label>
					</div>
					<?php if ( !$pro_active ) {  include EMBEDPRESS_SETTINGS_PATH . 'templates/partials/alert-pro.php'; } ?>
                    <p><?php esc_html_e( "Indicates whether the playbar is visible.", "embedpress" ); ?></p>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label"><?php esc_html_e( "Small Play Button", "embedpress" ); ?></p>
				<div class="form__control__wrap">
					<div class="input__flex">
						<label class="input__radio">
							<input type="radio" value="0" name="small_play_button" <?php checked( '0', $small_play_button); ?>>
							<span><?php esc_html_e( "No", "embedpress" ); ?></span>
						</label>
						<label class="input__radio">
							<input type="radio" value="1" name="small_play_button" <?php checked( '1', $small_play_button); ?>>
							<span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
						</label>
					</div>
					<p><?php esc_html_e( "Indicates whether the small play button is visible on the bottom left.", "embedpress" ); ?></p>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label"><?php esc_html_e( "Volume Control", "embedpress" );  echo $pro_active ? '': ' <span class="isPro">PRO</span>'; ?> </p>
				<div class="form__control__wrap">
					<div class="input__flex <?php echo $pro_active ? '': 'isPro'; ?>">
						<label class="input__radio">
							<input type="radio" value="0" name="display_volume_control" <?php echo $pro_active ? '' : 'disabled'; checked( '0', $display_volume_control); ?>>
							<span><?php esc_html_e( "No", "embedpress" ); ?></span>
						</label>
						<label class="input__radio">
							<input type="radio" value="1" name="display_volume_control" <?php echo $pro_active ? '' : 'disabled'; checked( '1', $display_volume_control); ?>>
							<span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
						</label>
					</div>
					<?php if ( !$pro_active ) {  include EMBEDPRESS_SETTINGS_PATH . 'templates/partials/alert-pro.php'; } ?>
                    <p><?php esc_html_e( "Indicates whether the volume control is visible.", "embedpress" ); ?></p>
				</div>
			</div>

			<div class="form__group">
				<p class="form__label"><?php esc_html_e( "Volume", "embedpress" ); echo $pro_active ? '': ' <span class="isPro">PRO</span>'; ?> </p>
				<div class="form__control__wrap <?php echo $pro_active ? '': 'isPro'; ?>">
					<input type="number" class="form__control" value="<?php echo esc_attr( $volume ); ?>" name="volume" <?php echo $pro_active ? '' : 'disabled'; ?>>

                    <p><?php esc_html_e( "Start the video with a custom volume level. Set values between 0 and 100.", "embedpress" ); ?></p>
				</div>
				<?php if ( !$pro_active ) {  include EMBEDPRESS_SETTINGS_PATH . 'templates/partials/alert-pro.php'; } ?>

            </div>
			<div class="form__group">
				<p class="form__label"><?php esc_html_e( "Color", "embedpress" ); ?></p>
				<div class="form__control__wrap">
                    <input type="text" class="ep-color-picker" name="player_color" value="<?php echo esc_attr( $player_color ); ?>">
					<p><?php esc_html_e( "Specify the color of the video controls.", "embedpress" ); ?></p>
				</div>
			</div>

            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "Auto Play", "embedpress" ); ?></p>
                <div class="form__control__wrap">
                    <div class="input__flex">
                        <label class="input__radio">
                            <input type="radio" value="0" name="autoplay" <?php checked( '0', $autoplay);?>>
                            <span><?php esc_html_e( "No", "embedpress" ); ?></span>
                        </label>
                        <label class="input__radio">
                            <input type="radio" value="1" name="autoplay" <?php checked( '1', $autoplay);?>>
                            <span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
                        </label>
                    </div>
                    <p><?php esc_html_e( "Automatically start to play the videos when the player loads.", "embedpress" ); ?></p>
                </div>
            </div>
			<div class="form__group">
				<p class="form__label"><?php esc_html_e( "Plugin: Resumable", "embedpress" ); ?></p>
				<div class="form__control__wrap">
					<div class="input__flex">
						<label class="input__radio">
							<input type="radio" value="0" name="plugin_resumable" <?php checked( '0', $plugin_resumable);?>>
							<span><?php esc_html_e( "No", "embedpress" ); ?></span>
						</label>
						<label class="input__radio">
							<input type="radio" value="1" name="plugin_resumable" <?php checked( '1', $plugin_resumable);?>>
							<span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
						</label>
					</div>
					<p><?php esc_html_e( "Indicates whether the Resumable plugin is active. Allow to resume the video or start from the beginning.", "embedpress" ); ?></p>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label"><?php esc_html_e( "Plugin: Captions", "embedpress" );  echo $pro_active ? '': ' <span class="isPro">PRO</span>'; ?> </p>
				<div class="form__control__wrap">
					<div class="input__flex <?php echo $pro_active ? '': 'isPro'; ?>">
						<label class="input__radio">
							<input type="radio" value="0" name="plugin_captions" <?php echo $pro_active ? '' : 'disabled'; checked( '0', $plugin_captions); ?>>
							<span><?php esc_html_e( "No", "embedpress" ); ?></span>
						</label>
						<label class="input__radio">
							<input type="radio" value="1" name="plugin_captions" <?php echo $pro_active ? '' : 'disabled'; checked( '1', $plugin_captions); ?>>
							<span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
						</label>
					</div>
					<?php if ( !$pro_active ) {  include EMBEDPRESS_SETTINGS_PATH . 'templates/partials/alert-pro.php'; } ?>
					<p><?php esc_html_e( "Indicates whether the Captions plugin is active.", "embedpress" ); ?></p>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label"><?php esc_html_e( "Captions Enabled By Default", "embedpress" );  echo $pro_active ? '': ' <span class="isPro">PRO</span>'; ?> </p>
				<div class="form__control__wrap">
					<div class="input__flex <?php echo $pro_active ? '': 'isPro'; ?>">
						<label class="input__radio">
							<input type="radio" value="0" name="plugin_captions_default" <?php echo $pro_active ? '' : 'disabled'; checked( '0', $plugin_captions_default); ?>>
							<span><?php esc_html_e( "No", "embedpress" ); ?></span>
						</label>
						<label class="input__radio">
							<input type="radio" value="1" name="plugin_captions_default" <?php echo $pro_active ? '' : 'disabled'; checked( '1', $plugin_captions_default); ?>>
							<span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
						</label>
					</div>
					<?php if ( !$pro_active ) {  include EMBEDPRESS_SETTINGS_PATH . 'templates/partials/alert-pro.php'; } ?>
					<p><?php esc_html_e( "Indicates whether the Captions are enabled by default.", "embedpress" ); ?></p>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label">Plugin: Focus</p>
				<div class="form__control__wrap">
					<div class="input__flex">
						<label class="input__radio">
							<input type="radio" value="0" name="plugin_focus" <?php checked( '0', $plugin_focus); ?>>
							<span><?php esc_html_e( "No", "embedpress" ); ?></span>
						</label>
						<label class="input__radio">
							<input type="radio" value="1" name="plugin_focus" <?php checked( '1', $plugin_focus); ?>>
							<span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
						</label>
					</div>
					<p><?php esc_html_e( "Indicates whether the Focus plugin is active.", "embedpress" ); ?></p>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label"><?php esc_html_e( "Plugin: Rewind", "embedpress" );  echo $pro_active ? '': ' <span class="isPro">PRO</span>'; ?> </p>
				<div class="form__control__wrap">
					<div class="input__flex <?php echo $pro_active ? '': 'isPro'; ?>">
						<label class="input__radio">
							<input type="radio" value="0" name="plugin_rewind" <?php echo $pro_active ? '' : 'disabled'; checked( '0', $plugin_rewind); ?>>
							<span><?php esc_html_e( "No", "embedpress" ); ?></span>
						</label>
						<label class="input__radio">
							<input type="radio" value="1" name="plugin_rewind" <?php echo $pro_active ? '' : 'disabled'; checked( '1', $plugin_rewind); ?>>
							<span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
						</label>
					</div>
					<?php if ( !$pro_active ) {  include EMBEDPRESS_SETTINGS_PATH . 'templates/partials/alert-pro.php'; } ?>
					<p><?php esc_html_e( "Indicates whether the Rewind plugin is active.", "embedpress" ); ?></p>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label"><?php esc_html_e( "Rewind Time (In Seconds)", "embedpress" );  echo $pro_active ? '': ' <span class="isPro">PRO</span>'; ?> </p>
				<div class="form__control__wrap <?php echo $pro_active ? '': 'isPro'; ?>">
					<input type="number" class="form__control" value="<?php echo esc_attr( $plugin_rewind_time );?>" name="plugin_rewind_time" <?php echo $pro_active ? '' : 'disabled'; ?>>
					<p><?php esc_html_e( "The amount of time to rewind, in seconds.", "embedpress" ); ?></p>
				</div>
				<?php if ( !$pro_active ) {  include EMBEDPRESS_SETTINGS_PATH . 'templates/partials/alert-pro.php'; } ?>
            </div>
			<?php do_action( 'embedpress_after_wistia_settings_fields'); ?>
            <button class="button button__themeColor radius-10" name="submit" value="wistia"><?php esc_html_e( 'Save Changes', 'embedpress'); ?></button>
		</form>
	</div>
</div>
