<?php

namespace EmbedPress;

use Embera\Embera;
use Embera\ProviderCollection\DefaultProviderCollection;
use EmbedPress\Includes\Classes\Helper;
use WP_oEmbed;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Entity responsible to handle the plugin's shortcode events and behaviors.
 *
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2023 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       1.0.0
 */

class Shortcode
{
    /**
     * The WP_oEmbed class instance.
     *
     * @since   1.0.0
     * @access  private
     * @static
     *
     * @var     WP_oEmbed $oEmbedInstance
     */


    public static $y = 0;

    private static $oEmbedInstance = null;

    /**
     * The Embera class instance.
     *
     * @since   2.7.4
     * @access  private
     * @static
     *
     * @var     Embera $embera_instance
     */
    private static $embera_instance = null;
    /**
     * The DefaultProviderCollection class instance.
     *
     * @since   1.0.0
     * @access  private
     * @static
     *
     * @var     DefaultProviderCollection $collection
     */
    private static $collection = null;

    private static $emberaInstanceSettings = [];
    private static $ombed_attributes;
    public static $attributes_data;

    public static function shortcode_scripts()
    {
        $dependencies = ['jquery'];

        wp_enqueue_style(
            'embedpress-style',
            EMBEDPRESS_URL_ASSETS . 'css/embedpress.css',
            EMBEDPRESS_PLUGIN_VERSION,
            true
        );


        // Enqueue script for MentionNode
        wp_enqueue_script(
            'embedpress-front',
            EMBEDPRESS_URL_ASSETS . 'js/front.js',
            $dependencies,
            EMBEDPRESS_PLUGIN_VERSION,
            true
        );
    }

    /**
     * Register the plugin's shortcode into WordPress.
     *
     * @return  void
     * @since   1.0.0
     * @static
     *
     */
    public static function register()
    {
        // Register the new shortcode for embeds.
        add_shortcode(EMBEDPRESS_SHORTCODE, ['\\EmbedPress\\Shortcode', 'do_shortcode']);
        add_shortcode('embed_oembed_html', ['\\EmbedPress\\Shortcode', 'do_shortcode']);
        add_shortcode('embedpress', ['\\EmbedPress\\Shortcode', 'do_shortcode']);
        add_shortcode('embedpress_pdf', ['\\EmbedPress\\Shortcode', 'do_shortcode_pdf']);
        add_shortcode('embedpress_doc', ['\\EmbedPress\\Shortcode', 'do_shortcode_doc']);
    }

    /**
     * Method that converts the plugin shortcoded-string into its complex content.
     *
     * @param array $attributes Array of attributes
     * @param string $subject The given string
     *
     * @return  string
     * @since   1.0.0
     * @static
     *
     */



    public static function content_protection_content($client_id = '', $protection_message = '', $allowed_roles = [])
    {
        $default_message = "This content is protected. Please log in or contact the administrator for access.";
        $protection_message = $protection_message ?: $default_message;

        $current_user = wp_get_current_user();
        $user_roles = $current_user->roles;

        if (!empty($user_roles) && array_intersect($user_roles, $allowed_roles)) {
            echo '';
            return;
        }

        if (strpos($protection_message, '[user_roles]') !== false) {
            $role_list = implode(', ', $allowed_roles);
            $protection_message = str_replace('[user_roles]', $role_list, $protection_message);
        }

        return sprintf('<div class="protected-message">%s</div>', esc_html($protection_message));
    }

    public static function display_password_form($client_id = '', $embedHtml = '', $pass_hash_key = '', $attributes = [])
    {
        $lock_heading = !empty($attributes['lockHeading']) ? sanitize_text_field($attributes['lockHeading']) : 'Content Locked';
        $lock_subheading = !empty($attributes['lockSubHeading']) ? sanitize_text_field($attributes['lockSubHeading']) : 'Content is locked and requires password to access it.';
        $lock_error_message = !empty($attributes['lockErrorMessage']) ? sanitize_text_field($attributes['lockErrorMessage']) : "Oops, that wasn't the right password. Try again.";
        $footer_message = !empty($attributes['footerMessage']) ? sanitize_text_field($attributes['footerMessage']) : "In case you don't have the password, kindly reach out to content owner or administrator to request access.";
        $password_placeholder = !empty($attributes['passwordPlaceholder']) ? sanitize_text_field($attributes['passwordPlaceholder']) : 'Password';
        $button_text = !empty($attributes['submitButtonText']) ? sanitize_text_field($attributes['submitButtonText']) : 'Unlock';
        $unlocking_text = !empty($attributes['submitUnlockingText']) ? sanitize_text_field($attributes['submitUnlockingText']) : 'Unlocking';
        $enable_footer_message = !empty($attributes['enableFooterMessage']);

        $key = Helper::get_hash();
        $salt = wp_salt(32);
        $wp_hash_key = hash('sha256', $salt . $pass_hash_key);
        $iv = substr($wp_hash_key, 0, 16);

        $cipher = openssl_encrypt($embedHtml, 'AES-128-CBC', $key, OPENSSL_RAW_DATA, $iv);
        $encrypted_data = base64_encode($cipher);

        update_post_meta(get_the_ID(), 'ep_base_' . $client_id, $encrypted_data);
        update_post_meta(get_the_ID(), 'hash_key_' . $client_id, $wp_hash_key);

        $lock_icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><g fill="#6354a5" class="color134563 svgShape"><path d="M46.3 28.7h-3v-6.4C43.3 16.1 38.2 11 32 11c-6.2 0-11.3 5.1-11.3 11.3v6.4h-3v-6.4C17.7 14.4 24.1 8 32 8s14.3 6.4 14.3 14.3v6.4" fill="#6354a5" class="color000000 svgShape"></path><path d="M44.8 55.9H19.2c-2.6 0-4.8-2.2-4.8-4.8V31.9c0-2.6 2.2-4.8 4.8-4.8h25.6c2.6 0 4.8 2.2 4.8 4.8v19.2c0 2.7-2.2 4.8-4.8 4.8zM19.2 30.3c-.9 0-1.6.7-1.6 1.6v19.2c0 .9.7 1.6 1.6 1.6h25.6c.9 0 1.6-.7 1.6-1.6V31.9c0-.9-.7-1.6-1.6-1.6H19.2z" fill="#6354a5" class="color000000 svgShape"></path><path d="M35.2 36.7c0 1.8-1.4 3.2-3.2 3.2s-3.2-1.4-3.2-3.2 1.4-3.2 3.2-3.2 3.2 1.5 3.2 3.2" fill="#6354a5" class="color000000 svgShape"></path><path d="M32.8 36.7h-1.6l-1.6 9.6h4.8l-1.6-9.6" fill="#6354a5" class="color000000 svgShape"></path></g></svg>';

        return '
        <div id="ep-shortcode-content-' . $client_id . '" class="ep-shortcode-content">	
            <div class="ep-embed-content-wraper">
                <div class="password-form-container">
                    <h2>' . esc_html($lock_heading) . '</h2>
                    <p>' . esc_html($lock_subheading) . '</p>
                    <form class="password-form" method="post" data-unlocking-text="' . esc_attr($unlocking_text) . '">
                        <div class="password-field">
                            <span class="lock-icon">' . $lock_icon . '</span>
                            <input type="password" name="pass_' . esc_attr($client_id) . '" placeholder="' . esc_attr($password_placeholder) . '" required>
                        </div>
                        <input type="hidden" name="ep_client_id" value="' . esc_attr($client_id) . '">
                        <input type="hidden" name="post_id" value="' . esc_attr(get_the_ID()) . '">
                        <input type="submit" name="password_submit" value="' . esc_attr($button_text) . '">
                        <div class="error-message hidden">' . esc_html($lock_error_message) . '</div>
                    </form>
                    ' . ($enable_footer_message ? '<p class="need-access-message">' . esc_html($footer_message) . '</p>' : '') . '
                </div>
            </div>
        </div>';
    }


