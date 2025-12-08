/**
 * EmbedPress Lazy Load
 * 
 * Custom lazy loading implementation for iframe embeds using Intersection Observer API
 * Only loads iframes when they're about to enter the viewport
 * 
 * @package EmbedPress
 * @since 4.0.0
 */

(function() {
    'use strict';

    // Check if Intersection Observer is supported
    if (!('IntersectionObserver' in window)) {
        console.warn('EmbedPress Lazy Load: IntersectionObserver not supported, loading all iframes immediately');
        loadAllIframes();
        return;
    }

    /**
     * Get dynamic root margin based on viewport height
     * This prevents lazy loading from triggering immediately on short pages
     * Uses 50% of viewport height or 200px, whichever is smaller
     */
    function getObserverConfig() {
        const viewportHeight = window.innerHeight;
        const margin = Math.min(200, Math.max(50, viewportHeight * 0.25));

        return {
            rootMargin: margin + 'px 0px',
            threshold: 0.01
        };
    }

    const observerConfig = getObserverConfig();

    /**
     * Callback function when iframe placeholder enters viewport
     */
    function onIntersection(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const placeholder = entry.target;
                loadIframe(placeholder);
                observer.unobserve(placeholder);
            }
        });
    }

    /**
     * Load the actual iframe from placeholder
     */
    function loadIframe(placeholder) {
        const iframeSrc = placeholder.getAttribute('data-ep-lazy-src');

        if (!iframeSrc) {
            console.warn('EmbedPress Lazy Load: No data-ep-lazy-src found on placeholder');
            return;
        }

        // Create iframe element
        const iframe = document.createElement('iframe');
        iframe.src = iframeSrc;

        // Copy style
        const iframeStyle = placeholder.getAttribute('data-ep-iframe-style');
        if (iframeStyle) {
            iframe.setAttribute('style', iframeStyle);
        }

        // Copy all data-ep-iframe-* attributes
        Array.from(placeholder.attributes).forEach(function(attr) {
            if (attr.name.startsWith('data-ep-iframe-')) {
                const iframeAttr = attr.name.replace('data-ep-iframe-', '');
                if (iframeAttr !== 'style') {
                    iframe.setAttribute(iframeAttr, attr.value);
                }
            }
        });

        // Copy class (remove placeholder class)
        if (placeholder.hasAttribute('class')) {
            const classes = placeholder.getAttribute('class').replace(/ep-lazy-iframe-placeholder/g, '').trim();
            if (classes) {
                iframe.setAttribute('class', classes);
            }
        }

        // Copy other important attributes
        ['data-emid', 'data-embedpress-content', 'data-embed-type', 'title'].forEach(function(attr) {
            if (placeholder.hasAttribute(attr)) {
                iframe.setAttribute(attr, placeholder.getAttribute(attr));
            }
        });

        // Replace placeholder with iframe
        if (placeholder.parentNode) {
            placeholder.parentNode.replaceChild(iframe, placeholder);
        }
    }

    /**
     * Fallback: Load all iframes immediately (for unsupported browsers)
     */
    function loadAllIframes() {
        const placeholders = document.querySelectorAll('.ep-lazy-iframe-placeholder');
        placeholders.forEach(function(placeholder) {
            // Add 2 second delay before loading iframe
            loadIframe(placeholder);
        });
    }

    /**
     * Initialize lazy loading
     */
    function initLazyLoad() {
        const placeholders = document.querySelectorAll('.ep-lazy-iframe-placeholder');
        
        if (placeholders.length === 0) {
            return;
        }

        // Create observer
        const observer = new IntersectionObserver(onIntersection, observerConfig);

        // Observe all placeholders
        placeholders.forEach(function(placeholder) {
            observer.observe(placeholder);
        });
    }

    /**
     * Run on DOM ready
     */
    if (document.readyState === 'loading') {
        // Add 2 second delay before initializing lazy load
        setTimeout(initLazyLoad, 1000);
    } else {
        setTimeout(initLazyLoad, 1000);
    }

    /**
     * Re-initialize for dynamically added content (e.g., AJAX loaded content)
     */
    window.epReinitLazyLoad = initLazyLoad;

})();

