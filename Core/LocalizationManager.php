<?php

namespace EmbedPress\Core;

use EmbedPress\Includes\Classes\Helper;

/**
 * EmbedPress Localization Manager
 * 
 * Handles all JavaScript localization for EmbedPress blocks, admin, and frontend
 * Provides clean separation of concerns from AssetManager
 */
class LocalizationManager
{
    /**
     * Setup admin localization scripts
     * 
     * @param string $hook Current admin page hook
     */
    public static function setup_admin_localization($hook)
    {
        global $pagenow;

        self::setup_license_localization();

        // Setup settings page localization if on EmbedPress settings page
        if (strpos($hook, 'embedpress') !== false) {
            self::setup_settings_localization();
            self::setup_preview_localization();
        }

        // Only setup localization on post edit pages
        if (!in_array($pagenow, ['post.php', 'post-new.php'])) {
            return;
        }
    }

    /**
     * Setup editor localization scripts
     */
    public static function setup_editor_localization()
    {
        self::setup_frontend_script_localization();
        self::setup_gutenberg_localization();
        self::setup_new_blocks_localization();
    }

    /**
     * Setup frontend localization scripts
     */
    public static function setup_frontend_localization()
    {
        self::setup_frontend_script_localization();
        self::setup_gutenberg_localization();
        self::setup_preview_localization();
        self::setup_analytics_localization();
    }

    /**
     * Setup Elementor widget localization
     */
    public static function setup_elementor_localization()
    {
        self::setup_frontend_script_localization();
        self::setup_calendar_widget_localization();
        self::setup_analytics_localization();
    }

    /**
     * Setup preview localization (attached to admin script)
     */
    private static function setup_preview_localization()
    {
        $script_handle = 'embedpress-admin';

        if (!wp_script_is($script_handle, 'enqueued') && !wp_script_is($script_handle, 'registered')) {
            return;
        }

        $url_schemes = apply_filters('embedpress:getAdditionalURLSchemes', self::get_url_schemes());

        // Ensure required constants are defined with fallbacks
        $version = defined('EMBEDPRESS_VERSION') ? EMBEDPRESS_VERSION : '1.0.0';
        $shortcode = defined('EMBEDPRESS_SHORTCODE') ? EMBEDPRESS_SHORTCODE : 'embedpress';
        $assets_url = defined('EMBEDPRESS_URL_ASSETS') ? EMBEDPRESS_URL_ASSETS : '';

        wp_localize_script($script_handle, 'embedpressPreviewData', [
            'previewSettings' => [
                'baseUrl'    => get_site_url() . '/',
                'versionUID' => $version,
                'debug'      => defined('WP_DEBUG') && WP_DEBUG,
            ],
            'shortcode'  => $shortcode,
            'assetsUrl' => $assets_url,
            'urlSchemes'            => $url_schemes,
        ]);

        wp_localize_script($script_handle, 'embedpressAdminParams', [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce'   => wp_create_nonce('embedpress')
        ]);
    }

    /**
     * Setup license script localization
     */
    private static function setup_license_localization()
    {
        $script_handle = 'embedpress-admin';

        if (!wp_script_is($script_handle, 'enqueued') && !wp_script_is($script_handle, 'registered')) {
            return;
        }

        $item_id = defined('EMBEDPRESS_SL_ITEM_ID') ? EMBEDPRESS_SL_ITEM_ID : 'embedpress';

        wp_localize_script($script_handle, 'embedpressLicenseData', [
            'nonce' => wp_create_nonce('wpdeveloper_sl_' . $item_id . '_nonce')
        ]);
    }

