<?php
namespace EmbedPress;

use \Embera\Embera;
use \Embera\Formatter;

class Shortcode
{
    /**
     * The Embera library singleton used to convert urls into specific and complex HTML.
     *
     * @since   0.1
     * @access  protected
     *
     * @var     Embera\Formatter    $emberaInstance    The Embera instance
     */
    protected static $emberaInstance;

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
        if (!isset(static::$emberaInstance)) {
            static::$emberaInstance = new Formatter(new Embera, true);
        }

        if (!empty($content)) {
            $content = preg_replace('/(\['. EMBEDPRESS_SHORTCODE .'(?:\]|.+?\])|\[\/'. EMBEDPRESS_SHORTCODE .'\])/i', "", $content);

            $attributes = self::parseContentAttributes($customAttributes);

            $attributesHtml = [];
            foreach ($attributes as $attrName => $attrValue) {
                $attributesHtml[] = $attrName .'="'. $attrValue .'"';
            }

            $embedTemplate = '<div '. implode(' ', $attributesHtml) .'>{html}</div>';
            self::$emberaInstance->setTemplate($embedTemplate);

            $content = static::$emberaInstance->transform($content);

            if ($stripNewLine) {
                $content = preg_replace('/\n/', '', $content);
            }
        }

        return $content;
    }

    private static function parseContentAttributes(array $customAttributes)
    {
        $attributes = array(
            'class' => ["osembed-wrapper", '{wrapper_class}']
        );

        $embedShouldBeResponsive = null;

        if (!empty($customAttributes)) {
            if (isset($customAttributes['class'])) {
                if (!empty($customAttributes['class'])) {
                    $customAttributes['class'] = explode(' ', $customAttributes['class']);

                    $attributes['class'] = array_merge($attributes['class'], $customAttributes['class']);
                }

                unset($customAttributes['class']);
            }

            if (!empty($customAttributes)) {
                $attrNameDefaultPrefix = "data-";
                foreach ($customAttributes as $attrName => $attrValue) {
                    $attrName = strpos($attrName, $attrNameDefaultPrefix) === 0 ? $attrName : ($attrNameDefaultPrefix . $attrName);

                    // Check if the property has an assumed value. I.e: "foo" would be true if <div foo> or false if <div !foo>
                    if (preg_match('/'. $attrNameDefaultPrefix .'\d+/i', $attrName)) {
                        if ($attrValue[0] === "!") {
                            $attrName = substr($attrValue, 1);
                            $attrValue = "false";
                        } else {
                            $attrName = $attrValue;
                            $attrValue = "true";
                        }
                    }

                    $attributes[$attrName] = $attrValue;
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

        if ($embedShouldBeResponsive) {
            $attributes['class'][] = 'ose-{provider_alias}';
        }

        $attributes['class'] = implode(' ', array_unique(array_filter($attributes['class'])));

        return $attributes;
    }
}