<?php
/*
 * Side of the settings page
 * all undefined vars like $template etc come from the main template
 * */
?>
<div class="embedpress-sidebar">
	<a href="#" class="sidebar__toggler"><i class="ep-icon ep-bar"></i></a>
	<ul class="sidebar__menu">
		<?php do_action( 'ep_before_general_menu'); ?>
        <li class="sidebar__item sidebar__dropdown <?php echo in_array( $template, $gen_menu_template_names)? 'show' : ''; ?>">
			<a href="<?php echo esc_url( $ep_page.'&page_type=general'); ?>" class="sidebar__link sidebar__link--toggler <?php echo in_array( $template, $gen_menu_template_names)? 'active' : ''; ?>"><span><i class="ep-icon ep-gear"></i></span> General</a>
			<ul class="dropdown__menu <?php echo in_array( $template, $gen_menu_template_names) ? 'show' : ''; ?>">
				<?php do_action( 'ep_before_general_menu_items'); ?>
                <li class="dropdown__item">
					<a href="<?php echo esc_url( $ep_page.'&page_type=general'); ?>" class="dropdown__link <?php echo 'general' === $template ? 'active' : ''; ?>">
						<img class="embedpress-settings-icon" src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/settings-sub.svg" alt="">
						<?php esc_html_e( "Settings", "embedpress" ); ?>
					</a>
				</li>
				<li class="dropdown__item">
					<a href="<?php echo esc_url( $ep_page.'&page_type=shortcode'); ?>" class="dropdown__link <?php echo 'shortcode' === $template ? 'active' : ''; ?>">
						<img class="embedpress-settings-icon" src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/shortcode.svg" alt="">
						<?php esc_html_e( "Shortcode", "embedpress" ); ?>
					</a>
				</li>
                <?php do_action( 'ep_after_general_menu_items'); ?>
			</ul>
		</li>
		<?php do_action( 'ep_after_general_menu'); ?>



		<?php do_action( 'ep_before_platform_menu'); ?>
        <li class="sidebar__item sidebar__dropdown <?php echo in_array( $template, $platform_menu_template_names)? 'show' : ''; ?>">
            <a href="<?php echo esc_url( $ep_page.'&page_type=youtube'); ?>" class="sidebar__link sidebar__link--toggler <?php echo in_array( $template, $platform_menu_template_names) ? 'active' : ''; ?>"><span><i class="ep-icon ep-platform"></i></span> Platforms</a>
            <ul class="dropdown__menu <?php echo in_array( $template, $platform_menu_template_names) ? 'show' : ''; ?>">
				<?php do_action( 'ep_before_platform_menu_items'); ?>
                <li class="dropdown__item">
                    <a href="<?php echo esc_url( $ep_page.'&page_type=youtube'); ?>" class="dropdown__link <?php echo 'youtube' === $template ? 'active' : ''; ?>">
                        <img class="embedpress-settings-icon" src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/youtube.svg" alt="">
						<?php esc_html_e( "YouTube", "embedpress" ); ?>
                    </a>
                </li>
                <li class="dropdown__item">
                    <a href="<?php echo esc_url( $ep_page.'&page_type=vimeo'); ?>" class="dropdown__link <?php echo 'vimeo' === $template ? 'active' : ''; ?>">
                        <img class="embedpress-settings-icon" src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/vimeo.svg" alt="">
						<?php esc_html_e( "Vimeo", "embedpress" ); ?>
                    </a>
                </li>
                <li class="dropdown__item">
                    <a href="<?php echo esc_url( $ep_page.'&page_type=wistia'); ?>" class="dropdown__link <?php echo 'wistia' === $template ? 'active' : ''; ?>">
                        <img class="embedpress-settings-icon" src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/wistia.svg" alt="">
						<?php esc_html_e( "Wistia", "embedpress" ); ?>
                    </a>
                </li>
                <li class="dropdown__item">
                    <a href="<?php echo esc_url( $ep_page.'&page_type=twitch'); ?>" class="dropdown__link <?php echo 'twitch' === $template ? 'active' : ''; ?>">
                        <img class="embedpress-settings-icon" src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/twitch.svg" alt="">
						<?php esc_html_e( "Twitch", "embedpress" ); ?>
                    </a>
                </li>
                <li class="dropdown__item">
                    <a href="<?php echo esc_url( $ep_page.'&page_type=dailymotion'); ?>" class="dropdown__link <?php echo 'dailymotion' === $template ? 'active' : ''; ?>">
                        <img class="embedpress-settings-icon" src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/dailymotion.svg" alt="">
			            <?php esc_html_e( "Dailymotion", "embedpress" ); ?>
                    </a>
                </li>
                <li class="dropdown__item">
                    <a href="<?php echo esc_url( $ep_page.'&page_type=soundcloud'); ?>" class="dropdown__link <?php echo 'soundcloud' === $template ? 'active' : ''; ?>">
                        <img class="embedpress-settings-icon" src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/soundcloud.svg" alt="">
			            <?php esc_html_e( "SoundCloud", "embedpress" ); ?>
                    </a>
                </li>
                <li class="dropdown__item">
                    <a href="<?php echo esc_url( $ep_page.'&page_type=spotify'); ?>" class="dropdown__link <?php echo 'spotify' === $template ? 'active' : ''; ?>">
                        <img class="embedpress-settings-icon" src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/spotify.svg" alt="">

						<?php esc_html_e( "Spotify", "embedpress" ); ?>
                    </a>
                </li>
				<?php do_action( 'ep_after_platform_menu_items'); ?>
            </ul>
        </li>
		<?php do_action( 'ep_after_platform_menu'); ?>



		<?php do_action( 'ep_before_element_menu'); ?>
        <li class="sidebar__item <?php echo 'elements' === $template ? 'show' : ''; ?>">
	        <?php do_action( 'ep_before_element_item'); ?>
            <a href="<?php echo esc_url( $ep_page.'&page_type=elements'); ?>" class="sidebar__link <?php echo 'elements' === $template ? 'active' : ''; ?>"><span><i class="ep-icon ep-cell"></i></span> <?php esc_html_e( "Elements", "embedpress" ); ?></a>
	        <?php do_action( 'ep_after_element_item'); ?>
        </li>

		<?php do_action( 'ep_before_branding_menu'); ?>
        <li class="sidebar__item <?php echo 'custom-logo' === $template ? 'show' : ''; ?>">
			<a href="<?php echo esc_url( $ep_page.'&page_type=custom-logo'); ?>" class="sidebar__link  <?php echo 'custom-logo' === $template ? 'active' : ''; ?>"><span><i class="ep-icon ep-branding"></i></span> Branding</a>
		</li>
		<?php do_action( 'ep_before_branding_menu'); ?>

        <?php
		if ( empty( $pro_active) || !$pro_active) {
        do_action( 'ep_before_premium_menu'); ?>
        <li class="sidebar__item <?php echo 'go-premium' === $template ? 'show' : ''; ?>">
            <a href="<?php echo esc_url( $ep_page.'&page_type=go-premium'); ?>" class="sidebar__link <?php echo 'premium' === $template ? 'active' : ''; ?>"><span><i class="ep-icon ep-premium"></i></span> <?php esc_html_e( "Go Premium", "embedpress" ); ?></a>
        </li>
		<?php do_action( 'ep_after_premium_menu');
        }
		?>
		<?php
		if ( isset( $pro_active) && $pro_active) {
        do_action( 'ep_before_license_menu'); ?>
        <li class="sidebar__item <?php echo 'license' === $template ? 'show' : ''; ?>">
            <a href="<?php echo esc_url( $ep_page.'&page_type=license'); ?>" class="sidebar__link <?php echo 'license' === $template ? 'active' : ''; ?>"><span><i class="ep-icon ep-lock"></i></span> <?php esc_html_e( "License", "embedpress" ); ?></a>
        </li>
		<?php do_action( 'ep_after_license_menu');
        }
		?>

    </ul>
</div>


