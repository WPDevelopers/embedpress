<?php
namespace EmbedPress\Includes\Classes;

/**
 * Feature Notice Manager
 * 
 * A modern, reusable notice system for announcing new features and important updates.
 * Displays beautiful notices in the WordPress admin with customizable content, buttons, and actions.
 * 
 * @package EmbedPress
 * @since 4.1.0
 */

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

class FeatureNoticeManager {
    
    /**
     * Option name for storing dismissed notices
     */
    const DISMISSED_NOTICES_OPTION = 'embedpress_dismissed_feature_notices';
    
    /**
     * Option name for storing skipped notices
     */
    const SKIPPED_NOTICES_OPTION = 'embedpress_skipped_feature_notices';
    
    /**
     * Registered notices
     * @var array
     */
    private $notices = [];
    
    /**
     * Singleton instance
     * @var FeatureNoticeManager
     */
    private static $instance = null;
    
    /**
     * Get singleton instance
     * 
     * @return FeatureNoticeManager
     */
    public static function get_instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    /**
     * Constructor
     */
    private function __construct() {
        // Render tooltip in admin footer instead of admin_notices
        add_action('admin_footer', [$this, 'display_menu_tooltip']);
        add_action('wp_ajax_embedpress_dismiss_feature_notice', [$this, 'ajax_dismiss_notice']);
        add_action('wp_ajax_embedpress_skip_feature_notice', [$this, 'ajax_skip_notice']);
        add_action('wp_ajax_embedpress_view_feature_notice', [$this, 'ajax_view_notice']);

        // Add menu badge indicator
        add_action('admin_menu', [$this, 'add_menu_badge'], 999);
    }
    
    /**
     * Register a new feature notice
     * 
     * @param string $id Unique notice ID
     * @param array $args Notice configuration
     * 
     * Example usage:
     * FeatureNoticeManager::get_instance()->register_notice('analytics_dashboard', [
     *     'title' => 'New Features',
     *     'icon' => '🎉',
     *     'message' => 'New In EmbedPress: Introducing Analytics dashboard...',
     *     'button_text' => 'View Analytics',
     *     'button_url' => admin_url('admin.php?page=embedpress&page_type=analytics'),
     *     'skip_text' => 'Skip',
     *     'screens' => ['toplevel_page_embedpress'], // Show only on specific screens
     *     'capability' => 'manage_options',
     *     'start_date' => '2024-01-01', // Optional: when to start showing
     *     'end_date' => '2024-12-31', // Optional: when to stop showing
     *     'priority' => 10,
     * ]);
     */
    public function register_notice($id, $args = []) {
        $defaults = [
            'title' => 'New Features',
            'icon' => '<svg width="11" height="13" viewBox="0 0 11 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 1.61956C1.26645e-05 1.53091 0.0177073 1.44315 0.0520487 1.36142C0.0863901 1.27968 0.136689 1.20562 0.2 1.14356C0.926563 0.431321 1.89723 0.0227172 2.91444 0.000919081C3.93164 -0.0208791 4.91893 0.345767 5.67533 1.02623L5.90933 1.2449C6.39562 1.67096 7.02013 1.90585 7.66667 1.90585C8.3132 1.90585 8.93771 1.67096 9.424 1.2449L9.59 1.09356C9.99667 0.771563 10.608 1.0289 10.6633 1.54423L10.6667 1.61956V7.61956C10.6667 7.70822 10.649 7.79598 10.6146 7.87771C10.5803 7.95944 10.53 8.03351 10.4667 8.09556C9.7401 8.8078 8.76943 9.21641 7.75223 9.23821C6.73502 9.26 5.74774 8.89336 4.99133 8.2129L4.75733 7.99423C4.28636 7.58157 3.68518 7.3478 3.05915 7.33391C2.43311 7.32001 1.82216 7.52687 1.33333 7.91823V12.2862C1.33314 12.4561 1.26808 12.6196 1.15143 12.7431C1.03479 12.8667 0.875365 12.9411 0.705737 12.951C0.536109 12.961 0.36908 12.9058 0.238778 12.7967C0.108476 12.6877 0.0247357 12.533 0.00466665 12.3642L0 12.2862V1.61956Z" fill="#25396F"/>
</svg>',
            'message' => '',
            'button_text' => 'Learn More',
            'button_url' => '',
            'button_target' => '_self',
            'skip_text' => 'Skip',
            'screens' => [], // Empty means show on all admin pages
            'capability' => 'manage_options',
            'start_date' => null,
            'end_date' => null,
            'priority' => 10,
            'dismissible' => true,
            'type' => 'info', // info, success, warning, error
        ];
        
        $this->notices[$id] = wp_parse_args($args, $defaults);
        $this->notices[$id]['id'] = $id;
    }
    
