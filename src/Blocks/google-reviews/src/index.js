/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

/**
 * Internal dependencies
 */
import Edit from './edit.js';
import metadata from '../block.json';
import './editor.scss';

const attributes = {
    placeId:   { type: 'string',  default: '' },
    placeName: { type: 'string',  default: '' },
    limit:     { type: 'number',  default: 3 },
    minRating: { type: 'number',  default: 0 },
    layout:    { type: 'string',  default: 'list' },
    showPhoto: { type: 'boolean', default: true },
    showStars: { type: 'boolean', default: true },
    showDate:  { type: 'boolean', default: true },
    showLink:  { type: 'boolean', default: true },
};

// Inline SVG icon — five-pointed star.
const googleReviewsIcon = wp.element.createElement(
    'svg',
    { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', width: 24, height: 24, fill: '#5b4e96' },
    wp.element.createElement('path', {
        d: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    })
);

let shouldRegister = false;
if (
    typeof embedpressGutenbergData !== 'undefined' &&
    embedpressGutenbergData.activeBlocks &&
    embedpressGutenbergData.activeBlocks['google-reviews']
) {
    shouldRegister = true;
}

if (shouldRegister) {
    registerBlockType(metadata.name, {
        ...metadata,
        icon: googleReviewsIcon,
        attributes,
        keywords: [
            __('embedpress', 'embedpress'),
            __('google', 'embedpress'),
            __('reviews', 'embedpress'),
            __('places', 'embedpress'),
            __('business', 'embedpress'),
        ],
        edit: Edit,
        // Dynamic block — render handled server-side via PHP render_callback.
        save: () => null,
    });
}
