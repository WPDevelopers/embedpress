<?php

namespace EmbedPress\Ends\Back;

use EmbedPress\Core;
use EmbedPress\Ends\Handler as EndHandlerAbstract;
use EmbedPress\Shortcode;
use Embera\Embera;
use EmbedPress\Includes\Classes\Helper;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * The admin-facing functionality of the plugin.
 * Defines the plugin name, version, and enqueue the admin-specific stylesheets and scripts.
 *
 * @package     EmbedPress
 * @subpackage  EmbedPress/Ends/Back
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2023 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       1.0.0
 */
class Handler extends EndHandlerAbstract
{
    /**
     * Method that register all scripts for the admin area.
     *
     * @return  void
     * @since   1.0.0
     *
     */

    public function __construct($pluginName, $pluginVersion)
    {
        parent::__construct($pluginName, $pluginVersion);

        add_action('wp_ajax_delete_instagram_account', [$this, 'delete_instagram_account']);
        // add_action('init', [$this, 'handle_instagram_data']);

        add_action('wp_ajax_get_instagram_userdata_ajax', [$this, 'get_instagram_userdata_ajax']);
        add_action('wp_ajax_nopriv_get_instagram_userdata_ajax', [$this, 'get_instagram_userdata_ajax']);

        if (!empty($_GET['page_type']) && $_GET['page_type'] == 'calendly') {
            add_action('init', [$this, 'handle_calendly_data']);
        }

        if (defined('EMBEDPRESS_SL_ITEM_SLUG') && is_admin()) {
            add_action('admin_enqueue_scripts',  [$this, 'enqueueLisenceScripts']);
        }

        add_action('wp_ajax_sync_instagram_data_ajax', [$this, 'sync_instagram_data_ajax']);
        add_action('wp_ajax_nopriv_sync_instagram_data_ajax', [$this, 'sync_instagram_data_ajax']);
    }


    public function get_instagram_userdata_ajax()
    {

        if (!current_user_can('manage_options')) {
            wp_send_json_error(array('message' => 'You do not have sufficient permissions to access this functionality.'));
            return;
        }

        if (isset($_POST['_nonce']) && wp_verify_nonce($_POST['_nonce'], 'embedpress_elements_action')) {
            if (isset($_POST['access_token'])) {
                $access_token = sanitize_text_field($_POST['access_token']);
                $account_type = sanitize_text_field($_POST['account_type']);

                $user_data = $this->get_instagram_userdata($access_token, $account_type);

                $this->handle_instagram_data($user_data);

                $access_token = sanitize_text_field($_POST['access_token']);
                $account_type = sanitize_text_field($_POST['account_type']);
                $user_id = $this->get_instagram_userid($access_token, $account_type);

                $option_key = 'ep_instagram_feed_data';
                $feed_data = get_option($option_key, array());

                $feed_userinfo =  Helper::getInstagramUserInfo($access_token, $account_type, $user_id, true);
                $feed_posts    =  Helper::getInstagramPosts($access_token, $account_type, $user_id, 100, true);

                if (!empty($user_id)) {
                    $feed_data[$user_id] = [
                        'feed_userinfo' => $feed_userinfo,
                        'feed_posts' => $feed_posts,
                    ];

                    delete_transient('instagram_user_info_' . $user_id);
                    delete_transient('instagram_posts_' . $user_id);
                    update_option('ep_instagram_feed_data', $feed_data);
                } else {
                    $feed_data['error'] = "Access token Invalid or expired.";
                }


                wp_send_json($feed_data);
            } else {
                wp_send_json_error('Access token not provided');
            }
        } else {
            wp_send_json_error('Nonce verification failed');
        }
    }

