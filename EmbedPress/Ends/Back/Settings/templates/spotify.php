<?php
/*
 * Spotify Settings page template
 *  All undefined vars comes from 'render_settings_page' method
 *  */
$settings = get_option( EMBEDPRESS_PLG_NAME.':spotify');
$spotify_theme = isset( $settings['theme']) ? $settings['theme'] : '1';
$follow_theme = isset( $settings['follow_theme']) ? $settings['follow_theme'] : 'light';
$follow_layout = isset( $settings['follow_layout']) ? $settings['follow_layout'] : 'detail';
$follow_count = isset( $settings['follow_count']) ? $settings['follow_count'] : 1;
?>

<div class="embedpress__settings background__white radius-25 p40">
    <h3><?php esc_html_e( "Spotify Settings", "embedpress-pro" ); ?></h3>
    <div class="embedpress__settings__form">
        <form action="" method="post" class="embedpress-settings-form" >
	        <?php
	        do_action( 'embedpress_before_spotify_settings_fields');
            echo  $nonce_field ; ?>
            <div class="form__group">
                <label class="form__label" for="spotify_theme"><?php esc_html_e( "Player Background Color", "embedpress-pro" ); ?></label>
                <div class="form__control__wrap">
                    <div class="embedpress__select">
                        <span><i class="ep-icon ep-caret-down"></i></span>
                        <select name="spotify_theme" id="spotify_theme" data-default="<?php echo esc_attr( $spotify_theme ); ?>">
                            <option value="1" <?php selected( '1', $spotify_theme); ?> ><?php esc_html_e( "Dynamic", "embedpress-pro" ); ?></option>
                            <option value="0" <?php selected( '0', $spotify_theme); ?> ><?php esc_html_e( "Black & White", "embedpress-pro" ); ?></option>
                        </select>
                    </div>

                    <p><?php printf( esc_html__( "Dynamic option will use the most vibrant color from the album art.", 'embedpress'), '<br>'); ?></p>
                </div>
            </div>
            <h3><?php esc_html_e( "Artist Follower Widget", "embedpress" ); ?></h3>

	        <div class="form__group">
		        <label class="form__label" for="follow_theme"><?php esc_html_e( "Follow Widget Theme", "embedpress-pro" );  echo !$pro_active ? ' <span class="isPro">PRO</span>' : ''; ?></label>
		        <div class="form__control__wrap">
			        <div class="embedpress__select <?php echo $pro_active ? '': 'isPro'; ?>">
				        <span><i class="ep-icon ep-caret-down"></i></span>
				        <select name="follow_theme" id="follow_theme" data-default="<?php echo esc_attr( $follow_theme ); ?>" <?php echo !$pro_active ? 'disabled' : ''; ?>>
					        <option value="light" <?php selected( 'light', $follow_theme); ?> ><?php esc_html_e( "For Light Background", "embedpress-pro" ); ?></option>
					        <option value="dark" <?php selected( 'dark', $follow_theme); ?> ><?php esc_html_e( "For Dark Background", "embedpress-pro" ); ?></option>
				        </select>
			        </div>
			        <?php if ( !$pro_active ) {  include EMBEDPRESS_SETTINGS_PATH . 'templates/partials/alert-pro.php'; } ?>

                </div>
	        </div>

            <div class="form__group">
                <label class="form__label" for="follow_layout"><?php esc_html_e( "Follow Widget Layout", "embedpress-pro" );  echo !$pro_active ? ' <span class="isPro">PRO</span>' : ''; ?></label>
                <div class="form__control__wrap">
                    <div class="embedpress__select <?php echo $pro_active ? '': 'isPro'; ?>">
                        <span><i class="ep-icon ep-caret-down"></i></span>
                        <select name="follow_layout" id="follow_layout" data-default="<?php echo esc_attr( $follow_layout ); ?>" <?php echo !$pro_active ? 'disabled' : ''; ?>>
                            <option value="detail" <?php selected( 'detail', $follow_layout); ?> ><?php esc_html_e( "Details", "embedpress-pro" ); ?></option>
                            <option value="basic" <?php selected( 'basic', $follow_layout); ?> ><?php esc_html_e( "Basic", "embedpress-pro" ); ?></option>
                        </select>
                    </div>
	                <?php if ( !$pro_active ) {  include EMBEDPRESS_SETTINGS_PATH . 'templates/partials/alert-pro.php'; } ?>

                </div>
            </div>
            <div class="form__group">
                <label class="form__label" for="follow_count"><?php esc_html_e( "Show Follower Statistics", "embedpress-pro" ); echo !$pro_active ? ' <span class="isPro">PRO</span>' : ''; ?></label>
                <div class="form__control__wrap">
                    <div class="embedpress__select <?php echo $pro_active ? '': 'isPro'; ?>">
                        <span><i class="ep-icon ep-caret-down"></i></span>
                        <select name="follow_count" id="follow_count" data-default="<?php echo esc_attr( $follow_count ); ?>" <?php echo !$pro_active ? 'disabled' : ''; ?>>
                            <option value="1" <?php selected( '1', $follow_count); ?> ><?php esc_html_e( "Yes", "embedpress-pro" ); ?></option>
                            <option value="0" <?php selected( '0', $follow_count); ?> ><?php esc_html_e( "No", "embedpress-pro" ); ?></option>
                        </select>
                    </div>
	                <?php if ( !$pro_active ) {  include EMBEDPRESS_SETTINGS_PATH . 'templates/partials/alert-pro.php'; } ?>
                </div>
            </div>

            <div class="form__group">
                <p class="embedpress-note" style="font-size: 14px; color:#7C8DB5;"><strong><?php esc_html_e( "Note:", "embedpress" ); ?></strong><?php printf( __( "To add follow widget, please add '%s:follow_widget%s' to the end of an artist URL. For details, check out this %s documentation%s.", "embedpress" ), '<strong>','</strong>', '<a class="ep-link" href="https://embedpress.com/docs/how-to-embed-spotify-artist-follower-widget/" target="_blank">', '</a>'); ?></p>
            </div>

	        <?php do_action( 'embedpress_after_spotify_settings_fields'); ?>
            <button class="button button__themeColor radius-10 embedpress-submit-btn" name="submit" value="spotify"><?php esc_html_e( 'Save Changes', 'embedpress'); ?></button>
        </form>
    </div>
</div>
