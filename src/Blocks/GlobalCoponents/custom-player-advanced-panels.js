/**
 * Sibling collapsible panels for advanced custom-player features.
 * Rendered alongside (not inside) the main Custom Player PanelBody.
 *
 * Each panel is its own top-level <PanelBody>, collapsible, default closed.
 * Pro-locked controls are injected via the embedpress.youtubeControls filter.
 */
const { __ } = wp.i18n;
const { applyFilters } = wp.hooks;
const { PanelBody } = wp.components;

const CustomPlayerAdvancedPanels = (props) => {
    const { attributes, setAttributes } = props;
    const customPlayer = attributes && attributes.customPlayer;

    // Only show these advanced groups when the Custom Player itself is on.
    if (!customPlayer) return null;

    const placeholder = (label, def = false) =>
        applyFilters('embedpress.togglePlaceholder', [], __(label, 'embedpress'), def);

    const emailCapturePlaceholder    = placeholder('Email Capture');
    const actionLockPlaceholder      = placeholder('Action Lock');
    const timedCtaPlaceholder        = placeholder('Timed Call To Action');
    const chaptersPlaceholder        = placeholder('Video Chapters');
    const autoResumePlaceholder      = placeholder('Auto Resume Playback');
    const endScreenPlaceholder       = placeholder('Custom End Screen');
    const privacyModePlaceholder     = placeholder('Advanced Privacy Mode');
    const countryRestrictionPlaceholder = placeholder('Country Restriction');
    const heatmapPlaceholder         = placeholder('Drop-off Heatmap');
    const lmsTrackingPlaceholder     = placeholder('Course Completion Tracking');
    const adaptivePlaceholder        = placeholder('Adaptive Streaming (HLS/DASH)');
    const cdnPlaceholder             = placeholder('Use CDN (if configured)', true);

    const f = (placeholder, controlName) =>
        applyFilters('embedpress.youtubeControls', [placeholder], attributes, setAttributes, controlName, props);

    return (
        <>
            <PanelBody title={__('Engagement & Conversions', 'embedpress')} initialOpen={false}>
                {f(emailCapturePlaceholder, 'emailCapture')}
                {f(actionLockPlaceholder, 'actionLock')}
                {f(timedCtaPlaceholder, 'timedCta')}
            </PanelBody>

            <PanelBody title={__('Navigation & UX', 'embedpress')} initialOpen={false}>
                {f(chaptersPlaceholder, 'chapters')}
                {f(autoResumePlaceholder, 'autoResume')}
                {f(endScreenPlaceholder, 'endScreen')}
            </PanelBody>

            <PanelBody title={__('Privacy & Compliance', 'embedpress')} initialOpen={false}>
                {f(privacyModePlaceholder, 'privacyMode')}
                {f(countryRestrictionPlaceholder, 'countryRestriction')}
            </PanelBody>

            <PanelBody title={__('Analytics & Learning', 'embedpress')} initialOpen={false}>
                {f(heatmapPlaceholder, 'heatmap')}
                {f(lmsTrackingPlaceholder, 'lmsTracking')}
            </PanelBody>

            <PanelBody title={__('Delivery', 'embedpress')} initialOpen={false}>
                {f(adaptivePlaceholder, 'adaptive')}
                {f(cdnPlaceholder, 'cdn')}
            </PanelBody>
        </>
    );
};

export default CustomPlayerAdvancedPanels;
