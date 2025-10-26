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
        add_action('admin_enqueue_scripts', [$this, 'enqueue_assets']);
        add_action('wp_ajax_embedpress_dismiss_feature_notice', [$this, 'ajax_dismiss_notice']);
        add_action('wp_ajax_embedpress_skip_feature_notice', [$this, 'ajax_skip_notice']);

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
            'icon' => '🎉',
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
        
        // Check capability
        if (!current_user_can($notice['capability'])) {
            return false;
        }
        
        // Check if dismissed
        $dismissed = get_option(self::DISMISSED_NOTICES_OPTION, []);
        if (in_array($id, $dismissed)) {
            return false;
        }
        
        // Check if skipped (and skip time hasn't expired)
        $skipped = get_option(self::SKIPPED_NOTICES_OPTION, []);
        if (isset($skipped[$id])) {
            $skip_time = $skipped[$id];
            // Show again after 7 days
            if (time() - $skip_time < (7 * DAY_IN_SECONDS)) {
                return false;
            }
        }
        
        // Check date range
        if ($notice['start_date'] && strtotime($notice['start_date']) > time()) {
            return false;
        }
        
        if ($notice['end_date'] && strtotime($notice['end_date']) < time()) {
            return false;
        }
        
        // Check screen
        if (!empty($notice['screens'])) {
            $screen = get_current_screen();
            if ($screen && !in_array($screen->id, $notice['screens'])) {
                return false;
            }
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

        // Add badge to EmbedPress menu
        foreach ($menu as $key => $item) {
            if (isset($item[2]) && $item[2] === 'embedpress') {
                $menu[$key][0] .= ' <span class="embedpress-menu-badge"></span>';
                break;
            }
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
        $icon = !empty($notice['icon']) ? $notice['icon'] : '🎉';
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
     * Enqueue assets
     */
    public function enqueue_assets() {
        // Only enqueue if there's a notice to show
        $has_notice = false;
        foreach ($this->notices as $id => $notice) {
            if ($this->should_display_notice($id)) {
                $has_notice = true;
                break;
            }
        }
        
        if (!$has_notice) {
            return;
        }
        
        wp_enqueue_style(
            'embedpress-feature-notices',
            EMBEDPRESS_URL_STATIC . 'css/feature-notices.css',
            [],
            EMBEDPRESS_VERSION
        );

        wp_enqueue_script(
            'embedpress-feature-notices',
            EMBEDPRESS_URL_STATIC . 'js/feature-notices.js',
            ['jquery'],
            EMBEDPRESS_VERSION,
            true
        );
        
        wp_localize_script('embedpress-feature-notices', 'embedpressFeatureNotices', [
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('embedpress_feature_notice'),
        ]);
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
     */
    public function ajax_skip_notice() {
        check_ajax_referer('embedpress_feature_notice', 'nonce');
        
        $notice_id = isset($_POST['notice_id']) ? sanitize_text_field($_POST['notice_id']) : '';
        
        if (empty($notice_id)) {
            wp_send_json_error(['message' => 'Invalid notice ID']);
        }
        
        $skipped = get_option(self::SKIPPED_NOTICES_OPTION, []);
        $skipped[$notice_id] = time();
        update_option(self::SKIPPED_NOTICES_OPTION, $skipped);
        
        wp_send_json_success(['message' => 'Notice skipped']);
    }
}

