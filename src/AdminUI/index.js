/**
 * EmbedPress Admin UI Entry Point
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import Settings from './Settings';
import './MilestoneNotification.scss';
import '../Shared/styles/admin.scss';

// Settings / dashboard app
const settingsContainer = document.getElementById('embedpress-admin-root');
if (settingsContainer) {
    const root = createRoot(settingsContainer);
    root.render(
        <div className="embedpress-admin">
            <Settings />
        </div>
    );
}
