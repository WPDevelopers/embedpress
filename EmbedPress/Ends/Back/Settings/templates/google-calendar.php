<?php
/*
 * Google Calender Settings page
 * All undefined vars comes from 'render_settings_page' method
 *  */
$gcalendar_settings = get_option( EMBEDPRESS_PLG_NAME.':gcalendar');
$auth_string = isset( $gcalendar_settings['auth_string']) ? $gcalendar_settings['auth_string'] : '';
$caching_time = isset( $gcalendar_settings['caching_time']) ? $gcalendar_settings['caching_time'] : 0;

?>

<div class="embedpress__settings background__white radius-25 p40">
	<h3><?php esc_html_e( "Google Calender Settings", "embedpress" ); ?></h3>
	<div class="embedpress__settings__form">
		<form action="" method="post" class="embedpress-settings-form">
			<?php
			do_action( 'embedpress_before_gcalendar_settings_fields');
			echo  $nonce_field ; ?>
			<div class="form__group">
				<p class="form__label" ><?php esc_html_e( "Google Auth JSON", "embedpress" ); ?> </p>
				<div class="form__control__wrap">
					<textarea  name="auth_string" id="auth_string" class="form__control" data-default="<?php echo esc_attr( $auth_string); ?>" value="<?php echo esc_attr( $auth_string); ?>" rows="10"  ></textarea>
					<p><?php esc_html_e( "Enter the JSON string downloaded from the Google Console", "embedpress" ); ?></p>
				</div>

			</div>

            <div class="form__group">
                <p class="form__label" ><?php esc_html_e( "Caching time (in Minute)", "embedpress" ); ?> </p>
                <div class="form__control__wrap">
                    <input  name="caching_time" type="number" id="caching_time" class="form__control" data-default="<?php echo esc_attr( $caching_time); ?>" value="<?php echo esc_attr( $caching_time); ?>" >
                    <p><?php esc_html_e( "How long do you want to cache the data? 0 or empty means caching is disabled.", "embedpress" ); ?></p>
                </div>

            </div>
            <div class="form__group">
                <p class="form__label" for="calender"><?php esc_html_e( "Select calenders ", "embedpress" ); ?> </p>
                <div class="form__control__wrap">
                    <label for="calender">                    <input  name="calender" type="checkbox" id="calender"  data-default="<?php echo esc_attr( $caching_time); ?>" value="<?php echo esc_attr( $caching_time); ?>" >
	                    <?php esc_html_e( "Select calender to show", "embedpress" ); ?>
                    </label>
                </div>

            </div>

			<?php do_action( 'embedpress_after_gcalendar_settings_fields'); ?>
			<button class="button button__themeColor radius-10 embedpress-submit-btn" name="submit" value="gcalendar"><?php esc_html_e( 'Save Changes', 'embedpress'); ?></button>
		</form>
	</div>
</div>
