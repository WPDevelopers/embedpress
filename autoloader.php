<?php
/**
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2020 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       1.0.0
 */

use EmbedPress\AutoLoader;

defined('ABSPATH') or die("No direct script access allowed.");

$autoLoaderFullClassName = EMBEDPRESS_NAMESPACE . '\\' . EMBEDPRESS_AUTOLOADER_NAME;
if ( ! defined('EMBEDPRESS_IS_LOADED') || ! class_exists($autoLoaderFullClassName)) {
    define('EMBEDPRESS_IS_LOADED', true);

    if ( ! class_exists($autoLoaderFullClassName)) {
        require_once EMBEDPRESS_PATH_CORE . EMBEDPRESS_AUTOLOADER_NAME . '.php';
    }

    AutoLoader::register(str_replace('\\', "", EMBEDPRESS_NAMESPACE), EMBEDPRESS_PATH_CORE);
}
unset($autoLoaderFullClassName);