    public static function do_shortcode($attributes = [], $subject = null)
    {
        $plgSettings = Core::getSettings();


        $default = [];
        if ($plgSettings->enableGlobalEmbedResize) {
            $default = [
                'width'  => esc_attr($plgSettings->enableEmbedResizeWidth),
                'height' => esc_attr($plgSettings->enableEmbedResizeHeight),
                'powered_by' => !empty($plgSettings->embedpress_document_powered_by) ? esc_attr($plgSettings->embedpress_document_powered_by) : esc_attr('no'),
            ];
        }

        if (is_array($attributes)) {
            $attributes = array_map('esc_attr', $attributes);
        }

        $attributes = wp_parse_args($attributes, $default);
        $embed = self::parseContent($subject, true, $attributes);


        $client_id = is_object($embed) ? md5($embed->embed)  : '';

        $hash_pass = isset($attributes['protection_password'])
            ? hash('sha256', wp_salt(32) . md5($attributes['protection_password']))
            : '';

        $pass_hash_key = isset($attributes['protection_password'])
            ? md5($attributes['protection_password'])
            : '';

        $password_correct = $_COOKIE['password_correct_' . $client_id] ?? '';

        $protection_type = $attributes['protection_type'] ?? 'user-role';
        $protection_password = $attributes['protection_password'] ?? '';
        $protection_content = isset($attributes['protection_content']) ? $attributes['protection_content'] === 'true' : false;
        $user_role = isset($attributes['user_roles']) ? explode(',', preg_replace('/\s*,\s*/', ',', $attributes['user_roles'])) : '';
        $protection_message = $attributes['protection_message'] ?? '';


        // Conditions for content protection
        $password_protected = $protection_type == 'password' && !empty($protection_password);

        $password_verified = $password_protected && !empty(Helper::is_password_correct($client_id)) && ($hash_pass === $password_correct);
        $user_role_protected = $protection_type === 'user-role' && Helper::has_allowed_roles($user_role);

        if (
            apply_filters('embedpress/is_allow_rander', false) && ($protection_content == 'true') && (($protection_type == 'password' && !$password_verified) || ($protection_type == 'user-role' && !Helper::has_allowed_roles($user_role)))
        ) {
            return $password_protected
                ? self::display_password_form($client_id, $embed->embed, $pass_hash_key, $attributes)
                : self::content_protection_content($client_id, $protection_message, $user_role);
        }


        if (is_object($embed)) {
            $array = get_object_vars($embed);
            if (!empty($array[$embed->url]['provider_name']) && $array[$embed->url]['provider_name'] === 'Instagram Feed') {
                $embed->embed = '<div class="ep-embed-content-wraper insta-grid">' . $embed->embed . '</div>';
            };
        }

        return is_object($embed) ? $embed->embed : $embed;
    }

