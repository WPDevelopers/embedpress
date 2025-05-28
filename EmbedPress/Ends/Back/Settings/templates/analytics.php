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
use EmbedPress\Includes\Classes\Analytics\License_Manager;

$analytics_manager = Analytics_Manager::get_instance();
$milestone_manager = new Milestone_Manager();
$milestone_data = $analytics_manager->get_milestone_data();

$notifications = $milestone_data['notifications'];

// Check license status for pro features
$has_pro = License_Manager::has_pro_license();
$feature_status = License_Manager::get_feature_status();
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

            <div class="analytics-card total-unique-viewers">
                <div class="card-icon">
                    <span class="dashicons dashicons-groups"></span>
                </div>
                <div class="card-content">
                    <h3><?php _e('Unique Viewers', 'embedpress'); ?></h3>
                    <div class="card-number" id="total-unique-viewers">-</div>
                    <div class="card-description"><?php _e('Total unique visitors', 'embedpress'); ?></div>
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

        <?php if ($has_pro): ?>
        <!-- Pro Features Section -->

        <!-- Per Embed Analytics (Pro) -->
        <div class="analytics-section pro-section">
            <div class="analytics-card">
                <div class="card-header">
                    <h3><?php _e('Per Embed Analytics', 'embedpress'); ?> <span class="pro-badge">PRO</span></h3>
                </div>
                <div class="card-content">
                    <div id="per-embed-analytics">
                        <!-- Content will be loaded via JavaScript -->
                    </div>
                </div>
            </div>
        </div>

        <!-- Geo Analytics (Pro) -->
        <div class="analytics-section pro-section">
            <div class="analytics-card">
                <div class="card-header">
                    <h3><?php _e('Viewer Locations', 'embedpress'); ?> <span class="pro-badge">PRO</span></h3>
                </div>
                <div class="card-content">
                    <div class="geo-analytics-container">
                        <div class="geo-chart-container">
                            <canvas id="geo-chart" width="400" height="300"></canvas>
                        </div>
                        <div class="geo-legend" id="geo-legend">
                            <!-- Legend will be populated via JavaScript -->
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Device Analytics (Pro) -->
        <div class="analytics-section pro-section">
            <div class="analytics-card">
                <div class="card-header">
                    <h3><?php _e('Device Analytics', 'embedpress'); ?> <span class="pro-badge">PRO</span></h3>
                </div>
                <div class="card-content">
                    <div class="device-analytics-tabs">
                        <button class="tab-button active" data-tab="devices"><?php _e('Devices', 'embedpress'); ?></button>
                        <button class="tab-button" data-tab="resolutions"><?php _e('Resolutions', 'embedpress'); ?></button>
                    </div>
                    <div class="device-chart-container">
                        <canvas id="device-chart" width="400" height="300"></canvas>
                    </div>
                    <div class="device-legend" id="device-legend">
                        <!-- Legend will be populated via JavaScript -->
                    </div>
                </div>
            </div>
        </div>

        <!-- Referral Analytics (Pro) -->
        <div class="analytics-section pro-section">
            <div class="analytics-card">
                <div class="card-header">
                    <h3><?php _e('Referral Sources', 'embedpress'); ?> <span class="pro-badge">PRO</span></h3>
                </div>
                <div class="card-content">
                    <div id="referral-analytics">
                        <!-- Content will be loaded via JavaScript -->
                    </div>
                </div>
            </div>
        </div>

        <!-- Per Embed Analytics Section -->
        <div class="analytics-card">
            <div class="card-header">
                <h3><?php _e('Per Embed Analytics', 'embedpress'); ?> <span class="pro-badge">PRO</span></h3>
            </div>
            <div class="card-content">
                <div id="per-embed-analytics">
                    <!-- Content will be loaded via JavaScript -->
                </div>
            </div>
        </div>

        <!-- Geo Analytics Section -->
        <div class="analytics-card">
            <div class="card-header">
                <h3><?php _e('Viewer Locations', 'embedpress'); ?> <span class="pro-badge">PRO</span></h3>
            </div>
            <div class="card-content">
                <div id="geo-analytics">
                    <div class="geo-analytics-container">
                        <div class="chart-container">
                            <canvas id="geo-chart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Device Analytics Section -->
        <div class="analytics-card">
            <div class="card-header">
                <h3><?php _e('Device Analytics', 'embedpress'); ?> <span class="pro-badge">PRO</span></h3>
            </div>
            <div class="card-content">
                <div id="device-analytics">
                    <div class="device-analytics-tabs">
                        <button class="tab-button active" data-tab="devices"><?php _e('Device Types', 'embedpress'); ?></button>
                        <button class="tab-button" data-tab="resolutions"><?php _e('Screen Resolutions', 'embedpress'); ?></button>
                    </div>
                    <div class="device-chart-container">
                        <canvas id="device-chart"></canvas>
                    </div>
                    <div id="device-legend" class="device-legend">
                        <!-- Legend will be populated by JavaScript -->
                    </div>
                </div>
            </div>
        </div>

        <!-- Email Reports Section -->
        <div class="analytics-card">
            <div class="card-header">
                <h3><?php _e('Email Reports', 'embedpress'); ?> <span class="pro-badge">PRO</span></h3>
            </div>
            <div class="card-content">
                <div id="email-reports">
                    <div class="email-reports-settings">
                        <div class="setting-row">
                            <label for="email-reports-enabled">
                                <input type="checkbox" id="email-reports-enabled" name="email_reports_enabled">
                                <?php _e('Enable automatic email reports', 'embedpress'); ?>
                            </label>
                        </div>
                        <div class="setting-row">
                            <label for="email-frequency"><?php _e('Report Frequency:', 'embedpress'); ?></label>
                            <select id="email-frequency" name="email_frequency">
                                <option value="weekly"><?php _e('Weekly', 'embedpress'); ?></option>
                                <option value="monthly"><?php _e('Monthly', 'embedpress'); ?></option>
                            </select>
                        </div>
                        <div class="setting-row">
                            <label for="email-recipients"><?php _e('Email Recipients:', 'embedpress'); ?></label>
                            <input type="email" id="email-recipients" name="email_recipients" placeholder="admin@example.com" multiple>
                            <small><?php _e('Separate multiple emails with commas', 'embedpress'); ?></small>
                        </div>
                        <div class="setting-row">
                            <button id="save-email-settings" class="button button-primary">
                                <?php _e('Save Email Settings', 'embedpress'); ?>
                            </button>
                            <button id="send-test-email" class="button button-secondary">
                                <?php _e('Send Test Email', 'embedpress'); ?>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <?php else: ?>

        <!-- Pro Features Upgrade Notices -->
        <div class="analytics-section pro-upgrade-section">
            <div class="pro-features-grid">

                <div class="pro-feature-card">
                    <div class="feature-icon">📊</div>
                    <h4><?php _e('Per Embed Analytics', 'embedpress'); ?></h4>
                    <p><?php _e('See detailed analytics for each individual embedded content including views, clicks, and unique viewers.', 'embedpress'); ?></p>
                    <span class="pro-badge">PRO</span>
                </div>

                <div class="pro-feature-card">
                    <div class="feature-icon">🌍</div>
                    <h4><?php _e('Geo Tracking', 'embedpress'); ?></h4>
                    <p><?php _e('Track where your viewers are coming from with detailed country and city analytics.', 'embedpress'); ?></p>
                    <span class="pro-badge">PRO</span>
                </div>

                <div class="pro-feature-card">
                    <div class="feature-icon">📱</div>
                    <h4><?php _e('Device Analytics', 'embedpress'); ?></h4>
                    <p><?php _e('Understand what devices your visitors are using - mobile, desktop, or tablet.', 'embedpress'); ?></p>
                    <span class="pro-badge">PRO</span>
                </div>

                <div class="pro-feature-card">
                    <div class="feature-icon">🔗</div>
                    <h4><?php _e('Referral Tracking', 'embedpress'); ?></h4>
                    <p><?php _e('See which pages or sites are sending traffic to your embedded content.', 'embedpress'); ?></p>
                    <span class="pro-badge">PRO</span>
                </div>

                <div class="pro-feature-card">
                    <div class="feature-icon">📧</div>
                    <h4><?php _e('Email Reports', 'embedpress'); ?></h4>
                    <p><?php _e('Automatically receive weekly or monthly analytics reports in your inbox.', 'embedpress'); ?></p>
                    <span class="pro-badge">PRO</span>
                </div>

                <div class="pro-feature-card">
                    <div class="feature-icon">📄</div>
                    <h4><?php _e('Advanced Export', 'embedpress'); ?></h4>
                    <p><?php _e('Export your analytics data in PDF format with professional reports.', 'embedpress'); ?></p>
                    <span class="pro-badge">PRO</span>
                </div>

            </div>

            <div class="upgrade-cta">
                <h3><?php _e('Unlock Advanced Analytics', 'embedpress'); ?></h3>
                <p><?php _e('Get detailed insights into your embedded content performance with EmbedPress Pro.', 'embedpress'); ?></p>
                <a href="<?php echo esc_url(License_Manager::get_upgrade_url()); ?>" target="_blank" class="button button-primary button-large">
                    <?php _e('Upgrade to Pro', 'embedpress'); ?>
                    <span class="dashicons dashicons-external"></span>
                </a>
            </div>
        </div>

        <?php endif; ?>
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
                <?php if ($has_pro): ?>
                <button id="export-pdf" class="button button-primary">
                    <span class="dashicons dashicons-pdf"></span>
                    <?php _e('Export as PDF', 'embedpress'); ?>
                </button>
                <?php else: ?>
                <button id="export-pdf" class="button button-secondary" disabled>
                    <span class="dashicons dashicons-pdf"></span>
                    <?php _e('Export as PDF', 'embedpress'); ?>
                    <span class="pro-feature">(Pro)</span>
                </button>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>

<script type="text/javascript">
// Initialize analytics dashboard when document is ready
jQuery(document).ready(function($) {
    // Check which analytics object is available (basic or enhanced)
    if (typeof EmbedPressEnhancedAnalytics !== 'undefined') {
        EmbedPressEnhancedAnalytics.init();
    } else if (typeof EmbedPressAnalyticsDashboard !== 'undefined') {
        EmbedPressAnalyticsDashboard.init();
    }
});
</script>
