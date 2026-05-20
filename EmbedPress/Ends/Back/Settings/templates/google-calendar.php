<?php
/*
 * Google Calendar Settings page
 * All undefined vars comes from 'render_settings_page' method
 *  */

$epgc_client_secret = get_option('epgc_client_secret', '');
$epgc_cache_time = get_option('epgc_cache_time', 0);
$calendarList = Embedpress_Google_Helper::getDecoded( 'epgc_calendarlist' ); //settings_selected_calendar_ids_json_cb

// Auto-prefill: existing sites that uploaded the JSON have the same option;
// decode it so the new two-field form shows their saved client_id and signals
// that a secret is already on file (we never echo the secret back into the DOM).
$epgc_existing = Embedpress_Google_Helper::getDecoded( 'epgc_client_secret', [] );
$epgc_existing_client_id     = isset( $epgc_existing['web']['client_id'] )     ? $epgc_existing['web']['client_id']     : '';
$epgc_has_existing_secret    = ! empty( $epgc_existing['web']['client_secret'] );
$epgc_redirect_uri           = admin_url( 'admin.php?page=embedpress&page_type=google-calendar' );

?>

<div class="embedpress__settings embedpress-gcalendar-settings background__white radius-25 p40">
	<div class="embedpress-gcalendar-settings__header" style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:8px;">
		<h3 style="margin:0;"><?php esc_html_e( "Google Calendar Settings", "embedpress" ); ?></h3>
		<a href="https://embedpress.com/docs/embed-google-calendar-in-wordpress/" target="_blank" rel="noopener noreferrer" class="embedpress-gcalendar-doc-link" style="display:inline-flex;align-items:center;gap:4px;font-size:13px;color:#1a73e8;text-decoration:none;line-height:1;">
			<?php esc_html_e( 'Documentation', 'embedpress' ); ?>
			<span aria-hidden="true">&rarr;</span>
		</a>
	</div>
	<div class="embedpress__settings__form embedpress-gcalendar-settings__form">
		<form action="" method="post" class="embedpress-settings-form">
			<?php
			do_action( 'embedpress_before_gcalendar_settings_fields');
			echo  $nonce_field ; ?>

			<div class="form__group">
				<label for="epgc_client_id" class="form__label"><?php esc_html_e( 'Client ID', 'embedpress' ); echo !$pro_active ? ' <span class="isPro">PRO</span>' : ''; ?></label>
				<div class="form__control__wrap <?php echo $pro_active ? '' : 'isPro'; ?>">
					<input type="text" name="epgc_client_id" id="epgc_client_id" class="form__control" value="<?php echo esc_attr( $epgc_existing_client_id ); ?>" placeholder="xxxxxxxx-xxxxxxxxxxxx.apps.googleusercontent.com" autocomplete="off" />
					<p><?php esc_html_e( 'From your Google Cloud Console OAuth 2.0 Client ID.', 'embedpress' ); ?></p>
				</div>
				<?php if ( !$pro_active ) {  include EMBEDPRESS_SETTINGS_PATH . 'templates/partials/alert-pro.php'; } ?>
			</div>

			<div class="form__group">
				<label for="epgc_client_secret_value" class="form__label"><?php esc_html_e( 'Client Secret', 'embedpress' ); echo !$pro_active ? ' <span class="isPro">PRO</span>' : ''; ?></label>
				<div class="form__control__wrap <?php echo $pro_active ? '' : 'isPro'; ?>">
					<input type="password" name="epgc_client_secret_value" id="epgc_client_secret_value" class="form__control" value="" placeholder="<?php echo $epgc_has_existing_secret ? esc_attr__( 'Stored — leave blank to keep current secret', 'embedpress' ) : 'GOCSPX-...'; ?>" autocomplete="new-password" />
					<p><?php esc_html_e( 'From the same OAuth 2.0 Client. Stored in the WordPress options table.', 'embedpress' ); ?></p>
				</div>
				<?php if ( !$pro_active ) {  include EMBEDPRESS_SETTINGS_PATH . 'templates/partials/alert-pro.php'; } ?>
			</div>

			<div class="form__group">
				<label class="form__label"><?php esc_html_e( 'Authorized Redirect URI', 'embedpress' ); ?></label>
				<div class="form__control__wrap">
					<input type="text" readonly value="<?php echo esc_attr( $epgc_redirect_uri ); ?>" class="form__control epgc-redirect-uri-input" id="epgc-redirect-uri" style="cursor:pointer;" />
					<p class="ep-note"><?php esc_html_e( 'Click the field to copy. Paste this exact URI into your Google Cloud Console OAuth client under "Authorized redirect URIs".', 'embedpress' ); ?></p>
				</div>
			</div>
			<script>
				(function ($) {
					if (typeof $ === 'undefined') { $ = window.jQuery; }
					var input = document.getElementById('epgc-redirect-uri');
					if (!input) return;
					var copiedLabel  = <?php echo wp_json_encode( __( 'Redirect URI copied to clipboard', 'embedpress' ) ); ?>;
					var failedLabel  = <?php echo wp_json_encode( __( 'Copy failed — press Ctrl/Cmd+C', 'embedpress' ) ); ?>;
					function flashToast(selector, message) {
						if (!$ || !$(selector).length) return;
						var $node = $(selector);
						var $p = $node.find('p');
						var original = $p.text();
						$p.text(message);
						$node.addClass('show');
						clearTimeout($node.data('epgcTimer'));
						$node.data('epgcTimer', setTimeout(function () {
							$node.removeClass('show');
							setTimeout(function () { $p.text(original); }, 300);
						}, 2000));
					}
					function copyValue() {
						input.select();
						var value = input.value;
						var done = function (ok) {
							flashToast(ok ? '.toast__message--success' : '.toast__message--attention', ok ? copiedLabel : failedLabel);
						};
						if (navigator.clipboard && window.isSecureContext) {
							navigator.clipboard.writeText(value).then(function () { done(true); }, function () {
								try { done(document.execCommand('copy')); } catch (e) { done(false); }
							});
						} else {
							try { done(document.execCommand('copy')); } catch (e) { done(false); }
						}
					}
					input.addEventListener('click', copyValue);
					input.addEventListener('focus', function () { input.select(); });
				})(window.jQuery);
			</script>

            <div class="form__group">
                <label for="epgc_cache_time" class="form__label" ><?php esc_html_e( "Caching time (in Minutes)", "embedpress" );  echo $pro_active ? '': ' <span class="isPro">PRO</span>'; ?> </label>
                <div class="form__control__wrap  <?php echo $pro_active ? '': 'isPro'; ?>">
                    <input name="epgc_cache_time" type="number" id="epgc_cache_time" class="form__control" data-default="<?php echo esc_attr( $epgc_cache_time); ?>" value="<?php echo esc_attr( $epgc_cache_time); ?>" >
                    <p><?php esc_html_e( 'How long do you want to cache the data? Set it 0 to disable caching', 'embedpress'); ?></p>

                </div>
	            <?php if ( !$pro_active ) {  include EMBEDPRESS_SETTINGS_PATH . 'templates/partials/alert-pro.php'; } ?>

            </div>
                <h2><?php esc_html_e('Calendars', 'embedpress'); ?></h2>
                <div class="form__group">
                    <label for="epgc_cache_time" class="form__label" ><?php esc_html_e( "Select calendars to show", "embedpress" ); echo $pro_active ? '': ' <span class="isPro">PRO</span>';  ?> </label>
                    <div class="form__control__wrap <?php echo $pro_active ? '': 'isPro'; ?>">
                        <?php if ( !empty( $calendarList) ) {
	                        Embedpress_Google_Helper::print_calendar_list($calendarList); ?>
                            <p><?php esc_html_e( 'Select which calendars you want to show', 'embedpress'); ?></p>
                        <?php }else{ ?>
                            <p><?php esc_html_e( 'No calendar was found', 'embedpress'); ?></p>
                        <?php } ?>
                    </div>
	                <?php if ( !$pro_active ) {  include EMBEDPRESS_SETTINGS_PATH . 'templates/partials/alert-pro.php'; } ?>

                </div>


			<?php do_action( 'embedpress_after_gcalendar_settings_fields'); ?>

			<button class="button button__themeColor radius-10 embedpress-submit-btn" name="submit" value="gcalendar"><?php esc_html_e( 'Save Changes', 'embedpress'); ?></button>
		</form>
        <br><br>
        <?php if ( !empty( $epgc_client_secret) ) { ?>
        <h2><?php esc_html_e( 'Authorization', 'embedpress'); ?></h2>
            <p><?php esc_html_e( 'You need to authorize before fetching new calendars', 'embedpress'); ?></p>

            <br>
        <form style="display:inline" method="post" action="<?php echo admin_url('admin-post.php'); ?>">
            <?php wp_nonce_field( 'epgc_authorize', 'epgc_authorize_data' ); ?>
            <input type="hidden" name="action" value="epgc_authorize">
			<?php submit_button(__('Authorize', 'embedpress'), 'primary', 'epgc_authorize', false); ?>
        </form>

        <form style="display:inline" method="post" action="<?php echo admin_url('admin-post.php'); ?>">
            <?php wp_nonce_field( 'epgc_remove_private', 'epgc_remove_private_data' ); ?>
            <input type="hidden" name="action" value="epgc_remove_private">
			<?php submit_button(__('Stop', 'embedpress'), '', 'epgc_remove_private', false); ?>
        </form>
        <?php } ?>



	</div>
</div>
