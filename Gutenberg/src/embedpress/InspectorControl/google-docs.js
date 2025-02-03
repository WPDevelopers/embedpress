/**
 * Internal dependencies
 */

// import ControlHeader from '../common/control-heading';
import ControlHeader from '../../common/control-heading';
import {
    TabPanel,
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';

/**
 * WordPress dependencies
 */
import React, { useState } from 'react'
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { applyFilters } = wp.hooks;

const { PanelBody, ToggleControl, SelectControl, TextControl, ColorPalette, RangeControl } = wp.components;
import { addProAlert, isPro, removeAlert } from '../../common/helper';
import { EPIcon, InfoIcon } from '../../common/icons';
import { isGoogleDocsUrl } from '../functions';

const GoogleDocs = ({ attributes, setAttributes }) => {

    const { docViewer, themeMode, customColor, presentation, position, download, draw, toolbar, copy_text, doc_rotation, powered_by, url } = attributes;

    const [activeTab, setActiveTab] = useState('heading_1');

    console.log({ attributes });

    if (!document.querySelector('.pro__alert__wrap')) {
        document.querySelector('body').append(isPro('none'));
        removeAlert();
    }

    const colors = [
        { name: '', color: '#823535' },
        { name: '', color: '#008000' },
        { name: '', color: '#403A81' },
        { name: '', color: '#333333' },
        { name: '', color: '#000264' },
    ];

    const toolbarPlaceholder = applyFilters('embedpress.togglePlaceholder', [], __('Toolbar', 'embedpress'), true);
    const printPlaceholder = applyFilters('embedpress.togglePlaceholder', [], __('Print/Download', 'embedpress'), true);


    return (
        <Fragment>
            {
                isGoogleDocsUrl(url) && (
                    <Fragment>
                        <PanelBody title={<div className='ep-pannel-icon'>{EPIcon} {__('Document Controls', 'embedpress')}</div>} initialOpen={false}>

                            <TextControl
                                label={__('Document URL', 'embedpress')}
                                type="text"
                                value={url || ''}
                                onChange={(url) => setAttributes({ url })}
                            />

                            <SelectControl
                                label="Viewer"
                                value={docViewer}
                                options={[
                                    { label: 'Google', value: 'google' },
                                    { label: 'EmbedPress Viewer', value: 'custom' },
                                ]}
                                onChange={(docViewer) =>
                                    setAttributes({ docViewer })
                                }
                                __nextHasNoMarginBottom
                            />
                            {
                                (docViewer === 'custom') && (
                                    <SelectControl
                                        label="Theme"
                                        value={themeMode}
                                        options={[
                                            { label: 'System Default', value: 'default' },
                                            { label: 'Dark', value: 'dark' },
                                            { label: 'Light', value: 'light' },
                                            { label: 'Custom', value: 'custom' },
                                        ]}
                                        onChange={(themeMode) =>
                                            setAttributes({ themeMode })
                                        }
                                        __nextHasNoMarginBottom
                                    />
                                )
                            }


                            {
                                (themeMode === 'custom') && (docViewer === 'custom') && (
                                    <div className={'ep-docs-viewer-colors'}>
                                        <ControlHeader headerText={'Color'} />
                                        <ColorPalette
                                            label={__("Color")}
                                            colors={colors}
                                            value={customColor}
                                            onChange={(customColor) => setAttributes({ customColor })}
                                        />
                                    </div>
                                )
                            }

                            {
                                docViewer === 'custom' && (
                                    applyFilters('embedpress.documentControls', [toolbarPlaceholder], attributes, setAttributes, 'toolbar')
                                )
                            }


                            {
                                toolbar && (docViewer === 'custom') && (
                                    <Fragment>

                                        <ToggleControl
                                            label={__('Fullscreen', 'embedpress')}
                                            onChange={(presentation) =>
                                                setAttributes({ presentation })
                                            }
                                            checked={presentation}
                                        />

                                        {applyFilters('embedpress.documentControls', [printPlaceholder], attributes, setAttributes, 'print')}

                                        <ToggleControl
                                            label={__('Draw', 'embedpress')}
                                            onChange={(draw) =>
                                                setAttributes({ draw })
                                            }
                                            checked={draw}
                                        />

                                        <ToggleControl
                                            label={__('Powered By')}
                                            onChange={(powered_by) =>
                                                setAttributes({ powered_by })
                                            }
                                            checked={powered_by}
                                        />
                                    </Fragment>
                                )
                            }
                        </PanelBody>

                        <PanelBody title={<div className='ep-pannel-icon'>{__('Document Style', 'embedpress')}</div>} initialOpen={false}>
                            <TabPanel
                                onSelect={(tabName) => setActiveTab(tabName)}
                                tabs={[
                                    { name: 'heading_1', title: 'H1' },
                                    { name: 'heading_2', title: 'H2' },
                                    { name: 'heading_3', title: 'H3' },
                                    { name: 'heading_4', title: 'H4' },
                                    { name: 'heading_5', title: 'H5' },
                                    { name: 'heading_6', title: 'H6' }
                                ]}
                            >
                                {() => (
                                    <div>
                                        <p>{__('Selected:', 'embedpress')} {activeTab.toUpperCase()}</p>

                                        {/* Font Size */}
                                        <RangeControl
                                            label={__('Font Size', 'embedpress')}
                                            value={attributes[`${activeTab}FontSize`] || 16}
                                            onChange={(value) => setAttributes({ [`${activeTab}FontSize`]: value })}
                                            min={10}
                                            max={100}
                                        />

                                        {/* Line Height */}
                                        <RangeControl
                                            label={__('Line Height', 'embedpress')}
                                            value={attributes[`${activeTab}LineHeight`] || 1.5}
                                            onChange={(value) => setAttributes({ [`${activeTab}LineHeight`]: value })}
                                            min={1}
                                            max={3}
                                            step={0.1}
                                        />

                                        {/* Letter Spacing */}
                                        <RangeControl
                                            label={__('Letter Spacing', 'embedpress')}
                                            value={attributes[`${activeTab}LetterSpacing`] || 0}
                                            onChange={(value) => setAttributes({ [`${activeTab}LetterSpacing`]: value })}
                                            min={-5}
                                            max={10}
                                            step={0.1}
                                        />

                                        {/* Font Family */}
                                        <SelectControl
                                            label={__('Font Family', 'embedpress')}
                                            value={attributes[`${activeTab}FontFamily`] || 'default'}
                                            options={[
                                                { label: 'Default', value: 'default' },
                                                { label: 'Arial', value: 'Arial, sans-serif' },
                                                { label: 'Times New Roman', value: 'Times New Roman, serif' },
                                                { label: 'Georgia', value: 'Georgia, serif' },
                                                { label: 'Courier New', value: 'Courier New, monospace' },
                                                { label: 'Verdana', value: 'Verdana, sans-serif' }
                                            ]}
                                            onChange={(value) => setAttributes({ [`${activeTab}FontFamily`]: value })}
                                        />

                                        {/* Font Weight */}
                                        <SelectControl
                                            label={__('Font Weight', 'embedpress')}
                                            value={attributes[`${activeTab}FontWeight`] || 'normal'}
                                            options={[
                                                { label: 'Normal', value: 'normal' },
                                                { label: 'Bold', value: 'bold' },
                                                { label: 'Light', value: 'light' }
                                            ]}
                                            onChange={(value) => setAttributes({ [`${activeTab}FontWeight`]: value })}
                                        />

                                        {/* Text Transform */}
                                        <SelectControl
                                            label={__('Text Transform', 'embedpress')}
                                            value={attributes[`${activeTab}TextTransform`] || 'none'}
                                            options={[
                                                { label: 'None', value: 'none' },
                                                { label: 'Uppercase', value: 'uppercase' },
                                                { label: 'Lowercase', value: 'lowercase' },
                                                { label: 'Capitalize', value: 'capitalize' }
                                            ]}
                                            onChange={(value) => setAttributes({ [`${activeTab}TextTransform`]: value })}
                                        />

                                        {/* Color Picker */}
                                        <ColorPalette
                                            colors={colors}
                                            value={attributes[`${activeTab}Color`] || ''}
                                            onChange={(value) => setAttributes({ [`${activeTab}Color`]: value })}
                                        />
                                    </div>
                                )}
                            </TabPanel>
                        </PanelBody>
                    </Fragment>

                )
            }
        </Fragment>

    )
}

export default GoogleDocs;