    /**
     * Setup Gutenberg blocks localization (embedpressObj variable)
     */
    private static function setup_gutenberg_localization()
    {
        $script_handle = 'embedpress-blocks-editor';

        if (!wp_script_is($script_handle, 'enqueued') && !wp_script_is($script_handle, 'registered')) {
            return;
        }

        // Ensure required constants are defined
        if (!defined('EMBEDPRESS_PLG_NAME')) {
            return;
        }

        $elements = (array) get_option(EMBEDPRESS_PLG_NAME . ":elements", []);
        $active_blocks = isset($elements['gutenberg']) ? (array) $elements['gutenberg'] : [];

        $wistia_labels = self::get_wistia_labels();
        $wistia_options = self::get_wistia_options();
        $pars_url = wp_parse_url(get_site_url());
        $documents_cta_options = (array) get_option(EMBEDPRESS_PLG_NAME . ':document');
        $current_user = wp_get_current_user();
        $assets_url = defined('EMBEDPRESS_URL_ASSETS') ? EMBEDPRESS_URL_ASSETS : '';
        $static_url = defined('EMBEDPRESS_URL_STATIC') ? EMBEDPRESS_URL_STATIC : '';

        wp_localize_script($script_handle, 'embedpressGutenbergData', [
            'wistiaLabels'  => json_encode($wistia_labels),
            'wistiaOptions' => $wistia_options,
            'poweredBy' => apply_filters('embedpress_document_block_powered_by', true),
            'isProVersion' => defined('EMBEDPRESS_PRO_PLUGIN_FILE'),
            'twitchHost' => !empty($pars_url['host']) ? $pars_url['host'] : '',
            'siteUrl' => site_url(),
            'activeBlocks' => $active_blocks,
            'documentCta' => $documents_cta_options,
            'pdfRenderer' => Helper::get_pdf_renderer(),
            'isProPluginActive' => defined('EMBEDPRESS_SL_ITEM_SLUG'),
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'sourceNonce' => wp_create_nonce('source_nonce_embedpress'),
            'canUploadMedia' => current_user_can('upload_files'),
            'assetsUrl' => $assets_url,
            'staticUrl' => $static_url,
            'iframeWidth' => Helper::get_options_value('enableEmbedResizeWidth', '600'),
            'iframeHeight' => Helper::get_options_value('enableEmbedResizeHeight', '400'),
            'pdfCustomColor' => Helper::get_options_value('custom_color', '#403A81'),
            'brandingLogos' => [
                'youtube' => Helper::get_branding_value('logo_url', 'youtube'),
                'vimeo' => Helper::get_branding_value('logo_url', 'vimeo'),
                'wistia' => Helper::get_branding_value('logo_url', 'wistia'),
                'twitch' => Helper::get_branding_value('logo_url', 'twitch'),
                'dailymotion' => Helper::get_branding_value('logo_url', 'dailymotion'),
            ],
            'userRoles' => Helper::get_user_roles(),
            'currentUser' => $current_user->data,
            'feedbackSubmitted' => get_option('embedpress_feedback_submited'),
            'ratingHelpDisabled' => Helper::get_options_value('turn_off_rating_help', false),
        ]);
    }

    /**
     * Setup frontend script localization (embedpressFrontendData variable)
     */
    private static function setup_frontend_script_localization()
    {
        // The embedpressFrontendData variable should be attached to multiple frontend scripts
        $script_handles = ['embedpress-front', 'embedpress-ads'];

        $localization_data = [
            'ajaxurl' => admin_url('admin-ajax.php'),
            'isProPluginActive' => defined('EMBEDPRESS_SL_ITEM_SLUG'),
            'nonce' => wp_create_nonce('ep_nonce'),
        ];

        foreach ($script_handles as $script_handle) {
            if (wp_script_is($script_handle, 'enqueued') || wp_script_is($script_handle, 'registered')) {
                wp_localize_script($script_handle, 'embedpressFrontendData', $localization_data);
            }
        }
    }

    /**
     * Setup settings page localization (attached to admin script)
     */
    private static function setup_settings_localization()
    {
        $script_handle = 'embedpress-admin';

        if (!wp_script_is($script_handle, 'enqueued') && !wp_script_is($script_handle, 'registered')) {
            return;
        }

        wp_localize_script($script_handle, 'embedpressSettingsData', [
            'nonce' => wp_create_nonce('embedpress_elements_action'),
        ]);
    }