    public function sync_instagram_data_ajax()
    {
        if (!current_user_can('manage_options')) {
            wp_send_json_error(array('message' => 'You do not have sufficient permissions to access this functionality.'));
            return;
        }

        if (isset($_POST['_nonce']) && wp_verify_nonce($_POST['_nonce'], 'embedpress_elements_action')) {
            if (isset($_POST['access_token'])) {

                $access_token = sanitize_text_field($_POST['access_token']);
                $account_type = sanitize_text_field($_POST['account_type']);
                $user_id = sanitize_text_field($_POST['user_id']);

                $option_key = 'ep_instagram_feed_data';
                $feed_data = get_option($option_key, array());

                $feed_userinfo =  Helper::getInstagramUserInfo($access_token, $account_type, $user_id, true);
                $feed_posts    =  Helper::getInstagramPosts($access_token, $account_type, $user_id, 100, true);

                $feed_data[$user_id] = [
                    'feed_userinfo' => $feed_userinfo,
                    'feed_posts' => $feed_posts,
                ];

                delete_transient('instagram_user_info_' . $user_id);
                delete_transient('instagram_posts_' . $user_id);
                update_option('ep_instagram_feed_data', $feed_data);


                wp_send_json($feed_data);
            } else {
                wp_send_json_error('Access token not provided');
            }
        } else {
            wp_send_json_error('Nonce verification failed');
        }
    }


    public function get_instagram_userid($access_token)
    {
        $response = "https://graph.facebook.com/v19.0/me/accounts?fields=connected_instagram_account{id}&access_token=$access_token";
        if (!is_wp_error($response)) {

            $body = wp_remote_retrieve_body($response);
            $data = json_decode($body, true);

            // Extract the connected Instagram account ID
            if (isset($data['data'][0]['connected_instagram_account']['id'])) {
                return $data['data'][0]['connected_instagram_account']['id'];
            } else {
                return '';
            }
        } else {
            $user_data['error'] = "Error: Unable to connect to Instagram API.";
        }
    }

    public function get_instagram_profile_picture($access_token, $userid)
    { }

    public function get_instagram_user_id($access_token, $account_type)
    {
        // Check if user data is already cached
        $user_id = get_transient('instagram_user_id_' . $access_token);

        if (!$user_id) {
            $user_id = array();

            if ($account_type == 'personal') {
                $response = wp_remote_get('https://graph.instagram.com/me?fields=id,username,account_type&access_token=' . $access_token);
            } else {
                $response = wp_remote_get('https://graph.facebook.com/v19.0/me/accounts?fields=connected_instagram_account{id,name,username,followers_count}&access_token=' . $access_token);
            }


            if (!is_wp_error($response)) {

                $body = wp_remote_retrieve_body($response);
                $data = json_decode($body, true);

                if ($account_type == 'personal') {

                    if (isset($data['id']) && isset($data['username'])) {
                        return $data['id'];

                        set_transient('instagram_user_id_' . $access_token, $data['id'], HOUR_IN_SECONDS);
                        return $data['id'];
                    } else {
                        $data['error'] = "Access token Invalid or expired.";
                    }
                } else {
                    if (isset($data['data'][0]['connected_instagram_account']['id']) && isset($data['data'][0]['connected_instagram_account']['username'])) {
                        set_transient('instagram_user_id_' . $access_token, $data['data'][0]['connected_instagram_account']['id'], HOUR_IN_SECONDS);
                        return $data['data'][0]['connected_instagram_account']['id'];
                    } else {
                        $data['error'] = "Access token Invalid or expired.";
                    }
                }
            } else {
                $data['error'] = "Error: Unable to connect to Instagram API.";
            }
        }

        return $data;
    }