    /**
     * Check if a notice should be displayed
     *
     * @param string $id Notice ID
     * @return bool
     */
    private function should_display_notice($id) {
        if (!isset($this->notices[$id])) {
            return false;
        }

        $notice = $this->notices[$id];

        // Only show on dashboard page
        $screen = get_current_screen();
        if (!$screen || $screen->id !== 'dashboard') {
            return false;
        }

        // Check capability
        if (!current_user_can($notice['capability'])) {
            return false;
        }

        // Check if dismissed (any action = permanent dismiss)
        $dismissed = get_option(self::DISMISSED_NOTICES_OPTION, []);
        if (in_array($id, $dismissed)) {
            return false;
        }

        // Check date range
        if ($notice['start_date'] && strtotime($notice['start_date']) > time()) {
            return false;
        }

        if ($notice['end_date'] && strtotime($notice['end_date']) < time()) {
            return false;
        }

        return true;
    }
    
    /**
     * Add badge indicator to EmbedPress menu
     */
    public function add_menu_badge() {
        global $menu;

        // Check if there's any active notice
        $has_active_notice = false;
        foreach ($this->notices as $id => $notice) {
            if ($this->should_display_notice($id)) {
                $has_active_notice = true;
                break;
            }
        }

        if (!$has_active_notice) {
            return;
        }
    }

    /**
     * Display menu tooltip
     *
     * Renders tooltip/popover next to EmbedPress menu item
     */
    public function display_menu_tooltip() {
        // Get the highest priority notice
        $notice_to_display = null;
        $notice_id = null;

        foreach ($this->notices as $id => $notice) {
            if ($this->should_display_notice($id)) {
                if ($notice_to_display === null || $notice['priority'] < $notice_to_display['priority']) {
                    $notice_to_display = $notice;
                    $notice_id = $id;
                }
            }
        }

        if (!$notice_to_display) {
            return;
        }

        // Render tooltip HTML to be injected via JavaScript
        ?>
        <script type="text/html" id="embedpress-feature-tooltip-template">
            <?php $this->render_tooltip($notice_id, $notice_to_display); ?>
        </script>
        <script type="text/javascript">
            jQuery(document).ready(function($) {
                // Inject tooltip into menu item
                var $menuItem = $('#toplevel_page_embedpress');
                if ($menuItem.length) {
                    var tooltipHtml = $('#embedpress-feature-tooltip-template').html();
                    $menuItem.append(tooltipHtml);
                }
            });
        </script>
        <?php
    }

