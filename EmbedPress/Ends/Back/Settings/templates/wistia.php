<?php
/*
 * Wistia Settings page
 * all undefined vars comes from EmbedPressSettings.php or sometime from main-template.php
 * */
$wis_settings = get_option( EMBEDPRESS_PLG_NAME.':wistia' );
$start_time = isset( $wis_settings['start_time']) ? $wis_settings['start_time'] : 0;
$autoplay = isset( $wis_settings['autoplay']) ? $wis_settings['autoplay'] : '';
$display_fullscreen_button = isset( $wis_settings['display_fullscreen_button']) ? $wis_settings['display_fullscreen_button'] : 1;
$display_playbar = isset( $wis_settings['display_playbar']) ? $wis_settings['display_playbar'] : 1;
$small_play_button = isset( $wis_settings['small_play_button']) ? $wis_settings['small_play_button'] : 1;
$display_volume_control = isset( $wis_settings['display_volume_control']) ? $wis_settings['display_volume_control'] : 1;
$volume = isset( $wis_settings['volume']) ? intval( $wis_settings['volume']) : 100;
$player_color = isset( $wis_settings['player_color']) ? $wis_settings['player_color'] : '#5b4e96'; //@todo; confirm #00adef
$plugin_resumable = isset( $wis_settings['plugin_resumable']) ? $wis_settings['plugin_resumable'] : '';
$plugin_captions = isset( $wis_settings['plugin_captions']) ? $wis_settings['plugin_captions'] : '';
$plugin_captions_default = isset( $wis_settings['plugin_captions_default']) ? $wis_settings['plugin_captions_default'] : '';
$plugin_focus = isset( $wis_settings['plugin_focus']) ? $wis_settings['plugin_focus'] : '';
$plugin_rewind = isset( $wis_settings['plugin_rewind']) ? $wis_settings['plugin_rewind'] : '';
$plugin_rewind_time = isset( $wis_settings['plugin_rewind_time']) ? intval( $wis_settings['plugin_rewind_time']) : 10;
?>

