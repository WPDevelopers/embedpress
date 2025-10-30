<?php

/**
 * Feature Notice - New Analytics Dashboard
 *
 * Displays a promotional notice for the new Analytics dashboard feature
 */

if (!defined('ABSPATH')) {
    exit;
}

// Check if notice has been dismissed
$is_feature_notice_dismissed = get_option('embedpress_feature_notice_analytics_dismissed', false);

// Only show if not dismissed
if ($is_feature_notice_dismissed) {
    return;
}

$analytics_url = admin_url('admin.php?page=embedpress-analytics');
$learn_more_url = 'https://embedpress.com/docs/analytics-dashboard/';
$nonce = wp_create_nonce('embedpress_feature_notice_nonce');
?>

<div class="embedpress-feature-notice embedpress-feature-notice-analytics" data-notice-id="analytics">
    <div class="embedpress-feature-notice-container">
        <div class="embedpress-feature-notice-content">
            <div class="embedpress-feature-notice-text">
                <span class="embedpress-feature-notice-badge">🥳 New In EmbedPress:</span>
                <span class="embedpress-feature-notice-title">
                    Introducing <strong><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_2447_7485)">
                                <path d="M0.500061 11.5156H2.49994C2.77606 11.5156 3 11.7394 3 12.0155V17.0156C3 17.2917 2.77606 17.5156 2.49994 17.5156H0.500061C0.223938 17.5156 0 17.2917 0 17.0156V12.0155C0 11.7394 0.223938 11.5156 0.500061 11.5156Z" fill="#FF7369" />
                                <path d="M5.49988 7.51562H7.49994C7.77606 7.51562 8 7.73956 8 8.01569V17.0157C8 17.2918 7.77606 17.5157 7.49994 17.5157H5.49988C5.22375 17.5157 5 17.2918 5 17.0157V8.01569C5 7.73956 5.22375 7.51562 5.49988 7.51562Z" fill="#FF7369" />
                                <path d="M10.5001 9.51562H12.5001C12.7762 9.51562 13 9.73956 13 10.0157V17.0156C13 17.2917 12.7762 17.5157 12.5001 17.5157H10.5001C10.2239 17.5157 10 17.2917 10 17.0156V10.0157C10 9.73956 10.2239 9.51562 10.5001 9.51562Z" fill="#FF7369" />
                                <path d="M15.5001 6.51562H17.4999C17.7761 6.51562 18 6.73956 18 7.01569V17.0156C18 17.2917 17.7761 17.5157 17.4999 17.5157H15.5001C15.2239 17.5157 15 17.2917 15 17.0156V7.01569C15 6.73956 15.2239 6.51562 15.5001 6.51562Z" fill="#FF7369" />
                                <path d="M16.5 0.515625C15.672 0.516541 15.0009 1.18762 15 2.01563C15.002 2.17896 15.0309 2.34082 15.0857 2.49463L12.5826 3.98254C12.2542 3.63409 11.7779 3.46527 11.3033 3.52881C10.8285 3.59235 10.4136 3.88055 10.1882 4.30316L7.98047 3.20966C7.99127 3.14539 7.99768 3.08057 8.00006 3.01556C8.00116 2.40839 7.63623 1.86053 7.07556 1.62744C6.51489 1.39453 5.86908 1.52252 5.4397 1.95172C5.01013 2.38092 4.88177 3.02655 5.1145 3.5874L2.25073 5.72461C2.02368 5.58929 1.7644 5.51715 1.5 5.51569C0.671631 5.51569 0 6.18713 0 7.01569C0 7.84406 0.671631 8.51569 1.5 8.51569C2.32837 8.51569 3 7.84406 3 7.01569C2.99872 6.83514 2.96466 6.65662 2.89948 6.48834L5.79181 4.32971C6.3576 4.6452 7.06329 4.55273 7.52856 4.10193L10.0391 5.3454C10.2065 6.09082 10.908 6.59106 11.6673 6.50647C12.4266 6.42188 13.0009 5.77972 12.9999 5.01563C12.9999 4.97754 12.9915 4.94165 12.9888 4.9043L15.7112 3.28583C15.9472 3.43506 16.2206 3.51471 16.5 3.51563C17.3284 3.51563 18 2.84399 18 2.01563C18 1.18726 17.3284 0.515625 16.5 0.515625Z" fill="#FFC5C1" />
                            </g>
                            <defs>
                                <clipPath id="clip0_2447_7485">
                                    <rect width="18" height="18" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                        Analytics dashboard</strong> to track every embed performance: see total counts, views, clicks, geo insights, etc.
                </span>
                <a href="<?php echo esc_url($learn_more_url); ?>" target="_blank" class="embedpress-feature-notice-link">Learn More</a>
            </div>
        </div>
        <!-- <button class="embedpress-feature-notice-close" type="button" aria-label="<?php esc_attr_e('Dismiss notice', 'embedpress'); ?>">
            <span class="dashicons dashicons-no-alt"></span>
        </button> -->
    </div>
</div>

<script type="text/javascript">
    var embedpressFeatureNoticeNonce = '<?php echo esc_js($nonce); ?>';
</script>