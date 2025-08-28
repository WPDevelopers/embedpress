<?php
/*
 * Hub Settings page
 *  All undefined vars comes from 'render_settings_page' method
 */

// Check pro plugin status and license

// Get comprehensive license information
$license_info = \EmbedPress\Includes\Classes\Helper::get_license_info();
$is_pro_active = $license_info['is_pro_active'];
$license_status = $license_info['license_status'];
$license_key = $license_info['license_key'];
$is_features_enabled = $license_info['is_features_enabled'];
$status_message = $license_info['status_message'];

$is_banner_dismissed = get_option('embedpress_hub_banner_dismissed', false);
$is_popup_dismissed = get_option('embedpress_hub_popup_dismissed', false);

// Get global brand settings
$global_brand_settings = get_option(EMBEDPRESS_PLG_NAME . ':global_brand', []);
$global_brand_logo_url = isset($global_brand_settings['logo_url']) ? $global_brand_settings['logo_url'] : '';
$global_brand_logo_id = isset($global_brand_settings['logo_id']) ? $global_brand_settings['logo_id'] : '';

// Dynamic username for personalization
$current_user = wp_get_current_user();
$username = $current_user->display_name ? $current_user->display_name : $current_user->user_login;


?>

<section class="embedpress-hub-section">
    <div class="embedpress-banner-wrapper <?php echo $is_pro_active ? 'pro-plugin-active' : ''; ?>">
        <?php if (!$is_pro_active): ?>
            <!-- Free Version Banner -->
            <div class="embedpress-banner embedpress-banner-active">
                <div class="embedpress-row">
                    <div class=" embdpress-col-6 ">
                        <div class="embedpress-flex embedpress-item-center embedpress-banner-box embedpress-plan-wrapper">
                            <div class="embedpress-left-content">
                                <div class="embedpress-flex embedpress-mb-16 embedpress-item-center">
                                    <div class="embedpress-line-height-0 embedpress-mr-4 banner-icon">
                                        <img src="<?php echo esc_url(EMBEDPRESS_URL_ASSETS . 'images/icons/lock.svg'); ?>" alt="<?php esc_attr_e('Lock Icon', 'embedpress'); ?>">
                                    </div>

                                    <h2 class="embedpress-font-xl embedpress-font-family-dmsans embedpress-banner-header"><?php esc_html_e('Free Plan', 'embedpress'); ?></h2>
                                </div>
                                <p class="embedpress-font-m embedpress-font-family-dmsans embedpress-banner-sub-header">
                                    You’re using the free version with access to 150+ sources, basic updates, and forum support. <a href="<?php echo esc_url('https://wpdeveloper.com/in/upgrade-embedpress'); ?>" target="_blank" class="embdpress-hilight-text">View upgrades</a>.
                                </p>
                            </div>
                            <div class="embedpress-right-content">
                                <div class="embedpress-img-wrapper">
                                    <img src="<?php echo esc_url(EMBEDPRESS_URL_ASSETS . 'images/stAllproduct.png'); ?>" alt="<?php esc_attr_e('All Products Image', 'embedpress'); ?>">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class=" embdpress-col-6 ">
                        <div class="embedpress-flex embedpress-item-center embedpress-brand-wrapper">
                            <div class="embedpress-left-content">
                                <div class="embedpress-flex embedpress-mb-16 embedpress-item-center ">
                                    <div class="embedpress-line-height-0 embedpress-mr-4 banner-icon">
                                        <img src="<?php echo esc_url(EMBEDPRESS_URL_ASSETS . 'images/icons/brand-icon.png'); ?>" alt="<?php esc_attr_e('Brand Icon', 'embedpress'); ?>">
                                    </div>

                                    <h2 class="embedpress-font-xl embedpress-font-family-dmsans embedpress-banner-header"><?php esc_html_e('Brand Your Work', 'embedpress'); ?></h2>
                                </div>
                                <p class="embedpress-font-m embedpress-font-family-dmsans embedpress-banner-sub-header">
                                    Stand out with every embed. Add your logo and drive traffic back to your site. <a href="<?php echo esc_url('https://wpdeveloper.com/in/upgrade-embedpress'); ?>" target="_blank" class="embdpress-hilight-text"> Upgrade now to unlock branding! </a>
                                </p>
                            </div>
                            <div class="embedpress-right-content">
                                <div class="embedpress-preview-area embedpress-height-95">
                                    <div class=" embedpress-font-m embedpress-tag">Premium</div>
                                    <img src="<?php echo esc_url(EMBEDPRESS_URL_ASSETS . 'images/img-in.png'); ?>" alt="<?php esc_attr_e('Premium Feature Preview', 'embedpress'); ?>">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        <?php elseif ($is_pro_active && !$is_features_enabled): ?>
            <!-- Pro Installed but License Not Valid (covers empty, invalid, expired, etc.) -->
            <div class="embedpress-banner embedpress-banner-active">
                <div class="embedpress-row">
                    <div class=" embdpress-col-6 ">
                        <div class=" embedpress-banner-box embedpress-license-wrapper">
                            <span class="embedpress-flex embedpress-mb-16 embedpress-item-center">
                                <span class="embedpress-line-height-0 embedpress-mr-4 banner-icon">
                                    <img src="<?php echo esc_url(EMBEDPRESS_URL_ASSETS . 'images/icons/lock-inactive.png'); ?>" alt="<?php esc_attr_e('License Inactive Icon', 'embedpress'); ?>">
                                </span>
                                <h2 class="embedpress-font-xl embedpress-font-family-dmsans embedpress-banner-header">
                                    <?php echo $license_status === 'expired' ? __('License Expired', 'embedpress') : __('License Required', 'embedpress'); ?>
                                </h2>
                            </span>
                            <h3 class="embedpress-font-l embdpress-hilight-text embedpress-font-family-dmsans embedpress-banner-secondary-header"><?php echo esc_html($username); ?>, you’ve installed EmbedPress Pro!</h3>
                            <p class="embedpress-font-m embedpress-font-family-dmsans embedpress-mb-16 embedpress-font-m embedpress-banner-sub-header">
                                Activate your license key to enable EmbedPress Pro’s features and to start receiving automatic updates and premium support. </p>
                            <a href="<?php echo esc_url(admin_url('admin.php?page=embedpress&page_type=license')); ?>" class="embedpress-btn embedpress-license-btn   embedpress-activate-license-btn ">
                                <span class="embedpress-line-height-0 ">
                                    <img src="<?php echo esc_url(EMBEDPRESS_URL_ASSETS . 'images/icons/key-removebg-preview 1.png'); ?>" alt="<?php esc_attr_e('License Key Icon', 'embedpress'); ?>">
                                </span>
                                <?php echo  esc_html__('Activate License', 'embedpress'); ?>
                            </a>
                        </div>
                    </div>
                    <div class=" embdpress-col-6 ">
                        <div class="embedpress-flex embedpress-item-center embedpress-banner-box embedpress-upload-brand-wrapper">
                            <div class="embedpress-left-content">
                                <div class="embedpress-flex embedpress-mb-16 embedpress-item-center">
                                    <div class="embedpress-line-height-0  embedpress-mr-4 banner-icon">
                                        <img src="<?php echo esc_url(EMBEDPRESS_URL_ASSETS . 'images/icons/brand-icon.png'); ?>" alt="<?php esc_attr_e('Brand Icon', 'embedpress'); ?>">

                                    </div>

                                    <h2 class="embedpress-font-xl embedpress-font-family-dmsans embedpress-banner-header"><?php esc_html_e('Brand Your Work', 'embedpress'); ?></h2>
                                </div>
                                <p class="embedpress-font-m embedpress-font-family-dmsans embedpress-banner-sub-header"><?php esc_html_e('Upload your custom logo to apply branding to your embeds. You can override the logo per content type from the individual source settings.', 'embedpress'); ?> </p>
                                <a href="#" class="embedpress-btn embedpress-branding-options-btn <?php echo !$is_features_enabled ? 'disabled' : ''; ?>" <?php echo !$is_features_enabled ? 'style="opacity: 0.5; pointer-events: none;"' : ''; ?>>
                                    <?php echo !$is_features_enabled ? __('Branding Options (Disabled)', 'embedpress') : __('Branding Options', 'embedpress'); ?>
                                </a>
                            </div>
                            <div class="embedpress-right-content embedpress-branding-preview-wrapper">
                                <div class="brand-preview-area">
                                    <div class="embedpress-preview-area" id="globalBrandPreview">
                                        <?php if (!empty($global_brand_logo_url)): ?>
                                            <img src="<?php echo esc_url($global_brand_logo_url); ?>" alt="Global Brand Logo" class="embedpress-global-brand-preview-img">
                                        <?php endif; ?>
                                    </div>
                                    <input type="hidden" id="globalBrandLogoUrl" value="<?php echo esc_attr($global_brand_logo_url); ?>">
                                    <input type="hidden" id="globalBrandLogoId" value="<?php echo esc_attr($global_brand_logo_id); ?>">
                                </div>
                                <div class="preview-actions-button">
                                    <button type="button" id="globalBrandUploadBtn" class="embedpress-font-sm embedpress-font-family-dmsans embedpress-upload-btn" <?php echo !$is_features_enabled ? 'disabled style="opacity: 0.5;"' : ''; ?>>
                                        <?php echo !empty($global_brand_logo_url) ? esc_html__('Replace', 'embedpress') : esc_html__('Upload', 'embedpress'); ?>
                                    </button>
                                    <?php if (!empty($global_brand_logo_url)): ?>
                                        <button type="button" id="globalBrandRemoveBtn" class="embedpress-font-sm embedpress-font-family-dmsans embedpress-upload-btn remove-btn" <?php echo !$is_features_enabled ? 'disabled style="opacity: 0.5;"' : ''; ?>><?php esc_html_e('Remove', 'embedpress'); ?></button>
                                    <?php endif; ?>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        <?php elseif ($is_pro_active && $license_status === 'expired'): ?>
            <!-- Pro Active but License Expired -->
            <div class="embedpress-banner embedpress-banner-active">
                <div class="embedpress-row">
                    <div class=" embdpress-col-6 ">
                        <div class=" embedpress-banner-box embedpress-license-wrapper">
                            <span class="embedpress-flex embedpress-mb-16 embedpress-item-center">
                                <span class="embedpress-line-height-0 embedpress-mr-4 banner-icon">
                                    <img src="<?php echo esc_url(EMBEDPRESS_URL_ASSETS . 'images/icons/lock-inactive.png'); ?>" alt="<?php esc_attr_e('License Inactive Icon', 'embedpress'); ?>">
                                </span>
                                <h2 class="embedpress-font-xl embedpress-font-family-dmsans embedpress-banner-header"><?php esc_html_e('License Key', 'embedpress'); ?></h2>
                            </span>
                            <p class="embedpress-font-m embedpress-font-family-dmsans embedpress-mb-16 embedpress-font-m embedpress-banner-sub-header error-msg">
                                You‘re currently receiving regular plugin updates and support.</p>
                            <div class="embedpress-license-input-wrapper ">
                                <input type="text" class="embedpress-license-input " value="<?php echo esc_attr($license_key); ?>" disabled>
                                <button class="embedpress-font-m embedpress-font-family-dmsans embedpress-active-btn ">
                                    <span class="embedpress-line-height-0">
                                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.917 0.916077L3.66699 7.99941L0.916992 5.91608L0.166992 6.91608L3.91699 9.74941L9.91699 1.66608L8.917 0.916077Z" />
                                        </svg>
                                    </span>
                                    <?php esc_html_e('Active', 'embedpress'); ?>
                                </button>
                            </div>

                            <!-- Add the class embedpress-manage-license-btn to the target button (or appropriate element).
                               Update the button text/content to: "Manage License".
                               Add the class embedpress-banner-active to the wrapper element with class embedpress-license-input-wrapper.
                               If the license is enabled/valid, also add this class to the button: embedpress-manage-license-btn-enable.   -->

                            <a href="<?php echo esc_url('https://store.wpdeveloper.com'); ?>" target="_blank" class="embedpress-btn embedpress-license-btn  embedpress-manages-license-btn ">
                                <span class="embedpress-line-height-0 ">
                                    <img src="<?php echo esc_url(EMBEDPRESS_URL_ASSETS . 'images/icons/key-removebg-preview 2.svg'); ?>" alt="<?php esc_attr_e('License Key Icon', 'embedpress'); ?>">
                                </span>
                                <?php esc_html_e('Manage License', 'embedpress'); ?>
                            </a>
                        </div>
                    </div>
                    <div class=" embdpress-col-6 ">
                        <div class="embedpress-flex embedpress-item-center embedpress-banner-box embedpress-upload-brand-wrapper">
                            <div class="embedpress-left-content">
                                <div class="embedpress-flex embedpress-mb-16 embedpress-item-center">
                                    <div class="embedpress-line-height-0  embedpress-mr-4 banner-icon">
                                        <img src="<?php echo esc_url(EMBEDPRESS_URL_ASSETS . 'images/icons/brand-icon.png'); ?>" alt="<?php esc_attr_e('Brand Icon', 'embedpress'); ?>">
                                    </div>

                                    <h2 class="embedpress-font-xl embedpress-font-family-dmsans embedpress-banner-header"><?php esc_html_e('Brand Your Work', 'embedpress'); ?></h2>
                                </div>
                                <p class="embedpress-font-m embedpress-font-family-dmsans embedpress-banner-sub-header"><?php esc_html_e('Upload your custom logo to apply branding to your embeds. You can override the logo per content type from the individual source settings.', 'embedpress'); ?> </p>
                                <a href="#" class="embedpress-btn  embedpress-branding-options-btn"><?php esc_html_e('Branding Options', 'embedpress'); ?></a>
                            </div>

                            <div class="embedpress-right-content embedpress-branding-preview-wrapper">
                                <div class="brand-preview-area">
                                    <div class="embedpress-preview-area" id="globalBrandPreviewExpired">
                                        <?php if (!empty($global_brand_logo_url)): ?>
                                            <img src="<?php echo esc_url($global_brand_logo_url); ?>" alt="Global Brand Logo" class="embedpress-global-brand-preview-img">
                                        <?php endif; ?>
                                    </div>
                                    <input type="hidden" id="globalBrandLogoUrlExpired" value="<?php echo esc_attr($global_brand_logo_url); ?>">
                                    <input type="hidden" id="globalBrandLogoIdExpired" value="<?php echo esc_attr($global_brand_logo_id); ?>">
                                </div>
                                <div class="preview-actions-button">
                                    <button type="button" id="globalBrandUploadBtn" class="embedpress-font-sm embedpress-font-family-dmsans embedpress-upload-btn" <?php echo !$is_features_enabled ? 'disabled style="opacity: 0.5;"' : ''; ?>>
                                        <?php echo !empty($global_brand_logo_url) ? esc_html__('Replace', 'embedpress') : esc_html__('Upload', 'embedpress'); ?>
                                    </button>
                                    <?php if (!empty($global_brand_logo_url)): ?>
                                        <button type="button" id="globalBrandRemoveBtn" class="embedpress-font-sm embedpress-font-family-dmsans embedpress-upload-btn remove-btn" <?php echo !$is_features_enabled ? 'disabled style="opacity: 0.5;"' : ''; ?>><?php esc_html_e('Remove', 'embedpress'); ?></button>
                                    <?php endif; ?>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        <?php elseif ($is_pro_active && $license_status === 'valid'): ?>
            <!-- Pro Active with Valid License -->
            <div class="embedpress-banner embedpress-banner-active">
                <div class="embedpress-row">
                    <div class=" embdpress-col-6 ">
                        <div class=" embedpress-banner-box embedpress-license-wrapper">
                            <span class="embedpress-flex embedpress-mb-16 embedpress-item-center">
                                <span class="embedpress-line-height-0 embedpress-mr-4 banner-icon">
                                    <img src="<?php echo esc_url(EMBEDPRESS_URL_ASSETS . 'images/icons/lock-active.png'); ?>" alt="<?php esc_attr_e('License Inactive Icon', 'embedpress'); ?>">
                                </span>
                                <h2 class="embedpress-font-xl embedpress-font-family-dmsans embedpress-banner-header"><?php esc_html_e('License Key', 'embedpress'); ?></h2>
                            </span>
                            <p class="embedpress-font-m embedpress-font-family-dmsans embedpress-mb-16 embedpress-font-m embedpress-banner-sub-header valid-msg">
                                You‘re currently receiving regular plugin updates and support.</p>
                            <div class="embedpress-license-input-wrapper ">
                                <input type="text" class="embedpress-license-input " value="<?php echo esc_attr($license_key); ?>" disabled>
                                <button class="embedpress-font-m embedpress-font-family-dmsans embedpress-active-btn">
                                    <span class="embedpress-line-height-0">
                                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.917 0.916077L3.66699 7.99941L0.916992 5.91608L0.166992 6.91608L3.91699 9.74941L9.91699 1.66608L8.917 0.916077Z" />
                                        </svg>
                                    </span>
                                    <?php esc_html_e('Active', 'embedpress'); ?>
                                </button>
                            </div>

                            <!-- Add the class embedpress-manage-license-btn to the target button (or appropriate element).
                               Update the button text/content to: "Manage License".
                               Add the class embedpress-banner-active to the wrapper element with class embedpress-license-input-wrapper.
                               If the license is enabled/valid, also add this class to the button: embedpress-manage-license-btn-enable.   -->

                            <a href="<?php echo esc_url(admin_url('admin.php?page=embedpress&page_type=license')); ?>" class="embedpress-btn embedpress-license-btn  embedpress-manages-license-btn ">
                                <span class="embedpress-line-height-0 ">
                                    <img src="<?php echo esc_url(EMBEDPRESS_URL_ASSETS . 'images/icons/key-removebg-preview 2.svg'); ?>" alt="<?php esc_attr_e('License Key Icon', 'embedpress'); ?>">
                                </span>
                                <?php esc_html_e('Manage License', 'embedpress'); ?>
                            </a>
                        </div>
                    </div>
                    <div class=" embdpress-col-6 ">
                        <div class="embedpress-flex embedpress-item-center embedpress-banner-box embedpress-upload-brand-wrapper">
                            <div class="embedpress-left-content">
                                <div class="embedpress-flex embedpress-mb-16 embedpress-item-center">
                                    <div class="embedpress-line-height-0  embedpress-mr-4 banner-icon">
                                        <img src="<?php echo esc_url(EMBEDPRESS_URL_ASSETS . 'images/icons/brand-icon.png'); ?>" alt="<?php esc_attr_e('Brand Icon', 'embedpress'); ?>">
                                    </div>

                                    <h2 class="embedpress-font-xl embedpress-font-family-dmsans embedpress-banner-header"><?php esc_html_e('Brand Your Work', 'embedpress'); ?></h2>
                                </div>
                                <p class="embedpress-font-m embedpress-font-family-dmsans embedpress-banner-sub-header"><?php esc_html_e('Upload your custom logo to apply branding to your embeds. You can override the logo per content type from the individual source settings.', 'embedpress'); ?> </p>
                                <a href="<?php echo esc_url(admin_url('admin.php?page=embedpress&page_type=custom-logo')); ?>" class="embedpress-btn  embedpress-branding-options-btn"><?php esc_html_e('Branding Options', 'embedpress'); ?></a>
                            </div>
                            <div class="embedpress-right-content embedpress-branding-preview-wrapper">
                                <div class="brand-preview-area">
                                    <div class="embedpress-preview-area" id="globalBrandPreview">
                                        <?php if (!empty($global_brand_logo_url)): ?>
                                            <img src="<?php echo esc_url($global_brand_logo_url); ?>" alt="Global Brand Logo" class="embedpress-global-brand-preview-img">
                                        <?php endif; ?>
                                    </div>
                                    <input type="hidden" id="globalBrandLogoUrlValid" value="<?php echo esc_attr($global_brand_logo_url); ?>">
                                    <input type="hidden" id="globalBrandLogoIdValid" value="<?php echo esc_attr($global_brand_logo_id); ?>">
                                </div>
                                <div class="preview-actions-button">
                                    <button type="button" id="globalBrandUploadBtn" class="embedpress-font-sm embedpress-font-family-dmsans embedpress-upload-btn" <?php echo !$is_features_enabled ? 'disabled style="opacity: 0.5;"' : ''; ?>>
                                        <?php echo !empty($global_brand_logo_url) ? esc_html__('Replace', 'embedpress') : esc_html__('Upload', 'embedpress'); ?>
                                    </button>
                                    <?php if (!empty($global_brand_logo_url)): ?>
                                        <button type="button" id="globalBrandRemoveBtn" class="embedpress-font-sm embedpress-font-family-dmsans embedpress-upload-btn remove-btn" <?php echo !$is_features_enabled ? 'disabled style="opacity: 0.5;"' : ''; ?>><?php esc_html_e('Remove', 'embedpress'); ?></button>
                                    <?php endif; ?>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        <?php endif; ?>
    </div>


    <?php if (!$is_popup_dismissed && !$is_pro_active): ?>
        <div class="embedpress-pop-up">
            <div class="embedpress-flex  embedpress-pop-up-content">
                <div class="pop-up-left-content">
                    <span class="premium-tag">Premium</span>
                    <h2 class="embedpress-font-xl embedpress-font-family-dmsans embedpress-pop-up-header">Unlock More Power in Every Embed</h2>
                    <p class="embedpress-font-m embedpress-font-family-dmsans embedpress-pop-up-sub-header">
                        Take full control of your embeds, Customize every detail, protect your content, and unlock monetization features to grow your business.</span>.
                    </p>
                    <ul class="embedpress-premium-features-list">
                        <li class="embedpress-font-m embedpress-font-family-dmsans embedpress-premium-features-list-item">Add your own logo</li>
                        <li class="embedpress-font-m embedpress-font-family-dmsans embedpress-premium-features-list-item">Lock content for members</li>
                        <li class="embedpress-font-m embedpress-font-family-dmsans embedpress-premium-features-list-item">Apply lazy loading</li>
                        <li class="embedpress-font-m embedpress-font-family-dmsans embedpress-premium-features-list-item">Control PDF usage</li>
                        <li class="embedpress-font-m embedpress-font-family-dmsans embedpress-premium-features-list-item">Control video playback</li>
                        <li class="embedpress-font-m embedpress-font-family-dmsans embedpress-premium-features-list-item">Show custom ads in embeds</li>
                    </ul>
                    <a target="_blank" href="<?php echo esc_url('https://wpdeveloper.com/in/upgrade-embedpress'); ?>" class="embedpress-btn embedpress-btn-primary embedpress-pop-up-btn">
                        <span class="embedpress-line-height-0 embedpress-mr-4 pop-up-btn-icon">
                            <img src="<?php echo esc_url(EMBEDPRESS_URL_ASSETS . 'images/icons/crown.png'); ?>" alt="<?php esc_attr_e('Premium Crown Icon', 'embedpress'); ?>">
                        </span>
                        <span><?php esc_html_e('Unlock Premium Features', 'embedpress'); ?></span>
                    </a>
                    <div class="embedpress-font-m embedpress-font-family-dmsans embedpress-flex embedpress-item-center embedpress-guarantee "><span class="embedpress-line-height-0 embedpress-mr-4">
                            <svg width="11" height="13" viewBox="0 0 11 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.9477 3.34726C10.9411 2.99628 10.9347 2.66471 10.9347 2.34394C10.9347 2.09265 10.731 1.88891 10.4797 1.88891C8.53363 1.88891 7.05198 1.32965 5.81696 0.128843C5.64029 -0.0429779 5.35914 -0.0429172 5.18252 0.128843C3.94762 1.32965 2.46622 1.88891 0.520311 1.88891C0.269012 1.88891 0.065278 2.09265 0.065278 2.34394C0.065278 2.66477 0.0589682 2.99646 0.0522337 3.34751C-0.0101362 6.6138 -0.0955608 11.0871 5.3507 12.9749C5.399 12.9917 5.44935 13 5.49971 13C5.55007 13 5.60049 12.9917 5.64872 12.9749C11.0954 11.0871 11.0101 6.61361 10.9477 3.34726ZM5.49977 12.0621C0.828885 10.3653 0.899506 6.64832 0.962179 3.36486C0.965941 3.1678 0.969581 2.97681 0.972129 2.78957C2.79469 2.71264 4.25213 2.16035 5.49977 1.07349C6.74753 2.16035 8.20522 2.7127 10.0279 2.78957C10.0304 2.97674 10.0341 3.16762 10.0378 3.36455C10.1005 6.64814 10.171 10.3653 5.49977 12.0621Z" fill="#666666" />
                                <path d="M7.06673 4.91926L4.8705 7.11537L3.93331 6.17819C3.75561 6.00054 3.46748 6.00054 3.28983 6.17819C3.11213 6.35595 3.11213 6.64402 3.28983 6.82172L4.54876 8.08065C4.63758 8.16947 4.75407 8.21388 4.8705 8.21388C4.98693 8.21388 5.10342 8.16947 5.19224 8.08065L7.71015 5.5628C7.88792 5.38509 7.88792 5.09697 7.71021 4.91932C7.53256 4.74161 7.24444 4.74155 7.06673 4.91926Z" fill="#666666" />
                            </svg>

                        </span><span><?php esc_html_e('No risk 14-day money-back guarantee included.', 'embedpress'); ?></span></div>

                </div>
                <div class="pop-up-right-content">
                    <button class="embedpress-font-m embedpress-font-family-dmsans embedpress-cancel-button"><?php esc_html_e('Dismiss', 'embedpress'); ?></button>
                    <div class="embedpress-img-wrapper">
                        <img src="<?php echo esc_url(EMBEDPRESS_URL_ASSETS . 'images/right-content-img.png'); ?>" alt="<?php esc_attr_e('Premium Features Image', 'embedpress'); ?>">
                    </div>
                    <div class="embedress-text-wrapper">
                        <p class="embedpress-font-m embedpress-font-family-dmsans">Prremium users get full branding, control, and monetization</p>
                    </div>
                </div>
            </div>
        </div>
    <?php endif; ?>

    <!-- Popular Content Section (always visible) -->
    <div class="embedpress-popular-content-wrapper">
        <div class="embedpress-popular-content-header">
            <div class="embedpress-flex embedpress-item-center embedpress-justify-between">
                <span class="embedpress-flex embedpress-item-center">
                    <span class="embedpress-line-height-0 embedpress-mr-4">
                        <img src="<?php echo esc_url(EMBEDPRESS_URL_ASSETS . 'images/icons/source-control 1.svg'); ?>" alt="<?php esc_attr_e('Source Control Icon', 'embedpress'); ?>">
                    </span>
                    <h2 class="embedpress-font-xl embedpress-font-family-dmsans embedpress-popular-types-header"><?php esc_html_e('Most Popular Content Types', 'embedpress'); ?></h2>
                </span>
                <a href="<?php echo esc_url(admin_url('admin.php?page=embedpress&page_type=sources')); ?>" class="embedpress-font-m embedpress-font-family-dmsans embdpress-underline"><?php esc_html_e('Discover all sources', 'embedpress'); ?></a>
            </div>
        </div>

        <?php
        // Array of most popular sources based on sources.php with exact icon paths
        $icon_src = EMBEDPRESS_URL_ASSETS . "images/sources/icons";

        $popular_sources = [
            // PDFs & Docs
            'docs' => [
                'title' => 'PDFs & Docs',
                'icon' => EMBEDPRESS_URL_ASSETS . 'images/icons/docs-icon 1.png',
                'sources' => [
                    ['name' => 'PDF', 'provider' => 'pdf', 'icon' => $icon_src . '/pdf.svg', 'settings_url' => '', 'doc_url' => 'https://wpdeveloper.com/embed-pdf-documents-wordpress', 'arival_status' => 'popular'],
                    ['name' => 'Google Docs', 'provider' => 'google-docs', 'icon' => $icon_src . '/google-docs.svg', 'settings_url' => '', 'doc_url' => 'https://embedpress.com/docs/embed-google-docs-wordpress/', 'arival_status' => 'popular'],
                    ['name' => 'Google Slides', 'provider' => 'google-slides', 'icon' => $icon_src . '/google-slides.svg', 'settings_url' => '', 'doc_url' => 'https://embedpress.com/docs/embed-google-slides-wordpress/', 'arival_status' => 'popular'],

                ]
            ],
            // Video Sources
            'video' => [
                'title' => 'Audio & Video',
                'icon' => EMBEDPRESS_URL_ASSETS . 'images/sources/audio-video.svg',
                'sources' => [
                    ['name' => 'YouTube', 'provider' => 'youtube', 'icon' => $icon_src . '/youtube.svg', 'settings_url' => esc_url(admin_url('admin.php?page=embedpress&page_type=youtube')), 'doc_url' => 'https://embedpress.com/docs/embed-youtube-wordpress/', 'arival_status' => 'popular'],
                    ['name' => 'Vimeo', 'provider' => 'vimeo', 'icon' => $icon_src . '/vimeo.svg', 'settings_url' => esc_url(admin_url('admin.php?page=embedpress&page_type=vimeo')), 'doc_url' => 'https://embedpress.com/docs/embed-vimeo-videos-wordpress/', 'arival_status' => 'popular'],
                    ['name' => 'Wistia', 'provider' => 'wistia', 'icon' => $icon_src . '/wistia.svg', 'settings_url' => esc_url(admin_url('admin.php?page=embedpress&page_type=wistia')), 'doc_url' => 'https://embedpress.com/docs/embed-wistia-videos-wordpress/', 'arival_status' => 'popular'],
                    ['name' => 'Spotify', 'provider' => 'spotify', 'icon' => $icon_src . '/spotify.svg', 'settings_url' => esc_url(admin_url('admin.php?page=embedpress&page_type=spotify')), 'doc_url' => 'https://embedpress.com/docs/embed-spotify-audios-wordpress/', 'arival_status' => 'popular'],
                    ['name' => 'SoundCloud', 'provider' => 'soundcloud', 'icon' => $icon_src . '/soundcloud.svg', 'settings_url' => esc_url(admin_url('admin.php?page=embedpress&page_type=soundcloud')), 'doc_url' => 'https://embedpress.com/docs/embed-soundcloud-audio-wordpress/'],
                ]
            ],
            // Social Media
            'social' => [
                'title' => 'Social Media',
                'icon' => EMBEDPRESS_URL_ASSETS . 'images/sources/social.svg',
                'sources' => [
                    ['name' => 'Facebook', 'provider' => 'facebook', 'icon' => $icon_src . '/facebook.svg', 'settings_url' => '', 'doc_url' => 'https://embedpress.com/docs/embed-facebook-posts-wordpress/', 'arival_status' => 'popular'],
                    ['name' => 'Facebook Live', 'provider' => 'facebook-live', 'icon' => $icon_src . '/facebooklive.png', 'settings_url' => '', 'doc_url' => 'https://embedpress.com/docs/embed-facebook-posts-wordpress/', 'arival_status' => 'popular'],
                    ['name' => 'Instagram', 'provider' => 'instagram', 'icon' => $icon_src . '/instagram.svg', 'settings_url' => esc_url(admin_url('admin.php?page=embedpress&page_type=instagram')), 'doc_url' => 'https://embedpress.com/docs/embed-instagram-wordpress/', 'arival_status' => 'popular'],
                    ['name' => 'OpenSea NFT', 'provider' => 'opensea', 'icon' => $icon_src . '/opensea.svg', 'settings_url' => esc_url(admin_url('admin.php?page=embedpress&page_type=opensea')), 'doc_url' => 'https://embedpress.com/docs/embed-opensea-nft-collections-wordpress/', 'arival_status' => 'popular'],
                ]
            ],
            // Audio & Music
            'audio' => [
                'title' => 'Others',
                'icon' => EMBEDPRESS_URL_ASSETS . 'images//sources/automations.svg',
                'sources' => [
                    ['name' => 'Google Photos', 'provider' => 'google-photos', 'icon' => $icon_src . '/google-photos.svg', 'settings_url' => '', 'doc_url' => 'https://embedpress.com/docs/embed-google-photos-in-wordpress/', 'arival_status' => 'popular'],
                    ['name' => 'Google Maps', 'provider' => 'google-maps', 'icon' => $icon_src . '/map.svg', 'settings_url' => '', 'doc_url' => 'https://embedpress.com/docs/embed-google-maps-wordpress/', 'arival_status' => 'popular'],
                ]
            ]
        ];
        ?>

        <div class="embedpress-popular-content-body">
            <div class="embedpress-row">
                <?php foreach ($popular_sources as $category_key => $category): ?>
                    <div class="embdpress-col-3">
                        <div class="embedpress-popular-content-cards">
                            <div class="embedpress-flex embedpress-item-center embedpress-card-header-wrapper">
                                <span class="embedpress-line-height-0 embedpress-mr-4 banner-icon-l">
                                    <img src="<?php echo esc_url($category['icon']); ?>" alt="<?php echo esc_attr($category['title']); ?>">
                                </span>
                                <h3 class="embedpress-font-m embedpress-content-card-header"><?php echo esc_html($category['title']); ?></h3>
                            </div>
                            <ul class="embedpress-popular-content-list">
                                <?php foreach ($category['sources'] as $source): ?>
                                    <li class="embedpress-popular-content-list-item">
                                        <div class="embedpress-flex embedpress-item-center content-item-wrapper">
                                            <span class="embedpress-line-height-0 popular-content-icon <?php echo esc_attr($source['provider']); ?>">
                                                <img src="<?php echo esc_url($source['icon']); ?>" alt="<?php echo esc_attr($source['name']); ?>">
                                            </span>
                                            <span class="embedpress-font-m"><?php echo esc_html($source['name']); ?></span>
                                        </div>
                                        <div class="embedpress-hub-item-actions">

                                            <?php if (!empty($source['settings_url'])): ?>
                                                <a href="<?php echo esc_url($source['settings_url']); ?>" class="embedpress-hub-item-link" title="<?php esc_attr_e('Settings', 'embedpress'); ?>">
                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <g clip-path="url(#a)" stroke="#988FBD" stroke-linecap="round" stroke-linejoin="round">
                                                            <path d="M6.883 2.878c.284-1.17 1.95-1.17 2.234 0a1.15 1.15 0 0 0 1.715.71c1.029-.626 2.207.551 1.58 1.58a1.148 1.148 0 0 0 .71 1.715c1.17.284 1.17 1.95 0 2.234a1.15 1.15 0 0 0-.71 1.715c.626 1.029-.551 2.207-1.58 1.58a1.148 1.148 0 0 0-1.715.71c-.284 1.17-1.95 1.17-2.234 0a1.15 1.15 0 0 0-1.715-.71c-1.029.626-2.207-.551-1.58-1.58a1.15 1.15 0 0 0-.71-1.715c-1.17-.284-1.17-1.95 0-2.234a1.15 1.15 0 0 0 .71-1.715c-.626-1.029.551-2.207 1.58-1.58a1.149 1.149 0 0 0 1.715-.71Z" />
                                                            <path d="M6 8a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z" />
                                                        </g>
                                                        <defs>
                                                            <clipPath id="a">
                                                                <path fill="#fff" d="M0 0h16v16H0z" />
                                                            </clipPath>
                                                        </defs>
                                                    </svg>
                                                </a>
                                            <?php endif; ?>

                                            <?php if (!empty($source['doc_url'])): ?>
                                                <a href="<?php echo esc_url($source['doc_url']); ?>" target="_blank" class="embedpress-hub-item-link" title="<?php esc_attr_e('Documentation', 'embedpress'); ?>">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                        <g clip-path="url(#a)" stroke="#988FBD" stroke-linecap="round" stroke-linejoin="round">
                                                            <path d="M9.333 2v2.667a.667.667 0 0 0 .667.666h2.666" />
                                                            <path d="M11.333 14H4.666a1.334 1.334 0 0 1-1.333-1.333V3.333A1.333 1.333 0 0 1 4.666 2h4.667l3.333 3.333v7.334A1.333 1.333 0 0 1 11.333 14ZM6 11.333h4M6 8.667h4" />
                                                        </g>
                                                        <defs>
                                                            <clipPath id="a">
                                                                <path fill="#fff" d="M0 0h16v16H0z" />
                                                            </clipPath>
                                                        </defs>
                                                    </svg>
                                                </a>
                                            <?php endif; ?>
                                        </div>

                                        <?php if (!empty($source['arival_status']) && $source['arival_status'] !== 'popular'): ?>
                                            <div class="ribbon-container <?php echo esc_attr($source['arival_status']); ?>"><?php echo esc_html($source['arival_status']); ?></div>
                                        <?php endif; ?>
                                    </li>
                                <?php endforeach; ?>
                            </ul>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
</section>