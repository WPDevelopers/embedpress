<?php
namespace EmbedPress;

use Embera\Embera;
use Embera\Formatter;

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
        add_shortcode(EMBEDPRESS_SHORTCODE, array('EmbedPress\Shortcode', 'do_shortcode'), 1);
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
    public static function do_shortcode($attributes, $subject = null)
    {
        $decodedSubject = self::parseContent($subject, true);

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
    public static function parseContent($content, $stripNewLine = false)
    {
        if (!isset(self::$emberaInstance)) {
            self::$emberaInstance = new Formatter(new Embera, true);
        }

        if (!empty($content)) {
            self::$emberaInstance->setTemplate('<div class="osembed-wrapper ose-{provider_alias} {wrapper_class}">{html}</div>');

            $content = self::$emberaInstance->transform($content);

            if ($stripNewLine) {
                $content = preg_replace('/\n/', '', $content);
            }
        }

        return $content;
    }
}