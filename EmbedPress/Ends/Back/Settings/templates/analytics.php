<?php
/**
 * EmbedPress Analytics Dashboard Template
 *
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2023 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       4.2.7
 */

defined('ABSPATH') or die("No direct script access allowed.");

use EmbedPress\Includes\Classes\Analytics\Analytics_Manager;
use EmbedPress\Includes\Classes\Analytics\Milestone_Manager;

$analytics_manager = Analytics_Manager::get_instance();
$milestone_manager = new Milestone_Manager();
$milestone_data = $analytics_manager->get_milestone_data();
$notifications = $milestone_data['notifications'];
?>

<div class="wrap embedpress-analytics-dashboard">
    <h1><?php _e('EmbedPress Analytics', 'embedpress'); ?></h1>

    <!-- Milestone Notifications -->
    <?php if (!empty($notifications)): ?>
    <div class="embedpress-milestone-notifications">
        <?php foreach ($notifications as $notification): ?>
        <div class="notice notice-success is-dismissible embedpress-milestone-notice" data-timestamp="<?php echo esc_attr($notification['timestamp']); ?>">
            <p><?php echo esc_html($milestone_manager->get_milestone_message($notification['type'], $notification['milestone_value'], $notification['achieved_value'])); ?></p>
            <button type="button" class="notice-dismiss">
                <span class="screen-reader-text"><?php _e('Dismiss this notice.', 'embedpress'); ?></span>
            </button>
        </div>
        <?php endforeach; ?>
    </div>
    <?php endif; ?>

    <!-- Dashboard Header -->
    <div class="embedpress-analytics-header">
        <div class="analytics-date-filter">
            <label for="analytics-date-range"><?php _e('Date Range:', 'embedpress'); ?></label>
            <select id="analytics-date-range">
                <option value="7"><?php _e('Last 7 days', 'embedpress'); ?></option>
                <option value="30" selected><?php _e('Last 30 days', 'embedpress'); ?></option>
                <option value="90"><?php _e('Last 90 days', 'embedpress'); ?></option>
                <option value="365"><?php _e('Last year', 'embedpress'); ?></option>
            </select>
        </div>
        <div class="analytics-refresh">
            <button id="refresh-analytics" class="button button-secondary">
                <span class="dashicons dashicons-update"></span>
                <?php _e('Refresh Data', 'embedpress'); ?>
            </button>
            <button id="debug-auth" class="button button-secondary" style="margin-left: 10px;">
                <span class="dashicons dashicons-admin-tools"></span>
                <?php _e('Debug Auth', 'embedpress'); ?>
            </button>
        </div>
    </div>

    <!-- Debug Info (hidden by default) -->
    <div id="debug-info" style="display: none; margin-bottom: 20px; padding: 15px; background: #f9f9f9; border: 1px solid #ddd; border-radius: 4px;">
        <h3>Debug Information</h3>
        <pre id="debug-content"></pre>
    </div>

    <!-- Loading Indicator -->
    <div id="analytics-loading" class="embedpress-loading" style="display: none;">
        <div class="loading-spinner"></div>
        <p><?php _e('Loading analytics data...', 'embedpress'); ?></p>
    </div>

    <!-- Analytics Grid -->
    <div class="embedpress-analytics-grid" id="analytics-content">

        <!-- Overview Cards -->
        <div class="analytics-section overview-cards">
            <div class="analytics-card total-embeds">
                <div class="card-icon">
                    <span class="dashicons dashicons-embed-generic"></span>
                </div>
                <div class="card-content">
                    <h3><?php _e('Total Embeds', 'embedpress'); ?></h3>
                    <div class="card-number" id="total-embeds">-</div>
                    <div class="card-breakdown">
                        <span class="elementor-count">Elementor: <span id="elementor-count">-</span></span>
                        <span class="gutenberg-count">Gutenberg: <span id="gutenberg-count">-</span></span>
                        <span class="shortcode-count">Shortcode: <span id="shortcode-count">-</span></span>
                    </div>
                </div>
            </div>

            <div class="analytics-card total-views">
                <div class="card-icon">
                    <span class="dashicons dashicons-visibility"></span>
                </div>
                <div class="card-content">
                    <h3><?php _e('Total Views', 'embedpress'); ?></h3>
                    <div class="card-number" id="total-views">-</div>
                    <div class="card-trend" id="views-trend"></div>
                </div>
            </div>

            <div class="analytics-card total-clicks">
                <div class="card-icon">
                    <span class="dashicons dashicons-admin-links"></span>
                </div>
                <div class="card-content">
                    <h3><?php _e('Total Clicks', 'embedpress'); ?></h3>
                    <div class="card-number" id="total-clicks">-</div>
                    <div class="card-trend" id="clicks-trend"></div>
                </div>
            </div>

            <div class="analytics-card total-impressions">
                <div class="card-icon">
                    <span class="dashicons dashicons-chart-bar"></span>
                </div>
                <div class="card-content">
                    <h3><?php _e('Total Impressions', 'embedpress'); ?></h3>
                    <div class="card-number" id="total-impressions">-</div>
                    <div class="card-trend" id="impressions-trend"></div>
                </div>
            </div>
        </div>

        <!-- Views Chart -->
        <div class="analytics-section chart-section">
            <div class="analytics-card chart-card">
                <div class="card-header">
                    <h3><?php _e('Views Over Time', 'embedpress'); ?></h3>
                    <div class="chart-controls">
                        <select id="chart-type">
                            <option value="views"><?php _e('Views', 'embedpress'); ?></option>
                            <option value="clicks"><?php _e('Clicks', 'embedpress'); ?></option>
                            <option value="impressions"><?php _e('Impressions', 'embedpress'); ?></option>
                        </select>
                    </div>
                </div>
                <div class="card-content">
                    <canvas id="views-chart" width="400" height="200"></canvas>
                </div>
            </div>
        </div>

        <!-- Top Content and Browser Analytics -->
        <div class="analytics-section two-column">
            <!-- Top Performing Content -->
            <div class="analytics-card top-content">
                <div class="card-header">
                    <h3><?php _e('Top Performing Content', 'embedpress'); ?></h3>
                </div>
                <div class="card-content">
                    <div class="top-content-list" id="top-content-list">
                        <div class="loading-placeholder"><?php _e('Loading...', 'embedpress'); ?></div>
                    </div>
                </div>
            </div>

            <!-- Browser Analytics -->
            <div class="analytics-card browser-analytics">
                <div class="card-header">
                    <h3><?php _e('Browser Analytics', 'embedpress'); ?></h3>
                    <div class="browser-tabs">
                        <button class="tab-button active" data-tab="browsers"><?php _e('Browsers', 'embedpress'); ?></button>
                        <button class="tab-button" data-tab="os"><?php _e('OS', 'embedpress'); ?></button>
                        <button class="tab-button" data-tab="devices"><?php _e('Devices', 'embedpress'); ?></button>
                    </div>
                </div>
                <div class="card-content">
                    <div class="browser-chart-container">
                        <canvas id="browser-chart" width="300" height="300"></canvas>
                    </div>
                    <div class="browser-legend" id="browser-legend"></div>
                </div>
            </div>
        </div>

        <!-- Milestones Progress -->
        <div class="analytics-section milestones-section">
            <div class="analytics-card milestones-card">
                <div class="card-header">
                    <h3><?php _e('Milestone Progress', 'embedpress'); ?></h3>
                    <div class="pro-badge">
                        <span><?php _e('Upgrade to Pro for Advanced Analytics', 'embedpress'); ?></span>
                        <a href="#" class="button button-primary button-small"><?php _e('Upgrade Now', 'embedpress'); ?></a>
                    </div>
                </div>
                <div class="card-content">
                    <div class="milestones-grid" id="milestones-grid">
                        <!-- Milestone progress bars will be populated by JavaScript -->
                    </div>
                </div>
            </div>
        </div>

        <!-- Recent Achievements -->
        <div class="analytics-section achievements-section">
            <div class="analytics-card achievements-card">
                <div class="card-header">
                    <h3><?php _e('Recent Achievements', 'embedpress'); ?></h3>
                </div>
                <div class="card-content">
                    <div class="achievements-list" id="achievements-list">
                        <div class="loading-placeholder"><?php _e('Loading achievements...', 'embedpress'); ?></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Export Options -->
    <div class="embedpress-analytics-footer">
        <div class="export-options">
            <h4><?php _e('Export Analytics Data', 'embedpress'); ?></h4>
            <p><?php _e('Export your analytics data for external analysis or reporting.', 'embedpress'); ?></p>
            <div class="export-buttons">
                <button id="export-csv" class="button button-secondary">
                    <span class="dashicons dashicons-download"></span>
                    <?php _e('Export as CSV', 'embedpress'); ?>
                </button>
                <button id="export-pdf" class="button button-secondary" disabled>
                    <span class="dashicons dashicons-pdf"></span>
                    <?php _e('Export as PDF', 'embedpress'); ?>
                    <span class="pro-feature">(Pro)</span>
                </button>
            </div>
        </div>
    </div>
</div>

<!-- Chart.js Library -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<script type="text/javascript">
// Initialize analytics dashboard when document is ready
jQuery(document).ready(function($) {
    if (typeof EmbedPressAnalyticsDashboard !== 'undefined') {
        EmbedPressAnalyticsDashboard.init();
    }
});
</script>
