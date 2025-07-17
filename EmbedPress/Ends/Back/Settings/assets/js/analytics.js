/**
 * EmbedPress Analytics Dashboard JavaScript
 *
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2023 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       4.2.7
 */

(function($) {
    'use strict';

    const EmbedPressAnalyticsDashboard = {

        // Configuration
        config: {
            restUrl: '',
            nonce: '',
            currentDateRange: 30,
            charts: {},
            featureStatus: {},
            colors: {
                primary: '#3498db',
                success: '#2ecc71',
                warning: '#f39c12',
                danger: '#e74c3c',
                info: '#9b59b6',
                purple: '#8e44ad',
                orange: '#e67e22',
                teal: '#1abc9c'
            }
        },

        /**
         * Initialize the dashboard
         */
        init: function() {
            if (typeof embedpress_analytics_admin === 'undefined') {
                return;
            }

            this.config.restUrl = embedpress_analytics_admin.rest_url;
            this.config.nonce = embedpress_analytics_admin.nonce;

            this.setupEventListeners();
            this.loadFeatureStatus();
        },

        /**
         * Setup event listeners
         */
        setupEventListeners: function() {
            // Date range filter
            $('#analytics-date-range').on('change', this.handleDateRangeChange.bind(this));

            // Refresh button
            $('#refresh-analytics').on('click', this.refreshData.bind(this));

            // Debug button
            $('#debug-auth').on('click', this.debugAuth.bind(this));

            // Chart type selector
            $('#chart-type').on('change', this.handleChartTypeChange.bind(this));

            // Browser analytics tabs
            $('.browser-tabs .tab-button').on('click', this.handleBrowserTabChange.bind(this));

            // Milestone notifications dismiss
            $('.embedpress-milestone-notice .notice-dismiss').on('click', this.dismissMilestoneNotification.bind(this));

            // Export buttons
            $('#export-csv').on('click', this.exportCSV.bind(this));
            $('#export-pdf').on('click', this.exportPDF.bind(this));

            // Device analytics tabs (pro)
            $('.device-analytics-tabs .tab-button').on('click', this.handleDeviceTabChange.bind(this));
        },

        /**
         * Load feature status and then analytics data
         */
        loadFeatureStatus: function() {
            this.showLoading();

            $.ajax({
                url: this.config.restUrl + 'features',
                method: 'GET'
            })
            .done((response) => {
                this.config.featureStatus = response;
                this.loadAnalyticsData();
            })
            .fail(() => {
                // Fallback to basic analytics if feature status fails
                this.config.featureStatus = { has_pro_license: false, features: {} };
                this.loadAnalyticsData();
            });
        },

        /**
         * Load analytics data based on available features
         */
        loadAnalyticsData: function() {
            const promises = [
                this.fetchAnalyticsData(),
                this.fetchContentAnalytics(),
                this.fetchViewsAnalytics(),
                this.fetchBrowserAnalytics(),
                this.fetchMilestoneData()
            ];

            // Add pro feature requests if available
            if (this.config.featureStatus.features?.unique_viewers_per_embed) {
                promises.push(this.fetchUniqueViewersPerEmbed());
            }

            if (this.config.featureStatus.features?.geo_tracking) {
                promises.push(this.fetchGeoAnalytics());
            }

            if (this.config.featureStatus.features?.device_analytics) {
                promises.push(this.fetchDeviceAnalytics());
            }

            if (this.config.featureStatus.features?.referral_tracking) {
                promises.push(this.fetchReferralAnalytics());
            }

            Promise.all(promises)
                .then(this.renderDashboard.bind(this))
                .catch(this.handleError.bind(this))
                .finally(this.hideLoading.bind(this));
        },

        /**
         * Fetch analytics data
         */
        fetchAnalyticsData: function() {
            return $.ajax({
                url: this.config.restUrl + 'data',
                method: 'GET',
                data: { date_range: this.config.currentDateRange }
            });
        },

        /**
         * Fetch content analytics
         */
        fetchContentAnalytics: function() {
            return $.ajax({
                url: this.config.restUrl + 'content',
                method: 'GET'
            });
        },

        /**
         * Fetch views analytics
         */
        fetchViewsAnalytics: function() {
            return $.ajax({
                url: this.config.restUrl + 'views',
                method: 'GET',
                data: { date_range: this.config.currentDateRange }
            });
        },

        /**
         * Fetch browser analytics
         */
        fetchBrowserAnalytics: function() {
            return $.ajax({
                url: this.config.restUrl + 'browser',
                method: 'GET',
                data: { date_range: this.config.currentDateRange }
            });
        },

        /**
         * Fetch milestone data
         */
        fetchMilestoneData: function() {
            return $.ajax({
                url: this.config.restUrl + 'milestones',
                method: 'GET'
            });
        },

        /**
         * Fetch unique viewers per embed (Pro)
         */
        fetchUniqueViewersPerEmbed: function() {
            return $.ajax({
                url: this.config.restUrl + 'unique-viewers-per-embed',
                method: 'GET',
                data: { date_range: this.config.currentDateRange }
            });
        },

        /**
         * Fetch geo analytics (Pro)
         */
        fetchGeoAnalytics: function() {
            return $.ajax({
                url: this.config.restUrl + 'geo',
                method: 'GET',
                data: { date_range: this.config.currentDateRange }
            });
        },

        /**
         * Fetch device analytics (Pro)
         */
        fetchDeviceAnalytics: function() {
            return $.ajax({
                url: this.config.restUrl + 'device',
                method: 'GET',
                data: { date_range: this.config.currentDateRange }
            });
        },

        /**
         * Fetch referral analytics (Pro)
         */
        fetchReferralAnalytics: function() {
            return $.ajax({
                url: this.config.restUrl + 'referral',
                method: 'GET',
                data: { date_range: this.config.currentDateRange }
            });
        },

        /**
         * Render dashboard with data
         */
        renderDashboard: function(responses) {
            const [analyticsData, contentData, viewsData, browserData, milestoneData, ...proData] = responses;

            // Render basic components
            this.renderOverviewCards(analyticsData, contentData, viewsData);
            this.renderViewsChart(viewsData.daily_views);
            this.renderTopContent(viewsData.top_content);
            this.renderBrowserAnalytics(browserData);
            this.renderMilestones(milestoneData);
            this.renderAchievements(milestoneData.recent_achievements);

            // Render pro components if available
            let proIndex = 0;

            if (this.config.featureStatus.features?.unique_viewers_per_embed && proData[proIndex]) {
                this.renderPerEmbedAnalytics(proData[proIndex]);
                proIndex++;
            }

            if (this.config.featureStatus.features?.geo_tracking && proData[proIndex]) {
                this.renderGeoAnalytics(proData[proIndex]);
                proIndex++;
            }

            if (this.config.featureStatus.features?.device_analytics && proData[proIndex]) {
                this.renderDeviceAnalytics(proData[proIndex]);
                proIndex++;
            }

            if (this.config.featureStatus.features?.referral_tracking && proData[proIndex]) {
                this.renderReferralAnalytics(proData[proIndex]);
                proIndex++;
            }
        },

        /**
         * Render overview cards
         */
        renderOverviewCards: function(analyticsData, contentData, viewsData) {
            // Total embeds
            $('#total-embeds').text(this.formatNumber(contentData.total));
            $('#elementor-count').text(this.formatNumber(contentData.elementor));
            $('#gutenberg-count').text(this.formatNumber(contentData.gutenberg));
            $('#shortcode-count').text(this.formatNumber(contentData.shortcode));

            // Total views
            $('#total-views').text(this.formatNumber(viewsData.total_views));

            // Calculate totals for clicks and impressions from top content
            let totalClicks = 0, totalImpressions = 0;
            if (viewsData.top_content) {
                viewsData.top_content.forEach(item => {
                    totalClicks += parseInt(item.total_clicks) || 0;
                    totalImpressions += parseInt(item.total_impressions) || 0;
                });
            }

            $('#total-clicks').text(this.formatNumber(totalClicks));
            $('#total-impressions').text(this.formatNumber(totalImpressions));

            // Unique viewers (new)
            if (analyticsData.total_unique_viewers !== undefined) {
                $('#total-unique-viewers').text(this.formatNumber(analyticsData.total_unique_viewers));
            }
        },

        /**
         * Render views chart
         */
        renderViewsChart: function(dailyViews) {
            const ctx = document.getElementById('views-chart').getContext('2d');

            // Destroy existing chart if it exists
            if (this.config.charts.viewsChart) {
                this.config.charts.viewsChart.destroy();
            }

            const labels = dailyViews.map(item => this.formatDate(item.date));
            const data = dailyViews.map(item => parseInt(item.views));

            this.config.charts.viewsChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Views',
                        data: data,
                        borderColor: this.config.colors.primary,
                        backgroundColor: this.config.colors.primary + '20',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return EmbedPressAnalyticsDashboard.formatNumber(value);
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        },

        /**
         * Render top content
         */
        renderTopContent: function(topContent) {
            const container = $('#top-content-list');
            container.empty();

            if (!topContent || topContent.length === 0) {
                container.html('<div class="no-data">No content data available</div>');
                return;
            }

            topContent.forEach((item, index) => {
                const contentItem = $(`
                    <div class="top-content-item">
                        <div class="content-rank">${index + 1}</div>
                        <div class="content-info">
                            <div class="content-title">${this.escapeHtml(item.title || 'Untitled')}</div>
                            <div class="content-type">${this.escapeHtml(item.embed_type)}</div>
                        </div>
                        <div class="content-stats">
                            <span class="stat-views">${this.formatNumber(item.total_views)} views</span>
                            <span class="stat-clicks">${this.formatNumber(item.total_clicks)} clicks</span>
                        </div>
                    </div>
                `);
                container.append(contentItem);
            });
        },

        /**
         * Render browser analytics
         */
        renderBrowserAnalytics: function(browserData) {
            this.currentBrowserData = browserData;
            this.renderBrowserChart('browsers', browserData.browsers);
        },

        /**
         * Render browser chart
         */
        renderBrowserChart: function(type, data) {
            const ctx = document.getElementById('browser-chart').getContext('2d');

            // Destroy existing chart if it exists
            if (this.config.charts.browserChart) {
                this.config.charts.browserChart.destroy();
            }

            if (!data || data.length === 0) {
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                ctx.fillText('No data available', ctx.canvas.width / 2, ctx.canvas.height / 2);
                return;
            }

            const labels = data.map(item => item.browser_name || item.operating_system || item.device_type);
            const values = data.map(item => parseInt(item.count));
            const colors = this.generateColors(data.length);

            this.config.charts.browserChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: values,
                        backgroundColor: colors,
                        borderWidth: 2,
                        borderColor: '#fff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });

            this.renderBrowserLegend(labels, values, colors);
        },

        /**
         * Render browser legend
         */
        renderBrowserLegend: function(labels, values, colors) {
            const container = $('#browser-legend');
            container.empty();

            labels.forEach((label, index) => {
                const percentage = ((values[index] / values.reduce((a, b) => a + b, 0)) * 100).toFixed(1);
                const legendItem = $(`
                    <div class="legend-item">
                        <div class="legend-color" style="background-color: ${colors[index]}"></div>
                        <div class="legend-label">${this.escapeHtml(label)}</div>
                        <div class="legend-value">${percentage}%</div>
                    </div>
                `);
                container.append(legendItem);
            });
        },

        /**
         * Render milestones
         */
        renderMilestones: function(milestoneData) {
            const container = $('#milestones-grid');
            container.empty();

            if (!milestoneData.progress) {
                container.html('<div class="no-data">No milestone data available</div>');
                return;
            }

            Object.keys(milestoneData.progress).forEach(type => {
                const progress = milestoneData.progress[type];
                const progressBar = $(`
                    <div class="milestone-item">
                        <div class="milestone-header">
                            <span class="milestone-title">${this.getMilestoneTitle(type)}</span>
                            <span class="milestone-progress">${progress.current} / ${progress.next_milestone}</span>
                        </div>
                        <div class="milestone-bar">
                            <div class="milestone-fill" style="width: ${Math.min(progress.progress_percentage, 100)}%"></div>
                        </div>
                        <div class="milestone-percentage">${progress.progress_percentage.toFixed(1)}%</div>
                    </div>
                `);
                container.append(progressBar);
            });
        },

        /**
         * Render achievements
         */
        renderAchievements: function(achievements) {
            const container = $('#achievements-list');
            container.empty();

            if (!achievements || achievements.length === 0) {
                container.html('<div class="no-data">No recent achievements</div>');
                return;
            }

            achievements.forEach(achievement => {
                const achievementItem = $(`
                    <div class="achievement-item">
                        <div class="achievement-icon">🏆</div>
                        <div class="achievement-content">
                            <div class="achievement-title">${this.getMilestoneTitle(achievement.milestone_type)}</div>
                            <div class="achievement-description">
                                Reached ${this.formatNumber(achievement.milestone_value)} ${achievement.milestone_type.replace('_', ' ')}
                            </div>
                            <div class="achievement-date">${this.formatDate(achievement.achieved_at)}</div>
                        </div>
                    </div>
                `);
                container.append(achievementItem);
            });
        },

        /**
         * Handle date range change
         */
        handleDateRangeChange: function(event) {
            this.config.currentDateRange = parseInt($(event.target).val());
            this.loadAnalyticsData();
        },

        /**
         * Handle chart type change
         */
        handleChartTypeChange: function(event) {
            const chartType = $(event.target).val();
            // This would require additional data fetching for different chart types
            // For now, we'll just update the chart label
            if (this.config.charts.viewsChart) {
                this.config.charts.viewsChart.data.datasets[0].label = chartType.charAt(0).toUpperCase() + chartType.slice(1);
                this.config.charts.viewsChart.update();
            }
        },

        /**
         * Handle browser tab change
         */
        handleBrowserTabChange: function(event) {
            const tab = $(event.target).data('tab');
            $('.browser-tabs .tab-button').removeClass('active');
            $(event.target).addClass('active');

            let data;
            switch (tab) {
                case 'browsers':
                    data = this.currentBrowserData.browsers;
                    break;
                case 'os':
                    data = this.currentBrowserData.operating_systems;
                    break;
                case 'devices':
                    data = this.currentBrowserData.devices;
                    break;
            }

            this.renderBrowserChart(tab, data);
        },

        /**
         * Dismiss milestone notification
         */
        dismissMilestoneNotification: function(event) {
            const notice = $(event.target).closest('.embedpress-milestone-notice');
            const timestamp = notice.data('timestamp');

            $.ajax({
                url: this.config.restUrl + 'milestones/read',
                method: 'POST',
                data: { timestamp: timestamp },
                success: function() {
                    notice.fadeOut();
                }
            });
        },

        /**
         * Refresh data
         */
        refreshData: function() {
            this.loadAnalyticsData();
        },

        /**
         * Export CSV
         */
        exportCSV: function() {
            // This would generate and download a CSV file
            alert('CSV export functionality would be implemented here');
        },

        /**
         * Export PDF (Pro feature)
         */
        exportPDF: function() {
            alert('PDF export is available in EmbedPress Pro');
        },

        /**
         * Show loading indicator
         */
        showLoading: function() {
            $('#analytics-loading').show();
            $('#analytics-content').hide();
        },

        /**
         * Hide loading indicator
         */
        hideLoading: function() {
            $('#analytics-loading').hide();
            $('#analytics-content').show();
        },

        /**
         * Handle errors
         */
        handleError: function(error) {
            console.error('Analytics error:', error);
            alert('Failed to load analytics data. Please try again.');
        },

        /**
         * Utility functions
         */
        formatNumber: function(num) {
            if (num >= 1000000) {
                return (num / 1000000).toFixed(1) + 'M';
            } else if (num >= 1000) {
                return (num / 1000).toFixed(1) + 'K';
            }
            return num.toString();
        },

        formatDate: function(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString();
        },

        escapeHtml: function(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        },

        generateColors: function(count) {
            const colors = [
                this.config.colors.primary,
                this.config.colors.success,
                this.config.colors.warning,
                this.config.colors.danger,
                this.config.colors.info
            ];

            const result = [];
            for (let i = 0; i < count; i++) {
                result.push(colors[i % colors.length]);
            }
            return result;
        },

        getMilestoneTitle: function(type) {
            const titles = {
                'total_views': 'Total Views',
                'total_embeds': 'Total Embeds',
                'daily_views': 'Daily Views',
                'monthly_views': 'Monthly Views'
            };
            return titles[type] || type;
        },

        /**
         * Render per embed analytics (Pro)
         */
        renderPerEmbedAnalytics: function(data) {
            const container = $('#per-embed-analytics');
            container.empty();

            if (!data || data.length === 0) {
                container.html('<div class="no-data">No per-embed data available</div>');
                return;
            }

            const table = $(`
                <table class="per-embed-table">
                    <thead>
                        <tr>
                            <th>Content</th>
                            <th>Type</th>
                            <th>Unique Viewers</th>
                            <th>Views</th>
                            <th>Clicks</th>
                            <th>Impressions</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            `);

            data.forEach(item => {
                const row = $(`
                    <tr>
                        <td class="content-title">${this.escapeHtml(item.title || 'Untitled')}</td>
                        <td class="content-type">${this.escapeHtml(item.embed_type)}</td>
                        <td class="unique-viewers">${this.formatNumber(item.unique_viewers)}</td>
                        <td class="total-views">${this.formatNumber(item.total_views || 0)}</td>
                        <td class="total-clicks">${this.formatNumber(item.total_clicks || 0)}</td>
                        <td class="total-impressions">${this.formatNumber(item.total_impressions || 0)}</td>
                    </tr>
                `);
                table.find('tbody').append(row);
            });

            container.append(table);
        },

        /**
         * Render geo analytics (Pro)
         */
        renderGeoAnalytics: function(data) {
            if (!data.countries || data.countries.length === 0) {
                $('#geo-chart').parent().html('<div class="no-data">No geo data available</div>');
                return;
            }

            const ctx = document.getElementById('geo-chart').getContext('2d');

            // Destroy existing chart if it exists
            if (this.config.charts.geoChart) {
                this.config.charts.geoChart.destroy();
            }

            const labels = data.countries.map(item => item.country);
            const values = data.countries.map(item => parseInt(item.visitors));
            const colors = this.generateColors(data.countries.length);

            this.config.charts.geoChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Visitors by Country',
                        data: values,
                        backgroundColor: colors,
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        },

        /**
         * Render device analytics (Pro)
         */
        renderDeviceAnalytics: function(data) {
            this.currentDeviceData = data;
            this.renderDeviceChart('devices', data.devices);
        },

        /**
         * Render device chart
         */
        renderDeviceChart: function(type, data) {
            const ctx = document.getElementById('device-chart').getContext('2d');

            // Destroy existing chart if it exists
            if (this.config.charts.deviceChart) {
                this.config.charts.deviceChart.destroy();
            }

            if (!data || data.length === 0) {
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                return;
            }

            const labels = data.map(item => item.device_type || item.screen_resolution);
            const values = data.map(item => parseInt(item.visitors));
            const colors = this.generateColors(data.length);

            this.config.charts.deviceChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: values,
                        backgroundColor: colors,
                        borderWidth: 2,
                        borderColor: '#fff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });

            this.renderDeviceLegend(labels, values, colors);
        },

        /**
         * Render device legend
         */
        renderDeviceLegend: function(labels, values, colors) {
            const container = $('#device-legend');
            container.empty();

            labels.forEach((label, index) => {
                const percentage = ((values[index] / values.reduce((a, b) => a + b, 0)) * 100).toFixed(1);
                const legendItem = $(`
                    <div class="legend-item">
                        <div class="legend-color" style="background-color: ${colors[index]}"></div>
                        <div class="legend-label">${this.escapeHtml(label)}</div>
                        <div class="legend-value">${percentage}%</div>
                    </div>
                `);
                container.append(legendItem);
            });
        },

        /**
         * Render referral analytics (Pro)
         */
        renderReferralAnalytics: function(data) {
            const container = $('#referral-analytics');
            container.empty();

            if (!data || data.length === 0) {
                container.html('<div class="no-data">No referral data available</div>');
                return;
            }

            const table = $(`
                <table class="referral-table">
                    <thead>
                        <tr>
                            <th>Referrer Source</th>
                            <th>Visitors</th>
                            <th>Total Visits</th>
                            <th>Percentage</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            `);

            const totalVisitors = data.reduce((sum, item) => sum + parseInt(item.visitors), 0);

            data.forEach(item => {
                const percentage = ((parseInt(item.visitors) / totalVisitors) * 100).toFixed(1);
                const row = $(`
                    <tr>
                        <td class="referrer-source">${this.escapeHtml(item.referrer_source)}</td>
                        <td class="visitors">${this.formatNumber(item.visitors)}</td>
                        <td class="total-visits">${this.formatNumber(item.total_visits)}</td>
                        <td class="percentage">${percentage}%</td>
                    </tr>
                `);
                table.find('tbody').append(row);
            });

            container.append(table);
        },

        /**
         * Handle device tab change (Pro)
         */
        handleDeviceTabChange: function(event) {
            const tab = $(event.target).data('tab');
            $('.device-analytics-tabs .tab-button').removeClass('active');
            $(event.target).addClass('active');

            let data;
            switch (tab) {
                case 'devices':
                    data = this.currentDeviceData?.devices;
                    break;
                case 'resolutions':
                    data = this.currentDeviceData?.resolutions;
                    break;
            }

            this.renderDeviceChart(tab, data);
        }
    };

    // Expose to global scope
    window.EmbedPressAnalyticsDashboard = EmbedPressAnalyticsDashboard;

    // Initialize when document is ready and Chart.js is loaded
    $(document).ready(function() {
        // Wait for Chart.js to be available
        function initWhenReady() {
            if (typeof Chart !== 'undefined') {
                EmbedPressAnalyticsDashboard.init();
            } else {
                // Wait a bit more for Chart.js to load
                setTimeout(initWhenReady, 100);
            }
        }
        initWhenReady();
    });

})(jQuery);