    /**
     * Replace a given content with its embeded HTML code.
     *
     * @param string      The raw content that will be replaced.
     * @param bool $stripNewLine
     * @param array $customAttributes
     * @return  string|object
     * @since   1.0.0
     * @static
     */
    public static function parseContent($subject, $stripNewLine = false, $customAttributes = [])
    {
        if (!empty($subject)) {
            if (empty($customAttributes)) {
                $customAttributes = self::parseContentAttributesFromString($subject);
            }
            self::set_default_size($customAttributes);
            $url = preg_replace(
                '/(\[' . EMBEDPRESS_SHORTCODE . '(?:\]|.+?\])|\[\/' . EMBEDPRESS_SHORTCODE . '\])/i',
                "",
                $subject
            );

            if (strpos($url, 'youtube.com/embed') !== false) {
                preg_match("/embed\/([a-zA-Z0-9_-]+)/", $url, $matches);

                if (isset($matches[1])) {
                    $videoId = $matches[1];
                    $url = 'https://www.youtube.com/watch?v=' . $videoId;
                }
            }


            $uniqid = 'ose-uid-' . md5($url);
            $subject = esc_url($subject);


            // Converts any special HTML entities back to characters.
            $url = htmlspecialchars_decode($url);
            $url = esc_url($url);


            $content_uid = md5($url);

            self::$ombed_attributes = self::parseContentAttributes($customAttributes, $content_uid);

            self::set_embera_settings(self::$ombed_attributes);

            // Identify what service provider the shortcode's link belongs to
            $is_embra_provider = apply_filters('embedpress:isEmbra', false, $url, self::get_embera_settings());

            if ($is_embra_provider || (strpos($url, 'meetup.com') !== false) || (strpos($url, 'sway.office.com') !== false) || (strpos($url, 'flourish.studio') !== false)) {
                $serviceProvider = '';
            } else {
                $serviceProvider = self::get_oembed()->get_provider($url);
            }

            // FIX FOR MEETUP as MEETUP API is OFF, use OUR custom embed
            if ('https://api.meetup.com/oembed' === $serviceProvider) {
                $serviceProvider = '';
            }


            $urlData = self::get_url_data($url, self::$ombed_attributes, $serviceProvider);


            // Sanitize the data
            $urlData = self::sanitizeUrlData($urlData, $url);



            // Stores the original content
            if (is_object($urlData)) {
                $urlData->originalContent = $url;
            }

            $embedResults = apply_filters('embedpress:onBeforeEmbed', $urlData, $subject);

            if (empty($embedResults)) {
                return $subject;
            }

            // Transform all shortcode attributes into html form. I.e.: {foo: "joe"} -> foo="joe"
            $attributesHtml = ['class="ose-{provider_alias} ' . $uniqid . ' ose-embedpress-responsive"'];
            //$attributesHtml = [];
            //foreach ( self::$ombed_attributes as $attrName => $attrValue ) {
            //    $attributesHtml[] = $attrName . '="' . $attrValue . '"';
            //}
            if (isset($customAttributes['height'])) {
                $height = esc_attr($customAttributes['height']);
            }

            if (isset($customAttributes['width'])) {
                $width = esc_attr($customAttributes['width']);
                $attributesHtml[] = "style=\"width:{$width}px; height:{$height}px; max-height:{$height}px; max-width:100%; display:inline-block;\"";
            }

            // Check if $url is a google shortened url and tries to extract from it which Google service it refers to.
            self::check_for_google_url($url);
            $provider_name = self::get_provider_name($urlData, $url);
            $provider_name = sanitize_text_field($provider_name);

            // $html = '{html}';
            // if (strpos($url, 'youtube') !== false) {
            //     $html = '<div class="youtube-video">{html}</div>';
            // }

            $embedTemplate = '<div ' . implode(' ', $attributesHtml) . '>{html}</div>';

            $parsedContent = self::get_content_from_template($url, $embedTemplate, $serviceProvider);
            // Replace all single quotes to double quotes. I.e: foo='joe' -> foo="joe"
            $parsedContent = str_replace("'", '"', $parsedContent);
            $parsedContent = str_replace("{provider_alias}", esc_html($provider_name), $parsedContent);
            $parsedContent = str_replace('sandbox="allow-scripts"', 'sandbox="allow-modals allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"', $parsedContent);
            $parsedContent = str_replace('<iframe ', '<iframe allowFullScreen="true" ', $parsedContent);

            self::purify_html_content($parsedContent);
            self::modify_content_for_fb_and_canada($provider_name, $parsedContent);
            unset($embedTemplate, $serviceProvider);

            // This assure that the iframe has the same dimensions the user wants to
            if (isset(self::$emberaInstanceSettings['maxwidth']) || isset(self::$emberaInstanceSettings['maxheight'])) {
                if (isset(self::$emberaInstanceSettings['maxwidth']) && isset(self::$emberaInstanceSettings['maxheight'])) {
                    $customWidth = (int) self::$emberaInstanceSettings['maxwidth'];
                    $customHeight = (int) self::$emberaInstanceSettings['maxheight'];
                } else {
                    if (preg_match('~width="(\d+)"|width\s+:\s+(\d+)~i', $parsedContent, $matches)) {
                        $iframeWidth = (int) $matches[1];
                    }

                    if (preg_match('~height="(\d+)"|height\s+:\s+(\d+)~i', $parsedContent, $matches)) {
                        $iframeHeight = (int) $matches[1];
                    }

                    if (isset($iframeWidth) && isset($iframeHeight) && $iframeWidth > 0 && $iframeHeight > 0) {
                        $iframeRatio = ceil($iframeWidth / $iframeHeight);

                        if (isset(self::$emberaInstanceSettings['maxwidth'])) {
                            $customWidth = (int) self::$emberaInstanceSettings['maxwidth'];
                            $customHeight = ceil($customWidth / $iframeRatio);
                        } else {
                            $customHeight = (int) self::$emberaInstanceSettings['maxheight'];
                            $customWidth = $iframeRatio * $customHeight;
                        }
                    }
                }

                if (isset($customWidth) && isset($customHeight)) {
                    if (preg_match('~width="(\d+)"~i', $parsedContent)) {
                        $parsedContent = preg_replace(
                            '~width="(\d+)"~i',
                            'width="' . esc_attr($customWidth) . '"',
                            $parsedContent
                        );
                    } elseif (preg_match('~width="({.+})"~i', $parsedContent)) {
                        // this block was needed for twitch that has width="{width}" in iframe
                        $parsedContent = preg_replace(
                            '~width="({.+})"~i',
                            'width="' . esc_attr($customWidth) . '"',
                            $parsedContent
                        );
                    }

                    if (preg_match('~height="(\d+)"~i', $parsedContent)) {
                        $parsedContent = preg_replace(
                            '~height="(\d+)"~i',
                            'height="' . esc_attr($customHeight) . '"',
                            $parsedContent
                        );
                    } elseif (preg_match('~height="({.+})"~i', $parsedContent)) {
                        $parsedContent = preg_replace(
                            '~height="({.+})"~i',
                            'height="' . esc_attr($customHeight) . '"',
                            $parsedContent
                        );
                    }

                    if (preg_match('~width\s+:\s+(\d+)~i', $parsedContent)) {
                        $parsedContent = preg_replace(
                            '~width\s+:\s+(\d+)~i',
                            'width: ' . esc_attr($customWidth),
                            $parsedContent
                        );
                    }

                    if (preg_match('~height\s+:\s+(\d+)~i', $parsedContent)) {
                        $parsedContent = preg_replace(
                            '~height\s+:\s+(\d+)~i',
                            'height: ' . esc_attr($customHeight),
                            $parsedContent
                        );
                    }
                    if ('gfycat' === $provider_name && preg_match('~height\s*:\s*auto\s*;~i', $parsedContent)) {
                        $parsedContent = preg_replace(
                            '~height\s*:\s*auto\s*~i',
                            'height: ' . esc_attr($customHeight) . 'px',
                            $parsedContent
                        );
                        $parsedContent = preg_replace(
                            '~style="position:relative;padding-bottom(.+?)"~i',
                            '',
                            $parsedContent
                        );
                        $styles = "<style>
                        .ose-gfycat.ose-embedpress-responsive{
                            position: relative;
                        }
                        </style>";
                        $parsedContent = $styles . $parsedContent;
                    }
                }
            }





            if ('the-new-york-times' === $provider_name && isset($customAttributes['height']) && isset($customAttributes['width'])) {
                $height = $customAttributes['height'];
                $width = $customAttributes['width'];
                $styles = <<<KAMAL
<style>
.ose-the-new-york-times iframe{
	min-height: auto;
	height: {height}px;
	width: {width}px;
	max-width:100%
	max-height: 100%;
}
</style>
KAMAL;
                $styles = str_replace(['{height}', '{width}'], [esc_attr($height), esc_attr($width)], $styles);
                $parsedContent = $styles . $parsedContent;
            }

            if ($stripNewLine) {
                $parsedContent = preg_replace('/\n/', '', $parsedContent);
            }


            $parsedContent = apply_filters('pp_embed_parsed_content', $parsedContent, $urlData,  self::get_oembed_attributes());

            if (!empty($parsedContent)) {
                $embed = (object) array_merge((array) $urlData, [
                    'attributes' => (object) self::get_oembed_attributes(),
                    'embed'      => $parsedContent,
                    'url'        => $url,
                ]);

                $embed = self::modify_spotify_content($embed);
                $embed = apply_filters('embedpress:onAfterEmbed', $embed);

                // Attributes to remove
                $attributesToRemove = 'autoplay;';

                // New attribute to add
                $newAttribute = 'encrypted-media;' . 'accelerometer;' . 'autoplay;' . 'clipboard-write;' . 'gyroscope;' . 'picture-in-picture';

                // Remove existing attributes
                $embed->embed = str_replace($attributesToRemove, $newAttribute, $embed->embed);

                return $embed;
            }
        }

        return $subject;
    }

