<?php
namespace EmbedPress\Includes\Traits;

if (!defined('ABSPATH')) {
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
        new EmbedPress_Plugin_Usage_Tracker(
            EMBEDPRESS_FILE,
            'http://app.wpdeveloper.net',
            array(),
            true,
            true,
            1
        );
    }

    public function admin_notice() {
        $notice = new EmbedPress_Notice(EMBEDPRESS_PLUGIN_BASENAME, EMBEDPRESS_VERSION);

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
        $notice->message( 'upsale', '<p>'. __( 'If you are using Gutenberg, you must install <a href="https://essential-blocks.com/" target="_blank">Essential Blocks</a>, it extends your capacity, with 22 Free Blocks!', $notice->text_domain ) .'</p>' );
        $notice->thumbnail( 'upsale', plugins_url( 'assets/images/essential-blocks.png', EMBEDPRESS_PLUGIN_BASENAME ) );

        // Update Notice For PRO Version
        if( $this->is_pro_active() && \version_compare( EMBEDPRESS_PRO_VERSION, '2.0.0', '<' ) ) {
            $notice->classes( 'update', 'notice is-dismissible ' );
            $notice->message( 'update', '<p>'. __( 'You are using an incompatible version of EmbedPress PRO. Please update to v3.4.0+. <a href="https://essential-addons.com/elementor/docs/manually-update-essential-addons-pro/" target="_blank">Follow manual update guide.</a>', $notice->text_domain ) .'</p>' );
            $notice->thumbnail( 'update', plugins_url( 'assets/images/icon-128x128.png', EMBEDPRESS_PLUGIN_BASENAME ) );
        }

        $notice->upsale_args = array(
            'slug'      => 'essential-blocks',
            'page_slug' => 'essential-blocks',
            'file'      => 'essential-blocks.php',
            'btn_text'  => __( 'Install Free', 'embedpress'),
            'condition' => [
                'by' => 'class',
                'class' => 'EssentialAdmin'
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
        return is_plugin_active('embedpress-pro/embedpress-pro.php');
    }

    /**
     * Show Admin notice when one of embedpress old plugin active
     *
     * @since  2.4.0
     */
    public function embedpress_admin_notice(){

        if (get_option( 'embedpress_dismiss_notice' ) == true || $this->is_pro_active() ) {
            return;
        }

        $plugin_list = [
            'embedpress-vimeo/embedpress-vimeo.php',
            'embedpress-wistia/embedpress-wistia.php',
            'embedpress-youtube/embedpress-youtube.php',
        ];
        $active_plugins = get_option('active_plugins');
        foreach($active_plugins as $plugin){
            if(in_array($plugin,$plugin_list)){
                $msg = '<strong>[Good News]</strong> Introducing <strong>EmbedPress Pro</strong>! And as existing Loyal User you get Unlimited Sites access to EmbedPress Pro for free. Please update and claim your free license to continue. <br/><strong>[<a href="https://embedpress.com/ep-loyal-users" target="_blank" rel="noopener">Details</a>] - [<a href="https://embedpress.com/new-pro-2020-free" target="_blank" rel="noopener">Get EmbedPress Pro for Free</a>]</strong>';
                echo '<div class="notice notice-info embedpress-plugin-notice-dismissible is-dismissible">
                <p>'.$msg.'</p>
            </div>';
                break;
            }
        }
    }

}