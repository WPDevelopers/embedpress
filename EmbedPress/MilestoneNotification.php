<?php

/**
 * Milestone Notification for WordPress Admin Dashboard
 *
 * Displays a beautiful animated notification on the main WordPress dashboard (/wp-admin/)
 * showing milestone achievements and encouraging premium upgrades.
 *
 * Features:
 * - Automatically appears on dashboard after 2 seconds
 * - Slides in from bottom-right with smooth animation
 * - Fully responsive design
 * - Close on button click, overlay click, or Escape key
 * - Customizable milestone data and stats
 *
 * Usage:
 * - Automatically initialized in embedpress.php
 * - Only loads on WordPress dashboard (index.php)
 * - Customize data in get_milestone_data() method
 * - Control display logic in should_show_milestone() method
 *
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2023 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       1.0.0
 */

namespace EmbedPress;

defined('ABSPATH') or die("No direct script access allowed.");

class MilestoneNotification
{
    /**
     * Initialize the milestone notification
     */
    public static function init()
    {
        $instance = new self();

        // Hook into admin footer to inject the notification
        add_action('admin_footer', [$instance, 'render_milestone_notification']);

        // Enqueue styles and scripts
        add_action('admin_enqueue_scripts', [$instance, 'enqueue_assets']);

        // AJAX handler to mark milestone as seen
        add_action('wp_ajax_embedpress_mark_milestone_seen', [$instance, 'ajax_mark_milestone_seen']);
    }

    /**
     * Enqueue CSS and JS for milestone notification
     */
    public function enqueue_assets($hook)
    {
        // Only load on main dashboard page
        if ($hook !== 'index.php') {
            return;
        }

        // Enqueue the milestone CSS
        wp_enqueue_style(
            'embedpress-milestone',
            EMBEDPRESS_PLUGIN_DIR_URL . 'assets/css/admin.build.css',
            [],
            EMBEDPRESS_VERSION
        );

        // Enqueue inline script for milestone functionality
        wp_add_inline_script('jquery', $this->get_milestone_script());
    }

    /**
     * Get the JavaScript for milestone functionality
     */
    private function get_milestone_script()
    {
        return "
        jQuery(document).ready(function($) {
            // Auto-show milestone after 2 seconds
            setTimeout(function() {
                showEmbedPressMilestone();
            }, 2000);
        });

        function showEmbedPressMilestone() {
            var container = document.getElementById('embedpress-milestone-container');
            if (!container) return;

            container.style.display = 'block';

            // Trigger animation
            setTimeout(function() {
                var overlay = container.querySelector('.milestone-overlay');
                var notification = container.querySelector('.milestone-notification');

                if (overlay) overlay.classList.add('milestone-overlay--visible');
                if (notification) notification.classList.add('milestone-notification--visible');
            }, 100);
        }

        function hideEmbedPressMilestone(event) {
            if (event) event.preventDefault();

            var container = document.getElementById('embedpress-milestone-container');
            if (!container) return;

            var overlay = container.querySelector('.milestone-overlay');
            var notification = container.querySelector('.milestone-notification');

            if (overlay) overlay.classList.remove('milestone-overlay--visible');
            if (notification) notification.classList.remove('milestone-notification--visible');

            // Remove from DOM after animation
            setTimeout(function() {
                container.style.display = 'none';
            }, 400);

            // Mark milestone as seen via AJAX
            jQuery.post(ajaxurl, {
                action: 'embedpress_mark_milestone_seen',
                nonce: '" . wp_create_nonce('embedpress_milestone_nonce') . "'
            });
        }
        ";
    }

