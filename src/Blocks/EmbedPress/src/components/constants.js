/**
 * EmbedPress Block Constants
 * 
 * Constants used throughout the EmbedPress block
 */

// Provider detection patterns
export const PROVIDERS = {
    YOUTUBE: {
        name: 'YouTube',
        patterns: ['youtube.com', 'youtu.be'],
        type: 'video'
    },
    VIMEO: {
        name: 'Vimeo',
        patterns: ['vimeo.com'],
        type: 'video'
    },
    WISTIA: {
        name: 'Wistia',
        patterns: ['wistia.com'],
        type: 'video'
    },
    TWITTER: {
        name: 'Twitter',
        patterns: ['twitter.com', 'x.com'],
        type: 'social'
    },
    FACEBOOK: {
        name: 'Facebook',
        patterns: ['facebook.com'],
        type: 'social'
    },
    INSTAGRAM: {
        name: 'Instagram',
        patterns: ['instagram.com'],
        type: 'social'
    },
    TIKTOK: {
        name: 'TikTok',
        patterns: ['tiktok.com'],
        type: 'social'
    },
    GOOGLE_DOCS: {
        name: 'Google Docs',
        patterns: ['docs.google.com'],
        type: 'document'
    },
    GOOGLE_SHEETS: {
        name: 'Google Sheets',
        patterns: ['sheets.google.com'],
        type: 'document'
    },
    GOOGLE_SLIDES: {
        name: 'Google Slides',
        patterns: ['slides.google.com'],
        type: 'document'
    },
    CALENDLY: {
        name: 'Calendly',
        patterns: ['calendly.com'],
        type: 'calendar'
    },
    OPENSEA: {
        name: 'OpenSea',
        patterns: ['opensea.io'],
        type: 'nft'
    },
    SPREAKER: {
        name: 'Spreaker',
        patterns: ['spreaker.com'],
        type: 'audio'
    }
};

// Share positions
export const SHARE_POSITIONS = [
    { label: 'Right', value: 'right' },
    { label: 'Left', value: 'left' },
    { label: 'Top', value: 'top' },
    { label: 'Bottom', value: 'bottom' }
];

// Player presets
export const PLAYER_PRESETS = [
    { label: 'Default', value: 'preset-default' },
    { label: 'Modern', value: 'preset-modern' },
    { label: 'Classic', value: 'preset-classic' },
    { label: 'Minimal', value: 'preset-minimal' }
];

// YouTube layouts
export const YOUTUBE_LAYOUTS = [
    { label: 'Gallery', value: 'gallery' },
    { label: 'List', value: 'list' },
    { label: 'Carousel', value: 'carousel' }
];

// Instagram layouts
export const INSTAGRAM_LAYOUTS = [
    { label: 'Grid', value: 'insta-grid' },
    { label: 'Carousel', value: 'insta-carousel' },
    { label: 'Masonry', value: 'insta-masonry' }
];

// Calendly embed types
export const CALENDLY_EMBED_TYPES = [
    { label: 'Inline', value: 'inline' },
    { label: 'Popup Button', value: 'popup_button' },
    { label: 'Popup Link', value: 'popup_link' }
];

// Protection types
export const PROTECTION_TYPES = [
    { label: 'Password', value: 'password' },
    { label: 'User Role', value: 'role' },
    { label: 'Both', value: 'both' }
];

// Default dimensions
export const DEFAULT_DIMENSIONS = {
    width: '600',
    height: '400'
};

// API endpoints - Note: These are fallback URLs, actual URLs should come from localized data
export const API_ENDPOINTS = {
    OEMBED: '/wp-json/embedpress/v1/oembed/embedpress' // Fallback - use embedpressGutenbergData.restUrl in practice
};
