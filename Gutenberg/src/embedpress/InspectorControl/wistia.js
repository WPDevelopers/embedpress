
/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
import { addProAlert, isPro, removeAlert } from '../../common/helper';

const {
    TextControl,
    SelectControl,
    RangeControl,
    ToggleControl,
    PanelBody,
    Button,
    ColorPalette,
} = wp.components;

import {
    MediaUpload,
} from "@wordpress/block-editor";

export default function Wistia({ attributes, setAttributes, isWistiaVideo }) {
    const {
        wstarttime,
        wautoplay,
        scheme,
        captions,
        playbar,
        wfullscreen,
        playbutton,
        resumable,
        wistiafocus,
        volumecontrol,
        volume,
        rewind,
        customlogo,
        logoX,
        logoY,
        customlogoUrl,
        logoOpacity
    } = attributes;


    const isProPluginActive = embedpressObj.is_pro_plugin_active;

    const onSelectImage = (logo) => {
        console.log(logo.sizes.full.url);
        setAttributes({ customlogo: logo.sizes.full.url });
    }
    const removeImage = (e) => {
        setAttributes({ customlogo: '' });
    }

    if (!document.querySelector('.pro__alert__wrap')) {
        document.querySelector('body').append(isPro('none'));
        removeAlert();
    }

    const colors = [
        { name: '', color: 'red' },
        { name: '', color: 'green' },
        { name: '', color: 'blue' },
        { name: '', color: 'yellow' },
        { name: '', color: 'orange' },
    ];

    return (
        <div>
            {
                isWistiaVideo && (
                    <div className={'ep__single-yt-video-options'}>
                        <PanelBody title={__("Wistia Video Controls", 'embedpress')} initialOpen={false}>
                            <div className={'ep-yt-video-controlers'}>
                                <TextControl
                                    label={__("Start Time")}
                                    value={wstarttime}
                                    onChange={(wstarttime) => setAttributes({ wstarttime })}
                                    type={'text'}
                                    className={'ep-control-field'}

                                />
                                <p>Specify a start time (in seconds)</p>

                                <ToggleControl
                                    label={__("Auto Play")}
                                    checked={wautoplay}
                                    onChange={(wautoplay) => setAttributes({ wautoplay })}
                                />

                                <ColorPalette
                                    label={__("Scheme")}
                                    colors={colors}
                                    value={scheme}
                                    onChange={(scheme) => setAttributes({ scheme })}
                                />

                                <ToggleControl
                                    label={__("Fullscreen Button")}
                                    checked={wfullscreen}
                                    onChange={(wfullscreen) => setAttributes({ wfullscreen })}
                                />
                                <ToggleControl
                                    label={__("Small Play Button")}
                                    checked={playbutton}
                                    onChange={(playbutton) => setAttributes({ playbutton })}
                                />
                                <ToggleControl
                                    label={__("Resumeable ")}
                                    checked={resumable}
                                    onChange={(resumable) => setAttributes({ resumable })}
                                />

                                <ToggleControl
                                    label={__("Focus")}
                                    checked={wistiafocus}
                                    onChange={(wistiafocus) => setAttributes({ wistiafocus })}
                                />

                                <div className={isProPluginActive ? "pro-control-active" : "pro-control"} onClick={(e) => { addProAlert(e, isProPluginActive) }}>
                                    <ToggleControl
                                        label={__("Captions")}
                                        checked={captions}
                                        onChange={(captions) => setAttributes({ captions })}
                                    />

                                    {
                                        (!isProPluginActive) && (
                                            <span className='isPro'>{__('pro', 'embedpress')}</span>
                                        )
                                    }
                                </div>

                                <ToggleControl
                                    label={__("Playbar")}
                                    checked={playbar}
                                    onChange={(playbar) => setAttributes({ playbar })}
                                />

                                <div className={isProPluginActive ? "pro-control-active" : "pro-control"} onClick={(e) => { addProAlert(e, isProPluginActive) }}>
                                    <ToggleControl
                                        label={__("Volume Control")}
                                        checked={volumecontrol}
                                        onChange={(volumecontrol) => setAttributes({ volumecontrol })}
                                    />

                                    {
                                        (!isProPluginActive) && (
                                            <span className='isPro'>{__('pro', 'embedpress')}</span>
                                        )
                                    }
                                </div>

                                <div className={isProPluginActive ? "pro-control-active" : "pro-control"} onClick={(e) => { addProAlert(e, isProPluginActive) }}>
                                    <RangeControl
                                        label={__("Volume", "embedpress")}
                                        value={volume}
                                        onChange={(volume) => setAttributes({ volume })}
                                        min={1}
                                        max={100}
                                    />
                                    {
                                        (!isProPluginActive) && (
                                            <span className='isPro'>{__('pro', 'embedpress')}</span>
                                        )
                                    }
                                </div>

                                <ToggleControl
                                    label={__("Rewind")}
                                    checked={rewind}
                                    onChange={(rewind) => setAttributes({ rewind })}
                                />

                            </div>
                        </PanelBody>
                        <PanelBody title={__("Custom Branding", 'embedpress')} initialOpen={false}>
                            {
                                customlogo && (
                                    <div className={'ep__custom-logo'} style={{ position: 'relative' }}>
                                        <button title="Remove Image" className="ep-remove__image" type="button" onClick={removeImage} >
                                            <span class="dashicon dashicons dashicons-trash"></span>
                                        </button>
                                        <img
                                            src={customlogo}
                                            alt="John"
                                        />
                                    </div>
                                )
                            }

                            <div className={isProPluginActive ? "pro-control-active" : "pro-control"} onClick={(e) => { addProAlert(e, isProPluginActive) }}>
                                <MediaUpload
                                    onSelect={onSelectImage}
                                    allowedTypes={['image']}
                                    value={customlogo}
                                    render={({ open }) => (
                                        <Button className={'ep-logo-upload-button'} icon={!customlogo ? 'upload' : 'update'} onClick={open}>
                                            {
                                                !customlogo ? 'Upload Image' : 'Change Image'
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

                            {
                                customlogo && (
                                    <div className={'ep-custom-logo-position'}>
                                        <RangeControl
                                            label={__('Logo X position (%)', 'embedpress')}
                                            value={logoX}
                                            onChange={(logoX) =>
                                                setAttributes({ logoX })
                                            }
                                            max={100}
                                            min={0}
                                        />
                                        <RangeControl
                                            label={__('Logo Y position (%)', 'embedpress')}
                                            value={logoY}
                                            onChange={(logoY) =>
                                                setAttributes({ logoY })
                                            }
                                            max={100}
                                            min={0}
                                        />
                                        <RangeControl
                                            label={__('Logo Opacity', 'embedpress')}
                                            value={logoOpacity}
                                            onChange={(logoOpacity) =>
                                                setAttributes({ logoOpacity })
                                            }
                                            max={1}
                                            min={0}
                                            step={.05}
                                        />

                                        <TextControl
                                            label="Custom Logo Url"
                                            value={customlogoUrl}
                                            onChange={(customlogoUrl) =>
                                                setAttributes({ customlogoUrl })
                                            }
                                            placeholder={'https://exmple.com'}
                                        />

                                    </div>
                                )

                            }
                        </PanelBody>
                    </div>
                )
            }
        </div>
    )
}
