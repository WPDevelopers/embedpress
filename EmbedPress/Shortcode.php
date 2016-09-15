<?php
namespace EmbedPress;

use \EmbedPress\Plugin;
use \Embera\Embera;
use \Embera\Formatter;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Entity responsible to handle the plugin's shortcode events and behaviors.
 *
 * @package     EmbedPress
 * @author      PressShack <help@pressshack.com>
 * @copyright   Copyright (C) 2016 Open Source Training, LLC. All rights reserved.
 * @license     GPLv2 or later
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
     * @var     string  $oEmbedInstance
     */
    private static $oEmbedInstance = null;

    /**
     * Register the plugin's shortcode into WordPress.
     *
     * @since   1.0.0
     * @static
     *
     * @return  void
     */
    public static function register()
    {
        // Register the new shortcode for embeds.
        add_shortcode(EMBEDPRESS_SHORTCODE, array('\\EmbedPress\\Shortcode', 'do_shortcode'), 1);
    }

    /**
     * Method that converts the plugin shortcoded-string into its complex content.
     *
     * @since   1.0.0
     * @static
     *
     * @param   array     $attributes   @TODO
     * @param   string    $subject      The given string
     * @return  string
     */
    public static function do_shortcode($attributes = array(), $subject = null)
    {
        $decodedSubject = self::parseContent($subject, true, $attributes);

        return $decodedSubject;
    }

    /**
     * Replace a given content with its embeded HTML code.
     *
     * @since   1.0.0
     * @static
     *
     * @param   string      The raw content that will be replaced.
     * @param   boolean     Optional. If true, new lines at the end of the embeded code are stripped.
     * @return  string
     */
    public static function parseContent($subject, $stripNewLine = false, $customAttributes = array())
    {
        if (!empty($subject)) {
            if (empty($customAttributes)) {
                $customAttributes = self::parseContentAttributesFromString($subject);
            }

            $content = preg_replace('/(\['. EMBEDPRESS_SHORTCODE .'(?:\]|.+?\])|\[\/'. EMBEDPRESS_SHORTCODE .'\])/i', "", $subject);

            // Check if the WP_oEmbed class is loaded
            if (!self::$oEmbedInstance) {
                require_once ABSPATH .'wp-includes/class-oembed.php';

                self::$oEmbedInstance = _wp_oembed_get_object();
            }

            $emberaInstanceSettings = array(
                'params' => array()
            );

            $attributes = self::parseContentAttributes($customAttributes);
            if (isset($attributes['width']) || isset($attributes['height'])) {
                if (isset($attributes['width'])) {
                    $emberaInstanceSettings['params']['width'] = $attributes['width'];
                    unset($attributes['width']);
                }

                if (isset($attributes['height'])) {
                    $emberaInstanceSettings['params']['height'] = $attributes['height'];
                    unset($attributes['height']);
                }
            }

            // Identify what service provider the shortcode's link belongs to
            $serviceProvider = self::$oEmbedInstance->get_provider($content);

            // Gather info about the shortcode's link
            $urlData = self::$oEmbedInstance->fetch($serviceProvider, $content, $attributes);

            // Transform all shortcode attributes into html form. I.e.: {foo: "joe"} -> foo="joe"
            $attributesHtml = array();
            foreach ($attributes as $attrName => $attrValue) {
                $attributesHtml[] = $attrName .'="'. $attrValue .'"';
            }

            // Define the EmbedPress html template where the generated embed will be injected in
            $embedTemplate = '<div '. implode(' ', $attributesHtml) .'>{html}</div>';

            // Check if $content is a google shortened url and tries to extract from it which Google service it refers to.
            if (preg_match('/http[s]?:\/\/goo\.gl\/(?:([a-z]+)\/)?[a-z0-9]+\/?$/i', $content, $matches)) {
                // Fetch all headers from the short-url so we can know how to handle its original content depending on the service.
                $headers = get_headers($content);

                $supportedServicesHeadersPatterns = array(
                    'maps' => '/^Location:\s+(http[s]?:\/\/.+)$/i'
                );

                $service = strtolower(@$matches[1]);
                // No specific service was found in the url.
                if (empty($service)) {
                    // Let's try to guess which service the original url belongs to.
                    foreach ($headers as $header) {
                        // Check if the short-url reffers to a Google Maps url.
                        if (preg_match($supportedServicesHeadersPatterns['maps'], $header, $matches)) {
                            // Replace the shortened url with its original url.
                            $content = $matches[1];
                            break;
                        }
                    }
                    unset($header);
                } else {
                    // Check if the Google service is supported atm.
                    if (isset($supportedServicesHeadersPatterns[$service])) {
                        // Tries to extract the url based on its headers.
                        $originalUrl = self::extractContentFromHeaderAsArray($supportedServicesHeadersPatterns[$service], $headers);
                        // Replace the shortened url with its original url if the specific header was found.
                        if (!empty($originalUrl)) {
                            $content = $originalUrl;
                        }
                        unset($originalUrl);
                    }
                }
                unset($service, $supportedServicesHeadersPatterns, $headers, $matches);
            }

            // Try to generate the embed using WP API
            $parsedContent = self::$oEmbedInstance->get_html($content, $attributes);
            if (!$parsedContent) {
                // If the embed couldn't be generated, we'll try to use Embera's API
                $emberaInstance = new Embera($emberaInstanceSettings);
                // Add support to the user's custom service providers
                $additionalServiceProviders = Plugin::getAdditionalServiceProviders();
                if (!empty($additionalServiceProviders)) {
                    foreach ($additionalServiceProviders as $serviceProviderClassName => $serviceProviderUrls) {
                        self::addServiceProvider($serviceProviderClassName, $serviceProviderUrls, $emberaInstance);
                    }

                    unset($serviceProviderUrls, $serviceProviderClassName);
                }

                // Register the html template
                $emberaFormaterInstance = new Formatter($emberaInstance, true);
                $emberaFormaterInstance->setTemplate($embedTemplate);

                // Try to generate the embed using Embera API
                $parsedContent = $emberaFormaterInstance->transform($content);

                unset($emberaFormaterInstance, $additionalServiceProviders, $emberaInstance);
            } else {
                // Inject the generated code inside the html template
                $parsedContent = str_replace('{html}', $parsedContent, $embedTemplate);

                // Replace all single quotes to double quotes. I.e: foo='joe' -> foo="joe"
                $parsedContent = str_replace("'", '"', $parsedContent);

                // Replace the flag `{provider_alias}` which is used by Embera with the "ose-<serviceProviderAlias>". I.e: YouTube -> "ose-youtube"
                $parsedContent = preg_replace('/((?:ose-)?\{provider_alias\})/i', "ose-". strtolower($urlData->provider_name), $parsedContent);
            }

            unset($embedTemplate, $urlData, $serviceProvider);

            // This assure that the iframe has the same dimensions the user wants to
            if (isset($emberaInstanceSettings['params']['width']) || isset($emberaInstanceSettings['params']['height'])) {
                if (isset($emberaInstanceSettings['params']['width']) && isset($emberaInstanceSettings['params']['height'])) {
                    $customWidth = (int)$emberaInstanceSettings['params']['width'];
                    $customHeight = (int)$emberaInstanceSettings['params']['height'];
                } else {
                    preg_match_all('/\<iframe\s+width="(\d+)"\s+height="(\d+)"/i', $parsedContent, $matches);
                    $iframeWidth = (int)$matches[1][0];
                    $iframeHeight = (int)$matches[2][0];
                    $iframeRatio = ceil($iframeWidth / $iframeHeight);

                    if (isset($emberaInstanceSettings['params']['width'])) {
                        $customWidth = (int)$emberaInstanceSettings['params']['width'];
                        $customHeight = ceil($customWidth / $iframeRatio);
                    } else {
                        $customHeight = (int)$emberaInstanceSettings['params']['height'];
                        $customWidth = $iframeRatio * $customHeight;
                    }

                    unset($iframeRatio, $iframeHeight, $iframeWidth, $matches);
                }

                $parsedContent = preg_replace('/\s+width\=\"(\d+)\"/i', ' width="'. $customWidth .'"', $parsedContent);
                $parsedContent = preg_replace('/\s+height\=\"(\d+)\"/i', ' height="'. $customHeight .'"', $parsedContent);
            }

            if ($stripNewLine) {
                $parsedContent = preg_replace('/\n/', '', $parsedContent);
            }

            if (!empty($parsedContent)) {
                return $parsedContent;
            }
        }

        return $subject;
    }

    /**
     * Method that adds support to a given new service provider (SP).
     *
     * @since   1.0.0
     * @static
     *
     * @param   string          $className      The new SP class name.
     * @param   string          $reference      The new SP reference name.
     * @param   \Embera\Embera  $emberaInstance The embera's instance where the SP will be registered in.
     * @return  boolean
     */
    public static function addServiceProvider($className, $reference, &$emberaInstance)
    {
        if (empty($className) || empty($reference)) {
            return false;
        }

        if (is_string($reference)) {
            $emberaInstance->addProvider($reference, EMBEDPRESS_NAMESPACE ."\\Providers\\{$className}");
        } else if (is_array($reference)) {
            foreach ($reference as $serviceProviderUrl) {
                self::addServiceProvider($className, $serviceProviderUrl, $emberaInstance);
            }
        } else {
            return false;
        }
    }

    /**
     * Method that retrieves all custom parameters from a shortcoded string.
     *
     * @since   1.0.0
     * @static
     *
     * @param   string  $subject  The given shortcoded string.
     * @return  array
     */
    public static function parseContentAttributesFromString($subject)
    {
        $customAttributes = array();
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
     * @since   1.0.0
     * @access  private
     * @static
     *
     * @param   array     $attributes   The array containing the embed attributes.
     * @return  array
     */
    private static function parseContentAttributes(array $customAttributes)
    {
        $attributes = array(
            'class' => array("embedpress-wrapper")
        );

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
                    $attributes['width'] = (int)$customAttributes['width'];
                    $embedShouldHaveCustomDimensions = true;
                }
            }

            if (isset($customAttributes['height'])) {
                if (!empty($customAttributes['height'])) {
                    $attributes['height'] = (int)$customAttributes['height'];
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

                    if (!strlen($attrValue)) {
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
            $responsiveAttributes = array("responsive", "data-responsive");
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

        if ($embedShouldBeResponsive && !$embedShouldHaveCustomDimensions) {
            $attributes['class'][] = 'ose-{provider_alias} responsive';
        } else {
            $attributes['data-responsive'] = "false";
        }

        $attributes['class'] = implode(' ', array_unique(array_filter($attributes['class'])));

        return $attributes;
    }

    /**
     * Method that checks if a given value is/can be identified as (bool)false.
     *
     * @since   1.0.0
     * @static
     *
     * @param   mixed     $subject      The value to be checked.
     * @return  boolean
     */
    public static function valueIsFalse($subject)
    {
        $subject = strtolower(trim((string)$subject));
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
     * @since   1.1.0
     * @access  private
     * @static
     *
     * @param   string  $headerPattern  Regex pattern the header and its value must match.
     * @param   array   $headersList    A list of headers resulted from a get_headers() call.
     *
     * @return  mixed
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
}
