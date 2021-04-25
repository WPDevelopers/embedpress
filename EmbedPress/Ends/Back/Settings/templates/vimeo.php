<?php
/*
 * Vimeo Settings page */
?>
<div class="embedpress__settings background__white radius-25 p40">
    <h3><?php esc_html_e( "Vimeo Settings", "embedpress" ); ?></h3>
    <div class="embedpress__settings__form">
        <form action="" method="post" >
	        <?php
	        do_action( 'embedpress_before_vimeo_settings_fields');
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
                    <p><?php esc_html_e( "Automatically start to play the videos when the player loads.", "embedpress" ); ?></p>
                </div>
            </div>
            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "Loop", "embedpress" ); ?></p>
                <div class="form__control__wrap">
                    <div class="input__flex">
                        <label class="input__radio">
                            <input type="radio" name="loop" value="0" checked>
                            <span><?php esc_html_e( "No", "embedpress" ); ?></span>
                        </label>
                        <label class="input__radio">
                            <input type="radio" name="loop" value="1">
                            <span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
                        </label>
                    </div>
                    <p><?php esc_html_e( "Play the video again automatically when it reaches the end.", "embedpress" ); ?></p>
                </div>
            </div>
            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "Auto pause", "embedpress" ); ?> <span class="isPro">Pro</span></p>
                <div class="form__control__wrap">
                    <div class="input__flex">
                        <label class="input__radio">
                            <input type="radio" name="autopause" value="0" disabled>
                            <span><?php esc_html_e( "No", "embedpress" ); ?></span>
                        </label>
                        <label class="input__radio">
                            <input type="radio" name="autopause" value="1" disabled>
                            <span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
                        </label>
                    </div>
                    <p><?php esc_html_e( "Pause this video automatically when another one plays.", "embedpress" ); ?></p>
                </div>
            </div>
            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "DNT", "embedpress" ); ?></p>
                <div class="form__control__wrap">
                    <div class="input__flex">
                        <label class="input__radio">
                            <input type="radio" name="vimeo_dnt" value="0">
                            <span><?php esc_html_e( "No", "embedpress" ); ?></span>
                        </label>
                        <label class="input__radio">
                            <input type="radio" name="vimeo_dnt" value="1" checked>
                            <span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
                        </label>
                    </div>
                    <p><?php esc_html_e( 'Setting this parameter to "yes" will block the player from tracking any session data, including all cookies', "embedpress" ); ?></p>
                </div>
            </div>
            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "Color", "embedpress" ); ?></p>
                <div class="form__control__wrap">
                    <input type="text" class="form__control" name="color" value="#00adef">
                    <button id="ep_choose_color" class="button radius-10"><?php esc_html_e( "Select Color", "embedpress" ); ?></button>
                    <p><?php esc_html_e( "Specify the color of the video controls.", "embedpress" ); ?></p>
                </div>
            </div>
            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "Display Title", "embedpress" ); ?></p>
                <div class="form__control__wrap">
                    <div class="input__flex">
                        <label class="input__radio">
                            <input type="radio" name="display_title" value="0">
                            <span><?php esc_html_e( "No", "embedpress" ); ?></span>
                        </label>
                        <label class="input__radio">
                            <input type="radio" name="display_title" value="1" checked>
                            <span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
                        </label>
                    </div>
                    <p><?php esc_html_e( "Indicates whether the title is displayed.", "embedpress" ); ?></p>
                </div>
            </div>
            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "Display Author", "embedpress" ); ?></p>
                <div class="form__control__wrap">
                    <div class="input__flex">
                        <label class="input__radio">
                            <input type="radio" name="display_author" value="0">
                            <span><?php esc_html_e( "No", "embedpress" ); ?></span>
                        </label>
                        <label class="input__radio">
                            <input type="radio" name="display_author" value="1" checked>
                            <span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
                        </label>
                    </div>
                    <p><?php esc_html_e( "Indicates whether the author is displayed.", "embedpress" ); ?></p>
                </div>
            </div>
            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "Display Avatar", "embedpress" ); ?> <span class="isPro">Pro</span></p>
                <div class="form__control__wrap">
                    <div class="input__flex">
                        <label class="input__radio">
                            <input type="radio" name="display_avatar" value="0" disabled>
                            <span><?php esc_html_e( "No", "embedpress" ); ?></span>
                        </label>
                        <label class="input__radio">
                            <input type="radio" name="display_avatar" value="1" disabled>
                            <span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
                        </label>
                    </div>
                    <p><?php esc_html_e( "Indicates whether the avatar is displayed.", "embedpress" ); ?></p>
                </div>
            </div>
	        <?php do_action( 'embedpress_after_vimeo_settings_fields'); ?>
            <button class="button button__themeColor radius-10" name="submit" value="vimeo"><?php esc_html_e( 'Save Changes', 'embedpress'); ?></button>
        </form>
    </div>
</div>
