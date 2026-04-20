/**
 * EmbedPress Onboarding Wizard Entry Point
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import Onboarding from './Onboarding';
import './onboarding.scss';

const onboardingContainer = document.getElementById('embedpress-onboarding-root');
if (onboardingContainer) {
    const root = createRoot(onboardingContainer);
    root.render(<Onboarding />);
}
