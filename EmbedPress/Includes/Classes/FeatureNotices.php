<?php

namespace EmbedPress\Includes\Classes;

/**
 * Feature Notices Registration
 * 
 * This file contains all feature notice registrations for EmbedPress.
 * Add your feature notices here to keep them organized in one place.
 * 
 * @package EmbedPress
 * @since 4.1.0
 */

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

class FeatureNotices
{

    /**
     * Singleton instance
     * @var FeatureNotices
     */
    private static $instance = null;

    /**
     * Get singleton instance
     * 
     * @return FeatureNotices
     */
    public static function get_instance()
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Constructor
     */
    private function __construct()
    {
        // Register all notices
        add_action('init', [$this, 'register_all_notices']);
    }

    /**
     * Register all feature notices
     * 
     * Add your feature notices here. Each notice should have a unique ID.
     * 
     * @return void
     */
    public function register_all_notices()
    {
        $notice_manager = FeatureNoticeManager::get_instance();

        // ========================================
        // ACTIVE NOTICES
        // ========================================
        // Note: Notices only show on Dashboard page (/wp-admin/index.php)
        // Any action (Skip, Close, or Click Button) = Permanently dismiss

        // Analytics Dashboard Feature Notice
        $notice_manager->register_notice('analytics_dashboard_2024', [
            'title' => 'New Features',
            'icon' => '<svg width="11" height="13" viewBox="0 0 11 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 1.61956C1.26645e-05 1.53091 0.0177073 1.44315 0.0520487 1.36142C0.0863901 1.27968 0.136689 1.20562 0.2 1.14356C0.926563 0.431321 1.89723 0.0227172 2.91444 0.000919081C3.93164 -0.0208791 4.91893 0.345767 5.67533 1.02623L5.90933 1.2449C6.39562 1.67096 7.02013 1.90585 7.66667 1.90585C8.3132 1.90585 8.93771 1.67096 9.424 1.2449L9.59 1.09356C9.99667 0.771563 10.608 1.0289 10.6633 1.54423L10.6667 1.61956V7.61956C10.6667 7.70822 10.649 7.79598 10.6146 7.87771C10.5803 7.95944 10.53 8.03351 10.4667 8.09556C9.7401 8.8078 8.76943 9.21641 7.75223 9.23821C6.73502 9.26 5.74774 8.89336 4.99133 8.2129L4.75733 7.99423C4.28636 7.58157 3.68518 7.3478 3.05915 7.33391C2.43311 7.32001 1.82216 7.52687 1.33333 7.91823V12.2862C1.33314 12.4561 1.26808 12.6196 1.15143 12.7431C1.03479 12.8667 0.875365 12.9411 0.705737 12.951C0.536109 12.961 0.36908 12.9058 0.238778 12.7967C0.108476 12.6877 0.0247357 12.533 0.00466665 12.3642L0 12.2862V1.61956Z" fill="#25396F"/>
</svg>',
            'message' => '🥳 New In EmbedPress: Introducing, Analytics dashboard to track every embed performance; see total counts, views, clicks, geo insights, etc.',
            'button_text' => 'View Analytics',
            'button_url' => admin_url('admin.php?page=embedpress-analytics'),
            'skip_text' => 'Skip',
            'screens' => [], // Empty = show on all admin pages
            'capability' => 'manage_options',
            'start_date' => '2024-01-01',
            'end_date' => '2025-10-31',
            'priority' => 10,
            // 'dismissible' => false,
            'type' => 'info', // info, success, warning, error
        ]);

        // ========================================
        // EXAMPLE NOTICES (Commented Out)
        // ========================================

        /*
        // Example: New Feature Announcement
        $notice_manager->register_notice('new_feature_example', [
            'title' => 'New Features',
            'icon' => '🚀',
            'message' => '<strong>Exciting Update!</strong> We\'ve added amazing new features to EmbedPress.',
            'button_text' => 'Learn More',
            'button_url' => 'https://embedpress.com/features',
            'button_target' => '_blank',
            'skip_text' => 'Maybe Later',
            'screens' => ['toplevel_page_embedpress'], // Show only on EmbedPress pages
            'capability' => 'manage_options',
            'priority' => 5,
            'type' => 'success',
        ]);
        */

        /*
        // Example: Limited Time Offer
        $notice_manager->register_notice('black_friday_2024', [
            'title' => 'Limited Time Offer',
            'icon' => '🎁',
            'message' => '<strong>Black Friday Sale!</strong> Get 50% off on EmbedPress Pro. Offer ends soon!',
            'button_text' => 'Claim Discount',
            'button_url' => 'https://embedpress.com/pricing',
            'button_target' => '_blank',
            'skip_text' => 'Not Interested',
            'start_date' => '2024-11-25',
            'end_date' => '2024-12-02',
            'priority' => 1, // Higher priority (lower number = shown first)
            'type' => 'warning',
        ]);
        */

        /*
        // Example: Important Update Notice
        $notice_manager->register_notice('important_update_2024', [
            'title' => 'Important Update',
            'icon' => '⚠️',
            'message' => '<strong>Action Required:</strong> Please update your settings to ensure compatibility with the latest version.',
            'button_text' => 'Update Settings',
            'button_url' => admin_url('admin.php?page=embedpress#/settings'),
            'skip_text' => 'Remind Me Later',
            'priority' => 1,
            'type' => 'warning',
        ]);
        */

        /*
        // Example: Success/Milestone Notice
        $notice_manager->register_notice('milestone_100k', [
            'title' => 'Thank You!',
            'icon' => '🎊',
            'message' => '<strong>We did it!</strong> EmbedPress has reached 100,000+ active installations. Thank you for being part of our journey!',
            'button_text' => 'Share Your Feedback',
            'button_url' => 'https://wordpress.org/support/plugin/embedpress/reviews/',
            'button_target' => '_blank',
            'skip_text' => 'Close',
            'start_date' => '2024-01-01',
            'end_date' => '2024-12-31',
            'priority' => 15,
            'type' => 'success',
        ]);
        */
    }

    /**
     * Helper method to get admin URL for EmbedPress pages
     * 
     * @param string $page_type The page type (e.g., 'analytics', 'settings')
     * @return string
     */
    private function get_embedpress_url($page_type = '')
    {
        $url = admin_url('admin.php?page=embedpress');
        if (!empty($page_type)) {
            $url .= '&page_type=' . $page_type;
        }
        return $url;
    }
}

// Initialize the class
FeatureNotices::get_instance();
