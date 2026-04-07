/**
 * EmbedPress Admin UI Entry Point
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import Settings from './Settings';
import Onboarding from './Onboarding';
import './MilestoneNotification.scss';

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

// Onboarding wizard app (rendered on the dedicated onboarding page)
const onboardingContainer = document.getElementById('embedpress-onboarding-root');
if (onboardingContainer) {
    const root = createRoot(onboardingContainer);
    root.render(<Onboarding />);
}