    protected static function get_oembed()
    {
        if (!self::$oEmbedInstance) {
            global $wp_version;
            if (version_compare($wp_version, '5.3.0', '>=')) {
                require_once ABSPATH . 'wp-includes/class-wp-oembed.php';
            } else {
                require_once ABSPATH . 'wp-includes/class-oembed.php';
            }
            self::$oEmbedInstance = _wp_oembed_get_object();
        }
        return self::$oEmbedInstance;
    }

    protected static function set_default_size(&$customAttributes)
    {

        $plgSettings = Core::getSettings();


        if (empty($customAttributes['width'])) {
            $customAttributes['width'] = !empty($plgSettings->enableEmbedResizeWidth) ? esc_attr($plgSettings->enableEmbedResizeWidth) : 600;
        }
        if (empty($customAttributes['height'])) {
            $customAttributes['height'] = !empty($plgSettings->enableEmbedResizeHeight) ? esc_attr($plgSettings->enableEmbedResizeHeight) : 550;
        }
    }

    protected static function get_url_data($url, $attributes = [], $serviceProvider = '')
    {
        if (!empty($serviceProvider)) {
            $urlData = self::get_oembed()->fetch($serviceProvider, $url, $attributes);
        } else {
            $urlData = self::get_embera_instance()->getUrlData($url);
        }

        return $urlData;
    }

    // self::$attributes_data = self::$ombed_attributes;

    public static function getAttributesData()
    {
        self::$attributes_data = self::get_oembed_attributes();
        // return self::get_oembed_attributes();
        return self::$attributes_data;
    }


    /**
     * @return null|Embera
     */
    public static function get_embera_instance()
    {
        if (!self::$embera_instance) {
            $additionalServiceProviders = Core::getAdditionalServiceProviders();
            if (!empty($additionalServiceProviders)) {
                foreach ($additionalServiceProviders as $serviceProviderClassName => $serviceProviderUrls) {
                    self::addServiceProvider($serviceProviderClassName, $serviceProviderUrls);
                }
                unset($serviceProviderUrls, $serviceProviderClassName);
            }
            self::$embera_instance = new Embera(self::get_embera_settings(), self::get_collection());
        } else {
            self::$embera_instance->setConfig(self::get_embera_settings());
        }
        return self::$embera_instance;
    }

    /**
     * Method that adds support to a given new service provider (SP).
     *
     * @param string $className The new SP class name.
     * @param string $reference The new SP reference name.*
     * @return  DefaultProviderCollection|bool
     * @since   1.0.0
     * @static
     *
     */
    public static function addServiceProvider($className, $reference)
    {
        if (empty($className) || empty($reference)) {
            return false;
        }

        if (is_null(self::$collection)) {
            self::$collection = new DefaultProviderCollection();
        }
        if (is_string($reference)) {
            self::$collection->addProvider($reference, $className);
            return self::$collection;
        } elseif (is_array($reference)) {
            foreach ($reference as $serviceProviderUrl) {
                self::addServiceProvider($className, $serviceProviderUrl);
            }
            return self::$collection;
        } else {
            return false;
        }
    }

    /**
     * Method that retrieves all custom parameters from a shortcoded string.
     *
     * @param string $subject The given shortcoded string.
     *
     * @return  array
     * @since   1.0.0
     * @static
     *
     */
    public static function parseContentAttributesFromString($subject)
    {
        $customAttributes = [];
        if (preg_match('/\[embed\s*(.*?)\]/i', stripslashes($subject), $m)) {
            if (preg_match_all('/(\!?\w+-?\w*)(?:="(.+?)")?/i', stripslashes($m[1]), $matches)) {
                $attributes = $matches[1];
                $attrValues = $matches[2];

                foreach ($attributes as $attrIndex => $attrName) {
                    $customAttributes[$attrName] = $attrValues[$attrIndex];
                }
            }
        }
        return $customAttributes;
    }

    /**
     * Method that parses and adds the "data-" prefix to the given custom shortcode attributes.
     *
     * @param array $customAttributes The array containing the embed attributes.
     * @param string $content_uid An optional string specifying a unique ID for the embed
     *
     * @return  array
     * @since   1.0.0
     * @access  private
     * @static
     *
     */

