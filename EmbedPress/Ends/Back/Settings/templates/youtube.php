<?php
/*
 * YouTube Settings page */
?>

<div class="embedpress__settings background__white radius-25 p40">
    <h3><?php esc_html_e( "Youtube Settings", "embedpress" ); ?></h3>
    <div class="embedpress__settings__form">
        <form action="" method="post" >
	        <?php
	        do_action( 'embedpress_before_youtube_settings_fields');
            echo  $nonce_field ; ?>
            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "Auto Play", "embedpress" ); ?></p>
                <div class="form__control__wrap">
                    <div class="input__flex">
                        <label class="input__radio">
                            <input type="radio" name="autoplay" value="0" checked>
                            <span><?php esc_html_e( "No", "embedpress" ); ?></span>
                        </label>
                        <label class="input__radio">
                            <input type="radio" name="autoplay" value="1">
                            <span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
                        </label>
                    </div>
                </div>
            </div>
            <div class="form__group">
                <label class="form__label" for="color"><?php esc_html_e( "Progress bar color", "embedpress" ); ?></label>
                <div class="form__control__wrap">
                    <div class="embedpress__select">
                        <span><i class="ep-icon ep-caret-down"></i></span>
                        <select name="color" id="color">
                            <option value="red" selected><?php esc_html_e( "Red", "embedpress" ); ?></option>
                            <option value="white"><?php esc_html_e( "White", "embedpress" ); ?></option>
                        </select>
                    </div>
                    <p><?php printf( esc_html__( "Specifies the color that will be used in the player's video progress bar to highlight the amount of the video that the viewer has already seen. %s Note: Setting the color to white will disable the Modest Branding option (causing a YouTube logo to be displayed in the control bar).", 'embedpress'), '<br>'); ?></p>
                </div>
            </div>
            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "Force Closed Captions", "embedpress" ); ?></p>
                <div class="form__control__wrap">
                    <div class="input__flex">
                        <label class="input__radio">
                            <input type="radio" name="cc_load_policy" value="0" checked>
                            <span><?php esc_html_e( "No", "embedpress" ); ?></span>
                        </label>
                        <label class="input__radio">
                            <input type="radio" name="cc_load_policy" value="1">
                            <span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
                        </label>
                    </div>
                    <p>Setting this option to Yes causes closed captions to be shown by default, even if the user has turned captions off. This will be based on user preference otherwise.</p>
                </div>
            </div>
            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "Display Controls", "embedpress" ); ?> <span class="isPro">Pro</span></p>
                <div class="form__control__wrap">
                    <div class="embedpress__select">
                        <span><i class="ep-icon ep-caret-down"></i></span>
                        <select name="controls" disabled>
                            <option value="1"><?php esc_html_e( 'Display immediately', 'embedpress'); ?></option>
                            <option value="2"><?php esc_html_e( 'Display after user initiation', 'embedpress'); ?></option>
                            <option value="0"><?php esc_html_e( 'Hide controls', 'embedpress'); ?></option>
                        </select>
                    </div>
                    <p><?php esc_html_e( 'Indicates whether the video player controls are displayed.', 'embedpress'); ?> </p>
                </div>
            </div>
            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "Enable Fullscreen button", "embedpress" ); ?></p>
                <div class="form__control__wrap">
                    <div class="input__flex">
                        <label class="input__radio">
                            <input type="radio" name="fs" value="0">
                            <span><?php esc_html_e( "No", "embedpress" ); ?></span>
                        </label>
                        <label class="input__radio">
                            <input type="radio" name="fs" value="1" checked>
                            <span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
                        </label>
                    </div>
                    <p><?php esc_html_e( "Indicates whether the fullscreen button is enabled.", "embedpress" ); ?></p>
                </div>
            </div>
            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "Display video annotations", "embedpress" ); ?> <span class="isPro">Pro</span></p>
                <div class="form__control__wrap">
                    <div class="embedpress__select">
                        <span><i class="ep-icon ep-caret-down"></i></span>
                        <select name="iv_load_policy" disabled>
                            <option value="1 selected"><?php esc_html_e( "Show", "embedpress" ); ?></option>
                            <option value="3"><?php esc_html_e( "Hide", "embedpress" ); ?></option>
                        </select>
                    </div>
                    <p><?php esc_html_e( "Indicates whether video annotations are displayed.", "embedpress" ); ?></p>
                </div>
            </div>
            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "Display related videos", "embedpress" ); ?></p>
                <div class="form__control__wrap">
                    <div class="input__flex">
                        <label class="input__radio">
                            <input type="radio" name="rel" value="0">
                            <span><?php esc_html_e( "No", "embedpress" ); ?></span>
                        </label>
                        <label class="input__radio">
                            <input type="radio" name="rel" value="1" checked>
                            <span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
                        </label>
                    </div>
                    <p><?php esc_html_e( "Indicates whether the player should show related videos when playback of the initial video ends.", "embedpress" ); ?></p>
                </div>
            </div>
            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "Modest Branding", "embedpress" ); ?></p>
                <div class="form__control__wrap">
                    <div class="embedpress__select">
                        <span><i class="ep-icon ep-caret-down"></i></span>
                        <select name="modestbranding">
                            <option value="1"><?php esc_html_e( "Show", "embedpress" ); ?></option>
                            <option value="0" selected><?php esc_html_e( "Hide", "embedpress" ); ?></option>
                        </select>
                    </div>
                    <p><?php esc_html_e( "Indicates whether the player should display a YouTube logo in the control bar.", "embedpress" ); ?></p>
                </div>
            </div>
	        <?php do_action( 'embedpress_after_youtube_settings_fields'); ?>
            <button class="button button__themeColor radius-10" name="submit" value="youtube"><?php esc_html_e( 'Save Changes', 'embedpress'); ?></button>
        </form>
    </div>
</div>
