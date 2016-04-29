<?php
namespace EmbedPress;

use \EmbedPress\Plugin;
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
    public static function parseContent($content, $stripNewLine = false, $attributes = array())
    {
        if (!isset(static::$emberaInstance)) {
            static::$emberaInstance = new Formatter(new Embera, true);
        }

        $additionalServiceProviders = Plugin::getAdditionalServiceProviders();
        if (!empty($additionalServiceProviders)) {
            foreach ($additionalServiceProviders as $serviceProviderClassName => $serviceProviderUrls) {
                self::addServiceProvider($serviceProviderClassName, $serviceProviderUrls);
            }
        }

        if (!empty($content)) {
            $customClasses = "";
            $attributesString = "";

            if (is_array($attributes) && !empty($attributes)) {
                if (isset($attributes['class'])) {
                    if (!empty($attributes['class'])) {
                        $customClasses = ' '. $attributes['class'];
                    }
                    unset($attributes['class']);
                }

                $attrNamePrefix = "data-";
                $attributesString = [];
                foreach ($attributes as $attrName => $attrValue) {
                    $attrName = strpos($attrName, $attrNamePrefix) === 0 ? $attrName : ($attrNamePrefix . $attrName);
                    $attributesString[] = sprintf('%s="%s"', $attrName, $attrValue);
                }
                $attributesString = ' '. implode(' ', $attributesString);
            }

            static::$emberaInstance->setTemplate('<div class="osembed-wrapper ose-{provider_alias} {wrapper_class}'. $customClasses .'"'. $attributesString .'>{html}</div>');

            // Strip any remaining shortcode-code on $content
            $content = preg_replace('/(\['. EMBEDPRESS_SHORTCODE .'(?:\]|.+?\])|\[\/'. EMBEDPRESS_SHORTCODE .'\])/i', "", $content);
            $content = static::$emberaInstance->transform($content);

            if ($stripNewLine) {
                $content = preg_replace('/\n/', '', $content);
            }
        }

        return $content;
    }

    private static function addServiceProvider($className, $reference)
    {
        if (empty($className) || empty($reference)) {
            return false;
        }

        if (is_string($reference)) {
            self::$emberaInstance->addProvider($reference, EMBEDPRESS_NAMESPACE ."\\Providers\\{$className}");
        } else if (is_array($reference)) {
            foreach ($reference as $serviceProviderUrl) {
                self::addServiceProvider($className, $serviceProviderUrl);
            }
        } else {
            return false;
        }
    }
}