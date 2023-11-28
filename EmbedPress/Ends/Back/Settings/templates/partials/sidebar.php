<?php
/*
 * Side of the settings page
 * all undefined vars like $template etc come from the main template
 * */
?>

<div class="embedpress-sidebar-wrapper">
    <!-- <div class="sticky-sibling"></div> -->
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
                <div class="tab-button-section">
                    <ul class="source-tab">
                        <!-- <li class="tab-button active" data-tab="all"><img class="source-image" src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/sources/code.svg" alt=""> All</li> -->
                        <li class="tab-button" data-tab="audio"><img class="source-image" src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/sources/audio.svg" alt="">Audio</li>
                        <li class="tab-button" data-tab="video"><img class="source-image" src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/sources/video.svg" alt="">Video</li>
                        <li class="tab-button" data-tab="image"><img class="source-image" src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/sources/image.svg" alt="">Image</li>
                        <li class="tab-button" data-tab="pdf"><img class="source-image" src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/sources/pdf.svg" alt="">PDF & Docs</li>
                        <li class="tab-button" data-tab="social"><img class="source-image" src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/sources/social.svg" alt="">Social</li>
                        <li class="tab-button" data-tab="google"><img class="source-image" src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/sources/google.svg" alt="">Google Sources</li>
                        <li class="tab-button" data-tab="stream"><img class="source-image" src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/sources/stream.svg" alt="">Live Stream</li>
                    </ul>
                </div>
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
            if (isset($pro_active) && $pro_active) {
                do_action('ep_before_license_menu'); ?>
                <li class="sidebar__item <?php echo 'license' === $template ? 'show' : ''; ?>">
                    <a href="<?php echo esc_url($ep_page . '&page_type=license'); ?>" class="sidebar__link <?php echo 'license' === $template ? 'active' : ''; ?>"><span><i class="ep-icon ep-lock"></i></span> <?php esc_html_e("License", "embedpress"); ?></a>
                </li>
            <?php do_action('ep_after_license_menu');
            }
            ?>

        </ul>


        <?php
        if (empty($pro_active) || !$pro_active) {
            do_action('ep_before_premium_menu'); ?>

            <div class="premium-button">
                <a href="<?php echo esc_url($ep_page . '&page_type=go-premium'); ?>" class="sidebar__link <?php echo 'license' === $template ? 'active' : ''; ?>">

                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="21" viewBox="0 0 24 21" fill="none">
                            <path d="M19.6799 17.28H4.31988C3.52596 17.28 2.87988 17.9261 2.87988 18.72C2.87988 19.5139 3.52596 20.16 4.31988 20.16H19.6799C20.4738 20.16 21.1199 19.5139 21.1199 18.72C21.1199 17.9261 20.4738 17.28 19.6799 17.28Z" fill="#FF9900" />
                            <path d="M22.08 2.88C21.0211 2.88 20.16 3.74114 20.16 4.8C20.16 5.51137 20.5536 6.1267 21.1305 6.45886C20.0198 9.08925 18.287 10.703 16.6675 10.5571C14.8665 10.4102 13.3977 8.28094 12.5875 4.71839C13.6262 4.45533 14.4 3.51933 14.4 2.4C14.4 1.07616 13.3238 0 12 0C10.6761 0 9.59995 1.07616 9.59995 2.4C9.59995 3.51938 10.3737 4.45538 11.4124 4.71839C10.6022 8.28094 9.13336 10.4102 7.33242 10.5571C5.71964 10.703 3.97913 9.08925 2.86941 6.45886C3.44634 6.1267 3.83995 5.51133 3.83995 4.8C3.83995 3.74114 2.97881 2.88 1.91995 2.88C0.861141 2.88 0 3.74114 0 4.8C0 5.78498 0.748781 6.58945 1.70494 6.69886L3.55392 16.32H20.4461L22.295 6.69886C23.2512 6.58945 24 5.78498 24 4.8C24 3.74114 23.1389 2.88 22.08 2.88Z" fill="url(#paint0_linear_189_140)" />
                            <defs>
                                <linearGradient id="paint0_linear_189_140" x1="12" y1="0" x2="12" y2="16.32" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#FFC045" />
                                    <stop offset="1" stop-color="#FF9900" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </span>
                    <?php esc_html_e("Go Premium", "embedpress"); ?>
                </a>
            </div>
        <?php do_action('ep_after_premium_menu');
        }
        ?>
    </div>
</div>