<?php

namespace EmbedPress\Includes\Traits;

if ( !defined( 'ABSPATH' ) ) {
    exit;
} // Exit if accessed directly
use \EmbedPress\Includes\Classes\EmbedPress_Plugin_Usage_Tracker;
use \EmbedPress\Includes\Classes\EmbedPress_Notice;

use PriyoMukul\WPNotice\Notices;

trait Shared {

    private $insights = null;


    /**
     * Optional usage tracker
     *
     * @since v1.0.0
     */
    public function start_plugin_tracking() {
        $this->insights = $tracker = EmbedPress_Plugin_Usage_Tracker::get_instance( EMBEDPRESS_FILE, [
            'opt_in'       => true,
            'goodbye_form' => true,
            'item_id'      => '98ba0ac16a4f7b3b940d'
        ] );
        $tracker->set_notice_options(array(
            'notice' => __( 'Want to help make <strong>EmbedPress</strong> even more awesome? You can get a <strong>10% discount coupon</strong> for Premium extensions if you allow us to track the usage.', 'embedpress' ),
            'extra_notice' => __( 'We collect non-sensitive diagnostic data and plugin usage information.
            Your site URL, WordPress & PHP version, plugins & themes and email address to send you the
            discount coupon. This data lets us make sure this plugin always stays compatible with the most
            popular plugins and themes. No spam, I promise.', 'embedpress' ),
        ));
        $tracker->init();
    }

    public function admin_notice() {
        $_assets_url = plugins_url( 'assets/', EMBEDPRESS_PLUGIN_BASENAME );

        $notices = new Notices([
            'id'          => 'embedpress',
            'store'       => 'options',
            'storage_key' => 'notices',
            'version'     => '1.0.0',
            'lifetime'    => 3,
            'styles'      => $_assets_url . 'css/admin-notices.css',
        ]);

        /**
         * This is review message and thumbnail.
         */
        $_review_notice = [
            'thumbnail' => $_assets_url . 'images/icon-128x128.png',
            'html' => '<p>' . __( 'We hope you\'re enjoying EmbedPress! Could you please do us a BIG favor and give it a 5-star rating on WordPress to help us spread the word and boost our motivation?', 'embedpress' ) . '</p>',
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
                'start'       => $notices->strtotime( '+15 day' ),
                'recurrence'  => 30,
                'dismissible' => true,
                'refresh'     => EMBEDPRESS_VERSION,
            ]
        );

        $notices->add(
            'optin',
            [$this->insights, 'notice'],
            [
                'start'       => $notices->time(),
                'recurrence'  => 30,
                'dismissible' => true,
                'refresh'     => EMBEDPRESS_VERSION,
                'do_action'   => 'wpdeveloper_notice_clicked_for_embedpress',
                'display_if'  => ! is_array( $notices->is_installed( 'embedpress-pro/embedpress-pro.php' ) )
            ]
        );

        $notices->init();
    }

    public function is_pro_active() {
        return is_plugin_active( 'embedpress-pro/embedpress-pro.php' );
    }

    /**
     * Show Admin notice when one of embedpress old plugin active
     *
     * @since  2.4.0
     */
    public function embedpress_admin_notice() {

    }

}
