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
                <a href="<?php echo esc_url($ep_page . '&page_type=general'); ?>" class="sidebar__link general <?php echo 'general' === $template ? 'active' : ''; ?>"><span>
                        <!-- <i class="ep-icon ep-gear"></i> -->
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 15h6m2 4H5a4 4 0 0 1-4-4V8.708a4 4 0 0 1 1.927-3.42l5-3.03a4 4 0 0 1 4.146 0l5 3.03A4 4 0 0 1 19 8.707V15a4 4 0 0 1-4 4" stroke="#988FBD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
                    </span> <?php esc_html_e("General", "embedpress"); ?></a>
                <?php do_action('ep_after_element_item'); ?>
            </li>
            <li class="sidebar__item <?php echo 'shortcode' === $template ? 'show' : ''; ?>">
                <?php do_action('ep_before_element_item'); ?>
                <a href="<?php echo esc_url($ep_page . '&page_type=shortcode'); ?>" class="sidebar__link shortcode <?php echo 'shortcode' === $template ? 'active' : ''; ?>"><span>
                        <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.19844 13.8001H2.79844V4.2001H5.19844V1.8001H0.398438V16.2001H5.19844V13.8001ZM6.51844 17.4001H9.03844L13.4784 0.600098H10.9584L6.51844 17.4001ZM14.7984 1.8001V4.2001H17.1984V13.8001H14.7984V16.2001H19.5984V1.8001H14.7984Z" fill="#988FBD" />
                        </svg>

                    </span> <?php esc_html_e("Shortcode", "embedpress"); ?></a>
                <?php do_action('ep_after_element_item'); ?>
            </li>
            <li class="sidebar__item <?php echo 'sources' === $template ? 'show' : ''; ?>">
                <?php do_action('ep_before_element_item'); ?>
                <a href="<?php echo esc_url($ep_page . '&page_type=sources'); ?>" class="sidebar__link sources <?php echo 'sources' === $template ? 'active' : ''; ?>"><span>


                        <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 12c-3.36 0-4.46 1.35-4.82 2.24A3.002 3.002 0 0 1 3 20a3 3 0 0 1-3-3c0-1.31.83-2.42 2-2.83V5.83A2.99 2.99 0 0 1 0 3a3 3 0 0 1 6 0c0 1.31-.83 2.42-2 2.83v5.29C4.88 10.47 6.16 10 8 10c2.67 0 3.56-1.34 3.85-2.23A3.005 3.005 0 0 1 10 5a3 3 0 0 1 6 0c0 1.34-.88 2.5-2.09 2.86C13.65 9.29 12.68 12 9 12m-6 4a1 1 0 1 0 0 2 1 1 0 0 0 0-2M3 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2m10 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2" fill="#988FBD" /></svg>

                    </span> <?php esc_html_e("Sources", "embedpress"); ?></a>
                <div class="tab-button-section">
                    <ul class="source-tab">
                        <!-- <li class="tab-button active" data-tab="all"><img class="source-image" src="<?php echo esc_url(EMBEDPRESS_SETTINGS_ASSETS_URL . 'img/sources/code.svg'); ?>" alt=""> <?php echo esc_html__('All', 'embedpress'); ?></li> -->
                        <li class="tab-button" data-tab="audio"><img class="source-image" src="<?php echo esc_url(EMBEDPRESS_SETTINGS_ASSETS_URL . 'img/sources/audio.svg'); ?>" alt=""><?php echo esc_html__('Audio', 'embedpress'); ?></li>
                        <li class="tab-button" data-tab="video"><img class="source-image" src="<?php echo esc_url(EMBEDPRESS_SETTINGS_ASSETS_URL . 'img/sources/video.svg'); ?>" alt=""><?php echo esc_html__('Video', 'embedpress'); ?></li>
                        <li class="tab-button" data-tab="image"><img class="source-image" src="<?php echo esc_url(EMBEDPRESS_SETTINGS_ASSETS_URL . 'img/sources/image.svg'); ?>" alt=""><?php echo esc_html__('Image', 'embedpress'); ?></li>
                        <li class="tab-button" data-tab="pdf"><img class="source-image" src="<?php echo esc_url(EMBEDPRESS_SETTINGS_ASSETS_URL . 'img/sources/pdf.svg'); ?>" alt=""><?php echo esc_html__('PDF & Docs', 'embedpress'); ?></li>
                        <li class="tab-button" data-tab="social"><img class="source-image" src="<?php echo esc_url(EMBEDPRESS_SETTINGS_ASSETS_URL . 'img/sources/social.svg'); ?>" alt=""><?php echo esc_html__('Social', 'embedpress'); ?></li>
                        <li class="tab-button" data-tab="google"><img class="source-image" src="<?php echo esc_url(EMBEDPRESS_SETTINGS_ASSETS_URL . 'img/sources/google.svg'); ?>" alt=""><?php echo esc_html__('Google Sources', 'embedpress'); ?></li>
                        <li class="tab-button" data-tab="microsoft"><img class="source-image" src="<?php echo esc_url(EMBEDPRESS_SETTINGS_ASSETS_URL . 'img/sources/ms.svg'); ?>" alt=""><?php echo esc_html__('Microsoft Sources', 'embedpress'); ?></li>
                        <li class="tab-button" data-tab="stream"><img class="source-image" src="<?php echo esc_url(EMBEDPRESS_SETTINGS_ASSETS_URL . 'img/sources/stream.svg'); ?>" alt=""><?php echo esc_html__('Live Stream', 'embedpress'); ?></li>
                    </ul>


                </div>
                <?php do_action('ep_after_element_item'); ?>
            </li>
            <li class="sidebar__item <?php echo 'elements' === $template ? 'show' : ''; ?>">
                <?php do_action('ep_before_element_item'); ?>
                <a href="<?php echo esc_url($ep_page . '&page_type=elements'); ?>" class="sidebar__link elements <?php echo 'elements' === $template ? 'active' : ''; ?>"><span>

                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 1 1 5l8 4 8-4zM1 9l8 4 8-4M1 13l8 4 8-4" stroke="#988FBD" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>


                    </span> <?php esc_html_e("Elements", "embedpress"); ?></a>
                <?php do_action('ep_after_element_item'); ?>
            </li>
            <?php do_action('ep_before_branding_menu'); ?>
            <li class="sidebar__item <?php echo 'custom-logo' === $template ? 'show' : ''; ?>">
                <a href="<?php echo esc_url($ep_page . '&page_type=custom-logo'); ?>" class="sidebar__link branding <?php echo 'custom-logo' === $template ? 'active' : ''; ?>"><span>
                        <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 15.008V6.99a1.98 1.98 0 0 0-1-1.717l-7-4.008a2.02 2.02 0 0 0-2 0L2 5.273c-.619.355-1 1.01-1 1.718v8.018c0 .709.381 1.363 1 1.717l7 4.008a2.02 2.02 0 0 0 2 0l7-4.008c.619-.355 1-1.01 1-1.718M10 21V11m0 0 8.73-5.04m-17.46 0L10 11" stroke="#988FBD" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
                    </span> Branding</a>
            </li>
            <?php do_action('ep_before_branding_menu'); ?>


            <li class="sidebar__item <?php echo 'ads' === $template ? 'show' : ''; ?>">
                <a href="<?php echo esc_url($ep_page . '&page_type=ads'); ?>" class="sidebar__link ads-icon <?php echo 'ads' === $template ? 'active' : ''; ?>">
                    <span>
                        <svg width="20" height="24.545" viewBox="0 0 20 24.545" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.457 4.993H6.487a.474.474 0 0 0 0 .948h10.97c.4 0 .725.325.725.725v9.718h-3.146a.475.475 0 0 0 0 .947h3.146v.222c0 .4-.325.725-.725.725H3.627a.475.475 0 0 0-.305.112l-2.376 2V6.665c0-.4.325-.725.725-.725h1.026a.474.474 0 0 0 0-.948H1.673A1.676 1.676 0 0 0 0 6.665v14.742a.473.473 0 0 0 .778.363l3.023-2.547h13.656a1.674 1.674 0 0 0 1.671-1.671V6.665a1.673 1.673 0 0 0-1.673-1.672l.002-.001Zm-7.893-1.68a.473.473 0 0 0 .475-.474V.473a.475.475 0 0 0-.948 0v2.366a.473.473 0 0 0 .474.473Zm3.569.193a.471.471 0 0 0 .335-.138l1.655-1.655a.475.475 0 0 0-.334-.809.474.474 0 0 0-.335.139l-1.655 1.655a.473.473 0 0 0 .335.808Zm-7.472-.142a.473.473 0 1 0 .669-.669L4.675 1.04a.473.473 0 1 0-.669.669l1.655 1.655ZM9.564 20.93a.473.473 0 0 0-.474.474v2.365a.474.474 0 1 0 .947 0v-2.365a.473.473 0 0 0-.474-.473Zm3.903-.054a.475.475 0 0 0-.669.67l1.656 1.656a.472.472 0 0 0 .669 0 .475.475 0 0 0 0-.671l-1.656-1.655Z" fill="#5B4E96" />
                            <path d="M4.183 5.132a.475.475 0 0 0-.14.335.475.475 0 0 0 .479.473.473.473 0 0 0 .339-.807.486.486 0 0 0-.678 0Zm1.423 15.747-1.679 1.655a.473.473 0 0 0-.105.515.473.473 0 0 0 .26.256.483.483 0 0 0 .523-.103l1.679-1.655a.47.47 0 0 0 0-.669.484.484 0 0 0-.678 0Zm8.372-9.058a2.236 2.236 0 0 0-.669-1.591 2.3 2.3 0 0 0-1.613-.659h-1.041a.485.485 0 0 0-.445.293.468.468 0 0 0-.036.182v4.166a.468.468 0 0 0 .297.438.466.466 0 0 0 .185.036h1.042a2.3 2.3 0 0 0 1.613-.66 2.236 2.236 0 0 0 .669-1.591v-.615Zm-.96.613c0 .719-.593 1.304-1.322 1.304h-.562v-3.22h.562c.729 0 1.322.585 1.322 1.304v.613Zm-7.435.435-.405 1.191a.467.467 0 0 0 .139.507.486.486 0 0 0 .53.067.476.476 0 0 0 .242-.273l.3-.879h1.334l.3.878a.473.473 0 0 0 .455.323.479.479 0 0 0 .429-.263.469.469 0 0 0 .025-.362L7.51 9.891a.473.473 0 0 0-.455-.322.484.484 0 0 0-.455.322l-1.018 2.977-.001.001Zm1.47-1.341.345 1.007h-.689l.343-1.007Zm5.824 4.993a.475.475 0 0 0-.14.335.475.475 0 0 0 .479.473.485.485 0 0 0 .442-.292.468.468 0 0 0-.103-.515.487.487 0 0 0-.678 0Z" fill="#5B4E96" /></svg>
                    </span> <?php echo esc_html__('Custom Ads', 'embedpress'); ?></a>
            </li>

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
                <a href="<?php echo esc_url($ep_page . '&page_type=go-premium'); ?>" class="sidebar__link <?php echo 'license' === $template ? 'active' : ''; ?>" style="margin-top: 12px;">

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