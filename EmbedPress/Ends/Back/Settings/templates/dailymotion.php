<?php
/*
 * Dailymotion Settings page
 *  All undefined vars comes from 'render_settings_page' method
 *  */
$dm_settings = get_option( EMBEDPRESS_PLG_NAME.':dailymotion');
$start_time = isset( $dm_settings['start_time']) ? $dm_settings['start_time'] : 0;

$autoplay = isset( $dm_settings['autoplay']) ? $dm_settings['autoplay'] : '';
$play_on_mobile = isset( $dm_settings['play_on_mobile']) ? $dm_settings['play_on_mobile'] : '';
$mute = isset( $dm_settings['mute']) ? $dm_settings['mute'] : '';
$controls = isset( $dm_settings['controls']) ? $dm_settings['controls'] : 1;
$video_info = isset( $dm_settings['video_info']) ? $dm_settings['video_info'] : 1;
$color = isset( $dm_settings['color']) ? $dm_settings['color'] : '#dd3333';
// pro
$start_time = isset( $dm_settings['start_time']) ? $dm_settings['start_time'] : 0;
$show_logo = isset( $dm_settings['show_logo']) ? $dm_settings['show_logo'] : 1;

?>

<div class="embedpress__settings background__white radius-25 p40">
	<h3><?php esc_html_e( "Dailymotion Settings", "embedpress" ); ?></h3>
	<div class="embedpress__settings__form">
		<form action="" method="post" class="embedpress-settings-form" >
			<?php
			do_action( 'embedpress_before_dailymotion_settings_fields');
			echo  $nonce_field ; ?>
            <div class="form__group">
                <p class="form__label" ><?php esc_html_e( "Start Time (In Seconds)", "embedpress" ); ?> </p>
                <div class="form__control__wrap">
                    <input type="number"  name="start_time" id="start_time" class="form__control" data-default="<?php echo esc_attr( $start_time); ?>" value="<?php echo esc_attr( $start_time); ?>" >
                    <p><?php esc_html_e( "You can put a custom time in seconds to start the video. Example: 500", "embedpress" ); ?></p>
                </div>

            </div>

			<div class="form__group">
				<p class="form__label"><?php esc_html_e( "Auto Play", "embedpress" ); ?></p>
				<div class="form__control__wrap">
					<div class="input__flex input__radio_wrap" data-default="<?php echo esc_attr(  $autoplay ); ?>" data-value="<?php echo esc_attr(  $autoplay ); ?>">
						<label class="input__radio">
							<input type="radio" name="autoplay" value="" <?php checked( '', $autoplay); ?>>
							<span><?php esc_html_e( "No", "embedpress" ); ?></span>
						</label>
						<label class="input__radio">
							<input type="radio" name="autoplay" value="1" <?php checked( '1', $autoplay); ?>>
							<span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
						</label>
					</div>
					<p><?php esc_html_e( "Automatically start to play the videos when the player loads.", "embedpress" ); ?></p>
				</div>
			</div>

            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "Autoplay On Mobile", "embedpress" ); ?></p>
                <div class="form__control__wrap">
                    <div class="input__flex input__radio_wrap" data-default="<?php echo esc_attr(  $play_on_mobile ); ?>" data-value="<?php echo esc_attr(  $play_on_mobile ); ?>">
                        <label class="input__radio">
                            <input type="radio" name="play_on_mobile" value="" <?php checked( '', $play_on_mobile); ?>>
                            <span><?php esc_html_e( "No", "embedpress" ); ?></span>
                        </label>
                        <label class="input__radio">
                            <input type="radio" name="play_on_mobile" value="1" <?php checked( '1', $play_on_mobile); ?>>
                            <span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
                        </label>
                    </div>
                    <p><?php esc_html_e( "You can control autoplay on mobile. Only works if Autoplay option is enabled.", "embedpress" ); ?></p>
                </div>
            </div>

            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "Mute", "embedpress" ); ?></p>
                <div class="form__control__wrap">
                    <div class="input__flex input__radio_wrap" data-default="<?php echo esc_attr(  $mute ); ?>" data-value="<?php echo esc_attr(  $mute ); ?>">
                        <label class="input__radio">
                            <input type="radio" name="mute" value="" <?php checked( '', $mute); ?>>
                            <span><?php esc_html_e( "No", "embedpress" ); ?></span>
                        </label>
                        <label class="input__radio">
                            <input type="radio" name="mute" value="1" <?php checked( '1', $mute); ?>>
                            <span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
                        </label>
                    </div>
                    <p><?php esc_html_e( "Mute the video that is auto played", "embedpress" ); ?></p>
                </div>
            </div>



            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "Display Player Controls", "embedpress" ); ?></p>
                <div class="form__control__wrap">
                    <div class="input__flex input__radio_wrap" data-default="<?php echo esc_attr(  $controls ); ?>" data-value="<?php echo esc_attr(  $controls ); ?>">
                        <label class="input__radio">
                            <input type="radio" name="controls" value="" <?php checked( '', $controls); ?>>
                            <span><?php esc_html_e( "No", "embedpress" ); ?></span>
                        </label>
                        <label class="input__radio">
                            <input type="radio" name="controls" value="1" <?php checked( '1', $controls); ?>>
                            <span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
                        </label>
                    </div>
                    <p><?php esc_html_e( 'Indicates whether the video player controls are displayed.', 'embedpress'); ?> </p>
                </div>
            </div>


            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "Display Video Info", "embedpress" ); ?></p>
                <div class="form__control__wrap">
                    <div class="input__flex input__radio_wrap" data-default="<?php echo esc_attr(  $video_info ); ?>" data-value="<?php echo esc_attr(  $video_info ); ?>">
                        <label class="input__radio">
                            <input type="radio" name="video_info" value="" <?php checked( '', $video_info); ?>>
                            <span><?php esc_html_e( "No", "embedpress" ); ?></span>
                        </label>
                        <label class="input__radio">
                            <input type="radio" name="video_info" value="1" <?php checked( '1', $video_info); ?>>
                            <span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
                        </label>
                    </div>
                    <p><?php esc_html_e( 'Indicates whether the video information is displayed.', 'embedpress'); ?> </p>
                </div>
            </div>


            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "Show Logo", "embedpress" ); echo !$pro_active ? ' <span class="isPro">PRO</span>': ''; ?></p>
                <div class="form__control__wrap">
                    <div class="input__flex input__radio_wrap <?php echo $pro_active ? '': 'isPro'; ?>" data-default="<?php echo esc_attr(  $show_logo ); ?>" data-value="<?php echo esc_attr(  $show_logo ); ?>">
                        <label class="input__radio">
                            <input type="radio" name="show_logo" value=""  <?php echo !$pro_active ? 'disabled ' : ''; checked( '', $show_logo); ?>>
                            <span><?php esc_html_e( "No", "embedpress" ); ?></span>
                        </label>
                        <label class="input__radio">
                            <input type="radio" name="show_logo" value="1"  <?php echo !$pro_active ? 'disabled ' : ''; checked( '1', $show_logo);?>>
                            <span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
                        </label>
                    </div>
					<?php if ( !$pro_active ) {  include EMBEDPRESS_SETTINGS_PATH . 'templates/partials/alert-pro.php'; } ?>
                </div>
            </div>



            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "Controls Color", "embedpress" ); ?></p>
                <div class="form__control__wrap">
                    <input type="text" class="form__control ep-color-picker" name="color" value="<?php echo esc_attr( $color); ?>"  data-default="<?php echo esc_attr(  $color ); ?>">

                    <p><?php esc_html_e( "Specify the color of the video controls.", "embedpress" ); ?></p>
                </div>
            </div>


			<?php do_action( 'embedpress_after_dailymotion_settings_fields'); ?>
			<button class="button button__themeColor radius-10 embedpress-submit-btn" name="submit" value="dailymotion"><?php esc_html_e( 'Save Changes', 'embedpress'); ?></button>
		</form>
	</div>
</div>
