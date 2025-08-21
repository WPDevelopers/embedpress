/**
 * WordPress dependencies
 */
import { getParams } from '../../../../../utils/functions';
import { addProAlert, isPro, removeAlert } from '../../../../GlobalCoponents/helper';
import ControlHeader from '../../../../GlobalCoponents/control-heading';
import CustomBranding from './custombranding';
import CustomPlayerControls from '../../../../GlobalCoponents/custom-player-controls';

const { isShallowEqualObjects } = wp.isShallowEqual;
const { useState, useEffect } = wp.element;
const { __ } = wp.i18n;
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


import { EPIcon } from '../../../../GlobalCoponents/icons';


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
        customPlayer,
        customlogo,
        logoX,
        logoY,
        customlogoUrl,
        logoOpacity
    } = attributes;

    const isProPluginActive = embedpressGutenbergData.isProPluginActive;

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

    const loop = applyFilters('embedpress.togglePlaceholder', [], __('Loop', 'embedpress'), false);
    const autoPause = applyFilters('embedpress.togglePlaceholder', [], __('Auto Paause', 'embedpress'), false);
    const dnt = applyFilters('embedpress.togglePlaceholder', [], __('DNT', 'embedpress'), false);


    return (
        <div>

            {
                isVimeoVideo && (
                    <div className={'ep__vimeo-video-options'}>
                        <PanelBody title={<div className='ep-pannel-icon'>{EPIcon} {__('Video Controls', 'embedpress')}</div>} initialOpen={false}>
                            <ToggleControl
                                label={__("Enable Custom Player", "embedpress")}
                                checked={customPlayer}
                                onChange={(customPlayer) => setAttributes({ customPlayer })}
                            />
                            {
                                !customPlayer ? (
                                    <div className={'ep-video-controlers'}>
                                        <TextControl
                                            label={__("Start Time (In Seconds)")}
                                            value={vstarttime}
                                            onChange={(vstarttime) => setAttributes({ vstarttime })}
                                            type={'number'}
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

                                        {applyFilters('embedpress.vimeoControls', [loop], attributes, setAttributes, 'loop')}
                                        {applyFilters('embedpress.vimeoControls', [autoPause], attributes, setAttributes, 'autoPause')}
                                        {applyFilters('embedpress.vimeoControls', [dnt], attributes, setAttributes, 'dnt')}

                                    </div>
                                ) : (
                                    <div className={'ep-video-controlers'}>
                                        <CustomPlayerControls attributes={attributes} setAttributes={setAttributes} isVimeoVideo={isVimeoVideo} />


                                    </div>
                                )
                            }

                        </PanelBody>

                        <CustomBranding attributes={attributes} setAttributes={setAttributes} />

                    </div>
                )
            }
        </div>


    )
}
