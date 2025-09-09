/**
 * WordPress dependencies
 */

import { addProAlert, isPro, removeAlert } from '../../../../GlobalCoponents/helper';
const { __ } = wp.i18n;

const {
    TextControl,
    RangeControl,
    ToggleControl,
    PanelBody,
    Button,
} = wp.components;



/**
 *
 * @param {object} attributes
 * @returns
 */


export default function CustomPlayer({ attributes, setAttributes }) {

    const {
        customPlayer,
        autoplay,
        volume,
        playbackSpeed,
        showProgress,
        showCurrentTime,
        showDuration,
        showMute,
        showVolume,
        showCaptions,
        showFullscreen,
        showPictureInPicture,
        showSettings,
        showPlaybackSpeed,
        showRestart,
        showSeek,
        showLoop,
    } = attributes;

    return (
        <PanelBody title={__("Custom Player", 'embedpress')} initialOpen={false}>
            <ToggleControl
                label={__("Enable Player", "embedpress")}
                checked={customPlayer}
                onChange={(customPlayer) => setAttributes({ customPlayer })}
            />

            <ToggleControl
                label={__('Autoplay', 'embedpress')}
                checked={autoplay}
                onChange={(pAutoplay) => setAttributes({ pAutoplay })}
            />
            <ToggleControl
                label={__('Show Progress', 'embedpress')}
                checked={showProgress}
                onChange={(showProgress) => setAttributes({ showProgress })}
            />
            <ToggleControl
                label={__('Show Current Time', 'embedpress')}
                checked={showCurrentTime}
                onChange={(showCurrentTime) => setAttributes({ showCurrentTime })}
            />
            <ToggleControl
                label={__('Show Duration', 'embedpress')}
                checked={showDuration}
                onChange={(showDuration) => setAttributes({ showDuration })}
            />
            <ToggleControl
                label={__('Show Mute', 'embedpress')}
                checked={showMute}
                onChange={(showMute) => setAttributes({ showMute })}
            />
            <ToggleControl
                label={__('Show Volume', 'embedpress')}
                checked={showVolume}
                onChange={(showVolume) => setAttributes({ showVolume })}
            />
            <ToggleControl
                label={__('Show Captions/Subtitles', 'embedpress')}
                checked={showCaptions}
                onChange={(showCaptions) => setAttributes({ showCaptions })}
            />
            <ToggleControl
                label={__('Show Fullscreen', 'embedpress')}
                checked={showFullscreen}
                onChange={(showFullscreen) => setAttributes({ showFullscreen })}
            />
            <ToggleControl
                label={__('Show Picture-in-Picture', 'embedpress')}
                checked={showPictureInPicture}
                onChange={(showPictureInPicture) => setAttributes({ showPictureInPicture })}
            />
            <ToggleControl
                label={__('Show Settings Menu', 'embedpress')}
                checked={showSettings}
                onChange={(showSettings) => setAttributes({ showSettings })}
            />
            <ToggleControl
                label={__('Show Playback Speed Control', 'embedpress')}
                checked={showPlaybackSpeed}
                onChange={(showPlaybackSpeed) => setAttributes({ showPlaybackSpeed })}
            />
            <ToggleControl
                label={__('Show Restart Button', 'embedpress')}
                checked={showRestart}
                onChange={(showRestart) => setAttributes({ showRestart })}
            />
            <ToggleControl
                label={__('Show Seek Bar', 'embedpress')}
                checked={showSeek}
                onChange={(showSeek) => setAttributes({ showSeek })}
            />
            <ToggleControl
                label={__('Show Loop Button', 'embedpress')}
                checked={showLoop}
                onChange={(showLoop) => setAttributes({ showLoop })}
            />
            <RangeControl
                label={__('Volume', 'embedpress')}
                value={volume}
                min={0}
                max={1}
                step={0.1}
                onChange={(value) => setAttributes({ volume: value })}
            />
            <RangeControl
                label={__('Playback Speed', 'embedpress')}
                value={playbackSpeed}
                min={0.5}
                max={2}
                step={0.1}
                onChange={(value) => setAttributes({ playbackSpeed: value })}
            />

        </PanelBody>
    )
}
