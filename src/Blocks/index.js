/**
 * EmbedPress Gutenberg Blocks Entry Point
 *
 * This file registers all EmbedPress Gutenberg blocks
 * using the new centralized structure.
 */

// Import WordPress dependencies
const { __ } = wp.i18n;

import { EPIcon } from './GlobalCoponents/icons.js';

// Import block registrations
import './EmbedPress/src/index.js';
import './document/src/index.js';
import './embedpress-pdf/src/index.js';
import './embedpress-calendar/src/index.js';
import './google-docs/src/index.js';
import './google-slides/src/index.js';
import './google-sheets/src/index.js';
import './google-forms/src/index.js';
import './google-drawings/src/index.js';
import './google-maps/src/index.js';
import './twitch/src/index.js';
import './wistia/src/index.js';
import './youtube/src/index.js';

// Register block category
if (wp.blocks && wp.blocks.registerBlockCollection) {
    wp.blocks.registerBlockCollection('embedpress', {
        title: __('EmbedPress', 'embedpress'),
        icon: EPIcon,
    });
}