    /**
     * Render the milestone notification HTML
     */
    public function render_milestone_notification()
    {
        // Only show on main dashboard
        $screen = get_current_screen();
        if (!$screen || $screen->id !== 'dashboard') {
            return;
        }

        // Check if milestone should be shown
        if (!$this->should_show_milestone()) {
            return;
        }

        // Get milestone data
        $data = $this->get_milestone_data();

        // Check if Black Friday banner should be shown (until December 4, 2025)
        $show_bfriday_banner = (time() < strtotime('2025-12-04 23:59:59'));

?>
        <div id="embedpress-milestone-container" style="display: none;">
            <div class="milestone-overlay">
                <div class="milestone-notification" onclick="event.stopPropagation()">
                    <!-- Header -->
                    <div class="milestone-header">
                        <h2 class="milestone-title"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 91.226 91.226">
                                <g transform="translate(0 0)">
                                    <path d="M187.4,174.9v12.5H174.9V192.5h17.6V174.9Z" transform="translate(-101.271 -101.271)" fill="#25396F"></path>
                                    <path d="M88.255,38.749A22.6,22.6,0,0,0,71.163,27.383,22.279,22.279,0,0,0,58.912,29.4c-.421.21-.884.421-1.305.674A22.538,22.538,0,0,0,46.915,43.338h0L34.622,78.405a12.808,12.808,0,0,1-5.767,7.241c-.21.126-.463.253-.716.379A12.309,12.309,0,0,1,21.53,87.12a12.181,12.181,0,0,1-9.177-6.1A12.027,12.027,0,0,1,11.3,71.838a12.16,12.16,0,0,1,5.767-7.283c.253-.126.463-.253.716-.379a12.243,12.243,0,0,1,6.609-1.095c.084,0,.168.042.253.042l-2.526,7.367a.955.955,0,0,0,.589,1.221l6.525,2.1a.91.91,0,0,0,1.179-.589l5.641-16.039a1.536,1.536,0,0,0-.084-1.221,1.445,1.445,0,0,0-.968-.8l-5.936-1.726a1.5,1.5,0,0,0-.421-.084l-.547-.168v.042c-.842-.21-1.684-.337-2.526-.463a22.488,22.488,0,0,0-12.293,2.021c-.463.21-.884.463-1.305.674A22.524,22.524,0,0,0,1.2,69.017,22.242,22.242,0,0,0,3.175,86.109,22.6,22.6,0,0,0,20.267,97.476a22.279,22.279,0,0,0,12.25-2.021c.421-.21.884-.421,1.305-.674A22.417,22.417,0,0,0,44.473,81.563h0L56.85,46.5v-.126c1.389-3.536,3.157-5.767,5.725-7.2.21-.126.463-.253.716-.379A12.309,12.309,0,0,1,69.9,37.7a12.069,12.069,0,0,1,4.462,22.564c-.253.126-.463.253-.716.379A12.393,12.393,0,0,1,67,61.735a11.96,11.96,0,0,1-2.063-.421h-.084l-3.789-1.137a.756.756,0,0,0-.968.505L57.144,69.06a.8.8,0,0,0,.547,1.052l4.673,1.347a20,20,0,0,0,3.452.674,22.342,22.342,0,0,0,12.25-2.021h.042c.463-.21.884-.463,1.347-.674A22.671,22.671,0,0,0,88.255,38.749Z" transform="translate(-0.186 -15.764)" fill="#25396F"></path>
                                    <path d="M0,0V17.6H5.094V5.094H17.555V0Z" fill="#25396F"></path>
                                </g>
                            </svg> EmbedPress Milestone</h2>
                        <button class="milestone-close" onclick="hideEmbedPressMilestone(event)" aria-label="Close">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" fill="currentColor" />
                            </svg>
                        </button>
                    </div>

                    <?php if ($show_bfriday_banner): ?>
                        <div class="bfriday-deal-campaign">
                            <a href="https://embedpress.com/in/bfcm2025-unlock-advanced-analytics" target="_blank">
                                <img src="<?php echo esc_url(EMBEDPRESS_URL_ASSETS . 'images/bfcm2025-banner.png'); ?>" alt="Black Friday Sale">
                            </a>
                        </div>
                    <?php endif; ?>

                    <!-- Content -->
                    <div class="milestone-content">
                        <!-- Achievement Banner -->
                        <div class="milestone-achievement">
                            <h3 class="milestone-achievement-title">
                                <?php echo $data['emoji']; ?> <?php echo wp_kses_post($data['title']); ?>
                            </h3>
                            <p class="milestone-achievement-subtitle">
                                <?php echo wp_kses_post($data['subtitle']); ?>
                            </p>
                            <a href="<?php echo esc_url(admin_url('admin.php?page=embedpress-analytics')); ?>" class="milestone-link">
                                View Analytics
                            </a>
                        </div>

                        <!-- Stats Grid -->
                        <div class="milestone-stats">
                            <div class="milestone-stats-inner-wrapper">

                                <div class="milestone-stats-inner">
                                    <?php foreach ($data['stats'] as $stat) : ?>
                                        <div class="milestone-stat-card">
                                            <div class="milestone-stat-label"><?php echo esc_html($stat['label']); ?></div>
                                            <div class="milestone-stat-value"><?php echo esc_html($stat['value']); ?></div>
                                        </div>
                                    <?php endforeach; ?>
                                </div>

                                <!-- CTA Button -->
                                <a href="<?php echo esc_url('https://embedpress.com/in/unlock-advanced-analytics'); ?>" target="_blank" class="milestone-cta">
                                     Unlock Pro Insights
                                </a>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </div>
<?php
    }