    /**
     * Render tooltip/popover
     *
     * @param string $id Notice ID
     * @param array $notice Notice configuration
     */
    private function render_tooltip($id, $notice) {

        error_log(print_r($notice, true));

        $icon = !empty($notice['icon']) ? $notice['icon'] : '';
        $title = esc_html($notice['title']);
        $message = wp_kses_post($notice['message']);
        $button_text = esc_html($notice['button_text']);
        $button_url = esc_url($notice['button_url']);
        $button_target = esc_attr($notice['button_target']);
        $skip_text = esc_html($notice['skip_text']);
        $notice_id = esc_attr($id);
        $type = esc_attr($notice['type']);

        ?>
        <div id="embedpress-feature-tooltip" class="embedpress-feature-tooltip embedpress-feature-tooltip--<?php echo $type; ?>" data-notice-id="<?php echo $notice_id; ?>" style="visibility: hidden; opacity: 0;">
            <div class="embedpress-feature-tooltip__arrow"></div>
            <button type="button" class="embedpress-feature-tooltip__close" aria-label="Close">
                <span class="dashicons dashicons-no-alt"></span>
            </button>
            <div class="embedpress-feature-tooltip__header">
                <span class="embedpress-feature-tooltip__icon"><?php echo $icon; ?></span>
                <h3 class="embedpress-feature-tooltip__title"><?php echo $title; ?></h3>
            </div>
            <div class="embedpress-feature-tooltip__content">
                <div class="embedpress-feature-tooltip__message">
                    <?php echo $message; ?>
                </div>
                <div class="embedpress-feature-tooltip__actions">
                    <?php if ($notice['skip_text']): ?>
                        <button type="button" class="embedpress-feature-tooltip__skip" data-action="skip">
                            <?php echo $skip_text; ?>
                        </button>
                    <?php endif; ?>

                    <?php if ($notice['button_text'] && $notice['button_url']): ?>
                        <a href="<?php echo $button_url; ?>"
                           target="<?php echo $button_target; ?>"
                           class="embedpress-feature-tooltip__button">
                            <?php echo $button_text; ?>
                        </a>
                    <?php endif; ?>
                </div>
            </div>
        </div>
        <?php
    }

    /**
     * AJAX handler for dismissing a notice
     */
    public function ajax_dismiss_notice() {
        check_ajax_referer('embedpress_feature_notice', 'nonce');
        
        $notice_id = isset($_POST['notice_id']) ? sanitize_text_field($_POST['notice_id']) : '';
        
        if (empty($notice_id)) {
            wp_send_json_error(['message' => 'Invalid notice ID']);
        }
        
        $dismissed = get_option(self::DISMISSED_NOTICES_OPTION, []);
        if (!in_array($notice_id, $dismissed)) {
            $dismissed[] = $notice_id;
            update_option(self::DISMISSED_NOTICES_OPTION, $dismissed);
        }
        
        wp_send_json_success(['message' => 'Notice dismissed']);
    }
    
    /**
     * AJAX handler for skipping a notice
     * Skip = Permanent dismiss (same as close button)
     */
    public function ajax_skip_notice() {
        check_ajax_referer('embedpress_feature_notice', 'nonce');

        $notice_id = isset($_POST['notice_id']) ? sanitize_text_field($_POST['notice_id']) : '';

        if (empty($notice_id)) {
            wp_send_json_error(['message' => 'Invalid notice ID']);
        }

        // Permanently dismiss (same as close button)
        $dismissed = get_option(self::DISMISSED_NOTICES_OPTION, []);
        if (!in_array($notice_id, $dismissed)) {
            $dismissed[] = $notice_id;
            update_option(self::DISMISSED_NOTICES_OPTION, $dismissed);
        }

        wp_send_json_success(['message' => 'Notice dismissed']);
    }

    /**
     * AJAX handler for viewing a notice (clicking primary button)
     * View = Permanent dismiss (user engaged with the notice)
     */
    public function ajax_view_notice() {
        check_ajax_referer('embedpress_feature_notice', 'nonce');

        $notice_id = isset($_POST['notice_id']) ? sanitize_text_field($_POST['notice_id']) : '';

        if (empty($notice_id)) {
            wp_send_json_error(['message' => 'Invalid notice ID']);
        }

        // Permanently dismiss (user clicked the button)
        $dismissed = get_option(self::DISMISSED_NOTICES_OPTION, []);
        if (!in_array($notice_id, $dismissed)) {
            $dismissed[] = $notice_id;
            update_option(self::DISMISSED_NOTICES_OPTION, $dismissed);
        }

        wp_send_json_success(['message' => 'Notice dismissed']);
    }
}

