(function() {
    'use strict';

    // Generate or load user ID from localStorage (persistent across sessions)
    function getOrCreateUserId() {
        const STORAGE_KEY = 'ep_user_id';

        // Try to get existing user ID from localStorage
        let userId = localStorage.getItem(STORAGE_KEY);

        if (!userId) {
            // Generate new persistent user ID
            userId = 'ep-user-' + Date.now() + '-' + Math.random().toString(36).substring(2, 15);
            localStorage.setItem(STORAGE_KEY, userId);
        }

        return userId;
    }

    // Generate session ID for current browser session (for deduplication within session)
    function getOrCreateSessionId() {
        const KEY = 'ep_session_id';
        let id = sessionStorage.getItem(KEY);
        if (!id) {
            id = 'ep-sess-' + Date.now() + '-' + Math.random().toString(36).substring(2, 10);
            sessionStorage.setItem(KEY, id);
        }
        return id;
    }

    // Get original referrer for this session only (not persistent across browser sessions)
    function getSessionReferrer() {
        const KEY = 'ep_original_referrer';
        let referrer = sessionStorage.getItem(KEY);

        // If no referrer stored yet and we have a document.referrer
        if (!referrer && document.referrer) {
            // Only store external referrers (not same-site navigation)
            try {
                const currentDomain = window.location.hostname;
                const referrerDomain = new URL(document.referrer).hostname;

                if (referrerDomain && referrerDomain !== currentDomain) {
                    referrer = document.referrer;
                    sessionStorage.setItem(KEY, referrer);
                }
            } catch (e) {
                // Invalid URL, ignore
            }
        }

        return referrer || '';
    }



    // Configuration
    const config = {
        viewThreshold: 49,
        viewDuration: 3000,
        viewResetCooldown: 60000, // Optional: allow re-counting views after 60s
        impressionCooldown: 5000, // Throttle repeated impressions
        clickCooldown: 2000, // Throttle repeated clicks
        debug: false,
        restUrl: embedpress_analytics?.rest_url || '/wp-json/embedpress/v1/analytics/',
        userId: getOrCreateUserId(),
        sessionId: getOrCreateSessionId(),
        pageUrl: embedpress_analytics?.page_url || window.location.href,
        postId: embedpress_analytics?.post_id || 0,
        ipLocationData: null
    };

    const trackedElements = new Map();
    const sessionData = {
        viewedContent: new Set(),
        clickedContent: new Map(), // contentId -> lastClickTime
        impressedContent: new Map() // contentId -> lastImpressionTime
    };

    // Get browser fingerprint for deduplication
    function getBrowserFingerprint() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('Browser fingerprint', 2, 2);

        return btoa(JSON.stringify({
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            screen: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            canvas: canvas.toDataURL()
        })).substring(0, 32);
    }

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
            user_id: config.userId,
            session_id: config.sessionId,
            page_url: config.pageUrl,
            interaction_data: {
                embed_type: data.embedType,
                embed_url: data.embedUrl,
                viewport_percentage: data.viewportPercentage,
                location_data: config.ipLocationData,
                browser_fingerprint: getBrowserFingerprint()
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
            user_id: config.userId,
            session_id: config.sessionId,
            page_url: config.pageUrl,
            view_duration: data.viewDuration || config.viewDuration || 0,
            interaction_data: {
                embed_type: data.embedType,
                embed_url: data.embedUrl,
                viewport_percentage: data.viewportPercentage,
                view_duration: data.viewDuration || config.viewDuration || 0,
                browser_fingerprint: getBrowserFingerprint()
            }
        });
    }

    function setupClickTracking() {
        trackedElements.forEach((data, element) => {
            element.addEventListener('click', () => {
                const now = Date.now();
                const last = sessionData.clickedContent.get(data.contentId) || 0;

                if (now - last < config.clickCooldown) return;
                sessionData.clickedContent.set(data.contentId, now);

                if (config.debug) console.log('🖱️ Click:', data.contentId);
                sendTrackingData({
                    content_id: data.contentId,
                    interaction_type: 'click',
                    user_id: config.userId,
                    session_id: config.sessionId,
                    page_url: config.pageUrl,
                    interaction_data: {
                        embed_type: data.embedType,
                        embed_url: data.embedUrl,
                        browser_fingerprint: getBrowserFingerprint()
                    }
                });
            });
        });
    }

    function prepareElementForTracking(element) {
        if (trackedElements.has(element)) return;

        const embedType = element.getAttribute('data-embed-type');
        if (!embedType) return;

        // Get a stable content ID based on embed URL or existing attributes
        let contentId = element.getAttribute('data-embedpress-content') ||
                        element.getAttribute('data-source-id') ||
                        element.getAttribute('data-emid');

        if (!contentId) {
            // Generate stable ID based on embed URL or iframe src
            const embedUrl = element.getAttribute('data-embed-url') ||
                            element.querySelector('iframe')?.src ||
                            element.querySelector('embed')?.src ||
                            element.querySelector('object')?.data ||
                            window.location.href;

            // Create a hash-based ID that will be consistent for the same content
            contentId = 'ep-' + embedType + '-' + btoa(embedUrl).replace(/[^a-zA-Z0-9]/g, '').substring(0, 10);
        }

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
            // Only set these if not already provided in data
            user_id: data.user_id || config.userId,
            session_id: data.session_id || config.sessionId,
            page_url: data.page_url || config.pageUrl,
            post_id: data.post_id || config.postId,
            original_referrer: data.original_referrer || getSessionReferrer()
        };

        // Debug logging
        if (config.debug) {
            console.log('📤 Sending tracking data:', trackingData);
        }

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
        const fingerprint = getBrowserFingerprint();
        const info = {
            user_id: config.userId,
            session_id: config.sessionId,
            browser_fingerprint: fingerprint,
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
        // Check if tracking is enabled before initializing
        if (embedpress_analytics?.tracking_enabled === false) {
            if (config.debug) console.log('📊 Analytics tracking is disabled');
            return;
        }

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
