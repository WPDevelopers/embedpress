<?php
namespace EmbedPress\Includes\Traits;

if (!defined('ABSPATH')) {
    exit;
} // Exit if accessed directly
use \EmbedPress\Includes\Classes\Plugin_Usage_Tracker;
use \EmbedPress\Includes\Classes\Notice;

trait Shared {


    /**
     * Optional usage tracker
     *
     * @since v1.0.0
     */
    public function start_plugin_tracking() {
        new Plugin_Usage_Tracker(
            EMBEDPRESS_ROOT,
            'http://app.wpdeveloper.net',
            array(),
            true,
            true,
            1
        );
    }

    public function admin_notice() {
        $notice = new Notice(EMBEDPRESS_PLUGIN_BASENAME, EMBEDPRESS_VERSION);

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

        $scheme = (parse_url($_SERVER['REQUEST_URI'], PHP_URL_QUERY)) ? '&' : '?';
        $url = $_SERVER['REQUEST_URI'] . $scheme;
        $notice->links = [
            'review' => array(
                'later' => array(
                    'link' => 'https://wordpress.org/support/plugin/embedpress/reviews/',
                    'target' => '_blank',
                    'label' => __('Ok, you deserve it!', 'embedpress'),
                    'icon_class' => 'dashicons dashicons-external',
                ),
                'allready' => array(
                    'link' => $url,
                    'label' => __('I already did', 'embedpress'),
                    'icon_class' => 'dashicons dashicons-smiley',
                    'data_args' => [
                        'dismiss' => true,
                    ],
                ),
                'maybe_later' => array(
                    'link' => $url,
                    'label' => __('Maybe Later', 'embedpress'),
                    'icon_class' => 'dashicons dashicons-calendar-alt',
                    'data_args' => [
                        'later' => true,
                    ],
                ),
                'support' => array(
                    'link' => 'https://wordpress.org/support/plugin/embedpress/',
                    'label' => __('I need help', 'embedpress'),
                    'icon_class' => 'dashicons dashicons-sos',
                ),
                'never_show_again' => array(
                    'link' => $url,
                    'label' => __('Never show again', 'embedpress'),
                    'icon_class' => 'dashicons dashicons-dismiss',
                    'data_args' => [
                        'dismiss' => true,
                    ],
                ),
            ),
        ];

        /**
         * This is review message and thumbnail.
         */
        $notice->message('review', '<p>' . __('We hope you\'re enjoying EmbedPress! Could you please do us a BIG favor and give it a 5-star rating on WordPress to help us spread the word and boost our motivation?', 'embedpress') . '</p>');
        $notice->thumbnail('review', plugins_url('assets/images/icon-128x128.png', EMBEDPRESS_PLUGIN_BASENAME));
        /**
         * This is upsale notice settings
         * classes for wrapper,
         * Message message for showing.
         */
        $notice->classes( 'upsale', 'notice is-dismissible ' );
        $notice->message( 'upsale', '<p>'. __( '8,000+ People already using <a href="https://wpdeveloper.net/ea/notificationX" target="_blank">NotificationX</a> to increase their Sales & Engagement!', $notice->text_domain ) .'</p>' );
        $notice->thumbnail( 'upsale', plugins_url( 'assets/images/nx-icon.svg', EMBEDPRESS_PLUGIN_BASENAME ) );

        // Update Notice For PRO Version
        if( $this->is_pro_active() && \version_compare( EMBEDPRESS_PRO_VERSION, '2.0.0', '<' ) ) {
            $notice->classes( 'update', 'notice is-dismissible ' );
            $notice->message( 'update', '<p>'. __( 'You are using an incompatible version of Essential Addons PRO. Please update to v3.4.0+. <a href="https://essential-addons.com/elementor/docs/manually-update-essential-addons-pro/" target="_blank">Follow manual update guide.</a>', $notice->text_domain ) .'</p>' );
            $notice->thumbnail( 'update', plugins_url( 'assets/images/icon-128x128.png', EMBEDPRESS_PLUGIN_BASENAME ) );
        }

        $notice->upsale_args = array(
            'slug'      => 'notificationx',
            'page_slug' => 'nx-builder',
            'file'      => 'notificationx.php',
            'btn_text'  => __( 'Install Free', 'essential-addons-for-elementor-lite'),
            'condition' => [
                'by' => 'class',
                'class' => 'NotificationX'
            ],
        );

        $notice->options_args = array(
            'notice_will_show' => [
                'opt_in' => $notice->timestamp,
                'upsale' => $notice->makeTime($notice->timestamp, '14 Day'),
                'review' => $notice->makeTime($notice->timestamp, '7 Day'), // after 3 days
            ],
        );
        if( $this->is_pro_active() && \version_compare( EMBEDPRESS_PRO_VERSION, '2.0.0', '<' ) ) {
            $notice->options_args['notice_will_show']['update'] = $notice->timestamp;
        }

        $notice->init();
    }

    public function is_pro_active(){
        return is_plugin_active('embedpress-pro/embedpress_pro.php');
    }

}