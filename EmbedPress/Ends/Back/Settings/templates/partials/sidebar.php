<?php
/*
 * Side of the settings page
 * all undefined vars like $template etc come from the main template
 * */
?>
<div class="embedpress-sidebar">
    <a href="#" class="sidebar__toggler"><i class="ep-icon ep-bar"></i></a>
    <ul class="sidebar__menu">
        
        <?php do_action('ep_before_element_menu'); ?>
        <li class="sidebar__item <?php echo 'general' === $template ? 'show' : ''; ?>">
            <?php do_action('ep_before_element_item'); ?>
            <a href="<?php echo esc_url($ep_page . '&page_type=general'); ?>" class="sidebar__link <?php echo 'general' === $template ? 'active' : ''; ?>"><span><i class="ep-icon ep-gear"></i></span> <?php esc_html_e("General", "embedpress"); ?></a>
            <?php do_action('ep_after_element_item'); ?>
        </li>
        <li class="sidebar__item <?php echo 'shortcode' === $template ? 'show' : ''; ?>">
            <?php do_action('ep_before_element_item'); ?>
            <a href="<?php echo esc_url($ep_page . '&page_type=shortcode'); ?>" class="sidebar__link <?php echo 'shortcode' === $template ? 'active' : ''; ?>"><span><i class="ep-icon ep-cell"></i></span> <?php esc_html_e("Shortcode", "embedpress"); ?></a>
            <?php do_action('ep_after_element_item'); ?>
        </li>
        <li class="sidebar__item <?php echo 'sources' === $template ? 'show' : ''; ?>">
            <?php do_action('ep_before_element_item'); ?>
            <a href="<?php echo esc_url($ep_page . '&page_type=sources'); ?>" class="sidebar__link <?php echo 'sources' === $template ? 'active' : ''; ?>"><span><i class="ep-icon ep-platform"></i></span> <?php esc_html_e("Sources", "embedpress"); ?></a>
            <?php do_action('ep_after_element_item'); ?>
        </li>
        <li class="sidebar__item <?php echo 'elements' === $template ? 'show' : ''; ?>">
            <?php do_action('ep_before_element_item'); ?>
            <a href="<?php echo esc_url($ep_page . '&page_type=elements'); ?>" class="sidebar__link <?php echo 'elements' === $template ? 'active' : ''; ?>"><span><i class="ep-icon ep-cell"></i></span> <?php esc_html_e("Elements", "embedpress"); ?></a>
            <?php do_action('ep_after_element_item'); ?>
        </li>
        <?php do_action('ep_before_branding_menu'); ?>
        <li class="sidebar__item <?php echo 'custom-logo' === $template ? 'show' : ''; ?>">
            <a href="<?php echo esc_url($ep_page . '&page_type=custom-logo'); ?>" class="sidebar__link  <?php echo 'custom-logo' === $template ? 'active' : ''; ?>"><span><i class="ep-icon ep-branding"></i></span> Branding</a>
        </li>
        <?php do_action('ep_before_branding_menu'); ?>

        <?php
        if (empty($pro_active) || !$pro_active) {
            do_action('ep_before_premium_menu'); ?>
            <li class="sidebar__item <?php echo 'go-premium' === $template ? 'show' : ''; ?>">
                <a href="<?php echo esc_url($ep_page . '&page_type=go-premium'); ?>" class="sidebar__link <?php echo 'premium' === $template ? 'active' : ''; ?>"><span><i class="ep-icon ep-premium"></i></span> <?php esc_html_e("Go Premium", "embedpress"); ?></a>
            </li>
        <?php do_action('ep_after_premium_menu');
        }
        ?>
        <?php
        if (isset($pro_active) && $pro_active) {
            do_action('ep_before_license_menu'); ?>
            <li class="sidebar__item <?php echo 'license' === $template ? 'show' : ''; ?>">
                <a href="<?php echo esc_url($ep_page . '&page_type=license'); ?>" class="sidebar__link <?php echo 'license' === $template ? 'active' : ''; ?>"><span><i class="ep-icon ep-lock"></i></span> <?php esc_html_e("License", "embedpress"); ?></a>
            </li>
        <?php do_action('ep_after_license_menu');
        }
        ?>

    </ul>
</div>