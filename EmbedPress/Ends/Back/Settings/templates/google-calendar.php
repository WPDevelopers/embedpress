<?php
/*
 * Google Calender Settings page
 * All undefined vars comes from 'render_settings_page' method
 *  */
$epgc_client_secret = get_option('epgc_client_secret', '');
$epgc_cache_time = get_option('epgc_cache_time', 0);

?>

<div class="embedpress__settings background__white radius-25 p40">
	<h3><?php esc_html_e( "Google Calender Settings", "embedpress" ); ?></h3>
	<div class="embedpress__settings__form">
		<form action="" method="post" class="embedpress-settings-form">
			<?php
			do_action( 'embedpress_before_gcalendar_settings_fields');
			echo  $nonce_field ; ?>
			<div class="form__group">
				<label for="epgc_client_secret" class="form__label" ><?php esc_html_e( "Google Auth JSON (Refresh after saving)", "embedpress" ); ?> </label>
				<div class="form__control__wrap">
                   <textarea name="epgc_client_secret" id="epgc_client_secret" class="form__control" data-default="<?php echo esc_attr( $epgc_client_secret); ?>" value="<?php echo esc_attr( $epgc_client_secret); ?>" rows="5"  ><?php echo esc_html(  $epgc_client_secret) ?></textarea>
                    <p ><?php printf(__('Enter the JSON string downloaded from the Google Console. Note: Create a new project in Google developer console and make sure you set <code>%s</code> as the authorized redirect URI.', 'embedpress'), $ep_page . '&page_type=google-calender'); ?></p>

                </div>

			</div>

            <div class="form__group">
                <label for="epgc_cache_time" class="form__label" ><?php esc_html_e( "Caching time (in Minutes)", "embedpress" ); ?> </label>
                <div class="form__control__wrap">
                    <input name="epgc_cache_time" type="number" id="epgc_cache_time" class="form__control" data-default="<?php echo esc_attr( $epgc_cache_time); ?>" value="<?php echo esc_attr( $epgc_cache_time); ?>" >
                    <p><?php esc_html_e( 'How long do you want to cache the data? Set it 0 to disable caching', 'embedpress'); ?></p>

                </div>

            </div>
                <h2>Calendars</h2>
                <div class="form__group">
                    <label for="epgc_cache_time" class="form__label" ><?php esc_html_e( "Select calendars", "embedpress" ); ?> </label>
                    <div class="form__control__wrap">
						<?php  Embedpress_Google_Helper::print_calendar_list(); ?>
                        <p><?php esc_html_e( 'Select which calendars you want to show', 'embedpress'); ?></p>

                    </div>

                </div>


			<?php do_action( 'embedpress_after_gcalendar_settings_fields'); ?>
			<button class="button button__themeColor radius-10 embedpress-submit-btn" name="submit" value="gcalendar"><?php esc_html_e( 'Save Changes', 'embedpress'); ?></button>
		</form>
        <br><br>
        <?php if ( !empty( $epgc_client_secret) ) { ?>
        <h2>Authorization</h2>
        <br>
        <form style="display:inline" method="post" action="<?php echo admin_url('admin-post.php'); ?>">
            <input type="hidden" name="action" value="epgc_authorize">
			<?php submit_button(__('Authorize', 'embedpress'), 'primary', 'epgc_authorize', false); ?>
        </form>

        <form style="display:inline" method="post" action="<?php echo admin_url('admin-post.php'); ?>">
            <input type="hidden" name="action" value="epgc_remove_private">
			<?php submit_button(__('Stop', 'embedpress'), '', 'epgc_remove_private', false); ?>
        </form>
        <?php } ?>


	</div>
</div>
