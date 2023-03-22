/**
 * WordPress dependencies
 */

import { addProAlert, isPro, removeAlert } from '../../common/helper';
import ControlHeader from '../../common/control-heading';

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


export default function CustomThumbnail({ attributes, setAttributes }) {

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
        <div>
            <label class="custom-share-thumbnail-label">Custom Thumbnail</label>
            {
                customlogo && (
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

            <div className={'ep-custom-logo-button'} >
                <MediaUpload
                    onSelect={onSelectImage}
                    allowedTypes={['image']}
                    value={customlogo}
                    render={({ open }) => (
                        <Button className={'ep-logo-upload-button'} icon={!customlogo ? 'upload' : 'update'} onClick={open}>
                            {
                                (!customlogo) ? 'Upload Image' : 'Change Image'
                            }
                        </Button>
                    )}

                />
            </div>
        </div>
    )
}
