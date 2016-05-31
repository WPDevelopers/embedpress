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
 * @author      OSTraining <support@ostraining.com>
 * @copyright   Copyright (C) 2016 Open Source Training, LLC. All rights reserved.
 * @license     GPLv2 or later
 * @since       0.1
 */
class Shortcode
{
    /**
     * Register the plugin's shortcode into WordPress.
     *
     * @since   0.1
     * @static
     */
    public static function register()
    {
        // Register the new shortcode for embeds.
        add_shortcode(EMBEDPRESS_SHORTCODE, array('\\EmbedPress\\Shortcode', 'do_shortcode'), 1);
    }

    /**
     * Method that converts the plugin shortcoded-string into its complex content.
     *
     * @since   0.1
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
     * @since   0.1
     * @static
     *
     * @param   string      The raw content that will be replaced.
     * @param   boolean     Optional. If true, new lines at the end of the embeded code are stripped.
     * @return  string
     */
    public static function parseContent($content, $stripNewLine = false, $customAttributes = array())
    {
        if (!empty($content)) {
            if (empty($customAttributes)) {
                $customAttributes = self::parseContentAttributesFromString($content);
            }

            $content = preg_replace('/(\['. EMBEDPRESS_SHORTCODE .'(?:\]|.+?\])|\[\/'. EMBEDPRESS_SHORTCODE .'\])/i', "", $content);

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

            $attributesHtml = [];
            foreach ($attributes as $attrName => $attrValue) {
                $attributesHtml[] = $attrName .'="'. $attrValue .'"';
            }

            $embedTemplate = '<div '. implode(' ', $attributesHtml) .'>{html}</div>';

            $emberaInstance = new Embera($emberaInstanceSettings);

            $additionalServiceProviders = Plugin::getAdditionalServiceProviders();
            if (!empty($additionalServiceProviders)) {
                foreach ($additionalServiceProviders as $serviceProviderClassName => $serviceProviderUrls) {
                    self::addServiceProvider($serviceProviderClassName, $serviceProviderUrls, $emberaInstance);
                }
            }

            $emberaFormaterInstance = new Formatter($emberaInstance, true);
            $emberaFormaterInstance->setTemplate($embedTemplate);

            $content = $emberaFormaterInstance->transform($content);

            // This assure that the iframe has the same dimensions the user wants to
            if (isset($emberaInstanceSettings['params']['width']) || isset($emberaInstanceSettings['params']['height'])) {
                if (isset($emberaInstanceSettings['params']['width']) && isset($emberaInstanceSettings['params']['height'])) {
                    $customWidth = (int)$emberaInstanceSettings['params']['width'];
                    $customHeight = (int)$emberaInstanceSettings['params']['height'];
                } else {
                    preg_match_all('/\<iframe\s+width="(\d+)"\s+height="(\d+)"/i', $content, $matches);
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
                }

                $content = preg_replace('/\s+width\=\"(\d+)\"/i', ' width="'. $customWidth .'"', $content);
                $content = preg_replace('/\s+height\=\"(\d+)\"/i', ' height="'. $customHeight .'"', $content);
            }

            if ($stripNewLine) {
                $content = preg_replace('/\n/', '', $content);
            }
        }

        return $content;
    }

    /**
     * Method that adds support to a given new service provider (SP).
     *
     * @since   0.1
     * @static
     *
     * @param   string          $className      The new SP class name.
     * @param   string          $reference      The new SP reference name.
     * @param   \Embera\Embera  $emberaInstance The embera's instance where the SP will be registered in.
     *
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
     * @since   0.1
     * @static
     *
     * @param   string  $subject  The given shortcoded string.
     *
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
     * @since   0.1
     * @static
     *
     * @param   array     $attributes   The array containing the embed attributes.
     *
     * @return  array
     */
    private static function parseContentAttributes(array $customAttributes)
    {
        $attributes = array(
            'class' => ["osembed-wrapper", '{wrapper_class}']
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
     * @since   0.1
     * @static
     *
     * @param   mixed     $subject      The value to be checked.
     *
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
}
