/**
 * EmbedPress Gutenberg Blocks Entry Point
 *
 * This file registers all EmbedPress Gutenberg blocks
 * using the new centralized structure.
 */

// Import WordPress dependencies
const { __ } = wp.i18n;

// Import block registrations
import './EmbedPress/index.js';

// Register block category
if (wp.blocks && wp.blocks.registerBlockCollection) {
    wp.blocks.registerBlockCollection('embedpress', {
        title: __('EmbedPress', 'embedpress'),
        icon: 'embed-generic',
    });
}

console.log('EmbedPress Blocks loaded successfully with Essential Blocks structure!');
