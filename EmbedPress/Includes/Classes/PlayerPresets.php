<?php
/**
 * Custom Player preset registry.
 *
 * Two families of presets coexist:
 *   • Legacy   — render through Plyr's native controls + plyr.css
 *                (preset-default, custom-player-preset-1, custom-player-preset-3).
 *                Behaviour byte-identical to master; we never touch them.
 *   • New      — slug starts with `ep-`. Plyr is mounted with controls:false
 *                and our own DOM controls render on top, styled by
 *                static/css/ep-player.css. plyr.css is irrelevant for these.
 *
 * The runtime branch lives in static/js/initplyr.js; it inspects
 * `options.player_preset` and delegates to window.epPlayer when the slug
 * starts with `ep-`. Both families use the same Plyr instance underneath —
 * "new" only changes the UI layer.
 */

namespace EmbedPress\Includes\Classes;

defined('ABSPATH') || die("No direct script access allowed.");

class PlayerPresets
{
    const NEW_PREFIX = 'ep-';

    /**
     * @return array<int, array{slug:string,name:string,tagline:string,is_legacy:bool,is_pro:bool}>
     */
    public static function all()
    {
        $presets = [
            // Legacy — keep slugs verbatim so existing posts keep matching the CSS.
            [
                'slug'      => 'preset-default',
                'name'      => __('Default', 'embedpress'),
                'tagline'   => __('Plyr default skin.', 'embedpress'),
                'is_legacy' => true,
                'is_pro'    => false,
            ],
            [
                'slug'      => 'custom-player-preset-1',
                'name'      => __('Preset 1', 'embedpress'),
                'tagline'   => __('Legacy custom skin.', 'embedpress'),
                'is_legacy' => true,
                'is_pro'    => false,
            ],
            [
                'slug'      => 'custom-player-preset-3',
                'name'      => __('Preset 2', 'embedpress'),
                'tagline'   => __('Legacy custom skin.', 'embedpress'),
                'is_legacy' => true,
                'is_pro'    => false,
            ],

            // New — rendered by ep-player.js, no plyr.css.
            [
                'slug'      => 'ep-minimal',
                'name'      => __('Minimal', 'embedpress'),
                'tagline'   => __('Compact bar, controls collapse on hover.', 'embedpress'),
                'is_legacy' => false,
                'is_pro'    => false,
            ],
        ];

        /**
         * Pro can append its own presets here. The shape is the same; the
         * CSS that backs the slug must be enqueued by Pro itself.
         */
        return apply_filters('embedpress_player_presets', $presets);
    }

    /**
     * @return array<string,string> slug => label, suitable for SelectControl `options`.
     */
    public static function as_select_options()
    {
        $opts = [];
        foreach (self::all() as $preset) {
            $label = $preset['name'];
            if (!empty($preset['is_pro']) && !defined('EMBEDPRESS_SL_ITEM_SLUG')) {
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

    public static function is_new($slug)
    {
        return is_string($slug) && strpos($slug, self::NEW_PREFIX) === 0;
    }

    /**
     * Whether any preset on the registry uses the new pipeline. Used by
     * AssetManager to decide if ep-player.{js,css} need to be enqueued.
     */
    public static function any_new_registered()
    {
        foreach (self::all() as $preset) {
            if (self::is_new($preset['slug'])) return true;
        }
        return false;
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
        return self::default_slug();
    }
}
