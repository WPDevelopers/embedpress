<?php
/**
 * @package     EmbedPress
 * @author      OSTraining <support@ostraining.com>
 * @copyright   TODO
 * @license     TODO
 * @since       0.1
 */

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

if (!defined('EMBEDPRESS_INCLUDES_PATH')) {
    define('EMBEDPRESS_INCLUDES_PATH', EMBEDPRESS_PATH ."includes");
}

if (!defined('EMBEDPRESS_LIBRARIES_PATH')) {
    define('EMBEDPRESS_LIBRARIES_PATH', EMBEDPRESS_PATH ."library");
}

if (!defined('EMBEDPRESS_PUBLIC_PATH')) {
    define('EMBEDPRESS_PUBLIC_PATH', EMBEDPRESS_PATH ."public");
}

if (!defined('EMBEDPRESS_ADMIN_PATH')) {
    define('EMBEDPRESS_ADMIN_PATH', EMBEDPRESS_PATH ."admin");
}
