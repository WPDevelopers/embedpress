/**
 * WordPress dependencies
 */

import { addProAlert, isPro, removeAlert } from './helper';
import ControlHeader from './control-heading';

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
        customThumbnail,
    } = attributes;

    const onSelectImage = (logo) => {
        setAttributes({ customThumbnail: logo.sizes.full.url });
    }
    const removeImage = (e) => {
        setAttributes({ customThumbnail: '' });
    }


    return (
        <div>
            <label class="custom-share-thumbnail-label">Thumbnail</label>
            {
                customThumbnail && (
                    <div className={'ep__custom-logo'} style={{ position: 'relative' }}>
                        <button title="Remove Image" className="ep-remove__image" type="button" onClick={removeImage} >
                            <span class="dashicon dashicons dashicons-trash"></span>
                        </button>
                        <img
                            src={customThumbnail}
                            alt="John"
                        />
                    </div>
                )
            }

            <div className={'ep-custom-logo-button'} >
                <MediaUpload
                    onSelect={onSelectImage}
                    allowedTypes={['image']}
                    value={customThumbnail}
                    render={({ open }) => (
                        <Button className={'ep-logo-upload-button'} icon={!customThumbnail ? 'upload' : 'update'} onClick={open}>
                            {
                                (!customThumbnail) ? 'Upload Image' : 'Change Image'
                            }
                        </Button>
                    )}

                />
            </div>
        </div>
    )
}
