<?php
/**
 * @package   AllediaFramework
 * @contact   www.alledia.com, hello@alledia.com
 * @copyright 2016 Alledia.com, All rights reserved
 * @license   http://www.gnu.org/licenses/gpl.html GNU/GPL
 */

use \EmbedPress\AutoLoader;

defined('ABSPATH') or die("No direct script access allowed.");

$autoLoaderFullClassName = EMBEDPRESS_NAMESPACE .'\\'. EMBEDPRESS_AUTOLOADER_NAME;
if (!defined('EMBEDPRESS_IS_LOADED') || !class_exists($autoLoaderFullClassName)) {
    define('EMBEDPRESS_IS_LOADED', true);

    if (!class_exists($autoLoaderFullClassName)) {
        require_once EMBEDPRESS_PATH_CORE . EMBEDPRESS_AUTOLOADER_NAME .'.php';
    }

    AutoLoader::register(str_replace('\\', "", EMBEDPRESS_NAMESPACE), EMBEDPRESS_PATH_CORE);
}
unset($autoLoaderFullClassName);