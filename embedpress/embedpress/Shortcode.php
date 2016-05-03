<?php
namespace EmbedPress;

use \Embera\Embera;
use \Embera\Formatter;

class Shortcode
{
    /**
     * Register the plugin shortcode into WordPress.
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
            }

            $attributesHtml = [];
            foreach ($attributes as $attrName => $attrValue) {
                $attributesHtml[] = $attrName .'="'. $attrValue .'"';
            }

            $embedTemplate = '<div '. implode(' ', $attributesHtml) .'>{html}</div>';

            $emberaInstance = new Embera($emberaInstanceSettings);
            $emberaFormaterInstance = new Formatter($emberaInstance, true);
            $emberaFormaterInstance->setTemplate($embedTemplate);

            $content = $emberaFormaterInstance->transform($content);

            if ($stripNewLine) {
                $content = preg_replace('/\n/', '', $content);
            }
        }

        return $content;
    }

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

    private static function parseContentAttributes(array $customAttributes)
    {
        $attributes = array(
            'class' => ["osembed-wrapper", '{wrapper_class}']
        );

        $embedShouldBeResponsive = null;
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

                unset($customAttributes['width']);
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

            $responsiveAttributes = ["responsive", "data-responsive"];
            foreach ($responsiveAttributes as $responsiveAttr) {
                if (isset($attributes[$responsiveAttr])) {
                    $embedShouldBeResponsive = !self::valueIsFalse($attributes[$responsiveAttr]);

                    unset($attributes[$responsiveAttr]);
                }
            }
            unset($responsiveAttr, $responsiveAttributes);
        }

        if ($embedShouldBeResponsive && !$embedShouldHaveCustomDimensions) {
            $attributes['class'][] = 'ose-{provider_alias}';
        }

        $attributes['class'] = implode(' ', array_unique(array_filter($attributes['class'])));

        return $attributes;
    }

    public static function valueIsFalse($subject) {
        switch (trim(strtolower((string)$subject))) {
            case "":
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