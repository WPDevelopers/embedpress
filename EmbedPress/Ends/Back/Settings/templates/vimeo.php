<?php
/*
 * Vimeo Settings page
 *  All undefined vars comes from 'render_settings_page' method
 *  */
$vm_settings = get_option( EMBEDPRESS_PLG_NAME.':vimeo' );
$start_time = isset( $vm_settings['start_time']) ? $vm_settings['start_time'] : 0;


$autoplay = isset( $vm_settings['autoplay']) ? $vm_settings['autoplay'] : '';
$loop = isset( $vm_settings['loop']) ? $vm_settings['loop'] : '';
$autopause = isset( $vm_settings['autopause']) ? $vm_settings['autopause'] : '';
$vimeo_dnt = isset( $vm_settings['vimeo_dnt']) ? $vm_settings['vimeo_dnt'] : 1;
$color = isset( $vm_settings['color']) ? $vm_settings['color'] : '#5b4e96';//@TODO; ask to confirm #00adef.
$display_title = isset( $vm_settings['display_title']) ? $vm_settings['display_title'] : 1;
$display_author = isset( $vm_settings['display_author']) ? $vm_settings['display_author'] : 1;
$display_avatar = isset( $vm_settings['display_avatar']) ? $vm_settings['display_avatar'] : 1;
?>
<div class="embedpress__settings background__white radius-25 p40">
    <h3><?php esc_html_e( "Vimeo Settings", "embedpress" ); ?></h3>
    <div class="embedpress__settings__form">
        <form action="" method="post" class="embedpress-settings-form" >
	        <?php
	        do_action( 'embedpress_before_vimeo_settings_fields');
            echo  $nonce_field ; ?>
            <div class="form__group">
                <p class="form__label" ><?php esc_html_e( "Start Time (In Seconds)", "embedpress" ); ?> </p>
                <div class="form__control__wrap">
                    <input type="number"  name="start_time" id="start_time" class="form__control" data-default="<?php echo esc_attr( $start_time); ?>" value="<?php echo esc_attr( $start_time); ?>" >
                    <p><?php esc_html_e( "You can put a custom time in seconds to start video. Example: 500", "embedpress" ); ?></p>
                </div>

            </div>
            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "Auto Play", "embedpress" ); ?></p>
                <div class="form__control__wrap">
                    <div data-default="<?php echo esc_attr(  $autoplay ); ?>" data-value="<?php echo esc_attr(  $autoplay ); ?>" class="input__flex input__radio_wrap">
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
                <p class="form__label"><?php esc_html_e( "Loop", "embedpress" ); echo $pro_active ? '': ' <span class="isPro">PRO</span>'; ?></p>
                <div class="form__control__wrap">
                    <div data-default="<?php echo esc_attr(  $loop ); ?>" data-value="<?php echo esc_attr(  $loop ); ?>" class="input__flex input__radio_wrap <?php echo $pro_active ? '': 'isPro'; ?>">
                        <label class="input__radio">
                            <input type="radio" name="loop" value="" <?php echo !$pro_active ? 'disabled ' : ''; checked( '', $loop); ?>>
                            <span><?php esc_html_e( "No", "embedpress" ); ?></span>
                        </label>
                        <label class="input__radio">
                            <input type="radio" name="loop" value="1" <?php echo !$pro_active ? 'disabled ' : ''; checked( '1', $loop); ?>>
                            <span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
                        </label>
                    </div>
	                <?php if ( !$pro_active ) {  include EMBEDPRESS_SETTINGS_PATH . 'templates/partials/alert-pro.php'; } ?>
                    <p><?php esc_html_e( "Play the video again automatically when it reaches the end.", "embedpress" ); ?></p>
                </div>
            </div>
            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "Auto Pause", "embedpress" );  echo $pro_active ? '': ' <span class="isPro">PRO</span>';  ?></p>
                <div class="form__control__wrap">
                    <div data-default="<?php echo esc_attr(  $autopause ); ?>" data-value="<?php echo esc_attr(  $autopause ); ?>" class="input__flex input__radio_wrap  <?php echo $pro_active ? '': 'isPro'; ?>">
                        <label class="input__radio">
                            <input type="radio" name="autopause" value=""  <?php echo !$pro_active ? 'disabled ' : ''; checked( '', $autopause); ?>>
                            <span><?php esc_html_e( "No", "embedpress" ); ?></span>
                        </label>
                        <label class="input__radio">
                            <input type="radio" name="autopause" value="1"  <?php echo !$pro_active ? 'disabled ' : ''; checked( '1', $autopause); ?>>
                            <span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
                        </label>
                    </div>
	                <?php if ( !$pro_active ) {  include EMBEDPRESS_SETTINGS_PATH . 'templates/partials/alert-pro.php'; } ?>
                    <p><?php esc_html_e( "Pause this video automatically when another one plays.", "embedpress" ); ?></p>
                </div>
            </div>
            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "DNT", "embedpress" );  echo $pro_active ? '': ' <span class="isPro">PRO</span>';  ?></p>
                <div class="form__control__wrap">
                    <div data-default="<?php echo esc_attr(  $vimeo_dnt ); ?>" data-value="<?php echo esc_attr(  $vimeo_dnt ); ?>" class="input__flex input__radio_wrap <?php echo $pro_active ? '': 'isPro'; ?>">
                        <label class="input__radio">
                            <input type="radio" name="vimeo_dnt" value=""  <?php echo !$pro_active ? 'disabled ' : ''; checked( '', $vimeo_dnt); ?>>
                            <span><?php esc_html_e( "No", "embedpress" ); ?></span>
                        </label>
                        <label class="input__radio">
                            <input type="radio" name="vimeo_dnt" value="1"  <?php echo !$pro_active ? 'disabled ' : ''; checked( '1', $vimeo_dnt); ?>>
                            <span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
                        </label>
                    </div>
	                <?php if ( !$pro_active ) {  include EMBEDPRESS_SETTINGS_PATH . 'templates/partials/alert-pro.php'; } ?>
                    <p><?php esc_html_e( 'Setting this parameter to "yes" will block the player from tracking any session data, including all cookies.', "embedpress" ); ?></p>
                </div>
            </div>
            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "Color", "embedpress" ); ?></p>
                <div class="form__control__wrap">
                    <input type="text" class="form__control ep-color-picker" name="color" value="<?php echo esc_attr( $color); ?>"  data-default="<?php echo esc_attr(  $color ); ?>">

                    <p><?php esc_html_e( "Specify the color of the video controls.", "embedpress" ); ?></p>
                </div>
            </div>
            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "Display Title", "embedpress" ); ?></p>
                <div class="form__control__wrap">
                    <div data-default="<?php echo esc_attr(  $display_title ); ?>" data-value="<?php echo esc_attr(  $display_title ); ?>" class="input__flex input__radio_wrap">
                        <label class="input__radio">
                            <input type="radio" name="display_title" value=""  <?php checked( '', $display_title); ?>>
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
                <p class="form__label"><?php esc_html_e( "Display Author", "embedpress" ); ?></p>
                <div class="form__control__wrap">
                    <div data-default="<?php echo esc_attr(  $display_author ); ?>" data-value="<?php echo esc_attr(  $display_author ); ?>" class="input__flex input__radio_wrap">
                        <label class="input__radio">
                            <input type="radio" name="display_author" value=""  <?php checked( '', $display_author); ?>>
                            <span><?php esc_html_e( "No", "embedpress" ); ?></span>
                        </label>
                        <label class="input__radio">
                            <input type="radio" name="display_author" value="1"  <?php checked( '1', $display_author); ?>>
                            <span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
                        </label>
                    </div>
                    <p><?php esc_html_e( "Indicates whether the author is displayed.", "embedpress" ); ?></p>
                </div>
            </div>
            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "Display Avatar", "embedpress" );?></p>
                <div class="form__control__wrap">
                    <div data-default="<?php echo esc_attr(  $display_avatar ); ?>" data-value="<?php echo esc_attr(  $display_avatar ); ?>" class="input__flex input__radio_wrap">
                        <label class="input__radio">
                            <input type="radio" name="display_avatar" value=""  <?php  checked( '', $display_avatar); ?>>
                            <span><?php esc_html_e( "No", "embedpress" ); ?></span>
                        </label>
                        <label class="input__radio">
                            <input type="radio" name="display_avatar" value="1"  <?php  checked( '1', $display_avatar); ?>>
                            <span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
                        </label>
                    </div>
                    <p><?php esc_html_e( "Indicates whether the avatar is displayed.", "embedpress" ); ?></p>
                </div>
            </div>
	        <?php do_action( 'embedpress_after_vimeo_settings_fields'); ?>
            <button class="button button__themeColor radius-10 embedpress-submit-btn" name="submit" value="vimeo"><?php esc_html_e( 'Save Changes', 'embedpress'); ?></button>
        </form>
    </div>
</div>
