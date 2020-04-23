<?php

namespace EmbedPress;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Class Compatibility.
 *
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2020 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 */
class Compatibility
{
    /**
     * Returns true if is WordPress 5.x or any beta version.
     *
     * @return bool
     */
    public static function isWordPress5()
    {
        global $wp_version;

        return version_compare($wp_version, '5.0', '>=') || substr($wp_version, 0, 2) === '5.';
    }

    public static function isClassicalEditorActive()
    {
        $isActive = is_plugin_active('classic-editor/classic-editor.php');

        return $isActive;
    }
}
