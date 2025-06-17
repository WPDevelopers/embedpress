/**
 * EmbedPress Admin Dashboard Entry Point
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import components
import Dashboard from './Dashboard';
import Analytics from './Analytics';
import Settings from './Settings';
import Onboarding from './Onboarding';

// Import shared components
import { Layout } from '@components/Layout';
import { ErrorBoundary } from '@components/ErrorBoundary';

// Import styles
import '@/Shared/styles/admin.scss';

const App = () => {
    return (
        <ErrorBoundary>
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/onboarding" element={<Onboarding />} />
                    </Routes>
                </Layout>
            </Router>
        </ErrorBoundary>
    );
};

// Initialize the app
const container = document.getElementById('embedpress-admin-root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
