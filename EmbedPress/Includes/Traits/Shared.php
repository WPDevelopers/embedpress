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
            ]
        );

        $notices->add(
            'optin',
            [$this->insights, 'notice'],
            [
                'start'       => $notices->time(),
                'recurrence'  => 30,
                'dismissible' => true,
                'do_action'   => 'wpdeveloper_notice_clicked_for_embedpress',
                'display_if'  => ! is_array( $notices->is_installed( 'embedpress-pro/embedpress-pro.php' ) )
            ]
        );

        $notices->init();

        return;

        /**
         * This is upsale notice settings
         * classes for wrapper,
         * Message message for showing.
         */
        // $notice->classes( 'upsale', 'notice is-dismissible ' );
        // $notice->message( 'upsale', '<p>' . __( 'Thank you for relying on EmbedPress with 60,000 other websites. Checkout our Pro features.', $notice->text_domain ) . '</p>' );

        // // Update Notice For PRO Version
        // if ( $this->is_pro_active() && \version_compare( get_embedpress_pro_version(), '2.0.0', '<' ) ) {
        //     $notice->classes( 'update', 'notice is-dismissible ' );
        //     $notice->message( 'update', '<p>' . __( 'You are using an incompatible version of EmbedPress PRO. Please update to v3.4.0+. <a href="https://essential-addons.com/elementor/docs/manually-update-essential-addons-pro/" target="_blank">Follow manual update guide.</a>', 'embedpress' ) . '</p>' );
        //     $notice->thumbnail( 'update', plugins_url( 'assets/images/icon-128x128.png', EMBEDPRESS_PLUGIN_BASENAME ) );
        // }

        // if ( \version_compare( EMBEDPRESS_VERSION, '3.0.0', '=' ) ) {
        //     $notice->classes( 'update', 'notice is-dismissible ' );
        //     $notice->message( 'update', '<p>' . __( 'EmbedPress 3.0 is here with new features and options, read the details <a href="https://wpdeveloper.com/introducing-embedpress-3.0" target="_blank">here</a>, and check the new setting page. <a href="'. admin_url('admin.php?page=embedpress') .'">Click Here.</a>', 'embedpress' ) . '</p>' );
        //     $notice->thumbnail( 'update', plugins_url( 'assets/images/icon-128x128.png', EMBEDPRESS_PLUGIN_BASENAME ) );
        // }

        // $notice->upsale_args = array(
        //     'href' => 'https://embedpress.com/?utm_source=plugin&utm_medium=free&utm_campaign=pro_upgrade#pricing',
        //     'btn_text'  => __( 'Learn More', 'embedpress' ),
        // );

        // $notice->options_args = array(
        //     'notice_will_show' => [
        //         'update' => $notice->timestamp,
        //         'opt_in' => $notice->makeTime( $notice->timestamp, '3 Day' ),
        //         'upsale' => $notice->makeTime( $notice->timestamp, '14 Day' ),
        //         'review' => $notice->makeTime( $notice->timestamp, '7 Day' ), // after 3 days
        //     ],
        // );
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
