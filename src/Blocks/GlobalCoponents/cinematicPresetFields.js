/**
 * Per-preset content field visibility for Cinematic Preview.
 *
 * Each preset is a layout *and* a content shape — Netflix Hero shows a
 * synopsis + meta row + More Info button, Disney+ shows just a tagline,
 * Logo-as-Title swaps the title text for an uploaded logo, etc. Fields the
 * preset doesn't read are hidden in the inspector to avoid orphan controls.
 *
 * Source of truth for both free's upsell placeholders
 * (`cinematic-preview-controls.js`) and Pro's real controls
 * (`embedpress-pro/Gutenberg/src/filters/youtube.js`). When you add or
 * rename a preset, update this map in lockstep with the CSS/JS that
 * actually paints the overlay.
 *
 * Universal fields (thumbnail, play button colors, overlay color/opacity,
 * play action) apply to every preset and are not listed here.
 */
export const CINEMATIC_PRESET_FIELDS = {
    'netflix-hero':       { title: true,  logo: false, synopsis: true,  badges: true,  meta: true,  infoBtn: true  },
    'prime-video':        { title: true,  logo: false, synopsis: false, badges: true,  meta: true,  infoBtn: false },
    'disney-plus':        { title: true,  logo: false, synopsis: true,  badges: false, meta: false, infoBtn: false },
    'apple-tv-cinematic': { title: true,  logo: false, synopsis: false, badges: false, meta: false, infoBtn: false },
    'minimal':            { title: true,  logo: false, synopsis: false, badges: false, meta: false, infoBtn: false },
    'logo-as-title':      { title: false, logo: true,  synopsis: false, badges: false, meta: false, infoBtn: false },
};

export const cinematicFieldsFor = (style) =>
    CINEMATIC_PRESET_FIELDS[style] || CINEMATIC_PRESET_FIELDS['netflix-hero'];