    /**
     * Get milestone data
     * Fetches real analytics data from the database to show user's embed performance
     */
    private function get_milestone_data()
    {
        // Get Analytics Manager instance
        $analytics_manager = \EmbedPress\Includes\Classes\Analytics\Analytics_Manager::get_instance();

        // Get real analytics data
        $total_embeds = 0;
        $total_views = 0;
        $total_unique_viewers = 0;
        $total_impressions = 0;

        try {
            // Get content count by type
            $content_by_type = $analytics_manager->get_total_content_by_type();
            $total_embeds = isset($content_by_type['total']) ? $content_by_type['total'] : 0;

            // Get total views, impressions, and unique viewers from Data_Collector
            $data_collector = new \EmbedPress\Includes\Classes\Analytics\Data_Collector();
            $total_views = $data_collector->get_total_views();
            $total_impressions = $data_collector->get_total_impressions();
            $total_unique_viewers = $data_collector->get_total_unique_viewers();
        } catch (\Exception $e) {
            // Fallback to default values if there's an error
            error_log('EmbedPress Milestone: Error fetching analytics data - ' . $e->getMessage());
        }

        // Format numbers for display
        $embeds_formatted = $this->format_number($total_embeds);
        $views_formatted = $this->format_number($total_views);
        $unique_views_formatted = $this->format_number($total_unique_viewers);
        $impressions_formatted = $this->format_number($total_impressions);

        // Calculate total interactions (sum of all metrics)
        $total_interactions = $total_embeds + $total_views + $total_unique_viewers + $total_impressions;

        // Get milestone configuration based on total interactions
        $milestone_config = $this->get_milestone_config($total_interactions);

        return array_merge($milestone_config, [
            'stats' => [
                [
                    'label' => 'Total Embeds',
                    'value' => $embeds_formatted
                ],
                [
                    'label' => 'Total Views',
                    'value' => $views_formatted
                ],
                [
                    'label' => 'Unique Views',
                    'value' => $unique_views_formatted
                ],
                [
                    'label' => 'Total Impressions',
                    'value' => $impressions_formatted
                ]
            ]
        ]);
    }

