<?php
/*
 * SoundCloud Settings page
 *  All undefined vars comes from 'render_settings_page' method
 *  */
$sc_settings = get_option( EMBEDPRESS_PLG_NAME.':soundcloud');
$visual = isset( $sc_settings['visual']) ? $sc_settings['visual'] : '';
$autoplay = isset( $sc_settings['autoplay']) ? $sc_settings['autoplay'] : '';
$share_button = isset( $sc_settings['share_button']) ? $sc_settings['share_button'] : '';
$comments = isset( $sc_settings['comments']) ? $sc_settings['comments'] : 1;
$color = isset( $sc_settings['color']) ? $sc_settings['color'] : '#dd3333';
$artwork = isset( $sc_settings['artwork']) ? $sc_settings['artwork'] : '';
$play_count = isset( $sc_settings['play_count']) ? $sc_settings['play_count'] : 1;
$username = isset( $sc_settings['username']) ? $sc_settings['username'] : 1;
// pro
$download_button = isset( $sc_settings['download_button']) ? $sc_settings['download_button'] : 1;
$buy_button = isset( $sc_settings['buy_button']) ? $sc_settings['buy_button'] : 1;

?>

<div class="embedpress__settings background__white radius-25 p40">
	<h3><?php esc_html_e( "SoundCloud Settings", "embedpress" ); ?></h3>
	<div class="embedpress__settings__form">
		<form action="" method="post" class="embedpress-settings-form" >
			<?php
			do_action( 'embedpress_before_dailymotion_settings_fields');
			echo  $nonce_field ; ?>
            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "Visual Player", "embedpress" ); ?></p>
                <div class="form__control__wrap">
                    <div class="input__flex input__radio_wrap" data-default="<?php echo esc_attr(  $visual ); ?>" data-value="<?php echo esc_attr(  $visual ); ?>">
                        <label class="input__radio">
                            <input type="radio" name="visual" value="" <?php checked( '', $visual); ?>>
                            <span><?php esc_html_e( "No", "embedpress" ); ?></span>
                        </label>
                        <label class="input__radio">
                            <input type="radio" name="visual" value="1" <?php checked( '1', $visual); ?>>
                            <span><?php esc_html_e( "Yes", "embedpress" ); ?></span>
                        </label>
                    </div>
                </div>
            </div>
			<div class="form__group">
				<p class="form__label"><?php esc_html_e( "Scheme", "embedpress" ); ?></p>
				<div class="form__control__wrap">
					<input type="text" class="form__control ep-color-picker" name="color" value="<?php echo esc_attr( $color); ?>"  data-default="<?php echo esc_attr(  $color ); ?>">
				</div>
			</div>

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
				<p class="form__label"><?php esc_html_e( "Buy Button", "embedpress" ); echo !$pro_active ? ' <span class="isPro">PRO</span>': ''; ?></p>
				<div class="form__control__wrap">
					<div class="input__flex input__radio_wrap <?php echo $pro_active ? '': 'isPro'; ?>" data-default="<?php echo esc_attr(  $buy_button ); ?>" data-value="<?php echo esc_attr(  $buy_button ); ?>">
						<label class="input__radio">
							<input type="radio" name="buy_button" value=""  <?php echo !$pro_active ? 'disabled ' : ''; checked( '', $buy_button); ?>>
							<span><?php esc_html_e( "Hide", "embedpress" ); ?></span>
						</label>
						<label class="input__radio">
							<input type="radio" name="buy_button" value="1"  <?php echo !$pro_active ? 'disabled ' : ''; checked( '1', $buy_button);?>>
							<span><?php esc_html_e( "Show", "embedpress" ); ?></span>
						</label>
					</div>
					<?php if ( !$pro_active ) {  include EMBEDPRESS_SETTINGS_PATH . 'templates/partials/alert-pro.php'; } ?>
				</div>
			</div>


			<div class="form__group">
				<p class="form__label"><?php esc_html_e( "Download Button", "embedpress" ); echo !$pro_active ? ' <span class="isPro">PRO</span>': ''; ?></p>
				<div class="form__control__wrap">
					<div class="input__flex input__radio_wrap <?php echo $pro_active ? '': 'isPro'; ?>" data-default="<?php echo esc_attr(  $download_button ); ?>" data-value="<?php echo esc_attr(  $download_button ); ?>">
						<label class="input__radio">
							<input type="radio" name="download_button" value=""  <?php echo !$pro_active ? 'disabled ' : ''; checked( '', $download_button); ?>>
							<span><?php esc_html_e( "Hide", "embedpress" ); ?></span>
						</label>
						<label class="input__radio">
							<input type="radio" name="download_button" value="1"  <?php echo !$pro_active ? 'disabled ' : ''; checked( '1', $download_button);?>>
							<span><?php esc_html_e( "Show", "embedpress" ); ?></span>
						</label>
					</div>
					<?php if ( !$pro_active ) {  include EMBEDPRESS_SETTINGS_PATH . 'templates/partials/alert-pro.php'; } ?>
				</div>
			</div>

			<div class="form__group">
				<p class="form__label"><?php esc_html_e( "Share Button", "embedpress" ); ?></p>
				<div class="form__control__wrap">
					<div class="input__flex input__radio_wrap" data-default="<?php echo esc_attr(  $share_button ); ?>" data-value="<?php echo esc_attr(  $share_button ); ?>">
						<label class="input__radio">
							<input type="radio" name="share_button" value="" <?php checked( '', $share_button); ?>>
							<span><?php esc_html_e( "Hide", "embedpress" ); ?></span>
						</label>
						<label class="input__radio">
							<input type="radio" name="share_button" value="1" <?php checked( '1', $share_button); ?>>
							<span><?php esc_html_e( "Show", "embedpress" ); ?></span>
						</label>
					</div>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label"><?php esc_html_e( "Comments", "embedpress" ); ?></p>
				<div class="form__control__wrap">
					<div class="input__flex input__radio_wrap" data-default="<?php echo esc_attr(  $comments ); ?>" data-value="<?php echo esc_attr(  $comments ); ?>">
						<label class="input__radio">
							<input type="radio" name="comments" value="" <?php checked( '', $comments); ?>>
							<span><?php esc_html_e( "Hide", "embedpress" ); ?></span>
						</label>
						<label class="input__radio">
							<input type="radio" name="comments" value="1" <?php checked( '1', $comments); ?>>
							<span><?php esc_html_e( "Show", "embedpress" ); ?></span>
						</label>
					</div>
				</div>
			</div>

			<div class="form__group">
				<p class="form__label"><?php esc_html_e( "Artwork", "embedpress" ); ?></p>
				<div class="form__control__wrap">
					<div class="input__flex input__radio_wrap" data-default="<?php echo esc_attr(  $artwork ); ?>" data-value="<?php echo esc_attr(  $artwork ); ?>">
						<label class="input__radio">
							<input type="radio" name="artwork" value="" <?php checked( '', $artwork); ?>>
							<span><?php esc_html_e( "Hide", "embedpress" ); ?></span>
						</label>
						<label class="input__radio">
							<input type="radio" name="artwork" value="1" <?php checked( '1', $artwork); ?>>
							<span><?php esc_html_e( "Show", "embedpress" ); ?></span>
						</label>
					</div>
					<p><?php esc_html_e( 'Artwork option works when Visual option is disabled', 'embedpress'); ?> </p>

				</div>
			</div>


			<div class="form__group">
				<p class="form__label"><?php esc_html_e( "Play Count", "embedpress" ); ?></p>
				<div class="form__control__wrap">
					<div class="input__flex input__radio_wrap" data-default="<?php echo esc_attr(  $play_count ); ?>" data-value="<?php echo esc_attr(  $play_count ); ?>">
						<label class="input__radio">
							<input type="radio" name="play_count" value="" <?php checked( '', $play_count); ?>>
							<span><?php esc_html_e( "Hide", "embedpress" ); ?></span>
						</label>
						<label class="input__radio">
							<input type="radio" name="play_count" value="1" <?php checked( '1', $play_count); ?>>
							<span><?php esc_html_e( "Show", "embedpress" ); ?></span>
						</label>
					</div>
                    <p><?php esc_html_e( 'Play count option works when Visual option is disabled', 'embedpress'); ?> </p>

                </div>
			</div>


			<div class="form__group">
				<p class="form__label"><?php esc_html_e( "Username", "embedpress" ); ?></p>
				<div class="form__control__wrap">
					<div class="input__flex input__radio_wrap" data-default="<?php echo esc_attr(  $username ); ?>" data-value="<?php echo esc_attr(  $username ); ?>">
						<label class="input__radio">
							<input type="radio" name="username" value="" <?php checked( '', $username); ?>>
							<span><?php esc_html_e( "Hide", "embedpress" ); ?></span>
						</label>
						<label class="input__radio">
							<input type="radio" name="username" value="1" <?php checked( '1', $username); ?>>
							<span><?php esc_html_e( "Show", "embedpress" ); ?></span>
						</label>
					</div>
				</div>
			</div>

			<?php do_action( 'embedpress_after_dailymotion_settings_fields'); ?>
			<button class="button button__themeColor radius-10 embedpress-submit-btn" name="submit" value="soundcloud"><?php esc_html_e( 'Save Changes', 'embedpress'); ?></button>
		</form>
	</div>
</div>
