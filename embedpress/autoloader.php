<?php
/**
 * @package   AllediaFramework
 * @contact   www.alledia.com, hello@alledia.com
 * @copyright 2016 Alledia.com, All rights reserved
 * @license   http://www.gnu.org/licenses/gpl.html GNU/GPL
 */

use EmbedPress\AutoLoader;


if (!defined('KLUSTER') || 1 == 1) {
    define('KLUSTER', 1);

    define('KLUSTER_PATH', __DIR__);

    // Setup autoloaded libraries
    if (!class_exists('\\EmbedPress\\AutoLoader')) {
        require_once KLUSTER_PATH .'/embedpress/AutoLoader.php';
    }

    AutoLoader::register('EmbedPress', KLUSTER_PATH);

    if (function_exists('spl_autoload_register')) {
        spl_autoload_register(function($class) {
            $class = __DIR__ . '/' . str_replace('\\', DIRECTORY_SEPARATOR, $class) . '.php';
            if (file_exists($class)) {
                require $class;
            }
        });
    }
}

// Backward compatibility with the old autoloader. Avoids to break a legacy system plugin running while installing.
//require_once "EmbedPressPsr4AutoLoader.php";
