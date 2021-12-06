<?php
/*
 * YouTube Settings page
 *  All undefined vars comes from 'render_settings_page' method
 *  */
$yt_settings = get_option( EMBEDPRESS_PLG_NAME.':youtube');
$start_time = isset( $yt_settings['start_time']) ? $yt_settings['start_time'] : 0;
$end_time = isset( $yt_settings['end_time']) ? $yt_settings['end_time'] : 0;
$autoplay = isset( $yt_settings['autoplay']) ? $yt_settings['autoplay'] : '';
$controls = isset( $yt_settings['controls']) ? $yt_settings['controls'] : 1;
$fs = isset( $yt_settings['fs']) ? $yt_settings['fs'] : 1;
$iv_load_policy = isset( $yt_settings['iv_load_policy']) ? $yt_settings['iv_load_policy'] : 1;
$color = isset( $yt_settings['color']) ? $yt_settings['color'] : 'red';
$rel = isset( $yt_settings['rel']) ? $yt_settings['rel'] : 1;
// pro

$cc_load_policy = isset( $yt_settings['cc_load_policy']) ? $yt_settings['cc_load_policy'] : '';
$modestbranding = isset( $yt_settings['modestbranding']) ? $yt_settings['modestbranding'] : 0;
$yt_lc_show = isset( $yt_settings['yt_lc_show']) ? $yt_settings['yt_lc_show'] : '';
// Subscription - Pro
$yt_sub_channel = isset( $yt_settings['yt_sub_channel']) ? $yt_settings['yt_sub_channel'] : '';
$yt_sub_text = isset( $yt_settings['yt_sub_text']) ? $yt_settings['yt_sub_text'] : '';
$yt_sub_layout = isset( $yt_settings['yt_sub_layout']) ? $yt_settings['yt_sub_layout'] : '';
$yt_sub_theme = isset( $yt_settings['yt_sub_theme']) ? $yt_settings['yt_sub_theme'] : '';
$yt_sub_count = isset( $yt_settings['yt_sub_count']) ? $yt_settings['yt_sub_count'] : '';

?>

