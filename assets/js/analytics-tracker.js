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
            // Get all EmbedPress selectors
            const selectors = this.getEmbedPressSelectors();

            // Track clicks on embedded content
            $(document).on('click', selectors.join(', '), this.handleClick.bind(this));

            // Track video/audio events
            $(document).on('play', selectors.map(s => s + ' video, ' + s + ' audio').join(', '), this.handleMediaPlay.bind(this));
            $(document).on('pause', selectors.map(s => s + ' video, ' + s + ' audio').join(', '), this.handleMediaPause.bind(this));
            $(document).on('ended', selectors.map(s => s + ' video, ' + s + ' audio').join(', '), this.handleMediaComplete.bind(this));

            // Track iframe interactions
            $(document).on('mouseenter', selectors.map(s => s + ' iframe').join(', '), this.handleIframeEnter.bind(this));
            $(document).on('mouseleave', selectors.map(s => s + ' iframe').join(', '), this.handleIframeLeave.bind(this));

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
         * Get all EmbedPress content selectors
         */
        getEmbedPressSelectors: function() {
            return [
                // Main tracking attribute
                '[data-embedpress-content]',

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
         * Track page load
         */
        trackPageLoad: function() {
            // Find all embedded content and track impressions
            const selectors = this.getEmbedPressSelectors();

            selectors.forEach(selector => {
                $(selector).each((index, element) => {
                    const contentId = this.getContentId(element);
                    if (contentId) {
                        this.trackImpression(contentId, element);
                    }
                });
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
                    const contentId = this.getContentId(entry.target);
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

            // Observe all EmbedPress content
            const selectors = this.getEmbedPressSelectors();
            selectors.forEach(selector => {
                $(selector).each((index, element) => {
                    observer.observe(element);
                });
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
         * Get embed type from element
         */
        getEmbedType: function(element) {
            const $element = $(element);

            // Try data attribute first
            let embedType = $element.data('embed-type');
            if (embedType) return embedType;

            // Detect from classes
            const className = element.className;

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
         * Handle click events
         */
        handleClick: function(event) {
            const contentId = this.getContentId(event.currentTarget);
            if (contentId) {
                this.sendTrackingData({
                    content_id: contentId,
                    interaction_type: 'click',
                    interaction_data: {
                        click_x: event.pageX,
                        click_y: event.pageY,
                        element_type: event.target.tagName.toLowerCase(),
                        embed_type: this.getEmbedType(event.currentTarget)
                    }
                });
            }
        },

        /**
         * Handle PDF click events
         */
        handlePDFClick: function(event) {
            const contentId = this.getContentId(event.currentTarget);
            if (contentId) {
                this.sendTrackingData({
                    content_id: contentId,
                    interaction_type: 'click',
                    interaction_data: {
                        click_x: event.pageX,
                        click_y: event.pageY,
                        element_type: 'pdf',
                        embed_type: 'pdf'
                    }
                });
            }
        },

        /**
         * Handle document click events
         */
        handleDocumentClick: function(event) {
            const contentId = this.getContentId(event.currentTarget);
            if (contentId) {
                this.sendTrackingData({
                    content_id: contentId,
                    interaction_type: 'click',
                    interaction_data: {
                        click_x: event.pageX,
                        click_y: event.pageY,
                        element_type: 'document',
                        embed_type: 'document'
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

        /**
         * Handle iframe enter events
         */
        handleIframeEnter: function(event) {
            const parentElement = this.findEmbedPressParent(event.target);
            const contentId = parentElement ? this.getContentId(parentElement) : null;
            if (contentId) {
                this.trackedElements.set(contentId, {
                    enterTime: Date.now(),
                    element: parentElement
                });
            }
        },

        /**
         * Handle iframe leave events
         */
        handleIframeLeave: function(event) {
            const parentElement = this.findEmbedPressParent(event.target);
            const contentId = parentElement ? this.getContentId(parentElement) : null;
            if (contentId && this.trackedElements.has(contentId)) {
                const data = this.trackedElements.get(contentId);
                const duration = Date.now() - data.enterTime;

                this.sendTrackingData({
                    content_id: contentId,
                    interaction_type: 'view',
                    view_duration: duration,
                    interaction_data: {
                        iframe_interaction: true,
                        embed_type: this.getEmbedType(parentElement)
                    }
                });

                this.trackedElements.delete(contentId);
            }
        },

        /**
         * Find EmbedPress parent element
         */
        findEmbedPressParent: function(element) {
            const selectors = this.getEmbedPressSelectors();
            let current = element;

            while (current && current !== document) {
                for (let selector of selectors) {
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
