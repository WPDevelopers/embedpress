import { addFilter, applyFilters } from '@wordpress/hooks';
import {
    MediaUpload,
} from "@wordpress/block-editor";
import { ToggleControl, SelectControl, Button, ColorPalette, TextControl, RangeControl } from '@wordpress/components';
const { __ } = wp.i18n;

import ControlHeader from '../common/control-heading';
import { addProAlert } from '../common/helper';

const isProPluginActive = embedpressGutenbergData.isProPluginActive;

const renderWithBadge = (content, showBadge) => {
    return (
        <div>
            {content}
            {showBadge && <span className='isPro'>pro</span>}
        </div>
    );
};

if (!isProPluginActive) {
    console.log('This is called from placeholder');

    // Upload Placeholder
    addFilter(
        'embedpress.uploadPlaceholder',
        'embedpress/uploadPlaceholder',
        (settings, showBadge = true) => {
            settings.push(
                <div className={"pro-control ep-custom-logo-button"} onClick={(e) => { addProAlert(e, isProPluginActive) }}>
                    <MediaUpload
                        render={() => (
                            <Button className={'ep-logo-upload-button'} icon={'upload'}>
                                {__('Upload Image', 'embedpress')}
                            </Button>
                        )}
                    />
                    {renderWithBadge(null, showBadge)}
                </div>
            );
            return settings;
        }
    );

    // Toggle Placeholder
    addFilter(
        'embedpress.togglePlaceholder',
        'embedpress/togglePlaceholder',
        (settings, label, checked, showBadge = true) => {
            settings.push(
                <div className={"pro-control"} onClick={(e) => { addProAlert(e, isProPluginActive) }}>
                    <ToggleControl
                        label={__(label)}
                        checked={checked}
                    />
                    {renderWithBadge(null, showBadge)}
                </div>
            );
            return settings;
        }
    );

    // Select Placeholder
    addFilter(
        'embedpress.selectPlaceholder',
        'embedpress/selectPlaceholder',
        (settings, label, value, optionLabel, showBadge = true) => {
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
                    {renderWithBadge(null, showBadge)}
                </div>
            );
            return settings;
        }
    );

    // ColorPalette Placeholder
    addFilter(
        'embedpress.colorPlatePlaceholder',
        'embedpress/colorPlatePlaceholder',
        (settings, label, value, colors, showBadge = true) => {
            settings.push(
                <div className={"pro-control"} onClick={(e) => { addProAlert(e, isProPluginActive) }}>
                    <ControlHeader headerText={label} />
                    <ColorPalette
                        label={__(label)}
                        colors={colors}
                        value={value}
                    />
                    {renderWithBadge(null, showBadge)}
                </div>
            );
            return settings;
        }
    );

    // TextControl Placeholder
    addFilter(
        'embedpress.textControlPlaceholder',
        'embedpress/textControlPlaceholder',
        (settings, label, value, showBadge = true) => {
            settings.push(
                <div className={"pro-control"} onClick={(e) => { addProAlert(e, isProPluginActive) }}>
                    <TextControl
                        label={__(label, "embedpress")}
                        value={value}
                    />
                    {renderWithBadge(null, showBadge)}
                </div>
            );
            return settings;
        }
    );

    // RangeControl Placeholder
    addFilter(
        'embedpress.rangeControlPlaceholder',
        'embedpress/rangeControlPlaceholder',
        (settings, label, value, min = 0, max = 100, showBadge = true) => {
            settings.push(
                <div className={"pro-control"} onClick={(e) => { addProAlert(e, isProPluginActive) }}>
                    <RangeControl
                        label={__(label, "embedpress")}
                        value={value}
                        min={min}
                        max={max}
                    />
                    {renderWithBadge(null, showBadge)}
                </div>
            );
            return settings;
        }
    );

    // Ads Placeholder without Pro Badge
    addFilter(
        'embedpress.adsPlaceholder',
        'embedpress/adsPlaceholder',
        (settings) => {
            settings.push(
                <div className={'ad-manager-controllers opacity'} >
                    {applyFilters('embedpress.selectPlaceholder', [], __("Ad Source"), 'video', 'Upload Video', false)}
                    <div className='ad-upload'>
                        <label className="custom-share-thumbnail-label">{'Ad Label'}</label>
                        {applyFilters('embedpress.uploadPlaceholder', [], false)}
                    </div>
                    <div>
                        {applyFilters('embedpress.textControlPlaceholder', [], __("Ad Width"), '', false)}
                        {applyFilters('embedpress.textControlPlaceholder', [], __("Ad Height"), '', false)}
                        {applyFilters('embedpress.rangeControlPlaceholder', [], __('Ad X position(%)'), 50, 0, 100, false)}
                        {applyFilters('embedpress.rangeControlPlaceholder', [], __('Ad Y position(%)'), 50, 0, 100, false)}
                    </div>
                    {applyFilters('embedpress.textControlPlaceholder', [], __("Ad URL"), '', false)}
                    {applyFilters('embedpress.textControlPlaceholder', [], __("Ad Start After (sec)"), '', false)}
                    {applyFilters('embedpress.togglePlaceholder', [], __("Ad Skip Button"), false, false)}
                    {applyFilters('embedpress.textControlPlaceholder', [], __("Skip Button After (sec)"), '', false)}
                </div>
            );
            return settings;
        }
    );
}
