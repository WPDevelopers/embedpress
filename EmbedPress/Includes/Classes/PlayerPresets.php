<?php
/**
 * Custom Player preset registry — PHP mirror of player-presets.js.
 *
 * Single source of truth for Elementor / REST / server-side renderers.
 * Each entry maps a stored slug (which is also the CSS class on the
 * wrapper) to a user-facing name and a one-line tagline.
 *
 * Pro presets MUST register here too (via the `embedpress_player_presets`
 * filter from embedpress-pro) so the free picker can render lock badges
 * for them.
 */

namespace EmbedPress\Includes\Classes;

defined('ABSPATH') || die("No direct script access allowed.");

class PlayerPresets
{
    /**
     * @return array<int, array{slug:string,name:string,tagline:string,description:string,isPro:bool}>
     */
    public static function all()
    {
        $presets = [
            [
                'slug'        => 'preset-default',
                'name'        => __('Brand', 'embedpress'),
                'tagline'     => __('Picks up your brand color and stays out of the way.', 'embedpress'),
                'description' => __('The safe default — minimal chrome, single-color control bar that respects your palette. Great for marketing pages and content sites.', 'embedpress'),
                'isPro'       => false,
            ],
            [
                'slug'        => 'custom-player-preset-1',
                'name'        => __('Obsidian', 'embedpress'),
                'tagline'     => __('Cinema-grade focus. Controls fade so the video is the hero.', 'embedpress'),
                'description' => __('Deep black control bar, low-contrast icons, auto-hide during playback. Made for storytelling, film, and premium video.', 'embedpress'),
                'isPro'       => false,
            ],
            [
                'slug'        => 'custom-player-preset-3',
                'name'        => __('Aurora', 'embedpress'),
                'tagline'     => __('Soft gradient halos and a polished, modern feel.', 'embedpress'),
                'description' => __('Subtle gradient highlights on hover, smooth shadows, white range fill. Ideal for creators and lifestyle brands.', 'embedpress'),
                'isPro'       => false,
            ],
            [
                'slug'        => 'ep-preset-velvet',
                'name'        => __('Velvet', 'embedpress'),
                'tagline'     => __('Frosted-glass controls. Premium feel for portfolios and launches.', 'embedpress'),
                'description' => __('Backdrop-blur control bar, large rounded buttons, soft shadow. Looks beautiful over imagery.', 'embedpress'),
                'isPro'       => true,
            ],
            [
                'slug'        => 'ep-preset-compass',
                'name'        => __('Compass', 'embedpress'),
                'tagline'     => __('Chapter-forward layout — viewers always know where they are.', 'embedpress'),
                'description' => __('Visible chapter markers above the timeline, breadcrumb-style navigation. Long-form videos and tutorials feel navigable.', 'embedpress'),
                'isPro'       => true,
            ],
            [
                'slug'        => 'ep-preset-spotlight',
                'name'        => __('Spotlight', 'embedpress'),
                'tagline'     => __('Vignette focus that draws every eye to your video.', 'embedpress'),
                'description' => __('Subtle vignette and play-button glow that intensifies on hover. Built for landing pages where one video is the centerpiece.', 'embedpress'),
                'isPro'       => true,
            ],
            [
                'slug'        => 'ep-preset-pulse',
                'name'        => __('Pulse', 'embedpress'),
                'tagline'     => __('Wide audio bar with cover art. Built for podcasts.', 'embedpress'),
                'description' => __('Animated waveform progress, large cover image, intentional layout. Looks like a podcast app, not a leftover video player.', 'embedpress'),
                'isPro'       => true,
            ],
        ];

        /**
         * Filter the player preset registry. embedpress-pro registers
         * its CSS-backed presets here and free renders them with a lock
         * badge until the user upgrades.
         */
        return apply_filters('embedpress_player_presets', $presets);
    }

    /**
     * Slug → user-facing name map, suitable for Elementor SelectControl options.
     * @return array<string, string>
     */
    public static function as_select_options()
    {
        $opts = [];
        foreach (self::all() as $preset) {
            $label = $preset['name'];
            if (!empty($preset['isPro']) && !defined('EMBEDPRESS_SL_ITEM_SLUG')) {
                $label .= ' ' . __('(Pro)', 'embedpress');
            }
            $opts[$preset['slug']] = $label;
        }
        return $opts;
    }

    public static function default_slug()
    {
        return 'preset-default';
    }

    /**
     * Translate legacy / unknown slugs to a current entry.
     */
    public static function normalize_slug($slug)
    {
        if (empty($slug)) return self::default_slug();
        foreach (self::all() as $preset) {
            if ($preset['slug'] === $slug) return $slug;
        }
        $legacy = [
            'preset-1' => 'custom-player-preset-1',
            'preset-2' => 'custom-player-preset-1',
            'preset-3' => 'custom-player-preset-3',
            'preset-4' => 'custom-player-preset-3',
        ];
        return $legacy[$slug] ?? self::default_slug();
    }
}
