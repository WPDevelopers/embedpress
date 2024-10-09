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
import { MediaUpload } from '@wordpress/block-editor';

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


export const init = () => {
    addFilter('embedpress_block_rest_param', 'embedpress', getSpreakerParams, 10);
}

export const getSpreakerParams = (params, attributes) => {
    if (!attributes.url || !(isSpreakerUrl(attributes.url))) {
        return params;
    }
    // which attributes should be passed with rest api.
    const defaults = {
        theme: 'light',
        color: '',
        coverImageUrl: '',
        playlist: false,
        playlistContinuous: false,
        playlistLoop: false,
        playlistAutoupdate: true,
        chaptersImage: true,
        episodeImagePosition: 'right',
        hideLikes: false,
        hideComments: false,
        hideSharing: false,
        hideLogo: false,
        hideEpisodeDescription: false,
        hidePlaylistDescriptions: false,
        hidePlaylistImages: false,
        hideDownload: true,
    };

    return getParams(params, attributes, defaults);
}


export const useSpreaker = (attributes) => {
    // which attribute should call embed();
    const defaults = {
        theme: null,
        color: null,
        coverImageUrl: null,
        playlist: null,
        playlistContinuous: null,
        playlistLoop: null,
        playlistAutoupdate: null,
        chaptersImage: null,
        episodeImagePosition: null,
        hideLikes: null,
        hideComments: null,
        hideSharing: null,
        hideLogo: null,
        hideEpisodeDescription: null,
        hidePlaylistDescriptions: null,
        hidePlaylistImages: null,
        hideDownload: null,
    };

    const param = getParams({}, attributes, defaults);
    const [atts, setAtts] = useState(param);

    useEffect(() => {
        const param = getParams(atts, attributes, defaults);
        if (!isShallowEqualObjects(atts || {}, param)) {
            setAtts(param);
        }
    }, [attributes]);

    return atts;
}



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
        setAttributes({ coverImageUrl: logo.sizes.full.url });
    }

    const removeImage = (e) => {
        setAttributes({ coverImageUrl: '' });
    }

    if (!document.querySelector('.pro__alert__wrap')) {
        document.querySelector('body').append(isPro('none'));
        removeAlert();
    }

    const colors = [
        { name: 'Red', color: '#FF0000' },
        { name: 'Green', color: '#00FF00' },
        { name: 'Blue', color: '#0000FF' },
        { name: 'Yellow', color: '#FFFF00' },
        { name: 'Orange', color: '#FFA500' },
        { name: 'Purple', color: '#800080' }
    ];

    return (
        <div>
            {isSpreakerUrl(url) && (
                <div className={'ep__vimeo-video-options'}>
                    <PanelBody title={<div className='ep-pannel-icon'>{EPIcon} {__('Spreaker Controls', 'embedpress')}</div>} initialOpen={false}>
                        <SelectControl
                            label={__('Theme', 'embedpress')}
                            value={theme}
                            options={[
                                { label: __('Light', 'embedpress'), value: 'light' },
                                { label: __('Dark', 'embedpress'), value: 'dark' },
                            ]}
                            onChange={(theme) => setAttributes({ theme })}
                        />

                        <ControlHeader headerText={'Main Color '} />
                        <ColorPalette
                            colors={colors}
                            value={color}
                            onChange={(color) => setAttributes({ color })}
                        />
                        <ControlHeader headerText={'Cover Image'} />

                        {
                            coverImageUrl && (
                                <div className={'ep__custom-logo'} style={{ position: 'relative' }}>
                                    <button title="Remove Image" className="ep-remove__image" type="button" onClick={removeImage} >
                                        <span class="dashicon dashicons dashicons-trash"></span>
                                    </button>
                                    <img
                                        src={coverImageUrl}
                                        alt="John"
                                    />
                                </div>
                            )
                        }


                        <div className={'pro-control-active ep-custom-logo-button'}>
                            <MediaUpload
                                onSelect={onSelectImage}
                                allowedTypes={['image']}
                                value={coverImageUrl}
                                render={({ open }) => (
                                    <Button className={'ep-logo-upload-button'} icon={!coverImageUrl ? 'upload' : 'update'} onClick={open}>
                                        {
                                            (!coverImageUrl) ? 'Upload Image' : 'Change Image'
                                        }
                                    </Button>
                                )}

                            />
                        </div>

                        <ToggleControl
                            label={__('Enable Playlist', 'embedpress')}
                            checked={playlist}
                            onChange={(playlist) => setAttributes({ playlist })}
                        />

                        <ToggleControl
                            label={__('Continuous Playlist', 'embedpress')}
                            checked={playlistContinuous}
                            onChange={(playlistContinuous) => setAttributes({ playlistContinuous })}
                        />

                        <ToggleControl
                            label={__('Loop Playlist', 'embedpress')}
                            checked={playlistLoop}
                            onChange={(playlistLoop) => setAttributes({ playlistLoop })}
                        />

                        <ToggleControl
                            label={__('Playlist Autoupdate', 'embedpress')}
                            checked={playlistAutoupdate}
                            onChange={(playlistAutoupdate) => setAttributes({ playlistAutoupdate })}
                        />

                        <ToggleControl
                            label={__('Show Chapters Images', 'embedpress')}
                            checked={chaptersImage}
                            onChange={(chaptersImage) => setAttributes({ chaptersImage })}
                        />

                        <SelectControl
                            label={__('Episode Image Position', 'embedpress')}
                            value={episodeImagePosition}
                            options={[
                                { label: __('Right', 'embedpress'), value: 'right' },
                                { label: __('Left', 'embedpress'), value: 'left' },
                            ]}
                            onChange={(episodeImagePosition) => setAttributes({ episodeImagePosition })}
                        />

                        <ToggleControl
                            label={__('Hide Likes', 'embedpress')}
                            checked={hideLikes}
                            onChange={(hideLikes) => setAttributes({ hideLikes })}
                        />

                        <ToggleControl
                            label={__('Hide Comments', 'embedpress')}
                            checked={hideComments}
                            onChange={(hideComments) => setAttributes({ hideComments })}
                        />

                        <ToggleControl
                            label={__('Hide Sharing', 'embedpress')}
                            checked={hideSharing}
                            onChange={(hideSharing) => setAttributes({ hideSharing })}
                        />

                        <ToggleControl
                            label={__('Hide Logo', 'embedpress')}
                            checked={hideLogo}
                            onChange={(hideLogo) => setAttributes({ hideLogo })}
                            help={__('Hide the Spreaker logo and branding in the player. Requires Broadcaster plan or higher.', 'embedpress')}
                        />


                        <ToggleControl
                            label={__('Hide Episode Description', 'embedpress')}
                            checked={hideEpisodeDescription}
                            onChange={(hideEpisodeDescription) => setAttributes({ hideEpisodeDescription })}
                        />

                        <ToggleControl
                            label={__('Hide Playlist Descriptions', 'embedpress')}
                            checked={hidePlaylistDescriptions}
                            onChange={(hidePlaylistDescriptions) => setAttributes({ hidePlaylistDescriptions })}
                        />

                        <ToggleControl
                            label={__('Hide Playlist Images', 'embedpress')}
                            checked={hidePlaylistImages}
                            onChange={(hidePlaylistImages) => setAttributes({ hidePlaylistImages })}
                        />

                        <ToggleControl
                            label={__('Hide Download', 'embedpress')}
                            checked={hideDownload}
                            onChange={(hideDownload) => setAttributes({ hideDownload })}
                        />

                    </PanelBody>

                    <CustomBranding attributes={attributes} setAttributes={setAttributes} />
                </div>
            )}
        </div>
    );
}