    public function get_instagram_userdata($access_token, $account_type)
    {
        // Check if user data is already cached
        $user_data = get_transient('instagram_user_data_' . $access_token);

        if (!$user_data) {
            $user_data = array();

            if ($account_type == 'personal') {
                $response = wp_remote_get('https://graph.instagram.com/me?fields=id,username,account_type&access_token=' . $access_token);
            } else {
                $response = wp_remote_get('https://graph.facebook.com/v19.0/me/accounts?fields=connected_instagram_account{id,name,username,followers_count}&access_token=' . $access_token);
            }


            if (!is_wp_error($response)) {

                $body = wp_remote_retrieve_body($response);
                $data = json_decode($body, true);

                if ($account_type == 'personal') {

                    if (isset($data['id']) && isset($data['username'])) {
                        $user_data['access_token'] = $access_token;
                        $user_data['user_id']          = $data['id'];
                        $user_data['username']    = $data['username'];
                        $user_data['account_type'] = $account_type;

                        set_transient('instagram_user_data_' . $access_token, $user_data, HOUR_IN_SECONDS);
                    } else {
                        $user_data['error'] = "Access token Invalid or expired.";
                    }
                } else {
                    if (isset($data['data'][0]['connected_instagram_account']['id']) && isset($data['data'][0]['connected_instagram_account']['username'])) {
                        $user_data['access_token'] = $access_token;
                        $user_data['user_id'] = $data['data'][0]['connected_instagram_account']['id']; // Assuming 'id' refers to Facebook account ID
                        $user_data['instagram_id'] = $data['data'][0]['connected_instagram_account']['id'];
                        $user_data['username'] = $data['data'][0]['connected_instagram_account']['username'];
                        $user_data['account_type'] = $account_type;

                        set_transient('instagram_user_data_' . $access_token, $user_data, HOUR_IN_SECONDS);
                    } else {
                        $user_data['error'] = "Access token Invalid or expired.";
                    }
                }
            } else {
                $user_data['error'] = "Error: Unable to connect to Instagram API.";
            }
        }

        return $user_data;
    }




    public function handle_instagram_data($user_data)
    {
        if (empty($user_data['error'])) {
            $user_id = isset($user_data['user_id']) ? $user_data['user_id'] : '';
            $username = isset($user_data['username']) ? $user_data['username'] : '';
            $account_type = isset($user_data['account_type']) ? $user_data['account_type'] : '';
            $access_token = isset($user_data['access_token']) ? $user_data['access_token'] : '';

            $get_instagram_data = get_option('ep_instagram_account_data');

            $token_data = [
                [
                    'user_id' => $user_id,
                    'username' => $username,
                    'account_type' => $account_type,
                    'access_token' => $access_token,
                ]
            ];

            if (!empty($get_instagram_data)) {
                $updated = false;

                foreach ($get_instagram_data as &$data) {

                    if ($data['user_id'] === $user_id) {

                        // If user_id matches, update the data
                        $data['username'] = $username;
                        $data['account_type'] = $account_type;
                        $data['access_token'] = $access_token;

                        $updated = true;
                        break;
                    }
                }

                if (!$updated) {
                    // If user_id does not exist, add new data
                    $get_instagram_data[] = $token_data[0];
                }
            } else {
                // If $get_instagram_data is empty, add the new data directly
                $get_instagram_data = $token_data;
            }

            update_option('ep_instagram_account_data', $get_instagram_data);

            wp_redirect(admin_url('admin.php?page=embedpress&page_type=instagram'), 301);

            exit();
        }
    }

