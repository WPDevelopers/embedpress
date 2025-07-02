
/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
import { addProAlert, isPro, removeAlert } from '../../../../GlobalCoponents/helper';
import ControlHeader from '../../../../GlobalCoponents/control-heading';
import CustomBranding from './custombranding';
import { getParams } from '../../../../../utils/functions';
const { isShallowEqualObjects } = wp.isShallowEqual;
const { useState, useEffect } = wp.element;
const { addFilter, applyFilters } = wp.hooks;

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
import { EPIcon } from '../../../../GlobalCoponents/icons';



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


    const isProPluginActive = embedpressGutenbergData.is_pro_plugin_active;

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

    const colors = [
        { name: '', color: '#FF0000' },
        { name: '', color: '#00FF00' },
        { name: '', color: '#0000FF' },
        { name: '', color: '#FFFF00' },
        { name: '', color: '#FFA500' },
    ];

    const captionsPlaceholder = applyFilters('embedpress.togglePlaceholder', [], __('Captions', 'embedpress'), true);
    const volumePlaceholder = applyFilters('embedpress.togglePlaceholder', [], __('Volume Control', 'embedpress'), true);
    const volumeRangePlaceholder = applyFilters('embedpress.rangeControlPlaceholder', [], __('Volume'), 50, 0, 100, true);

    return (
        <div>
            {
                isWistiaVideo && (
                    <div className={'ep__single-yt-video-options'}>
                        <PanelBody title={<div className='ep-pannel-icon'>{EPIcon} {__('Wistia Video Controls', 'embedpress')}</div>} initialOpen={false}>

                            <div className={'ep-video-controlers'}>
                                <TextControl
                                    label={__("Start Time (In Seconds)")}
                                    value={wstarttime}
                                    onChange={(wstarttime) => setAttributes({ wstarttime })}
                                    type={'number'}
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


                                {applyFilters('embedpress.wistiaControls', [captionsPlaceholder], attributes, setAttributes, 'captions')}

                                <ToggleControl
                                    label={__("Playbar")}
                                    checked={playbar}
                                    onChange={(playbar) => setAttributes({ playbar })}
                                />

                               

                                {applyFilters('embedpress.wistiaControls', [volumePlaceholder], attributes, setAttributes, 'volume')}

                                {
                                    volumecontrol && (
                                        applyFilters('embedpress.wistiaControls', [volumeRangePlaceholder], attributes, setAttributes, 'volumeRange')
                                    )
                                }

                            </div>
                        </PanelBody>
                        <CustomBranding attributes={attributes} setAttributes={setAttributes} />
                    </div>
                )
            }
        </div>
    )
}
