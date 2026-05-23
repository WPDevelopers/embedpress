/**
 * EmbedPress Google Reviews — admin entry
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import GoogleReviews from './GoogleReviews.jsx';
import './google-reviews.scss';

const container = document.getElementById('embedpress-google-reviews-root');
if (container) {
    const root = createRoot(container);
    root.render(<GoogleReviews />);
}
