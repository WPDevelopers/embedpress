
/**
 * EmbedPress Analytics Page Entry Point
 * Standalone analytics component for the admin analytics page
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import AnalyticsDashboard from './components/AnalyticsDashboard';

import './style.scss';

const AnalyticsApp = () => {
    return (
        <div className="embedpress-analytics-wrapper">
            <AnalyticsDashboard />
        </div>
    );
};

// Initialize the analytics app when DOM is ready
const initAnalytics = () => {
    const container = document.getElementById('embedpress-analytics-root');
    if (container) {
        const root = createRoot(container);
        root.render(<AnalyticsApp />);
    }
};

// Auto-initialize if DOM is ready, otherwise wait for it
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnalytics);
} else {
    initAnalytics();
}

// Export for manual initialization if needed
window.EmbedPressAnalytics = {
    init: initAnalytics,
    component: AnalyticsApp
};

export default AnalyticsApp;
