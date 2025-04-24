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
                array('jquery'), // Optional but recommended
                EMBEDPRESS_PLUGIN_VERSION,
                true
            );

            wp_localize_script('embedpress_quick-setup-wizard', 'quickSetup', array(
                'ajaxurl'       => esc_url(admin_url('admin-ajax.php')),
                'nonce'         => wp_create_nonce('essential-addons-elementor'),
                'success_image' => EMBEDPRESS_PLUGIN_URL . 'assets/admin/images/quick-setup/success.gif',
                'embedpress_quick_setup_data' => '$this->embedpress_quick_setup_data()', // ✅ Fix this to actually call the method
                'EMBEDPRESS_QUICKSETUP_ASSETS_URL' => EMBEDPRESS_QUICKSETUP_ASSETS_URL,
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
}
