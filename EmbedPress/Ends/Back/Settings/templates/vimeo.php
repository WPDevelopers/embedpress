<?php
/*
 * Vimeo Settings page */
$vm_settings = get_option( EMBEDPRESS_PLG_NAME.':vimeo' );
$pro_active = is_embedpress_pro_active();
$autoplay = !empty( $vm_settings['autoplay']) ? $vm_settings['autoplay'] : 0;
$loop = !empty( $vm_settings['loop']) ? $vm_settings['loop'] : 0;
$autopause = !empty( $vm_settings['autopause']) ? $vm_settings['autopause'] : 0;
$vimeo_dnt = !empty( $vm_settings['vimeo_dnt']) ? $vm_settings['vimeo_dnt'] : 0;
$color = !empty( $vm_settings['color']) ? $vm_settings['color'] : '#00adef';
$display_title = !empty( $vm_settings['display_title']) ? $vm_settings['display_title'] : 0;
$display_author = !empty( $vm_settings['display_author']) ? $vm_settings['display_author'] : 0;
$display_avatar = !empty( $vm_settings['display_avatar']) ? $vm_settings['display_avatar'] : 0;
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
                            <input type="radio" name="autoplay" value="0" <?php checked( '0', $autoplay); ?>>
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
                <p class="form__label"><?php esc_html_e( "Loop", "embedpress" ); echo $pro_active ? '': ' <span class="isPro">PRO</span>'; ?></p>
                <div class="form__control__wrap">
                    <div class="input__flex">
                        <label class="input__radio">
                            <input type="radio" name="loop" value="0" <?php echo !$pro_active ? 'disabled ' : ''; checked( '0', $loop); ?>>
                            <span><?php esc_html_e( "No", "embedpress" ); ?></span>
                        </label>
                        <label class="input__radio">
                            <input type="radio" name="loop" value="1" <?php echo !$pro_active ? 'disabled ' : ''; checked( '1', $loop); ?>>
                            <span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
                        </label>
                    </div>
                    <p><?php esc_html_e( "Play the video again automatically when it reaches the end.", "embedpress" ); ?></p>
                </div>
            </div>
            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "Auto pause", "embedpress" );  echo $pro_active ? '': ' <span class="isPro">PRO</span>';  ?></p>
                <div class="form__control__wrap">
                    <div class="input__flex">
                        <label class="input__radio">
                            <input type="radio" name="autopause" value="0"  <?php echo !$pro_active ? 'disabled ' : ''; checked( '0', $autopause); ?>>
                            <span><?php esc_html_e( "No", "embedpress" ); ?></span>
                        </label>
                        <label class="input__radio">
                            <input type="radio" name="autopause" value="1"  <?php echo !$pro_active ? 'disabled ' : ''; checked( '1', $autopause); ?>>
                            <span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
                        </label>
                    </div>
                    <p><?php esc_html_e( "Pause this video automatically when another one plays.", "embedpress" ); ?></p>
                </div>
            </div>
            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "DNT", "embedpress" );  echo $pro_active ? '': ' <span class="isPro">PRO</span>';  ?></p>
                <div class="form__control__wrap">
                    <div class="input__flex">
                        <label class="input__radio">
                            <input type="radio" name="vimeo_dnt" value="0"  <?php echo !$pro_active ? 'disabled ' : ''; checked( '0', $vimeo_dnt); ?>>
                            <span><?php esc_html_e( "No", "embedpress" ); ?></span>
                        </label>
                        <label class="input__radio">
                            <input type="radio" name="vimeo_dnt" value="1"  <?php echo !$pro_active ? 'disabled ' : ''; checked( '1', $vimeo_dnt); ?>>
                            <span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
                        </label>
                    </div>
                    <p><?php esc_html_e( 'Setting this parameter to "yes" will block the player from tracking any session data, including all cookies', "embedpress" ); ?></p>
                </div>
            </div>
            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "Color", "embedpress" ); ?></p>
                <div class="form__control__wrap">
                    <input type="text" class="form__control" name="color" value="<?php echo esc_attr( $color); ?>">
                    <button id="ep_choose_color" class="button radius-10"><?php esc_html_e( "Select Color", "embedpress" ); ?></button>
                    <p><?php esc_html_e( "Specify the color of the video controls. eg. #00adef", "embedpress" ); ?></p>
                </div>
            </div>
            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "Display Title", "embedpress" ); ?></p>
                <div class="form__control__wrap">
                    <div class="input__flex">
                        <label class="input__radio">
                            <input type="radio" name="display_title" value="0"  <?php checked( '0', $display_title); ?>>
                            <span><?php esc_html_e( "No", "embedpress" ); ?></span>
                        </label>
                        <label class="input__radio">
                            <input type="radio" name="display_title" value="1"  <?php checked( '1', $display_title); ?>>
                            <span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
                        </label>
                    </div>
                    <p><?php esc_html_e( "Indicates whether the title is displayed.", "embedpress" ); ?></p>
                </div>
            </div>
            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "Display Author", "embedpress" );  echo $pro_active ? '': ' <span class="isPro">PRO</span>'; ?></p>
                <div class="form__control__wrap">
                    <div class="input__flex">
                        <label class="input__radio">
                            <input type="radio" name="display_author" value="0"  <?php echo !$pro_active ? 'disabled ' : ''; checked( '0', $display_author); ?>>
                            <span><?php esc_html_e( "No", "embedpress" ); ?></span>
                        </label>
                        <label class="input__radio">
                            <input type="radio" name="display_author" value="1"  <?php echo !$pro_active ? 'disabled ' : ''; checked( '1', $display_author); ?>>
                            <span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
                        </label>
                    </div>
                    <p><?php esc_html_e( "Indicates whether the author is displayed.", "embedpress" ); ?></p>
                </div>
            </div>
            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "Display Avatar", "embedpress" );  echo $pro_active ? '': ' <span class="isPro">PRO</span>';  ?></p>
                <div class="form__control__wrap">
                    <div class="input__flex">
                        <label class="input__radio">
                            <input type="radio" name="display_avatar" value="0"  <?php echo !$pro_active ? 'disabled ' : ''; checked( '0', $display_avatar); ?>>
                            <span><?php esc_html_e( "No", "embedpress" ); ?></span>
                        </label>
                        <label class="input__radio">
                            <input type="radio" name="display_avatar" value="1"  <?php echo !$pro_active ? 'disabled ' : ''; checked( '1', $display_avatar); ?>>
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
