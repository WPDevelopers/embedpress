/**
 * PresetPicker — single-select radio group for the Custom Player presets.
 *
 * - Behaves as one radio group: selecting one card deselects all others
 *   automatically (the parent attribute is the source of truth, so the
 *   `is-selected` class always reflects the currently saved value).
 * - Pro cards do NOT change selection on click — they fire the upgrade
 *   alert instead, so the user's saved preset is never silently swapped
 *   for a Pro one they can't use.
 * - Keyboard: ArrowDown / ArrowRight cycles to the next selectable
 *   (non-Pro for free users); ArrowUp / ArrowLeft to previous; Home /
 *   End jump to first / last selectable. Space / Enter activates.
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
const { useRef, useCallback } = wp.element;

const isProActive = () =>
    typeof window !== 'undefined' &&
    window.embedpressGutenbergData &&
    !!window.embedpressGutenbergData.isProPluginActive;

const PresetPicker = ({ value, onChange }) => {
    const presets = getPlayerPresets();
    const proActive = isProActive();
    const current = normalizePresetSlug(value);
    const groupRef = useRef(null);

    // Selectable = not Pro-locked. Pro cards still render but don't
    // participate in keyboard cycling, so the focus order matches what
    // the user can actually pick.
    const selectableSlugs = presets
        .filter((p) => !(p.isPro && !proActive))
        .map((p) => p.slug);

    const select = useCallback((preset) => {
        if (preset.isPro && !proActive) {
            addProAlert(null, false);
            return;
        }
        if (preset.slug !== current) onChange(preset.slug);
    }, [current, onChange, proActive]);

    const onKeyDown = useCallback((e, preset) => {
        const idx = selectableSlugs.indexOf(preset.slug);
        let nextSlug = null;
        switch (e.key) {
            case 'ArrowDown':
            case 'ArrowRight':
                nextSlug = selectableSlugs[(idx + 1 + selectableSlugs.length) % selectableSlugs.length];
                break;
            case 'ArrowUp':
            case 'ArrowLeft':
                nextSlug = selectableSlugs[(idx - 1 + selectableSlugs.length) % selectableSlugs.length];
                break;
            case 'Home':
                nextSlug = selectableSlugs[0];
                break;
            case 'End':
                nextSlug = selectableSlugs[selectableSlugs.length - 1];
                break;
            case ' ':
            case 'Enter':
                e.preventDefault();
                select(preset);
                return;
            default:
                return;
        }
        e.preventDefault();
        const target = groupRef.current && groupRef.current.querySelector(`[data-slug="${nextSlug}"]`);
        if (target) {
            target.focus();
            const next = presets.find((p) => p.slug === nextSlug);
            if (next) onChange(next.slug);
        }
    }, [selectableSlugs, presets, onChange, select]);

    return (
        <div className="ep-preset-picker">
            <p className="ep-preset-picker__label" id="ep-preset-picker-label">
                {__('Player Style', 'embedpress')}
            </p>
            <div
                ref={groupRef}
                className="ep-preset-picker__grid"
                role="radiogroup"
                aria-labelledby="ep-preset-picker-label"
            >
                {presets.map((preset) => {
                    const selected = preset.slug === current;
                    const locked = preset.isPro && !proActive;
                    const classes = [
                        'ep-preset-picker__card',
                        `ep-preset-picker__card--${preset.slug}`,
                        selected ? 'is-selected' : '',
                        locked ? 'is-locked' : '',
                    ].filter(Boolean).join(' ');
                    return (
                        <div
                            key={preset.slug}
                            data-slug={preset.slug}
                            className={classes}
                            role="radio"
                            aria-checked={selected}
                            aria-disabled={locked || undefined}
                            tabIndex={selected ? 0 : -1}
                            onClick={() => select(preset)}
                            onKeyDown={(e) => onKeyDown(e, preset)}
                            title={preset.description || preset.tagline}
                        >
                            <span className="ep-preset-picker__thumb" aria-hidden="true">
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
                                {selected && <span className="ep-preset-picker__check" aria-hidden="true">✓</span>}
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
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PresetPicker;
