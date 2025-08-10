<?php
/*
 * Main settings page
 *  All undefined vars comes from 'render_settings_page' method
 * */

// Check if main banner is dismissed
$is_main_banner_dismissed = get_option('embedpress_main_banner_dismissed', false);
?>
<div class="template__wrapper background__liteGrey p30 pb50">



    <div class="embedpress__container">
        <?php include_once EMBEDPRESS_SETTINGS_PATH . 'templates/partials/logo.php'; ?>


        <!-- added leon  -->
        <?php if (!$is_main_banner_dismissed && !apply_filters('embedpress/is_allow_rander', false)): ?>
            <div class="embedPress-introduction-panel-wrapper">
                <div class=" embedPress-introduction-left-panel">
                    <div class=" embedPress-text-wrapper">
                        <h2 class="embedpress-font-l embedpress-font-family-dmsans embedPress-left-panel-header"><?php esc_html_e('Ready to publish your first embed?', 'embedpress'); ?></h2>
                        <div class="embedpress-progress-container">
                            <div class="embedpress-progress-bar" style="--progress: 0.4;">
                                <span></span>
                            </div>
                        </div>
                        <h3 class="embedpress-font-m embedpress-font-family-dmsans embedpress-follow-steps-header "><?php esc_html_e('Follow these 3 steps to get started:', 'embedpress'); ?></h3>
                        <ol class="embedpress-follow-steps-list ">
                            <li class="embedpress-font-m embedpress-font-family-dmsans embedpress-follow-steps-list-item">Type “/” followed by the content type to find the respective EmbedPress block.</li>
                            <li class="embedpress-font-m embedpress-font-family-dmsans embedpress-follow-steps-list-item">Paste your link or upload your file in the block.</li>
                            <li class="embedpress-font-m embedpress-font-family-dmsans embedpress-follow-steps-list-item">Hit publish on the page - that’s it!</li>
                        </ol>
                    </div>
                    <div class="embedPess-img-wrapper">
                        <div class="embedPress-img-wrapper-left">

                            <img src="<?php echo esc_url(EMBEDPRESS_SETTINGS_ASSETS_URL . 'img/bnr-img-1.png'); ?>" alt="<?php esc_attr_e('Banner Image 1', 'embedpress'); ?>">
                        </div>
                        <div class="embedPress-img-wrapper-right">

                            <img src="<?php echo esc_url(EMBEDPRESS_SETTINGS_ASSETS_URL . 'img/bnr-img-2.png'); ?>" alt="<?php esc_attr_e('Banner Image 2', 'embedpress'); ?>">
                        </div>
                    </div>
                </div>
                <div class="embedPress-introduction-right-panel">
                    <div class="embedpress-flex embedpress-item-center embedpress-justify-between embedPress-text-header-wrapper">
                        <h2 class="embedpress-font-l embedpress-font-family-dmsans embedPress-right-panel-header"><?php esc_html_e('Unlock ads, branding, and control!', 'embedpress'); ?></h2>
                        <button class="embedpress-font-m embedpress-font-family-dmsans embedpress-cancel-button"><?php esc_html_e('Dismiss', 'embedpress'); ?></button>
                    </div>

                    <div class="embedpress-flex">
                        <div class="embedpress-left-content">
                            <ul class="embedpress-premium-features-list">
                                <li class="embedpress-font-m embedpress-font-family-dmsans embedpress-premium-features-list-item"><?php esc_html_e('Add your own logo', 'embedpress'); ?></li>
                                <li class="embedpress-font-m embedpress-font-family-dmsans embedpress-premium-features-list-item"><?php esc_html_e('Lock content for members', 'embedpress'); ?></li>
                                <li class="embedpress-font-m embedpress-font-family-dmsans embedpress-premium-features-list-item"><?php esc_html_e('Apply lazy loading', 'embedpress'); ?></li>
                                <li class="embedpress-font-m embedpress-font-family-dmsans embedpress-premium-features-list-item"><?php esc_html_e('Control PDF usage', 'embedpress'); ?></li>
                                <li class="embedpress-font-m embedpress-font-family-dmsans embedpress-premium-features-list-item"><?php esc_html_e('Control video playback', 'embedpress'); ?></li>
                                <li class="embedpress-font-m embedpress-font-family-dmsans embedpress-premium-features-list-item"><?php esc_html_e('Show custom ads in embeds', 'embedpress'); ?></li>
                            </ul>
                            <a href="<?php echo esc_url('https://embedpress.com/embedpress-free-vs-pro/'); ?>" target="_blank" class="embedpress-font-m embedpress-font-family-dmsans embedpress-btn embdpress-compare-btn"><?php esc_html_e('Compare Free vs Premium', 'embedpress'); ?></a>
                        </div>
                        <div class="embedpress-right-content">
                            <div class="embedPess-img-wrapper">
                                <img src="<?php echo esc_url(EMBEDPRESS_SETTINGS_ASSETS_URL . 'img/right-content-img.png'); ?>" alt="<?php esc_attr_e('Right Content Image', 'embedpress'); ?>">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        <?php else: ?>
            <?php if ((isset($_GET['page_type']) && $_GET['page_type'] === 'general') || (!isset($_GET['page_type']) && $_GET['page'] === 'embedpress')) : ?>
                <div class="intro-banner">
                    <div class="video-container">
                        <div class="img-box">
                            <img src="<?php echo esc_url(EMBEDPRESS_SETTINGS_ASSETS_URL . 'img/popup-preview.png'); ?>" alt=""> <!-- video play imag -->
                            <button class="video-play_btn">
                                <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.7325 7.18351C17.5892 8.19319 17.5892 10.8068 15.7325 11.8165L4.52204 17.9127C2.71756 18.894 0.5 17.6168 0.5 15.5962V3.40379C0.5 1.38322 2.71756 0.106017 4.52203 1.08729L15.7325 7.18351Z" fill="white" />
                                </svg>

                            </button> <!-- video play btn -->
                        </div>


                    </div>
                    <div class="intro-text_wrapper">
                        <h4 class="intro-header"><?php echo esc_html__('Get Started with EmbedPress', 'embedpress'); ?></h4>
                        <p class="intro-sub_header"><?php echo esc_html__('All-in-one WordPress embedding solution that makes storytelling easy with one-click embeds from videos, social feeds, maps, PDFs, 3D flipbooks, and more from any sources. It also offers a custom player, options to display custom ads, content protection, and much more.
', 'embedpress'); ?></p>
                        <a href="https://embedpress.com/documentation/" target="_blank" class="intro-docu_btn"><?php echo esc_html__('Documentation', 'embedpress'); ?></a>
                    </div>
                    <div class="popup-video-wrap"></div>

                </div>
            <?php endif; ?>
        <?php endif; ?>



        <div class="embedpress-body mb30">
            <?php include_once EMBEDPRESS_SETTINGS_PATH . 'templates/partials/sidebar.php'; ?>
            <div class="embedpress-content">
                <?php
                $template_file = apply_filters('embedpress_settings_template_path', EMBEDPRESS_SETTINGS_PATH . "templates/{$template}.php", $template);
                if (file_exists($template_file)) {
                    include_once $template_file;
                }
                if ('license' != $template) {
                    include_once EMBEDPRESS_SETTINGS_PATH . 'templates/partials/toast-message.php';
                }
                do_action('embedpress_settings_template', $template);

                ?>
            </div>
        </div>
        <?php include_once EMBEDPRESS_SETTINGS_PATH . 'templates/partials/footer.php'; ?>
    </div>

    <div class="sponsored-floating_quick-links_wrapper">
        <div class="sponsored-floating_quick-links">
            <a class="sponsored-link_list-item floating-item item-1" href="<?php echo esc_url('https://embedpress.com/#pricing'); ?>" target="_blank">
                <span class="sponsored-link_name sponsored-items--details"><?php echo esc_html__('Unlock pro Features', 'embedpress'); ?></span>
                <span class="sponsored-link_icon sponsored-items--icon">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M15.6757 4.94278C14.8901 3.74109 13.1072 3.74107 12.3217 4.94278L8.35572 11.0097L5.32427 9.29218C3.80555 8.4317 1.97952 9.7802 2.39091 11.4584L4.45041 19.8596C4.54313 20.238 4.88661 20.5045 5.28146 20.5045H22.7159C23.1108 20.5045 23.4543 20.238 23.547 19.8596L25.6064 11.4584C26.0179 9.78018 24.1919 8.43172 22.6731 9.29218L19.6416 11.0097L15.6757 4.94278ZM14.2382 5.85547C14.1261 5.6838 13.8713 5.6838 13.7592 5.85546L9.35296 12.5957C9.10633 12.973 8.60292 13.0936 8.20813 12.8699L4.47207 10.7532C4.25511 10.6303 3.99424 10.8229 4.05302 11.0626L5.95446 18.8192H22.043L23.9444 11.0626C24.0031 10.8229 23.7423 10.6303 23.5253 10.7532L19.7892 12.8699C19.3944 13.0936 18.8911 12.973 18.6445 12.5957L14.2382 5.85547Z" fill="#5B4E96" />
                        <path d="M5.01614 21.9583C4.45494 21.9583 4 22.406 4 22.9583C4 23.5105 4.45494 23.9583 5.01614 23.9583H23.9839C24.5451 23.9583 25 23.5105 25 22.9583C25 22.406 24.5451 21.9583 23.9839 21.9583H5.01614Z" fill="#5B4E96" />
                    </svg>
                </span>
            </a>

            <a class="sponsored-link_list-item floating-item item-2" href="<?php echo esc_url('https://embedpress.com/support/'); ?>" target="_blank">
                <span class="sponsored-link_name sponsored-items--details"><?php echo esc_html__('Get Support', 'embedpress'); ?></span>
                <span class="sponsored-link_icon sponsored-items--icon">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M16.4216 24.1172C16.4216 23.2877 15.7491 22.6152 14.9196 22.6152H13.0804C12.6821 22.6152 12.3 22.7735 12.0184 23.0551C11.7367 23.3368 11.5784 23.7188 11.5784 24.1172C11.5784 24.9467 12.2509 25.6192 13.0804 25.6192H14.9196C15.7491 25.6192 16.4216 24.9467 16.4216 24.1172ZM5.15755 20.2442C5.40842 20.2634 5.71194 20.2744 6.01681 20.2566C6.17923 21.0802 6.58273 21.8442 7.18503 22.4466C7.98462 23.2461 9.06908 23.6953 10.1998 23.6953H10.7729C10.7477 23.8336 10.7347 23.9747 10.7347 24.1172C10.7347 24.2612 10.7477 24.4023 10.7726 24.5391H10.1998C8.8453 24.5391 7.5462 24.001 6.58841 23.0432C5.8243 22.279 5.32728 21.2977 5.15755 20.2442ZM4.72836 19.3464C4.06222 19.2341 3.44234 18.9174 2.95845 18.4335C2.34477 17.8198 2 16.9875 2 16.1196V14.1254C2 13.2575 2.34477 12.4251 2.95845 11.8114C3.57214 11.1977 4.4045 10.8529 5.27239 10.8529H5.49022C5.83841 6.45811 9.51538 3 14 3C18.4846 3 22.1616 6.45811 22.5098 10.8529H22.7276C23.5955 10.8529 24.4279 11.1977 25.0415 11.8114C25.6552 12.4251 26 13.2575 26 14.1254V16.1196C26 16.9875 25.6552 17.8198 25.0415 18.4335C24.4279 19.0472 23.5955 19.392 22.7276 19.392H21.7619C21.3614 19.392 21.0368 19.0673 21.0368 18.6668V11.5368C21.0368 7.65047 17.8863 4.5 14 4.5C10.1137 4.5 6.96322 7.65047 6.96322 11.5368V18.6668C6.96322 18.9496 6.80136 19.1946 6.5652 19.3142C5.91514 19.5398 4.907 19.3766 4.72836 19.3464Z" fill="#5B4E96" />
                    </svg>

                </span>
            </a>

            <a class="sponsored-link_list-item floating-item item-3" href="<?php echo esc_url('https://wpdeveloper.com/support/new-ticket/'); ?>" target="_blank">
                <span class="sponsored-link_name sponsored-items--details"><?php echo esc_html__('Suggest a Feature', 'embedpress'); ?></span>
                <span class="sponsored-link_icon sponsored-items--icon">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_719_936)">
                            <path d="M7.26075 4.52638C7.16517 4.52638 7.07212 4.49396 6.9976 4.43417L4.89233 2.74996C4.71086 2.60469 4.68139 2.33943 4.82665 2.15796C4.97191 1.97648 5.23717 1.94701 5.41865 2.09227L7.52391 3.77648C7.6637 3.88806 7.7176 4.07585 7.65823 4.24469C7.59886 4.41354 7.4397 4.52638 7.26075 4.52638Z" fill="white" />
                            <path d="M20.7377 4.52638C20.5588 4.52638 20.3996 4.41354 20.3403 4.24469C20.2809 4.07585 20.3348 3.88806 20.4746 3.77648L22.5798 2.09227C22.7613 1.94701 23.0266 1.97648 23.1718 2.15796C23.3171 2.33943 23.2876 2.60469 23.1062 2.74996L21.0009 4.43417C20.9264 4.49396 20.8333 4.52638 20.7377 4.52638Z" fill="white" />
                            <path d="M22.8419 7.05274H20.2524C20.5438 9.07716 19.8192 11.1151 18.3156 12.5012C17.4238 13.3639 16.9282 14.5572 16.9472 15.798V18.4212C16.9446 19.1871 16.4255 19.8548 15.684 20.0464V20.5264C15.684 20.7588 15.4954 20.9475 15.263 20.9475C15.0305 20.9475 14.8419 20.7588 14.8419 20.5264V20.1054H13.1577V20.5264C13.1577 20.7588 12.9691 20.9475 12.7366 20.9475C12.5042 20.9475 12.3156 20.7588 12.3156 20.5264V20.0464C11.5741 19.8548 11.055 19.1871 11.0524 18.4212V15.8696C11.071 14.5955 10.5674 13.3694 9.65874 12.4759C8.25074 11.1479 7.53158 9.24559 7.70927 7.31801C7.71769 7.22959 7.73453 7.14116 7.74716 7.05274H5.15769C4.46085 7.05485 3.89664 7.61906 3.89453 8.3159V19.6843C3.89664 20.3812 4.46085 20.9454 5.15769 20.9475H9.36822C9.76527 20.95 10.1383 21.137 10.3787 21.4527L13.6882 25.8654C13.7745 25.9479 13.8903 25.9925 14.0095 25.9892C14.1291 25.9858 14.2419 25.9353 14.324 25.8485L17.6208 21.4527C17.8613 21.137 18.2343 20.95 18.6314 20.9475H22.8419C23.5387 20.9454 24.103 20.3812 24.1051 19.6843V8.3159C24.103 7.61906 23.5387 7.05485 22.8419 7.05274ZM5.15769 8.3159H6.42085C6.65327 8.3159 6.8419 8.50453 6.8419 8.73695C6.8419 8.96937 6.65327 9.15801 6.42085 9.15801H5.15769C4.92527 9.15801 4.73664 8.96937 4.73664 8.73695C4.73664 8.50453 4.92527 8.3159 5.15769 8.3159ZM7.524 14.9601L5.41874 16.6443C5.34548 16.705 5.25285 16.7378 5.15769 16.737C5.02969 16.7365 4.90885 16.6776 4.82927 16.577C4.75853 16.4906 4.72569 16.3791 4.73832 16.2679C4.75095 16.1567 4.80822 16.0557 4.89664 15.9875L7.0019 14.3033C7.11769 14.1942 7.28485 14.1593 7.43432 14.2136C7.58379 14.2679 7.6899 14.4014 7.70927 14.5593C7.72779 14.7172 7.65622 14.8721 7.524 14.9601ZM23.1703 16.577C23.0907 16.6776 22.9699 16.7365 22.8419 16.737C22.7467 16.7378 22.6541 16.705 22.5808 16.6443L20.4756 14.9601C20.3164 14.8098 20.2987 14.5631 20.4352 14.3921C20.5712 14.2207 20.8158 14.1824 20.9977 14.3033L23.103 15.9875C23.1914 16.0557 23.2486 16.1567 23.2613 16.2679C23.2739 16.3791 23.2411 16.4906 23.1703 16.577ZM22.8419 9.15801H21.5787C21.3463 9.15801 21.1577 8.96937 21.1577 8.73695C21.1577 8.50453 21.3463 8.3159 21.5787 8.3159H22.8419C23.0743 8.3159 23.263 8.50453 23.263 8.73695C23.263 8.96937 23.0743 9.15801 22.8419 9.15801ZM17.7766 3.93274C16.3636 2.56811 14.327 2.0658 12.4415 2.61653C10.556 3.16727 9.11011 4.68727 8.65411 6.59843C8.19811 8.50959 8.8019 10.518 10.2356 11.8612C11.3139 12.9138 11.9135 14.3626 11.8945 15.8696V16.3159H16.1051V15.798C16.0861 14.3243 16.6773 12.9087 17.7387 11.8864C18.8385 10.8586 19.4663 9.42285 19.4735 7.91759C19.4806 6.41232 18.8667 4.97064 17.7766 3.93274ZM12.4756 4.49274C12.4587 4.50116 10.9261 5.16222 10.623 6.71169C10.5846 6.90959 10.4116 7.05232 10.2103 7.05274C10.1834 7.0519 10.1568 7.04937 10.1303 7.04432C10.0208 7.02369 9.924 6.95969 9.86127 6.86748C9.79853 6.77527 9.77579 6.66116 9.79769 6.55169C10.0933 5.28853 10.967 4.23843 12.1556 3.71801C12.2971 3.64306 12.4688 3.65485 12.599 3.74832C12.7291 3.8418 12.7947 4.00095 12.7686 4.15885C12.7421 4.31674 12.6288 4.44601 12.4756 4.49274ZM13.5787 15.0527C13.5787 15.2852 13.3901 15.4738 13.1577 15.4738C12.9253 15.4738 12.7366 15.2852 12.7366 15.0527V13.7896C12.7366 13.5572 12.9253 13.3685 13.1577 13.3685C13.3901 13.3685 13.5787 13.5572 13.5787 13.7896V15.0527ZM13.5787 11.6843C13.5787 11.9167 13.3901 12.1054 13.1577 12.1054C12.9253 12.1054 12.7366 11.9167 12.7366 11.6843V11.2633C12.7366 11.0308 12.9253 10.8422 13.1577 10.8422C13.3901 10.8422 13.5787 11.0308 13.5787 11.2633V11.6843ZM15.263 15.0527C15.263 15.2852 15.0743 15.4738 14.8419 15.4738C14.6095 15.4738 14.4208 15.2852 14.4208 15.0527V13.7896C14.4208 13.5572 14.6095 13.3685 14.8419 13.3685C15.0743 13.3685 15.263 13.5572 15.263 13.7896V15.0527ZM15.263 11.6843C15.263 11.9167 15.0743 12.1054 14.8419 12.1054C14.6095 12.1054 14.4208 11.9167 14.4208 11.6843V11.2633C14.4208 11.0308 14.6095 10.8422 14.8419 10.8422C15.0743 10.8422 15.263 11.0308 15.263 11.2633V11.6843Z" fill="#5B4E96" />
                            <path d="M11.8945 17.158V18.4211C11.8958 18.8855 12.2722 19.262 12.7366 19.2632H15.263C15.7274 19.262 16.1038 18.8855 16.1051 18.4211V17.158H11.8945Z" fill="white" />
                        </g>
                        <defs>
                            <clipPath id="clip0_719_936">
                                <rect width="24" height="24" fill="white" transform="translate(2 2)" />
                            </clipPath>
                        </defs>
                    </svg>


                </span>
            </a>

            <a class="sponsored-link_list-item floating-item item-4" href="<?php echo esc_url('https://www.facebook.com/groups/wpdeveloper.net'); ?>" target="_blank">
                <span class="sponsored-link_name sponsored-items--details"><?php echo esc_html__('Join Our Community', 'embedpress'); ?></span>
                <span class="sponsored-link_icon sponsored-items--icon">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.3016 13.1188H21.0563C25.2235 13.0391 26.2313 7.44223 22.4485 5.86723C18.7547 4.4516 15.6891 8.85785 18.2203 11.8204C17.9157 12.2516 17.6063 12.6875 17.3016 13.1188ZM22.7719 8.67504C23.6766 8.69848 23.6766 10.025 22.7719 10.0485C21.8625 10.025 21.8625 8.69848 22.7719 8.67504ZM21.061 8.67504C21.9657 8.69848 21.9657 10.025 21.061 10.0485C20.1516 10.025 20.1516 8.69848 21.061 8.67504ZM19.3453 8.67504C20.25 8.69848 20.25 10.025 19.3453 10.0485C18.4407 10.025 18.4407 8.69848 19.3453 8.67504ZM6.71722 12.5188H11.4C11.0203 11.9797 10.636 11.4407 10.2563 10.9016C13.4297 7.21254 9.56253 1.69535 4.97815 3.47191C0.257841 5.41723 1.52815 12.4344 6.71722 12.5188ZM8.85472 7.0391C9.90003 7.06723 9.90003 8.59535 8.85472 8.62348C7.8094 8.59066 7.8094 7.06723 8.85472 7.0391ZM6.71722 7.0391C7.76253 7.06723 7.76253 8.59535 6.71722 8.62348C5.67659 8.59535 5.6719 7.06254 6.71722 7.0391ZM4.57972 7.0391C5.62034 7.06723 5.62034 8.59535 4.57972 8.62348C3.5344 8.59066 3.5344 7.06723 4.57972 7.0391ZM20.0578 23.3141C20.0578 24.1719 19.3641 24.8657 18.5063 24.8657H9.70784C8.85003 24.8657 8.15628 24.1719 8.15628 23.3141V22.4235C8.15628 20.0329 9.9094 18.0172 12.2438 17.661C13.2188 18.5844 15 18.5844 15.9703 17.661C18.3094 18.0172 20.0578 20.0329 20.0578 22.4235V23.3141ZM14.1047 12.35C15.4313 12.35 16.5094 13.4282 16.5094 14.7547C16.5375 16.7985 14.011 17.9188 12.5203 16.5594C10.8703 15.1391 11.8969 12.336 14.1047 12.35ZM8.36722 24.8703H3.52972C2.8219 24.8703 2.25472 24.2985 2.25472 23.5954V22.8594C2.25472 20.8719 3.71253 19.2266 5.61565 18.9407C6.41253 19.7047 7.8844 19.7047 8.68128 18.9407C8.76097 18.9547 8.83597 18.9688 8.91097 18.9875C8.09534 19.9485 7.64534 21.1578 7.64534 22.4282V23.3188C7.65472 23.9375 7.93128 24.4953 8.36722 24.8703ZM7.15315 14.5672C8.24534 14.5672 9.13128 15.4532 9.13128 16.5453C9.15472 18.2282 7.07815 19.1516 5.85003 18.0313C4.49065 16.8641 5.3344 14.5579 7.15315 14.5672ZM25.9547 22.8594V23.5954C25.9547 24.3032 25.3828 24.8703 24.675 24.8703H19.8422C20.2782 24.4953 20.5547 23.9375 20.5547 23.3188V22.4282C20.5547 21.1578 20.1047 19.9438 19.2891 18.9828C19.3641 18.9688 19.4438 18.95 19.5188 18.9407C20.3203 19.7047 21.7875 19.7047 22.5844 18.9407C24.4969 19.2313 25.9547 20.8719 25.9547 22.8594ZM21.0563 14.5672C22.1485 14.5672 23.0344 15.4532 23.0344 16.5453C23.0578 18.2282 20.9813 19.1516 19.7532 18.0313C18.3985 16.8641 19.2422 14.5579 21.0563 14.5672Z" fill="#5B4E96" />
                    </svg>


                </span>
            </a>
        </div>

        <!-- btn link  position -->

    </div>