    /**
     * Setup new blocks localization (for new block system)
     */
    private static function setup_new_blocks_localization()
    {
        // Try multiple possible handles for new blocks
        $possible_handles = [
            'embedpress-blocks-editor', // Current handle from AssetManager
            'embedpress-blocks', // Old handle
            'embedpress_blocks-cgb-block-js', // Legacy handle
            'embedpress-blocks-js', // Alternative handle
        ];

        $script_handle = null;
        foreach ($possible_handles as $handle) {
            if (wp_script_is($handle, 'enqueued') || wp_script_is($handle, 'registered')) {
                $script_handle = $handle;
                break;
            }
        }

        if (!$script_handle) {
            return;
        }

        // Ensure required constants are defined
        if (!defined('EMBEDPRESS_PLG_NAME')) {
            return;
        }

        $elements = (array) get_option(EMBEDPRESS_PLG_NAME . ":elements", []);
        $active_blocks = isset($elements['gutenberg']) ? (array) $elements['gutenberg'] : [];

        wp_localize_script($script_handle, 'embedpressNewBlocksData', [
            'pluginDirPath' => defined('EMBEDPRESS_PATH_BASE') ? EMBEDPRESS_PATH_BASE : '',
            'pluginDirUrl' => defined('EMBEDPRESS_URL_STATIC') ? EMBEDPRESS_URL_STATIC . '../' : '',
            'activeBlocks' => $active_blocks,
            'canUploadMedia' => current_user_can('upload_files'),
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('embedpress_nonce'),
            'restUrl' => rest_url('embedpress/v1/'),
            'siteUrl' => site_url(),
        ]);
    }





    /**
     * Setup analytics tracker localization
     */
    private static function setup_analytics_localization()
    {
        $script_handle = 'embedpress-analytics-tracker';

        if (!wp_script_is($script_handle, 'enqueued') && !wp_script_is($script_handle, 'registered')) {
            return;
        }

        // Get analytics manager instance to check for embedded content
        $has_embedded_content = false;
        if (class_exists('EmbedPress\Includes\Classes\Analytics\Analytics_Manager')) {
            $analytics_manager = \EmbedPress\Includes\Classes\Analytics\Analytics_Manager::get_instance();
            $has_embedded_content = $analytics_manager->has_embedded_content();
        }

        // Get tracking enabled setting
        $tracking_enabled = get_option('embedpress_analytics_tracking_enabled', true);

        // Get original referrer if available
        $original_referrer = '';
        if (defined('EMBEDPRESS_ORIGINAL_REFERRER') && !empty(EMBEDPRESS_ORIGINAL_REFERRER)) {
            $original_referrer = EMBEDPRESS_ORIGINAL_REFERRER;
        }

        // Get session ID safely
        $session_id = self::get_analytics_session_id();

        wp_localize_script($script_handle, 'embedpress_analytics', [
            'ajax_url' => admin_url('admin-ajax.php'),
            'rest_url' => rest_url('embedpress/v1/analytics/'),
            'nonce' => wp_create_nonce('wp_rest'),
            'session_id' => $session_id,
            'page_url' => get_permalink(),
            'post_id' => get_the_ID(),
            'tracking_enabled' => (bool) $tracking_enabled,
            'original_referrer' => $original_referrer,
            'has_embedded_content' => $has_embedded_content
        ]);
    }

    /**
     * Setup Google Calendar widget localization
     */
    private static function setup_calendar_widget_localization()
    {
        $script_handle = 'epgc';

        if (!wp_script_is($script_handle, 'enqueued') && !wp_script_is($script_handle, 'registered')) {
            return;
        }

        $nonce = wp_create_nonce('epgc_nonce');
        wp_localize_script($script_handle, 'embedpressCalendarData', [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => $nonce,
            'translations' => [
                'allDay' => __('All day', 'embedpress'),
                'createdBy' => __('Created by', 'embedpress'),
                'goToEvent' => __('Go to event', 'embedpress'),
                'unknownError' => __('Unknown error', 'embedpress'),
                'requestError' => __('Request error', 'embedpress'),
                'loading' => __('Loading', 'embedpress')
            ]
        ]);
    }