    /**
     * Get milestone configuration based on total interactions
     * Returns unique title, subtitle, and emoji for each milestone level
     */
    private function get_milestone_config($total_interactions)
    {
        // Define milestone levels with unique messages
        $milestones = [
            1000000 => [
                'emoji' => '👑',
                'title' => 'Legendary! <strong>1M+ interactions achieved!</strong>',
                'subtitle' => 'You\'re an <strong>absolute legend</strong>! Your embeds are reaching millions. Pro analytics will help you scale to infinity.',
                'level' => '1m'
            ],
            500000 => [
                'emoji' => '💎',
                'title' => 'Diamond Status! <strong>500K+ interactions!</strong>',
                'subtitle' => 'You\'ve reached <strong>diamond tier</strong>! Your content is viral. Unlock Pro to maximize your massive reach.',
                'level' => '500k'
            ],
            250000 => [
                'emoji' => '🏆',
                'title' => 'Champion! <strong>250K+ interactions unlocked!</strong>',
                'subtitle' => 'You\'re a <strong>true champion</strong>! Your embeds are crushing it. Get Pro insights to dominate even more.',
                'level' => '250k'
            ],
            100000 => [
                'emoji' => '🌟',
                'title' => 'Superstar! <strong>100K+ interactions reached!</strong>',
                'subtitle' => 'You\'re a <strong>superstar</strong>! Your content is exploding. Upgrade to Pro for enterprise-level analytics.',
                'level' => '100k'
            ],
            50000 => [
                'emoji' => '�',
                'title' => 'Incredible! <strong>50K+ interactions achieved!</strong>',
                'subtitle' => 'You\'re a <strong>Pro</strong>! Unlock advanced analytics to scale even further and dominate your niche.',
                'level' => '50k'
            ],
            20000 => [
                'emoji' => '🔥',
                'title' => 'Amazing! <strong>20K+ interactions and counting!</strong>',
                'subtitle' => 'Your embeds are <strong>on fire</strong>! Get Pro to unlock powerful insights and boost performance.',
                'level' => '20k'
            ],
            10000 => [
                'emoji' => '⭐',
                'title' => 'Fantastic! You\'ve reached <strong>10K</strong> interactions!',
                'subtitle' => 'You\'re doing <strong>great</strong>! Upgrade to Pro to see detailed analytics and grow even faster.',
                'level' => '10k'
            ],
            5000 => [
                'emoji' => '🎯',
                'title' => 'Awesome! <strong>5K interactions milestone unlocked!</strong>',
                'subtitle' => 'Your content is <strong>resonating</strong>! Unlock Pro to discover what\'s working best.',
                'level' => '5k'
            ],
            1000 => [
                'emoji' => '🎉',
                'title' => 'Congratulations! <strong>1K+ interactions reached!</strong>',
                'subtitle' => 'Your embeds are <strong>gaining traction</strong>! Upgrade to Pro to see advanced analytics and improve performance.',
                'level' => '1k'
            ]
        ];

        // Find the appropriate milestone level
        foreach ($milestones as $threshold => $config) {
            if ($total_interactions >= $threshold) {
                return $config;
            }
        }

        // Default for users below 1K interactions
        return [
            'emoji' => '👋',
            'title' => 'Welcome! Your <strong>embed journey</strong> has begun!',
            'subtitle' => 'Start measuring your embed performance today. Gain deeper insights, monitor engagement, and level up with EmbedPress Pro.',
            'level' => 'starter'
        ];
    }

    /**
     * Format number for display (e.g., 1000 -> 1K, 1000000 -> 1M)
     *
     * @param int $number
     * @return string
     */
    private function format_number($number)
    {
        $number = (int) $number;

        if ($number === 0) {
            return '0';
        }

        if ($number >= 1000000) {
            return round($number / 1000000, 1) . 'M';
        }

        if ($number >= 1000) {
            return round($number / 1000, 1) . 'K';
        }

        return (string) $number;
    }

