/**
 * Custom Player presets — single source of truth for Gutenberg.
 *
 * Each entry pairs an internal `slug` (the value stored in
 * attribute / data-options / CSS class) with a user-facing name and a
 * one-line "why pick this" tagline that the inspector renders on each
 * preset card. Pro presets are gated via `isPro` and rendered with a
 * lock badge — they always appear in the picker so users can see what
 * they unlock by upgrading.
 *
 * NOTE: legacy slugs (preset-default, custom-player-preset-1/3) are kept
 * as `slug` values verbatim so existing saved posts keep matching the CSS
 * unchanged. The user-facing rename happens at the label layer only.
 */

const { __ } = wp.i18n;

export const PLAYER_PRESETS = [
    {
        slug: 'preset-default',
        name: __('Brand', 'embedpress'),
        tagline: __('Picks up your brand color and stays out of the way.', 'embedpress'),
        description: __('The safe default — minimal chrome, single-color control bar that respects your palette. Great for marketing pages and content sites.', 'embedpress'),
        isPro: false,
    },
    {
        slug: 'custom-player-preset-1',
        name: __('Obsidian', 'embedpress'),
        tagline: __('Cinema-grade focus. Controls fade so the video is the hero.', 'embedpress'),
        description: __('Deep black control bar, low-contrast icons, auto-hide during playback. Made for storytelling, film, and premium video.', 'embedpress'),
        isPro: false,
    },
    {
        slug: 'custom-player-preset-3',
        name: __('Aurora', 'embedpress'),
        tagline: __('Soft gradient halos and a polished, modern feel.', 'embedpress'),
        description: __('Subtle gradient highlights on hover, smooth shadows, white range fill. Ideal for creators and lifestyle brands.', 'embedpress'),
        isPro: false,
    },
    // Pro presets — slugs reserved for upcoming styles. Listed here so the
    // free picker can render lock badges; Pro registers the CSS separately.
    {
        slug: 'ep-preset-velvet',
        name: __('Velvet', 'embedpress'),
        tagline: __('Frosted-glass controls. Premium feel for portfolios and launches.', 'embedpress'),
        description: __('Backdrop-blur control bar, large rounded buttons, soft shadow. Looks beautiful over imagery.', 'embedpress'),
        isPro: true,
    },
    {
        slug: 'ep-preset-compass',
        name: __('Compass', 'embedpress'),
        tagline: __('Chapter-forward layout — viewers always know where they are.', 'embedpress'),
        description: __('Visible chapter markers above the timeline, breadcrumb-style navigation. Long-form videos and tutorials feel navigable.', 'embedpress'),
        isPro: true,
    },
    {
        slug: 'ep-preset-spotlight',
        name: __('Spotlight', 'embedpress'),
        tagline: __('Vignette focus that draws every eye to your video.', 'embedpress'),
        description: __('Subtle vignette and play-button glow that intensifies on hover. Built for landing pages where one video is the centerpiece.', 'embedpress'),
        isPro: true,
    },
    {
        slug: 'ep-preset-pulse',
        name: __('Pulse', 'embedpress'),
        tagline: __('Wide audio bar with cover art. Built for podcasts.', 'embedpress'),
        description: __('Animated waveform progress, large cover image, intentional layout. Looks like a podcast app, not a leftover video player.', 'embedpress'),
        isPro: true,
    },
];

export const getPresetBySlug = (slug) =>
    PLAYER_PRESETS.find((p) => p.slug === slug) || PLAYER_PRESETS[0];

export const getDefaultPresetSlug = () => PLAYER_PRESETS[0].slug;

/** Map legacy / unknown slugs to the closest current entry. */
export const normalizePresetSlug = (slug) => {
    if (!slug) return getDefaultPresetSlug();
    const found = PLAYER_PRESETS.find((p) => p.slug === slug);
    if (found) return found.slug;
    // Older builds used numbered aliases.
    const legacyMap = {
        'preset-1': 'custom-player-preset-1',
        'preset-2': 'custom-player-preset-1',
        'preset-3': 'custom-player-preset-3',
        'preset-4': 'custom-player-preset-3',
    };
    return legacyMap[slug] || getDefaultPresetSlug();
};
