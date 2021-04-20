<?php
/*
 * Side of the settings page
 * all undefined vars like $template etc come from the main template
 * */
$ep_page = admin_url('admin.php?page=embedpress-new');
$gen_menu_template_names = apply_filters('ep_general_menu_tmpl_names', ['general', 'youtube', 'vimeo', 'wistia', 'twitch']);
$brand_menu_template_names = apply_filters('ep_brand_menu_templates', ['custom-logo', 'branding',]);
?>
<div class="embedpress-sidebar">
	<a href="#" class="sidebar__toggler"><i class="ep-icon ep-bar"></i></a>
	<ul class="sidebar__menu">
		<?php do_action( 'ep_before_general_menu'); ?>
        <li class="sidebar__item sidebar__dropdown <?php echo in_array( $template, $gen_menu_template_names)? 'show' : ''; ?>">
			<a href="<?php echo esc_url( $ep_page.'&page_type=general'); ?>" class="sidebar__link sidebar__link--toggler <?php echo in_array( $template, $gen_menu_template_names)? 'active' : ''; ?>"><span><i class="ep-icon ep-gear"></i></span> General</a>
			<ul class="dropdown__menu">
				<?php do_action( 'ep_before_general_menu_items'); ?>
                <li class="dropdown__item">
					<a href="<?php echo esc_url( $ep_page.'&page_type=general'); ?>" class="dropdown__link <?php echo 'general' === $template ? 'active' : ''; ?>">Settings</a>
				</li>
				<li class="dropdown__item">
					<a href="<?php echo esc_url( $ep_page.'&page_type=youtube'); ?>" class="dropdown__link <?php echo 'youtube' === $template ? 'active' : ''; ?>">YouTube</a>
				</li>
				<li class="dropdown__item">
					<a href="<?php echo esc_url( $ep_page.'&page_type=vimeo'); ?>" class="dropdown__link <?php echo 'vimeo' === $template ? 'active' : ''; ?>">Vimeo</a>
				</li>
				<li class="dropdown__item">
					<a href="<?php echo esc_url( $ep_page.'&page_type=wistia'); ?>" class="dropdown__link <?php echo 'wistia' === $template ? 'active' : ''; ?>">Wistia</a>
				</li>
				<li class="dropdown__item">
					<a href="<?php echo esc_url( $ep_page.'&page_type=twitch'); ?>" class="dropdown__link <?php echo 'twitch' === $template ? 'active' : ''; ?>">Twitch</a>
				</li>
                <?php do_action( 'ep_after_general_menu_items'); ?>
			</ul>
		</li>
		<?php do_action( 'ep_after_general_menu'); ?>
		<?php do_action( 'ep_before_element_menu'); ?>
        <li class="sidebar__item <?php echo 'elements' === $template ? 'show' : ''; ?>">
	        <?php do_action( 'ep_before_element_item'); ?>
            <a href="<?php echo esc_url( $ep_page.'&page_type=elements'); ?>" class="sidebar__link <?php echo 'elements' === $template ? 'active' : ''; ?>"><span><i class="ep-icon ep-cell"></i></span> Elements</a>
	        <?php do_action( 'ep_after_element_item'); ?>
        </li>
		<?php do_action( 'ep_before_branding_menu'); ?>
        <li class="sidebar__item sidebar__dropdown  <?php echo in_array( $template, $brand_menu_template_names)? 'show' : ''; ?>">
			<a href="<?php echo esc_url( $ep_page.'&page_type=custom-logo'); ?>" class="sidebar__link sidebar__link--toggler  <?php echo in_array( $template, $brand_menu_template_names)? 'active' : ''; ?>"><span><i class="ep-icon ep-branding"></i></span> Branding</a>
			<ul class="dropdown__menu">
				<?php do_action( 'ep_before_branding_menu_items'); ?>
                <li class="dropdown__item">
					<a href="<?php echo esc_url( $ep_page.'&page_type=custom-logo'); ?>" class="dropdown__link  <?php echo 'custom-logo' === $template ? 'active' : ''; ?>">Custom Logo</a>
				</li>
				<?php do_action( 'ep_after_branding_menu_items'); ?>
            </ul>
		</li>
		<?php do_action( 'ep_before_premium_menu'); ?>
        <li class="sidebar__item <?php echo 'premium' === $template ? 'show' : ''; ?>">
            <a href="<?php echo esc_url( $ep_page.'&page_type=premium'); ?>" class="sidebar__link <?php echo 'premium' === $template ? 'active' : ''; ?>"><span><i class="ep-icon ep-premium"></i></span> Go Premium</a>
        </li>
		<?php do_action( 'ep_after_premium_menu'); ?>

    </ul>
</div>


