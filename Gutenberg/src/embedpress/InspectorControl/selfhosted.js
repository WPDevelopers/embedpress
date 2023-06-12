/**
 * WordPress dependencies
 */
import { getParams } from '../functions';
import { addProAlert, isPro, removeAlert } from '../../common/helper';
import { isSelfHostedVideo } from '../functions';
import ControlHeader from '../../common/control-heading';
import CustomBranding from './custombranding';
import CustomPlayerControls from '../../common/custom-player-controls';

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
        logoOpacity
    } = attributes;


    const _isSelfHostedVideo = isSelfHostedVideo(url);

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
                isSelfHostedVideo(url) && (
                    <div className={'ep__vimeo-video-options'}>
                        <PanelBody title={__("Video Controls", 'embedpress')} initialOpen={false}>
                            <ToggleControl
                                label={__("Enable Custom Player", "embedpress")}
                                checked={customPlayer}
                                onChange={(customPlayer) => setAttributes({ customPlayer })}
                            />
                            {
                                customPlayer && (
                                    <CustomPlayerControls attributes={attributes} setAttributes={setAttributes} isSelfHostedVideo={_isSelfHostedVideo} />
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
