import { useRef } from 'react';
import { addProAlert, passwordShowHide, copyPassword } from '../common/helper';
import { EPIcon } from '../common/icons';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const {
    TextControl,
    SelectControl,
    ToggleControl,
    PanelBody,
    Button,
} = wp.components;

import {
    MediaUpload,
} from "@wordpress/block-editor";
import AdTemplate from './ads-template';

export default function AdControl({ attributes, setAttributes }) {



    const {
        adManager,
        adSource,
        adContent,
        adFileUrl,
        adStart,
        adSkipButton,
        adSkipButtonAfrer

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

    console.log({ adContent, adFileUrl })

    const isProPluginActive = embedpressObj.is_pro_plugin_active;

    const inputRef = useRef(null);

    let adLabel = 'Ad Content';
    if (adFileUrl) {
        adLabel = 'Preview';
    }

    return (
        <PanelBody title={__('Ad Manager', 'embedpress')} initialOpen={false} className={adManager ? "" : "disabled-content-protection"} >
            <div className={isProPluginActive ? "pro-control-active" : "pro-control"} onClick={(e) => { addProAlert(e, isProPluginActive) }}>
                <ToggleControl
                    label={__("Ad Manager")}
                    checked={adManager}
                    onChange={(adManager) => setAttributes({ adManager: adManager })}
                />

                {
                    (!isProPluginActive) && (
                        <span className='isPro'>{__('pro', 'embedpress')}</span>
                    )
                }
            </div>
            {
                adManager && (
                    <div className={'ad-manager-controllers'}>

                        <SelectControl
                            label={__("Ad Source")}
                            value={adSource}
                            options={[
                                { label: 'Upload Video', value: 'video' },
                                { label: 'Upload Image', value: 'image' },
                                { label: 'URL', value: 'url' },
                            ]}
                            onChange={(adSource) => setAttributes({ adSource })}
                            __nextHasNoMarginBottom
                        />

                        <div>

                            <label class="custom-share-thumbnail-label">{adLabel}</label>
                            {
                                adFileUrl && (
                                    <AdTemplate attributes={attributes} setAttributes={setAttributes} />
                                )
                            }

                            {
                                adSource !== 'url' ? (
                                    <div className={'ep-custom-logo-button'}>
                                        <MediaUpload
                                            onSelect={onSelectImage}
                                            allowedTypes={['image', 'video']}
                                            value={adFileUrl}
                                            render={({ open }) => (
                                                <Button className={'ep-logo-upload-button'} icon={!adFileUrl ? 'upload' : 'update'} onClick={open}>
                                                    {
                                                        (!adFileUrl) ? 'Upload Ad' : 'Change Ad'
                                                    }
                                                </Button>
                                            )}
                                        />
                                    </div>
                                ) : (
                                    <TextControl
                                        value={adFileUrl}
                                        onChange={(adFileUrl) => setAttributes({ adFileUrl })}
                                    />
                                )
                            }


                        </div>

                        <TextControl
                            label={__("Ad Start After (sec)")}
                            value={adStart}
                            onChange={(adStart) => setAttributes({ adStart })}
                        />

                        <ToggleControl
                            label={__("Ad Skip Button")}
                            checked={adSkipButton}
                            onChange={(adSkipButton) => setAttributes({ adSkipButton: adSkipButton })}
                        />

                        {
                            adSkipButton && (

                                <TextControl
                                    label={__("Skip Button After (sec)")}
                                    value={adSkipButtonAfrer}
                                    onChange={(adSkipButtonAfrer) => setAttributes({ adSkipButtonAfrer: adSkipButtonAfrer })}
                                />
                            )
                        }

                        <div className={'ep-documentation'}>
                            {EPIcon}
                            <a href="https://embedpress.com/docs/add-ep-content-protection-in-embedded-content/" target={'_blank'}> Need Help? </a>
                        </div>
                    </div>
                )
            }
        </PanelBody>
    )
}