<?php
defined('ABSPATH') or die("No direct script access allowed.");

 /**
 * Defines utilitary methods to the public-facing area of the plugin.
 *
 * @package     EmbedPress
 * @subpackage  EmbedPress/Public
 * @author      OSTraining <support@ostraining.com>
 * @copyright   TODO
 * @license     TODO
 * @since       0.1
 */
class EmbedPressPublicHelper
{
    /**
     * Method that apply the plugin shortcode into a string. I.e. "foo" becomes "[lorem]foo[/lorem]".
     *
     * @since 0.1
     * @static
     *
     * @param string    $subject - The given string
     * @return string
     */
    public static function applyShortcodeToContent($subject)
    {
        $encodedSubject = sprintf('[%s]%s[/%1$s]', EMBEDPRESS_SHORTCODE, trim($subject));

        return $encodedSubject;
    }

    /**
     * Method that converts the plugin shortcoded-string into its complex content.
     *
     * @since 0.1
     * @static
     *
     * @param array     $attributes - @TODO
     * @param string    $subject - The given string
     * @return string
     */
    public static function decodeShortcodedContent($attributes, $subject = null)
    {
        $decodedSubject = EmbedPress::parseContent($subject, true);

        return $decodedSubject;
    }
}