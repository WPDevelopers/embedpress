/**
 * Analytics Data Provider
 * Handles all API communication with the EmbedPress Analytics backend
 */

class AnalyticsDataProvider {
    constructor() {
        // Use the localized data from WordPress
        const apiSettings = window.wpApiSettings || window.embedpressAnalyticsData || {};
        this.baseUrl = apiSettings.root || window.embedpressAnalyticsData?.restUrl || '/wp-json/'; // Fallback for pretty permalinks
        this.nonce = apiSettings.nonce || window.embedpressAnalyticsData?.nonce || '';
        this.namespace = 'embedpress/v1/analytics/';

        // Fallback for direct REST URL
        if (window.embedpressAnalyticsData?.restUrl) {
            this.baseUrl = window.embedpressAnalyticsData.restUrl.replace('embedpress/v1/analytics/', '');
        }
    }

    /**
     * Make authenticated API request
     */
    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseUrl}${this.namespace}${endpoint}`;

        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': this.nonce,
            },
            credentials: 'same-origin',
        };

        const requestOptions = { ...defaultOptions, ...options };

        try {
            console.log('Making API request to:', url);
            const response = await fetch(url, requestOptions);

            if (!response.ok) {
                console.error(`API request failed: ${response.status} ${response.statusText}`);

                // If endpoint not found, return empty data
                if (response.status === 404) {
                    console.warn('API endpoint not found, returning empty data');
                    return {};
                }

                throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            console.log('API response:', data);
            return data;
        } catch (error) {
            console.error('API Request failed:', error);

            // Return empty data as fallback
            console.warn('Returning empty data as fallback');
            return {};
        }
    }

    /**
     * Format date to YYYY-MM-DD in local timezone
     */
    formatDateToLocal(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * Build query parameters for date range and filters
     */
    buildDateRangeParams(dateRange, startDate = null, endDate = null, filters = {}) {
        const params = new URLSearchParams();

        if (startDate && endDate) {
            // Use specific date range - format in local timezone
            params.append('start_date', this.formatDateToLocal(startDate));
            params.append('end_date', this.formatDateToLocal(endDate));
        } else {
            // Use relative date range (number of days)
            params.append('date_range', dateRange);
        }

        // Add additional filters
        if (filters.content_type && filters.content_type !== 'all') {
            params.append('content_type', filters.content_type);
        }

        return params.toString();
    }

    /**
     * Get overview analytics data
     */
    async getOverviewData(dateRange = 30, startDate = null, endDate = null, filters = {}) {
        const params = this.buildDateRangeParams(dateRange, startDate, endDate, filters);
        return this.makeRequest(`overview?${params}`);
    }

    /**
     * Get views analytics data for charts
     */
    async getViewsAnalytics(dateRange = 30, startDate = null, endDate = null) {
        const params = this.buildDateRangeParams(dateRange, startDate, endDate);
        return this.makeRequest(`views?${params}`);
    }

    /**
     * Get content analytics data
     */
    async getContentAnalytics(dateRange = 30, startDate = null, endDate = null) {
        const params = this.buildDateRangeParams(dateRange, startDate, endDate);
        return this.makeRequest(`content?${params}`);
    }

    /**
     * Get browser analytics data
     */
    async getBrowserAnalytics(dateRange = 30, startDate = null, endDate = null) {
        const params = this.buildDateRangeParams(dateRange, startDate, endDate);
        return this.makeRequest(`browser?${params}`);
    }

    /**
     * Get device analytics data (Pro feature)
     */
    async getDeviceAnalytics(dateRange = 30, startDate = null, endDate = null) {
        const params = this.buildDateRangeParams(dateRange, startDate, endDate);
        return this.makeRequest(`device?${params}`);
    }

    /**
     * Get geo analytics data (Pro feature)
     */
    async getGeoAnalytics(dateRange = 30, startDate = null, endDate = null) {
        const params = this.buildDateRangeParams(dateRange, startDate, endDate);
        return this.makeRequest(`geo?${params}`);
    }

    /**
     * Get referral analytics data (Pro feature)
     */
    async getReferralAnalytics(dateRange = 30, startDate = null, endDate = null) {
        const params = this.buildDateRangeParams(dateRange, startDate, endDate);
        return this.makeRequest(`referral?${params}`);
    }

    /**
     * Get unique viewers per embed (Pro feature)
     */
    async getUniqueViewersPerEmbed(dateRange = 30, startDate = null, endDate = null) {
        const params = this.buildDateRangeParams(dateRange, startDate, endDate);
        return this.makeRequest(`unique-viewers-per-embed?${params}`);
    }

    /**
     * Get milestone data
     */
    async getMilestoneData() {
        return this.makeRequest('milestones');
    }

    /**
     * Get feature status (free vs pro features)
     */
    async getFeatureStatus() {
        return this.makeRequest('features');
    }

    /**
     * Get all analytics data in one call
     */
    async getAllAnalyticsData(dateRange = 30, startDate = null, endDate = null, filters = {}) {
        try {
            const [
                overview,
                views,
                content,
                browser,
                milestones,
                features
            ] = await Promise.all([
                this.getOverviewData(dateRange, startDate, endDate, filters),
                this.getViewsAnalytics(dateRange, startDate, endDate),
                this.getContentAnalytics(dateRange, startDate, endDate),
                this.getBrowserAnalytics(dateRange, startDate, endDate),
                this.getMilestoneData(),
                this.getFeatureStatus()
            ]);

            // Get device analytics (available for both free and pro)
            let deviceAnalytics = await this.getDeviceAnalytics(dateRange, startDate, endDate);

            // Get pro features if available
            let geoAnalytics = null;
            let referralAnalytics = null;
            let uniqueViewersPerEmbed = null;

            if (features?.features?.geo_tracking) {
                geoAnalytics = await this.getGeoAnalytics(dateRange, startDate, endDate);
            }

            if (features?.features?.referral_tracking) {
                referralAnalytics = await this.getReferralAnalytics(dateRange, startDate, endDate);
            }

            if (features?.features?.unique_viewers_per_embed) {
                uniqueViewersPerEmbed = await this.getUniqueViewersPerEmbed(dateRange, startDate, endDate);
            }

            return {
                overview,
                views,
                content,
                browser,
                milestones,
                features,
                deviceAnalytics,
                geoAnalytics,
                referralAnalytics,
                uniqueViewersPerEmbed,
                dateRange
            };
        } catch (error) {
            console.error('Failed to load all analytics data:', error);
            throw error;
        }
    }

    /**
     * Track interaction (for frontend tracking)
     */
    async trackInteraction(contentId, interactionType, sessionId, additionalData = {}) {
        return this.makeRequest('track', {
            method: 'POST',
            body: JSON.stringify({
                content_id: contentId,
                interaction_type: interactionType,
                session_id: sessionId,
                ...additionalData
            })
        });
    }

    /**
     * Export analytics data (Pro feature)
     */
    async exportData(format = 'csv', dateRange = 30, startDate = null, endDate = null) {
        const dateParams = this.buildDateRangeParams(dateRange, startDate, endDate);
        return this.makeRequest(`export?format=${format}&${dateParams}`);
    }
}

// Create singleton instance
const analyticsDataProvider = new AnalyticsDataProvider();

export { analyticsDataProvider as AnalyticsDataProvider };
