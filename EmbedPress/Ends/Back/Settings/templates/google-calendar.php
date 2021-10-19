<?php
/*
 * Google Calender Settings page
 * All undefined vars comes from 'render_settings_page' method
 *  */
$gcalendar_settings = get_option( EMBEDPRESS_PLG_NAME.':gcalendar');
$auth_string = isset( $gcalendar_settings['auth_string']) ? $gcalendar_settings['auth_string'] : '';
$cache_time = isset( $gcalendar_settings['cache_time']) ? $gcalendar_settings['cache_time'] : 0;

$autoplay = isset( $gcalendar_settings['embedpress_pro_gcalendar_autoplay']) ? $gcalendar_settings['embedpress_pro_gcalendar_autoplay'] : 'no';
$show_chat = isset( $gcalendar_settings['embedpress_pro_gcalendar_chat']) ? $gcalendar_settings['embedpress_pro_gcalendar_chat'] : 'no';
$theme = isset( $gcalendar_settings['embedpress_pro_gcalendar_theme']) ? $gcalendar_settings['embedpress_pro_gcalendar_theme'] : 'dark';
$fs = isset( $gcalendar_settings['embedpress_pro_fs']) ? $gcalendar_settings['embedpress_pro_fs'] : 'yes';
$mute = isset( $gcalendar_settings['embedpress_pro_gcalendar_mute']) ? $gcalendar_settings['embedpress_pro_gcalendar_mute'] : 'yes';

?>

<div class="embedpress__settings background__white radius-25 p40">
	<h3><?php esc_html_e( "Google Calender Settings", "embedpress" ); ?></h3>
	<div class="embedpress__settings__form">
		<form action="" method="post" class="embedpress-settings-form">
			<?php
			do_action( 'embedpress_before_gcalendar_settings_fields');
			echo  $nonce_field ; ?>
			<div class="form__group">
				<label for="auth_string" class="form__label" ><?php esc_html_e( "Google Auth JSON", "embedpress" ); ?> </label>
				<div class="form__control__wrap">
                   <textarea name="auth_string" id="auth_string" class="form__control" data-default="<?php echo esc_attr( $auth_string); ?>" value="<?php echo esc_attr( $auth_string); ?>" rows="5"  ></textarea>
                    <p ><?php printf(__('Enter the JSON string downloaded from the Google Console. Note: Create a new project in Google developer console and make sure you set <code>%s</code> as the authorized redirect URI.', 'embedpress'), $ep_page . '&page_type=google-calender'); ?></p>

                </div>

			</div>

            <div class="form__group">
                <label for="cache_time" class="form__label" ><?php esc_html_e( "Caching time (in Minutes)", "embedpress" ); ?> </label>
                <div class="form__control__wrap">
                    <input name="cache_time" type="number" id="cache_time" class="form__control" data-default="<?php echo esc_attr( $cache_time); ?>" value="<?php echo esc_attr( $cache_time); ?>" >
                    <p><?php esc_html_e( 'How long do you want to cache the data? Set it 0 to disable caching', 'embedpress'); ?></p>

                </div>

            </div>

			<?php do_action( 'embedpress_after_gcalendar_settings_fields'); ?>
			<button class="button button__themeColor radius-10 embedpress-submit-btn" name="submit" value="gcalendar"><?php esc_html_e( 'Save Changes', 'embedpress'); ?></button>
		</form>
	</div>
</div>
