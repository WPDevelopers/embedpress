
/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
import { addProAlert, isPro, removeAlert } from '../../common/helper';
import ControlHeader from '../../common/control-heading';
import { getParams } from '../functions';
const { isShallowEqualObjects } = wp.isShallowEqual;
const { useState, useEffect } = wp.element;
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

import {
    MediaUpload,
} from "@wordpress/block-editor";



export const init = () => {
    addFilter('embedpress_block_rest_param', 'embedpress', getWistiaParams, 10);
}

export const getWistiaParams = (params, attributes) => {

    if (!attributes.url) {
        return params;
    }

    let wistiaAtts = {};

    if (isWistiaVideo(attributes.url)) {

        wistiaAtts = {
            wstarttime: '',
            wautoplay: false,
            scheme: '',
            captions: true,
            playbar: true,
            wfullscreen: true,
            playbutton: true,
            smallplaybutton: true,
            resumable: true,
            wistiafocus: true,
            volumecontrol: true,
            volume: 100,
            rewind: true,
            customlogo: '',
            logoX: 5,
            logoY: 10,
            customlogoUrl: '',
            logoOpacity: .6,
        }
    }

    // which attributes should be passed with rest api.
    const defaults = {
        ...wistiaAtts,
    };

    return getParams(params, attributes, defaults);
}


export const isWistiaVideo = (url) => {
    return url.match(/\/medias\/|(?:https?:\/\/)?(?:www\.)?(?:wistia.com\/)(\w+)[^?\/]*$/i);
}

/**
 *
 * @param {object} attributes
 * @returns
 */
export const useWistiaVideo = (attributes) => {
    // which attribute should call embed();
    const defaults = {
        wstarttime: null,
        wautoplay: null,
        scheme: null,
        captions: null,
        playbar: null,
        wfullscreen: null,
        playbutton: null,
        smallplaybutton: null,
        resumable: null,
        wistiafocus: null,
        volumecontrol: null,
        volume: null,
        rewind: null,
        customlogo: null,
        logoX: null,
        logoY: null,
        customlogoUrl: null,
        logoOpacity: null,
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



export default function Wistia({ attributes, setAttributes, isWistiaVideo }) {
    const {
        wstarttime,
        wautoplay,
        scheme,
        captions,
        playbar,
        wfullscreen,
        playbutton,
        smallplaybutton,
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
        { name: '', color: '#FF0000' },
        { name: '', color: '#00FF00' },
        { name: '', color: '#0000FF' },
        { name: '', color: '#FFFF00' },
        { name: '', color: '#FFA500' },
    ];

    return (
        <div>
            {
                isWistiaVideo && (
                    <div className={'ep__single-yt-video-options'}>
                        <PanelBody title={__("Wistia Video Controls", 'embedpress')} initialOpen={false}>
                            <div className={'ep-yt-video-controlers'}>
                                <TextControl
                                    label={__("Start Time (In Seconds)")}
                                    value={wstarttime}
                                    onChange={(wstarttime) => setAttributes({ wstarttime })}
                                    type={'text'}
                                    className={'ep-control-field'}

                                />

                                <ToggleControl
                                    label={__("Auto Play")}
                                    checked={wautoplay}
                                    onChange={(wautoplay) => setAttributes({ wautoplay })}
                                />

                                <ControlHeader headerText={'Scheme'} />
                                <ColorPalette
                                    label={__("Scheme")}
                                    colors={colors}
                                    value={scheme}
                                    onChange={(scheme) => setAttributes({ scheme })}
                                />
                                <hr />

                                <ToggleControl
                                    label={__("Fullscreen Button")}
                                    checked={wfullscreen}
                                    onChange={(wfullscreen) => setAttributes({ wfullscreen })}
                                />

                                <ToggleControl
                                    label={__("Small Play Button")}
                                    checked={smallplaybutton}
                                    onChange={(smallplaybutton) => setAttributes({ smallplaybutton })}
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

                                {
                                    volumecontrol && (

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
                                    )
                                }

                            </div>
                        </PanelBody>
                        <PanelBody title={__("Custom Branding", 'embedpress')} initialOpen={false}>
                            {
                                isProPluginActive && customlogo  && (
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

                            <div className={isProPluginActive ? "pro-control-active ep-custom-logo-button" : "pro-control ep-custom-logo-button"} onClick={(e) => { addProAlert(e, isProPluginActive) }}>
                                <MediaUpload
                                    onSelect={onSelectImage}
                                    allowedTypes={['image']}
                                    value={customlogo}
                                    render={({ open }) => (
                                        <Button className={'ep-logo-upload-button'} icon={!customlogo ? 'upload' : 'update'} onClick={open}>
                                            {
                                                (!isProPluginActive || !customlogo) ? 'Upload Image' : 'Change Image'
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
                                 isProPluginActive && customlogo && (
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
                                            label="CTA Link"
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
