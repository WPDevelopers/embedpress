import { addFilter } from '@wordpress/hooks';
import {
    MediaUpload,
} from "@wordpress/block-editor";
import { Button } from '@wordpress/components';
const { __ } = wp.i18n;

import { addProAlert } from '../common/helper';
const isProPluginActive = embedpressObj.is_pro_plugin_active;

if (!isProPluginActive) {
    // Upload placeholder
    console.log('This is called from placeholder');

    addFilter(
        'embedpress.uploadPlaceholder',
        'embedpress/uploadPlaceholder',
        (settings) => {
            settings.push(
                <div className={"pro-control ep-custom-logo-button"} onClick={(e) => { addProAlert(e, isProPluginActive) }}>
                    <MediaUpload
                        render={({ open }) => (
                            <Button className={'ep-logo-upload-button'} icon={'upload'} onClick={open}>
                                {__('Upload Image', 'embedpress')}
                            </Button>
                        )}
                    />
                    <span className='isPro'>{__('pro', 'embedpress')}</span>
                </div>
            );
            return settings;
        }
    );
}
