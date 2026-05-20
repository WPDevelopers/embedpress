/**
 * Cinematic Preview controls panel — rendered independently of Custom Player.
 *
 * Pro plugin's `embedpress.youtubeControls` filter (controlName === 'cinematicPreview')
 * replaces the array with the full UI (toggle, 6-preset style picker, title,
 * logo, synopsis, etc.).
 *
 * Free tier (Pro inactive, fbs-81657):
 *   - Real working ToggleControl.
 *   - Real working SelectControl with all 6 preset names; only "Minimal" is
 *     actually applied — picking any "(Pro)" option triggers the upsell alert
 *     and the value snaps back to 'minimal' (same pattern as other freemium
 *     enum controls in the project).
 *   - Other Pro-only controls (title, artwork, colors, overlay, …) render
 *     as upsell placeholders so users discover the full feature surface.
 *   - PHP build_player_options() enforces the same gate server-side
 *     regardless of attribute payload.
 */
const { __ } = wp.i18n;
const { applyFilters } = wp.hooks;
const { Fragment } = wp.element;
const { ToggleControl, SelectControl } = wp.components;

import ControlHeader from './control-heading';
import { wrapFiltered, addProAlert } from './helper';
import { cinematicFieldsFor } from './cinematicPresetFields';

const isProPluginActive = (typeof embedpressGutenbergData !== 'undefined' && embedpressGutenbergData.isProPluginActive) ? true : false;

// All 6 preset options surfaced in free. "Minimal" applies; the rest are
// labelled "(Pro)" and trigger the upgrade alert without changing the value.
const STYLE_OPTIONS_FREE = [
    { label: __('Minimal', 'embedpress'), value: 'minimal' },
    { label: __('Netflix Hero (Pro)', 'embedpress'), value: 'netflix-hero', pro: true },
    { label: __('Prime Video (Pro)', 'embedpress'), value: 'prime-video', pro: true },
    { label: __('Disney+ (Pro)', 'embedpress'), value: 'disney-plus', pro: true },
    { label: __('Apple TV+ Cinematic (Pro)', 'embedpress'), value: 'apple-tv-cinematic', pro: true },
    { label: __('Logo as Title (Pro)', 'embedpress'), value: 'logo-as-title', pro: true },
];

const Sep = () => <hr style={{ margin: '14px 0 10px', border: 0, borderTop: '1px solid #e0e0e0' }} />;
const SectionLabel = ({ children }) => (
    <p style={{ margin: '0 0 4px', fontSize: 11, textTransform: 'uppercase', fontWeight: 500 }}>{children}</p>
);
const SubLabel = ({ children }) => (
    <p style={{ margin: '6px 0 4px', fontSize: 11 }}>{children}</p>
);

const FreeStylePicker = ({ value, onApply }) => (
    <SelectControl
        label={__('Preview Style', 'embedpress')}
        value={value || 'minimal'}
        options={STYLE_OPTIONS_FREE}
        onChange={(next) => {
            const pick = STYLE_OPTIONS_FREE.find((o) => o.value === next);
            if (pick && pick.pro) {
                // Selecting a Pro option fires the upsell and leaves the value
                // pinned to 'minimal' so the renderer never receives a Pro
                // preset from a free user.
                addProAlert({ preventDefault: () => {}, stopPropagation: () => {} }, false);
                onApply('minimal');
                return;
            }
            onApply(next || 'minimal');
        }}
        __nextHasNoMarginBottom
    />
);