    /**
     * Load plugin text domain for translations
     */
    public static function load_text_domain()
    {
        $locale = determine_locale();
        $locale = apply_filters('plugin_locale', $locale, 'embedpress');

        // Load from WordPress languages directory first
        if (file_exists(WP_LANG_DIR . "/embedpress-" . $locale . '.mo')) {
            unload_textdomain('embedpress');
            load_textdomain('embedpress', WP_LANG_DIR . "/embedpress-" . $locale . '.mo');
        }

        // Load from plugin languages directory
        load_plugin_textdomain('embedpress', false, plugin_basename(dirname(EMBEDPRESS_FILE)) . '/languages');
    }

    /**
     * Get Wistia labels for localization
     *
     * @return array
     */
    private static function get_wistia_labels()
    {
        return [
            'watch_from_beginning'       => __('Watch from the beginning', 'embedpress'),
            'skip_to_where_you_left_off' => __('Skip to where you left off', 'embedpress'),
            'you_have_watched_it_before' => __('It looks like you\'ve watched<br />part of this video before!', 'embedpress'),
        ];
    }

    /**
     * Get Wistia options safely
     * 
     * @return mixed|null
     */
    private static function get_wistia_options()
    {
        if (!function_exists('embedpress_wisita_pro_get_options')) {
            return null;
        }

        try {
            // return embedpress_wisita_pro_get_options();
        } catch (\Exception $e) {
            // Silently fail if function throws an error
            return null;
        }
    }

    /**
     * Get branding value safely
     * 
     * @param string $type
     * @param string $provider
     * @return string
     */
    private static function get_branding_value($type, $provider)
    {
        if (!function_exists('get_branding_value')) {
            return '';
        }

        try {
            return self::get_branding_value($type, $provider);
        } catch (\Exception $e) {
            return '';
        }
    }

    /**
     * Get analytics session ID safely
     *
     * @return string
     */
    private static function get_analytics_session_id()
    {
        // Only start session if we're in a web context and headers haven't been sent
        if (!session_id() && !headers_sent() && !defined('WP_CLI')) {
            session_start();
        }

        if (session_id() && !isset($_SESSION['embedpress_session_id'])) {
            $_SESSION['embedpress_session_id'] = wp_generate_uuid4();
        }

        // Fallback to a generated session ID if session is not available
        return isset($_SESSION['embedpress_session_id'])
            ? $_SESSION['embedpress_session_id']
            : 'session_' . wp_generate_uuid4();
    }

    /**
     * Get URL schemes for preview script
     *
     * @return array
     */
    private static function get_url_schemes()
    {
        return [
            // Apple podcasts
            'podcasts.apple.com/*',
            // YouTube
            'youtube.com/watch\\?*',
            'youtube.com/playlist\\?*',
            'youtube.com/channel/*',
            'youtube.com/c/*',
            'youtube.com/user/*',
            'youtube.com/(\w+)[^?\/]*$',
            // Vimeo
            'vimeo.com/*',
            'vimeo.com/groups/*/videos/*',
            // Twitter
            'twitter.com/*/status/*',
            'twitter.com/i/moments/*',
            'twitter.com/*/timelines/*',
            // Facebook
            'facebook.com/*',
            'fb.watch/*',
            // Instagram
            'instagram.com/p/*',
            'instagr.am/p/*',
            // SoundCloud
            'soundcloud.com/*',
            // Twitch
            '*.twitch.tv/*',
            'twitch.tv/*',
            // Wistia
            '*.wistia.com/medias/*',
            'fast.wistia.com/embed/medias/*.jsonp',
            // Google services
            'google.com/*',
            'google.com.*/*',
            'google.co.*/*',
            'maps.google.com/*',
            'docs.google.com/presentation/*',
            'docs.google.com/document/*',
            'docs.google.com/spreadsheets/*',
            'docs.google.com/forms/*',
            'docs.google.com/drawings/*',
        ];
    }

    /**
     * Initialize localization manager hooks
     */
    public static function init()
    {
        // Load text domain early
        add_action('plugins_loaded', [__CLASS__, 'load_text_domain'], 1);
    }
}