    public function handle_calendly_data()
    {

        if (empty($_GET['_nonce'])) {
            return false;
        }

        $verify = wp_verify_nonce($_GET['_nonce'], 'calendly_nonce');

        // Check if access_token or calendly_status is present and nonce is invalid
        if (!$verify) {
            echo esc_html__('Invalid nonce', 'embedpress');
            die;
        }

        if ((!empty($_GET['_nonce']) && $verify) && (!empty($_GET['access_token']) && isset($_GET['page_type']) && $_GET['page_type'] == 'calendly') || (isset($_GET['calendly_status']) && ($_GET['calendly_status'] == 'sync' || $_GET['calendly_status'] == 'connect'))) {

            if ($_GET['calendly_status'] === 'connect') {
                update_option('is_calendly_connected', true);
            }

            if (isset($_GET['access_token']) && !empty($_GET['access_token'])) {
                $access_token = $_GET['access_token'];
                $refresh_token = $_GET['refresh_token'];
                $expires_in = $_GET['expires_in'];
                $created_at = $_GET['created_at'];
            } elseif (isset($_GET['calendly_status']) && ($_GET['calendly_status'] == 'sync' || $_GET['calendly_status'] == 'connect')) {
                $token_data = get_option('calendly_tokens');
                $access_token = $token_data['access_token'];
                $refresh_token = $token_data['refresh_token'];
                $expires_in = $token_data['expires_in'];
                $created_at = $token_data['created_at'];
            }


            // Create an array to store the tokens and expiration time
            $token_data = array(
                'access_token' => $access_token,
                'refresh_token' => $refresh_token,
                'expires_in' => $expires_in,
                'created_at' => $created_at
            );

            // Save the serialized data in a single option key
            update_option('calendly_tokens', $token_data);

            $user_info = json_decode(Helper::getCalendlyUserInfo($access_token), true);

            if (!empty($user_info['resource']['uri'])) {
                $event_types = Helper::getCalaendlyEventTypes($user_info['resource']['uri'], $access_token);
                $scheduled_events = Helper::getCalaendlyScheduledEvents($user_info['resource']['uri'], $access_token);

                $invite_list = [];

                if (is_array($scheduled_events['collection'])) {
                    foreach ($scheduled_events['collection'] as $event) :
                        $uuid = Helper::getCalendlyUuid($event['uri']);
                        $invite_list[$uuid] = Helper::getListEventInvitee($uuid, $access_token);
                    endforeach;
                }

                update_option('calendly_user_info', $user_info);

                if (!apply_filters('embedpress/is_allow_rander', false)) {
                    update_option('calendly_event_types', []);
                    update_option('calendly_scheduled_events', []);
                    update_option('calendly_invitees_list', []);
                } else {
                    do_action('embedepress/calendly_event_data',  $event_types, $scheduled_events, $invite_list);
                }
                            
            }

            wp_redirect(admin_url('admin.php?page=embedpress&page_type=calendly'), 302);
            exit();
        }
    }

