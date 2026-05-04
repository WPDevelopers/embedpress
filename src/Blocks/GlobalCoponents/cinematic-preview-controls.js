/**
 * Cinematic Preview controls panel — rendered independently of Custom Player.
 *
 * Free side just emits a placeholder; the Pro plugin's `embedpress.youtubeControls`
 * filter (controlName === 'cinematicPreview') replaces it with the real
 * UI (toggle, style picker, title, logo, synopsis, etc.).
 */
const { __ } = wp.i18n;
const { applyFilters } = wp.hooks;

import ControlHeader from './control-heading';

const CinematicPreviewControls = (props) => {
    const { attributes, setAttributes, isSelfHostedAudio } = props;

    if (isSelfHostedAudio) return null;

    const cinematicPreviewPlaceholder = applyFilters(
        'embedpress.togglePlaceholder',
        [],
        __('Cinematic Preview', 'embedpress'),
        false
    );

    return (
        <div className="ep-cinematic-preview-section">
            <ControlHeader headerText={__('Cinematic Preview', 'embedpress')} />
            {applyFilters(
                'embedpress.youtubeControls',
                [cinematicPreviewPlaceholder],
                attributes,
                setAttributes,
                'cinematicPreview',
                props
            )}
        </div>
    );
};

export default CinematicPreviewControls;
