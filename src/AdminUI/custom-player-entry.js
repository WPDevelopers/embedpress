/**
 * EmbedPress Custom Player Admin — React entry point.
 *
 * Mounts the marketing/learning data dashboard (Leads, Heatmap, Completions)
 * collected by the Pro custom-player features (PRD #81243). Distinct from
 * the Analytics dashboard, which covers passive view/click measurement.
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import CustomPlayer from './CustomPlayer';
import './custom-player.scss';

const container = document.getElementById('embedpress-custom-player-root');
if (container) {
    const root = createRoot(container);
    root.render(<CustomPlayer />);
}
