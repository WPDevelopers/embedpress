/**
 * EmbedPress Analytics Tracker
 *
 * Frontend JavaScript for tracking user interactions with embedded content
 *
 * Uses a single selector approach to prevent duplicate tracking:
 * - Primary selector: [data-embedpress-content] (most reliable)
 * - Fallback selectors: Various class-based selectors for legacy content
 * - Ensures each embed is tracked only once per interaction
 *
 * Tracking Rules:
 * - Impressions: Tracked every time content becomes 49%+ visible (same threshold as views)
 * - Views: Tracked every time content is 49%+ visible for 3+ seconds
 * - Clicks: Tracked once per session per content block (session-based)
 * - No mouse enter/leave tracking to prevent excessive events
 *
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2023 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       4.2.7
 */

(function($) {
    'use strict';

    // Analytics tracker object
    const EmbedPressAnalytics = {

        // Configuration
        config: {
            trackingEnabled: true,
            debounceTime: 1000,
            viewThreshold: 0.5, // 50% of element must be visible
            viewDuration: 3000, // 3 seconds to count as a view
            maxRetries: 3
        },

        // Tracking data
        trackedElements: new Map(),
        viewTimers: new Map(),
        sessionData: {},
        sessionClicks: new Set(), // Track clicks per session to prevent duplicates

        /**
         * Initialize the analytics tracker
         */
        init: function() {
            if (typeof embedpress_analytics === 'undefined') {
                return;
            }

            this.sessionData = {
                sessionId: embedpress_analytics.session_id,
                pageUrl: embedpress_analytics.page_url,
                postId: embedpress_analytics.post_id,
                restUrl: embedpress_analytics.rest_url,
                nonce: embedpress_analytics.nonce
            };

            this.collectBrowserInfo();
            this.setupEventListeners();
            this.trackPageLoad();
            this.startIntersectionObserver();
        },

        /**
         * Collect browser information
         */
        collectBrowserInfo: function() {
            this.sessionData.browserInfo = {
                screenResolution: screen.width + 'x' + screen.height,
                language: navigator.language || navigator.userLanguage,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                userAgent: navigator.userAgent
            };

            // Get user's IP and geo-location from frontend
            this.getUserGeoLocation();
        },

        /**
         * Get user's IP and geo-location data from frontend
         */
        getUserGeoLocation: function() {
            // Try multiple free IP/geo services
            const services = [
                {
                    name: 'ipapi.co',
                    url: 'https://ipapi.co/json/',
                    parser: (data) => ({
                        ip: data.ip,
                        country: data.country_name,
                        city: data.city
                    })
                },
                {
                    name: 'ip-api.com',
                    url: 'http://ip-api.com/json/?fields=query,country,city',
                    parser: (data) => ({
                        ip: data.query,
                        country: data.country,
                        city: data.city
                    })
                },
                {
                    name: 'ipinfo.io',
                    url: 'https://ipinfo.io/json',
                    parser: (data) => ({
                        ip: data.ip,
                        country: data.country, // This returns country code, we'll handle it
                        city: data.city
                    })
                }
            ];

            this.tryGeoServices(services, 0);
        },

        /**
         * Try geo-location services one by one
         */
        tryGeoServices: function(services, index) {
            if (index >= services.length) {
                console.log('EmbedPress Analytics: Could not get geo-location data');
                return;
            }

            const service = services[index];

            $.ajax({
                url: service.url,
                method: 'GET',
                timeout: 5000,
                success: (data) => {
                    try {
                        const geoData = service.parser(data);

                        if (geoData.ip && geoData.country) {
                            this.sessionData.geoData = {
                                ip: geoData.ip,
                                country: geoData.country,
                                city: geoData.city || null
                            };

                            console.log('EmbedPress Analytics: Got geo data from', service.name, this.sessionData.geoData);

                            // Send browser info with geo data to backend
                            this.sendBrowserInfo();
                        } else {
                            // Try next service
                            this.tryGeoServices(services, index + 1);
                        }
                    } catch (e) {
                        console.log('EmbedPress Analytics: Error parsing geo data from', service.name, e);
                        this.tryGeoServices(services, index + 1);
                    }
                },
                error: () => {
                    console.log('EmbedPress Analytics: Failed to get geo data from', service.name);
                    this.tryGeoServices(services, index + 1);
                }
            });
        },

        /**
         * Send browser info with geo data to backend
         */
        sendBrowserInfo: function() {
            const data = {
                session_id: this.sessionData.sessionId,
                screen_resolution: this.sessionData.browserInfo.screenResolution,
                language: this.sessionData.browserInfo.language,
                timezone: this.sessionData.browserInfo.timezone,
                user_agent: this.sessionData.browserInfo.userAgent
            };

            // Add geo data if available
            if (this.sessionData.geoData) {
                data.user_ip = this.sessionData.geoData.ip;
                data.country = this.sessionData.geoData.country;
                data.city = this.sessionData.geoData.city;
            }

            $.ajax({
                url: this.sessionData.restUrl + 'browser-info',
                method: 'POST',
                data: data,
                headers: {
                    'X-WP-Nonce': this.sessionData.nonce
                },
                success: (response) => {
                    console.log('EmbedPress Analytics: Browser info sent successfully');
                },
                error: (xhr, status, error) => {
                    console.log('EmbedPress Analytics: Failed to send browser info', error);
                }
            });
        },

        /**
         * Setup event listeners
         */
        setupEventListeners: function() {
            // Use primary selector for main tracking
            const primarySelector = this.getPrimarySelector();
            const fallbackSelectors = this.getFallbackSelectors();
            const allSelectors = [primarySelector, ...fallbackSelectors];

            // Track clicks on embedded content
            $(document).on('click', allSelectors.join(', '), this.handleClick.bind(this));

            // Track video/audio events
            $(document).on('play', allSelectors.map(s => s + ' video, ' + s + ' audio').join(', '), this.handleMediaPlay.bind(this));
            $(document).on('pause', allSelectors.map(s => s + ' video, ' + s + ' audio').join(', '), this.handleMediaPause.bind(this));
            $(document).on('ended', allSelectors.map(s => s + ' video, ' + s + ' audio').join(', '), this.handleMediaComplete.bind(this));

            // Note: Removed iframe mouse enter/leave tracking to prevent excessive tracking
            // Views are now tracked only via Intersection Observer (49%+ visibility for 3+ seconds)

            // Track PDF interactions
            $(document).on('click', '.pdfobject-container, .embedpress-embed-document-pdf', this.handlePDFClick.bind(this));

            // Track document viewer interactions
            $(document).on('click', '.embedpress-embed-document iframe', this.handleDocumentClick.bind(this));

            // Track page visibility changes
            document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));

            // Track page unload
            window.addEventListener('beforeunload', this.handlePageUnload.bind(this));
        },

        /**
         * Get primary EmbedPress content selector
         */
        getPrimarySelector: function() {
            return '[data-embedpress-content]';
        },

        /**
         * Get fallback selectors for content without data attributes
         */
        getFallbackSelectors: function() {
            return [
                // Gutenberg blocks
                '.wp-block-embedpress-embedpress',
                '.wp-block-embedpress-embedpress-pdf',
                '.wp-block-embedpress-document',
                '.ep-gutenberg-content',

                // Elementor widgets
                '.ep-elementor-content',
                '.embedpress-elements-wrapper',

                // PDF embeds
                '.pdfobject-container',
                '.embedpress-embed-document-pdf',
                '.gutenberg-pdf-wraper',

                // Document embeds
                '.embedpress-embed-document',
                '.embedpress-document-embed',

                // Shortcode embeds
                '.embedpress-wrapper',
                '.ose-embedpress-responsive',

                // Legacy selectors
                '.ose-youtube',
                '.ose-vimeo',
                '.ose-dailymotion',
                '.ose-facebook',
                '.ose-twitter',
                '.ose-instagram',
                '.ose-soundcloud',
                '.ose-spotify',
                '.ose-google-docs',
                '.ose-google-maps'
            ];
        },

        /**
         * Get all EmbedPress content elements (avoiding duplicates)
         */
        getAllEmbedPressElements: function() {
            const elements = new Set();

            // First, get all elements with the primary data attribute
            $(this.getPrimarySelector()).each((_index, element) => {
                elements.add(element);
            });

            // Then, get fallback elements that don't have the data attribute
            // const fallbackSelectors = this.getFallbackSelectors();
            // fallbackSelectors.forEach(selector => {
            //     $(selector).each((_index, element) => {
            //         // Only add if it doesn't already have the data attribute
            //         if (!$(element).data('embedpress-content') && !$(element).closest('[data-embedpress-content]').length) {
            //             elements.add(element);
            //         }
            //     });
            // });

            return Array.from(elements);
        },

        /**
         * Track page load
         */
        trackPageLoad: function() {
            // Find all embedded content for setup (impressions now handled by Intersection Observer)
            const elements = this.getAllEmbedPressElements();
            console.log('EmbedPress Analytics: Found', elements.length, 'unique elements to track');

            // Note: Impressions are now tracked by Intersection Observer when content becomes visible
        },

        /**
         * Start intersection observer for impression and view tracking
         */
        startIntersectionObserver: function() {
            if (!('IntersectionObserver' in window)) {
                return;
            }

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const contentId = this.getContentId(entry.target);
                    if (!contentId) return;

                    if (entry.isIntersecting && entry.intersectionRatio >= this.config.viewThreshold) {
                        // Track impression when content becomes 49%+ visible
                        this.trackImpression(contentId, entry.target);

                        // Start view timer for the same threshold
                        this.startViewTimer(contentId, entry.target);
                    } else {
                        this.stopViewTimer(contentId);
                    }
                });
            }, {
                threshold: this.config.viewThreshold // Track at 49% for both impression and view
            });

            // Observe all EmbedPress content (avoiding duplicates)
            const elements = this.getAllEmbedPressElements();

            console.log({elements});

            elements.forEach(element => {
                observer.observe(element);
            });
        },

        /**
         * Get content ID from element
         */
        getContentId: function(element) {
            const $element = $(element);

            // Try data attribute first
            let contentId = $element.data('embedpress-content');
            if (contentId) return contentId;

            // Try data-emid for PDF embeds
            contentId = $element.data('emid');
            if (contentId) return contentId;

            // Generate ID from URL or element attributes
            const src = $element.find('iframe').attr('src') ||
                       $element.find('embed').attr('src') ||
                       $element.data('emsrc');

            if (src) {
                return 'auto-' + this.hashCode(src);
            }

            // Generate ID from element classes
            const className = element.className;
            if (className) {
                return 'auto-' + this.hashCode(className + window.location.href);
            }

            return null;
        },

        /**
         * Generate hash code from string
         */
        hashCode: function(str) {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // Convert to 32bit integer
            }
            return Math.abs(hash).toString(36);
        },

        /**
         * Get embed type from click event (checks both target and currentTarget)
         */
        getEmbedTypeFromClick: function(event) {
            // First try the clicked element (target)
            let embedType = this.getEmbedType(event.target);
            if (embedType !== 'unknown') return embedType;

            // Then try the parent element (currentTarget)
            embedType = this.getEmbedType(event.currentTarget);
            if (embedType !== 'unknown') return embedType;

            // Finally, search for child elements with data attributes
            const $currentTarget = $(event.currentTarget);
            const childWithData = $currentTarget.find('[data-embed-type], [data-embedpress-content]').first();
            if (childWithData.length) {
                embedType = this.getEmbedType(childWithData[0]);
                if (embedType !== 'unknown') return embedType;
            }

            return 'unknown';
        },

        /**
         * Get embed type from element (prioritizes data attributes)
         */
        getEmbedType: function(element) {
            const $element = $(element);



            console.log({element});

            // Try data attribute first (most reliable)
            let embedType = $element.data('embed-type');
            if (embedType) return embedType.toLowerCase();

            // Try data-embedpress-content attribute pattern
            const contentId = $element.data('embedpress-content');
            if (contentId && typeof contentId === 'string') {
                if (contentId.includes('pdf')) return 'pdf';
                if (contentId.includes('document')) return 'document';
                if (contentId.includes('youtube')) return 'youtube';
                if (contentId.includes('vimeo')) return 'vimeo';
            }

            // Detect from classes as fallback
            const className = element.className || '';

            if (className.includes('pdf') || className.includes('pdfobject')) return 'pdf';
            if (className.includes('document')) return 'document';
            if (className.includes('youtube')) return 'youtube';
            if (className.includes('vimeo')) return 'vimeo';
            if (className.includes('facebook')) return 'facebook';
            if (className.includes('twitter')) return 'twitter';
            if (className.includes('instagram')) return 'instagram';
            if (className.includes('soundcloud')) return 'soundcloud';
            if (className.includes('spotify')) return 'spotify';
            if (className.includes('google-docs')) return 'google-docs';
            if (className.includes('google-maps')) return 'google-maps';
            if (className.includes('dailymotion')) return 'dailymotion';

            return 'unknown';
        },

        /**
         * Start view timer
         */
        startViewTimer: function(contentId, element) {
            if (this.viewTimers.has(contentId)) {
                return;
            }

            const timer = setTimeout(() => {
                this.trackView(contentId, element);
                this.viewTimers.delete(contentId);
            }, this.config.viewDuration);

            this.viewTimers.set(contentId, {
                timer: timer,
                startTime: Date.now()
            });
        },

        /**
         * Stop view timer
         */
        stopViewTimer: function(contentId) {
            if (this.viewTimers.has(contentId)) {
                const timerData = this.viewTimers.get(contentId);
                clearTimeout(timerData.timer);
                this.viewTimers.delete(contentId);
            }
        },

        /**
         * Track impression
         */
        trackImpression: function(contentId, element) {
            this.sendTrackingData({
                content_id: contentId,
                interaction_type: 'impression',
                interaction_data: {
                    element_type: element.tagName.toLowerCase(),
                    embed_type: this.getEmbedType(element)
                }
            });
        },

        /**
         * Track view
         */
        trackView: function(contentId, element) {
            this.sendTrackingData({
                content_id: contentId,
                interaction_type: 'view',
                view_duration: this.config.viewDuration,
                interaction_data: {
                    element_type: element.tagName.toLowerCase(),
                    embed_type: this.getEmbedType(element)
                }
            });
        },

        /**
         * Handle click events (once per session per content)
         */
        handleClick: function(event) {
            const contentId = this.getContentId(event.currentTarget);
            if (contentId && !this.sessionClicks.has(contentId)) {
                this.sessionClicks.add(contentId);
                this.sendTrackingData({
                    content_id: contentId,
                    interaction_type: 'click',
                    interaction_data: {
                        click_x: event.pageX,
                        click_y: event.pageY,
                        element_type: event.target.tagName.toLowerCase(),
                        embed_type: this.getEmbedTypeFromClick(event) // Check both target and currentTarget
                    }
                });
            }
        },

        /**
         * Handle PDF click events (once per session per content)
         */
        handlePDFClick: function(event) {
            const contentId = this.getContentId(event.currentTarget);
            if (contentId && !this.sessionClicks.has(contentId)) {
                this.sessionClicks.add(contentId);
                this.sendTrackingData({
                    content_id: contentId,
                    interaction_type: 'click',
                    interaction_data: {
                        click_x: event.pageX,
                        click_y: event.pageY,
                        element_type: event.target.tagName.toLowerCase(),
                        embed_type: this.getEmbedTypeFromClick(event) // Check both target and currentTarget
                    }
                });
            }
        },

        /**
         * Handle document click events (once per session per content)
         */
        handleDocumentClick: function(event) {
            const contentId = this.getContentId(event.currentTarget);
            if (contentId && !this.sessionClicks.has(contentId)) {
                this.sessionClicks.add(contentId);
                this.sendTrackingData({
                    content_id: contentId,
                    interaction_type: 'click',
                    interaction_data: {
                        click_x: event.pageX,
                        click_y: event.pageY,
                        element_type: event.target.tagName.toLowerCase(),
                        embed_type: this.getEmbedTypeFromClick(event) // Check both target and currentTarget
                    }
                });
            }
        },

        /**
         * Handle media play events
         */
        handleMediaPlay: function(event) {
            const parentElement = this.findEmbedPressParent(event.target);
            const contentId = parentElement ? this.getContentId(parentElement) : null;
            if (contentId) {
                this.sendTrackingData({
                    content_id: contentId,
                    interaction_type: 'play',
                    interaction_data: {
                        media_type: event.target.tagName.toLowerCase(),
                        current_time: event.target.currentTime || 0,
                        embed_type: this.getEmbedType(parentElement)
                    }
                });
            }
        },

        /**
         * Handle media pause events
         */
        handleMediaPause: function(event) {
            const parentElement = this.findEmbedPressParent(event.target);
            const contentId = parentElement ? this.getContentId(parentElement) : null;
            if (contentId) {
                this.sendTrackingData({
                    content_id: contentId,
                    interaction_type: 'pause',
                    interaction_data: {
                        media_type: event.target.tagName.toLowerCase(),
                        current_time: event.target.currentTime || 0,
                        embed_type: this.getEmbedType(parentElement)
                    }
                });
            }
        },

        /**
         * Handle media complete events
         */
        handleMediaComplete: function(event) {
            const parentElement = this.findEmbedPressParent(event.target);
            const contentId = parentElement ? this.getContentId(parentElement) : null;
            if (contentId) {
                this.sendTrackingData({
                    content_id: contentId,
                    interaction_type: 'complete',
                    interaction_data: {
                        media_type: event.target.tagName.toLowerCase(),
                        duration: event.target.duration || 0,
                        embed_type: this.getEmbedType(parentElement)
                    }
                });
            }
        },

        // Note: Removed iframe mouse enter/leave handlers to prevent excessive tracking
        // Views are now tracked only via Intersection Observer (49%+ visibility for 3+ seconds)

        /**
         * Find EmbedPress parent element
         */
        findEmbedPressParent: function(element) {
            let current = element;

            // First, try to find element with data attribute (most reliable)
            while (current && current !== document) {
                if ($(current).data('embedpress-content')) {
                    return current;
                }
                current = current.parentElement;
            }

            // If not found, try fallback selectors
            current = element;
            const fallbackSelectors = this.getFallbackSelectors();
            while (current && current !== document) {
                for (let selector of fallbackSelectors) {
                    if ($(current).is(selector)) {
                        return current;
                    }
                }
                current = current.parentElement;
            }

            return null;
        },

        /**
         * Handle visibility change
         */
        handleVisibilityChange: function() {
            if (document.hidden) {
                // Page is hidden, pause all timers
                this.viewTimers.forEach((timerData, _contentId) => {
                    clearTimeout(timerData.timer);
                });
            } else {
                // Page is visible, restart timers for visible elements
                this.startIntersectionObserver();
            }
        },

        /**
         * Handle page unload
         */
        handlePageUnload: function() {
            // Send any pending tracking data for views
            this.viewTimers.forEach((timerData, contentId) => {
                const duration = Date.now() - timerData.startTime;
                if (duration >= this.config.viewDuration) {
                    navigator.sendBeacon(
                        this.sessionData.restUrl + 'track',
                        JSON.stringify({
                            content_id: contentId,
                            interaction_type: 'view',
                            view_duration: duration,
                            session_id: this.sessionData.sessionId,
                            page_url: this.sessionData.pageUrl
                        })
                    );
                }
            });
        },

        /**
         * Send tracking data to server
         */
        sendTrackingData: function(data, retryCount = 0) {
            if (!this.config.trackingEnabled) {
                return;
            }

            const trackingData = Object.assign({
                session_id: this.sessionData.sessionId,
                page_url: this.sessionData.pageUrl,
                post_id: this.sessionData.postId
            }, data, this.sessionData.browserInfo);

            $.ajax({
                url: this.sessionData.restUrl + 'track',
                method: 'POST',
                data: trackingData,
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                success: function(_response) {
                    // Success - no action needed
                    console.log('EmbedPress: Analytics data sent successfully');
                },
                error: function(_xhr, _status, error) {
                    console.warn('EmbedPress: Analytics tracking failed:', error);
                    // Retry on failure (up to maxRetries)
                    if (retryCount < this.config.maxRetries) {
                        setTimeout(() => {
                            this.sendTrackingData(data, retryCount + 1);
                        }, 1000 * (retryCount + 1));
                    }
                }.bind(this)
            });
        },

        /**
         * Debounce function
         */
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
    };

    // Initialize when document is ready
    $(document).ready(function() {
        EmbedPressAnalytics.init();
    });

    // Expose to global scope for debugging
    window.EmbedPressAnalytics = EmbedPressAnalytics;

})(jQuery);