    private static function parseContentAttributes(array $customAttributes, $content_uid = null)
    {

        $attributes = [
            'class' => ["embedpress-wrapper ose-embedpress-responsive"],
        ];

        $embedShouldBeResponsive = true;
        $embedShouldHaveCustomDimensions = false;
        if (!empty($customAttributes)) {
            if (isset($customAttributes['class'])) {
                if (!empty($customAttributes['class'])) {
                    $customAttributes['class'] = explode(' ', $customAttributes['class']);

                    $attributes['class'] = array_merge($attributes['class'], $customAttributes['class']);
                }

                unset($customAttributes['class']);
            }

            if (isset($customAttributes['width'])) {
                if (!empty($customAttributes['width'])) {
                    $attributes['width'] = (int) $customAttributes['width'];
                    $embedShouldHaveCustomDimensions = true;
                }
            }

            if (isset($customAttributes['height'])) {
                if (!empty($customAttributes['height'])) {
                    $attributes['height'] = (int) $customAttributes['height'];
                    $embedShouldHaveCustomDimensions = true;
                }
            }

            if (!empty($customAttributes)) {
                $attrNameDefaultPrefix = "data-";
                foreach ($customAttributes as $attrName => $attrValue) {
                    if (is_numeric($attrName)) {
                        $attrName = $attrValue;
                        $attrValue = "";
                    }

                    $attrName = str_replace($attrNameDefaultPrefix, "", $attrName);

                    if (is_bool($attrValue)) {
                        if ($attrValue)
                            $attrValue = "true";
                        else
                            $attrValue = "false";
                    } else if (!strlen($attrValue)) {
                        if ($attrName[0] === "!") {
                            $attrValue = "false";
                            $attrName = substr($attrName, 1);
                        } else {
                            $attrValue = "true";
                        }
                    }

                    $attributes[$attrNameDefaultPrefix . $attrName] = $attrValue;
                }
            }

            // Check if there's any "responsive" parameter
            $responsiveAttributes = ["responsive", "data-responsive"];
            foreach ($responsiveAttributes as $responsiveAttr) {
                if (isset($attributes[$responsiveAttr])) {
                    if (!strlen($attributes[$responsiveAttr])) { // If the parameter is passed but have no value, it will be true by default
                        $embedShouldBeResponsive = true;
                    } else {
                        $embedShouldBeResponsive = !self::valueIsFalse($attributes[$responsiveAttr]);
                    }

                    break;
                }
            }
            unset($responsiveAttr, $responsiveAttributes);
        }

        $attributes['class'][] = 'ose-{provider_alias}';

        if (!empty($content_uid)) {
            $attributes['class'][] = 'ose-uid-' . $content_uid;
        }

        if ($embedShouldBeResponsive && !$embedShouldHaveCustomDimensions) {
            $attributes['class'][] = 'responsive';
        } else {
            $attributes['data-responsive'] = "false";
        }

        $attributes['class'] = implode(' ', array_unique(array_filter($attributes['class'])));
        if (isset($attributes['width'])) {
            $height = esc_attr($attributes['height']);
            $width = esc_attr($attributes['width']);

            $attributes['style'] = "width:{$width}px;height:{$height}px;";
        }

        return $attributes;
    }

    protected static function set_embera_settings(&$attributes)
    {

        if (isset($attributes['width']) || isset($attributes['height'])) {
            if (isset($attributes['width'])) {
                self::$emberaInstanceSettings['maxwidth'] = esc_attr($attributes['width']);
                self::$emberaInstanceSettings['width'] = esc_attr($attributes['width']);
                unset($attributes['width']);
            }

            if (isset($attributes['height'])) {
                self::$emberaInstanceSettings['maxheight'] = esc_attr($attributes['height']);
                self::$emberaInstanceSettings['height'] = esc_attr($attributes['height']);
                unset($attributes['height']);
            }
        }

        foreach ($attributes as $key => $value) {
            if (strpos($key, 'data-') === 0) {
                $key = str_replace('data-', '', $key);
                self::$emberaInstanceSettings[$key] = $value;
            }
        }
    }

    protected static function get_embera_settings()
    {
        return self::$emberaInstanceSettings;
    }

    public static function get_block_controls_data()
    {
        var_dump(self::$emberaInstanceSettings);
    }

    /**
     * Method that checks if a given value is/can be identified as (bool)false.
     *
     * @param mixed $subject The value to be checked.
     *
     * @return  boolean
     * @since   1.0.0
     * @static
     *
     */

    public static function valueIsFalse($subject)
    {
        $subject = strtolower(trim((string) $subject));
        switch ($subject) {
            case "0":
            case "false":
            case "off":
            case "no":
            case "n":
            case "nil":
            case "null":
                return true;
            default:
                return false;
        }
    }

    /**
     * Return the value from a header which is in an array resulted from a get_headers() call.
     * If the header cannot be found, this method will return null instead.
     *
     * @param string $headerPattern Regex pattern the header and its value must match.
     * @param array $headersList A list of headers resulted from a get_headers() call.
     *
     * @return  mixed
     * @since   1.1.0
     * @access  private
     * @static
     *
     */
    private static function extractContentFromHeaderAsArray($headerPattern, $headersList)
    {
        $headerValue = null;

        foreach ($headersList as $header) {
            if (preg_match($headerPattern, $header, $matches)) {
                $headerValue = $matches[1];
                break;
            }
        }

        return $headerValue;
    }

    /**
     * Sanitize the object returned by the embed source. Sometimes we need to convert
     * attributes from "dash" separated to "underline" separated to be able to access
     * those attributes from the object, without having to convert it to an array.
     *
     * @param object $data
     *
     * @return object
     * @since   1.6.1
     * @access  private
     * @static
     *
     */
    private static function sanitizeUrlData($data, $url = '')
    {
        if (is_object($data)) {
            $attributes = get_object_vars($data);

            foreach ($attributes as $key => $value) {
                if (substr_count($key, '-') && $key !== $url) {
                    unset($data->$key);

                    $key = str_replace('-', '_', $key);
                    $data->$key = $value;
                }
            }
        } elseif (is_array($data)) {
            foreach ($data as $key => $value) {
                if (substr_count($key, '-') && $key !== $url) {
                    unset($data[$key]);

                    $key = str_replace('-', '_', $key);
                    $data[$key] = $value;
                }
            }
        }

        return $data;
    }

