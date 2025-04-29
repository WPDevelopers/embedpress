<?php

namespace EmbedPress\Includes\Classes;

if (!defined('ABSPATH')) {
    exit;
} // Exit if accessed directly.

class EmbedPress_Setup_Wizard
{

    public function __construct()
    {
        add_action('admin_enqueue_scripts', array($this, 'setup_wizard_scripts'));
        add_action('admin_menu', array($this, 'admin_menu'));

        add_action('wp_ajax_embedpress_quicksetup_save_settings', [$this, 'handle_quicksetup_save_settings']);
        add_action('wp_ajax_embedpress_plugin_toggle', [$this, 'handle_plugin_toggle']);
    }


    /**
     * setup_wizard_scripts
     * @param $hook
     * @return array
     */
    public function setup_wizard_scripts($hook)
    {
        if (isset($hook) && $hook === 'admin_page_embedpress-setup-wizard') {

            // ✅ Enqueue WordPress media uploader
            wp_enqueue_media();

            wp_enqueue_style(
                'embedpress_quick-setup-wizard',
                EMBEDPRESS_PLUGIN_URL . 'EmbedPress/Ends/Back/QuickSetup/build/quicksetup.min.css',
                false,
                EMBEDPRESS_PLUGIN_VERSION
            );

            wp_enqueue_script(
                'embedpress_quick-setup-wizard',
                EMBEDPRESS_PLUGIN_URL . 'EmbedPress/Ends/Back/QuickSetup/build/quicksetup.min.js',
                array('jquery'),
                EMBEDPRESS_PLUGIN_VERSION,
                true
            );

            wp_localize_script('embedpress_quick-setup-wizard', 'quickSetup', array(
                'ajaxurl'       => esc_url(admin_url('admin-ajax.php')),
                'nonce'         => wp_create_nonce('ep_settings_nonce'),
                'success_image' => EMBEDPRESS_PLUGIN_URL . 'assets/admin/images/quick-setup/success.gif',
                'embedpress_quick_setup_data' => '$this->embedpress_quick_setup_data()',
                'EMBEDPRESS_QUICKSETUP_ASSETS_URL' => EMBEDPRESS_QUICKSETUP_ASSETS_URL,
                'notificationx' => file_exists(WP_PLUGIN_DIR . '/notificationx/notificationx.php'),
                'betterlinks' => file_exists(WP_PLUGIN_DIR . '/betterlinks/betterlinks.php'),
                'betterdocs' => file_exists(WP_PLUGIN_DIR . '/betterdocs/betterdocs.php'),
                'betterpayment' => file_exists(WP_PLUGIN_DIR . '/better-payment/better-payment.php'),
                'isActiveNotificationx' => is_plugin_active('notificationx/notificationx.php'),
                'isActiveBetterlinks' => is_plugin_active('betterlinks/betterlinks.php'),
                'isActiveBetterdocs' => is_plugin_active('betterdocs/betterdocs.php'),
                'isActiveBetterpayment' => is_plugin_active('better-payment/better-payment.php')
            ));
        }

        return [];
    }


    /**
     * render_wizard
     */
    public function render_wizard()
    {
        ?>
        <section id="embedpress-onboard--wrapper" class="embedpress-onboard--wrapper"></section>
<?php
    }

    /**
     * Create admin menu for setup wizard
     */
    public function admin_menu()
    {

        add_submenu_page(
            'admin.php',
            __('EmbedPress ', 'embedpress'),
            __('EmbedPress ', 'embedpress'),
            'manage_options',
            'embedpress-setup-wizard',
            [$this, 'render_wizard']
        );
    }


    public function handle_quicksetup_save_settings()
    {
        if (!current_user_can('manage_options')) {
            wp_send_json_error(['message' => 'You do not have sufficient permissions']);
            return;
        }

        if (!isset($_POST['ep_settings_nonce']) || !wp_verify_nonce($_POST['ep_settings_nonce'], 'ep_settings_nonce')) {
            wp_send_json_error(['message' => 'Invalid nonce']);
            return;
        }

        $settings = get_option(EMBEDPRESS_PLG_NAME, []);

        // Process and sanitize each setting
        foreach ($_POST as $key => $value) {
            if ($key !== 'action' && $key !== 'submit' && $key !== 'ep_settings_nonce') {
                // Convert '1'/'0' strings to booleans for boolean settings
                if ($value === '1' || $value === '0') {
                    $settings[$key] = (bool) $value;
                } else {
                    $settings[$key] = sanitize_text_field($value);
                }
            }
        }

        update_option(EMBEDPRESS_PLG_NAME, $settings);
        wp_send_json_success(['message' => 'Settings saved successfully']);
    }

    public function handle_plugin_toggle()
    {

        if (!current_user_can('manage_options')) {
            wp_send_json_error(['message' => 'You do not have sufficient permissions']);
            return;
        }

        if (!isset($_POST['_nonce']) || !wp_verify_nonce($_POST['_nonce'], 'ep_settings_nonce')) {
            wp_send_json_error(['message' => 'Invalid nonce']);
            return;
        }

        $plugin_slug = sanitize_text_field($_POST['plugin_slug']);
        $plugin_basename = sanitize_text_field($_POST['plugin_basename']);
        $enable = filter_var($_POST['enable'], FILTER_VALIDATE_BOOLEAN);

        if (empty($plugin_slug) || empty($plugin_basename)) {
            wp_send_json_error(['message' => 'Plugin information is missing']);
            return;
        }

        require_once ABSPATH . 'wp-admin/includes/plugin.php';
        require_once ABSPATH . 'wp-admin/includes/plugin-install.php';
        require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
        require_once ABSPATH . 'wp-admin/includes/class-wp-ajax-upgrader-skin.php';

        try {
            if ($enable) {
                // Check if plugin is installed
                if (!file_exists(WP_PLUGIN_DIR . '/' . $plugin_basename)) {
                    // Install plugin
                    $api = plugins_api('plugin_information', ['slug' => $plugin_slug, 'fields' => ['sections' => false]]);
                    if (is_wp_error($api)) {
                        throw new Exception($api->get_error_message());
                    }

                    $upgrader = new \Plugin_Upgrader(new \WP_Ajax_Upgrader_Skin());
                    $install_result = $upgrader->install($api->download_link);

                    if (is_wp_error($install_result)) {
                        throw new Exception($install_result->get_error_message());
                    }
                }

                // Activate plugin
                $activate_result = activate_plugin($plugin_basename);
                if (is_wp_error($activate_result)) {
                    throw new Exception($activate_result->get_error_message());
                }
            } else {
                // Deactivate plugin
                deactivate_plugins($plugin_basename);
            }

            wp_send_json_success(['message' => $enable ? 'Plugin installed and activated' : 'Plugin deactivated']);
        } catch (Exception $e) {
            wp_send_json_error(['message' => $e->getMessage()]);
        }
    }
}
