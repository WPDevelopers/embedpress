<?php
/*
 * YouTube Settings page
 *  All undefined vars comes from 'render_settings_page' method
 *  */
$yt_settings = get_option( EMBEDPRESS_PLG_NAME.':youtube');
$autoplay = isset( $yt_settings['autoplay']) ? $yt_settings['autoplay'] : '';
$controls = isset( $yt_settings['controls']) ? $yt_settings['controls'] : 1;
$fs = isset( $yt_settings['fs']) ? $yt_settings['fs'] : 1;
$iv_load_policy = isset( $yt_settings['iv_load_policy']) ? $yt_settings['iv_load_policy'] : 1;
// pro
$color = isset( $yt_settings['color']) ? $yt_settings['color'] : 'red';
$cc_load_policy = isset( $yt_settings['cc_load_policy']) ? $yt_settings['cc_load_policy'] : '';
$rel = isset( $yt_settings['rel']) ? $yt_settings['rel'] : 1;
$modestbranding = isset( $yt_settings['modestbranding']) ? $yt_settings['modestbranding'] : 0;

?>

<div class="embedpress__settings background__white radius-25 p40">
    <h3><?php esc_html_e( "YouTube Settings", "embedpress" ); ?></h3>
    <div class="embedpress__settings__form">
        <form action="" method="post" class="embedpress-settings-form" >
	        <?php
	        do_action( 'embedpress_before_youtube_settings_fields');
            echo  $nonce_field ; ?>
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
                <label class="form__label" for="color"><?php esc_html_e( "Progress Bar Color", "embedpress" ); echo !$pro_active ? ' <span class="isPro">PRO</span>' : ''; ?></label>
                <div class="form__control__wrap">
                    <div class="embedpress__select <?php echo $pro_active ? '': 'isPro'; ?>">
                        <span><i class="ep-icon ep-caret-down"></i></span>
                        <select name="color" id="color" <?php echo !$pro_active ? 'disabled' : ''; ?> data-default="<?php echo esc_attr( $color ); ?>">
                            <option value="red" <?php selected( 'red', $color); ?> ><?php esc_html_e( "Red", "embedpress" ); ?></option>
                            <option value="white" <?php selected( 'white', $color); ?> ><?php esc_html_e( "White", "embedpress" ); ?></option>
                        </select>
                    </div>
	                <?php if ( !$pro_active ) {  include EMBEDPRESS_SETTINGS_PATH . 'templates/partials/alert-pro.php'; } ?>

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
                <p class="form__label"><?php esc_html_e( "Display Related Videos", "embedpress" );  echo !$pro_active ? ' <span class="isPro">PRO</span>' : ''; ?></p>
                <div class="form__control__wrap">
                    <div class="embedpress__select  <?php echo $pro_active ? '': 'isPro'; ?>">
                        <span><i class="ep-icon ep-caret-down"></i></span>
                        <select name="rel" data-default="<?php echo esc_attr( $rel); ?>" <?php echo $pro_active ? '' : 'disabled'; ?>>
                            <option value="" <?php selected( '', $rel); ?>><?php esc_html_e( "From the same channel of the video", "embedpress" ); ?></option>
                            <option value="1" <?php selected( '1', $rel); ?>><?php esc_html_e( "Based on User's watch history", "embedpress" ); ?></option>
                        </select>
                    </div>

	                <?php if ( !$pro_active ) {  include EMBEDPRESS_SETTINGS_PATH . 'templates/partials/alert-pro.php'; } ?>

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
	        <?php do_action( 'embedpress_after_youtube_settings_fields'); ?>
            <button class="button button__themeColor radius-10 embedpress-submit-btn" name="submit" value="youtube"><?php esc_html_e( 'Save Changes', 'embedpress'); ?></button>
        </form>
    </div>
</div>