<div class="embedpress__settings background__white radius-25 p40">
    <h3><?php esc_html_e( "YouTube Settings", "embedpress" ); ?></h3>
    <div class="embedpress__settings__form">
        <form action="" method="post" class="embedpress-settings-form" >
	        <?php
	        do_action( 'embedpress_before_youtube_settings_fields');
            echo  $nonce_field ; ?>
            <div class="form__group">
                <p class="form__label" ><?php esc_html_e( "Start Time (In Seconds)", "embedpress" ); ?> </p>
                <div class="form__control__wrap">
                    <input type="number"  name="start_time" id="start_time" class="form__control" data-default="<?php echo esc_attr( $start_time); ?>" value="<?php echo esc_attr( $start_time); ?>" >
                    <p><?php esc_html_e( "You can put a custom time in seconds to start the video. Example: 500", "embedpress" ); ?></p>
                </div>

            </div>
            <div class="form__group">
                <p class="form__label" ><?php esc_html_e( "End Time (In Seconds)", "embedpress" ); ?> </p>
                <div class="form__control__wrap">
                    <input type="number"  name="end_time" id="end_time" class="form__control" data-default="<?php echo esc_attr( $end_time); ?>" value="<?php echo esc_attr( $end_time); ?>" >
                    <p><?php esc_html_e( "You can put a custom time in seconds to end the video.", "embedpress" ); ?></p>
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
                <label class="form__label" for="color"><?php esc_html_e( "Progress Bar Color", "embedpress" ); ?></label>
                <div class="form__control__wrap">
                    <div class="embedpress__select ">
                        <span><i class="ep-icon ep-caret-down"></i></span>
                        <select name="color" id="color" data-default="<?php echo esc_attr( $color ); ?>">
                            <option value="red" <?php selected( 'red', $color); ?> ><?php esc_html_e( "Red", "embedpress" ); ?></option>
                            <option value="white" <?php selected( 'white', $color); ?> ><?php esc_html_e( "White", "embedpress" ); ?></option>
                        </select>
                    </div>
                    <p><?php printf( esc_html__( "Specifies the color that will be used in the player's video progress bar to highlight the amount of the video that the viewer has already seen. %s Note: Setting the color to white will disable the Modest Branding option (causing a YouTube logo to be displayed in the control bar).", 'embedpress'), '<br>'); ?></p>
                </div>
            </div>
            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "Force Closed Captions", "embedpress" ); echo !$pro_active ? ' <span class="isPro">PRO</span>': ''; ?></p>
                <div class="form__control__wrap">
                    <div class="input__flex input__radio_wrap <?php echo $pro_active ? '': 'isPro'; ?>" data-default="<?php echo esc_attr(  $cc_load_policy ); ?>" data-value="<?php echo esc_attr(  $cc_load_policy ); ?>">
                        <label class="input__radio">
                            <input type="radio" name="cc_load_policy" value=""  <?php echo !$pro_active ? 'disabled ' : ''; checked( '', $cc_load_policy); ?>>
                            <span><?php esc_html_e( "No", "embedpress" ); ?></span>
                        </label>
                        <label class="input__radio">
                            <input type="radio" name="cc_load_policy" value="1"  <?php echo !$pro_active ? 'disabled ' : ''; checked( '1', $cc_load_policy);?>>
                            <span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
                        </label>
                    </div>
	                <?php if ( !$pro_active ) {  include EMBEDPRESS_SETTINGS_PATH . 'templates/partials/alert-pro.php'; } ?>

                    <p><?php printf( esc_html__( "Setting this option to %s causes closed captions to be shown by default, even if the user has turned captions off. This will be based on user preference otherwise.", "embedpress" ), '<strong>Yes</strong>'); ?></p>
                </div>
            </div>
            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "Display Controls", "embedpress" ); ?></p>
                <div class="form__control__wrap">
                    <div class="embedpress__select">
                        <span><i class="ep-icon ep-caret-down"></i></span>
                        <select name="controls" data-default="<?php echo esc_attr( $controls); ?>">
                            <option value="1" <?php selected( '1', $controls); ?>><?php esc_html_e( 'Display immediately', 'embedpress'); ?></option>
                            <option value="2" <?php selected( '2', $controls); ?>><?php esc_html_e( 'Display after user initiation', 'embedpress'); ?></option>
                            <option value="0" <?php selected( '0', $controls); ?>><?php esc_html_e( 'Hide controls', 'embedpress'); ?></option>
                        </select>
                    </div>
                    <p><?php esc_html_e( 'Indicates whether the video player controls are displayed.', 'embedpress'); ?> </p>
                </div>
            </div>
            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "Enable Fullscreen Button", "embedpress" ); ?></p>
                <div class="form__control__wrap">
                    <div class="input__flex input__radio_wrap"  data-default="<?php echo esc_attr(  $fs ); ?>" data-value="<?php echo esc_attr(  $fs ); ?>">
                        <label class="input__radio">
                            <input type="radio" name="fs" value="" <?php checked( '', $fs); ?> >
                            <span><?php esc_html_e( "No", "embedpress" ); ?></span>
                        </label>
                        <label class="input__radio">
                            <input type="radio" name="fs" value="1" <?php checked( '1', $fs); ?>>
                            <span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
                        </label>
                    </div>
                    <p><?php esc_html_e( "Indicates whether the fullscreen button is enabled.", "embedpress" ); ?></p>
                </div>
            </div>
            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "Display Video Annotations", "embedpress" ); ?></p>
                <div class="form__control__wrap">
                    <div class="embedpress__select">
                        <span><i class="ep-icon ep-caret-down"></i></span>
                        <select name="iv_load_policy" data-default="<?php echo esc_attr( $iv_load_policy ); ?>">
                            <option value="1" <?php selected( '1', $iv_load_policy); ?>><?php esc_html_e( "Show", "embedpress" ); ?></option>
                            <option value="3" <?php selected( '3', $iv_load_policy); ?>><?php esc_html_e( "Hide", "embedpress" ); ?></option>
                        </select>
                    </div>
                    <p><?php esc_html_e( "Indicates whether video annotations are displayed.", "embedpress" ); ?></p>
                </div>
            </div>
            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "Display Related Videos", "embedpress" ); ?></p>
                <div class="form__control__wrap">
                    <div class="embedpress__select">
                        <span><i class="ep-icon ep-caret-down"></i></span>
                        <select name="rel" data-default="<?php echo esc_attr( $rel); ?>">
                            <option value="" <?php selected( '', $rel); ?>><?php esc_html_e( "From the same channel of the video", "embedpress" ); ?></option>
                            <option value="1" <?php selected( '1', $rel); ?>><?php esc_html_e( "Based on User's watch history", "embedpress" ); ?></option>
                        </select>
                    </div>
                    <p><?php esc_html_e( "Indicates how the player should show related videos when playback of the video pauses or ends.", "embedpress" ); ?></p>
                </div>
            </div>


            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "Modest Branding", "embedpress" );  echo !$pro_active ? ' <span class="isPro">PRO</span>' : ''; ?></p>
                <div class="form__control__wrap">
                    <div class="embedpress__select <?php echo $pro_active ? '': 'isPro'; ?>">
                        <span><i class="ep-icon ep-caret-down"></i></span>
                        <select name="modestbranding" data-default="<?php echo esc_attr( $modestbranding); ?>" <?php echo !$pro_active ? 'disabled' : ''; ?>>
                            <option value="1" <?php selected( '1', $modestbranding); ?>><?php esc_html_e( "Hide", "embedpress" ); ?></option>
                            <option value="0"  <?php selected( '0', $modestbranding); ?>><?php esc_html_e( "Show", "embedpress" ); ?></option>
                        </select>
                    </div>
	                <?php if ( !$pro_active ) {  include EMBEDPRESS_SETTINGS_PATH . 'templates/partials/alert-pro.php'; } ?>

                    <p><?php esc_html_e( "Indicates whether the player should display a YouTube logo in the control bar.", "embedpress" ); ?></p>
                </div>
            </div>

            <!-- Live Chat-->
            <div class="form__group">
                <p class="form__label"><?php esc_html_e( " Live Chat", "embedpress" ); echo !$pro_active ? ' <span class="isPro">PRO</span>': ''; ?></p>
                <div class="form__control__wrap">
                    <div class="input__flex input__radio_wrap <?php echo $pro_active ? '': 'isPro'; ?>" data-default="<?php echo esc_attr(  $yt_lc_show ); ?>" data-value="<?php echo esc_attr(  $yt_lc_show ); ?>">
                        <label class="input__radio">
                            <input type="radio" name="yt_lc_show" value=""  <?php echo !$pro_active ? 'disabled ' : ''; checked( '', $yt_lc_show); ?>>
                            <span><?php esc_html_e( "No", "embedpress" ); ?></span>
                        </label>
                        <label class="input__radio">
                            <input type="radio" name="yt_lc_show" value="yes"  <?php echo !$pro_active ? 'disabled ' : ''; checked( 'yes', $yt_lc_show);?>>
                            <span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
                        </label>
                    </div>
			        <?php if ( !$pro_active ) {  include EMBEDPRESS_SETTINGS_PATH . 'templates/partials/alert-pro.php'; } ?>

                    <p><?php printf( esc_html__( "Enabling this option will show chat on all YouTube videos. However, YouTube Live Chat feature only works with Live Streaming videos.", "embedpress" ), '<strong>Yes</strong>'); ?></p>
                </div>
            </div>

            <!-- SUBSCRIPTION-->
            <h3><?php esc_html_e( "Subscription Button", "embedpress" ); ?></h3>

            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "Channel Link or ID", "embedpress" ); echo $pro_active ? '': ' <span class="isPro">PRO</span>'; ?> </p>
                <div class="form__control__wrap <?php echo $pro_active ? '': 'isPro'; ?>">
                    <input type="text"  class="form__control" data-default="<?php echo esc_attr( $yt_sub_channel ); ?>" value="<?php echo esc_attr( $yt_sub_channel ); ?>" name="yt_sub_channel" <?php echo $pro_active ? '' : 'disabled'; ?> placeholder="Enter Channel link or ID">

                    <p><?php esc_html_e( "You can use either your channel link or channel ID to show the subscription button.", "embedpress" ); ?></p>
                </div>
		        <?php if ( !$pro_active ) {  include EMBEDPRESS_SETTINGS_PATH . 'templates/partials/alert-pro.php'; } ?>

            </div>

            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "Subscription Text", "embedpress" ); echo $pro_active ? '': ' <span class="isPro">PRO</span>'; ?> </p>
                <div class="form__control__wrap <?php echo $pro_active ? '': 'isPro'; ?>">
                    <input type="text"  class="form__control" data-default="<?php echo esc_attr( $yt_sub_text ); ?>" value="<?php echo esc_attr( $yt_sub_text ); ?>" name="yt_sub_text" <?php echo $pro_active ? '' : 'disabled'; ?> placeholder="<?php esc_attr_e( 'Eg. Don\'t miss out! Subscribe', 'embedpress' ) ?>">

                    <p><?php esc_html_e( "Optionally you can output some CTA text before the subscriber button.", "embedpress" ); ?></p>
                </div>
		        <?php if ( !$pro_active ) {  include EMBEDPRESS_SETTINGS_PATH . 'templates/partials/alert-pro.php'; } ?>

            </div>

            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "Layout", "embedpress" );  echo !$pro_active ? ' <span class="isPro">PRO</span>' : ''; ?></p>
                <div class="form__control__wrap">
                    <div class="embedpress__select <?php echo $pro_active ? '': 'isPro'; ?>">
                        <span><i class="ep-icon ep-caret-down"></i></span>
                        <select name="yt_sub_layout" data-default="<?php echo esc_attr( $yt_sub_layout); ?>" <?php echo !$pro_active ? 'disabled' : ''; ?>>
                            <option value="" <?php selected( 'default', $yt_sub_layout); ?>><?php esc_html_e( "Default", "embedpress" ); ?></option>
                            <option value="full"  <?php selected( 'full', $yt_sub_layout); ?>><?php esc_html_e( "Full", "embedpress" ); ?></option>
                        </select>
                    </div>
			        <?php if ( !$pro_active ) {  include EMBEDPRESS_SETTINGS_PATH . 'templates/partials/alert-pro.php'; } ?>

                    <p><?php esc_html_e( "Full layout shows channel image. Default layout shows only channel name and subscription button.", "embedpress" ); ?></p>
                </div>
            </div>

            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "Theme", "embedpress" );  echo !$pro_active ? ' <span class="isPro">PRO</span>' : ''; ?></p>
                <div class="form__control__wrap">
                    <div class="embedpress__select <?php echo $pro_active ? '': 'isPro'; ?>">
                        <span><i class="ep-icon ep-caret-down"></i></span>
                        <select name="yt_sub_theme" data-default="<?php echo esc_attr( $yt_sub_theme); ?>" <?php echo !$pro_active ? 'disabled' : ''; ?>>
                            <option value="" <?php selected( 'default', $yt_sub_theme); ?>><?php esc_html_e( "Default", "embedpress" ); ?></option>
                            <option value="dark"  <?php selected( 'dark', $yt_sub_theme); ?>><?php esc_html_e( "Dark", "embedpress" ); ?></option>
                        </select>
                    </div>
			        <?php if ( !$pro_active ) {  include EMBEDPRESS_SETTINGS_PATH . 'templates/partials/alert-pro.php'; } ?>

                    <p><?php esc_html_e( "Default theme is good for white background. Dark theme is good for black background.", "embedpress" ); ?></p>
                </div>
            </div>

            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "Show Subscriber Count", "embedpress" ); echo !$pro_active ? ' <span class="isPro">PRO</span>': ''; ?></p>
                <div class="form__control__wrap">
                    <div class="input__flex input__radio_wrap <?php echo $pro_active ? '': 'isPro'; ?>" data-default="<?php echo esc_attr(  $yt_sub_count ); ?>" data-value="<?php echo esc_attr(  $yt_sub_count ); ?>">
                        <label class="input__radio">
                            <input type="radio" name="yt_sub_count" value=""  <?php echo !$pro_active ? 'disabled ' : ''; checked( '', $yt_sub_count); ?>>
                            <span><?php esc_html_e( "No", "embedpress" ); ?></span>
                        </label>
                        <label class="input__radio">
                            <input type="radio" name="yt_sub_count" value="1"  <?php echo !$pro_active ? 'disabled ' : ''; checked( '1', $yt_sub_count);?>>
                            <span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
                        </label>
                    </div>
			        <?php if ( !$pro_active ) {  include EMBEDPRESS_SETTINGS_PATH . 'templates/partials/alert-pro.php'; } ?>
                </div>
            </div>


	        <?php do_action( 'embedpress_after_youtube_settings_fields'); ?>
            <button class="button button__themeColor radius-10 embedpress-submit-btn" name="submit" value="youtube"><?php esc_html_e( 'Save Changes', 'embedpress'); ?></button>
        </form>
    </div>
</div>
