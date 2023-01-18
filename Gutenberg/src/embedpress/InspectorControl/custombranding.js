/**
 * WordPress dependencies
 */

import { addProAlert, isPro, removeAlert } from '../../common/helper';
const { __ } = wp.i18n;

const {
    TextControl,
    RangeControl,
    PanelBody,
    Button,
} = wp.components;

import {
    MediaUpload,
} from "@wordpress/block-editor";


/**
 *
 * @param {object} attributes
 * @returns
 */


export default function CustomBranding({ attributes, setAttributes}) {

    const {
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
        <PanelBody title={__("Custom Branding", 'embedpress')} initialOpen={false}>
            {
                isProPluginActive && customlogo && (
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
    )
}