<div class="embedpress__settings background__white radius-25 p40">
	<h3><?php esc_html_e( "Wistia Settings", "embedpress" ); ?></h3>
	<div class="embedpress__settings__form">
		<form action="" method="post" class="embedpress-settings-form" >
			<?php
			do_action( 'embedpress_before_wistia_settings_fields');
            echo  $nonce_field ;
            ?>
            <div class="form__group">
                <p class="form__label" ><?php esc_html_e( "Start Time (In Seconds)", "embedpress" ); ?> </p>
                <div class="form__control__wrap">
                    <input type="number"  name="start_time" id="start_time" class="form__control" data-default="<?php echo esc_attr( $start_time); ?>" value="<?php echo esc_attr( $start_time); ?>" >
                    <p><?php esc_html_e( "You can put a custom time in seconds to start video. Example: 500", "embedpress" ); ?></p>
                </div>

            </div>
			<div class="form__group">
				<p class="form__label"><?php esc_html_e( "Fullscreen Button", "embedpress" ); ?></p>
				<div class="form__control__wrap">
					<div data-default="<?php echo esc_attr(  $display_fullscreen_button ); ?>" data-value="<?php echo esc_attr(  $display_fullscreen_button ); ?>" class="input__flex input__radio_wrap">
						<label class="input__radio">
							<input type="radio" value="" name="display_fullscreen_button" <?php  checked( '', $display_fullscreen_button); ?>>
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
				<p class="form__label"><?php esc_html_e( "Playbar", "embedpress" );?> </p>
				<div class="form__control__wrap">
					<div data-default="<?php echo esc_attr(  $display_playbar ); ?>" data-value="<?php echo esc_attr(  $display_playbar ); ?>" class="input__flex input__radio_wrap ">
						<label class="input__radio">
							<input type="radio" value="" name="display_playbar" <?php  checked( '', $display_playbar); ?>>
							<span><?php esc_html_e( "No", "embedpress" ); ?></span>
						</label>
						<label class="input__radio">
							<input type="radio" value="1" name="display_playbar" <?php  checked( '1', $display_playbar); ?>>
							<span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
						</label>
					</div>
                    <p><?php esc_html_e( "Indicates whether the playbar is visible.", "embedpress" ); ?></p>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label"><?php esc_html_e( "Small Play Button", "embedpress" ); ?></p>
				<div class="form__control__wrap">
					<div data-default="<?php echo esc_attr(  $small_play_button ); ?>" data-value="<?php echo esc_attr(  $small_play_button ); ?>" class="input__flex input__radio_wrap">
						<label class="input__radio">
							<input type="radio" value="" name="small_play_button" <?php checked( '', $small_play_button); ?>>
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
					<div data-default="<?php echo esc_attr(  $display_volume_control ); ?>" data-value="<?php echo esc_attr(  $display_volume_control ); ?>" class="input__flex input__radio_wrap <?php echo $pro_active ? '': 'isPro'; ?>">
						<label class="input__radio">
							<input type="radio" value="" name="display_volume_control" <?php echo $pro_active ? '' : 'disabled'; checked( '', $display_volume_control); ?>>
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
					<input type="number" max="100" min="0" class="form__control" data-default="<?php echo esc_attr( $volume ); ?>" value="<?php echo esc_attr( $volume ); ?>" name="volume" <?php echo $pro_active ? '' : 'disabled'; ?>>

                    <p><?php esc_html_e( "Start the video with a custom volume level. Set values between 0 and 100.", "embedpress" ); ?></p>
				</div>
				<?php if ( !$pro_active ) {  include EMBEDPRESS_SETTINGS_PATH . 'templates/partials/alert-pro.php'; } ?>

            </div>

            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "Auto Play", "embedpress" ); ?></p>
                <div class="form__control__wrap">
                    <div data-default="<?php echo esc_attr(  $autoplay ); ?>" data-value="<?php echo esc_attr(  $autoplay ); ?>" class="input__flex input__radio_wrap">
                        <label class="input__radio">
                            <input type="radio" value="" name="autoplay" <?php checked( '', $autoplay);?>>
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
				<p class="form__label"><?php esc_html_e( "Color", "embedpress" ); ?></p>
				<div class="form__control__wrap">
                    <input type="text" class="ep-color-picker" name="player_color" data-default="<?php echo esc_attr( $player_color ); ?>" value="<?php echo esc_attr( $player_color ); ?>">
					<p><?php esc_html_e( "Specify the color of the video controls.", "embedpress" ); ?></p>
				</div>
			</div>

			<div class="form__group">
				<p class="form__label"><?php esc_html_e( "Plugin: Resumable", "embedpress" ); ?></p>
				<div class="form__control__wrap">
					<div data-default="<?php echo esc_attr(  $plugin_resumable ); ?>" data-value="<?php echo esc_attr(  $plugin_resumable ); ?>" class="input__flex input__radio_wrap">
						<label class="input__radio">
							<input type="radio" value="" name="plugin_resumable" <?php checked( '', $plugin_resumable);?>>
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
					<div data-default="<?php echo esc_attr(  $plugin_captions ); ?>" data-value="<?php echo esc_attr(  $plugin_captions ); ?>" class="input__flex input__radio_wrap <?php echo $pro_active ? '': 'isPro'; ?>">
						<label class="input__radio">
							<input type="radio" value="" name="plugin_captions" <?php echo $pro_active ? '' : 'disabled'; checked( '', $plugin_captions); ?>>
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
					<div data-default="<?php echo esc_attr(  $plugin_captions_default ); ?>" data-value="<?php echo esc_attr(  $plugin_captions_default ); ?>" class="input__flex input__radio_wrap <?php echo $pro_active ? '': 'isPro'; ?>">
						<label class="input__radio">
							<input type="radio" value="" name="plugin_captions_default" <?php echo $pro_active ? '' : 'disabled'; checked( '', $plugin_captions_default); ?>>
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
					<div data-default="<?php echo esc_attr(  $plugin_focus ); ?>" data-value="<?php echo esc_attr(  $plugin_focus ); ?>" class="input__flex input__radio_wrap">
						<label class="input__radio">
							<input type="radio" value="" name="plugin_focus" <?php checked( '', $plugin_focus); ?>>
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
				<p class="form__label"><?php esc_html_e( "Plugin: Rewind", "embedpress" );?> </p>
				<div class="form__control__wrap">
					<div data-default="<?php echo esc_attr(  $plugin_rewind ); ?>" data-value="<?php echo esc_attr(  $plugin_rewind ); ?>" class="input__flex input__radio_wrap">
						<label class="input__radio">
							<input type="radio" value="" name="plugin_rewind" <?php  checked( '', $plugin_rewind); ?>>
							<span><?php esc_html_e( "No", "embedpress" ); ?></span>
						</label>
						<label class="input__radio">
							<input type="radio" value="1" name="plugin_rewind" <?php  checked( '1', $plugin_rewind); ?>>
							<span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
						</label>
					</div>
					<p><?php esc_html_e( "Indicates whether the Rewind plugin is active.", "embedpress" ); ?></p>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label"><?php esc_html_e( "Rewind Time (In Seconds)", "embedpress" ); ?> </p>
				<div class="form__control__wrap">
					<input type="number" class="form__control" data-default="<?php echo esc_attr( $plugin_rewind_time );?>" value="<?php echo esc_attr( $plugin_rewind_time );?>" name="plugin_rewind_time" >
					<p><?php esc_html_e( "The amount of time to rewind, in seconds.", "embedpress" ); ?></p>
				</div>
            </div>
			<?php do_action( 'embedpress_after_wistia_settings_fields'); ?>
            <button class="button button__themeColor radius-10 embedpress-submit-btn" name="submit" value="wistia"><?php esc_html_e( 'Save Changes', 'embedpress'); ?></button>
		</form>
	</div>
</div>
