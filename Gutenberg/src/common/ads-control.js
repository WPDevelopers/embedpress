import { useRef } from 'react';
import { applyFilters } from '@wordpress/hooks';

import { addProAlert, passwordShowHide, copyPassword } from '../common/helper';
import { EPIcon } from '../common/icons';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const {
    TextControl,
    RangeControl,
    SelectControl,
    ToggleControl,
    PanelBody,
    Button,
} = wp.components;

import {
    MediaUpload,
} from "@wordpress/block-editor";
import AdTemplate from './ads-template';

import { Dashicon } from '@wordpress/components';


export default function AdControl({ attributes, setAttributes }) {



    const {
        adManager,
        adSource,
        adContent,
        adFileUrl,
        adWidth,
        adHeight,
        adXPosition,
        adYPosition,
        adUrl,
        adStart,
        adSkipButton,
        adSkipButtonAfter

    } = attributes;

    const onSelectImage = (ad) => {
        setAttributes({ adContent: ad });

        if (ad.type === 'image') {
            setAttributes({ adFileUrl: ad.sizes.full.url });
            setAttributes({ adSource: 'image' });
        }
        else if (ad.type === 'video') {
            setAttributes({ adFileUrl: ad.url });
            setAttributes({ adSource: 'video' });

        }
    }

    const isProPluginActive = embedpressObj.is_pro_plugin_active;

    const inputRef = useRef(null);

    let adLabel = 'Ad Content';
    if (adFileUrl) {
        adLabel = 'Preview';
    }

    const addManagerSettings = applyFilters('embedpress.adManagerSettings', [], attributes, setAttributes);


    return (

        <PanelBody title={<div className='ep-pannel-icon'>{EPIcon} {__('Ads Settings', 'embedpress')}</div>} initialOpen={false} className={adManager ? "" : "disabled-content-protection"} >
            <div className={isProPluginActive ? "pro-control-active" : "pro-control"} onClick={(e) => { addProAlert(e, isProPluginActive) }}>
                {
                    isProPluginActive ? (
                        <ToggleControl
                            label={__("Ads Settings", "embedpress")}
                            checked={adManager}
                            onChange={(adManager) => setAttributes({ adManager: adManager })}
                        />
                    ) : (
                        <ToggleControl
                            label={__("Ads Settings", "embedpress")}
                            checked={true}
                        />
                    )
                }

                {
                    (!isProPluginActive) && (
                        <span className='isPro'>{__('pro', 'embedpress')}</span>
                    )
                }

                {addManagerSettings}

                <div className={'ep-documentation ads-help'}>
                    {EPIcon}
                    <a href="https://embedpress.com/docs/add-ep-content-protection-in-embedded-content/" target={'_blank'}> {__('Need Help?', 'emebdpress')} </a>
                </div>
            </div>
        </PanelBody>
    )
}