    public function enqueueScripts()
    {
        global $pagenow;
        if ('post.php' === $pagenow || 'post-new.php' === $pagenow) {
            $urlSchemes = apply_filters('embedpress:getAdditionalURLSchemes', $this->getUrlSchemes());

            wp_enqueue_script(
                'embedpress-pdfobject',
                EMBEDPRESS_URL_ASSETS . 'js/pdfobject.js',
                [],
                $this->pluginVersion,
                false
            );

            wp_enqueue_script("bootbox-bootstrap", EMBEDPRESS_URL_ASSETS . 'js/vendor/bootstrap/bootstrap.min.js', ['jquery'], $this->pluginVersion, false);
            wp_enqueue_script("bootbox", EMBEDPRESS_URL_ASSETS . 'js/vendor/bootbox.min.js', ['jquery', 'bootbox-bootstrap'], $this->pluginVersion, true);
            wp_enqueue_script($this->pluginName, EMBEDPRESS_URL_ASSETS . 'js/preview.js', ['jquery', 'bootbox'], $this->pluginVersion, true);


            wp_localize_script($this->pluginName, '$data', [
                'previewSettings'       => [
                    'baseUrl'    => get_site_url() . '/',
                    'versionUID' => $this->pluginVersion,
                    'debug'      => true,
                ],
                'EMBEDPRESS_SHORTCODE'  => EMBEDPRESS_SHORTCODE,
                'EMBEDPRESS_URL_ASSETS' => EMBEDPRESS_URL_ASSETS,
                'urlSchemes'            => $urlSchemes,
            ]);
        }

        if ('post.php' === $pagenow || 'post-new.php' === $pagenow) {
            wp_enqueue_script(
                'plyr.polyfilled',
                EMBEDPRESS_URL_ASSETS . 'js/plyr.polyfilled.js',
                [],
                $this->pluginVersion,
                false
            );
            wp_enqueue_script(
                'gutenberg-general',
                EMBEDPRESS_URL_ASSETS . 'js/gutneberg-script.js',
                ['wp-data'],
                $this->pluginVersion,
                false
            );
            

            wp_enqueue_style('plyr', EMBEDPRESS_URL_ASSETS . 'css/plyr.css', array(), $this->pluginVersion);
            wp_enqueue_style($this->pluginName, EMBEDPRESS_URL_ASSETS . 'css/embedpress.css', array(), $this->pluginVersion);


            wp_enqueue_script(
                'cg-carousel',
                EMBEDPRESS_URL_ASSETS . 'js/carousel.min.js',
                ['jquery'],
                $this->pluginVersion,
                false
            );
            wp_enqueue_script(
                'init-carousel',
                EMBEDPRESS_URL_ASSETS . 'js/initCarousel.js',
                ['jquery', 'cg-carousel'],
                $this->pluginVersion,
                false
            );
            wp_enqueue_script(
                'embedpress-google-photos-album',
                EMBEDPRESS_URL_ASSETS . 'js/embed-ui.min.js',
                [],
                $this->pluginVersion,
                true
            );

            wp_enqueue_script(
                'embedpress-remove-round-button',
                EMBEDPRESS_URL_ASSETS . 'js/remove-round-button.js',
                ['embedpress-google-photos-album'],
                $this->pluginVersion,
                true
            );

            wp_enqueue_script(
                'embedpress-google-photos-gallery-justify',
                EMBEDPRESS_URL_ASSETS . 'js/gallery-justify.js',
                ['jquery', 'embedpress-google-photos-album'],
                $this->pluginVersion,
                true
            );

            wp_enqueue_style('cg-carousel', EMBEDPRESS_URL_ASSETS . 'css/carousel.min.css', $this->pluginVersion, true);

            wp_enqueue_style($this->pluginName, EMBEDPRESS_URL_ASSETS . 'css/embedpress.css', $this->pluginVersion, true);
        }

        //load embedpress admin js

        wp_enqueue_script(
            'embedpress-admin',
            EMBEDPRESS_URL_ASSETS . 'js/admin.js',
            ['jquery', 'wp-i18n', 'wp-url'],
            $this->pluginVersion,
            true
        );

        wp_localize_script($this->pluginName, 'EMBEDPRESS_ADMIN_PARAMS', [
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce'   => wp_create_nonce('embedpress')
        ]);


        $installedPlugins = Core::getPlugins();
        if (count($installedPlugins) > 0) {
            foreach ($installedPlugins as $plgSlug => $plgNamespace) {
                $plgScriptPathRelative = "assets/js/embedpress.{$plgSlug}.js";
                $plgName               = "embedpress-{$plgSlug}";

                if (file_exists(WP_PLUGIN_DIR . "/{$plgName}/{$plgScriptPathRelative}")) {
                    wp_enqueue_script(
                        $plgName,
                        plugins_url($plgName) . '/' . $plgScriptPathRelative,
                        [$this->pluginName],
                        $this->pluginVersion,
                        true
                    );
                }
            }
        }
    }

    public function enqueueLisenceScripts()
    {
        wp_enqueue_script(
            'embedpress-lisence',
            EMBEDPRESS_URL_ASSETS . 'js/license.js',
            ['jquery', 'wp-i18n', 'wp-url'],
            $this->pluginVersion,
            true
        );

        wp_localize_script('embedpress-lisence', 'wpdeveloperLicenseManagerNonce', array('embedpress_lisence_nonce' => wp_create_nonce('wpdeveloper_sl_' . EMBEDPRESS_SL_ITEM_ID . '_nonce')));
    }


