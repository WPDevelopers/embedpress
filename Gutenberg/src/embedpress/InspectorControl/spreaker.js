/**
 * WordPress dependencies
 */
import { getParams, isSelfHostedAudio, isSelfHostedVideo, isSpreakerUrl } from '../functions';
import { addProAlert, isPro, removeAlert } from '../../common/helper';
import ControlHeader from '../../common/control-heading';
import CustomBranding from './custombranding';
import CustomPlayerControls from '../../common/custom-player-controls';
import { EPIcon } from './../../common/icons';


const { isShallowEqualObjects } = wp.isShallowEqual;
const { useState, useEffect } = wp.element;
const { __ } = wp.i18n;
const { addFilter } = wp.hooks;

const {
    TextControl,
    SelectControl,
    RangeControl,
    ToggleControl,
    PanelBody,
    Button,
    ColorPalette,
} = wp.components;


export default function Spreaker({ attributes, setAttributes }) {
    const {
        url,
        theme,
        color,
        coverImageUrl,
        playlist,
        playlistContinuous,
        playlistLoop,
        playlistAutoupdate,
        chaptersImage,
        episodeImagePosition,
        hideLikes,
        hideComments,
        hideSharing,
        hideLogo,
        hideEpisodeDescription,
        hidePlaylistDescriptions,
        hidePlaylistImages,
        hideDownload,
    } = attributes;

    const isProPluginActive = embedpressObj.is_pro_plugin_active;

    const onSelectImage = (logo) => {
        setAttributes({ customlogo: logo.sizes.full.url });
    }

    const removeImage = (e) => {
        setAttributes({ customlogo: '' });
    }

    if (!document.querySelector('.pro__alert__wrap')) {
        document.querySelector('body').append(isPro('none'));
        removeAlert();
    }

    return (
        <div>
            {isSpreakerUrl(url) && (
                <div className={'ep__vimeo-video-options'}>
                    <PanelBody title={<div className='ep-pannel-icon'>{EPIcon} {__('Spreaker Controls', 'embedpress')}</div>} initialOpen={false}>
                        {/* Theme Control */}
                        <SelectControl
                            label={__('Theme', 'embedpress')}
                            value={theme}
                            options={[
                                { label: __('Light', 'embedpress'), value: 'light' },
                                { label: __('Dark', 'embedpress'), value: 'dark' },
                            ]}
                            onChange={(value) => setAttributes({ theme: value })}
                        />

                        {/* Color Control */}
                        <TextControl
                            label={__('Main Color (Hex)', 'embedpress')}
                            value={color}
                            onChange={(value) => setAttributes({ color: value })}
                            help={__('Enter hex color (e.g., FF0000 or F00)', 'embedpress')}
                        />

                        {/* Cover Image Control */}
                        <TextControl
                            label={__('Cover Image URL', 'embedpress')}
                            value={coverImageUrl}
                            onChange={(value) => setAttributes({ coverImageUrl: value })}
                        />

                        {/* Playlist Control */}
                        <ToggleControl
                            label={__('Enable Playlist', 'embedpress')}
                            checked={playlist === 'show'}
                            onChange={(value) => setAttributes({ playlist: value ? 'show' : 'false' })}
                        />

                        {/* Playlist Continuous Control */}
                        <ToggleControl
                            label={__('Continuous Playlist', 'embedpress')}
                            checked={playlistContinuous}
                            onChange={(value) => setAttributes({ playlistContinuous: value })}
                        />

                        {/* Playlist Loop Control */}
                        <ToggleControl
                            label={__('Loop Playlist', 'embedpress')}
                            checked={playlistLoop}
                            onChange={(value) => setAttributes({ playlistLoop: value })}
                        />

                        {/* Playlist Autoupdate Control */}
                        <ToggleControl
                            label={__('Playlist Autoupdate', 'embedpress')}
                            checked={playlistAutoupdate}
                            onChange={(value) => setAttributes({ playlistAutoupdate: value })}
                        />

                        {/* Chapters Image Control */}
                        <ToggleControl
                            label={__('Show Chapters Images', 'embedpress')}
                            checked={chaptersImage}
                            onChange={(value) => setAttributes({ chaptersImage: value })}
                        />

                        {/* Episode Image Position Control */}
                        <SelectControl
                            label={__('Episode Image Position', 'embedpress')}
                            value={episodeImagePosition}
                            options={[
                                { label: __('Right', 'embedpress'), value: 'right' },
                                { label: __('Left', 'embedpress'), value: 'left' },
                            ]}
                            onChange={(value) => setAttributes({ episodeImagePosition: value })}
                        />

                        {/* Hide Controls */}
                        <ToggleControl
                            label={__('Hide Likes', 'embedpress')}
                            checked={hideLikes}
                            onChange={(value) => setAttributes({ hideLikes: value })}
                        />
                        <ToggleControl
                            label={__('Hide Comments', 'embedpress')}
                            checked={hideComments}
                            onChange={(value) => setAttributes({ hideComments: value })}
                        />
                        <ToggleControl
                            label={__('Hide Sharing', 'embedpress')}
                            checked={hideSharing}
                            onChange={(value) => setAttributes({ hideSharing: value })}
                        />
                        <ToggleControl
                            label={__('Hide Logo', 'embedpress')}
                            checked={hideLogo}
                            onChange={(value) => setAttributes({ hideLogo: value })}
                        />
                        <ToggleControl
                            label={__('Hide Episode Description', 'embedpress')}
                            checked={hideEpisodeDescription}
                            onChange={(value) => setAttributes({ hideEpisodeDescription: value })}
                        />
                        <ToggleControl
                            label={__('Hide Playlist Descriptions', 'embedpress')}
                            checked={hidePlaylistDescriptions}
                            onChange={(value) => setAttributes({ hidePlaylistDescriptions: value })}
                        />
                        <ToggleControl
                            label={__('Hide Playlist Images', 'embedpress')}
                            checked={hidePlaylistImages}
                            onChange={(value) => setAttributes({ hidePlaylistImages: value })}
                        />
                        <ToggleControl
                            label={__('Hide Download', 'embedpress')}
                            checked={hideDownload}
                            onChange={(value) => setAttributes({ hideDownload: value })}
                        />
                    </PanelBody>

                    <CustomBranding attributes={attributes} setAttributes={setAttributes} />
                </div>
            )}
        </div>
    );
}
