import { useRef } from 'react';
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

    console.log({ adContent, adFileUrl })

    const isProPluginActive = embedpressObj.is_pro_plugin_active;

    const inputRef = useRef(null);

    let adLabel = 'Ad Content';
    if (adFileUrl) {
        adLabel = 'Preview';
    }

    const icon = `<svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    id="Layer_1"
    x={0}
    y={0}
    style={{
        enableBackground: "new 0 0 70 70",
    }}
    viewBox="0 0 70 70"
>
    <style>{".st0{fill:#5b4e96}"}</style>
    <path
        d="M4 4.4h9.3V1.1H.7v12.7H4zM65.7 56.8v9.3h-9.4v3.3H68.9V56.8zM59 41.8c.3-.2.7-.3 1-.5 8.2-4.5 11.1-14.8 6.6-22.9-2.6-4.7-7.4-7.9-12.8-8.5-3.1-.4-6.3.2-9.2 1.5-.3.2-.7.3-1 .5-3.9 2.2-6.8 5.8-8 9.9L26.4 48c-.8 2.4-2.3 4.3-4.3 5.4-.2.1-.3.2-.5.3-1.5.7-3.2 1-4.9.8-2.9-.3-5.5-2-6.9-4.6-1.2-2.1-1.4-4.5-.8-6.9.7-2.3 2.2-4.3 4.3-5.4.2-.1.4-.2.5-.3 1.5-.7 3.2-1 5-.8h.2L17.1 42c-.1.4.1.8.5.9l4.9 1.6c.4.1.8-.1.9-.4l4.2-12c.1-.3.1-.6-.1-.9-.1-.3-.4-.5-.7-.6l-4.4-1.3c-.1 0-.2 0-.3-.1l-.4-.1c-.6-.1-1.3-.3-1.9-.3-3.2-.4-6.3.2-9.2 1.5-.3.2-.7.3-1 .5-4 2.2-6.8 5.8-8.1 10.1-1.3 4.4-.7 9 1.5 12.9 2.6 4.7 7.4 7.9 12.8 8.5 3.1.4 6.3-.2 9.2-1.5.3-.2.7-.3 1-.5 3.9-2.2 6.8-5.8 8-9.9l9.2-26.2v-.1c1-2.6 2.4-4.3 4.3-5.4.2-.1.4-.2.5-.3 1.5-.7 3.2-1 4.9-.8 2.9.3 5.5 2 6.9 4.6 2.4 4.4.8 9.9-3.5 12.3-.2.1-.4.2-.5.3-1.6.7-3.2 1-5 .8-.5-.1-1-.2-1.6-.3l-2.8-.8c-.3-.1-.6.1-.7.4L43.3 41c-.1.3.1.7.4.8l3.5 1c.8.2 1.7.4 2.6.5 3.1.4 6.3-.2 9.2-1.5z"
        className="st0"
    />
</svg>`

    
    return (
        
        <PanelBody title={<div className='ep-pannel-icon'>{EPIcon} {__('Ads Settings', 'embedpress')}</div>} initialOpen={false} className={adManager ? "" : "disabled-content-protection"} >
            <div className={isProPluginActive ? "pro-control-active" : "pro-control"} onClick={(e) => { addProAlert(e, isProPluginActive) }}>
                <ToggleControl
                    label={__("Ads Settings")}
                    checked={adManager}
                    onChange={(adManager) => setAttributes({ adManager: adManager })}
                />

                {
                    (!isProPluginActive) && (
                        <span className='isPro'>{__('pro', 'embedpress')}</span>
                    )
                }
        {/* console.log({EPIcon}) */}

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

                        {
                            (adSource === 'image') && (
                                <div>
                                    <TextControl
                                        label={__("Ad Width")}
                                        value={adWidth}
                                        onChange={(adWidth) => setAttributes({ adWidth })}
                                    />
                                    <TextControl
                                        label={__("Ad Height")}
                                        value={adHeight}
                                        onChange={(adHeight) => setAttributes({ adHeight })}
                                    />
                                    <RangeControl
                                        label={__('Ad X position(%)', 'embedpress')}
                                        value={adXPosition}
                                        onChange={(adXPosition) =>
                                            setAttributes({ adXPosition })
                                        }
                                        max={100}
                                        min={0}
                                    />
                                    <RangeControl
                                        label={__('Ad Y position(%)', 'embedpress')}
                                        value={adYPosition}
                                        onChange={(adYPosition) =>
                                            setAttributes({ adYPosition })
                                        }
                                        max={100}
                                        min={0}
                                    />
                                </div>
                            )
                        }
                        <TextControl
                            label={__("Ad URL")}
                            value={adUrl}
                            onChange={(adUrl) => setAttributes({ adUrl })}
                        />

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
                            adSkipButton && (adSource !== 'image') && (

                                <TextControl
                                    label={__("Skip Button After (sec)")}
                                    value={adSkipButtonAfter}
                                    onChange={(adSkipButtonAfter) => setAttributes({ adSkipButtonAfter: adSkipButtonAfter })}
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