    /**
     * Method that register all stylesheets for the admin area.
     *
     * @return  void
     * @since   1.0.0
     * @static
     *
     */
    public static function enqueueStyles()
    {
        if (isset($_GET['page']) && 'embedpress' === $_GET['page']) {
            wp_enqueue_style('embedpress-admin', plugins_url('embedpress/assets/css/admin.css'));
        }
    }

    /**
     * Method that receive a string via AJAX and return the decoded-shortcoded-version of that string.
     *
     * @return  void
     * @since   1.0.0
     *
     */
    public function doShortcodeReceivedViaAjax()
    {
        $subject = isset($_POST['subject']) ? $_POST['subject'] : "";

        $response = [
            'data' => Shortcode::parseContent($subject, true),
        ];

        header('Content-Type:application/json;charset=UTF-8');
        echo json_encode($response);

        exit();
    }

    /**
     * Method that receive an url via AJAX and return the info about that url/embed.
     *
     * @return  void
     * @since   1.0.0
     *
     */
    public function getUrlInfoViaAjax()
    {
        $url = isset($_GET['url']) ? trim($_GET['url']) : "";

        $response = [
            'url'             => $url,
            'canBeResponsive' => false,
        ];

        if (!!strlen($response['url'])) {

            $additionalServiceProviders = Core::getAdditionalServiceProviders();
            if (!empty($additionalServiceProviders)) {
                foreach ($additionalServiceProviders as $serviceProviderClassName => $serviceProviderUrls) {
                    Shortcode::addServiceProvider($serviceProviderClassName, $serviceProviderUrls);
                }
            }
            $embera = new Embera([], Shortcode::get_collection());

            $urlInfo = $embera->getUrlData($response['url']);
            if (isset($urlInfo[$response['url']]) && $urlInfo[$response['url']]['provider_name']) {
                $response['canBeResponsive'] = Core::canServiceProviderBeResponsive(strtolower($urlInfo[$response['url']]['provider_name']));
            }
        }

        header('Content-Type:application/json;charset=UTF-8');
        echo json_encode($response);

        exit();
    }

