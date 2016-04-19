<?php
/**
 * @package     EmbedPress
 * @author      OSTraining <support@ostraining.com>
 * @copyright   TODO
 * @license     TODO
 * @since       0.1
 */

defined('ABSPATH') or die("No direct script access allowed.");

if (!defined('EMBEDPRESS_IS_LOADED')) {
    define('EMBEDPRESS_IS_LOADED', true);
    define('EMBEDPRESS_VERSION', "0.1");
    define('EMBEDPRESS_NAME', "embedpress");
    define('EMBEDPRESS_PATH', plugin_dir_path(__FILE__));

    require_once EMBEDPRESS_PATH .'defaults.php';
}
