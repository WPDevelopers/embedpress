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
 * @copyright   Copyright (C) 2020 WPDeveloper. All rights reserved.
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




    public static function do_shortcode($attributes = [], $subject = null)
    {
        $plgSettings = Core::getSettings();


        $default = [];
        if ($plgSettings->enableGlobalEmbedResize) {
            $default = [
                'width'  => $plgSettings->enableEmbedResizeWidth,
                'height' => $plgSettings->enableEmbedResizeHeight,
                'powered_by' => !empty($plgSettings->embedpress_document_powered_by) ? $plgSettings->embedpress_document_powered_by : 'no',
            ];
        }
        $attributes = wp_parse_args($attributes, $default);
        $embed = self::parseContent($subject, true, $attributes);

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

            // Converts any special HTML entities back to characters.
            $url = htmlspecialchars_decode($url);

            $uniqid = 'ose-uid-'.md5($url);

            $content_uid = md5($url);

            //$hash = 'embedpress_'.$content_uid . md5( implode( ':', array_values( $customAttributes)));

            // check if we have data cached
            //@TODO; add caching later and remove caching on settings save
            //if ( $embed = get_transient( $hash) ) {
            //    $embed = apply_filters( 'embedpress:onAfterEmbed', $embed );
            //	return $embed;
            //}
            self::$ombed_attributes = self::parseContentAttributes($customAttributes, $content_uid);


            self::set_embera_settings(self::$ombed_attributes);

            // Identify what service provider the shortcode's link belongs to
            $is_embra_provider = apply_filters('embedpress:isEmbra', false, $url, self::get_embera_settings());
            if ($is_embra_provider || (strpos($url, 'meetup.com') !== false) || (strpos($url, 'sway.office.com') !== false)) {
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
            $attributesHtml = ['class="ose-{provider_alias} ' . $uniqid .' ose-embedpress-responsive"'];
            //$attributesHtml = [];
            //foreach ( self::$ombed_attributes as $attrName => $attrValue ) {
            //    $attributesHtml[] = $attrName . '="' . $attrValue . '"';
            //}
            if (isset($customAttributes['width'])) {
                $attributesHtml[] = "style=\"width:{$customAttributes['width']}px; max-width:100%; height: 100%; display:inline-block;\"";
            }

            // Check if $url is a google shortened url and tries to extract from it which Google service it refers to.
            self::check_for_google_url($url);
            $provider_name = self::get_provider_name($urlData, $url);
            $embedTemplate = '<div ' . implode(' ', $attributesHtml) . '>{html}</div>';

            $parsedContent = self::get_content_from_template($url, $embedTemplate, $serviceProvider);
            // Replace all single quotes to double quotes. I.e: foo='joe' -> foo="joe"
            $parsedContent = str_replace("'", '"', $parsedContent);
            $parsedContent = str_replace("{provider_alias}", $provider_name, $parsedContent);
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
                            'width="' . $customWidth . '"',
                            $parsedContent
                        );
                    } elseif (preg_match('~width="({.+})"~i', $parsedContent)) {
                        // this block was needed for twitch that has width="{width}" in iframe
                        $parsedContent = preg_replace(
                            '~width="({.+})"~i',
                            'width="' . $customWidth . '"',
                            $parsedContent
                        );
                    }

                    if (preg_match('~height="(\d+)"~i', $parsedContent)) {
                        $parsedContent = preg_replace(
                            '~height="(\d+)"~i',
                            'height="' . $customHeight . '"',
                            $parsedContent
                        );
                    } elseif (preg_match('~height="({.+})"~i', $parsedContent)) {
                        $parsedContent = preg_replace(
                            '~height="({.+})"~i',
                            'height="' . $customHeight . '"',
                            $parsedContent
                        );
                    }

                    if (preg_match('~width\s+:\s+(\d+)~i', $parsedContent)) {
                        $parsedContent = preg_replace(
                            '~width\s+:\s+(\d+)~i',
                            'width: ' . $customWidth,
                            $parsedContent
                        );
                    }

                    if (preg_match('~height\s+:\s+(\d+)~i', $parsedContent)) {
                        $parsedContent = preg_replace(
                            '~height\s+:\s+(\d+)~i',
                            'height: ' . $customHeight,
                            $parsedContent
                        );
                    }
                    if ('gfycat' === $provider_name && preg_match('~height\s*:\s*auto\s*;~i', $parsedContent)) {
                        $parsedContent = preg_replace(
                            '~height\s*:\s*auto\s*~i',
                            'height: ' . $customHeight . 'px',
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
                $styles = str_replace(['{height}', '{width}'], [$customAttributes['height'], $customAttributes['width']], $styles);
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
            $customAttributes['width'] = !empty($plgSettings->enableEmbedResizeWidth) ? $plgSettings->enableEmbedResizeWidth : 600;
        }
        if (empty($customAttributes['height'])) {
            $customAttributes['height'] = !empty($plgSettings->enableEmbedResizeHeight) ? $plgSettings->enableEmbedResizeHeight : 550;
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

    public static function getAttributesData(){
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

                    if(is_bool($attrValue)){
                        if($attrValue)
                            $attrValue = "true";
                        else
                            $attrValue = "false";
                    }
                    else if (!strlen($attrValue)) {
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
            $attributes['style'] = "width:{$attributes['width']}px;height:{$attributes['height']}px;";
        }

        return $attributes;
    }

    protected static function set_embera_settings(&$attributes)
    {

        if (isset($attributes['width']) || isset($attributes['height'])) {
            if (isset($attributes['width'])) {
                self::$emberaInstanceSettings['maxwidth'] = $attributes['width'];
                self::$emberaInstanceSettings['width'] = $attributes['width'];
                unset($attributes['width']);
            }

            if (isset($attributes['height'])) {
                self::$emberaInstanceSettings['maxheight'] = $attributes['height'];
                self::$emberaInstanceSettings['height'] = $attributes['height'];
                unset($attributes['height']);
            }
        }

        foreach ($attributes as $key => $value) {
            if(strpos($key, 'data-') === 0){
                $key = str_replace('data-', '', $key);
                self::$emberaInstanceSettings[$key] = $value;
            }
        }

    }

    protected static function get_embera_settings()
    {
        return self::$emberaInstanceSettings;
    }

    public static function get_block_controls_data(){
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
        if (is_embedpress_pro_active()) {
            if (strpos($url, 'podcasts.apple.com')) {
                $iframe_url = str_replace('podcasts.apple.com', 'embed.podcasts.apple.com', $url);
                $html = '<iframe allow="autoplay *; encrypted-media *; fullscreen *" frameborder="0" height="175" style="width:100%;max-width:660px;overflow:hidden;background:transparent;" src="' . esc_url($iframe_url) . '"></iframe>';
                return str_replace('{html}', $html, $template);
            }
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

    public static function getParamData($attributes){

        $urlParamData = array(
            'themeMode' => isset($attributes['theme_mode']) ? $attributes['theme_mode'] : 'default',
            'toolbar' => isset($attributes['toolbar']) ? $attributes['toolbar'] : 'true',
            'position' => isset($attributes['toolbar_position']) ? $attributes['toolbar_position'] : 'top',
            'presentation' => isset($attributes['presentation']) ? $attributes['presentation'] : 'true',
            'download' => isset($attributes['download']) ? $attributes['download'] : 'true',
            'copy_text' => isset($attributes['copy_text']) ? $attributes['copy_text'] : 'true',
            'add_text' => isset($attributes['add_text']) ? $attributes['add_text'] : 'true',
            'draw' => isset($attributes['draw']) ? $attributes['draw'] : 'true',
            'doc_rotation' => isset($attributes['doc_rotation']) ? $attributes['doc_rotation'] : 'true',
            'doc_details' => isset($attributes['doc_details']) ? $attributes['doc_details'] : 'true',
        );

        if($urlParamData['themeMode'] == 'custom') {
            $urlParamData['customColor'] = isset($attributes['custom_color']) ? $attributes['custom_color'] : '#333333';
        }

        return "#". http_build_query($urlParamData);
    }

    public static function do_shortcode_pdf($attributes = [], $subject = null)
    {
        $plgSettings = Core::getSettings();

        $default = [
            'width'  => $plgSettings->enableEmbedResizeWidth,
            'height' => $plgSettings->enableEmbedResizeHeight, 
            'powered_by' => !empty($plgSettings->embedpress_document_powered_by) ? $plgSettings->embedpress_document_powered_by : 'no',
        ];

        if(!empty($plgSettings->pdf_custom_color_settings)){
             $default['theme_mode'] = 'custom';
        }
        if(isset($default['theme_mode']) && $default['theme_mode'] == 'custom' ){
            $default['custom_color'] = $plgSettings->custom_color;
        }

        $attributes = wp_parse_args($attributes, $default);

        $url = preg_replace(
            '/(\[' . EMBEDPRESS_SHORTCODE . '(?:\]|.+?\])|\[\/' . EMBEDPRESS_SHORTCODE . '\])/i',
            "",
            $subject
        );

        ob_start();

        $id = 'embedpress-pdf-shortcode';
        $dimension = "width: {$attributes['width']}px;height: {$attributes['height']}px";
        ?>
            <div class="embedpress-document-embed ose-document <?php echo 'ep-doc-' . md5($id); ?>" style="<?php echo esc_attr($dimension); ?>; max-width:100%; display: block">
                <?php if ($url != '') {
                            if (self::is_pdf($url) && !self::is_external_url($url)) {
                                $renderer = Helper::get_pdf_renderer();
                                $src = $renderer . ((strpos($renderer, '?') == false) ? '?' : '&') . 'file=' . urlencode($url).self::getParamData($attributes);
                                ?>
                        <iframe title="<?php echo esc_attr(Helper::get_file_title($url)); ?>" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" title="" style="<?php echo esc_attr($dimension); ?>; max-width:100%; display: inline-block" data-emsrc="<?php echo esc_attr($url); ?>" data-emid="<?php echo esc_attr($id); ?>" class="embedpress-embed-document-pdf <?php echo esc_attr($id); ?>" src="<?php echo esc_attr($src); ?>" frameborder="0"></iframe>
                    <?php

                                } else {
                                    ?>
                        <div>
                            <iframe title="<?php echo esc_attr(Helper::get_file_title($url)); ?>" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" style="<?php echo esc_attr($dimension); ?>; max-width:100%;" src="<?php echo esc_url($url); ?>" data-emsrc="<?php echo esc_attr($url); ?>" data-emid="<?php echo esc_attr($id); ?>" class="embedpress-embed-document-pdf <?php echo esc_attr($id); ?>"></iframe>
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