    public static function get_collection()
    {
        return self::$collection;
    }

    protected static function purify_html_content(&$html)
    {
        if (!class_exists('\simple_html_dom')) {
            include_once EMBEDPRESS_PATH_CORE . 'simple_html_dom.php';
        }

        $dom = str_get_html($html);
        $ifDom = $dom->find('iframe', 0);
        if (!empty($ifDom) && is_object($ifDom)) {
            $ifDom->removeAttribute('sandbox');
        }

        ob_start();
        echo $dom;
        return ob_get_clean();
    }

    protected static function get_content_from_template($url, $template, $serviceProvider)
    {

        $html = apply_filters('embed_apple_podcast', '', $url, $template, $serviceProvider);

        if (!empty($html)) {
            return $html;
        }

        if (empty($serviceProvider)) {
            $html = '';
        } else {
            $html = self::get_oembed()->get_html($url, self::get_oembed_attributes());
        }

        if (!$html) {
            $html =  self::get_embera_instance()->autoEmbed($url);
        }
        return str_replace('{html}', $html, $template);
    }

    protected static function get_oembed_attributes()
    {

        return self::$ombed_attributes;
    }
    protected static function set_oembed_attributes($atts)
    {
        self::$ombed_attributes = $atts;
    }

    protected static function check_for_google_url(&$url)
    {
        if (preg_match('/http[s]?:\/\/goo\.gl\/(?:([a-z]+)\/)?[a-z0-9]+\/?$/i', $url, $matches)) {
            // Fetch all headers from the short-url so we can know how to handle its original content depending on the service.
            $headers = get_headers($url);

            $supportedServicesHeadersPatterns = [
                'maps' => '/^Location:\s+(http[s]?:\/\/.+)$/i',
            ];

            $service = isset($matches[1]) ? strtolower($matches[1]) : null;
            // No specific service was found in the url.
            if (empty($service)) {
                // Let's try to guess which service the original url belongs to.
                foreach ($headers as $header) {
                    // Check if the short-url reffers to a Google Maps url.
                    if (preg_match($supportedServicesHeadersPatterns['maps'], $header, $matches)) {
                        // Replace the shortened url with its original url.
                        $url = $matches[1];
                        break;
                    }
                }
                unset($header);
            } else {
                // Check if the Google service is supported atm.
                if (isset($supportedServicesHeadersPatterns[$service])) {
                    // Tries to extract the url based on its headers.
                    $originalUrl = self::extractContentFromHeaderAsArray(
                        $supportedServicesHeadersPatterns[$service],
                        $headers
                    );
                    // Replace the shortened url with its original url if the specific header was found.
                    if (!empty($originalUrl)) {
                        $url = $originalUrl;
                    }
                    unset($originalUrl);
                }
            }
            unset($service, $supportedServicesHeadersPatterns, $headers, $matches);
        }
    }

    protected static function get_provider_name($urlData, $url)
    {
        $provider_name = '';
        if (isset($urlData->provider_name)) {
            $provider_name = str_replace([' ', ','], '-', strtolower($urlData->provider_name));
        } elseif (is_array($urlData) && !empty($urlData)) {
            $data = array_shift($urlData);
            if (isset($data['provider_name'])) {
                $provider_name = str_replace([' ', ','], '-', strtolower($data['provider_name']));
            }
        }
        return $provider_name;
    }

    protected static function modify_content_for_fb_and_canada($provider_name, &$html)
    {
        if (!empty($provider_name)) {
            // NFB seems to always return their embed code with all HTML entities into their applicable characters string.
            $PROVIDER_NAME_IN_CAP = strtoupper($provider_name);
            if ($PROVIDER_NAME_IN_CAP  === "NATIONAL FILM BOARD OF CANADA") {
                $html = html_entity_decode($html);
            } elseif ($PROVIDER_NAME_IN_CAP === "FACEBOOK") {
                $plgSettings = Core::getSettings();

                // Check if the user wants to force a certain language into Facebook embeds.
                $locale = isset($plgSettings->fbLanguage) && !empty($plgSettings->fbLanguage) ? $plgSettings->fbLanguage : false;
                if (!!$locale) {
                    // Replace the automatically detected language by Facebook's API with the language chosen by the user.
                    $html = preg_replace(
                        '/\/[a-z]{2}\_[a-z]{2}\/sdk\.js/i',
                        "/{$locale}/sdk.js",
                        $html
                    );
                }

                // Make sure `adapt_container_width` parameter is set to false. Setting to true, as it is by default, might cause Facebook to render embeds inside editors (in admin) with only 180px wide.
                if (is_admin()) {
                    $html = preg_replace(
                        '~data\-adapt\-container\-width=\"(?:true|1)\"~i',
                        'data-adapt-container-width="0"',
                        $html
                    );
                }

                unset($locale, $plgSettings);
            }
        }
    }

    public static function modify_spotify_content($embed)
    {
        $should_modify = apply_filters('embedpress_should_modify_spotify', true);
        $isSpotify = (isset($embed->provider_name) && strtoupper($embed->provider_name) === 'SPOTIFY') || (isset($embed->url) && isset($embed->{$embed->url}) && isset($embed->{$embed->url}['provider_name']) && strtoupper($embed->{$embed->url}['provider_name']) === 'SPOTIFY');
        if (
            $should_modify && $isSpotify && isset($embed->embed)
            && preg_match('/src=\"(.+?)\"/', $embed->embed, $match)
        ) {
            $options = (array) get_option(EMBEDPRESS_PLG_NAME . ':spotify');
            // Parse the url to retrieve all its info like variables etc.
            $url_full = $match[1];
            $modified_url = str_replace('playlist-v2', 'playlist', $url_full);
            if (isset($options['theme'])) {
                if (strpos($modified_url, '?') !== false) {
                    $modified_url .= '&theme=' . sanitize_text_field($options['theme']);
                } else {
                    $modified_url .= '?theme=' . sanitize_text_field($options['theme']);
                }
            }

            // Replaces the old url with the new one.
            $embed->embed = str_replace($url_full, $modified_url, $embed->embed);
        }
        return $embed;
    }

