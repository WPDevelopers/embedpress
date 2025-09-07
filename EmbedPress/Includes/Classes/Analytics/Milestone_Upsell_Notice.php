<?php

namespace EmbedPress\Includes\Classes\Analytics;

use EmbedPress\Includes\Classes\Helper;

defined('ABSPATH') or die("No direct script access allowed.");

/**
 * EmbedPress Milestone Upsell Notice System
 * 
 * Handles celebratory upsell notices when users reach engagement milestones
 * 
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2023 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       4.2.7
 */
class Milestone_Upsell_Notice
{
    /**
     * Milestone Manager instance
     *
     * @var Milestone_Manager
     */
    private $milestone_manager;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->milestone_manager = new Milestone_Manager();
        $this->init_hooks();
    }

    /**
     * Initialize hooks
     *
     * @return void
     */
    private function init_hooks()
    {
        // Hook into milestone achievements
        add_action('embedpress_milestone_achieved', [$this, 'handle_milestone_achievement'], 10, 3);

        // Display admin notices
        add_action('admin_notices', [$this, 'display_milestone_notices']);

        // AJAX handlers
        add_action('wp_ajax_embedpress_dismiss_milestone_notice', [$this, 'dismiss_milestone_notice']);
        add_action('wp_ajax_embedpress_track_upgrade_click', [$this, 'track_upgrade_click']);

        // Enqueue admin scripts
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_scripts']);

        // Track user activity for smart notice timing
        add_action('admin_init', [$this, 'track_user_activity']);

        // Add admin notice status (for debugging/admin info)
        add_action('wp_ajax_embedpress_get_notice_status', [$this, 'get_notice_status_ajax']);
    }

    /**
     * Handle milestone achievement
     *
     * @param string $type
     * @param int $milestone_value
     * @param int $achieved_value
     * @return void
     */
    public function handle_milestone_achievement($type, $milestone_value, $achieved_value)
    {
        // Only show notices for non-pro users
        if (Helper::is_pro_features_enabled()) {
            return;
        }

        // Smart anti-spam logic
        if (!$this->should_show_milestone_notice($type, $milestone_value)) {
            return;
        }

        // Store the notice for display
        $notice_data = [
            'type' => $type,
            'milestone_value' => $milestone_value,
            'achieved_value' => $achieved_value,
            'timestamp' => time(),
            'message' => $this->milestone_manager->get_milestone_message($type, $milestone_value, $achieved_value)
        ];

        // Store in transient for immediate display
        set_transient('embedpress_milestone_upsell_notice', $notice_data, HOUR_IN_SECONDS);

        // Record this notice
        $this->record_milestone_notice($type, $milestone_value);
    }

    /**
     * Smart logic to determine if milestone notice should be shown
     *
     * @param string $type
     * @param int $milestone_value
     * @return bool
     */
    private function should_show_milestone_notice($type, $milestone_value)
    {
        // Check if user has permanently disabled notices (dismissed 3+ times)
        $dismissal_count = get_option('embedpress_notice_dismissal_count', 0);
        if ($dismissal_count >= 3) {
            return false; // User has permanently disabled notices
        }

        // Check if we're in cooldown period (10 days after last notice)
        $last_notice_time = get_option('embedpress_last_milestone_notice_time', 0);
        $cooldown_period = 10 * DAY_IN_SECONDS; // 10 days

        if ($last_notice_time > 0 && (time() - $last_notice_time) < $cooldown_period) {
            return false; // Still in cooldown period
        }

        // Check if this exact milestone was already shown
        $notice_key = $type . '_' . $milestone_value;
        $shown_notices = get_option('embedpress_shown_milestone_notices', []);
        if (in_array($notice_key, $shown_notices)) {
            return false; // Already shown this milestone
        }

        return true; // Simple: show if not in cooldown and not already shown
    }

    /**
     * Record milestone notice display
     *
     * @param string $type
     * @param int $milestone_value
     * @return void
     */
    private function record_milestone_notice($type, $milestone_value)
    {
        $notice_key = $type . '_' . $milestone_value;

        // Mark this specific milestone as shown
        $shown_notices = get_option('embedpress_shown_milestone_notices', []);
        $shown_notices[] = $notice_key;
        update_option('embedpress_shown_milestone_notices', $shown_notices);

        // Update last notice time (starts 10-day cooldown)
        update_option('embedpress_last_milestone_notice_time', time());
    }

    /**
     * Display milestone notices in admin
     *
     * @return void
     */
    public function display_milestone_notices()
    {
        // Only show on EmbedPress admin pages or dashboard
        $screen = get_current_screen();
        if (!$screen || (!strpos($screen->id, 'embedpress') && $screen->id !== 'dashboard')) {
            return;
        }

        // Get pending notice
        $notice_data = get_transient('embedpress_milestone_upsell_notice');
        if (!$notice_data) {
            return;
        }

        $this->render_milestone_notice($notice_data);
    }



    /**
     * Render milestone notice HTML
     *
     * @param array $notice_data
     * @return void
     */
    private function render_milestone_notice($notice_data)
    {
        $milestone_icon = $this->get_milestone_icon($notice_data['type']);
        $upgrade_url = 'https://wpdeveloper.com/in/upgrade-embedpress';
        $notice_id = 'embedpress-milestone-' . $notice_data['timestamp'];
        
        ?>
        <div id="<?php echo esc_attr($notice_id); ?>" class="notice notice-success is-dismissible embedpress-milestone-notice" data-timestamp="<?php echo esc_attr($notice_data['timestamp']); ?>">
            <div class="embedpress-milestone-notice-content">
                <div class="embedpress-milestone-icon">
                    <?php echo $milestone_icon; ?>
                </div>
                <div class="embedpress-milestone-message">
                    <h3><?php esc_html_e('Milestone Achieved!', 'embedpress'); ?></h3>
                    <p><?php echo esc_html($notice_data['message']); ?></p>
                </div>
                <div class="embedpress-milestone-actions">
                    <a href="<?php echo esc_url($upgrade_url); ?>" 
                       class="button button-primary embedpress-upgrade-btn" 
                       target="_blank"
                       data-milestone-type="<?php echo esc_attr($notice_data['type']); ?>"
                       data-milestone-value="<?php echo esc_attr($notice_data['milestone_value']); ?>">
                        <?php esc_html_e('Upgrade to Pro', 'embedpress'); ?>
                    </a>
                </div>
            </div>
        </div>
        <?php
    }

    /**
     * Get milestone icon based on type
     *
     * @param string $type
     * @return string
     */
    private function get_milestone_icon($type)
    {
        $icons = [
            'total_views' => '🎉',
            'total_clicks' => '👏',
            'total_impressions' => '🚀',
            'total_embeds' => '🎯',
            'daily_views' => '📈',
            'monthly_views' => '🏆'
        ];

        return isset($icons[$type]) ? $icons[$type] : '🎉';
    }

    /**
     * Dismiss milestone notice via AJAX
     *
     * @return void
     */
    public function dismiss_milestone_notice()
    {
        check_ajax_referer('embedpress_milestone_notice', 'nonce');

        // Track dismissal count (for permanent disable after 3 dismissals)
        $dismissal_count = get_option('embedpress_notice_dismissal_count', 0);
        $dismissal_count++;
        update_option('embedpress_notice_dismissal_count', $dismissal_count);

        // Remove the transient
        delete_transient('embedpress_milestone_upsell_notice');

        $message = 'Notice dismissed';
        if ($dismissal_count >= 3) {
            $message = 'Notice dismissed. Milestone notices have been permanently disabled.';
        }

        wp_send_json_success(['message' => $message, 'dismissal_count' => $dismissal_count]);
    }

    /**
     * Track upgrade button click via AJAX
     *
     * @return void
     */
    public function track_upgrade_click()
    {
        check_ajax_referer('embedpress_milestone_notice', 'nonce');

        $milestone_type = sanitize_text_field($_POST['milestone_type']);
        $milestone_value = intval($_POST['milestone_value']);

        // Track the upgrade click for analytics
        $click_data = [
            'milestone_type' => $milestone_type,
            'milestone_value' => $milestone_value,
            'timestamp' => time(),
            'user_id' => get_current_user_id()
        ];

        // Store click tracking data
        $existing_clicks = get_option('embedpress_milestone_upgrade_clicks', []);
        $existing_clicks[] = $click_data;
        update_option('embedpress_milestone_upgrade_clicks', $existing_clicks);

        // Reset dismissal count since user showed interest
        update_option('embedpress_notice_dismissal_count', 0);

        wp_send_json_success(['message' => 'Click tracked']);
    }

    /**
     * Enqueue admin scripts and styles
     *
     * @return void
     */
    public function enqueue_admin_scripts()
    {
        // Only enqueue on admin pages where notices might appear
        $screen = get_current_screen();
        if (!$screen || (!strpos($screen->id, 'embedpress') && $screen->id !== 'dashboard')) {
            return;
        }

        wp_enqueue_script(
            'embedpress-milestone-notices',
            EMBEDPRESS_URL_ASSETS . 'js/milestone-notices.js',
            ['jquery'],
            EMBEDPRESS_PLUGIN_VERSION,
            true
        );

        wp_localize_script('embedpress-milestone-notices', 'embedpressMilestoneNotices', [
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('embedpress_milestone_notice'),
            'strings' => [
                'error' => __('An error occurred. Please try again.', 'embedpress')
            ]
        ]);

        wp_enqueue_style(
            'embedpress-milestone-notices',
            EMBEDPRESS_URL_ASSETS . 'css/milestone-notices.css',
            [],
            EMBEDPRESS_PLUGIN_VERSION
        );
    }

    /**
     * Track user activity for smart notice timing
     *
     * @return void
     */
    public function track_user_activity()
    {
        $screen = get_current_screen();
        if ($screen && strpos($screen->id, 'embedpress') !== false) {
            update_option('embedpress_user_last_activity', time());
        }
    }

    /**
     * Get milestone statistics for admin dashboard
     *
     * @return array
     */
    public function get_milestone_stats()
    {
        $shown_notices = get_option('embedpress_shown_milestone_notices', []);
        $upgrade_clicks = get_option('embedpress_milestone_upgrade_clicks', []);
        $dismissal_count = get_option('embedpress_notice_dismissal_count', 0);

        // Calculate engagement metrics
        $total_notices = count($shown_notices);
        $total_clicks = count($upgrade_clicks);

        return [
            'total_notices_shown' => $total_notices,
            'total_upgrade_clicks' => $total_clicks,
            'dismissal_count' => $dismissal_count,
            'conversion_rate' => $total_notices > 0 ? ($total_clicks / $total_notices) * 100 : 0,
            'notices_disabled' => $dismissal_count >= 3,
            'cooldown_hours_remaining' => $this->get_cooldown_remaining_hours(),
            'recent_clicks' => array_slice($upgrade_clicks, -5)
        ];
    }

    /**
     * AJAX handler for getting notice status (for admin debugging)
     *
     * @return void
     */
    public function get_notice_status_ajax()
    {
        check_ajax_referer('embedpress_milestone_notice', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_send_json_error(['message' => 'Insufficient permissions']);
            return;
        }

        $status = [
            'is_pro_user' => Helper::is_pro_features_enabled(),
            'stats' => $this->get_milestone_stats(),
            'pending_notice' => get_transient('embedpress_milestone_upsell_notice'),
            'dismissal_count' => get_option('embedpress_notice_dismissal_count', 0),
            'last_notice_time' => get_option('embedpress_last_milestone_notice_time', 0),
            'cooldown_remaining_hours' => $this->get_cooldown_remaining_hours(),
            'debug_info' => [
                'current_time' => time(),
                'screen_id' => get_current_screen() ? get_current_screen()->id : 'unknown',
                'user_id' => get_current_user_id()
            ]
        ];

        wp_send_json_success($status);
    }

    /**
     * Get remaining cooldown hours
     *
     * @return int
     */
    private function get_cooldown_remaining_hours()
    {
        $last_notice_time = get_option('embedpress_last_milestone_notice_time', 0);
        if ($last_notice_time === 0) {
            return 0; // No previous notice
        }

        $cooldown_period = 10 * DAY_IN_SECONDS; // 10 days
        $elapsed = time() - $last_notice_time;
        $remaining = $cooldown_period - $elapsed;

        return max(0, ceil($remaining / HOUR_IN_SECONDS));
    }
}
