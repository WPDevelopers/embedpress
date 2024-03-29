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

        if (!empty($_GET['page_type']) && $_GET['page_type'] == 'calendly') {
            add_action('init', [$this, 'handle_calendly_data']);
        }

        if(defined('EMBEDPRESS_SL_ITEM_SLUG') && is_admin(  )){
            add_action('admin_enqueue_scripts',  [$this, 'enqueueLisenceScripts']);
        }
    }

    public function handle_calendly_data()
    {

        if(empty($_GET['_nonce']))
        {
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

                if (is_embedpress_pro_active() && (empty($event_types['title']))) {

                    update_option('calendly_event_types', $event_types);
                    update_option('calendly_scheduled_events', $scheduled_events);
                    update_option('calendly_invitees_list', $invite_list);
                }

                if (!is_embedpress_pro_active()) {
                    update_option('calendly_event_types', []);
                    update_option('calendly_scheduled_events', []);
                    update_option('calendly_invitees_list', []);
                }
            }

            wp_redirect(admin_url('admin.php?page=embedpress&page_type=calendly'), 302);
            exit();
        }
    }

    public function enqueueScripts()
    {
        global $pagenow;
        if ('post.php' === $pagenow) {
            $urlSchemes = apply_filters('embedpress:getAdditionalURLSchemes', $this->getUrlSchemes());

            wp_enqueue_script(
                'embedpress-pdfobject',
                EMBEDPRESS_URL_ASSETS . 'js/pdfobject.min.js',
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

            wp_enqueue_style('plyr', EMBEDPRESS_URL_ASSETS . 'css/plyr.css', $this->pluginVersion, true);

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

    public function enqueueLisenceScripts(){
        wp_enqueue_script(
            'embedpress-lisence',
            EMBEDPRESS_URL_ASSETS . 'js/license.js',
            ['jquery', 'wp-i18n', 'wp-url'],
            $this->pluginVersion,
            true
        );

		wp_localize_script( 'embedpress-lisence', 'wpdeveloperLicenseManagerNonce', array('embedpress_lisence_nonce' => wp_create_nonce( 'wpdeveloper_sl_'.EMBEDPRESS_SL_ITEM_ID.'_nonce' )) );

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
