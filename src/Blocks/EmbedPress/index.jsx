/**
 * EmbedPress Main Embed Block
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

// Import components
import Edit from './Edit';
import Save from './Save';

// Import styles
import './style.scss';
import './editor.scss';

// Block attributes
const attributes = {
    url: {
        type: 'string',
        default: '',
    },
    width: {
        type: 'string',
        default: '',
    },
    height: {
        type: 'string',
        default: '',
    },
    responsive: {
        type: 'boolean',
        default: true,
    },
    // Social sharing attributes
    shareFacebook: {
        type: 'boolean',
        default: true,
    },
    shareTwitter: {
        type: 'boolean',
        default: true,
    },
    sharePinterest: {
        type: 'boolean',
        default: true,
    },
    shareLinkedin: {
        type: 'boolean',
        default: true,
    },
    // Analytics attributes
    trackViews: {
        type: 'boolean',
        default: true,
    },
    trackClicks: {
        type: 'boolean',
        default: true,
    },
};

// Check if WordPress functions are available
if (typeof registerBlockType !== 'undefined') {
    // Register the block
    registerBlockType('embedpress/embedpress', {
        title: __('EmbedPress block title', 'embedpress'),
        description: __('Embed content from 150+ providers with advanced customization options.', 'embedpress'),
        category: 'embed',
        icon: 'embed-generic',
        keywords: [
            __('embed', 'embedpress'),
            __('video', 'embedpress'),
            __('social', 'embedpress'),
        ],
        attributes,
        edit: Edit,
        save: Save,
        supports: {
            align: ['wide', 'full'],
            html: false,
        },
        example: {
            attributes: {
                url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            },
        },
    });

    console.log('EmbedPress block registered successfully');
} else {
    console.error('WordPress registerBlockType function not available');
}
