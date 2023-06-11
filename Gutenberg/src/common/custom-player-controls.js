import { addProAlert, isPro, removeAlert, addTipsTrick, removeTipsAlert, tipsTricksAlert } from './helper';
const { __ } = wp.i18n;

const {
    SelectControl,
    ToggleControl,
    ColorPalette,
    Button,
    TextControl
} = wp.components;

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


const CustomPlayerControls = ({ attributes, setAttributes, isYTVideo, isYTLive, isVimeoVideo }) => {
    const {
        url,
        customPlayer,
        starttime,
        endtime,
        autoplay,
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
        playerHideControls
    } = attributes;

    const isProPluginActive = embedpressObj.is_pro_plugin_active;

    const onSelectImage = (logo) => {
        console.log(logo.sizes.full.url);
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

    return (
        <div className="ep-custom-player-controls">

            <div className={isProPluginActive ? "pro-control-active" : "pro-control"} onClick={(e) => { addProAlert(e, isProPluginActive) }}>
                <SelectControl
                    label={__("Preset")}
                    value={playerPreset}
                    options={[
                        { label: 'Default', value: 'preset-default' },
                        { label: 'Preset 1', value: 'custom-player-preset-1' },
                        { label: 'Preset 2', value: 'custom-player-preset-2' },
                        { label: 'Preset 3', value: 'custom-player-preset-3' },
                        { label: 'Preset 4', value: 'custom-player-preset-4' },
                    ]}
                    onChange={(playerPreset) => setAttributes({ playerPreset })}
                    __nextHasNoMarginBottom
                />
                {
                    (!isProPluginActive) && (
                        <span className='isPro'>{__('pro', 'embedpress')}</span>
                    )
                }
            </div>


            {
                (isYTLive || isYTVideo) && (

                    <div className='youtube-player-controls'>
                        <TextControl
                            label={__("Start Time (in seconds)")}
                            value={starttime}
                            onChange={(starttime) => setAttributes({ starttime })}
                            type={'text'}
                            className={'ep-control-field'}
                        />

                        <TextControl
                            label={__("End Time (in seconds)")}
                            value={endtime}
                            onChange={(endtime) => setAttributes({ endtime })}
                            type={'text'}
                            className={'ep-control-field'}
                        />

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

            {
                isVimeoVideo && (
                    <div className='vimeo-player-controls'>
                        <ToggleControl
                            label={__("Auto Play")}
                            checked={vautoplay}
                            onChange={(vautoplay) => setAttributes({ vautoplay })}
                        />
                        <p className={'is-ep-description'}>{__("Automatically stop the current video from playing when another one starts.")}</p>

                        <div className={isProPluginActive ? "pro-control-active" : "pro-control"} onClick={(e) => { addProAlert(e, isProPluginActive) }}>
                            <ToggleControl
                                label={__("Auto Pause")}
                                checked={vautopause}
                                onChange={(vautopause) => setAttributes({ vautopause })}
                            />
                            <p className={'is-ep-description'}>{__('Automatically stop the current video from playing when another one starts.', 'embedpress')}</p>
                            {
                                (!isProPluginActive) && (
                                    <span className='isPro'>{__('pro', 'embedpress')}</span>
                                )
                            }
                        </div>

                        <div className={isProPluginActive ? "pro-control-active" : "pro-control"} onClick={(e) => { addProAlert(e, isProPluginActive) }}>
                            <ToggleControl
                                label={__("DNT")}
                                checked={vdnt}
                                onChange={(vdnt) => setAttributes({ vdnt })}
                            />
                            <p className={'is-ep-description'}>{__('Enabling this will block session data tracking, including cookies. If Auto Pause is enabled this will not work.', 'embedpress')}</p>

                            {
                                (!isProPluginActive) && (
                                    <span className='isPro'>{__('pro', 'embedpress')}</span>
                                )
                            }
                        </div>
                    </div>
                )
            }

            <div className={isProPluginActive ? "pro-control-active" : "pro-control"} onClick={(e) => { addProAlert(e, isProPluginActive) }}>
                <ControlHeader headerText={'Player Color'} />
                <ColorPalette
                    label={__("Player Color")}
                    colors={colors}
                    value={playerColor}
                    onChange={(playerColor) => setAttributes({ playerColor })}
                />
                {
                    (!isProPluginActive) && (
                        <span className='isPro'>{__('pro', 'embedpress')}</span>
                    )
                }
            </div>


            <ControlHeader headerText={'Thumbnail'} />
            {
                isProPluginActive && posterThumbnail && (
                    <div className={'ep__custom-logo'} style={{ position: 'relative' }}>
                        <button title="Remove Image" className="ep-remove__image" type="button" onClick={removeImage} >
                            <span class="dashicon dashicons dashicons-trash"></span>
                        </button>
                        <img
                            src={posterThumbnail}
                            alt="John"
                        />
                    </div>
                )
            }


            <div className={isProPluginActive ? "pro-control-active ep-custom-logo-button" : "pro-control ep-custom-logo-button"} onClick={(e) => { addProAlert(e, isProPluginActive) }}>
                <MediaUpload
                    onSelect={onSelectImage}
                    allowedTypes={['image']}
                    value={posterThumbnail}
                    render={({ open }) => (
                        <Button className={'ep-logo-upload-button'} icon={!posterThumbnail ? 'upload' : 'update'} onClick={open}>
                            {
                                (!isProPluginActive || !posterThumbnail) ? 'Upload Image' : 'Change Image'
                            }
                        </Button>
                    )}

                />
                {
                    (!isProPluginActive) && (
                        <span className='isPro'>{__('pro', 'embedpress')}</span>
                    )
                }
            </div>

            <hr />

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
            <div className={isProPluginActive ? "pro-control-active" : "pro-control"} onClick={(e) => { addProAlert(e, isProPluginActive) }}>
                <ToggleControl
                    label={__("Tooltip")}
                    checked={playerTooltip}
                    onChange={(playerTooltip) => setAttributes({ playerTooltip })}
                />
                {
                    (!isProPluginActive) && (
                        <span className='isPro'>{__('pro', 'embedpress')}</span>
                    )
                }
            </div>

            <div className={isProPluginActive ? "pro-control-active" : "pro-control"} onClick={(e) => { addProAlert(e, isProPluginActive) }}>
                <ToggleControl
                    label={__("Hide Controls")}
                    checked={playerHideControls}
                    onChange={(playerHideControls) => setAttributes({ playerHideControls })}
                />
                {
                    (!isProPluginActive) && (
                        <span className='isPro'>{__('pro', 'embedpress')}</span>
                    )
                }
            </div>

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
            <div className={isProPluginActive ? "pro-control-active" : "pro-control"} onClick={(e) => { addProAlert(e, isProPluginActive) }}>
                <ToggleControl
                    label={__("Sticky Video")}
                    checked={playerPip}
                    onChange={(playerPip) => setAttributes({ playerPip })}
                />
                {
                    (!isProPluginActive) && (
                        <span className='isPro'>{__('pro', 'embedpress')}</span>
                    )
                }
            </div>

        </div>
    )
}

export default CustomPlayerControls;