</div>

<div class="sponsored-quick_link">

    <a class="sponsored-link_bg">
        <span class="sponsored-floating_quick-icon active-icon sponsored-link_active">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.71133 0H0V6.66882H1.71133V0Z" fill="#988FBD" />
                <path d="M0 0.0154818L0 1.72656L6.6698 1.72656L6.6698 0.0154818L0 0.0154818Z" fill="#988FBD" />
                <path d="M34.2887 35.9998L36 35.9998L36 29.3309L34.2887 29.3309L34.2887 35.9998Z" fill="#988FBD" />
                <path d="M36 35.9943L36 34.2832L29.3302 34.2832L29.3302 35.9943L36 35.9943Z" fill="#988FBD" />
                <path d="M13.7821 15.5751L11.0615 14.7854L8.692 21.6297C8.60424 21.8491 8.73588 22.0685 8.9114 22.1123L11.5003 22.9459C11.6759 22.9898 11.8953 22.9021 11.983 22.7266L14.2209 16.4087C14.3087 16.0139 14.1331 15.6629 13.7821 15.5751Z" fill="#5B4E96" />
                <path d="M7.94805 32.2472C5.09583 31.9401 2.59466 30.229 1.19049 27.7721C0.0496015 25.71 -0.213678 23.2969 0.400645 21.0155C1.05885 18.734 2.55078 16.8036 4.65703 15.6629C4.83255 15.5751 5.00807 15.4874 5.18359 15.3996C6.67552 14.6976 8.38685 14.3905 10.0543 14.6099C10.537 14.6538 10.9758 14.7415 11.4146 14.8731L13.7402 15.5751C14.0913 15.6629 14.2668 16.0577 14.1352 16.3649L12.9504 19.6993L10.3615 18.8657C10.0982 18.7779 9.79102 18.734 9.52773 18.6902C8.60625 18.6024 7.72864 18.734 6.89492 19.1289C6.80716 19.1728 6.7194 19.2166 6.63164 19.2605C5.53464 19.8748 4.70091 20.8839 4.34986 22.1123C3.99882 23.3408 4.13047 24.6131 4.74479 25.7539C5.49076 27.0701 6.85104 27.9914 8.38685 28.1669C9.26446 28.2547 10.1859 28.123 10.9758 27.7282C11.0635 27.6843 11.1513 27.6404 11.2391 27.5966C12.2922 27.0262 13.1259 25.9732 13.5208 24.7448L18.3915 10.8806C19.0059 8.68693 20.5417 6.80035 22.604 5.65963C22.7796 5.57188 22.9551 5.48414 23.1306 5.39639C24.6225 4.69441 26.3339 4.38729 27.9574 4.60666C30.8097 4.91377 33.3108 6.62485 34.715 9.08179C37.0845 13.3376 35.5487 18.7779 31.2485 21.191C31.0729 21.2787 30.8974 21.3665 30.7219 21.4542C29.23 22.1562 27.5625 22.4633 25.8951 22.2439C25.4124 22.2001 24.9736 22.1123 24.5348 21.9807L22.6918 21.4542C22.5163 21.4103 22.4285 21.2348 22.4724 21.0594L23.6572 17.7688C23.7011 17.5933 23.8766 17.5056 24.0521 17.5494L25.544 17.9882H25.5879C25.8512 18.0759 26.1145 18.1198 26.4216 18.1637C27.3431 18.2514 28.2207 18.1198 29.0544 17.7249C29.1422 17.6811 29.23 17.6372 29.3177 17.5933C31.6434 16.321 32.4771 13.3814 31.2046 11.1C30.4586 9.78377 29.0983 8.86242 27.5625 8.68693C26.6849 8.59918 25.7634 8.7308 24.9736 9.12566C24.8858 9.16954 24.7981 9.21341 24.7103 9.25729C23.7011 9.82765 22.999 10.7051 22.4285 12.1091V12.153L17.5578 25.9732C16.8996 28.1669 15.3638 30.0535 13.3453 31.1942C13.1698 31.282 12.9943 31.3697 12.8188 31.4575C11.2829 32.1594 9.6155 32.4666 7.94805 32.2472Z" fill="#5B4E96" />
            </svg>
        </span>
        <span class="sponsored-floating_quick-icon close-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 8L8 24" stroke="#5B4E96" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M8 8L24 24" stroke="#5B4E96" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

        </span>
    </a>
</div>