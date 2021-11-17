<?php

namespace EmbedPress\Includes\Traits;

if ( !defined( 'ABSPATH' ) ) {
    exit;
} // Exit if accessed directly
use \EmbedPress\Includes\Classes\EmbedPress_Plugin_Usage_Tracker;
use \EmbedPress\Includes\Classes\EmbedPress_Notice;

trait Shared {


    /**
     * Optional usage tracker
     *
     * @since v1.0.0
     */
    public function start_plugin_tracking() {
        $tracker = EmbedPress_Plugin_Usage_Tracker::get_instance( EMBEDPRESS_FILE, [
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
        $notice = new EmbedPress_Notice( EMBEDPRESS_PLUGIN_BASENAME, EMBEDPRESS_VERSION );

        /**
         * Current Notice End Time.
         * Notice will dismiss in 3 days if user does nothing.
         */
        $notice->cne_time = '3 Day';

        /**
         * Current Notice Maybe Later Time.
         * Notice will show again in 7 days
         */
        $notice->maybe_later_time = '21 Day';

        $notice->text_domain = 'embedpress';

        $scheme        = (parse_url( $_SERVER['REQUEST_URI'], PHP_URL_QUERY )) ? '&' : '?';
        $url           = $_SERVER['REQUEST_URI'] . $scheme;
        $notice->links = [
            'review' => array(
                'later'            => array(
                    'link'       => 'https://wordpress.org/support/plugin/embedpress/reviews/',
                    'target'     => '_blank',
                    'label'      => __( 'Ok, you deserve it!', 'embedpress' ),
                    'icon_class' => 'dashicons dashicons-external',
                ),
                'allready'         => array(
                    'link'       => $url,
                    'label'      => __( 'I already did', 'embedpress' ),
                    'icon_class' => 'dashicons dashicons-smiley',
                    'data_args'  => [
                        'dismiss' => true,
                    ],
                ),
                'maybe_later'      => array(
                    'link'       => $url,
                    'label'      => __( 'Maybe Later', 'embedpress' ),
                    'icon_class' => 'dashicons dashicons-calendar-alt',
                    'data_args'  => [
                        'later' => true,
                    ],
                ),
                'support'          => array(
                    'link'       => 'https://wordpress.org/support/plugin/embedpress/',
                    'label'      => __( 'I need help', 'embedpress' ),
                    'icon_class' => 'dashicons dashicons-sos',
                ),
                'never_show_again' => array(
                    'link'       => $url,
                    'label'      => __( 'Never show again', 'embedpress' ),
                    'icon_class' => 'dashicons dashicons-dismiss',
                    'data_args'  => [
                        'dismiss' => true,
                    ],
                ),
            ),
        ];

        /**
         * This is review message and thumbnail.
         */
        $notice->message( 'review', '<p>' . __( 'We hope you\'re enjoying EmbedPress! Could you please do us a BIG favor and give it a 5-star rating on WordPress to help us spread the word and boost our motivation?', 'embedpress' ) . '</p>' );
        $notice->thumbnail( 'review', plugins_url( 'assets/images/icon-128x128.png', EMBEDPRESS_PLUGIN_BASENAME ) );
        /**
         * This is upsale notice settings
         * classes for wrapper,
         * Message message for showing.
         */
        $notice->classes( 'upsale', 'notice is-dismissible ' );
        $notice->message( 'upsale', '<p>' . __( 'Thank you for relying on EmbedPress with 30,000 other websites. Checkout our Pro features.', $notice->text_domain ) . '</p>' );

        // Update Notice For PRO Version
        if ( $this->is_pro_active() && \version_compare( get_embedpress_pro_version(), '2.0.0', '<' ) ) {
            $notice->classes( 'update', 'notice is-dismissible ' );
            $notice->message( 'update', '<p>' . __( 'You are using an incompatible version of EmbedPress PRO. Please update to v3.4.0+. <a href="https://essential-addons.com/elementor/docs/manually-update-essential-addons-pro/" target="_blank">Follow manual update guide.</a>', 'embedpress' ) . '</p>' );
            $notice->thumbnail( 'update', plugins_url( 'assets/images/icon-128x128.png', EMBEDPRESS_PLUGIN_BASENAME ) );
        }

        if ( \version_compare( EMBEDPRESS_VERSION, '3.0.0', '=' ) ) {
            $notice->classes( 'update', 'notice is-dismissible ' );
            $notice->message( 'update', '<p>' . __( 'EmbedPress 3.0 is here with new features and options, read the details <a href="https://wpdeveloper.net/introducing-embedpress-3.0" target="_blank">here</a>, and check the new setting page. <a href="'. admin_url('admin.php?page=embedpress') .'">Click Here.</a>', 'embedpress' ) . '</p>' );
            $notice->thumbnail( 'update', plugins_url( 'assets/images/icon-128x128.png', EMBEDPRESS_PLUGIN_BASENAME ) );
        }

        $notice->upsale_args = array(
            'href' => 'https://embedpress.com/?utm_source=plugin&utm_medium=free&utm_campaign=pro_upgrade#pricing',
            'btn_text'  => __( 'Learn More', 'embedpress' ),
        );

        $notice->options_args = array(
            'notice_will_show' => [
                'update' => $notice->timestamp,
                'opt_in' => $notice->makeTime( $notice->timestamp, '3 Day' ),
                'upsale' => $notice->makeTime( $notice->timestamp, '14 Day' ),
                'review' => $notice->makeTime( $notice->timestamp, '7 Day' ), // after 3 days
            ],
        );
        if ( $this->is_pro_active() && \version_compare( get_embedpress_pro_version(), '2.0.0', '<' ) ) {
            $notice->options_args['notice_will_show']['update'] = $notice->timestamp;
        }

        $notice->init();
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