    /**
     * Check if milestone should be shown
     * Shows milestone when:
     * 1. Plugin version has changed (for all users), OR
     * 2. Site reaches a new milestone level
     */
    private function should_show_milestone()
    {
        // Check if Pro is active - don't show milestone for Pro users
        $license_info = \EmbedPress\Includes\Classes\Helper::get_license_info();
        if ($license_info['is_pro_active']) {
            return false;
        }

        // Version-based trigger: Show milestone on version change
        $stored_version = get_option('embedpress_last_milestone_version', '');
        $current_version = EMBEDPRESS_VERSION;

        // If version has changed, show milestone to all users
        if ($stored_version !== $current_version) {
            update_option('embedpress_milestone_current_trigger', 'version_update');
            update_option('is_embedpress_milestone_showing', true);
            return true;
        }

        // Get Analytics Manager instance
        $analytics_manager = \EmbedPress\Includes\Classes\Analytics\Analytics_Manager::get_instance();

        // Get real analytics data
        $total_embeds = 0;
        $total_views = 0;
        $total_unique_viewers = 0;
        $total_impressions = 0;

        try {
            // Get content count by type
            $content_by_type = $analytics_manager->get_total_content_by_type();
            $total_embeds = isset($content_by_type['total']) ? $content_by_type['total'] : 0;

            // Get total views, impressions, and unique viewers from Data_Collector
            $data_collector = new \EmbedPress\Includes\Classes\Analytics\Data_Collector();
            $total_views = $data_collector->get_total_views();
            $total_impressions = $data_collector->get_total_impressions();
            $total_unique_viewers = $data_collector->get_total_unique_viewers();
        } catch (\Exception $e) {
            error_log('EmbedPress Milestone: Error fetching analytics data - ' . $e->getMessage());
            return false;
        }

        // Calculate total interactions
        $total_interactions = $total_embeds + $total_views + $total_unique_viewers + $total_impressions;

        // Determine current milestone level
        $current_level = 'starter';
        if ($total_interactions >= 50000) {
            $current_level = '50k';
        } elseif ($total_interactions >= 20000) {
            $current_level = '20k';
        } elseif ($total_interactions >= 10000) {
            $current_level = '10k';
        } elseif ($total_interactions >= 5000) {
            $current_level = '5k';
        } elseif ($total_interactions >= 1000) {
            $current_level = '1k';
        }

        // Get the last seen milestone level (site-wide option)
        $last_seen_level = get_option('embedpress_milestone_level', '');

        // Show milestone if:
        // 1. Site has never seen any milestone, OR
        // 2. Site has reached a new milestone level
        if (empty($last_seen_level) || $last_seen_level !== $current_level) {
            // Check if this milestone is already showing (not yet dismissed)
            $is_showing = get_option('is_embedpress_milestone_showing', false);
            if ($is_showing) {
                return true; // Still showing, don't reset
            }

            // Don't update here - only update when user closes the notification
            // Store current level temporarily so we can update it later
            update_option('embedpress_milestone_current_level', $current_level);
            update_option('embedpress_milestone_current_trigger', 'milestone_level');
            update_option('is_embedpress_milestone_showing', true);
            return true;
        }

        return false;
    }

    /**
     * AJAX handler to mark milestone as seen
     */
    public function ajax_mark_milestone_seen()
    {
        // Verify nonce
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'embedpress_milestone_nonce')) {
            wp_send_json_error('Invalid nonce');
            return;
        }

        // Get the trigger type (version_update or milestone_level)
        $trigger_type = get_option('embedpress_milestone_current_trigger', 'milestone_level');

        // If triggered by version update, store the current version
        if ($trigger_type === 'version_update') {
            update_option('embedpress_last_milestone_version', EMBEDPRESS_VERSION);
        }

        // Get the current milestone level that was shown
        $current_level = get_option('embedpress_milestone_current_level', '');

        if (!empty($current_level)) {
            // Mark this milestone level as seen (site-wide)
            update_option('embedpress_milestone_level', $current_level);

            // Clean up the temporary option
            delete_option('embedpress_milestone_current_level');
        }

        // Clean up trigger type
        delete_option('embedpress_milestone_current_trigger');

        // Clear the "is showing" flag when user dismisses the milestone
        // This allows the next milestone to be shown when conditions are met
        delete_option('is_embedpress_milestone_showing');

        wp_send_json_success();
    }
}
