/**
 * PresetPicker — visual radio-card grid for the Custom Player presets.
 *
 * Replaces the old SelectControl that showed "Default / Preset 1 / Preset 2".
 * Each card surfaces the user-facing name, a one-line tagline, and a tier
 * badge. Pro presets render a lock icon and trigger the upgrade alert
 * instead of selecting (so the user sees what they unlock).
 *
 * Usage:
 *   <PresetPicker
 *     value={attributes.playerPreset}
 *     onChange={(slug) => setAttributes({ playerPreset: slug })}
 *   />
 */
import { getPlayerPresets, normalizePresetSlug } from './player-presets';
import { addProAlert } from './helper';

const { __ } = wp.i18n;

const isProActive = () =>
    typeof window !== 'undefined' &&
    window.embedpressGutenbergData &&
    !!window.embedpressGutenbergData.isProPluginActive;

const PresetPicker = ({ value, onChange }) => {
    const current = normalizePresetSlug(value);
    const proActive = isProActive();

    const onSelect = (preset) => {
        if (preset.isPro && !proActive) {
            addProAlert(null, false);
            return;
        }
        if (preset.slug !== current) onChange(preset.slug);
    };

    return (
        <div className="ep-preset-picker">
            <p className="ep-preset-picker__label">{__('Player Style', 'embedpress')}</p>
            <div className="ep-preset-picker__grid">
                {getPlayerPresets().map((preset) => {
                    const selected = preset.slug === current;
                    const locked = preset.isPro && !proActive;
                    const classes = [
                        'ep-preset-picker__card',
                        `ep-preset-picker__card--${preset.slug}`,
                        selected ? 'is-selected' : '',
                        locked ? 'is-locked' : '',
                    ].filter(Boolean).join(' ');
                    return (
                        <button
                            type="button"
                            key={preset.slug}
                            className={classes}
                            onClick={() => onSelect(preset)}
                            aria-pressed={selected}
                            title={preset.description}
                        >
                            <span className="ep-preset-picker__thumb" aria-hidden="true">
                                {/* Mini player mockup — frame, bottom control bar, progress, play overlay.
                                    Each piece is a span the per-slug CSS skin styles to mirror the real preset. */}
                                <span className="ep-preset-picker__thumb-frame">
                                    <span className="ep-preset-picker__thumb-progress">
                                        <span className="ep-preset-picker__thumb-progress-fill" />
                                    </span>
                                    <span className="ep-preset-picker__thumb-bar">
                                        <span className="ep-preset-picker__thumb-icon" />
                                        <span className="ep-preset-picker__thumb-icon" />
                                        <span className="ep-preset-picker__thumb-spacer" />
                                        <span className="ep-preset-picker__thumb-icon" />
                                    </span>
                                </span>
                                <span className="ep-preset-picker__thumb-play" />
                            </span>
                            <span className="ep-preset-picker__meta">
                                <span className="ep-preset-picker__name">
                                    {preset.name}
                                    {preset.isPro && (
                                        <span className="ep-preset-picker__badge">
                                            {proActive ? __('Pro', 'embedpress') : __('🔒 Pro', 'embedpress')}
                                        </span>
                                    )}
                                </span>
                                <span className="ep-preset-picker__tagline">{preset.tagline}</span>
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default PresetPicker;
