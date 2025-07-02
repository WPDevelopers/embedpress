/**
 * WordPress dependencies
 */
import { getParams, isSelfHostedAudio, isSelfHostedVideo } from '../functions';
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


export default function SelfHosted({ attributes, setAttributes }) {

    const {
        url,
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
        logoOpacity,
        autoPause
    } = attributes;


    const _isSelfHostedVideo = isSelfHostedVideo(url);
    const _isSelfHostedAudio = isSelfHostedAudio(url);

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

    let panelTitle = 'Video Controls';
    if (_isSelfHostedAudio) {
        panelTitle = 'Audio Controls';
    }

    return (
        <div>

            {
                (isSelfHostedVideo(url) || isSelfHostedAudio(url)) && (
                    <div className={'ep__vimeo-video-options'}>
                        <PanelBody title={<div className='ep-pannel-icon'>{EPIcon} {__(panelTitle, 'embedpress')}</div>} initialOpen={false}>
                            <ToggleControl
                                label={__("Auto-Pause", "embedpress")}
                                checked={autoPause}
                                onChange={(autoPause) => setAttributes({ autoPause })}
                            />
                            <p className='control-description'>Pauses other players when a new one starts.</p>

                            <ToggleControl
                                label={__("Enable Custom Player", "embedpress")}
                                checked={customPlayer}
                                onChange={(customPlayer) => setAttributes({ customPlayer })}
                            />
                            {
                                customPlayer && (
                                    <CustomPlayerControls attributes={attributes} setAttributes={setAttributes} isSelfHostedVideo={_isSelfHostedVideo} isSelfHostedAudio={_isSelfHostedAudio} />
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
