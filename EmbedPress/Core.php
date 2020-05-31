<?php

namespace EmbedPress;

use EmbedPress\Ends\Back\Handler as EndHandlerAdmin;
use EmbedPress\Ends\Front\Handler as EndHandlerPublic;


(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Entity that glues together all pieces that the plugin is made of, for WordPress 5+.
 *
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2020 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       1.0.0
 */
class Core {
    use \EmbedPress\Includes\Traits\Shared;

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
    public function __construct () {
        $this->pluginName = EMBEDPRESS_PLG_NAME;
        $this->pluginVersion = EMBEDPRESS_VERSION;

        $this->loaderInstance = new Loader();

        add_action('admin_notices',[$this,'embedpress_admin_notice']);
    }

    /**
     * Method that retrieves the plugin name.
     *
     * @return  string
     * @since   1.0.0
     *
     */
    public function getPluginName () {
        return $this->pluginName;
    }

    /**
     * Method that retrieves the plugin version.
     *
     * @return  string
     * @since   1.0.0
     *
     */
    public function getPluginVersion () {
        return $this->pluginVersion;
    }

    /**
     * Method that retrieves the loader instance.
     *
     * @return  Loader
     * @since   1.0.0
     *
     */
    public function getLoader () {
        return $this->loaderInstance;
    }

    /**
     * Method responsible to connect all required hooks in order to make the plugin work.
     *
     * @return  void
     * @since   1.0.0
     *
     */
    public function initialize () {
        global $wp_actions;

        add_filter('oembed_providers', [$this, 'addOEmbedProviders']);
        add_action('rest_api_init', [$this, 'registerOEmbedRestRoutes']);

        if (is_admin()) {
            $plgSettings = self::getSettings();
            $this->admin_notice();
            $settingsClassNamespace = '\\EmbedPress\\Ends\\Back\\Settings';
            add_action('admin_menu', [$settingsClassNamespace, 'registerMenuItem']);
            add_action('admin_init', [$settingsClassNamespace, 'registerActions']);
            unset($settingsClassNamespace);

            add_filter('plugin_action_links_embedpress/embedpress.php', ['\\EmbedPress\\Core', 'handleActionLinks'], 10,
                2);

            add_action('admin_enqueue_scripts', ['\\EmbedPress\\Ends\\Back\\Handler', 'enqueueStyles']);
            add_action('wp_ajax_embedpress_notice_dismiss', ['\\EmbedPress\\Ends\\Back\\Handler', 'embedpress_notice_dismiss']);

            $plgHandlerAdminInstance = new EndHandlerAdmin($this->getPluginName(), $this->getPluginVersion());

            if ((bool) $plgSettings->enablePluginInAdmin) {
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
        add_filter('fl_builder_before_render_shortcodes',
            ['\\EmbedPress\\ThirdParty\\BeaverBuilder', 'before_render_shortcodes']);
        $this->start_plugin_tracking();
        $this->loaderInstance->run();
    }

    /**
     * @param $providers
     *
     * @return mixed
     */
    public function addOEmbedProviders ($providers) {
        $newProviders = [
            // Viddler
            '#https?://(.+\.)?viddler\.com/v/.+#i' => 'viddler',

            // Deviantart.com (http://www.deviantart.com)
            '#https?://(.+\.)?deviantart\.com/art/.+#i' => 'devianart',
            '#https?://(.+\.)?deviantart\.com/.+#i' => 'devianart',
            '#https?://(.+\.)?deviantart\.com/.*/d.+#i' => 'devianart',
            '#https?://(.+\.)?fav\.me/.+#i' => 'devianart',
            '#https?://(.+\.)?sta\.sh/.+#i' => 'devianart',

            // chirbit.com (http://www.chirbit.com/)
            '#https?://(.+\.)?chirb\.it/.+#i' => 'chirbit',


            // nfb.ca (http://www.nfb.ca/)
            '#https?://(.+\.)?nfb\.ca/film/.+#i' => 'nfb',

            // Dotsub (http://dotsub.com/)
            '#https?://(.+\.)?dotsub\.com/view/.+#i' => 'dotsub',

            // Rdio (http://rdio.com/)
            '#https?://(.+\.)?rdio\.com/(artist|people)/.+#i' => 'rdio',

            // Sapo Videos (http://videos.sapo.pt)
            '#https?://(.+\.)?videos\.sapo\.pt/.+#i' => 'sapo',

            // Official FM (http://official.fm)
            '#https?://(.+\.)?official\.fm/(tracks|playlists)/.+#i' => 'officialfm',

            // HuffDuffer (http://huffduffer.com)
            '#https?://(.+\.)?huffduffer\.com/.+#i' => 'huffduffer',

            // Shoudio (http://shoudio.com)
            '#https?://(.+\.)?shoudio\.(com|io)/.+#i' => 'shoudio',

            // Moby Picture (http://www.mobypicture.com)
            '#https?://(.+\.)?mobypicture\.com/user/.+/view/.+#i' => 'mobypicture',
            '#https?://(.+\.)?moby\.to/.+#i' => 'mobypicture',

            // 23HQ (http://www.23hq.com)
            '#https?://(.+\.)?23hq\.com/.+/photo/.+#i' => '23hq',

            // Cacoo (https://cacoo.com)
            '#https?://(.+\.)?cacoo\.com/diagrams/.+#i' => 'cacoo',

            // Dipity (http://www.dipity.com)
            '#https?://(.+\.)?dipity\.com/.+#i' => 'dipity',

            // Roomshare (http://roomshare.jp)
            '#https?://(.+\.)?roomshare\.jp/(en/)?post/.+#i' => 'roomshare',

            // Crowd Ranking (http://crowdranking.com)
            '#https?://(.+\.)?c9ng\.com/.+#i' => 'crowd',

            // CircuitLab (https://www.circuitlab.com/)
            '#https?://(.+\.)?circuitlab\.com/circuit/.+#i' => 'circuitlab',

            // Coub (http://coub.com/)
            '#https?://(.+\.)?coub\.com/(view|embed)/.+#i' => 'coub',

            // Ustream (http://www.ustream.tv)
            '#https?://(.+\.)?ustream\.(tv|com)/.+#i' => 'ustream',

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
            '#https?://(.+\.)?gty\.im/.+#i' => 'gettyimages',
            '#https?://(.+\.)?gettyimages\.com/detail/photo/.+#i' => 'gettyimages',

            // amCharts Live Editor (http://live.amcharts.com/)
            '#https?://(.+\.)?live\.amcharts\.com/.+#i' => 'amcharts',

            // Infogram (https://infogr.am/)
            '#https?://(.+\.)?infogr\.am/.+#i' => 'infogram',
            //(https://infogram.com/)
            '#https?://(.+\.)?infogram\.com/.+#i' => 'infogram',

            // ChartBlocks (http://www.chartblocks.com/)
            '#https?://(.+\.)?public\.chartblocks\.com/c/.+#i' => 'chartblocks',

            // ReleaseWire (http://www.releasewire.com/)
            '#https?://(.+\.)?rwire\.com/.+#i' => 'releasewire',

            // ShortNote (https://www.shortnote.jp/)
            '#https?://(.+\.)?shortnote\.jp/view/notes/.+#i' => 'shortnote',

            // EgliseInfo (http://egliseinfo.catholique.fr/)
            '#https?://(.+\.)?egliseinfo\.catholique\.fr/.+#i' => 'egliseinfo',

            // Silk (http://www.silk.co/)
            '#https?://(.+\.)?silk\.co/explore/.+#i' => 'silk',
            '#https?://(.+\.)?silk\.co/s/embed/.+#i' => 'silk',

            // http://bambuser.com
            '#https?://(.+\.)?bambuser\.com/v/.+#i' => 'bambuser',

            // https://clyp.it
            '#https?://(.+\.)?clyp\.it/.+#i' => 'clyp',

            // https://gist.github.com
            '#https?://(.+\.)?gist\.github\.com/.+#i' => 'github',

            // https://portfolium.com
            '#https?://(.+\.)?portfolium\.com/.+#i' => 'portfolium',

            // http://rutube.ru
            '#https?://(.+\.)?rutube\.ru/video/.+#i' => 'rutube',

            // http://www.videojug.com
            '#https?://(.+\.)?videojug\.com/.+#i' => 'videojug',

            // https://vine.com
            '#https?://(.+\.)?vine\.co/v/.+#i' => 'vine',

            // Google Shortened Url
            '#https?://(.+\.)?goo\.gl/.+#i' => 'google',

            // Google Maps
            '#https?://(.+\.)?google\.com/maps/.+#i' => 'googlemaps',
            '#https?://(.+\.)?maps\.google\.com/.+#i' => 'googlemaps',

            // Google Docs
            '#https?://(.+\.)?docs\.google\.com/(.+/)?(document|presentation|spreadsheets|forms|drawings)/.+#i' => 'googledocs',

            // Twitch.tv
            '#https?://(.+\.)?twitch\.tv/.+#i' => 'twitch',

            // Giphy
            '#https?://(.+\.)?giphy\.com/gifs/.+#i' => 'giphy',
            '#https?://(.+\.)?i\.giphy\.com/.+#i' => 'giphy',
            '#https?://(.+\.)?gph\.is/.+#i' => 'giphy',

            // Wistia
            '#https?://(.+\.)?wistia\.com/medias/.+#i' => 'wistia',
            '#https?://(.+\.)?fast\.wistia\.com/embed/medias/.+#i\.jsonp' => 'wistia',
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
            $path = ABSPATH.WPINC.'/class-wp-rewrite.php';
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
                rest_url('embedpress/v1/oembed/'.$data),
                true,
            ];
        }

        $providers = array_merge($providers, $newProviders);

        return $providers;
    }

    /**
     * Register OEmbed Rest Routes
     */
    public function registerOEmbedRestRoutes () {
        register_rest_route(
            'embedpress/v1', '/oembed/(?P<provider>[a-zA-Z0-9\-]+)',
            [
                'methods' => \WP_REST_Server::READABLE,
                'callback' => ['\\EmbedPress\\RestAPI', 'oembed'],
            ]
        );
    }

    /**
     * Callback called right after the plugin has been activated.
     *
     * @return  void
     * @since   1.0.0
     * @static
     *
     */
    public static function onPluginActivationCallback () {
        flush_rewrite_rules();
    }

    /**
     * Callback called right after the plugin has been deactivated.
     *
     * @return  void
     * @since   1.0.0
     * @static
     *
     */
    public static function onPluginDeactivationCallback () {
        flush_rewrite_rules();
    }

    /**
     * Method that retrieves all additional service providers defined in the ~<plugin_root_path>/providers.php file.
     *
     * @return  array
     * @since   1.0.0
     * @static
     *
     */
    public static function getAdditionalServiceProviders () {
        $additionalProvidersFilePath = EMBEDPRESS_PATH_BASE.'providers.php';
        if (file_exists($additionalProvidersFilePath)) {
            include $additionalProvidersFilePath;

            if (isset($additionalServiceProviders)) {
                return $additionalServiceProviders;
            }
        }

        return [];
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
    public static function canServiceProviderBeResponsive ($serviceProviderAlias) {
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
    public static function getSettings () {
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
            $settings['enableEmbedResizeHeight'] = 552;
        }

        if (!isset($settings['enableEmbedResizeWidth'])) {
            $settings['enableEmbedResizeWidth'] = 652;
        }

        return (object) $settings;
    }

    /**
     * Method that register an EmbedPress plugin.
     *
     * @param  array  $pluginMeta  Associative array containing plugin's name, slug and namespace
     *
     * @return  void
     * @since   1.4.0
     * @static
     *
     */
    public static function registerPlugin ($pluginMeta) {
        $pluginMeta = json_decode(json_encode($pluginMeta));

        if (empty($pluginMeta->name) || empty($pluginMeta->slug) || empty($pluginMeta->namespace)) {
            return;
        }

        if (!isset(self::$plugins[$pluginMeta->slug])) {
            AutoLoader::register($pluginMeta->namespace,
                WP_PLUGIN_DIR.'/'.EMBEDPRESS_PLG_NAME.'-'.$pluginMeta->slug.'/'.$pluginMeta->name);

            $plugin = "{$pluginMeta->namespace}\Plugin";
            if (\defined("{$plugin}::SLUG") && $plugin::SLUG !== null) {
                self::$plugins[$pluginMeta->slug] = $pluginMeta->namespace;

                $bsFilePath = $plugin::PATH.EMBEDPRESS_PLG_NAME.'-'.$plugin::SLUG.'.php';

                register_activation_hook($bsFilePath, [$plugin::NAMESPACE_STRING, 'onActivationCallback']);
                register_deactivation_hook($bsFilePath, [$plugin::NAMESPACE_STRING, 'onDeactivationCallback']);

                add_action('admin_init', [$plugin, 'onLoadAdminCallback']);

                add_action(EMBEDPRESS_PLG_NAME.':'.$plugin::SLUG.':settings:register',
                    [$plugin, 'registerSettings']);
                add_action(EMBEDPRESS_PLG_NAME.':settings:render:tab', [$plugin, 'renderTab']);

                add_filter('plugin_action_links_embedpress-'.$plugin::SLUG.'/embedpress-'.$plugin::SLUG.'.php',
                    [$plugin, 'handleActionLinks'], 10, 2);

                $plugin::registerEvents();
            }
        }
    }

    /**
     * Retrieve all registered plugins.
     *
     * @return  array
     * @since   1.4.0
     * @static
     *
     */
    public static function getPlugins () {
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
    public static function handleActionLinks ($links, $file) {
        $settingsLink = '<a href="'.admin_url('admin.php?page=embedpress').'" aria-label="'.__('Open settings page',
                'embedpress').'">'.__('Settings', 'embedpress').'</a>';

        array_unshift($links, $settingsLink);

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
    public static function allowApiHost ($isAllowed, $host, $url) {
        if ($host === EMBEDPRESS_LICENSES_API_HOST) {
            $isAllowed = true;
        }

        return $isAllowed;
    }


}
