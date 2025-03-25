<?php

namespace EmbedPress;

use EmbedPress\Ends\Back\Handler as EndHandlerAdmin;
use EmbedPress\Ends\Back\Settings\EmbedpressSettings;
use EmbedPress\Ends\Front\Handler as EndHandlerPublic;
use EmbedPress\Includes\Traits\Shared;


(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Entity that glues together all pieces that the plugin is made of, for WordPress 5+.
 *
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2021 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       1.0.0
 */
class Core
{
    use Shared;

    /**
     * The name of the plugin.
     *
     * @since   1.0.0
     * @access  protected
     *
     * @var     string $pluginName The name of the plugin.
     */
    protected $pluginName;

    /**
     * The version of the plugin.
     *
     * @since   1.0.0
     * @access  protected
     *
     * @var     string $pluginVersion The version of the plugin.
     */
    protected $pluginVersion;

    /**
     * An instance of the plugin loader.
     *
     * @since   1.0.0
     * @access  protected
     *
     * @var     Loader $pluginVersion The version of the plugin.
     */
    protected $loaderInstance;

    /**
     * An associative array storing all registered/active EmbedPress plugins and their namespaces.
     *
     * @since   1.4.0
     * @access  private
     * @static
     *
     * @var     array
     */
    private static $plugins = [];

    /**
     * Initialize the plugin and set its properties.
     *
     * @return  void
     * @since   1.0.0
     *
     */
    public function __construct()
    {
        $this->pluginName = EMBEDPRESS_PLG_NAME;
        $this->pluginVersion = EMBEDPRESS_VERSION;

        $this->loaderInstance = new Loader();

        add_action('admin_notices', [$this, 'embedpress_admin_notice']);

        add_filter('upload_mimes', [$this, 'extended_mime_types']);
    }

    /**
     * Method that retrieves the plugin name.
     *
     * @return  string
     * @since   1.0.0
     *
     */
    public function getPluginName()
    {
        return $this->pluginName;
    }

    /**
     * Method that retrieves the plugin version.
     *
     * @return  string
     * @since   1.0.0
     *
     */
    public function getPluginVersion()
    {
        return $this->pluginVersion;
    }

    /**
     * Method that retrieves the loader instance.
     *
     * @return  Loader
     * @since   1.0.0
     *
     */
    public function getLoader()
    {
        return $this->loaderInstance;
    }

    /**
     * Method responsible to connect all required hooks in order to make the plugin work.
     *
     * @return  void
     * @since   1.0.0
     *
     */
    public function initialize()
    {
        global $wp_actions;
        add_filter('oembed_providers', [$this, 'addOEmbedProviders']);
        add_action('rest_api_init', [$this, 'registerOEmbedRestRoutes']);
        add_action('rest_api_init', [$this, 'register_feedback_email_endpoint']);


        $this->start_plugin_tracking();

        if (is_admin()) {
            new EmbedpressSettings();
            $plgSettings = self::getSettings();


            add_action('init', [$this, 'admin_notice']);

            add_filter(
                'plugin_action_links_embedpress/embedpress.php',
                ['\\EmbedPress\\Core', 'handleActionLinks'],
                10,
                2
            );

            add_action('admin_enqueue_scripts', ['\\EmbedPress\\Ends\\Back\\Handler', 'enqueueStyles']);
            add_action('wp_ajax_embedpress_notice_dismiss', ['\\EmbedPress\\Ends\\Back\\Handler', 'embedpress_notice_dismiss']);

            $plgHandlerAdminInstance = new EndHandlerAdmin($this->getPluginName(), $this->getPluginVersion());

            if ($plgSettings->enablePluginInAdmin) {
                $this->loaderInstance->add_action('admin_enqueue_scripts', $plgHandlerAdminInstance, 'enqueueScripts');
            }
        } else {
            $plgHandlerPublicInstance = new EndHandlerPublic($this->getPluginName(), $this->getPluginVersion());

            $this->loaderInstance->add_action('wp_enqueue_scripts', $plgHandlerPublicInstance, 'enqueueScripts');
            $this->loaderInstance->add_action('wp_enqueue_scripts', $plgHandlerPublicInstance, 'enqueueStyles');

            unset($plgHandlerPublicInstance);
        }

        // Add support for embeds on AMP pages
        add_filter('pp_embed_parsed_content', ['\\EmbedPress\\AMP\\EmbedHandler', 'processParsedContent'], 10, 3);

        // Add support for our embeds on Beaver Builder. Without this it only run the native embeds.
        add_filter(
            'fl_builder_before_render_shortcodes',
            ['\\EmbedPress\\ThirdParty\\BeaverBuilder', 'before_render_shortcodes']
        );
        $this->loaderInstance->run();
    }

    /**
     * @param $providers
     *
     * @return mixed
     */
    public function addOEmbedProviders($providers)
    {
        $newProviders = [
            // Viddler
            '#https?://(.+\.)?viddler\.com/v/.+#i' => 'viddler',

            // Deviantart.com (http://www.deviantart.com)
            //            '#https?://(.+\.)?deviantart\.com/art/.+#i' => 'devianart',
            //            '#https?://(.+\.)?deviantart\.com/.+#i' => 'devianart',
            //            '#https?://(.+\.)?deviantart\.com/.*/d.+#i' => 'devianart',
            //            '#https?://(.+\.)?fav\.me/.+#i' => 'devianart',
            //            '#https?://(.+\.)?sta\.sh/.+#i' => 'devianart',

            // chirbit.com (http://www.chirbit.com/)
            //'#https?://(.+\.)?chirb\.it/.+#i' => 'chirbit',


            // nfb.ca (http://www.nfb.ca/)
            //'#https?://(.+\.)?nfb\.ca/film/.+#i' => 'nfb',

            // Dotsub (http://dotsub.com/)
            //'#https?://(.+\.)?dotsub\.com/view/.+#i' => 'dotsub',

            // Rdio (http://rdio.com/)
            '#https?://(.+\.)?rdio\.com/(artist|people)/.+#i' => 'rdio',

            // Sapo Videos (http://videos.sapo.pt)
            //'#https?://(.+\.)?videos\.sapo\.pt/.+#i' => 'sapo',

            // Official FM (http://official.fm)
            '#https?://(.+\.)?official\.fm/(tracks|playlists)/.+#i' => 'officialfm',

            // HuffDuffer (http://huffduffer.com)
            //'#https?://(.+\.)?huffduffer\.com/.+#i' => 'huffduffer',

            // Shoudio (http://shoudio.com)
            //'#https?://(.+\.)?shoudio\.(com|io)/.+#i' => 'shoudio',

            // Moby Picture (http://www.mobypicture.com)
            '#https?://(.+\.)?mobypicture\.com/user/.+/view/.+#i' => 'mobypicture',
            '#https?://(.+\.)?moby\.to/.+#i' => 'mobypicture',

            // 23HQ (http://www.23hq.com)
            //'#https?://(.+\.)?23hq\.com/.+/photo/.+#i' => '23hq',

            // Cacoo (https://cacoo.com)
            '#https?://(.+\.)?cacoo\.com/diagrams/.+#i' => 'cacoo',

            // Dipity (http://www.dipity.com)
            '#https?://(.+\.)?dipity\.com/.+#i' => 'dipity',

            // Roomshare (http://roomshare.jp)
            //'#https?://(.+\.)?roomshare\.jp/(en/)?post/.+#i' => 'roomshare',

            // Crowd Ranking (http://crowdranking.com)
            '#https?://(.+\.)?c9ng\.com/.+#i' => 'crowd',

            // CircuitLab (https://www.circuitlab.com/)
            //'#https?://(.+\.)?circuitlab\.com/circuit/.+#i' => 'circuitlab',

            // Coub (http://coub.com/)
            //'#https?://(.+\.)?coub\.com/(view|embed)/.+#i' => 'coub',

            // Ustream (http://www.ustream.tv)
            //'#https?://(.+\.)?ustream\.(tv|com)/.+#i' => 'ustream',

            // Daily Mile (http://www.dailymile.com)
            '#https?://(.+\.)?dailymile\.com/people/.+/entries/.+#i' => 'daily',

            // Sketchfab (http://sketchfab.com)
            '#https?://(.+\.)?sketchfab\.com/models/.+#i' => 'sketchfab',
            '#https?://(.+\.)?sketchfab\.com/.+/folders/.+#i' => 'sketchfab',

            // AudioSnaps (http://audiosnaps.com)
            '#https?://(.+\.)?audiosnaps\.com/k/.+#i' => 'audiosnaps',

            // RapidEngage (https://rapidengage.com)
            '#https?://(.+\.)?rapidengage\.com/s/.+#i' => 'rapidengage',

            // Getty Images (http://www.gettyimages.com/)
            //'#https?://(.+\.)?gty\.im/.+#i' => 'gettyimages',
            //'#https?://(.+\.)?gettyimages\.com/detail/photo/.+#i' => 'gettyimages',

            // amCharts Live Editor (http://live.amcharts.com/)
            //'#https?://(.+\.)?live\.amcharts\.com/.+#i' => 'amcharts',

            // Infogram (https://infogr.am/)
            //'#https?://(.+\.)?infogr\.am/.+#i' => 'infogram',
            //(https://infogram.com/)
            //'#https?://(.+\.)?infogram\.com/.+#i' => 'infogram',

            // ChartBlocks (http://www.chartblocks.com/)
            //'#https?://(.+\.)?public\.chartblocks\.com/c/.+#i' => 'chartblocks',

            // ReleaseWire (http://www.releasewire.com/)
            //'#https?://(.+\.)?rwire\.com/.+#i' => 'releasewire',

            // ShortNote (https://www.shortnote.jp/)
            //'#https?://(.+\.)?shortnote\.jp/view/notes/.+#i' => 'shortnote',

            // EgliseInfo (http://egliseinfo.catholique.fr/)
            '#https?://(.+\.)?egliseinfo\.catholique\.fr/.+#i' => 'egliseinfo',

            // Silk (http://www.silk.co/)
            '#https?://(.+\.)?silk\.co/explore/.+#i' => 'silk',
            '#https?://(.+\.)?silk\.co/s/embed/.+#i' => 'silk',

            // http://bambuser.com
            '#https?://(.+\.)?bambuser\.com/v/.+#i' => 'bambuser',

            // https://clyp.it
            //'#https?://(.+\.)?clyp\.it/.+#i' => 'clyp',

            // https://gist.github.com
            // '#https?://(.+\.)?gist\.github\.com/.+#i' => 'github',

            // https://portfolium.com
            //'#https?://(.+\.)?portfolium\.com/.+#i' => 'portfolium',

            // http://rutube.ru
            '#https?://(.+\.)?rutube\.ru/video/.+#i' => 'rutube',

            // http://www.videojug.com
            '#https?://(.+\.)?videojug\.com/.+#i' => 'videojug',

            // https://vine.com
            //'#https?://(.+\.)?vine\.co/v/.+#i' => 'vine',

            // Google Shortened Url
            '#https?://(.+\.)?goo\.gl/.+#i' => 'google',

            // Google Maps
            //'#https?://(.+\.)?google\.com/maps/.+#i' => 'googlemaps',
            //'#https?://(.+\.)?maps\.google\.com/.+#i' => 'googlemaps',

            // Google Docs
            //'#https?://(.+\.)?docs\.google\.com/(.+/)?(document|presentation|spreadsheets|forms|drawings)/.+#i' => 'googledocs',

            // Twitch.tv
            //'#https?://(.+\.)?twitch\.tv/.+#i' => 'twitch',

            // Giphy
            //'#https?://(.+\.)?giphy\.com/gifs/.+#i' => 'giphy',
            //'#https?://(.+\.)?i\.giphy\.com/.+#i' => 'giphy',
            //'#https?://(.+\.)?gph\.is/.+#i' => 'giphy',

            // Wistia
            //'#https?://(.+\.)?wistia\.com/medias/.+#i' => 'wistia',
            //'#https?://(.+\.)?fast\.wistia\.com/embed/medias/.+#i\.jsonp' => 'wistia',
        ];

        /**
         * ========================================
         * Make sure the $wp_write global is set.
         * This fix compatibility with JetPack, Classical Editor and Disable Gutenberg. JetPack makes
         * the oembed_providers filter be called and this activates our class too, but one dependency
         * of the rest_url method is not loaded yet.
         */
        global $wp_rewrite;

        if (!class_exists('\\WP_Rewrite')) {
            $path = ABSPATH . WPINC . '/class-wp-rewrite.php';
            if (file_exists($path)) {
                require_once $path;
            }
        }

        if (!is_object($wp_rewrite)) {
            $wp_rewrite = new \WP_Rewrite();
            $_GLOBALS['wp_write'] = $wp_rewrite;
        }
        /*========================================*/

        foreach ($newProviders as $url => &$data) {
            $data = [
                rest_url('embedpress/v1/oembed/' . $data),
                true,
            ];
        }

        $providers = array_merge($providers, $newProviders);

        return $providers;
    }

    /**
     * Register OEmbed Rest Routes
     */
    public function registerOEmbedRestRoutes()
    {
        register_rest_route(
            'embedpress/v1',
            '/oembed/(?P<provider>[a-zA-Z0-9\-]+)',
            [
                'methods' => \WP_REST_Server::READABLE,
                'callback' => ['\\EmbedPress\\RestAPI', 'oembed'],
                'permission_callback' => '__return_true',
            ]
        );
        register_rest_route(
            'embedpress/v1',
            '/oembed/(?P<provider>[a-zA-Z0-9\-]+)',
            [
                'methods' => \WP_REST_Server::CREATABLE,
                'callback' => ['\\EmbedPress\\RestAPI', 'oembed'],
                'permission_callback' => '__return_true',
            ]
        );
    }

    public function send_user_feedback_email($params)
    {
        $params = $params->get_params();

        $site_name   = get_bloginfo('name');
        $site_url    = get_site_url();
        $admin_email = get_option('admin_email');
        $wp_version  = get_bloginfo('version');

        $admin_user = get_user_by('ID', 1);
        if ($admin_user) {
            $first_name = get_user_meta($admin_user->ID, 'first_name', true);
            $last_name = get_user_meta($admin_user->ID, 'last_name', true);
            
            $admin_full_name = trim("$first_name $last_name");
            
            // Fallback to display name if full name is not set
            if (empty($admin_full_name)) {
                $admin_full_name = $admin_user->display_name;
            }
        } else {
            $admin_full_name = 'Unknown';
        }

        $to = 'akash@wpdeveloper.com, rasel@wpdeveloper.com, nahid@wpdeveloper.com, md-nahid-hasan@wpdeveloper.com'; // Replace with the recipient's email
        $subject = '[IMPORTANT] New feedback received from an EmbedPress user.';

        // HTML Email Template
        $message = '<html><body style="font-family: Arial, sans-serif;  padding: 20px;">';
        $message .= '<div style="max-width: 600px; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin: auto;">';
        $message .= '<div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #ddd">';
        $message .= '<img src="https://embedpress.com/wp-content/uploads/2025/03/logo.png" alt="EmbedPress" style="max-width: 150px;">';
        $message .= '</div>';
        $message .= '<h2 style="font-family: system-ui; color: #333; text-align: center;">Feedback Overview</h2>';
        $message .= '<table style="font-family: system-ui; width: 100%; border-collapse: collapse; border: 1px solid #ddd">';

        // Email
        $message .= '<tr><td style="padding: 10px; font-weight: bold; width: 100px; border-bottom: 1px solid #ddd;">Email :</td>';
        $message .= '<td style="padding: 10px; border-bottom: 1px solid #ddd;"><a href="mailto:' . esc_attr($params['email']) . '">' . esc_html($params['email']) . '</a></td></tr>';

        // Rating
        $message .= '<tr><td style="padding: 10px; font-weight: bold; width: 100px; border-bottom: 1px solid #ddd;">Rating :</td>';
        $message .= '<td style="padding: 10px; border-bottom: 1px solid #ddd;">' . esc_html($params['rating']) . ' ⭐️</td></tr>';

        // User
        $message .= '<tr><td style="padding: 10px; font-weight: bold; width: 100px; border-bottom: 1px solid #ddd;">Name :</td>';
        $message .= '<td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: 500;">' . esc_html($admin_full_name) . '</td></tr>';

        // Pack
        $message .= '<tr><td style="padding: 10px; font-weight: bold; width: 100px; border-bottom: 1px solid #ddd;">Site Url :</td>';
        $message .= '<td style="padding: 10px; border-bottom: 1px solid #ddd;"><a target="_blank" href="' . esc_url($site_url) . '" style="color: blue;">' . esc_html($site_url) . '</a></td></tr>';

        // Feedback
        $message .= '<tr><td style="padding: 10px; font-weight: bold; width: 100px; display: flex;">Feedback :</td>';
        $message .= '<td style="padding: 10px;">' . nl2br(esc_html($params['message'])) . '</td></tr>';

        $message .= '</table>';
        $message .= '</div></body></html>';

        $headers = [
            'Content-Type: text/html; charset=UTF-8',
            'From: ' . esc_html($params['name']) . ' <' . esc_html($params['email']) . '>'
        ];

        // Send the email
        $sent = wp_mail($to, $subject, $message, $headers);

        if ($sent) {
            update_option( 'embedpress_feedback_submited', true );
            return new \WP_REST_Response(['message' => 'Email sent successfully!'], 200);
        } else {
            return new \WP_REST_Response(['message' => 'Failed to send email.'], 500);
        }
    }


    public function register_feedback_email_endpoint()
    {
        register_rest_route('embedpress/v1', '/send-feedback', [
            'methods' => 'POST',
            'callback' => [$this, 'send_user_feedback_email'],
            'permission_callback' => '__return_true'
        ]);
    }



    /**
     * Callback called right after the plugin has been activated.
     *
     * @return  void
     * @since   1.0.0
     * @static
     *
     */
    public static function onPluginActivationCallback()
    {
        $dirname = wp_get_upload_dir()['basedir'] . '/embedpress';
        if (!file_exists($dirname)) {
            mkdir($dirname, 0777);
        }
        flush_rewrite_rules();
        embedpress_schedule_cache_cleanup();
    }

    /**
     * Callback called right after the plugin has been deactivated.
     *
     * @return  void
     * @since   1.0.0
     * @static
     *
     */
    public static function onPluginDeactivationCallback()
    {
        flush_rewrite_rules();
        embedpress_cache_cleanup();
        $timestamp = wp_next_scheduled('embedpress_backup_cleanup_action');
        if ($timestamp) {
            wp_unschedule_event($timestamp, 'embedpress_backup_cleanup_action');
        }
    }

    /**
     * Method that retrieves all additional service providers defined in the ~<plugin_root_path>/providers.php file.
     *
     * @return  array
     * @since   1.0.0
     * @static
     *
     */
    public static function getAdditionalServiceProviders()
    {
        $additionalProvidersFilePath = EMBEDPRESS_PATH_BASE . 'providers.php';
        if (file_exists($additionalProvidersFilePath)) {
            include $additionalProvidersFilePath;

            if (isset($additionalServiceProviders)) {
                return apply_filters('embedpress_additional_service_providers', $additionalServiceProviders);
            }
        }

        return apply_filters('embedpress_additional_service_providers', []);
    }

    /**
     * Method that checks if an embed of a given service provider can be responsive.
     *
     * @param  string  $serviceProviderAlias  The service's slug.
     *
     * @return  boolean
     * @since   1.0.0
     * @static
     *
     */
    public static function canServiceProviderBeResponsive($serviceProviderAlias)
    {
        return in_array($serviceProviderAlias, [
            "dailymotion",
            "kickstarter",
            "rutube",
            "ted",
            "vimeo",
            "youtube",
            "ustream",
            "google-docs",
            "animatron",
            "amcharts",
            "on-aol-com",
            "animoto",
            "videojug",
            'issuu',
        ]);
    }

    /**
     * Method that retrieves the plugin settings defined by the user.
     *
     * @return  object
     * @since   1.0.0
     * @static
     *
     */
    public static function getSettings()
    {
        $settings = get_option(EMBEDPRESS_PLG_NAME);

        if (!isset($settings['enablePluginInAdmin'])) {
            $settings['enablePluginInAdmin'] = true;
        }

        if (!isset($settings['enablePluginInFront'])) {
            $settings['enablePluginInFront'] = true;
        }

        if (!isset($settings['enableGlobalEmbedResize'])) {
            $settings['enableGlobalEmbedResize'] = false;
        }

        if (!isset($settings['enableEmbedResizeHeight'])) {
            $settings['enableEmbedResizeHeight'] = 550; // old 552
        }

        if (!isset($settings['enableEmbedResizeWidth'])) {
            $settings['enableEmbedResizeWidth'] = 600; // old 652
        }

        return (object) $settings;
    }


    /**
     * Retrieve all registered plugins.
     *
     * @return  array
     * @since   1.4.0
     * @static
     *
     */
    public static function getPlugins()
    {
        return self::$plugins;
    }

    /**
     * Handle links displayed below the plugin name in the WordPress Installed Plugins page.
     *
     * @return  array
     * @since   1.4.0
     * @static
     *
     */
    public static function handleActionLinks($links, $file)
    {
        $settingsLink = '<a href="' . admin_url('admin.php?page=embedpress') . '" aria-label="' . __(
            'Open settings page',
            'embedpress'
        ) . '">' . __('Settings', 'embedpress') . '</a>';

        array_unshift($links, $settingsLink);
        if (!apply_filters('embedpress/is_allow_rander', false)) {
            $links[] = '<a href="https://wpdeveloper.com/in/upgrade-embedpress" target="_blank" class="embedpress-go-pro-action" style="color: green">' . __('Go Pro', 'embedpress') . '</a>';
        }
        return $links;
    }


    /**
     * Method that ensures the API's url are whitelisted to WordPress external requests.
     *
     * @param  boolean  $isAllowed
     * @param  string   $host
     * @param  string   $url
     *
     * @return  boolean
     * @since   1.4.0
     * @static
     *
     */
    public static function allowApiHost($isAllowed, $host, $url)
    {
        if ($host === EMBEDPRESS_LICENSES_API_HOST) {
            $isAllowed = true;
        }

        return $isAllowed;
    }

    public function extended_mime_types($mimes)
    {
        $mimes['ppsx'] = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        return $mimes;
    }
}
