import { addFilter } from '@wordpress/hooks';
import {
    MediaUpload,
} from "@wordpress/block-editor";
import { ToggleControl, SelectControl, Button, ColorPalette } from '@wordpress/components';
const { __ } = wp.i18n;

import ControlHeader from '../common/control-heading';

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
                        render={() => (
                            <Button className={'ep-logo-upload-button'} icon={'upload'}>
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

    addFilter(
        'embedpress.togglePlaceholder',
        'embedpress/togglePlaceholder',
        (settings, label, checked) => {

            console.log({ checked });

            settings.push(
                <div className={"pro-control"} onClick={(e) => { addProAlert(e, isProPluginActive) }}>
                    <ToggleControl
                        label={__(label)}
                        checked={checked}
                    />
                    <span className='isPro'>{__('pro', 'embedpress')}</span>
                </div>
            );
            return settings;
        }
    );

    addFilter(
        'embedpress.selectPlaceholder',
        'embedpress/selectPlaceholder',
        (settings, label, value, optionLabel) => {

            settings.push(
                <div className={"pro-control"} onClick={(e) => { addProAlert(e, isProPluginActive) }}>
                    <SelectControl
                        label={__(label, "embedpress")}
                        value={value}
                        options={[
                            { label: optionLabel, value: value }
                        ]}
                        className={'ep-select-control-field'}
                        __nextHasNoMarginBottom
                    />
                    <span className='isPro'>{__('pro', 'embedpress')}</span>
                </div>
            );
            return settings;
        }
    );
    addFilter(
        'embedpress.colorPlatePlaceholder',
        'embedpress/colorPlatePlaceholder',
        (settings, label, value, colors) => {

            console.log(colors);

            settings.push(
                <div className={"pro-control"} onClick={(e) => { addProAlert(e, isProPluginActive) }}>
                    <ControlHeader headerText={label} />
                    <ColorPalette
                        label={__(label)}
                        colors={colors}
                        value={value}
                    />
                    <span className='isPro'>{__('pro', 'embedpress')}</span>
                </div>
            );
            return settings;
        }
    );
}
