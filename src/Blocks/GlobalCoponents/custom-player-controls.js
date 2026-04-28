import { addProAlert, isPro, removeAlert, addTipsTrick, removeTipsAlert, tipsTricksAlert } from './helper';
const { __ } = wp.i18n;
const { applyFilters } = wp.hooks;

const {
    SelectControl,
    ToggleControl,
    ColorPalette,
    Button,
    TextControl,
    PanelBody
} = wp.components;

const colors = [
    { name: '', color: '#FF0000' },
    { name: '', color: '#00FF00' },
    { name: '', color: '#5b4e96' },
    { name: '', color: '#0000FF' },
    { name: '', color: '#FFA500' },
];


const {
    MediaUpload,
} = wp.blockEditor;


import ControlHeader from './control-heading';
import { isSelfHostedVideo } from '../../utils/functions';

const CustomPlayerControls = (props) => {
    const { attributes, setAttributes, isYTVideo, isYTLive, isYTShorts, isVimeoVideo, isSelfHostedAudio } = props;

    const {
        url,
        customPlayer,
        starttime,
        endtime,
        autoplay,
        muteVideo,
        fullscreen,
        relatedvideos,
        vautoplay,
        vautopause,
        vdnt,
        posterThumbnail,
        playerPip,
        playerRestart,
        playerRewind,
        playerFastForward,
        playerPreset,
        playerColor,
        playerTooltip,
        playerHideControls,
        playerDownload
    } = attributes;

    let plySourceText = 'Download';
    if (!isSelfHostedVideo(url)) {
        plySourceText = 'Source Link';
    }

    const onSelectImage = (logo) => {
        setAttributes({ posterThumbnail: logo.sizes.full.url });
    }
    const removeImage = (e) => {
        setAttributes({ posterThumbnail: '' });
    }

    if (!document.querySelector('.pro__alert__wrap')) {
        document.querySelector('body').append(isPro('none'));
        removeAlert();
    }
    if (!document.querySelector('.tips__alert__wrap')) {
        document.querySelector('body').append(tipsTricksAlert('none'));
        removeTipsAlert();
    }

    const tooltipPlaceholder = applyFilters('embedpress.togglePlaceholder', [], __('Tooltip', 'embedpress'), true);
    const autoHideControlsPlaceholder = applyFilters('embedpress.togglePlaceholder', [], __('Auto Hide Controls', 'embedpress'), true);
    const sourceLinkPlaceholder = applyFilters('embedpress.togglePlaceholder', [], __('Source Link', 'embedpress'), true);
    const stickyVideoPlaceholder = applyFilters('embedpress.togglePlaceholder', [], __('Sticky Video', 'embedpress'), false);
    const autoResumePlaceholder = applyFilters('embedpress.togglePlaceholder', [], __('Auto Resume Playback', 'embedpress'), false);
    const endScreenPlaceholder = applyFilters('embedpress.togglePlaceholder', [], __('Custom End Screen', 'embedpress'), false);
    const privacyModePlaceholder = applyFilters('embedpress.togglePlaceholder', [], __('Advanced Privacy Mode', 'embedpress'), false);
    const timedCtaPlaceholder = applyFilters('embedpress.togglePlaceholder', [], __('Timed Call To Action', 'embedpress'), false);
    const chaptersPlaceholder = applyFilters('embedpress.togglePlaceholder', [], __('Video Chapters', 'embedpress'), false);
    const emailCapturePlaceholder = applyFilters('embedpress.togglePlaceholder', [], __('Email Capture', 'embedpress'), false);
    const actionLockPlaceholder = applyFilters('embedpress.togglePlaceholder', [], __('Action Lock', 'embedpress'), false);
    const adaptivePlaceholder = applyFilters('embedpress.togglePlaceholder', [], __('Adaptive Streaming (HLS/DASH)', 'embedpress'), false);
    const countryRestrictionPlaceholder = applyFilters('embedpress.togglePlaceholder', [], __('Country Restriction', 'embedpress'), false);
    const lmsTrackingPlaceholder = applyFilters('embedpress.togglePlaceholder', [], __('Course Completion Tracking', 'embedpress'), false);
    const heatmapPlaceholder = applyFilters('embedpress.togglePlaceholder', [], __('Drop-off Heatmap', 'embedpress'), false);
    const cdnPlaceholder = applyFilters('embedpress.togglePlaceholder', [], __('Use CDN (if configured)', 'embedpress'), true);
    const UploadPlaceholder = applyFilters('embedpress.uploadPlaceholder', [], __('Sticky Video', 'embedpress'), false);

    const presetPlaceholder = applyFilters('embedpress.selectPlaceholder', [], __('Preset', 'embedpress'), 'default', 'Default');

    const colorPlatePlaceholder = applyFilters('embedpress.colorPlatePlaceholder', [], __('Player Color', 'embedpress'), '#5b4e96', colors);

    const autoPause = applyFilters('embedpress.togglePlaceholder', [], __('Auto Paause', 'embedpress'), false);
    const dnt = applyFilters('embedpress.togglePlaceholder', [], __('DNT', 'embedpress'), false);

    return (
        <div className="ep-custom-player-controls">

            {applyFilters('embedpress.youtubeControls', [presetPlaceholder], attributes, setAttributes, 'preset', props)}

            {
                (isYTLive || isYTVideo || isYTShorts) && (

                    <div className='youtube-player-controls'>
                        <TextControl
                            label={__("Start Time (in seconds)")}
                            value={starttime}
                            onChange={(starttime) => setAttributes({ starttime })}
                            type={'number'}
                            className={'ep-control-field'}
                        />

                        <TextControl
                            label={__("End Time (in seconds)")}
                            value={endtime}
                            onChange={(endtime) => setAttributes({ endtime })}
                            type={'number'}
                            className={'ep-control-field'}
                        />

                        {
                            !customPlayer && (
                                <div>
                                    <ToggleControl
                                        label={__("Auto Play")}
                                        checked={autoplay}
                                        onChange={(autoplay) => setAttributes({ autoplay })}
                                    />

                                    <ToggleControl
                                        label={__("Fullscreen Button")}
                                        checked={fullscreen}
                                        onChange={(fullscreen) => setAttributes({ fullscreen })}
                                    />
                                </div>

                            )
                        }

                    </div>
                )
            }

            {applyFilters('embedpress.youtubeControls', [colorPlatePlaceholder], attributes, setAttributes, 'playerColor')}


            {
                customPlayer && (isYTLive || isYTVideo) && (
                    <div className={'remove-last-child-margin'}>
                        <ToggleControl
                            label={__("Auto Play")}
                            checked={autoplay}
                            onChange={(autoplay) => setAttributes({ autoplay })}
                        />

                        {
                            autoplay && (
                                <ToggleControl
                                    label={__("Mute")}
                                    checked={muteVideo}
                                    onChange={(muteVideo) => setAttributes({ muteVideo })}
                                />
                            )
                        }


                        <ToggleControl
                            label={__("Fullscreen Button")}
                            checked={fullscreen}
                            onChange={(fullscreen) => setAttributes({ fullscreen })}
                        />
                    </div>

                )
            }

            {
                isVimeoVideo && (
                    <div className='vimeo-player-controls'>
                        <ToggleControl
                            label={__("Auto Play")}
                            checked={vautoplay}
                            onChange={(vautoplay) => setAttributes({ vautoplay })}
                        />

                        {applyFilters('embedpress.vimeoControls', [autoPause], attributes, setAttributes, 'autoPause')}
                        {applyFilters('embedpress.vimeoControls', [dnt], attributes, setAttributes, 'dnt')}

                    </div>
                )
            }

            <ToggleControl
                label={__("Restart")}
                checked={playerRestart}
                onChange={(playerRestart) => setAttributes({ playerRestart })}
            />
            <ToggleControl
                label={__("Rewind")}
                checked={playerRewind}
                onChange={(playerRewind) => setAttributes({ playerRewind })}
            />
            <ToggleControl
                label={__("Fast Forward")}
                checked={playerFastForward}
                onChange={(playerFastForward) => setAttributes({ playerFastForward })}
            />

            {applyFilters('embedpress.youtubeControls', [tooltipPlaceholder], attributes, setAttributes, 'tooltip')}
            {applyFilters('embedpress.youtubeControls', [autoHideControlsPlaceholder], attributes, setAttributes, 'autoHide')}
            {applyFilters('embedpress.youtubeControls', [sourceLinkPlaceholder], attributes, setAttributes, 'sourceLink')}
            {applyFilters('embedpress.youtubeControls', [stickyVideoPlaceholder], attributes, setAttributes, 'stickyVideo')}

            <PanelBody title={__('Engagement & Conversions', 'embedpress')} initialOpen={false} className="ep-subpanel">
                {applyFilters('embedpress.youtubeControls', [emailCapturePlaceholder], attributes, setAttributes, 'emailCapture', props)}
                {applyFilters('embedpress.youtubeControls', [actionLockPlaceholder], attributes, setAttributes, 'actionLock', props)}
                {applyFilters('embedpress.youtubeControls', [timedCtaPlaceholder], attributes, setAttributes, 'timedCta', props)}
            </PanelBody>

            <PanelBody title={__('Navigation & UX', 'embedpress')} initialOpen={false} className="ep-subpanel">
                {applyFilters('embedpress.youtubeControls', [chaptersPlaceholder], attributes, setAttributes, 'chapters', props)}
                {applyFilters('embedpress.youtubeControls', [autoResumePlaceholder], attributes, setAttributes, 'autoResume', props)}
                {applyFilters('embedpress.youtubeControls', [endScreenPlaceholder], attributes, setAttributes, 'endScreen', props)}
            </PanelBody>

            <PanelBody title={__('Privacy & Compliance', 'embedpress')} initialOpen={false} className="ep-subpanel">
                {applyFilters('embedpress.youtubeControls', [privacyModePlaceholder], attributes, setAttributes, 'privacyMode', props)}
                {applyFilters('embedpress.youtubeControls', [countryRestrictionPlaceholder], attributes, setAttributes, 'countryRestriction', props)}
            </PanelBody>

            <PanelBody title={__('Analytics & Learning', 'embedpress')} initialOpen={false} className="ep-subpanel">
                {applyFilters('embedpress.youtubeControls', [heatmapPlaceholder], attributes, setAttributes, 'heatmap', props)}
                {applyFilters('embedpress.youtubeControls', [lmsTrackingPlaceholder], attributes, setAttributes, 'lmsTracking', props)}
            </PanelBody>

            <PanelBody title={__('Delivery', 'embedpress')} initialOpen={false} className="ep-subpanel">
                {applyFilters('embedpress.youtubeControls', [adaptivePlaceholder], attributes, setAttributes, 'adaptive', props)}
                {applyFilters('embedpress.youtubeControls', [cdnPlaceholder], attributes, setAttributes, 'cdn', props)}
            </PanelBody>

            {
                (isYTLive || isYTVideo) && (
                    <div className='ep-yt-related-videos'>
                        <ToggleControl
                            label={__("Related Videos")}
                            checked={relatedvideos}
                            onChange={(relatedvideos) => setAttributes({ relatedvideos })}
                        />
                        <p>Enable to display related videos from all channels. Otherwise, related videos will show from the same channel.</p>
                    </div>
                )
            }

            {
                !isSelfHostedAudio && (
                    <div>
                        <ControlHeader headerText={'Thumbnail'} />
                        {applyFilters('embedpress.youtubeControls', UploadPlaceholder, attributes, setAttributes, 'thumbnail', props)}
                    </div>
                )
            }


        </div>
    )
}

export default CustomPlayerControls;