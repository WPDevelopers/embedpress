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
            // Auto-show milestone after 2 seconds (you can change this logic)
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
        }

        // Close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                hideEmbedPressMilestone();
            }
        });
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

        // Get milestone data
        $data = $this->get_milestone_data();

        ?>
        <div id="embedpress-milestone-container" style="display: none;">
            <div class="milestone-overlay" onclick="hideEmbedPressMilestone(event)">
                <div class="milestone-notification" onclick="event.stopPropagation()">
                    <!-- Header -->
                    <div class="milestone-header">
                        <h2 class="milestone-title">Your Milestones</h2>
                        <button class="milestone-close" onclick="hideEmbedPressMilestone(event)" aria-label="Close">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" fill="currentColor"/>
                            </svg>
                        </button>
                    </div>

                    <!-- Content -->
                    <div class="milestone-content">
                        <!-- Achievement Banner -->
                        <div class="milestone-achievement">
                            <h3 class="milestone-achievement-title">
                                You've reached <span class="milestone-highlight"><?php echo esc_html($data['installations']); ?> active installations</span>
                            </h3>
                            <p class="milestone-achievement-subtitle">
                                Setup almost complete unlock full performance insights
                            </p>
                            <a href="<?php echo esc_url(admin_url('admin.php?page=embedpress#/analytics')); ?>" class="milestone-link">
                                View Analytics
                            </a>
                        </div>

                        <!-- Stats Grid -->
                        <div class="milestone-stats">
                            <div class="milestone-stats-inner">
                                <?php foreach ($data['stats'] as $stat) : ?>
                                    <div class="milestone-stat-card">
                                        <div class="milestone-stat-label"><?php echo esc_html($stat['label']); ?></div>
                                        <div class="milestone-stat-value"><?php echo esc_html($stat['value']); ?></div>
                                    </div>
                                <?php endforeach; ?>
                            </div>

                            <!-- CTA Button -->
                            <button class="milestone-cta" onclick="hideEmbedPressMilestone(event)">
                                Unlock Premium Analytics
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <?php
    }

    /**
     * Get milestone data
     * You can customize this to fetch real data from your database
     */
    private function get_milestone_data()
    {
        // Example data - replace with actual data from your database
        return [
            'installations' => '32K+',
            'stats' => [
                [
                    'label' => 'Total Embeds',
                    'value' => '100k'
                ],
                [
                    'label' => 'Total Views',
                    'value' => '200k'
                ],
                [
                    'label' => 'Active Users',
                    'value' => '80k'
                ],
                [
                    'label' => 'Countries',
                    'value' => '30+'
                ]
            ]
        ];
    }

    /**
     * Check if milestone should be shown
     * Add your logic here to determine when to show the milestone
     */
    private function should_show_milestone()
    {
        // Example: Check if user has seen the milestone
        $user_id = get_current_user_id();
        $seen = get_user_meta($user_id, 'embedpress_milestone_seen', true);
        
        if ($seen) {
            return false;
        }

        // Check if milestone criteria is met
        // For example: check total installations, embeds, etc.
        
        return true;
    }

    /**
     * Mark milestone as seen
     */
    public static function mark_as_seen()
    {
        $user_id = get_current_user_id();
        update_user_meta($user_id, 'embedpress_milestone_seen', true);
    }
}

