/**
 * EmbedPress Analytics Tracker
 *
 * Tracks embedded content views, impressions, and clicks
 * - View: 3+ seconds with 49%+ visibility
 * - Impression: Any visibility in viewport
 * - Click: User interaction with embedded content
 *
 * @package EmbedPress
 * @version 1.0.0
 */

(function() {
    'use strict';

    // Configuration
    const config = {
        viewThreshold: 49, // Percentage of element that must be visible to count as a view
        viewDuration: 3000, // Duration in ms element must be visible to count as a view (3 seconds)
        debug: false, // Set to true to enable console logging
        restUrl: embedpress_analytics?.rest_url || '/wp-json/embedpress/v1/analytics/',
        sessionId: embedpress_analytics?.session_id || generateSessionId(),
        pageUrl: embedpress_analytics?.page_url || window.location.href,
        postId: embedpress_analytics?.post_id || 0
    };

    // Store tracked elements and their states
    const trackedElements = new Map();

    // Store session data to prevent duplicate tracking
    const sessionData = {
        viewedContent: new Set(),
        clickedContent: new Set()
    };

    /**
     * Initialize the tracker
     */
    function init() {
        if (config.debug) {
            console.log('EmbedPress Analytics: Initializing tracker');
        }

        // Find all elements with data-embed-type attribute
        findAndTrackEmbeds();

        // Set up intersection observer for viewport tracking
        setupIntersectionObserver();

        // Set up click tracking
        setupClickTracking();

        // Send browser info for analytics
        sendBrowserInfo();

        // Re-check for embeds when DOM changes (for dynamically loaded content)
        setupMutationObserver();
    }

    /**
     * Find all embeddable elements and prepare them for tracking
     */
    function findAndTrackEmbeds() {
        // Find all elements with data-embed-type attribute
        const embeds = document.querySelectorAll('[data-embed-type]');

        if (config.debug) {
            console.log(`EmbedPress Analytics: Found ${embeds.length} embeds with data-embed-type`);
        }

        embeds.forEach(prepareElementForTracking);
    }

    /**
     * Prepare an element for tracking
     *
     * @param {HTMLElement} element The element to track
     */
    function prepareElementForTracking(element) {
        // Skip if already tracked
        if (trackedElements.has(element)) {
            return;
        }

        // Get embed type from data attribute
        const embedType = element.getAttribute('data-embed-type');

        // Skip if no embed type (shouldn't happen but just in case)
        if (!embedType) {
            if (config.debug) {
                console.log('EmbedPress Analytics: Skipping element with empty data-embed-type', element);
            }
            return;
        }

        // Generate a unique content ID if not already present
        let contentId = element.getAttribute('data-embedpress-content') ||
                        element.getAttribute('data-source-id') ||
                        element.getAttribute('data-emid');

        if (!contentId) {
            contentId = 'ep-' + embedType + '-' + Math.random().toString(36).substring(2, 10);
            element.setAttribute('data-embedpress-content', contentId);
        }

        // Store element data for tracking
        trackedElements.set(element, {
            contentId: contentId,
            embedType: embedType,
            embedUrl: getEmbedUrl(element),
            inViewport: false,
            viewTimer: null,
            viewTracked: false,
            impressionTracked: false,
            viewportPercentage: 0
        });

        if (config.debug) {
            console.log(`EmbedPress Analytics: Prepared element for tracking`, {
                contentId,
                embedType,
                element
            });
        }
    }

    /**
     * Extract embed URL from element
     *
     * @param {HTMLElement} element The element to extract URL from
     * @returns {string} The embed URL
     */
    function getEmbedUrl(element) {
        // Try to find iframe src
        const iframe = element.querySelector('iframe');
        if (iframe && iframe.src) {
            return iframe.src;
        }

        // Try to find video source
        const video = element.querySelector('video source');
        if (video && video.src) {
            return video.src;
        }

        // Try to find audio source
        const audio = element.querySelector('audio source');
        if (audio && audio.src) {
            return audio.src;
        }

        // Try to find embed source
        const embed = element.querySelector('embed');
        if (embed && embed.src) {
            return embed.src;
        }

        // Try to find object data
        const object = element.querySelector('object');
        if (object && object.data) {
            return object.data;
        }

        // Fallback to a data attribute if available
        return element.getAttribute('data-url') ||
               element.getAttribute('data-src') ||
               element.getAttribute('href') ||
               '';
    }

    /**
     * Set up intersection observer to track element visibility
     */
    function setupIntersectionObserver() {
        // Skip if Intersection Observer is not supported
        if (!('IntersectionObserver' in window)) {
            if (config.debug) {
                console.log('EmbedPress Analytics: IntersectionObserver not supported');
            }
            return;
        }

        // Create observer for tracking when elements enter/exit viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const element = entry.target;
                const data = trackedElements.get(element);

                if (!data) return;

                // Calculate percentage of element visible in viewport
                const visiblePercentage = Math.floor(entry.intersectionRatio * 100);
                data.viewportPercentage = visiblePercentage;

                // Update viewport status
                data.inViewport = entry.isIntersecting;

                // Track impression when element enters viewport (any visibility)
                if (entry.isIntersecting && !data.impressionTracked) {
                    trackImpression(element, data);
                    data.impressionTracked = true;
                }

                // Handle view tracking based on visibility threshold
                handleViewTracking(element, data, visiblePercentage);
            });
        }, {
            threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
        });

        // Observe all tracked elements
        trackedElements.forEach((data, element) => {
            observer.observe(element);
        });
    }

    /**
     * Handle view tracking based on visibility threshold and duration
     *
     * @param {HTMLElement} element The element being tracked
     * @param {Object} data The tracking data for the element
     * @param {number} visiblePercentage Percentage of element visible in viewport
     */
    function handleViewTracking(element, data, visiblePercentage) {
        // Clear any existing timer if element exits viewport or falls below threshold
        if (!data.inViewport || visiblePercentage < config.viewThreshold) {
            if (data.viewTimer) {
                clearTimeout(data.viewTimer);
                data.viewTimer = null;
            }
            return;
        }

        // Skip if already tracked this view in this session
        if (data.viewTracked || sessionData.viewedContent.has(data.contentId)) {
            return;
        }

        // Start timer for view tracking if not already started
        if (!data.viewTimer && visiblePercentage >= config.viewThreshold) {
            data.viewTimer = setTimeout(() => {
                trackView(element, data);
                data.viewTracked = true;
                sessionData.viewedContent.add(data.contentId);
                data.viewTimer = null;
            }, config.viewDuration);
        }
    }

    /**
     * Set up click tracking for embedded content
     */
    function setupClickTracking() {
        // Add click event listeners to all tracked elements
        trackedElements.forEach((data, element) => {
            element.addEventListener('click', (event) => {
                // Skip if already tracked this click in this session
                if (sessionData.clickedContent.has(data.contentId)) {
                    return;
                }

                trackClick(element, data);
                sessionData.clickedContent.add(data.contentId);
            });
        });
    }

    /**
     * Track an impression (element visible in viewport)
     *
     * @param {HTMLElement} element The element being tracked
     * @param {Object} data The tracking data for the element
     */
    function trackImpression(element, data) {
        if (config.debug) {
            console.log(`EmbedPress Analytics: Tracking impression for ${data.contentId} (${data.embedType})`);
        }

        sendTrackingData({
            content_id: data.contentId,
            interaction_type: 'impression',
            interaction_data: {
                embed_type: data.embedType,
                embed_url: data.embedUrl,
                viewport_percentage: data.viewportPercentage
            }
        });
    }

    /**
     * Track a view (element visible for required duration and percentage)
     *
     * @param {HTMLElement} element The element being tracked
     * @param {Object} data The tracking data for the element
     */
    function trackView(element, data) {
        if (config.debug) {
            console.log(`EmbedPress Analytics: Tracking view for ${data.contentId} (${data.embedType})`);
        }

        sendTrackingData({
            content_id: data.contentId,
            interaction_type: 'view',
            interaction_data: {
                embed_type: data.embedType,
                embed_url: data.embedUrl,
                viewport_percentage: data.viewportPercentage,
                view_duration: config.viewDuration
            },
            view_duration: config.viewDuration / 1000 // Convert to seconds
        });
    }

    /**
     * Track a click on embedded content
     *
     * @param {HTMLElement} element The element being tracked
     * @param {Object} data The tracking data for the element
     */
    function trackClick(element, data) {
        if (config.debug) {
            console.log(`EmbedPress Analytics: Tracking click for ${data.contentId} (${data.embedType})`);
        }

        sendTrackingData({
            content_id: data.contentId,
            interaction_type: 'click',
            interaction_data: {
                embed_type: data.embedType,
                embed_url: data.embedUrl
            }
        });
    }

    /**
     * Send tracking data to the server
     *
     * @param {Object} data The tracking data to send
     */
    function sendTrackingData(data) {
        // Add common data
        const trackingData = {
            ...data,
            session_id: config.sessionId,
            page_url: config.pageUrl,
            post_id: config.postId
        };

        // Use fetch API to send data
        fetch(config.restUrl + 'track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': embedpress_analytics?.nonce || ''
            },
            body: JSON.stringify(trackingData),
            credentials: 'same-origin'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(result => {
            if (config.debug) {
                console.log('EmbedPress Analytics: Tracking data sent successfully', result);
            }
        })
        .catch(error => {
            if (config.debug) {
                console.error('EmbedPress Analytics: Error sending tracking data', error);
            }

            // Fallback to navigator.sendBeacon if fetch fails
            if (navigator.sendBeacon) {
                const blob = new Blob([JSON.stringify(trackingData)], { type: 'application/json' });
                navigator.sendBeacon(config.restUrl + 'track', blob);

                if (config.debug) {
                    console.log('EmbedPress Analytics: Used sendBeacon as fallback');
                }
            }
        });
    }

    /**
     * Send browser information for analytics
     */
    function sendBrowserInfo() {
        const browserInfo = {
            session_id: config.sessionId,
            screen_resolution: window.screen.width + 'x' + window.screen.height,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            user_agent: navigator.userAgent
        };

        // Get country and city from client-side geolocation API if available
        if (navigator.geolocation) {
            try {
                // Try to get location from browser
                navigator.geolocation.getCurrentPosition(
                    position => {
                        // Use reverse geocoding to get country and city
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;

                        // Use a free geocoding service
                        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`)
                            .then(response => response.json())
                            .then(data => {
                                if (data && data.address) {
                                    browserInfo.country = data.address.country;
                                    browserInfo.city = data.address.city || data.address.town || data.address.village;

                                    // Send browser info with location data
                                    sendBrowserInfoToServer(browserInfo);
                                }
                            })
                            .catch(() => {
                                // Send browser info without location data if geocoding fails
                                sendBrowserInfoToServer(browserInfo);
                            });
                    },
                    error => {
                        // Send browser info without location data if geolocation fails
                        sendBrowserInfoToServer(browserInfo);
                    }
                );
            } catch (e) {
                // Send browser info without location data if geolocation throws an error
                sendBrowserInfoToServer(browserInfo);
            }
        } else {
            // Send browser info without location data if geolocation is not supported
            sendBrowserInfoToServer(browserInfo);
        }
    }

    /**
     * Send browser information to the server
     *
     * @param {Object} browserInfo The browser information to send
     */
    function sendBrowserInfoToServer(browserInfo) {
        fetch(config.restUrl + 'browser-info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': embedpress_analytics?.nonce || ''
            },
            body: JSON.stringify(browserInfo),
            credentials: 'same-origin'
        })
        .then(response => response.json())
        .then(result => {
            if (config.debug) {
                console.log('EmbedPress Analytics: Browser info sent successfully', result);
            }
        })
        .catch(error => {
            if (config.debug) {
                console.error('EmbedPress Analytics: Error sending browser info', error);
            }
        });
    }

    /**
     * Set up mutation observer to track dynamically added embeds
     */
    function setupMutationObserver() {
        // Skip if MutationObserver is not supported
        if (!('MutationObserver' in window)) {
            return;
        }

        // Create observer for tracking when new elements are added to the DOM
        const observer = new MutationObserver((mutations) => {
            let needsUpdate = false;

            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(node => {
                        // Check if the added node is an element with data-embed-type
                        if (node.nodeType === 1 && node.getAttribute && node.getAttribute('data-embed-type')) {
                            prepareElementForTracking(node);
                            needsUpdate = true;
                        }

                        // Check if the added node contains elements with data-embed-type
                        if (node.nodeType === 1 && node.querySelectorAll) {
                            const embeds = node.querySelectorAll('[data-embed-type]');
                            if (embeds.length) {
                                embeds.forEach(prepareElementForTracking);
                                needsUpdate = true;
                            }
                        }
                    });
                }
            });

            // If new elements were added, update tracking
            if (needsUpdate) {
                setupIntersectionObserver();
                setupClickTracking();
            }
        });

        // Observe the entire document
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Generate a unique session ID
     *
     * @returns {string} A unique session ID
     */
    function generateSessionId() {
        return 'ep-' + Date.now() + '-' + Math.random().toString(36).substring(2, 10);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();