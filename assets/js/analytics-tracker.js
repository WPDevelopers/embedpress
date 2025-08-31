(function() {
    'use strict';

    // Generate or load session ID from sessionStorage
    function getOrCreateSessionId() {
        const KEY = 'ep_session_id';
        let id = sessionStorage.getItem(KEY);
        if (!id) {
            id = 'ep-' + Date.now() + '-' + Math.random().toString(36).substring(2, 10);
            sessionStorage.setItem(KEY, id);
        }
        return id;
    }

    // Configuration
    const config = {
        viewThreshold: 49,
        viewDuration: 3000,
        viewResetCooldown: 60000, // Optional: allow re-counting views after 60s
        impressionCooldown: 5000, // Throttle repeated impressions
        debug: false,
        restUrl: embedpress_analytics?.rest_url || '/wp-json/embedpress/v1/analytics/',
        sessionId: getOrCreateSessionId(),
        pageUrl: embedpress_analytics?.page_url || window.location.href,
        postId: embedpress_analytics?.post_id || 0,
        ipLocationData: null,
        // Capture the original referrer on page load
        originalReferrer: document.referrer || ''
    };

    const trackedElements = new Map();
    const sessionData = {
        viewedContent: new Set(),
        clickedContent: new Set(),
        impressedContent: new Map() // contentId -> lastImpressionTime
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const element = entry.target;
            const data = trackedElements.get(element);
            if (!data) return;

            let visiblePercentage = Math.floor(entry.intersectionRatio * 100);
            if (visiblePercentage < config.viewThreshold && entry.isIntersecting) {
                const rect = entry.boundingClientRect;
                const vh = window.innerHeight, vw = window.innerWidth;
                const visibleH = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
                const visibleW = Math.min(rect.right, vw) - Math.max(rect.left, 0);
                const viewportCoverage = (visibleH * visibleW) / (vh * vw) * 100;
                if (viewportCoverage >= 30) {
                    visiblePercentage = Math.max(visiblePercentage, config.viewThreshold);
                }
            }

            data.viewportPercentage = visiblePercentage;
            data.inViewport = entry.isIntersecting;

            if (entry.isIntersecting) {
                trackImpression(element, data);
            }

            handleViewTracking(element, data, visiblePercentage);
        });
    }, {
        threshold: Array.from({ length: 11 }, (_, i) => i / 10)
    });

    function trackImpression(element, data) {
        const now = Date.now();
        const last = sessionData.impressedContent.get(data.contentId) || 0;

        if (now - last < config.impressionCooldown) return;
        sessionData.impressedContent.set(data.contentId, now);
        data.lastImpressionTime = now;

        if (config.debug) console.log('📊 Impression:', data.contentId);

        sendTrackingData({
            content_id: data.contentId,
            interaction_type: 'impression',
            interaction_data: {
                embed_type: data.embedType,
                embed_url: data.embedUrl,
                viewport_percentage: data.viewportPercentage,
                location_data: config.ipLocationData
            }
        });
    }

    function handleViewTracking(element, data, visiblePercentage) {
        if (!data.inViewport || visiblePercentage < config.viewThreshold) {
            if (data.viewTimer) {
                clearTimeout(data.viewTimer);
                data.viewTimer = null;
            }
            return;
        }

        const now = Date.now();

        // Optional: allow re-tracking views if cooldown passed
        if (data.viewTracked && now - (data.lastViewTime || 0) > config.viewResetCooldown) {
            data.viewTracked = false;
        }

        if (data.viewTracked || sessionData.viewedContent.has(data.contentId)) return;

        if (!data.viewTimer) {
            data.viewTimer = setTimeout(() => {
                trackView(element, data);
                data.viewTracked = true;
                data.lastViewTime = Date.now();
                sessionData.viewedContent.add(data.contentId);
                data.viewTimer = null;
            }, config.viewDuration);
        }
    }

    function trackView(element, data) {
        if (config.debug) console.log('👁️ View:', data.contentId);

        sendTrackingData({
            content_id: data.contentId,
            interaction_type: 'view',
            interaction_data: {
                embed_type: data.embedType,
                embed_url: data.embedUrl,
                viewport_percentage: data.viewportPercentage,
                view_duration: config.viewDuration
            }
        });
    }

    function setupClickTracking() {
        trackedElements.forEach((data, element) => {
            element.addEventListener('click', () => {
                if (sessionData.clickedContent.has(data.contentId)) return;
                sessionData.clickedContent.add(data.contentId);
                if (config.debug) console.log('🖱️ Click:', data.contentId);
                sendTrackingData({
                    content_id: data.contentId,
                    interaction_type: 'click',
                    interaction_data: {
                        embed_type: data.embedType,
                        embed_url: data.embedUrl
                    }
                });
            });
        });
    }

    function prepareElementForTracking(element) {
        if (trackedElements.has(element)) return;

        const embedType = element.getAttribute('data-embed-type');
        if (!embedType) return;

        let contentId = element.getAttribute('data-embedpress-content') ||
                        element.getAttribute('data-source-id') ||
                        element.getAttribute('data-emid') ||
                        'ep-' + embedType + '-' + Math.random().toString(36).substring(2, 10);

        element.setAttribute('data-embedpress-content', contentId);

        const data = {
            contentId,
            embedType,
            embedUrl: getEmbedUrl(element),
            inViewport: false,
            viewTimer: null,
            viewTracked: false,
            lastImpressionTime: 0,
            lastViewTime: 0,
            viewportPercentage: 0
        };

        trackedElements.set(element, data);
        observer.observe(element);
    }

    function getEmbedUrl(element) {
        const iframe = element.querySelector('iframe');
        const video = element.querySelector('video source');
        const audio = element.querySelector('audio source');
        const embed = element.querySelector('embed');
        const object = element.querySelector('object');

        return iframe?.src || video?.src || audio?.src || embed?.src || object?.data ||
               element.getAttribute('data-url') ||
               element.getAttribute('data-src') ||
               element.getAttribute('href') || '';
    }

    function findAndTrackEmbeds() {
        document.querySelectorAll('[data-embed-type]').forEach(prepareElementForTracking);
    }

    function setupMutationObserver() {
        if (!('MutationObserver' in window)) return;
        const mo = new MutationObserver((mutations) => {
            mutations.forEach(m => {
                m.addedNodes.forEach(n => {
                    if (n.nodeType !== 1) return;
                    if (n.getAttribute?.('data-embed-type')) prepareElementForTracking(n);
                    n.querySelectorAll?.('[data-embed-type]').forEach(prepareElementForTracking);
                });
            });
        });
        mo.observe(document.body, { childList: true, subtree: true });
    }

    function sendTrackingData(data) {
        // Skip tracking if embed type is unknown or empty
        if (!data.interaction_data?.embed_type ||
            data.interaction_data.embed_type === 'unknown' ||
            data.interaction_data.embed_type === '') {
            if (config.debug) console.log('⏭️ Skipping tracking for unknown embed type:', data.content_id);
            return;
        }

        const trackingData = {
            ...data,
            session_id: config.sessionId,
            page_url: config.pageUrl,
            post_id: config.postId,
            // Send the original referrer captured on page load
            original_referrer: config.originalReferrer
        };

        fetch(config.restUrl + 'track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': embedpress_analytics?.nonce || ''
            },
            body: JSON.stringify(trackingData),
            credentials: 'same-origin'
        }).catch(err => {
            if (navigator.sendBeacon) {
                const blob = new Blob([JSON.stringify(trackingData)], { type: 'application/json' });
                navigator.sendBeacon(config.restUrl + 'track', blob);
            }
        });
    }

    async function getIPLocationData() {
        try {
            const res = await fetch('https://ipinfo.io/json');
            const data = await res.json();
            config.ipLocationData = {
                country: data.country,
                city: data.city,
                timezone: data.timezone,
                source: 'ip'
            };
        } catch {
            return null;
        }
    }

    function sendBrowserInfo() {
        const info = {
            session_id: config.sessionId,
            screen_resolution: window.screen.width + 'x' + window.screen.height,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            user_agent: navigator.userAgent
        };
        getIPLocationData().then(() => {
            if (config.ipLocationData) {
                info.country = config.ipLocationData.country;
                info.city = config.ipLocationData.city;
            }
            fetch(config.restUrl + 'browser-info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': embedpress_analytics?.nonce || ''
                },
                body: JSON.stringify(info),
                credentials: 'same-origin'
            });
        });
    }

    function init() {
        findAndTrackEmbeds();
        setupClickTracking();
        setupMutationObserver();
        sendBrowserInfo();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
