<?php

namespace EmbedPress\Includes\Classes\Analytics;

/**
 * EmbedPress Analytics License Manager
 *
 * Handles license checking for analytics pro features
 *
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2023 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       4.2.7
 */
class License_Manager
{
    /**
     * Check if user has valid pro license
     *
     * @return bool
     */
    public static function has_pro_license()
    {
        // First check if EmbedPress Pro plugin is active
        if (!is_plugin_active('embedpress-pro/embedpress-pro.php')) {
            return false;
        }

        // Check if the pro constants are defined (indicates pro is properly loaded)
        if (!defined('EMBEDPRESS_SL_ITEM_SLUG')) {
            return false;
        }

        // For now, if pro is active and constants are defined, consider it valid
        // This matches how other parts of EmbedPress check for pro status
        return true;

        // TODO: Add actual license validation later if needed
        /*
        try {
            // Check if license manager class exists
            if (!class_exists('\Embedpress\Pro\Dependencies\WPDeveloper\Licensing\LicenseManager')) {
                return true; // Pro is active, assume valid for now
            }

            // Get license manager instance
            $license_manager = \Embedpress\Pro\Dependencies\WPDeveloper\Licensing\LicenseManager::get_instance([
                'plugin_file'    => EMBEDPRESS_PRO_PLUGIN_FILE,
                'version'        => EMBEDPRESS_PRO_PLUGIN_VERSION,
                'item_id'        => EMBEDPRESS_SL_ITEM_ID,
                'item_name'      => EMBEDPRESS_SL_ITEM_NAME,
                'item_slug'      => EMBEDPRESS_SL_ITEM_SLUG,
                'storeURL'       => EMBEDPRESS_STORE_URL,
                'db_prefix'      => EMBEDPRESS_SL_DB_PREFIX,
                'textdomain'     => 'embedpress-pro',
            ]);

            $license_data = $license_manager->get_license_data();

            return isset($license_data['license_status']) &&
                   $license_data['license_status'] === 'valid';

        } catch (Exception $e) {
            return true; // If license check fails, assume valid since pro is active
        }
        */
    }

    /**
     * Check if specific analytics feature is available
     *
     * @param string $feature
     * @return bool
     */
    public static function has_analytics_feature($feature)
    {
        $free_features = [
            'total_views',
            'total_clicks',
            'total_impressions',
            'total_unique_viewers',
            'views_over_time_basic',
            'basic_charts'
        ];

        $pro_features = [
            'per_embed_analytics',
            'unique_viewers_per_embed',
            'views_over_time_advanced',
            'geo_tracking',
            'device_analytics',
            'email_reports',
            'referral_tracking',
            'advanced_charts',
            'export_pdf'
        ];

        // Free features are always available
        if (in_array($feature, $free_features)) {
            return true;
        }

        // Pro features require valid license
        if (in_array($feature, $pro_features)) {
            return self::has_pro_license();
        }

        return false;
    }

    /**
     * Get upgrade URL for pro features
     *
     * @return string
     */
    public static function get_upgrade_url()
    {
        return 'https://wpdeveloper.com/in/upgrade-embedpress';
    }

    /**
     * Get pro feature notice HTML
     *
     * @param string $feature_name
     * @param string $description
     * @return string
     */
    public static function get_pro_notice_html($feature_name, $description = '')
    {
        $upgrade_url = self::get_upgrade_url();

        return sprintf(
            '<div class="embedpress-pro-notice">
                <div class="pro-notice-content">
                    <h4>🚀 %s - Pro Feature</h4>
                    <p>%s</p>
                    <a href="%s" target="_blank" class="button button-primary">
                        Upgrade to Pro <span class="dashicons dashicons-external"></span>
                    </a>
                </div>
            </div>',
            esc_html($feature_name),
            esc_html($description ?: "This feature is available in EmbedPress Pro."),
            esc_url($upgrade_url)
        );
    }

    /**
     * Check if analytics is enabled
     *
     * @return bool
     */
    public static function is_analytics_enabled()
    {
        // Check if analytics is disabled in settings
        $settings = get_option('embedpress_settings', []);

        return !isset($settings['disable_analytics']) || !$settings['disable_analytics'];
    }

    /**
     * Get analytics limits for current license
     *
     * @return array
     */
    public static function get_analytics_limits()
    {
        if (self::has_pro_license()) {
            return [
                'max_tracked_content' => -1, // unlimited
                'data_retention_days' => 365,
                'export_formats' => ['csv', 'pdf'],
                'email_reports' => true,
                'advanced_features' => true
            ];
        }

        return [
            'max_tracked_content' => 100,
            'data_retention_days' => 90,
            'export_formats' => ['csv'],
            'email_reports' => false,
            'advanced_features' => false
        ];
    }

    /**
     * Check if content tracking limit is reached
     *
     * @return bool
     */
    public static function is_tracking_limit_reached()
    {
        if (self::has_pro_license()) {
            return false; // No limits for pro users
        }

        global $wpdb;
        $content_table = $wpdb->prefix . 'embedpress_analytics_content';

        $count = $wpdb->get_var("SELECT COUNT(*) FROM $content_table");
        $limits = self::get_analytics_limits();

        return $count >= $limits['max_tracked_content'];
    }

    /**
     * Get feature availability status
     *
     * @return array
     */
    public static function get_feature_status()
    {
        $has_pro = self::has_pro_license();

        return [
            'has_pro_license' => $has_pro,
            'features' => [
                // Free features
                'total_analytics' => true,
                'basic_charts' => true,
                'unique_viewers_total' => true,
                'views_over_time_basic' => true,

                // Pro features
                'per_embed_analytics' => $has_pro,
                'unique_viewers_per_embed' => $has_pro,
                'advanced_charts' => $has_pro,
                'geo_tracking' => $has_pro,
                'device_analytics' => $has_pro,
                'email_reports' => $has_pro,
                'referral_tracking' => $has_pro,
                'export_pdf' => $has_pro
            ],
            'limits' => self::get_analytics_limits(),
            'upgrade_url' => self::get_upgrade_url()
        ];
    }
}
