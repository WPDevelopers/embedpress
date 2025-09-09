/**
 * Event Tracking Utility
 * 
 * Utility for tracking events in EmbedPress.
 */

const trackEvent = (eventName, properties = {}) => {
    // For now, just log to console
    // In production, this would send to your analytics service
    console.log('EmbedPress Event:', eventName, properties);
    
    // You can integrate with Google Analytics, Mixpanel, etc. here
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, properties);
    }
};

export default trackEvent;
