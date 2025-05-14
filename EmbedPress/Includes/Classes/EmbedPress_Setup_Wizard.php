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
        add_action('wp_ajax_embedpress_quicksetup_completed', [$this, 'handle_quicksetup_completed']);

        add_action('wp_ajax_embedpress_plugin_toggle', [$this, 'handle_plugin_toggle']);

        add_action('admin_init', [$this, 'embedpress_redirect_after_activation']);
    }

    public function embedpress_redirect_after_activation()
    {
        if (!get_option('embedpress_setup_wizard_init')) {

            update_option('embedpress_setup_wizard_init', true);

            if (! defined('DOING_AJAX') || ! DOING_AJAX) {
                wp_safe_redirect(admin_url('admin.php?page=embedpress-setup-wizard'));
                exit;
            }
        }
    }


    public function embedpress_branding($provider = '')
    {
        $settings = get_option(EMBEDPRESS_PLG_NAME . ':' . $provider, []);

        // Set default values if not present in database
        $defaults = [
            'logo_xpos' => 10,
            'logo_ypos' => 10,
            'logo_opacity' => 50,
            'logo_id' => 0,
            'logo_url' => '',
            'cta_url' => '',
            'branding' => isset($settings['logo_url']) && !empty($settings['logo_url']) ? 'yes' : 'no'
        ];

        // Merge saved settings with defaults, preferring saved values
        $settings = wp_parse_args($settings, $defaults);

        // Ensure proper data types
        $settings['logo_xpos'] = absint($settings['logo_xpos']);
        $settings['logo_ypos'] = absint($settings['logo_ypos']);
        $settings['logo_opacity'] = absint($settings['logo_opacity']);
        $settings['logo_id'] = absint($settings['logo_id']);
        $settings['logo_url'] = esc_url_raw($settings['logo_url']);
        $settings['cta_url'] = esc_url_raw($settings['cta_url']);
        $settings['branding'] = sanitize_text_field($settings['branding']);

        return $settings;
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

            $youtube     = EMBEDPRESS_PLG_NAME . ':youtube';
            $vimeo     = EMBEDPRESS_PLG_NAME . ':vimeo';

            $yt_settings     = get_option($youtube);
            $vimeo_settings     = get_option($vimeo);

            wp_localize_script('embedpress_quick-setup-wizard', 'quickSetup', array(
                'ajaxurl'       => esc_url(admin_url('admin-ajax.php')),
                'admin_url'       => esc_url(admin_url()),
                'nonce'         => wp_create_nonce('ep_qs_settings_nonce'),
                'success_image' => EMBEDPRESS_PLUGIN_URL . 'assets/admin/images/quick-setup/success.gif',
                'embedpress_quick_setup_data' => '$this->embedpress_quick_setup_data()',
                'EMBEDPRESS_QUICKSETUP_ASSETS_URL' => EMBEDPRESS_QUICKSETUP_ASSETS_URL,
                'EMBEDPRESS_SETTINGS_ASSETS_URL' => EMBEDPRESS_SETTINGS_ASSETS_URL,
                'notificationx' => file_exists(WP_PLUGIN_DIR . '/notificationx/notificationx.php'),
                'betterlinks' => file_exists(WP_PLUGIN_DIR . '/betterlinks/betterlinks.php'),
                'betterdocs' => file_exists(WP_PLUGIN_DIR . '/betterdocs/betterdocs.php'),
                'betterpayment' => file_exists(WP_PLUGIN_DIR . '/better-payment/better-payment.php'),
                'isActiveNotificationx' => is_plugin_active('notificationx/notificationx.php'),
                'isActiveBetterlinks' => is_plugin_active('betterlinks/betterlinks.php'),
                'isActiveBetterdocs' => is_plugin_active('betterdocs/betterdocs.php'),
                'isActiveBetterpayment' => is_plugin_active('better-payment/better-payment.php'),
                'isEmbedPressProActive' => is_plugin_active('embedpress-pro/embedpress-pro.php'),
                'settingsData' => get_option(EMBEDPRESS_PLG_NAME) ?? [],
                'brandingData' => array_reduce(
                    ['youtube', 'vimeo', 'wistia', 'twitch', 'dailymotion', 'document'],
                    function ($result, $provider) {
                        $result[$provider] = $this->embedpress_branding($provider);
                        return $result;
                    },
                    []
                ),

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

        if (!isset($_POST['ep_qs_settings_nonce']) || !wp_verify_nonce($_POST['ep_qs_settings_nonce'], 'ep_qs_settings_nonce')) {
            wp_send_json_error(['message' => 'Invalid nonce']);
            return;
        }

        if (Helper::is_pro_active()) {
            $providers = ['youtube', 'vimeo', 'wistia', 'twitch', 'dailymotion', 'document'];
            $branding_fields = ['logo_url', 'logo_id', 'logo_opacity', 'logo_xpos', 'logo_ypos', 'cta_url'];

            error_log(print_r($_POST, true));

            // Process branding settings for each provider
            foreach ($providers as $provider) {
                $branding_key = "{$provider}_branding";
                $branding_value = isset($_POST[$branding_key]) ? sanitize_text_field($_POST[$branding_key]) : 'no';

                if ($branding_value === 'yes') {
                    // Only save branding data if branding is enabled
                    $branding_data = [
                        'branding' => 'yes'
                    ];

                    foreach ($branding_fields as $field) {
                        $key = "{$provider}_{$field}";
                        if (isset($_POST[$key])) {
                            $branding_data[$field] = sanitize_text_field($_POST[$key]);
                        }
                    }
                    error_log(print_r($branding_data, true));

                    update_option(EMBEDPRESS_PLG_NAME . ':' . $provider, $branding_data);
                } else {
                    // If branding is disabled, only save that state
                    update_option(EMBEDPRESS_PLG_NAME . ':' . $provider, ['branding' => 'no']);
                }
            }
        }

        // Process general settings
        $settings = get_option(EMBEDPRESS_PLG_NAME, []);
        foreach ($_POST as $key => $value) {
            if ($key !== 'action' && $key !== 'submit' && $key !== 'ep_qs_settings_nonce') {
                if ($value === '1' || $value === '0') {
                    $settings[$key] = (bool) $value;
                } else {
                    $settings[$key] = sanitize_text_field($value);
                }
            }
        }

        // error_log(print_r($_POST, true));
        error_log(print_r($settings, true));



        update_option(EMBEDPRESS_PLG_NAME, $settings);
        wp_send_json_success(['message' => 'Settings saved successfully']);
    }

    public function handle_quicksetup_completed()
    {
        if (!current_user_can('manage_options')) {
            wp_send_json_error(['message' => 'You do not have sufficient permissions']);
            return;
        }

        if (!isset($_POST['ep_qs_settings_nonce']) || !wp_verify_nonce($_POST['ep_qs_settings_nonce'], 'ep_qs_settings_nonce')) {
            wp_send_json_error(['message' => 'Invalid nonce']);
            return;
        }
        update_option('embedpress_setup_wizard_init', true);
        wp_send_json_success(['message' => 'Setup wizard completed']);
    }

    public function handle_plugin_toggle()
    {

        if (!current_user_can('manage_options')) {
            wp_send_json_error(['message' => 'You do not have sufficient permissions']);
            return;
        }

        if (!isset($_POST['_nonce']) || !wp_verify_nonce($_POST['_nonce'], 'ep_qs_settings_nonce')) {
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
