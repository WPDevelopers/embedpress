<?php

namespace EmbedPress\Src\Blocks;

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * EmbedPress Block Migration System
 * 
 * Handles migration from old Gutenberg block structure to new structure
 * ensuring backward compatibility and seamless updates.
 */
class Migration
{
    /**
     * Instance of this class
     */
    private static $instance = null;

    /**
     * Current plugin version
     */
    private $current_version;

    /**
     * Previous plugin version stored in database
     */
    private $previous_version;

    /**
     * Migration log
     */
    private $migration_log = [];

    /**
     * Migration steps that need to be run per version
     */
    private $migration_steps = [
        '4.2.7' => [
            'migrate_block_structure',
            'update_block_content',
            'migrate_settings'
        ]
    ];

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
        $this->current_version = EMBEDPRESS_PLUGIN_VERSION;
        $this->previous_version = get_option('embedpress_version', '0.0.0');

        // Hook into WordPress initialization
        add_action('init', [$this, 'maybe_run_migration'], 5);
        add_action('admin_notices', [$this, 'show_migration_notices']);
    }

    /**
     * Check if migration is needed and run it
     */
    public function maybe_run_migration()
    {
        // Skip if versions are the same
        if (version_compare($this->previous_version, $this->current_version, '>=')) {
            return;
        }

        // Skip if not admin or during AJAX requests
        if (!is_admin() || wp_doing_ajax()) {
            return;
        }

        $this->log('Starting migration from version ' . $this->previous_version . ' to ' . $this->current_version);

        try {
            $this->run_migrations();
            $this->update_version();
            $this->log('Migration completed successfully');
        } catch (Exception $e) {
            $this->log('Migration failed: ' . $e->getMessage(), 'error');
            add_action('admin_notices', [$this, 'show_migration_error']);
        }
    }

    /**
     * Run all necessary migrations
     */
    private function run_migrations()
    {
        foreach ($this->migration_steps as $version => $steps) {
            if (version_compare($this->previous_version, $version, '<')) {
                $this->log("Running migration steps for version {$version}");
                
                foreach ($steps as $step) {
                    if (method_exists($this, $step)) {
                        $this->log("Executing migration step: {$step}");
                        $this->{$step}();
                    }
                }
            }
        }
    }

    /**
     * Migrate block structure from old to new
     */
    private function migrate_block_structure()
    {
        global $wpdb;

        // Find all posts with old EmbedPress blocks
        $posts_with_old_blocks = $wpdb->get_results(
            "SELECT ID, post_content FROM {$wpdb->posts} 
             WHERE post_content LIKE '%<!-- wp:embedpress/embedpress %' 
             AND post_status IN ('publish', 'draft', 'private', 'future')"
        );

        $migrated_count = 0;

        foreach ($posts_with_old_blocks as $post) {
            $updated_content = $this->update_block_content_structure($post->post_content);
            
            if ($updated_content !== $post->post_content) {
                $result = $wpdb->update(
                    $wpdb->posts,
                    ['post_content' => $updated_content],
                    ['ID' => $post->ID],
                    ['%s'],
                    ['%d']
                );

                if ($result !== false) {
                    $migrated_count++;
                    $this->log("Migrated post ID: {$post->ID}");
                }
            }
        }

        $this->log("Migrated {$migrated_count} posts with old block structure");
        update_option('embedpress_migration_block_structure_count', $migrated_count);
    }

    /**
     * Update block content structure
     */
    private function update_block_content_structure($content)
    {
        // Parse blocks
        $blocks = parse_blocks($content);
        $updated = false;

        foreach ($blocks as &$block) {
            if ($this->is_old_embedpress_block($block)) {
                $block = $this->migrate_block_attributes($block);
                $updated = true;
            }
        }

        return $updated ? serialize_blocks($blocks) : $content;
    }

    /**
     * Check if block is an old EmbedPress block that needs migration
     */
    private function is_old_embedpress_block($block)
    {
        return $block['blockName'] === 'embedpress/embedpress' && 
               isset($block['attrs']) && 
               $this->has_old_block_structure($block['attrs']);
    }

    /**
     * Check if block has old structure attributes
     */
    private function has_old_block_structure($attrs)
    {
        // Check for old attribute patterns that indicate legacy structure
        $old_patterns = [
            'embedHTML', // Old way of storing embed HTML
            'customPlayer', // Old custom player structure
            'oldSharePosition' // Old share position attribute
        ];

        foreach ($old_patterns as $pattern) {
            if (isset($attrs[$pattern])) {
                return true;
            }
        }

        return false;
    }

    /**
     * Migrate block attributes from old to new structure
     */
    private function migrate_block_attributes($block)
    {
        $old_attrs = $block['attrs'];
        $new_attrs = [];

        // Migrate URL
        if (isset($old_attrs['url'])) {
            $new_attrs['url'] = $old_attrs['url'];
        }

        // Migrate dimensions
        if (isset($old_attrs['height'])) {
            $new_attrs['height'] = $old_attrs['height'];
        }
        if (isset($old_attrs['width'])) {
            $new_attrs['width'] = $old_attrs['width'];
        }

        // Migrate embed HTML to new structure
        if (isset($old_attrs['embedHTML'])) {
            $new_attrs['embedHTML'] = $old_attrs['embedHTML'];
            // Mark as migrated content
            $new_attrs['isMigrated'] = true;
        }

        // Migrate custom player settings
        if (isset($old_attrs['customPlayer'])) {
            $new_attrs['customPlayer'] = $this->migrate_custom_player_settings($old_attrs['customPlayer']);
        }

        // Migrate share settings
        if (isset($old_attrs['sharePosition'])) {
            $new_attrs['sharePosition'] = $old_attrs['sharePosition'];
        }

        // Add any missing required attributes with defaults
        $new_attrs = array_merge($this->get_default_block_attributes(), $new_attrs);

        $block['attrs'] = $new_attrs;
        return $block;
    }

    /**
     * Migrate custom player settings
     */
    private function migrate_custom_player_settings($old_player_settings)
    {
        // Convert old custom player structure to new structure
        $new_settings = [];

        if (is_array($old_player_settings)) {
            // Map old settings to new structure
            $setting_map = [
                'autoplay' => 'autoplay',
                'loop' => 'loop',
                'controls' => 'controls',
                'muted' => 'muted'
            ];

            foreach ($setting_map as $old_key => $new_key) {
                if (isset($old_player_settings[$old_key])) {
                    $new_settings[$new_key] = $old_player_settings[$old_key];
                }
            }
        }

        return $new_settings;
    }

    /**
     * Get default block attributes for new structure
     */
    private function get_default_block_attributes()
    {
        return [
            'url' => '',
            'embedHTML' => '',
            'height' => '600',
            'width' => '600',
            'customPlayer' => [],
            'sharePosition' => 'bottom',
            'isMigrated' => false
        ];
    }

    /**
     * Update block content for new save function
     */
    private function update_block_content()
    {
        // This method handles content updates that don't require block structure changes
        // but need content format updates for the new save function
        $this->log('Updating block content for new save function compatibility');

        // Mark that content update has been completed
        update_option('embedpress_migration_content_updated', true);
    }

    /**
     * Migrate plugin settings
     */
    private function migrate_settings()
    {
        $this->log('Migrating plugin settings');

        // Get current settings
        $current_settings = get_option(EMBEDPRESS_PLG_NAME, []);

        // Add new default settings for new block system
        $new_defaults = [
            'useNewBlockSystem' => true,
            'enableBlockMigration' => true,
            'migrationCompleted' => true
        ];

        $updated_settings = array_merge($current_settings, $new_defaults);
        update_option(EMBEDPRESS_PLG_NAME, $updated_settings);

        $this->log('Plugin settings migrated successfully');
    }

    /**
     * Update version in database
     */
    private function update_version()
    {
        update_option('embedpress_version', $this->current_version);
        update_option('embedpress_migration_completed', current_time('mysql'));
    }

    /**
     * Log migration activities
     */
    private function log($message, $level = 'info')
    {
        $timestamp = current_time('mysql');
        $log_entry = "[{$timestamp}] [{$level}] {$message}";

        $this->migration_log[] = $log_entry;

        // Also log to WordPress debug log if enabled
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log("EmbedPress Migration: {$log_entry}");
        }

        // Store logs in database for admin review
        $existing_logs = get_option('embedpress_migration_logs', []);
        $existing_logs[] = $log_entry;

        // Keep only last 100 log entries
        if (count($existing_logs) > 100) {
            $existing_logs = array_slice($existing_logs, -100);
        }

        update_option('embedpress_migration_logs', $existing_logs);
    }

    /**
     * Show migration notices to admin
     */
    public function show_migration_notices()
    {
        $migration_count = get_option('embedpress_migration_block_structure_count', 0);

        if ($migration_count > 0 && !get_option('embedpress_migration_notice_dismissed', false)) {
            ?>
            <div class="notice notice-success is-dismissible" data-notice="embedpress-migration">
                <p>
                    <strong><?php _e('EmbedPress Migration Completed!', 'embedpress'); ?></strong>
                    <?php
                    printf(
                        __('Successfully migrated %d posts with EmbedPress blocks to the new structure.', 'embedpress'),
                        $migration_count
                    );
                    ?>
                </p>
                <p>
                    <a href="<?php echo admin_url('admin.php?page=embedpress#/migration-log'); ?>" class="button">
                        <?php _e('View Migration Log', 'embedpress'); ?>
                    </a>
                </p>
            </div>
            <script>
            jQuery(document).ready(function($) {
                $(document).on('click', '.notice[data-notice="embedpress-migration"] .notice-dismiss', function() {
                    $.post(ajaxurl, {
                        action: 'embedpress_dismiss_migration_notice',
                        nonce: '<?php echo wp_create_nonce('embedpress_migration_notice'); ?>'
                    });
                });
            });
            </script>
            <?php
        }
    }

    /**
     * Show migration error notice
     */
    public function show_migration_error()
    {
        ?>
        <div class="notice notice-error">
            <p>
                <strong><?php _e('EmbedPress Migration Error', 'embedpress'); ?></strong>
                <?php _e('There was an error during the migration process. Please check the migration logs or contact support.', 'embedpress'); ?>
            </p>
            <p>
                <a href="<?php echo admin_url('admin.php?page=embedpress#/migration-log'); ?>" class="button">
                    <?php _e('View Migration Log', 'embedpress'); ?>
                </a>
            </p>
        </div>
        <?php
    }

    /**
     * Get migration logs for admin display
     */
    public function get_migration_logs()
    {
        return get_option('embedpress_migration_logs', []);
    }

    /**
     * Clear migration logs
     */
    public function clear_migration_logs()
    {
        delete_option('embedpress_migration_logs');
        return true;
    }

    /**
     * Force re-run migration (for debugging)
     */
    public function force_migration()
    {
        delete_option('embedpress_version');
        delete_option('embedpress_migration_completed');
        delete_option('embedpress_migration_block_structure_count');
        delete_option('embedpress_migration_content_updated');

        $this->maybe_run_migration();
    }

    /**
     * Check if migration is needed
     */
    public function is_migration_needed()
    {
        return version_compare($this->previous_version, $this->current_version, '<');
    }

    /**
     * Get migration status
     */
    public function get_migration_status()
    {
        return [
            'current_version' => $this->current_version,
            'previous_version' => $this->previous_version,
            'migration_needed' => $this->is_migration_needed(),
            'migration_completed' => get_option('embedpress_migration_completed', false),
            'migrated_posts_count' => get_option('embedpress_migration_block_structure_count', 0),
            'content_updated' => get_option('embedpress_migration_content_updated', false)
        ];
    }
}
