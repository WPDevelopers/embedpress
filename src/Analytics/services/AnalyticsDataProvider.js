/**
 * Analytics Data Provider
 * Handles all API communication with the EmbedPress Analytics backend
 */

class AnalyticsDataProvider {
    constructor() {
        // Use the localized data from WordPress
        const apiSettings = window.wpApiSettings || window.embedpressAnalyticsData || {};
        this.baseUrl = apiSettings.root || window.embedpressAnalyticsData?.restUrl || '/wp-json/';
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

                // If endpoint not found, return sample data for development
                if (response.status === 404) {
                    console.warn('API endpoint not found, returning sample data');
                    return this.getSampleData(endpoint);
                }

                throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            console.log('API response:', data);
            return data;
        } catch (error) {
            console.error('API Request failed:', error);

            // Return sample data as fallback
            console.warn('Returning sample data as fallback');
            return this.getSampleData(endpoint);
        }
    }

    /**
     * Get sample data for development/fallback - REMOVE THIS WHEN BACKEND IS READY
     */
    getSampleData(endpoint) {
        // This should be removed once backend is working properly
        // For now, return empty data to force real API calls
        return {};
    }

    /**
     * Get overview analytics data
     */
    async getOverviewData(dateRange = 30) {
        return this.makeRequest(`overview?date_range=${dateRange}`);
    }

    /**
     * Get views analytics data for charts
     */
    async getViewsAnalytics(dateRange = 30) {
        return this.makeRequest(`views?date_range=${dateRange}`);
    }

    /**
     * Get content analytics data
     */
    async getContentAnalytics(dateRange = 30) {
        return this.makeRequest(`content?date_range=${dateRange}`);
    }

    /**
     * Get browser analytics data
     */
    async getBrowserAnalytics(dateRange = 30) {
        return this.makeRequest(`browser?date_range=${dateRange}`);
    }

    /**
     * Get device analytics data (Pro feature)
     */
    async getDeviceAnalytics(dateRange = 30) {
        return this.makeRequest(`device?date_range=${dateRange}`);
    }

    /**
     * Get geo analytics data (Pro feature)
     */
    async getGeoAnalytics(dateRange = 30) {
        return this.makeRequest(`geo?date_range=${dateRange}`);
    }

    /**
     * Get referral analytics data (Pro feature)
     */
    async getReferralAnalytics(dateRange = 30) {
        return this.makeRequest(`referral?date_range=${dateRange}`);
    }

    /**
     * Get unique viewers per embed (Pro feature)
     */
    async getUniqueViewersPerEmbed(dateRange = 30) {
        return this.makeRequest(`unique-viewers-per-embed?date_range=${dateRange}`);
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
    async getAllAnalyticsData(dateRange = 30) {
        try {
            const [
                overview,
                views,
                content,
                browser,
                milestones,
                features
            ] = await Promise.all([
                this.getOverviewData(dateRange),
                this.getViewsAnalytics(dateRange),
                this.getContentAnalytics(dateRange),
                this.getBrowserAnalytics(dateRange),
                this.getMilestoneData(),
                this.getFeatureStatus()
            ]);

            // Get pro features if available
            let deviceAnalytics = null;
            let geoAnalytics = null;
            let referralAnalytics = null;
            let uniqueViewersPerEmbed = null;

            if (features?.features?.device_analytics) {
                deviceAnalytics = await this.getDeviceAnalytics(dateRange);
            }

            if (features?.features?.geo_tracking) {
                geoAnalytics = await this.getGeoAnalytics(dateRange);
            }

            if (features?.features?.referral_tracking) {
                referralAnalytics = await this.getReferralAnalytics(dateRange);
            }

            if (features?.features?.unique_viewers_per_embed) {
                uniqueViewersPerEmbed = await this.getUniqueViewersPerEmbed(dateRange);
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
    async exportData(format = 'csv', dateRange = 30) {
        return this.makeRequest(`export?format=${format}&date_range=${dateRange}`);
    }
}

// Create singleton instance
const analyticsDataProvider = new AnalyticsDataProvider();

export { analyticsDataProvider as AnalyticsDataProvider };
