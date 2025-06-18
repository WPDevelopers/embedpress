<?php

namespace EmbedPress\Core;

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

        // Only setup localization on post edit pages
        if (!in_array($pagenow, ['post.php', 'post-new.php'])) {
            return;
        }

        self::setup_preview_localization();
    }

    /**
     * Setup editor localization scripts
     */
    public static function setup_editor_localization()
    {
        self::setup_gutenberg_localization();
    }

    /**
     * Setup preview.js localization ($data variable)
     */
    private static function setup_preview_localization()
    {
        $script_handle = 'embedpress';

        if (!wp_script_is($script_handle, 'enqueued') && !wp_script_is($script_handle, 'registered')) {
            return;
        }

        $url_schemes = apply_filters('embedpress:getAdditionalURLSchemes', self::get_url_schemes());

        // Ensure required constants are defined with fallbacks
        $version = defined('EMBEDPRESS_VERSION') ? EMBEDPRESS_VERSION : '1.0.0';
        $shortcode = defined('EMBEDPRESS_SHORTCODE') ? EMBEDPRESS_SHORTCODE : 'embedpress';
        $assets_url = defined('EMBEDPRESS_URL_ASSETS') ? EMBEDPRESS_URL_ASSETS : '';

        wp_localize_script($script_handle, '$data', [
            'previewSettings' => [
                'baseUrl'    => get_site_url() . '/',
                'versionUID' => $version,
                'debug'      => defined('WP_DEBUG') && WP_DEBUG,
            ],
            'EMBEDPRESS_SHORTCODE'  => $shortcode,
            'EMBEDPRESS_URL_ASSETS' => $assets_url,
            'urlSchemes'            => $url_schemes,
        ]);

        wp_localize_script($script_handle, 'EMBEDPRESS_ADMIN_PARAMS', [
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce'   => wp_create_nonce('embedpress')
        ]);
    }

    /**
     * Setup license script localization
     */
    private static function setup_license_localization()
    {
        $script_handle = 'embedpress-lisence';

        if (!wp_script_is($script_handle, 'enqueued') && !wp_script_is($script_handle, 'registered')) {
            return;
        }

        $item_id = defined('EMBEDPRESS_SL_ITEM_ID') ? EMBEDPRESS_SL_ITEM_ID : 'embedpress';

        wp_localize_script($script_handle, 'wpdeveloperLicenseManagerNonce', [
            'embedpress_lisence_nonce' => wp_create_nonce('wpdeveloper_sl_' . $item_id . '_nonce')
        ]);
    }

    /**
     * Setup Gutenberg blocks localization (embedpressObj variable)
     */
    private static function setup_gutenberg_localization()
    {
        $script_handle = 'embedpress_blocks-cgb-block-js';

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

        wp_localize_script($script_handle, 'embedpressObj', [
            'wistia_labels'  => json_encode($wistia_labels),
            'wisita_options' => $wistia_options,
            'embedpress_powered_by' => apply_filters('embedpress_document_block_powered_by', true),
            'embedpress_pro' => defined('EMBEDPRESS_PRO_PLUGIN_FILE'),
            'twitch_host' => !empty($pars_url['host']) ? $pars_url['host'] : '',
            'site_url' => site_url(),
            'active_blocks' => $active_blocks,
            'document_cta' => $documents_cta_options,
            'pdf_renderer' => self::get_pdf_renderer(),
            'is_pro_plugin_active' => defined('EMBEDPRESS_SL_ITEM_SLUG'),
            'ajaxurl' => admin_url('admin-ajax.php'),
            'source_nonce' => wp_create_nonce('source_nonce_embedpress'),
            'can_upload_media' => current_user_can('upload_files'),
            'EMBEDPRESS_URL_ASSETS' => $assets_url,
            'iframe_width' => self::get_option_value('enableEmbedResizeWidth', '600'),
            'iframe_height' => self::get_option_value('enableEmbedResizeHeight', '400'),
            'pdf_custom_color' => self::get_option_value('custom_color', '#000000'),
            'youtube_brand_logo_url' => self::get_branding_value('logo_url', 'youtube'),
            'vimeo_brand_logo_url' => self::get_branding_value('logo_url', 'vimeo'),
            'wistia_brand_logo_url' => self::get_branding_value('logo_url', 'wistia'),
            'twitch_brand_logo_url' => self::get_branding_value('logo_url', 'twitch'),
            'dailymotion_brand_logo_url' => self::get_branding_value('logo_url', 'dailymotion'),
            'user_roles' => self::get_user_roles(),
            'current_user' => $current_user->data,
            'is_embedpress_feedback_submited' => get_option('embedpress_feedback_submited'),
            'turn_off_rating_help' => self::get_option_value('turn_off_rating_help', false),
        ]);
    }

    /**
     * Get Wistia labels for localization
     * 
     * @return array
     */
    private static function get_wistia_labels()
    {
        return [
            'autoplay' => __('Auto Play', 'embedpress'),
            'captions' => __('Captions', 'embedpress'),
            'playbutton' => __('Play Button', 'embedpress'),
            'smallplaybutton' => __('Small Play Button', 'embedpress'),
            'playbar' => __('Play Bar', 'embedpress'),
            'resumable' => __('Resumable', 'embedpress'),
            'focus' => __('Focus', 'embedpress'),
            'volumecontrol' => __('Volume Control', 'embedpress'),
            'volume' => __('Volume', 'embedpress'),
            'rewind' => __('Rewind', 'embedpress'),
            'fullscreen' => __('Fullscreen', 'embedpress'),
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
            return embedpress_wisita_pro_get_options();
        } catch (\Exception $e) {
            // Silently fail if function throws an error
            return null;
        }
    }

    /**
     * Get PDF renderer safely
     * 
     * @return string
     */
    private static function get_pdf_renderer()
    {
        if (class_exists('\\EmbedPress\\Includes\\Classes\\Helper')) {
            try {
                return \EmbedPress\Includes\Classes\Helper::get_pdf_renderer();
            } catch (\Exception $e) {
                return 'google';
            }
        }

        return 'google';
    }

    /**
     * Get option value safely
     * 
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    private static function get_option_value($key, $default = '')
    {
        if (!function_exists('get_options_value')) {
            return $default;
        }

        try {
            return get_options_value($key);
        } catch (\Exception $e) {
            return $default;
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
            return get_branding_value($type, $provider);
        } catch (\Exception $e) {
            return '';
        }
    }

    /**
     * Get user roles safely
     * 
     * @return array
     */
    private static function get_user_roles()
    {
        if (!function_exists('embedpress_get_user_roles')) {
            return [];
        }

        try {
            return embedpress_get_user_roles();
        } catch (\Exception $e) {
            return [];
        }
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
     * Check if localization is working (for debugging)
     * 
     * @return array
     */
    public static function debug_localization_status()
    {
        global $wp_scripts;

        $status = [
            'preview_script' => [
                'handle' => 'embedpress',
                'registered' => wp_script_is('embedpress', 'registered'),
                'enqueued' => wp_script_is('embedpress', 'enqueued'),
                'has_data' => false,
            ],
            'gutenberg_script' => [
                'handle' => 'embedpress_blocks-cgb-block-js',
                'registered' => wp_script_is('embedpress_blocks-cgb-block-js', 'registered'),
                'enqueued' => wp_script_is('embedpress_blocks-cgb-block-js', 'enqueued'),
                'has_data' => false,
            ],
            'license_script' => [
                'handle' => 'embedpress-lisence',
                'registered' => wp_script_is('embedpress-lisence', 'registered'),
                'enqueued' => wp_script_is('embedpress-lisence', 'enqueued'),
                'has_data' => false,
            ]
        ];

        // Check if localization data exists
        if (isset($wp_scripts->registered['embedpress']->extra['data'])) {
            $status['preview_script']['has_data'] = true;
        }

        if (isset($wp_scripts->registered['embedpress_blocks-cgb-block-js']->extra['data'])) {
            $status['gutenberg_script']['has_data'] = true;
        }

        if (isset($wp_scripts->registered['embedpress-lisence']->extra['data'])) {
            $status['license_script']['has_data'] = true;
        }

        return $status;
    }

    /**
     * Initialize localization manager hooks
     */
    public static function init()
    {
        // Add debug endpoint for testing
        if (defined('WP_DEBUG') && WP_DEBUG) {
            add_action('wp_ajax_embedpress_debug_localization', [__CLASS__, 'ajax_debug_localization']);
            add_action('wp_ajax_nopriv_embedpress_debug_localization', [__CLASS__, 'ajax_debug_localization']);
        }
    }

    /**
     * AJAX endpoint for debugging localization
     */
    public static function ajax_debug_localization()
    {
        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }

        $status = self::debug_localization_status();

        wp_send_json_success([
            'message' => 'Localization debug information',
            'data' => $status,
            'timestamp' => current_time('mysql')
        ]);
    }
}
