import { addProAlert, isPro, removeAlert, addTipsTrick, removeTipsAlert, tipsTricksAlert } from './helper';
import { __ } from '@wordpress/i18n';
import { applyFilters } from '@wordpress/hooks';
import {
    SelectControl,
    ToggleControl,
    ColorPalette,
    Button,
    TextControl
} from '@wordpress/components';

const colors = [
    { name: '', color: '#FF0000' },
    { name: '', color: '#00FF00' },
    { name: '', color: '#5b4e96' },
    { name: '', color: '#0000FF' },
    { name: '', color: '#FFA500' },
];


import {
    MediaUpload,
} from "@wordpress/block-editor";
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