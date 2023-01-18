/**
 * WordPress dependencies
 */
import { getParams } from '../functions';
import { addProAlert, isPro, removeAlert } from '../../common/helper';
import ControlHeader from '../../common/control-heading';
import CustomBranding from './custombranding';

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

import {
    MediaUpload,
} from "@wordpress/block-editor";


export const init = () => {
    addFilter('embedpress_block_rest_param', 'embedpress', getVimeoParams, 10);
}

const colors = [
    { name: '', color: '#FF0000' },
    { name: '', color: '#00FF00' },
    { name: '', color: '#0000FF' },
    { name: '', color: '#FFFF00' },
    { name: '', color: '#FFA500' },
];


export const getVimeoParams = (params, attributes) => {

    if (!attributes.url) {
        return params;
    }


    let vimeovAtts = {};

    if (isVimeoVideo(attributes.url)) {
        vimeovAtts = {
            vstarttime: '',
            vautoplay: false,
            vscheme: '#00ADEF',
            vtitle: true,
            vauthor: true,
            vavatar: true,
            vloop: false,
            vautopause: false,
            vdnt: false,
        }
    }

    // which attributes should be passed with rest api.
    const defaults = {
        ...vimeovAtts,
    };

    return getParams(params, attributes, defaults);
}

export const isVimeoVideo = (url) => {
    return url.match(/https?:\/\/(www\.)?vimeo\.com\/\d+/);
}

/**
 *
 * @param {object} attributes
 * @returns
 */


export const useVimeoVideo = (attributes) => {
    // which attribute should call embed();
    const defaults = {
        vstarttime: null,
        vautoplay: null,
        vscheme: null,
        vtitle: null,
        vauthor: null,
        vavatar: null,
        vloop: null,
        vautopause: null,
        vdnt: null,
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



export default function Vimeo({ attributes, setAttributes, isVimeoVideo }) {

    const {
        vstarttime,
        vautoplay,
        vscheme,
        vtitle,
        vauthor,
        vavatar,
        vloop,
        vautopause,
        vdnt,
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


    return (
        <div>

            {
                isVimeoVideo && (
                    <div className={'ep__vimeo-video-options'}>
                        <PanelBody title={__("Vimeo Video Controls", 'embedpress')} initialOpen={false}>
                            <div className={'ep-video-controlers'}>
                                <TextControl
                                    label={__("Start Time (In Seconds)")}
                                    value={vstarttime}
                                    onChange={(vstarttime) => setAttributes({ vstarttime })}
                                    type={'text'}
                                    className={'ep-control-field'}

                                />

                                <ToggleControl
                                    label={__("Auto Play")}
                                    checked={vautoplay}
                                    onChange={(vautoplay) => setAttributes({ vautoplay })}
                                />


                                <ControlHeader headerText={'Scheme'} />
                                <ColorPalette
                                    label={__("Scheme")}
                                    colors={colors}
                                    value={vscheme}
                                    onChange={(vscheme) => setAttributes({ vscheme })}
                                />

                                <ToggleControl
                                    label={__("Title")}
                                    checked={vtitle}
                                    onChange={(vtitle) => setAttributes({ vtitle })}
                                />

                                <ToggleControl
                                    label={__("Author")}
                                    checked={vauthor}
                                    onChange={(vauthor) => setAttributes({ vauthor })}
                                />

                                <ToggleControl
                                    label={__("Avatar")}
                                    checked={vavatar}
                                    onChange={(vavatar) => setAttributes({ vavatar })}
                                />


                                <div className={isProPluginActive ? "pro-control-active" : "pro-control"} onClick={(e) => { addProAlert(e, isProPluginActive) }}>
                                    <ToggleControl
                                        label={__("Loop")}
                                        checked={vloop}
                                        onChange={(vloop) => setAttributes({ vloop })}
                                    />

                                    {
                                        (!isProPluginActive) && (
                                            <span className='isPro'>{__('pro', 'embedpress')}</span>
                                        )
                                    }
                                </div>

                                <div className={isProPluginActive ? "pro-control-active" : "pro-control"} onClick={(e) => { addProAlert(e, isProPluginActive) }}>
                                    <ToggleControl
                                        label={__("Auto Pause")}
                                        checked={vautopause}
                                        onChange={(vautopause) => setAttributes({ vautopause })}
                                    />

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

                                    {
                                        (!isProPluginActive) && (
                                            <span className='isPro'>{__('pro', 'embedpress')}</span>
                                        )
                                    }
                                </div>

                            </div>
                        </PanelBody>

                        <CustomBranding attributes={attributes} setAttributes={setAttributes} />

                    </div>
                )
            }
        </div>


    )
}