    public static function getParamData($attributes)
    {

        $urlParamData = array(
            'themeMode' => isset($attributes['theme_mode']) ? esc_attr($attributes['theme_mode']) : 'default',
            'toolbar' => apply_filters('embedpress/is_allow_rander', false) && isset($attributes['toolbar']) ? esc_attr($attributes['toolbar']) : 'true',
            'lazyLoad' => isset($attributes['lazyLoad']) ? esc_attr($attributes['lazyLoad']) : 'false',
            'position' => isset($attributes['toolbar_position']) ? esc_attr($attributes['toolbar_position']) : 'top',
            'presentation' => isset($attributes['presentation']) ? esc_attr($attributes['presentation']) : 'true',
            'download' => apply_filters('embedpress/is_allow_rander', false) && isset($attributes['download']) ? esc_attr($attributes['download']) : 'true',
            'copy_text' => apply_filters('embedpress/is_allow_rander', false) && isset($attributes['copy_text']) ? esc_attr($attributes['copy_text']) : 'true',
            'add_text' => isset($attributes['add_text']) ? esc_attr($attributes['add_text']) : 'true',
            'draw' => apply_filters('embedpress/is_allow_rander', false) && isset($attributes['draw']) ? esc_attr($attributes['draw']) : 'true',
            'doc_rotation' => isset($attributes['doc_rotation']) ? esc_attr($attributes['doc_rotation']) : 'true',
            'add_image' => isset($attributes['add_image']) ? esc_attr($attributes['add_image']) : 'true',
            'doc_details' => isset($attributes['doc_details']) ? esc_attr($attributes['doc_details']) : 'true',
            'selection_tool' => isset($attributes['selection_tool']) ? esc_attr($attributes['selection_tool']) : '0',
            'scrolling' => isset($attributes['scrolling']) ? esc_attr($attributes['scrolling']) : '-1',
            'spreads' => isset($attributes['spreads']) ? esc_attr($attributes['spreads']) : '-1',
            'zoom_in' =>  isset($attributes['zoom_in'])  ? $attributes['zoom_in'] : 'true',
            'zoom_out' => isset($attributes['zoom_out'])  ? $attributes['zoom_out'] : 'true',
            'fit_view' => isset($attributes['fit_view'])  ? $attributes['fit_view'] : 'true',
            'bookmark' => isset($attributes['bookmark'])  ? $attributes['bookmark'] : 'true',
            'flipbook_toolbar_position' => !empty($attributes['toolbar_position'])  ? $attributes['toolbar_position'] : 'bottom',
        );

        if ($urlParamData['themeMode'] == 'custom') {
            $urlParamData['customColor'] = isset($attributes['custom_color']) ? esc_attr($attributes['custom_color']) : '#333333';
        }

        if (isset($attributes['viewer_style']) && $attributes['viewer_style'] == 'flip-book') {
            return "&key=" . base64_encode(mb_convert_encoding(http_build_query($urlParamData), 'UTF-8'));
        }

        return "#key=" . base64_encode(mb_convert_encoding(http_build_query($urlParamData), 'UTF-8'));
    }

    public static function getUnit($value)
    {
        if (preg_match('/[a-zA-Z%]+$/', $value, $matches)) {
            return '';
        }
        return 'px';
    }

    public static function do_shortcode_pdf($attributes = [], $subject = null)
    {
        $plgSettings = Core::getSettings();

        $default = [
            'width'  => esc_attr($plgSettings->enableEmbedResizeWidth),
            'height' => esc_attr($plgSettings->enableEmbedResizeHeight),
            'powered_by' => !empty($plgSettings->embedpress_document_powered_by) ? esc_attr($plgSettings->embedpress_document_powered_by) : esc_attr('no'),
        ];

        if (!empty($plgSettings->pdf_custom_color_settings)) {
            $default['theme_mode'] = 'custom';
        }
        if (isset($default['theme_mode']) && $default['theme_mode'] == 'custom') {
            $default['custom_color'] = esc_attr($plgSettings->custom_color);
        }

        $attributes = wp_parse_args($attributes, $default);

        $url = preg_replace(
            '/(\[' . EMBEDPRESS_SHORTCODE . '(?:\]|.+?\])|\[\/' . EMBEDPRESS_SHORTCODE . '\])/i',
            "",
            $subject
        );

        $url = esc_url($url);

        ob_start();

        $id = 'embedpress-pdf-shortcode';

        $widthUnit = self::getUnit($attributes['width']);
        $heightUnit = self::getUnit($attributes['height']);

        $dimension = "width: {$attributes['width']}{$widthUnit}; height: {$attributes['height']}{$heightUnit};";


        $client_id = is_object('$embed') ? md5('$embed->embed')  : '';

        $hash_pass = isset($attributes['protection_password'])
            ? hash('sha256', wp_salt(32) . md5($attributes['protection_password']))
            : '';

        $pass_hash_key = isset($attributes['protection_password'])
            ? md5($attributes['protection_password'])
            : '';

        $password_correct = $_COOKIE['password_correct_' . $client_id] ?? '';

        $protection_type = $attributes['protection_type'] ?? 'user-role';
        $protection_password = $attributes['protection_password'] ?? '';
        $protection_content = isset($attributes['protection_content']) ? $attributes['protection_content'] === 'true' : false;
        $user_role = isset($attributes['user_roles']) ? explode(',', preg_replace('/\s*,\s*/', ',', $attributes['user_roles'])) : '';

        $protection_message = $attributes['protection_message'] ?? '';

        // Conditions for content protection
        $password_protected = $protection_type == 'password' && !empty($protection_password);

        $password_verified = $password_protected && !empty(Helper::is_password_correct($client_id)) && ($hash_pass === $password_correct);
        $user_role_protected = $protection_type === 'user-role' && Helper::has_allowed_roles($user_role);

        if (
            apply_filters('embedpress/is_allow_rander', false) && ($protection_content == 'true') && (($protection_type == 'user-role' && !Helper::has_allowed_roles($user_role)))
        ) {

            return self::content_protection_content($client_id, $protection_message, $user_role);
        }

        ?>
            <div class="embedpress-document-embed ose-document <?php echo 'ep-doc-' . md5($id); ?>" style="<?php echo esc_attr($dimension); ?>; max-width:100%; display: block">
                <?php if ($url != '') {
                            if (self::is_pdf($url) && !self::is_external_url($url)) {
                                $renderer = Helper::get_pdf_renderer();

                                $src = $renderer . ((strpos($renderer, '?') == false) ? '?' : '&') . 'file=' . urlencode($url) . self::getParamData($attributes);


                                if (isset($attributes['viewer_style']) && $attributes['viewer_style'] === 'flip-book') {
                                    $src = urlencode($url) . self::getParamData($attributes);
                                    ?>
                            <iframe title="<?php echo esc_attr(Helper::get_file_title($url)); ?>" class="embedpress-embed-document-pdf <?php echo esc_attr($id); ?>" style="<?php echo esc_attr($dimension); ?>; max-width:100%; display: inline-block" src="<?php echo esc_url(EMBEDPRESS_URL_ASSETS . 'pdf-flip-book/viewer.html?file=' . $src); ?>" frameborder="0" oncontextmenu="return false;">
                            </iframe>
                        <?php
                                        } else {
                                            ?>
                            <iframe title="<?php echo esc_attr(Helper::get_file_title($url)); ?>" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" style="<?php echo esc_attr($dimension); ?>; max-width:100%; display: inline-block" data-emsrc="<?php echo esc_url($url); ?>" data-emid="<?php echo esc_attr($id); ?>" class="embedpress-embed-document-pdf <?php echo esc_attr($id); ?>" src="<?php echo esc_url($src); ?>" frameborder="0">
                            </iframe>
                        <?php
                                        }
                                    } else {
                                        ?>
                        <div>
                            <iframe title="<?php echo esc_attr(Helper::get_file_title($url)); ?>" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" style="<?php echo esc_attr($dimension); ?>; max-width:100%;" src="<?php echo esc_url($url); ?>" data-emsrc="<?php echo esc_url($url); ?>" data-emid="<?php echo esc_attr($id); ?>" class="embedpress-embed-document-pdf <?php echo esc_attr($id); ?>"></iframe>
                        </div>
                <?php

                            }

                            if (!empty($attributes['powered_by']) && $attributes['powered_by'] === 'yes') {
                                printf('<p class="embedpress-el-powered">%s</p>', __('Powered By EmbedPress', 'embedpress'));
                            }
                        }
                        ?>
            </div>

    <?php


            return ob_get_clean();
        }


