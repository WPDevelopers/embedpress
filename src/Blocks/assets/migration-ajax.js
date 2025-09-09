/**
 * EmbedPress Migration AJAX Handler
 * 
 * Handles client-side migration functionality
 */

(function($) {
    'use strict';

    const EmbedPressMigration = {
        
        /**
         * Initialize migration functionality
         */
        init: function() {
            this.bindEvents();
            this.loadMigrationStatus();
        },

        /**
         * Bind event handlers
         */
        bindEvents: function() {
            // Force migration button
            $(document).on('click', '.embedpress-force-migration', this.forceMigration.bind(this));
            
            // Clear logs button
            $(document).on('click', '.embedpress-clear-logs', this.clearLogs.bind(this));
            
            // Refresh status button
            $(document).on('click', '.embedpress-refresh-status', this.loadMigrationStatus.bind(this));
            
            // View logs button
            $(document).on('click', '.embedpress-view-logs', this.viewLogs.bind(this));
        },

        /**
         * Load migration status
         */
        loadMigrationStatus: function() {
            const self = this;
            
            $.ajax({
                url: embedpressMigration.ajaxurl,
                type: 'POST',
                data: {
                    action: 'embedpress_get_migration_status',
                    nonce: embedpressMigration.nonce
                },
                success: function(response) {
                    if (response.success) {
                        self.displayMigrationStatus(response.data);
                    }
                },
                error: function() {
                    console.error('Failed to load migration status');
                }
            });
        },

        /**
         * Display migration status
         */
        displayMigrationStatus: function(status) {
            const statusContainer = $('.embedpress-migration-status');
            
            if (statusContainer.length === 0) {
                return;
            }

            let html = '<div class="embedpress-migration-info">';
            html += '<h3>' + 'Migration Status' + '</h3>';
            html += '<table class="widefat">';
            html += '<tr><td><strong>Current Version:</strong></td><td>' + status.current_version + '</td></tr>';
            html += '<tr><td><strong>Previous Version:</strong></td><td>' + status.previous_version + '</td></tr>';
            html += '<tr><td><strong>Migration Needed:</strong></td><td>' + (status.migration_needed ? 'Yes' : 'No') + '</td></tr>';
            html += '<tr><td><strong>Migration Completed:</strong></td><td>' + (status.migration_completed ? status.migration_completed : 'Not completed') + '</td></tr>';
            html += '<tr><td><strong>Migrated Posts:</strong></td><td>' + status.migrated_posts_count + '</td></tr>';
            html += '<tr><td><strong>Content Updated:</strong></td><td>' + (status.content_updated ? 'Yes' : 'No') + '</td></tr>';
            html += '</table>';
            html += '</div>';

            statusContainer.html(html);
        },

        /**
         * Force migration re-run
         */
        forceMigration: function(e) {
            e.preventDefault();
            
            if (!confirm(embedpressMigration.strings.confirm_force_migration)) {
                return;
            }

            const button = $(e.target);
            const originalText = button.text();
            
            button.text(embedpressMigration.strings.migration_in_progress).prop('disabled', true);

            $.ajax({
                url: embedpressMigration.ajaxurl,
                type: 'POST',
                data: {
                    action: 'embedpress_force_migration',
                    nonce: embedpressMigration.nonce
                },
                success: function(response) {
                    if (response.success) {
                        alert(embedpressMigration.strings.migration_completed);
                        location.reload();
                    } else {
                        alert(embedpressMigration.strings.migration_failed + ': ' + response.data.message);
                    }
                },
                error: function() {
                    alert(embedpressMigration.strings.migration_failed);
                },
                complete: function() {
                    button.text(originalText).prop('disabled', false);
                }
            });
        },

        /**
         * Clear migration logs
         */
        clearLogs: function(e) {
            e.preventDefault();
            
            if (!confirm(embedpressMigration.strings.confirm_clear_logs)) {
                return;
            }

            const button = $(e.target);
            const originalText = button.text();
            
            button.text('Clearing...').prop('disabled', true);

            $.ajax({
                url: embedpressMigration.ajaxurl,
                type: 'POST',
                data: {
                    action: 'embedpress_clear_migration_logs',
                    nonce: embedpressMigration.nonce
                },
                success: function(response) {
                    if (response.success) {
                        alert('Logs cleared successfully');
                        $('.embedpress-migration-logs').empty();
                    } else {
                        alert('Failed to clear logs: ' + response.data.message);
                    }
                },
                error: function() {
                    alert('Failed to clear logs');
                },
                complete: function() {
                    button.text(originalText).prop('disabled', false);
                }
            });
        },

        /**
         * View migration logs
         */
        viewLogs: function(e) {
            e.preventDefault();
            
            const self = this;
            
            $.ajax({
                url: embedpressMigration.ajaxurl,
                type: 'POST',
                data: {
                    action: 'embedpress_get_migration_logs',
                    nonce: embedpressMigration.nonce
                },
                success: function(response) {
                    if (response.success) {
                        self.displayLogs(response.data.logs);
                    }
                },
                error: function() {
                    alert('Failed to load logs');
                }
            });
        },

        /**
         * Display migration logs
         */
        displayLogs: function(logs) {
            const logsContainer = $('.embedpress-migration-logs');
            
            if (logsContainer.length === 0) {
                // Create logs container if it doesn't exist
                $('body').append('<div class="embedpress-migration-logs-modal"><div class="embedpress-migration-logs"></div></div>');
            }

            let html = '<div class="embedpress-logs-content">';
            html += '<h3>Migration Logs <button class="button embedpress-close-logs" style="float: right;">Close</button></h3>';
            
            if (logs.length === 0) {
                html += '<p>No migration logs found.</p>';
            } else {
                html += '<div class="embedpress-logs-list" style="max-height: 400px; overflow-y: auto; background: #f9f9f9; padding: 10px; border: 1px solid #ddd;">';
                logs.forEach(function(log) {
                    html += '<div class="log-entry" style="margin-bottom: 5px; font-family: monospace; font-size: 12px;">' + log + '</div>';
                });
                html += '</div>';
                
                html += '<p style="margin-top: 10px;">';
                html += '<button class="button embedpress-clear-logs">Clear All Logs</button>';
                html += '</p>';
            }
            
            html += '</div>';

            $('.embedpress-migration-logs').html(html);
            $('.embedpress-migration-logs-modal').show();

            // Bind close button
            $(document).on('click', '.embedpress-close-logs', function() {
                $('.embedpress-migration-logs-modal').hide();
            });
        }
    };

    // Initialize when document is ready
    $(document).ready(function() {
        EmbedPressMigration.init();
    });

    // Add some basic CSS for the logs modal
    $('<style>')
        .prop('type', 'text/css')
        .html(`
            .embedpress-migration-logs-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 999999;
            }
            .embedpress-migration-logs {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 20px;
                border-radius: 5px;
                max-width: 80%;
                max-height: 80%;
                overflow: auto;
            }
            .embedpress-migration-info table {
                margin-top: 10px;
            }
            .embedpress-migration-info table td {
                padding: 8px;
                border-bottom: 1px solid #eee;
            }
        `)
        .appendTo('head');

})(jQuery);
