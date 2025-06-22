<?php

namespace EmbedPress\Src\Blocks;

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * EmbedPress Migration AJAX Handler
 * 
 * Handles AJAX requests related to migration functionality
 */
class MigrationAjaxHandler
{
    /**
     * Instance of this class
     */
    private static $instance = null;

    /**
     * Get instance
     */
    public static function get_instance()
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Constructor
     */
    private function __construct()
    {
        // Register AJAX handlers
        add_action('wp_ajax_embedpress_dismiss_migration_notice', [$this, 'dismiss_migration_notice']);
        add_action('wp_ajax_embedpress_get_migration_status', [$this, 'get_migration_status']);
        add_action('wp_ajax_embedpress_get_migration_logs', [$this, 'get_migration_logs']);
        add_action('wp_ajax_embedpress_clear_migration_logs', [$this, 'clear_migration_logs']);
        add_action('wp_ajax_embedpress_force_migration', [$this, 'force_migration']);
    }

    /**
     * Dismiss migration notice
     */
    public function dismiss_migration_notice()
    {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'] ?? '', 'embedpress_migration_notice')) {
            wp_die(__('Security check failed', 'embedpress'));
        }

        // Check user capabilities
        if (!current_user_can('manage_options')) {
            wp_die(__('Insufficient permissions', 'embedpress'));
        }

        // Mark notice as dismissed
        update_option('embedpress_migration_notice_dismissed', true);

        wp_send_json_success([
            'message' => __('Migration notice dismissed', 'embedpress')
        ]);
    }

    /**
     * Get migration status via AJAX
     */
    public function get_migration_status()
    {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'] ?? '', 'embedpress_migration_ajax')) {
            wp_die(__('Security check failed', 'embedpress'));
        }

        // Check user capabilities
        if (!current_user_can('manage_options')) {
            wp_die(__('Insufficient permissions', 'embedpress'));
        }

        $migration = Migration::get_instance();
        $status = $migration->get_migration_status();

        wp_send_json_success($status);
    }

    /**
     * Get migration logs via AJAX
     */
    public function get_migration_logs()
    {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'] ?? '', 'embedpress_migration_ajax')) {
            wp_die(__('Security check failed', 'embedpress'));
        }

        // Check user capabilities
        if (!current_user_can('manage_options')) {
            wp_die(__('Insufficient permissions', 'embedpress'));
        }

        $migration = Migration::get_instance();
        $logs = $migration->get_migration_logs();

        wp_send_json_success([
            'logs' => $logs,
            'count' => count($logs)
        ]);
    }

    /**
     * Clear migration logs via AJAX
     */
    public function clear_migration_logs()
    {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'] ?? '', 'embedpress_migration_ajax')) {
            wp_die(__('Security check failed', 'embedpress'));
        }

        // Check user capabilities
        if (!current_user_can('manage_options')) {
            wp_die(__('Insufficient permissions', 'embedpress'));
        }

        $migration = Migration::get_instance();
        $result = $migration->clear_migration_logs();

        if ($result) {
            wp_send_json_success([
                'message' => __('Migration logs cleared successfully', 'embedpress')
            ]);
        } else {
            wp_send_json_error([
                'message' => __('Failed to clear migration logs', 'embedpress')
            ]);
        }
    }

    /**
     * Force migration re-run via AJAX
     */
    public function force_migration()
    {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'] ?? '', 'embedpress_migration_ajax')) {
            wp_die(__('Security check failed', 'embedpress'));
        }

        // Check user capabilities
        if (!current_user_can('manage_options')) {
            wp_die(__('Insufficient permissions', 'embedpress'));
        }

        try {
            $migration = Migration::get_instance();
            $migration->force_migration();

            wp_send_json_success([
                'message' => __('Migration re-run completed successfully', 'embedpress'),
                'status' => $migration->get_migration_status()
            ]);
        } catch (Exception $e) {
            wp_send_json_error([
                'message' => __('Migration re-run failed: ', 'embedpress') . $e->getMessage()
            ]);
        }
    }

    /**
     * Enqueue AJAX scripts for migration
     */
    public static function enqueue_migration_scripts()
    {
        if (!is_admin()) {
            return;
        }

        wp_enqueue_script(
            'embedpress-migration-ajax',
            EMBEDPRESS_URL_STATIC . '../src/Blocks/assets/migration-ajax.js',
            ['jquery'],
            EMBEDPRESS_PLUGIN_VERSION,
            true
        );

        wp_localize_script('embedpress-migration-ajax', 'embedpressMigration', [
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('embedpress_migration_ajax'),
            'strings' => [
                'confirm_force_migration' => __('Are you sure you want to force re-run the migration? This will process all content again.', 'embedpress'),
                'confirm_clear_logs' => __('Are you sure you want to clear all migration logs?', 'embedpress'),
                'migration_in_progress' => __('Migration in progress...', 'embedpress'),
                'migration_completed' => __('Migration completed successfully', 'embedpress'),
                'migration_failed' => __('Migration failed', 'embedpress')
            ]
        ]);
    }
}
