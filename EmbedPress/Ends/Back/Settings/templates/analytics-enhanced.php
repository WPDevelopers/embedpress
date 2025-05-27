<?php
/**
 * Enhanced Analytics Dashboard Template
 * 
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2023 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       4.2.7
 */

use EmbedPress\Includes\Classes\Analytics\License_Manager;

defined('ABSPATH') or die("No direct script access allowed.");

$feature_status = License_Manager::get_feature_status();
$has_pro = $feature_status['has_pro_license'];
?>

<div class="embedpress-analytics-dashboard enhanced">
    
    <!-- Loading Indicator -->
    <div id="analytics-loading" class="analytics-loading">
        <div class="loading-spinner"></div>
        <p><?php _e('Loading analytics data...', 'embedpress'); ?></p>
    </div>

    <!-- Main Analytics Content -->
    <div id="analytics-content" class="analytics-content" style="display: none;">
        
        <!-- Header Section -->
        <div class="analytics-header">
            <div class="header-left">
                <h1><?php _e('EmbedPress Analytics', 'embedpress'); ?></h1>
                <p class="analytics-subtitle">
                    <?php _e('Comprehensive insights into your embedded content performance', 'embedpress'); ?>
                </p>
            </div>
            <div class="header-right">
                <div class="analytics-controls">
                    <select id="analytics-date-range" class="date-range-selector">
                        <option value="7"><?php _e('Last 7 days', 'embedpress'); ?></option>
                        <option value="30" selected><?php _e('Last 30 days', 'embedpress'); ?></option>
                        <option value="90"><?php _e('Last 90 days', 'embedpress'); ?></option>
                        <?php if ($has_pro): ?>
                        <option value="365"><?php _e('Last year', 'embedpress'); ?></option>
                        <option value="0"><?php _e('All time', 'embedpress'); ?></option>
                        <?php endif; ?>
                    </select>
                    <button id="refresh-analytics" class="button button-secondary">
                        <span class="dashicons dashicons-update"></span>
                        <?php _e('Refresh', 'embedpress'); ?>
                    </button>
                    <?php if ($has_pro): ?>
                    <button id="export-pdf" class="button button-primary">
                        <span class="dashicons dashicons-pdf"></span>
                        <?php _e('Export PDF', 'embedpress'); ?>
                    </button>
                    <?php endif; ?>
                </div>
            </div>
        </div>

        <!-- Overview Cards Section -->
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

        <!-- Charts Section -->
        <div class="analytics-section charts-section">
            <div class="analytics-card chart-card">
                <div class="card-header">
                    <h3><?php _e('Views Over Time', 'embedpress'); ?></h3>
                    <div class="chart-controls">
                        <select id="chart-type">
                            <option value="views"><?php _e('Views', 'embedpress'); ?></option>
                            <option value="clicks"><?php _e('Clicks', 'embedpress'); ?></option>
                            <option value="impressions"><?php _e('Impressions', 'embedpress'); ?></option>
                            <?php if ($has_pro): ?>
                            <option value="unique_viewers"><?php _e('Unique Viewers', 'embedpress'); ?></option>
                            <?php endif; ?>
                        </select>
                    </div>
                </div>
                <div class="card-content">
                    <canvas id="views-chart" width="400" height="200"></canvas>
                </div>
            </div>
        </div>

        <!-- Pro Features Section -->
        <?php if ($has_pro): ?>
        
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

        <!-- Browser Analytics Section (Free + Enhanced for Pro) -->
        <div class="analytics-section browser-section">
            <div class="analytics-card">
                <div class="card-header">
                    <h3><?php _e('Browser Analytics', 'embedpress'); ?></h3>
                    <div class="browser-tabs">
                        <button class="tab-button active" data-tab="browsers"><?php _e('Browsers', 'embedpress'); ?></button>
                        <button class="tab-button" data-tab="os"><?php _e('Operating Systems', 'embedpress'); ?></button>
                        <button class="tab-button" data-tab="devices"><?php _e('Devices', 'embedpress'); ?></button>
                    </div>
                </div>
                <div class="card-content">
                    <div class="browser-chart-container">
                        <canvas id="browser-chart" width="400" height="300"></canvas>
                    </div>
                    <div class="browser-legend" id="browser-legend">
                        <!-- Legend will be populated via JavaScript -->
                    </div>
                </div>
            </div>
        </div>

        <!-- Top Content Section -->
        <div class="analytics-section top-content-section">
            <div class="analytics-card">
                <div class="card-header">
                    <h3><?php _e('Top Performing Content', 'embedpress'); ?></h3>
                </div>
                <div class="card-content">
                    <div id="top-content-list" class="top-content-list">
                        <!-- Content will be loaded via JavaScript -->
                    </div>
                </div>
            </div>
        </div>

    </div>
</div>
