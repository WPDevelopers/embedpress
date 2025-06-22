<?php

namespace EmbedPress\Src\Blocks;

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * EmbedPress Migration Admin Page
 * 
 * Provides admin interface for migration status and controls
 */
class MigrationAdminPage
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
        add_action('admin_menu', [$this, 'add_migration_submenu']);
        add_action('admin_init', [$this, 'handle_migration_actions']);
    }

    /**
     * Add migration submenu to EmbedPress admin menu
     */
    public function add_migration_submenu()
    {
        // Only show if migration is needed or has been completed
        $migration = Migration::get_instance();
        $status = $migration->get_migration_status();
        
        if ($status['migration_needed'] || $status['migration_completed']) {
            add_submenu_page(
                'embedpress',
                __('Migration Status', 'embedpress'),
                __('Migration', 'embedpress'),
                'manage_options',
                'embedpress-migration',
                [$this, 'render_migration_page']
            );
        }
    }

    /**
     * Handle migration actions
     */
    public function handle_migration_actions()
    {
        if (!isset($_GET['page']) || $_GET['page'] !== 'embedpress-migration') {
            return;
        }

        if (!current_user_can('manage_options')) {
            return;
        }

        $action = $_GET['action'] ?? '';
        $nonce = $_GET['_wpnonce'] ?? '';

        switch ($action) {
            case 'force_migration':
                if (wp_verify_nonce($nonce, 'embedpress_force_migration')) {
                    $this->handle_force_migration();
                }
                break;
                
            case 'clear_logs':
                if (wp_verify_nonce($nonce, 'embedpress_clear_logs')) {
                    $this->handle_clear_logs();
                }
                break;
        }
    }

    /**
     * Handle force migration action
     */
    private function handle_force_migration()
    {
        try {
            $migration = Migration::get_instance();
            $migration->force_migration();
            
            add_action('admin_notices', function() {
                echo '<div class="notice notice-success"><p>' . __('Migration completed successfully!', 'embedpress') . '</p></div>';
            });
        } catch (Exception $e) {
            add_action('admin_notices', function() use ($e) {
                echo '<div class="notice notice-error"><p>' . __('Migration failed: ', 'embedpress') . esc_html($e->getMessage()) . '</p></div>';
            });
        }
    }

    /**
     * Handle clear logs action
     */
    private function handle_clear_logs()
    {
        $migration = Migration::get_instance();
        $result = $migration->clear_migration_logs();
        
        if ($result) {
            add_action('admin_notices', function() {
                echo '<div class="notice notice-success"><p>' . __('Migration logs cleared successfully!', 'embedpress') . '</p></div>';
            });
        } else {
            add_action('admin_notices', function() {
                echo '<div class="notice notice-error"><p>' . __('Failed to clear migration logs.', 'embedpress') . '</p></div>';
            });
        }
    }

    /**
     * Render migration page
     */
    public function render_migration_page()
    {
        $migration = Migration::get_instance();
        $status = $migration->get_migration_status();
        $logs = $migration->get_migration_logs();
        
        ?>
        <div class="wrap">
            <h1><?php _e('EmbedPress Migration Status', 'embedpress'); ?></h1>
            
            <div class="embedpress-migration-status">
                <?php $this->render_migration_status($status); ?>
            </div>
            
            <div class="embedpress-migration-actions">
                <?php $this->render_migration_actions($status); ?>
            </div>
            
            <div class="embedpress-migration-logs">
                <?php $this->render_migration_logs($logs); ?>
            </div>
        </div>
        
        <style>
        .embedpress-migration-status {
            background: #fff;
            border: 1px solid #ccd0d4;
            padding: 20px;
            margin: 20px 0;
        }
        .embedpress-migration-actions {
            background: #fff;
            border: 1px solid #ccd0d4;
            padding: 20px;
            margin: 20px 0;
        }
        .embedpress-migration-logs {
            background: #fff;
            border: 1px solid #ccd0d4;
            padding: 20px;
            margin: 20px 0;
        }
        .migration-status-table {
            width: 100%;
            border-collapse: collapse;
        }
        .migration-status-table td {
            padding: 10px;
            border-bottom: 1px solid #eee;
        }
        .migration-status-table td:first-child {
            font-weight: bold;
            width: 200px;
        }
        .migration-logs-container {
            max-height: 400px;
            overflow-y: auto;
            background: #f9f9f9;
            padding: 15px;
            border: 1px solid #ddd;
            font-family: monospace;
            font-size: 12px;
        }
        .log-entry {
            margin-bottom: 5px;
            padding: 2px 0;
        }
        .log-entry.error {
            color: #d63638;
        }
        .log-entry.warning {
            color: #dba617;
        }
        </style>
        <?php
    }

    /**
     * Render migration status section
     */
    private function render_migration_status($status)
    {
        ?>
        <h2><?php _e('Migration Status', 'embedpress'); ?></h2>
        <table class="migration-status-table">
            <tr>
                <td><?php _e('Current Version:', 'embedpress'); ?></td>
                <td><?php echo esc_html($status['current_version']); ?></td>
            </tr>
            <tr>
                <td><?php _e('Previous Version:', 'embedpress'); ?></td>
                <td><?php echo esc_html($status['previous_version']); ?></td>
            </tr>
            <tr>
                <td><?php _e('Migration Needed:', 'embedpress'); ?></td>
                <td>
                    <?php if ($status['migration_needed']): ?>
                        <span style="color: #d63638;"><?php _e('Yes', 'embedpress'); ?></span>
                    <?php else: ?>
                        <span style="color: #00a32a;"><?php _e('No', 'embedpress'); ?></span>
                    <?php endif; ?>
                </td>
            </tr>
            <tr>
                <td><?php _e('Migration Completed:', 'embedpress'); ?></td>
                <td>
                    <?php if ($status['migration_completed']): ?>
                        <span style="color: #00a32a;"><?php echo esc_html($status['migration_completed']); ?></span>
                    <?php else: ?>
                        <span style="color: #d63638;"><?php _e('Not completed', 'embedpress'); ?></span>
                    <?php endif; ?>
                </td>
            </tr>
            <tr>
                <td><?php _e('Migrated Posts:', 'embedpress'); ?></td>
                <td><?php echo intval($status['migrated_posts_count']); ?></td>
            </tr>
            <tr>
                <td><?php _e('Content Updated:', 'embedpress'); ?></td>
                <td>
                    <?php if ($status['content_updated']): ?>
                        <span style="color: #00a32a;"><?php _e('Yes', 'embedpress'); ?></span>
                    <?php else: ?>
                        <span style="color: #d63638;"><?php _e('No', 'embedpress'); ?></span>
                    <?php endif; ?>
                </td>
            </tr>
        </table>
        <?php
    }

    /**
     * Render migration actions section
     */
    private function render_migration_actions($status)
    {
        ?>
        <h2><?php _e('Migration Actions', 'embedpress'); ?></h2>
        <p><?php _e('Use these actions to manage the migration process.', 'embedpress'); ?></p>
        
        <p>
            <a href="<?php echo wp_nonce_url(admin_url('admin.php?page=embedpress-migration&action=force_migration'), 'embedpress_force_migration'); ?>" 
               class="button button-secondary"
               onclick="return confirm('<?php _e('Are you sure you want to force re-run the migration? This will process all content again.', 'embedpress'); ?>');">
                <?php _e('Force Re-run Migration', 'embedpress'); ?>
            </a>
            
            <button class="button button-secondary embedpress-refresh-status" style="margin-left: 10px;">
                <?php _e('Refresh Status', 'embedpress'); ?>
            </button>
        </p>
        
        <p>
            <small><?php _e('Note: Force re-running migration will process all posts again. This is usually not necessary unless you are experiencing issues.', 'embedpress'); ?></small>
        </p>
        <?php
    }

    /**
     * Render migration logs section
     */
    private function render_migration_logs($logs)
    {
        ?>
        <h2><?php _e('Migration Logs', 'embedpress'); ?></h2>
        
        <p>
            <button class="button button-secondary embedpress-view-logs">
                <?php _e('View All Logs', 'embedpress'); ?>
            </button>
            
            <a href="<?php echo wp_nonce_url(admin_url('admin.php?page=embedpress-migration&action=clear_logs'), 'embedpress_clear_logs'); ?>" 
               class="button button-secondary"
               style="margin-left: 10px;"
               onclick="return confirm('<?php _e('Are you sure you want to clear all migration logs?', 'embedpress'); ?>');">
                <?php _e('Clear Logs', 'embedpress'); ?>
            </a>
        </p>
        
        <?php if (empty($logs)): ?>
            <p><?php _e('No migration logs found.', 'embedpress'); ?></p>
        <?php else: ?>
            <p><?php printf(__('Showing last %d log entries:', 'embedpress'), min(10, count($logs))); ?></p>
            <div class="migration-logs-container">
                <?php 
                $recent_logs = array_slice($logs, -10);
                foreach ($recent_logs as $log): 
                    $class = '';
                    if (strpos($log, '[error]') !== false) {
                        $class = 'error';
                    } elseif (strpos($log, '[warning]') !== false) {
                        $class = 'warning';
                    }
                ?>
                    <div class="log-entry <?php echo $class; ?>"><?php echo esc_html($log); ?></div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
        <?php
    }
}