        public static function do_shortcode_doc($attributes = [], $subject = null)
        {
            $plgSettings = Core::getSettings();
            $url = preg_replace(
                '/(\[' . EMBEDPRESS_SHORTCODE . '(?:\]|.+?\])|\[\/' . EMBEDPRESS_SHORTCODE . '\])/i',
                "",
                $subject
            );

            $url = esc_url($url);


            $default = [
                'url' => $url,
                'width' => !empty($plgSettings->enableEmbedResizeWidth) ? esc_attr($plgSettings->enableEmbedResizeWidth) : '100%',
                'height' => !empty($plgSettings->enableEmbedResizeHeight) ? esc_attr($plgSettings->enableEmbedResizeHeight) : '500px',
                'viewer' => !empty($plgSettings->embedpress_document_viewer) ? esc_attr($plgSettings->embedpress_document_viewer) : 'custom',
                'powered_by' => (!isset($plgSettings->embedpress_document_powered_by) || $plgSettings->embedpress_document_powered_by === 'yes') ? 'yes' : 'no',
            ];


            $atts = shortcode_atts($default, $attributes);


            $url = esc_url($atts['url']);
            if (empty($url)) return '';

            $dimension = "width: {$atts['width']}px; height: {$atts['height']}px";

            $embed_content = '';

            // PDF Handling
            if (self::is_pdf($url)) {
                $embed_content .= '<div class="embedpress-document-embed ose-document embedpress-doc-wrap ep-doc-' . md5($url) . '" style="' . esc_attr($dimension) . '; max-width: 100%; display: block">';
                $embed_content .= '<iframe src="' . esc_url($url) . '" style="' . esc_attr($dimension) . '; max-width: 100%;" frameborder="0" allowfullscreen></iframe>';
                if ($atts['powered_by'] === 'yes') {
                    $embed_content .= '<p class="embedpress-el-powered" style="text-align: center">Powered By EmbedPress</p>';
                }
                $embed_content .= '</div>';
                return $embed_content;
            }

            // Office or Google Viewer Handling
            if (self::is_file_url($url)) {
                $viewer_url = 'https://view.officeapps.live.com/op/embed.aspx?src=' . urlencode($url) . '&embedded=true';
            } else {
                $viewer_url = 'https://drive.google.com/viewerng/viewer?url=' . urlencode($url) . '&embedded=true&chrome=false';
            }

            if ($atts['viewer'] === 'google') {
                $viewer_url = '//docs.google.com/gview?embedded=true&url=' . urlencode($url);
            } elseif ($atts['viewer'] === 'custom') {
                $hostname = parse_url($url, PHP_URL_HOST);
                $domain = implode('.', array_slice(explode('.', $hostname), -2));
                if ($domain === 'google.com') {
                    $viewer_url = $url . '?embedded=true';
                    if (strpos($viewer_url, '/presentation/')) {
                        $viewer_url = Helper::get_google_presentation_url($url);
                    }
                }
            }

            $embed_content .= '<div class="embedpress-document-embed ose-document embedpress-doc-wrap ep-doc-' . md5($url) . '" style="' . esc_attr($dimension) . '; max-width: 100%; display: block">';

            $embed_content .= '<iframe src="' . esc_url($viewer_url) . '" style="' . esc_attr($dimension) . '; max-width: 100%;" frameborder="0" allowfullscreen ></iframe>';

            if ($atts['powered_by'] === 'yes') {
                $embed_content .= '<p class="embedpress-el-powered" style="text-align: center">Powered By EmbedPress</p>';
            }

            $embed_content .= '</div>';

            return $embed_content;
        }

        protected static function is_file_url($url)
        {
            $pattern = '/\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/i';
            return preg_match($pattern, $url) === 1;
        }

        protected static function is_external_url($url)
        {
            return strpos($url, get_site_url()) === false;
        }

        protected static function is_pdf($url)
        {
            $arr = explode('.', $url);
            return end($arr) === 'pdf';
        }
    }
