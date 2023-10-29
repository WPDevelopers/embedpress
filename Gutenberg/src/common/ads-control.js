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

export default function AdControl({ attributes, setAttributes }) {

    const onSelectImage = (logo) => {
        console.log(logo.sizes.full.url);
        setAttributes({ adContent: logo.sizes.full.url });
    }
    const removeImage = (e) => {
        setAttributes({ adContent: '' });
    }

    const {
        adManager,
        adSource,
        adContent,
        adStart,
        adSkipButton,
        adSkipButtonAfrer

    } = attributes;

    const isProPluginActive = embedpressObj.is_pro_plugin_active;

    const inputRef = useRef(null);

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
                                { label: 'Video', value: 'video' },
                                { label: 'Image', value: 'image' },
                            ]}
                            onChange={(adSource) => setAttributes({ adSource })}
                            __nextHasNoMarginBottom
                        />

                        <div>
                            <label class="custom-share-thumbnail-label">Ad Content</label>
                            {
                                adContent && (
                                    <div className={'ep__custom-logo'} style={{ position: 'relative' }}>
                                        <button title="Remove Image" className="ep-remove__image" type="button" onClick={removeImage} >
                                            <span class="dashicon dashicons dashicons-trash"></span>
                                        </button>
                                        <img
                                            src={adContent}
                                            alt="John"
                                        />
                                    </div>
                                )
                            }

                            <div className={'ep-custom-logo-button'} >
                                <MediaUpload
                                    onSelect={onSelectImage}
                                    allowedTypes={['image', 'mp4']}
                                    value={adContent}
                                    render={({ open }) => (
                                        <Button className={'ep-logo-upload-button'} icon={!adContent ? 'upload' : 'update'} onClick={open}>
                                            {
                                                (!adContent) ? 'Upload Ad' : 'Change Ad'
                                            }
                                        </Button>
                                    )}

                                />
                            </div>
                        </div>

                        <TextControl
                            label={__("Ad Start")}
                            value={adStart}
                            onChange={(adStart) => setAttributes({ adStart: adStart })}
                        />

                        <ToggleControl
                            label={__("Ad Skip Button")}
                            checked={adSkipButton}
                            onChange={(adSkipButton) => setAttributes({ adSkipButton: adSkipButton })}
                        />

                        {
                            adSkipButton && (

                                <TextControl
                                    label={__("Skip Button After(sec)")}
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