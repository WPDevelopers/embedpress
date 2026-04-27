<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
/**
 * EmbedPress PHPUnit Bootstrap
 *
 * For unit tests: loads stubs, constants, and composer autoloader (no WordPress).
 * For integration tests: loads full WordPress test suite.
 */

$ep_plugin_dir = dirname(__DIR__);
$ep_tests_dir = getenv('WP_TESTS_DIR') ?: '/tmp/wordpress-tests-lib';

// ============================================================================
// Unit tests — no WordPress needed
// ============================================================================
if (defined('EP_UNIT_TESTS') || getenv('EP_UNIT_TESTS')) {

    if (!defined('EMBEDPRESS_TESTING')) {
        define('EMBEDPRESS_TESTING', true);
    }

    // Load WordPress function stubs
    require_once __DIR__ . '/stubs.php';

    // Define plugin constants needed by providers
    if (!defined('EMBEDPRESS')) {
        define('EMBEDPRESS', 'EmbedPress');
    }
    if (!defined('EMBEDPRESS_PLG_NAME')) {
        define('EMBEDPRESS_PLG_NAME', 'embedpress');
    }
    if (!defined('EMBEDPRESS_VERSION')) {
        define('EMBEDPRESS_VERSION', '4.4.11');
        define('EMBEDPRESS_PLG_VERSION', EMBEDPRESS_VERSION);
    }
    if (!defined('EMBEDPRESS_ROOT')) {
        define('EMBEDPRESS_ROOT', $ep_plugin_dir);
    }
    if (!defined('EMBEDPRESS_PATH_BASE')) {
        define('EMBEDPRESS_PATH_BASE', $ep_plugin_dir . '/');
    }
    if (!defined('EMBEDPRESS_PATH_CORE')) {
        define('EMBEDPRESS_PATH_CORE', EMBEDPRESS_PATH_BASE . 'EmbedPress/');
    }
    if (!defined('EMBEDPRESS_NAMESPACE')) {
        define('EMBEDPRESS_NAMESPACE', '\\EmbedPress');
    }
    if (!defined('EMBEDPRESS_AUTOLOADER_NAME')) {
        define('EMBEDPRESS_AUTOLOADER_NAME', 'AutoLoader');
    }

    // Load composer autoloader (loads embera classes)
    if (file_exists($ep_plugin_dir . '/vendor/autoload.php')) {
        require_once $ep_plugin_dir . '/vendor/autoload.php';
    }

    // Load plugin's PSR-4 autoloader for EmbedPress\ classes
    require_once $ep_plugin_dir . '/autoloader.php';

    return;
}

// ============================================================================
// Integration tests — full WordPress
// ============================================================================
if (!file_exists($ep_tests_dir . '/includes/functions.php')) {
    echo "Could not find WordPress test suite at " . esc_html( $ep_tests_dir ) . ".\n"; // phpcs:ignore
    echo "Run: install-wp-tests.sh <db-name> <db-user> <db-pass> <db-host>\n";
    exit(1);
}

require_once $ep_tests_dir . '/includes/functions.php';

tests_add_filter('muplugins_loaded', function () use ($ep_plugin_dir) {
    require $ep_plugin_dir . '/embedpress.php';
});

require $ep_tests_dir . '/includes/bootstrap.php';