const FreePlaceholders = ({ cinematicPreviewStyle, setAttributes }) => {
    // The active style determines which content fields contribute to the
    // overlay; everything else stays hidden so the inspector doesn't carry
    // orphan controls. Free users are pinned to 'minimal' (falls back to
    // netflix-hero's set if the style attribute drifts).
    const fields = cinematicFieldsFor(cinematicPreviewStyle || 'minimal');

    return (
        <div>
            <FreeStylePicker
                value={cinematicPreviewStyle}
                onApply={(v) => setAttributes({ cinematicPreviewStyle: v })}
            />

            <Sep />
            <SectionLabel>{__('Cinematic Thumbnail', 'embedpress')}</SectionLabel>
            {wrapFiltered(applyFilters('embedpress.uploadPlaceholder', [], true))}

            {fields.title && (
                <Fragment>
                    <Sep />
                    {wrapFiltered(applyFilters('embedpress.textControlPlaceholder', [], __('Title', 'embedpress'), '', true))}
                    <SubLabel>{__('Color', 'embedpress')}</SubLabel>
                    {wrapFiltered(applyFilters('embedpress.colorPlatePlaceholder', [], __('Title Color', 'embedpress'), '', [], true))}
                </Fragment>
            )}

            {fields.logo && (
                <Fragment>
                    <Sep />
                    <SectionLabel>{__('Title Artwork (PNG)', 'embedpress')}</SectionLabel>
                    {wrapFiltered(applyFilters('embedpress.uploadPlaceholder', [], true))}
                </Fragment>
            )}

            {fields.synopsis && (
                <Fragment>
                    <Sep />
                    {wrapFiltered(applyFilters('embedpress.textControlPlaceholder', [], __('Synopsis', 'embedpress'), '', true))}
                    <SubLabel>{__('Color', 'embedpress')}</SubLabel>
                    {wrapFiltered(applyFilters('embedpress.colorPlatePlaceholder', [], __('Synopsis Color', 'embedpress'), '', [], true))}
                </Fragment>
            )}

            {fields.badges && (
                <Fragment>
                    <Sep />
                    {wrapFiltered(applyFilters('embedpress.textControlPlaceholder', [], __('Badges', 'embedpress'), '', true))}
                    <SubLabel>{__('Background', 'embedpress')}</SubLabel>
                    {wrapFiltered(applyFilters('embedpress.colorPlatePlaceholder', [], __('Badge Background', 'embedpress'), '', [], true))}
                    <SubLabel>{__('Text Color', 'embedpress')}</SubLabel>
                    {wrapFiltered(applyFilters('embedpress.colorPlatePlaceholder', [], __('Badge Text', 'embedpress'), '', [], true))}
                </Fragment>
            )}

            {fields.meta && (
                <Fragment>
                    <Sep />
                    <SectionLabel>{__('Meta', 'embedpress')}</SectionLabel>
                    {wrapFiltered(applyFilters('embedpress.textControlPlaceholder', [], __('Year', 'embedpress'), '', true))}
                    {wrapFiltered(applyFilters('embedpress.textControlPlaceholder', [], __('Age Rating', 'embedpress'), '', true))}
                    {wrapFiltered(applyFilters('embedpress.textControlPlaceholder', [], __('Duration', 'embedpress'), '', true))}
                    {wrapFiltered(applyFilters('embedpress.textControlPlaceholder', [], __('Genre', 'embedpress'), '', true))}
                </Fragment>
            )}

            <Sep />
            <SectionLabel>{__('Play Button', 'embedpress')}</SectionLabel>
            <SubLabel>{__('Background', 'embedpress')}</SubLabel>
            {wrapFiltered(applyFilters('embedpress.colorPlatePlaceholder', [], __('Play BG', 'embedpress'), '', [], true))}
            <SubLabel>{__('Text Color', 'embedpress')}</SubLabel>
            {wrapFiltered(applyFilters('embedpress.colorPlatePlaceholder', [], __('Play Text', 'embedpress'), '', [], true))}

            {fields.infoBtn && (
                <Fragment>
                    <Sep />
                    <SectionLabel>{__('Info Button (More Info)', 'embedpress')}</SectionLabel>
                    <SubLabel>{__('Background', 'embedpress')}</SubLabel>
                    {wrapFiltered(applyFilters('embedpress.colorPlatePlaceholder', [], __('Info BG', 'embedpress'), '', [], true))}
                    <SubLabel>{__('Text Color', 'embedpress')}</SubLabel>
                    {wrapFiltered(applyFilters('embedpress.colorPlatePlaceholder', [], __('Info Text', 'embedpress'), '', [], true))}
                </Fragment>
            )}

            <Sep />
            <SectionLabel>{__('Overlay', 'embedpress')}</SectionLabel>
            <SubLabel>{__('Tint Color', 'embedpress')}</SubLabel>
            {wrapFiltered(applyFilters('embedpress.colorPlatePlaceholder', [], __('Overlay Color', 'embedpress'), '', [], true))}
            {wrapFiltered(applyFilters('embedpress.rangeControlPlaceholder', [], __('Overlay Opacity', 'embedpress'), 60, 0, 100, true))}

            <Sep />
            {wrapFiltered(applyFilters('embedpress.selectPlaceholder', [], __('Play Action', 'embedpress'), 'inline', __('Inline', 'embedpress'), true))}
        </div>
    );
};

const CinematicPreviewControls = (props) => {
    const { attributes, setAttributes, isSelfHostedAudio } = props;

    if (isSelfHostedAudio) return null;

    if (!isProPluginActive) {
        const { cinematicPreview, cinematicPreviewStyle } = attributes;
        return (
            <div className="ep-cinematic-preview-section ep-cinematic-preview-controls">
                <ControlHeader headerText={__('Cinematic Preview', 'embedpress')} />
                <ToggleControl
                    label={__('Enable Cinematic Preview', 'embedpress')}
                    checked={!!cinematicPreview}
                    onChange={(value) => setAttributes({
                        cinematicPreview: value,
                        cinematicPreviewStyle: 'minimal',
                    })}
                />
                {cinematicPreview && (
                    <FreePlaceholders
                        cinematicPreviewStyle={cinematicPreviewStyle}
                        setAttributes={setAttributes}
                    />
                )}
            </div>
        );
    }

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
