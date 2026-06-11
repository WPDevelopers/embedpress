<?php

namespace EmbedPress\Includes\Traits;


if (!defined('ABSPATH')) {
    exit;
} // Exit if accessed directly
use \EmbedPress\Includes\Classes\EmbedPress_Plugin_Usage_Tracker;
use \EmbedPress\Includes\Classes\EmbedPress_Notice;

use PriyoMukul\WPNotice\Notices;

use PriyoMukul\WPNotice\Utils\CacheBank;
use PriyoMukul\WPNotice\Utils\NoticeRemover;

trait Shared
{

    private $insights = null;

    /**
     * @var CacheBank
     */
    private static $cache_bank;


    /**
     * Optional usage tracker
     *
     * @since v1.0.0
     */
    public function start_plugin_tracking()
    {
        $this->insights = $tracker = EmbedPress_Plugin_Usage_Tracker::get_instance(EMBEDPRESS_FILE, [
            'opt_in'       => true,
            'goodbye_form' => true,
            'item_id'      => '98ba0ac16a4f7b3b940d'
        ]);
        $tracker->set_notice_options(array(
            'notice' => 'Want to help make <strong>EmbedPress</strong> even more awesome? You can get a <strong>10% discount coupon</strong> for Premium extensions if you allow us to track the usage.',
            'extra_notice' => 'We collect non-sensitive diagnostic data and plugin usage information.
            Your site URL, WordPress & PHP version, plugins & themes and email address to send you the
            discount coupon. This data lets us make sure this plugin always stays compatible with the most
            popular plugins and themes. No spam, I promise.',
        ));

        $tracker->init();
    }

    public function admin_notice()
    {

        self::$cache_bank = CacheBank::get_instance();

        try {
            $this->notices();
        } catch (\Exception $e) {
            unset($e);
        }

        // Remove OLD notice from 1.0.0 (if other WPDeveloper plugin has notice)
        NoticeRemover::get_instance('1.0.0');
    }

    public function notices()
    {
        $_assets_url = plugins_url('assets/', EMBEDPRESS_PLUGIN_BASENAME);

        $notices = new Notices([
            // 'dev_mode'       => true,
            'id'             => 'embedpress',
            'storage_key'    => 'notices',
            'lifetime'       => 3,
            'stylesheet_url' => $_assets_url . 'css/admin-notices.css',
            'styles'         => $_assets_url . 'css/admin-notices.css',
            'priority'       => 6
        ]);

        /**
         * This is review message and thumbnail.
         */
        $_review_notice = [
            'thumbnail' => $_assets_url . 'images/icon-128x128.png',
            'html' => '<p>' . __('We hope you\'re enjoying EmbedPress! Could you please do us a BIG favor and give it a 5-star rating on WordPress to help us spread the word and boost our motivation?', 'embedpress') . '</p>',
            'links' => [
                'later' => array(
                    'link'       => 'https://wordpress.org/support/plugin/embedpress/reviews/',
                    'target'     => '_blank',
                    'label'      => __('Ok, you deserve it!', 'embedpress'),
                    'icon_class' => 'dashicons dashicons-external',
                ),
                'allready' => array(
                    'label' => __('I already did', 'embedpress'),
                    'icon_class' => 'dashicons dashicons-smiley',
                    'attributes' => [
                        'data-dismiss' => true
                    ],
                ),
                'maybe_later' => array(
                    'label' => __('Maybe Later', 'embedpress'),
                    'icon_class' => 'dashicons dashicons-calendar-alt',
                    'attributes' => [
                        'data-later' => true
                    ],
                ),
                'support' => array(
                    'link' => 'https://wpdeveloper.com/support',
                    'label' => __('I need help', 'embedpress'),
                    'icon_class' => 'dashicons dashicons-sos',
                ),
                'never_show_again' => array(
                    'label' => __('Never show again', 'embedpress'),
                    'icon_class' => 'dashicons dashicons-dismiss',
                    'attributes' => [
                        'data-dismiss' => true
                    ],
                ),
            ],
        ];

        $notices->add(
            'review',
            $_review_notice,
            [
                'start'       => $notices->strtotime('+15 day'),
                'recurrence'  => 30,
                'dismissible' => true,
                'refresh'     => EMBEDPRESS_VERSION,
            ]
        );

        $notices->add(
            'optin',
            [$this->insights, 'notice'],
            [
                'start'       => $notices->strtotime('+10 day'),
                'recurrence'  => 30,
                'dismissible' => true,
                'refresh'     => EMBEDPRESS_VERSION,
                'do_action'   => 'wpdeveloper_notice_clicked_for_embedpress',
                'display_if'  => !is_array($notices->is_installed('embedpress-pro/embedpress-pro.php'))
            ]
        );

        $summer_message = '<div class="summer_2026_notice"><p class="notice-message"><span class="notice-emoji">🏖️</span> <strong>Summer Savings:</strong> Custom branding, ads, content protection, analytics and more with 250+ embed sources – now <strong>up to $150 OFF!</strong></p>
        <div class="notice-links">
            <a class="button button-primary" href="https://embedpress.com/summer2026-admin-notice" target="_blank">Upgrade To Pro Now</a>
            <a class="embedpress-notice-dismiss-button dismiss-btn" data-dismiss="true" href="#" target="_blank">I Don&rsquo;t Want Any Discount</a>
        </div>
        </div>';
        $_summer_2026_notice = [
            'thumbnail' => $_assets_url . 'images/full-logo.svg',
            'html'      => $summer_message,
        ];

        $notices->add(
            '_summer_2026_notice',
            $_summer_2026_notice,
            [
                'start'       => strtotime('20th May 2026'),
                'recurrence'  => false,
                'dismissible' => true,
                'refresh'     => EMBEDPRESS_VERSION,
                "expire"      => strtotime('11:59:59pm 25th June 2026'),
                'display_if' => !is_plugin_active('embedpress-pro/embedpress-pro.php') && ($_SERVER['REQUEST_URI'] === '/wp-admin/' || $_SERVER['REQUEST_URI'] === '/wp-admin/index.php'),
            ]
        );

        $notices->init();

        self::$cache_bank->create_account($notices);
        self::$cache_bank->calculate_deposits($notices);
    }

    public function is_pro_active()
    {
        return is_plugin_active('embedpress-pro/embedpress-pro.php');
    }

    /**
     * Show Admin notice when one of embedpress old plugin active
     *
     * @since  2.4.0
     */
    public function embedpress_admin_notice()
    {
        $compatibility_message = '<p style="margin-top: 0; margin-bottom: 0px;"><strong style="color:#FF7369;">Action Needed:</strong> Please update <strong>EmbedPress Pro</strong> to the latest version (<strong>v3.6.5</strong>) for enhanced features and compatibility.</p>';


        if (is_plugin_active('embedpress-pro/embedpress-pro.php') && version_compare(EMBEDPRESS_PRO_PLUGIN_VERSION, '3.6.5', '<')) {
            echo '<div class="notice notice-warning">' . $compatibility_message . '</div>';
        }
    }


    public function remove_admin_notice()
    {

        $current_screen = get_current_screen();
        if ($current_screen->id == 'toplevel_page_embedpress' || $current_screen->id == 'embedpress_page_embedpress-analytics') {

            remove_all_actions('user_admin_notices');
            remove_all_actions('admin_notices');

            // To showing notice in EA settings page we have to use 'eael_admin_notices' action hook
            add_action('admin_notices', function () {
                do_action('ep_admin_notices');
            });
        }

    }
}
