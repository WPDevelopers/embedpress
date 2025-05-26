/**
 * EmbedPress Analytics Tracker
 *
 * Frontend JavaScript for tracking user interactions with embedded content
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
        },

        /**
         * Setup event listeners
         */
        setupEventListeners: function() {
            // Track clicks on embedded content
            $(document).on('click', '[data-embedpress-content]', this.handleClick.bind(this));

            // Track video/audio events
            $(document).on('play', '[data-embedpress-content] video, [data-embedpress-content] audio', this.handleMediaPlay.bind(this));
            $(document).on('pause', '[data-embedpress-content] video, [data-embedpress-content] audio', this.handleMediaPause.bind(this));
            $(document).on('ended', '[data-embedpress-content] video, [data-embedpress-content] audio', this.handleMediaComplete.bind(this));

            // Track iframe interactions
            $(document).on('mouseenter', '[data-embedpress-content] iframe', this.handleIframeEnter.bind(this));
            $(document).on('mouseleave', '[data-embedpress-content] iframe', this.handleIframeLeave.bind(this));

            // Track page visibility changes
            document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));

            // Track page unload
            window.addEventListener('beforeunload', this.handlePageUnload.bind(this));
        },

        /**
         * Track page load
         */
        trackPageLoad: function() {
            // Find all embedded content and track impressions
            $('[data-embedpress-content]').each((index, element) => {
                const contentId = $(element).data('embedpress-content');
                if (contentId) {
                    this.trackImpression(contentId, element);
                }
            });
        },

        /**
         * Start intersection observer for view tracking
         */
        startIntersectionObserver: function() {
            if (!('IntersectionObserver' in window)) {
                return;
            }

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const contentId = $(entry.target).data('embedpress-content');
                    if (!contentId) return;

                    if (entry.isIntersecting && entry.intersectionRatio >= this.config.viewThreshold) {
                        this.startViewTimer(contentId, entry.target);
                    } else {
                        this.stopViewTimer(contentId);
                    }
                });
            }, {
                threshold: this.config.viewThreshold
            });

            $('[data-embedpress-content]').each((index, element) => {
                observer.observe(element);
            });
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
                    embed_type: $(element).data('embed-type') || 'unknown'
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
                    embed_type: $(element).data('embed-type') || 'unknown'
                }
            });
        },

        /**
         * Handle click events
         */
        handleClick: function(event) {
            const contentId = $(event.currentTarget).data('embedpress-content');
            if (contentId) {
                this.sendTrackingData({
                    content_id: contentId,
                    interaction_type: 'click',
                    interaction_data: {
                        click_x: event.pageX,
                        click_y: event.pageY,
                        element_type: event.target.tagName.toLowerCase()
                    }
                });
            }
        },

        /**
         * Handle media play events
         */
        handleMediaPlay: function(event) {
            const contentId = $(event.target).closest('[data-embedpress-content]').data('embedpress-content');
            if (contentId) {
                this.sendTrackingData({
                    content_id: contentId,
                    interaction_type: 'play',
                    interaction_data: {
                        media_type: event.target.tagName.toLowerCase(),
                        current_time: event.target.currentTime || 0
                    }
                });
            }
        },

        /**
         * Handle media pause events
         */
        handleMediaPause: function(event) {
            const contentId = $(event.target).closest('[data-embedpress-content]').data('embedpress-content');
            if (contentId) {
                this.sendTrackingData({
                    content_id: contentId,
                    interaction_type: 'pause',
                    interaction_data: {
                        media_type: event.target.tagName.toLowerCase(),
                        current_time: event.target.currentTime || 0
                    }
                });
            }
        },

        /**
         * Handle media complete events
         */
        handleMediaComplete: function(event) {
            const contentId = $(event.target).closest('[data-embedpress-content]').data('embedpress-content');
            if (contentId) {
                this.sendTrackingData({
                    content_id: contentId,
                    interaction_type: 'complete',
                    interaction_data: {
                        media_type: event.target.tagName.toLowerCase(),
                        duration: event.target.duration || 0
                    }
                });
            }
        },

        /**
         * Handle iframe enter events
         */
        handleIframeEnter: function(event) {
            const contentId = $(event.target).closest('[data-embedpress-content]').data('embedpress-content');
            if (contentId) {
                this.trackedElements.set(contentId, {
                    enterTime: Date.now(),
                    element: event.target
                });
            }
        },

        /**
         * Handle iframe leave events
         */
        handleIframeLeave: function(event) {
            const contentId = $(event.target).closest('[data-embedpress-content]').data('embedpress-content');
            if (contentId && this.trackedElements.has(contentId)) {
                const data = this.trackedElements.get(contentId);
                const duration = Date.now() - data.enterTime;

                this.sendTrackingData({
                    content_id: contentId,
                    interaction_type: 'view',
                    view_duration: duration,
                    interaction_data: {
                        iframe_interaction: true
                    }
                });

                this.trackedElements.delete(contentId);
            }
        },

        /**
         * Handle visibility change
         */
        handleVisibilityChange: function() {
            if (document.hidden) {
                // Page is hidden, pause all timers
                this.viewTimers.forEach((timerData, contentId) => {
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
            // Send any pending tracking data
            this.viewTimers.forEach((timerData, contentId) => {
                const duration = Date.now() - timerData.startTime;
                if (duration >= 1000) { // At least 1 second
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
                success: function(response) {
                    // Success - no action needed
                    console.log('EmbedPress: Analytics data sent successfully');
                },
                error: function(xhr, status, error) {
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
