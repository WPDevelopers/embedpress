<?php
/**
 * WordPress function stubs for unit testing without WordPress loaded.
 * Only stubs functions that providers actually call.
 */

if (!defined('ABSPATH')) {
    define('ABSPATH', '/tmp/wordpress/');
}

if (!defined('EMBEDPRESS_IS_LOADED')) {
    define('EMBEDPRESS_IS_LOADED', true);
}

if (!defined('EMBEDPRESS_NAMESPACE')) {
    define('EMBEDPRESS_NAMESPACE', 'EmbedPress');
}

if (!function_exists('site_url')) {
    function site_url($path = '') {
        return 'http://localhost:8080' . $path;
    }
}

if (!function_exists('esc_url')) {
    function esc_url($url) {
        return filter_var($url, FILTER_SANITIZE_URL);
    }
}

if (!function_exists('esc_attr')) {
    function esc_attr($text) {
        return htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
    }
}

if (!function_exists('wp_remote_get')) {
    function wp_remote_get($url, $args = []) {
        return ['body' => '', 'response' => ['code' => 200]];
    }
}

if (!function_exists('wp_remote_retrieve_body')) {
    function wp_remote_retrieve_body($response) {
        return $response['body'] ?? '';
    }
}

if (!function_exists('is_wp_error')) {
    function is_wp_error($thing) {
        return false;
    }
}

if (!function_exists('__')) {
    function __($text, $domain = 'default') {
        return $text;
    }
}

if (!function_exists('apply_filters')) {
    function apply_filters($tag, $value, ...$args) {
        return $value;
    }
}

if (!function_exists('do_action')) {
    function do_action($tag, ...$args) {}
}

if (!function_exists('add_filter')) {
    function add_filter($tag, $callback, $priority = 10, $accepted_args = 1) {
        return true;
    }
}

if (!function_exists('add_action')) {
    function add_action($tag, $callback, $priority = 10, $accepted_args = 1) {
        return true;
    }
}

if (!function_exists('remove_filter')) {
    function remove_filter($tag, $callback, $priority = 10) {
        return true;
    }
}

if (!function_exists('has_filter')) {
    function has_filter($tag, $callback = false) {
        return false;
    }
}

if (!function_exists('wp_parse_args')) {
    function wp_parse_args($args, $defaults = []) {
        return array_merge($defaults, (array) $args);
    }
}

if (!function_exists('plugins_url')) {
    function plugins_url($path = '', $plugin = '') {
        return 'http://localhost:8080/wp-content/plugins/' . $path;
    }
}

if (!function_exists('plugin_dir_path')) {
    function plugin_dir_path($file) {
        return trailingslashit(dirname($file));
    }
}

if (!function_exists('trailingslashit')) {
    function trailingslashit($string) {
        return rtrim($string, '/\\') . '/';
    }
}

if (!function_exists('wp_json_encode')) {
    function wp_json_encode($data, $options = 0, $depth = 512) {
        return json_encode($data, $options, $depth);
    }
}

if (!function_exists('absint')) {
    function absint($maybeint) {
        return abs((int) $maybeint);
    }
}

if (!function_exists('get_option')) {
    function get_option($option, $default = false) {
        return array_key_exists($option, $GLOBALS['__ep_test_options'] ?? [])
            ? $GLOBALS['__ep_test_options'][$option]
            : $default;
    }
}

if (!function_exists('update_option')) {
    function update_option($option, $value, $autoload = null) {
        if (!isset($GLOBALS['__ep_test_options'])) $GLOBALS['__ep_test_options'] = [];
        $GLOBALS['__ep_test_options'][$option] = $value;
        return true;
    }
}

if (!function_exists('sanitize_text_field')) {
    function sanitize_text_field($str) {
        return trim(strip_tags($str));
    }
}

if (!function_exists('get_the_title')) {
    function get_the_title($post = 0) {
        return '';
    }
}

if (!function_exists('attachment_url_to_postid')) {
    function attachment_url_to_postid($url) {
        return 0;
    }
}

if (!function_exists('admin_url')) {
    function admin_url($path = '', $scheme = 'admin') {
        return 'http://localhost:8080/wp-admin/' . ltrim($path, '/');
    }
}

if (!function_exists('delete_option')) {
    function delete_option($option) {
        return true;
    }
}

if (!function_exists('wp_hash_password')) {
    function wp_hash_password($password) {
        return md5($password);
    }
}

if (!function_exists('wp_generate_password')) {
    function wp_generate_password($length = 12, $special_chars = true, $extra_special_chars = false) {
        return str_repeat('a', $length);
    }
}

if (!function_exists('wp_get_current_user')) {
    function wp_get_current_user() {
        return (object) ['roles' => []];
    }
}

if (!function_exists('esc_html')) {
    function esc_html($text) {
        return htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
    }
}

if (!function_exists('sanitize_key')) {
    function sanitize_key($key) {
        $key = strtolower((string) $key);
        return preg_replace('/[^a-z0-9_\-]/', '', $key);
    }
}
if (!function_exists('esc_url_raw')) {
    function esc_url_raw($url) {
        return filter_var((string) $url, FILTER_SANITIZE_URL);
    }
}
if (!function_exists('wp_kses_post')) {
    function wp_kses_post($content) {
        return (string) $content;
    }
}
if (!function_exists('rest_url')) {
    function rest_url($path = '') {
        return 'http://localhost:8080/wp-json/' . ltrim((string) $path, '/');
    }
}
if (!function_exists('wp_create_nonce')) {
    function wp_create_nonce($action = '') {
        return 'test-nonce';
    }
}
if (!function_exists('home_url')) {
    function home_url($path = '', $scheme = null) {
        return 'http://localhost:8080' . $path;
    }
}
if (!function_exists('add_query_arg')) {
    function add_query_arg(...$args) {
        return '';
    }
}
if (!function_exists('wp_login_url')) {
    function wp_login_url($redirect = '') {
        return 'http://localhost:8080/wp-login.php';
    }
}
if (!function_exists('current_user_can')) {
    function current_user_can($cap) {
        return false;
    }
}
if (!function_exists('is_user_logged_in')) {
    function is_user_logged_in() {
        return false;
    }
}
if (!function_exists('current_time')) {
    function current_time($type = 'mysql', $gmt = 0) {
        return date('Y-m-d H:i:s');
    }
}
if (!function_exists('get_current_user_id')) {
    function get_current_user_id() {
        return 0;
    }
}
if (!function_exists('is_email')) {
    function is_email($email) {
        return filter_var($email, FILTER_VALIDATE_EMAIL) ? $email : false;
    }
}
if (!function_exists('sanitize_email')) {
    function sanitize_email($email) {
        return filter_var(trim((string) $email), FILTER_SANITIZE_EMAIL);
    }
}
if (!function_exists('get_post_mime_type')) {
    function get_post_mime_type($id) {
        return $GLOBALS['__ep_test_post_mime'][$id] ?? '';
    }
}
if (!function_exists('get_post_meta')) {
    function get_post_meta($id, $key, $single = false) {
        return $GLOBALS['__ep_test_post_meta'][$id][$key] ?? '';
    }
}
if (!function_exists('update_post_meta')) {
    function update_post_meta($id, $key, $value) {
        $GLOBALS['__ep_test_post_meta'][$id][$key] = $value;
        return true;
    }
}
