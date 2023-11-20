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
            'notice' => __('Want to help make <strong>EmbedPress</strong> even more awesome? You can get a <strong>10% discount coupon</strong> for Premium extensions if you allow us to track the usage.', 'embedpress'),
            'extra_notice' => __('We collect non-sensitive diagnostic data and plugin usage information.
            Your site URL, WordPress & PHP version, plugins & themes and email address to send you the
            discount coupon. This data lets us make sure this plugin always stays compatible with the most
            popular plugins and themes. No spam, I promise.', 'embedpress'),
        ));
        $tracker->init();
    }

    public function admin_notice()
    {

        self::$cache_bank = CacheBank::get_instance();

        try {
            $this->notices();
        } catch (Exception $e) {
            unset($e);
        }

        // Remove OLD notice from 1.0.0 (if other WPDeveloper plugin has notice)
        NoticeRemover::get_instance('1.0.0');
    }

    public function notices()
    {
        $_assets_url = plugins_url('assets/', EMBEDPRESS_PLUGIN_BASENAME);

        $notices = new Notices([
            'id'          => 'embedpress',
            'storage_key' => 'notices',
            'lifetime'    => 3,
            'stylesheet_url'      => $_assets_url . 'css/admin-notices.css',
            'styles'      => $_assets_url . 'css/admin-notices.css',
            'priority'    => 6
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
                    'label'      => __('Ok, you deserve it!', 'wp-scheduled-posts'),
                    'icon_class' => 'dashicons dashicons-external',
                ),
                'allready' => array(
                    'label' => __('I already did', 'wp-scheduled-posts'),
                    'icon_class' => 'dashicons dashicons-smiley',
                    'attributes' => [
                        'data-dismiss' => true
                    ],
                ),
                'maybe_later' => array(
                    'label' => __('Maybe Later', 'wp-scheduled-posts'),
                    'icon_class' => 'dashicons dashicons-calendar-alt',
                    'attributes' => [
                        'data-later' => true
                    ],
                ),
                'support' => array(
                    'link' => 'https://wpdeveloper.com/support',
                    'label' => __('I need help', 'wp-scheduled-posts'),
                    'icon_class' => 'dashicons dashicons-sos',
                ),
                'never_show_again' => array(
                    'label' => __('Never show again', 'wp-scheduled-posts'),
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

        $b_message            = '<p style="margin-top: 0; margin-bottom: 10px;">Black Friday Sale: Save up to 40% now & <strong>embed from 150+</strong> sources with advanced features ⚡</p><a class="button button-primary" href="https://wpdeveloper.com/upgrade/embedpress-bfcm" target="_blank">Upgrade to pro</a> <button data-dismiss="true" class="dismiss-btn button button-link">I don’t want to save money</button>';
        $_black_friday_notice = [
            'thumbnail' => $_assets_url . 'images/full-logo.svg',
            'html'      => $b_message,
        ];

        $notices->add(
            'black_friday_notice',
            $_black_friday_notice,
            [
                'start'       => $notices->time(),
                'recurrence'  => false,
                'dismissible' => true,
                'refresh'     => EMBEDPRESS_VERSION,
                "expire"      => strtotime('11:59:59pm 2nd December, 2023'),
                'display_if'  => !is_plugin_active('embedpress-pro/embedpress-pro.php')
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
    { }
}