    /**
     * Returns a list of supported URL schemes for the preview script
     *
     * @return array
     */
    public function getUrlSchemes()
    {
        return [
            // Apple podcasts
            'podcasts.apple.com/*',
            // PollDaddy
            '*.polldaddy.com/s/*',
            '*.polldaddy.com/poll/*',
            '*.polldaddy.com/ratings/*',
            'polldaddy.com/s/*',
            'polldaddy.com/poll/*',
            'polldaddy.com/ratings/*',

            // VideoPress
            'videopress.com/v/*',

            // Tumblr
            '*.tumblr.com/post/*',

            // SmugMug
            'smugmug.com/*',
            '*.smugmug.com/*',

            // SlideShare
            'slideshare.net/*/*',
            '*.slideshare.net/*/*',

            // Reddit
            'reddit.com/r/[^/]+/comments/*',

            // Photobucket
            'i*.photobucket.com/albums/*',
            'gi*.photobucket.com/groups/*',

            // Cloudup
            'cloudup.com/*',

            // Imgur
            'imgur.com/*',
            'i.imgur.com/*',

            // YouTube (http://www.youtube.com/)
            'youtube.com/watch\\?*',
            'youtube.com/playlist\\?*',
            'youtube.com/channel/*',
            'youtube.com/c/*',
            'youtube.com/user/*',
            'youtube.com/(\w+)[^?\/]*$',

            // opensea
            'opensea.io/collection/*',

            // Flickr (http://www.flickr.com/)
            'flickr.com/photos/*/*',
            'flic.kr/p/*',

            // Viddler (http://www.viddler.com/)
            'viddler.com/v/*',

            // Hulu (http://www.hulu.com/)
            'hulu.com/watch/*',

            // Vimeo (http://vimeo.com/)
            'vimeo.com/*',
            'vimeo.com/groups/*/videos/*',

            // CollegeHumor (http://www.collegehumor.com/)
            'collegehumor.com/video/*',

            // Deviantart.com (http://www.deviantart.com)
            '*.deviantart.com/art/*',
            '*.deviantart.com/*#/d*',
            'fav.me/*',
            'sta.sh/*',

            // SlideShare (http://www.slideshare.net/)

            // chirbit.com (http://www.chirbit.com/)
            'chirb.it/*',

            // nfb.ca (http://www.nfb.ca/)
            '*.nfb.ca/film/*',

            // Scribd (http://www.scribd.com/)
            '*.scribd.com/doc/*',
            '*.scribd.com/document/*',

            // Dotsub (http://dotsub.com/)
            'dotsub.com/view/*',

            // Animoto (http://animoto.com/)
            'animoto.com/play/*',

            // Rdio (http://rdio.com/)
            '*.rdio.com/artist/*',
            '*.rdio.com/people/*',

            // MixCloud (http://mixcloud.com/)
            'mixcloud.com/*/*/',

            // FunnyOrDie (http://www.funnyordie.com/)
            'funnyordie.com/videos/*',

            // Ted (http://ted.com)
            'ted.com/talks/*',

            // Sapo Videos (http://videos.sapo.pt)
            'videos.sapo.pt/*',

            // Official FM (http://official.fm)
            'official.fm/tracks/*',
            'official.fm/playlists/*',

            // HuffDuffer (http://huffduffer.com)
            'huffduffer.com/*/*',

            // Shoudio (http://shoudio.com)
            'shoudio.com/*',
            'shoud.io/*',

            // Moby Picture (http://www.mobypicture.com)
            'mobypicture.com/user/*/view/*',
            'moby.to/*',

            // 23HQ (http://www.23hq.com)
            '23hq.com/*/photo/*',

            // Cacoo (https://cacoo.com)
            'cacoo.com/diagrams/*',

            // Dipity (http://www.dipity.com)
            'dipity.com/*/*/',

            // Roomshare (http://roomshare.jp)
            'roomshare.jp/post/*',
            'roomshare.jp/en/post/*',

            // Dailymotion (http://www.dailymotion.com)
            'dailymotion.com/video/*',

            // Crowd Ranking (http://crowdranking.com)
            'c9ng.com/*/*',

            // CircuitLab (https://www.circuitlab.com/)
            'circuitlab.com/circuit/*',

            // Coub (http://coub.com/)
            'coub.com/view/*',
            'coub.com/embed/*',

            // SpeakerDeck (https://speakerdeck.com)
            'speakerdeck.com/*/*',

            // Instagram (https://instagram.com)
            'instagram.com/p/*',
            'instagr.am/p/*',

            // SoundCloud (http://soundcloud.com/)
            'soundcloud.com/*',

            // Kickstarter (http://www.kickstarter.com)
            'kickstarter.com/projects/*',

            // Ustream (http://www.ustream.tv)
            '*.ustream.tv/*',
            '*.ustream.com/*',

            // Daily Mile (http://www.dailymile.com)
            'dailymile.com/people/*/entries/*',

            // Sketchfab (http://sketchfab.com)
            'sketchfab.com/models/*',
            'sketchfab.com/*/folders/*',

            // Meetup (http://www.meetup.com)
            'meetup.com/*',
            'meetu.ps/*',

            // AudioSnaps (http://audiosnaps.com)
            'audiosnaps.com/k/*',

            // RapidEngage (https://rapidengage.com)
            'rapidengage.com/s/*',

            // Getty Images (http://www.gettyimages.com/)
            'gty.im/*',
            'gettyimages.com/detail/photo/*',

            // amCharts Live Editor (http://live.amcharts.com/)
            'live.amcharts.com/*',

            // Infogram (https://infogr.am/)
            'infogr.am/*',
            'infogram.com/*',

            // ChartBlocks (http://www.chartblocks.com/)
            'public.chartblocks.com/c/*',

            // ReleaseWire (http://www.releasewire.com/)
            'rwire.com/*',

            // ShortNote (https://www.shortnote.jp/)
            'shortnote.jp/view/notes/*',

            // EgliseInfo (http://egliseinfo.catholique.fr/)
            'egliseinfo.catholique.fr/*',

            // Silk (http://www.silk.co/)
            '*.silk.co/explore/*',
            '*.silk.co/s/embed/*',

            // Twitter
            'twitter.com/*/status/*',
            'twitter.com/i/moments/*',
            'twitter.com/*/timelines/*',

            // http://bambuser.com
            'bambuser.com/v/*',

            // https://clyp.it
            'clyp.it/*',

            // https://gist.github.com
            'gist.github.com/*/*',

            // http://issuu.com
            'issuu.com/*',

            // https://portfolium.com
            'portfolium.com/*',

            // https://www.reverbnation.com
            'reverbnation.com/*',

            // http://rutube.ru
            'rutube.ru/video/*',

            // https://spotify.com/
            'open.spotify.com/*',

            // http://www.videojug.com
            'videojug.com/*',

            // https://vine.com
            'vine.co/v/*',

            // Facebook
            'facebook.com/*',
            'fb.watch/*',

            // Google Shortened Url
            'goo.gl/*',

            // Google Maps
            'google.com/*',
            'google.com.*/*',
            'google.co.*/*',
            'maps.google.com/*',

            // Google Docs
            'docs.google.com/presentation/*',
            'docs.google.com/document/*',
            'docs.google.com/spreadsheets/*',
            'docs.google.com/forms/*',
            'docs.google.com/drawings/*',

            // Twitch.tv
            '*.twitch.tv/*',
            'twitch.tv/*',

            // Giphy
            '*.giphy.com/gifs/*',
            'giphy.com/gifs/*',
            'i.giphy.com/*',
            'gph.is/*',

            // Wistia
            '*.wistia.com/medias/*',
            'fast.wistia.com/embed/medias/*.jsonp',
            // Boomplay (http://boomplay.com/)
            'boomplay.com/*',
            'codepen.io/*',
            'archivos.digital/*',
            'audioclip.naver.com/*',
            'app.blogcast.host/*',
            'codepoints.net/*',
            'codesandbox.io/*',
            'commaful.com/*',
            '*.survey.fm/*',
            'survey.fm/*',
            'datawrapper.dwcdn.net/*',
            '*.didacte.com/*',
            'didacte.com/*',
            'digiteka.com/*',
            'docdro.id/*',
            'edumedia-sciences.com/*',
            'ethfiddle.com/*',
            'eyrie.io/*',
            '*.getfader.com/*',
            'getfader.com/*',
            'fitapp.pro/*',
            'fite.tv/*',
            'public.flourish.studio/*',
            'geograph.org.gg/*',
            'geo-en.hlipp.de/*',
            'geograph.org.uk/*',
            'fortest.getshow.io/*',
            'opensea.io/assets/*',
        ];
    }

    public function delete_instagram_account()
    {
        if (!current_user_can('manage_options')) {
            wp_send_json_error(array('message' => 'You do not have sufficient permissions to access this functionality.'));
            return;
        }
        
        if (isset($_POST['_nonce']) && wp_verify_nonce($_POST['_nonce'], 'embedpress_elements_action')) {
            $user_id = isset($_POST['user_id']) ? $_POST['user_id'] : '';
            $account_type = isset($_POST['account_type']) ? $_POST['account_type'] : '';
            $account_data = get_option('ep_instagram_account_data');

            $data = array_filter($account_data, function ($item) use ($user_id) {
                return $item['user_id'] !== $user_id;
            });
            $data = array_values($data);
            update_option('ep_instagram_account_data', $data);
        } else {
            wp_die('Nonce verification failed.');
        }
    }



    /**
     * Update admin notice view status
     *
     * @since  2.5.1
     */
    public static function embedpress_notice_dismiss()
    {
        check_ajax_referer('embedpress', 'security');
        update_option('embedpress_social_dismiss_notice', true);
    }
}
