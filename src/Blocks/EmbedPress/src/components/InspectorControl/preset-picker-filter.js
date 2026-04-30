/**
 * Replace the legacy "Default / Preset 1 / Preset 2" SelectControl that
 * the Pro filter pushes for controlName === 'preset' with the new
 * named, visual <PresetPicker>.
 *
 * Why this lives in the FREE plugin: the existing Pro Gutenberg dist
 * registers an `embedpress.youtubeControls` filter callback at priority
 * 10 that pushes a SelectControl. We register at priority 20, run after
 * Pro, and replace its output with the new picker. This means Pro
 * doesn't need to be rebuilt for users to see the new UI — and once Pro
 * IS rebuilt to render PresetPicker directly, this filter's output is
 * idempotent (returns the same React tree the Pro callback would now
 * produce).
 */
import { addFilter } from '@wordpress/hooks';
import PresetPicker from '../../../../GlobalCoponents/PresetPicker';

const FILTER_NAMESPACE = 'embedpress/preset-picker-replace';

const replacePresetControl = (settings, attributes, setAttributes, controlName) => {
    if (controlName !== 'preset') return settings;
    if (!attributes) return settings;

    // Bail out for self-hosted audio — the Pro callback was already gated
    // on `!isSelfHostedAudio`. Mirror that here so toggling Audio Only
    // sources doesn't briefly flash the picker.
    const url = attributes.url || '';
    const isAudio = /\.(mp3|wav|ogg|aac)$/i.test(url);
    if (isAudio) return settings;

    return [
        <PresetPicker
            key="ep-preset-picker"
            value={attributes.playerPreset}
            onChange={(playerPreset) => setAttributes({ playerPreset })}
        />,
    ];
};

export const init = () => {
    addFilter(
        'embedpress.youtubeControls',
        FILTER_NAMESPACE,
        replacePresetControl,
        20 // run AFTER Pro's priority-10 callback so we can replace it
    );
};
