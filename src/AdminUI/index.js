/**
 * EmbedPress Admin UI Entry Point
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import Settings from './Settings';

// Simple admin initialization
const App = () => {
    return (
        <div className="embedpress-admin">
            <Settings />
        </div>
    );
};

// Initialize the app
const container = document.getElementById('embedpress-admin-root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
