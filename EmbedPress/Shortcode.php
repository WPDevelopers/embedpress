<?php

namespace EmbedPress;

use Embera\Embera;
use Embera\Formatter;

(defined( 'ABSPATH' ) && defined( 'EMBEDPRESS_IS_LOADED' )) or die( "No direct script access allowed." );

/**
 * Entity responsible to handle the plugin's shortcode events and behaviors.
 *
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2020 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       1.0.0
 */
class Shortcode {
    /**
     * The WP_oEmbed class instance.
     *
     * @since   1.0.0
     * @access  private
     * @static
     *
     * @var     string $oEmbedInstance
     */
    private static $oEmbedInstance = null;

    /**
     * Register the plugin's shortcode into WordPress.
     *
     * @return  void
     * @since   1.0.0
     * @static
     *
     */
    public static function register() {
        // Register the new shortcode for embeds.
        add_shortcode( EMBEDPRESS_SHORTCODE, [ '\\EmbedPress\\Shortcode', 'do_shortcode' ] );
        add_shortcode( 'embed_oembed_html', [ '\\EmbedPress\\Shortcode', 'do_shortcode' ] );
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

    public static function do_shortcode( $attributes = [], $subject = null ) {
        $plgSettings = Core::getSettings();
        $default     = [];
        if ( $plgSettings->enableGlobalEmbedResize ) {
            $default = [
                'width'  => $plgSettings->enableEmbedResizeWidth,
                'height' => $plgSettings->enableEmbedResizeHeight
            ];
        }
        $attributes = wp_parse_args( $attributes, $default );
        $embed      = self::parseContent( $subject, true, $attributes );

        return is_object( $embed ) ? $embed->embed : $embed;
    }

    /**
     * Replace a given content with its embeded HTML code.
     *
     * @param string      The raw content that will be replaced.
     * @param boolean     Optional. If true, new lines at the end of the embeded code are stripped.
     *
     * @return  string
     * @since   1.0.0
     * @static
     *
     */
    public static function parseContent( $subject, $stripNewLine = false, $customAttributes = [] ) {
        if ( !empty( $subject ) ) {
            if ( empty( $customAttributes ) ) {
                $customAttributes = self::parseContentAttributesFromString( $subject );
            }

            $content = preg_replace( '/(\[' . EMBEDPRESS_SHORTCODE . '(?:\]|.+?\])|\[\/' . EMBEDPRESS_SHORTCODE . '\])/i',
                "", $subject );

            // Converts any special HTML entities back to characters.
            $content = htmlspecialchars_decode( $content );

            // Check if the WP_oEmbed class is loaded
            if ( !self::$oEmbedInstance ) {
                require_once ABSPATH . 'wp-includes/class-wp-oembed.php';

                self::$oEmbedInstance = _wp_oembed_get_object();
            }

            $emberaInstanceSettings = [
                'params' => [],
            ];

            $content_uid = md5( $content );

            $attributes = self::parseContentAttributes( $customAttributes, $content_uid );
            if ( isset( $attributes['width'] ) || isset( $attributes['height'] ) ) {
                if ( isset( $attributes['width'] ) ) {
                    $emberaInstanceSettings['params']['width'] = $attributes['width'];
                    unset( $attributes['width'] );
                }

                if ( isset( $attributes['height'] ) ) {
                    $emberaInstanceSettings['params']['height'] = $attributes['height'];
                    unset( $attributes['height'] );
                }
            }

            // Identify what service provider the shortcode's link belongs to
            $serviceProvider = self::$oEmbedInstance->get_provider( $content );


            // Check if OEmbed was unable to detect the url service provider.
            if ( empty( $serviceProvider ) ) {
                // Attempt to do the same using Embera.
                $emberaInstance = new Embera( $emberaInstanceSettings );
                // Add support to the user's custom service providers
                $additionalServiceProviders = Core::getAdditionalServiceProviders();
                if ( !empty( $additionalServiceProviders ) ) {
                    foreach ( $additionalServiceProviders as $serviceProviderClassName => $serviceProviderUrls ) {
                        self::addServiceProvider( $serviceProviderClassName, $serviceProviderUrls, $emberaInstance );
                    }

                    unset( $serviceProviderUrls, $serviceProviderClassName );
                }

                // Attempt to fetch more info about the url-embed.
                $urlData = $emberaInstance->getUrlInfo( $content );
            } else {
                // Attempt to fetch more info about the url-embed.
                $urlData = self::$oEmbedInstance->fetch( $serviceProvider, $content, $attributes );
            }

            // Sanitize the data
            $urlData = self::sanitizeUrlData( $urlData );

            // Stores the original content
            if ( is_object( $urlData ) ) {
                $urlData->originalContent = $content;
            }

            $eventResults = apply_filters( 'embedpress:onBeforeEmbed', $urlData );
            if ( empty( $eventResults ) ) {
                // EmbedPress seems unable to embed the url.
                return $subject;
            }

            // Transform all shortcode attributes into html form. I.e.: {foo: "joe"} -> foo="joe"
            $attributesHtml = [];
            foreach ( $attributes as $attrName => $attrValue ) {
                $attributesHtml[] = $attrName . '="' . $attrValue . '"';
            }

            // Define the EmbedPress html template where the generated embed will be injected in
            $embedTemplate = '<div ' . implode( ' ', $attributesHtml ) . '>{html}</div>';

            // Check if $content is a google shortened url and tries to extract from it which Google service it refers to.
            if ( preg_match( '/http[s]?:\/\/goo\.gl\/(?:([a-z]+)\/)?[a-z0-9]+\/?$/i', $content, $matches ) ) {
                // Fetch all headers from the short-url so we can know how to handle its original content depending on the service.
                $headers = get_headers( $content );

                $supportedServicesHeadersPatterns = [
                    'maps' => '/^Location:\s+(http[s]?:\/\/.+)$/i',
                ];

                $service = isset( $matches[1] ) ? strtolower( $matches[1] ) : null;
                // No specific service was found in the url.
                if ( empty( $service ) ) {
                    // Let's try to guess which service the original url belongs to.
                    foreach ( $headers as $header ) {
                        // Check if the short-url reffers to a Google Maps url.
                        if ( preg_match( $supportedServicesHeadersPatterns['maps'], $header, $matches ) ) {
                            // Replace the shortened url with its original url.
                            $content = $matches[1];
                            break;
                        }
                    }
                    unset( $header );
                } else {
                    // Check if the Google service is supported atm.
                    if ( isset( $supportedServicesHeadersPatterns[$service] ) ) {
                        // Tries to extract the url based on its headers.
                        $originalUrl = self::extractContentFromHeaderAsArray( $supportedServicesHeadersPatterns[$service],
                            $headers );
                        // Replace the shortened url with its original url if the specific header was found.
                        if ( !empty( $originalUrl ) ) {
                            $content = $originalUrl;
                        }
                        unset( $originalUrl );
                    }
                }
                unset( $service, $supportedServicesHeadersPatterns, $headers, $matches );
            }

            // Facebook is a special case. WordPress will try to embed them using OEmbed, but they always end up embedding the profile page, regardless
            // if the url was pointing to a photo, a post, etc. So, since Embera can embed only facebook-media/posts, we'll use it only for that.
            if ( isset( $urlData->provider_name ) && in_array( $urlData->provider_name, [ 'Facebook' ] ) ) {
                // Check if this is a Facebook profile url.
                if ( preg_match( '/facebook\.com\/(?:[^\/]+?)\/?$/', $content, $match ) ) {
                    // Try to embed the url using WP's OSEmbed.
                    $parsedContent = self::$oEmbedInstance->get_html( $content, $attributes );
                } else {
                    // Try to embed the url using EmbedPress' Embera.
                    $parsedContent = false;
                }
            } else {
                // Try to embed the url using WP's OSEmbed.
                $parsedContent = self::$oEmbedInstance->get_html( $content, $attributes );
            }

            if ( !$parsedContent ) {
                if ( !isset( $emberaInstance ) ) {
                    // If the embed couldn't be generated, we'll try to use Embera's API
                    $emberaInstance = new Embera( $emberaInstanceSettings );
                    // Add support to the user's custom service providers
                    $additionalServiceProviders = Core::getAdditionalServiceProviders();
                    if ( !empty( $additionalServiceProviders ) ) {
                        foreach ( $additionalServiceProviders as $serviceProviderClassName => $serviceProviderUrls ) {
                            self::addServiceProvider( $serviceProviderClassName, $serviceProviderUrls, $emberaInstance );
                        }

                        unset( $serviceProviderUrls, $serviceProviderClassName );
                    }
                }

                // Register the html template
                $emberaFormaterInstance = new Formatter( $emberaInstance, true );
                $emberaFormaterInstance->setTemplate( $embedTemplate );

                // Try to generate the embed using Embera API
                $parsedContent = $emberaFormaterInstance->transform( $content );

                unset( $emberaFormaterInstance, $additionalServiceProviders, $emberaInstance );
            } else {
                // Inject the generated code inside the html template
                $parsedContent = str_replace( '{html}', $parsedContent, $embedTemplate );

                // Replace all single quotes to double quotes. I.e: foo='joe' -> foo="joe"
                $parsedContent = str_replace( "'", '"', $parsedContent );

                // Replace the flag `{provider_alias}` which is used by Embera with the "ose-<serviceProviderAlias>". I.e: YouTube -> "ose-youtube"
                $parsedContent = preg_replace( '/((?:ose-)?\{provider_alias\})/i',
                    "ose-" . strtolower( $urlData->provider_name ), $parsedContent );
            }

            if ( isset( $urlData->provider_name ) || (is_array( $urlData ) && isset( $urlData[$content]['provider_name'] )) ) {
                // NFB seems to always return their embed code with all HTML entities into their applicable characters string.
                if ( (isset( $urlData->provider_name ) && strtoupper( $urlData->provider_name ) === "NATIONAL FILM BOARD OF CANADA") || (is_array( $urlData ) && isset( $urlData[$content]['provider_name'] ) && strtoupper( $urlData[$content]['provider_name'] ) === "NATIONAL FILM BOARD OF CANADA") ) {
                    $parsedContent = html_entity_decode( $parsedContent );
                } elseif ( (isset( $urlData->provider_name ) && strtoupper( $urlData->provider_name ) === "FACEBOOK") || (is_array( $urlData ) && isset( $urlData[$content]['provider_name'] ) && strtoupper( $urlData[$content]['provider_name'] ) === "FACEBOOK") ) {
                    $plgSettings = Core::getSettings();

                    // Check if the user wants to force a certain language into Facebook embeds.
                    $locale = isset( $plgSettings->fbLanguage ) && !empty( $plgSettings->fbLanguage ) ? $plgSettings->fbLanguage : false;
                    if ( !!$locale ) {
                        // Replace the automatically detected language by Facebook's API with the language chosen by the user.
                        $parsedContent = preg_replace( '/\/[a-z]{2}\_[a-z]{2}\/sdk\.js/i', "/{$locale}/sdk.js",
                            $parsedContent );
                    }

                    // Make sure `adapt_container_width` parameter is set to false. Setting to true, as it is by default, might cause Facebook to render embeds inside editors (in admin) with only 180px wide.
                    if ( is_admin() ) {
                        $parsedContent = preg_replace( '~data\-adapt\-container\-width=\"(?:true|1)\"~i',
                            'data-adapt-container-width="0"', $parsedContent );
                    }

                    unset( $locale, $plgSettings );
                }
            }

            unset( $embedTemplate, $serviceProvider );

            // This assure that the iframe has the same dimensions the user wants to
            if ( isset( $emberaInstanceSettings['params']['width'] ) || isset( $emberaInstanceSettings['params']['height'] ) ) {
                if ( isset( $emberaInstanceSettings['params']['width'] ) && isset( $emberaInstanceSettings['params']['height'] ) ) {
                    $customWidth  = (int)$emberaInstanceSettings['params']['width'];
                    $customHeight = (int)$emberaInstanceSettings['params']['height'];
                } else {
                    if ( preg_match( '~width="(\d+)"|width\s+:\s+(\d+)~i', $parsedContent, $matches ) ) {
                        $iframeWidth = (int)$matches[1];
                    }

                    if ( preg_match( '~height="(\d+)"|height\s+:\s+(\d+)~i', $parsedContent, $matches ) ) {
                        $iframeHeight = (int)$matches[1];
                    }

                    if ( isset( $iframeWidth ) && isset( $iframeHeight ) && $iframeWidth > 0 && $iframeHeight > 0 ) {
                        $iframeRatio = ceil( $iframeWidth / $iframeHeight );

                        if ( isset( $emberaInstanceSettings['params']['width'] ) ) {
                            $customWidth  = (int)$emberaInstanceSettings['params']['width'];
                            $customHeight = ceil( $customWidth / $iframeRatio );
                        } else {
                            $customHeight = (int)$emberaInstanceSettings['params']['height'];
                            $customWidth  = $iframeRatio * $customHeight;
                        }
                    }
                }

                if ( isset( $customWidth ) && isset( $customHeight ) ) {
                    if ( preg_match( '~width="(\d+)"~i', $parsedContent ) ) {
                        $parsedContent = preg_replace( '~width="(\d+)"~i', 'width="' . $customWidth . '"',
                            $parsedContent );
                    }

                    if ( preg_match( '~height="(\d+)"~i', $parsedContent ) ) {
                        $parsedContent = preg_replace( '~height="(\d+)"~i', 'height="' . $customHeight . '"',
                            $parsedContent );
                    }

                    if ( preg_match( '~width\s+:\s+(\d+)~i', $parsedContent ) ) {
                        $parsedContent = preg_replace( '~width\s+:\s+(\d+)~i', 'width: ' . $customWidth, $parsedContent );
                    }

                    if ( preg_match( '~height\s+:\s+(\d+)~i', $parsedContent ) ) {
                        $parsedContent = preg_replace( '~height\s+:\s+(\d+)~i', 'height: ' . $customHeight,
                            $parsedContent );
                    }
                }
            }

            if ( $stripNewLine ) {
                $parsedContent = preg_replace( '/\n/', '', $parsedContent );
            }

            $parsedContent = apply_filters( 'pp_embed_parsed_content', $parsedContent, $urlData, $attributes );

            if ( !empty( $parsedContent ) ) {
                $embed = (object)array_merge( (array)$urlData, [
                    'attributes' => (object)$attributes,
                    'embed'      => $parsedContent,
                    'url'        => $content,
                ] );
                $embed = apply_filters( 'embedpress:onAfterEmbed', $embed );
                return $embed;
            }
        }

        return $subject;
    }

    /**
     * Method that adds support to a given new service provider (SP).
     *
     * @param string $className The new SP class name.
     * @param string $reference The new SP reference name.
     * @param \Embera\Embera $emberaInstance The embera's instance where the SP will be registered in.
     *
     * @return  boolean
     * @since   1.0.0
     * @static
     *
     */
    public static function addServiceProvider( $className, $reference, &$emberaInstance ) {
        if ( empty( $className ) || empty( $reference ) ) {
            return false;
        }

        if ( is_string( $reference ) ) {
            $emberaInstance->addProvider( $reference, EMBEDPRESS_NAMESPACE . "\\Providers\\{$className}" );
        } elseif ( is_array( $reference ) ) {
            foreach ( $reference as $serviceProviderUrl ) {
                self::addServiceProvider( $className, $serviceProviderUrl, $emberaInstance );
            }
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
    public static function parseContentAttributesFromString( $subject ) {
        $customAttributes = [];
        if ( preg_match( '/\[embed\s*(.*?)\]/i', stripslashes( $subject ), $m ) ) {
            if ( preg_match_all( '/(\!?\w+-?\w*)(?:="(.+?)")?/i', stripslashes( $m[1] ), $matches ) ) {
                $attributes = $matches[1];
                $attrValues = $matches[2];

                foreach ( $attributes as $attrIndex => $attrName ) {
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
    private static function parseContentAttributes( array $customAttributes, $content_uid = null ) {
        $attributes = [
            'class' => [ "embedpress-wrapper" ],
        ];

        $embedShouldBeResponsive         = true;
        $embedShouldHaveCustomDimensions = false;
        if ( !empty( $customAttributes ) ) {
            if ( isset( $customAttributes['class'] ) ) {
                if ( !empty( $customAttributes['class'] ) ) {
                    $customAttributes['class'] = explode( ' ', $customAttributes['class'] );

                    $attributes['class'] = array_merge( $attributes['class'], $customAttributes['class'] );
                }

                unset( $customAttributes['class'] );
            }

            if ( isset( $customAttributes['width'] ) ) {
                if ( !empty( $customAttributes['width'] ) ) {
                    $attributes['width']             = (int)$customAttributes['width'];
                    $embedShouldHaveCustomDimensions = true;
                }
            }

            if ( isset( $customAttributes['height'] ) ) {
                if ( !empty( $customAttributes['height'] ) ) {
                    $attributes['height']            = (int)$customAttributes['height'];
                    $embedShouldHaveCustomDimensions = true;
                }
            }

            if ( !empty( $customAttributes ) ) {
                $attrNameDefaultPrefix = "data-";
                foreach ( $customAttributes as $attrName => $attrValue ) {
                    if ( is_numeric( $attrName ) ) {
                        $attrName  = $attrValue;
                        $attrValue = "";
                    }

                    $attrName = str_replace( $attrNameDefaultPrefix, "", $attrName );

                    if ( !strlen( $attrValue ) ) {
                        if ( $attrName[0] === "!" ) {
                            $attrValue = "false";
                            $attrName  = substr( $attrName, 1 );
                        } else {
                            $attrValue = "true";
                        }
                    }

                    $attributes[$attrNameDefaultPrefix . $attrName] = $attrValue;
                }
            }

            // Check if there's any "responsive" parameter
            $responsiveAttributes = [ "responsive", "data-responsive" ];
            foreach ( $responsiveAttributes as $responsiveAttr ) {
                if ( isset( $attributes[$responsiveAttr] ) ) {
                    if ( !strlen( $attributes[$responsiveAttr] ) ) { // If the parameter is passed but have no value, it will be true by default
                        $embedShouldBeResponsive = true;
                    } else {
                        $embedShouldBeResponsive = !self::valueIsFalse( $attributes[$responsiveAttr] );
                    }

                    break;
                }
            }
            unset( $responsiveAttr, $responsiveAttributes );
        }

        $attributes['class'][] = 'ose-{provider_alias}';

        if ( !empty( $content_uid ) ) {
            $attributes['class'][] = 'ose-uid-' . $content_uid;
        }

        if ( $embedShouldBeResponsive && !$embedShouldHaveCustomDimensions ) {
            $attributes['class'][] = 'responsive';
        } else {
            $attributes['data-responsive'] = "false";
        }

        $attributes['class'] = implode( ' ', array_unique( array_filter( $attributes['class'] ) ) );
        if ( isset( $attributes['width'] ) ) {
            $attributes['style'] = "width:{$attributes['width'] }px;height:{$attributes['height'] }px;";
        }

        return $attributes;
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
    public static function valueIsFalse( $subject ) {
        $subject = strtolower( trim( (string)$subject ) );
        switch ( $subject ) {
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
    private static function extractContentFromHeaderAsArray( $headerPattern, $headersList ) {
        $headerValue = null;

        foreach ( $headersList as $header ) {
            if ( preg_match( $headerPattern, $header, $matches ) ) {
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
    private static function sanitizeUrlData( $data ) {
        if ( is_object( $data ) ) {
            $attributes = get_object_vars( $data );

            foreach ( $attributes as $key => $value ) {
                if ( substr_count( $key, '-' ) ) {
                    unset( $data->$key );

                    $key        = str_replace( '-', '_', $key );
                    $data->$key = $value;
                }
            }
        } elseif ( is_array( $data ) ) {
            foreach ( $data as $key => $value ) {
                if ( substr_count( $key, '-' ) ) {
                    unset( $data[$key] );

                    $key        = str_replace( '-', '_', $key );
                    $data[$key] = $value;
                }
            }
        }

        return $data;
    }
}
