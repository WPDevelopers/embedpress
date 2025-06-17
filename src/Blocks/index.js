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

// Register block category
if (wp.blocks && wp.blocks.registerBlockCollection) {
    wp.blocks.registerBlockCollection('embedpress', {
        title: __('EmbedPress', 'embedpress'),
        icon: EPIcon,
    });
}
