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

export const Heading1 = ({ attributes, setAttributes }) => {
    const { h1FontSize, h1LineHeight, h1LetterSpacing, h1FontFamily, h1FontWeight, h1TextTransform, h1Color } = attributes;

    return (
        <div>
            {/* Font Size */}
            <RangeControl
                label={__('H1 Font Size', 'embedpress')}
                value={h1FontSize}
                onChange={(h1FontSize) => setAttributes({ h1FontSize })}
                min={10}
                max={100}
            />

            {/* Line Height */}
            <RangeControl
                label={__('H1 Line Height', 'embedpress')}
                value={h1LineHeight}
                onChange={(h1LineHeight) => setAttributes({ h1LineHeight })}
                min={1}
                max={3}
                step={0.1}
            />

            {/* Letter Spacing */}
            <RangeControl
                label={__('H1 Letter Spacing', 'embedpress')}
                value={h1LetterSpacing}
                onChange={(h1LetterSpacing) => setAttributes({ h1LetterSpacing })}
                min={-5}
                max={10}
                step={0.1}
            />

            {/* Font Family */}
            <SelectControl
                label={__('H1 Font Family', 'embedpress')}
                value={h1FontFamily}
                options={[
                    { label: 'Default', value: 'default' },
                    { label: 'Arial', value: 'Arial, sans-serif' },
                    { label: 'Times New Roman', value: 'Times New Roman, serif' },
                    { label: 'Georgia', value: 'Georgia, serif' },
                    { label: 'Courier New', value: 'Courier New, monospace' },
                    { label: 'Verdana', value: 'Verdana, sans-serif' }
                ]}
                onChange={(h1FontFamily) => setAttributes({ h1FontFamily })}
            />

            {/* Font Weight */}
            <SelectControl
                label={__('H1 Font Weight', 'embedpress')}
                value={h1FontWeight}
                options={[
                    { label: 'Normal', value: 'normal' },
                    { label: 'Bold', value: 'bold' },
                    { label: 'Light', value: 'light' }
                ]}
                onChange={(h1FontWeight) => setAttributes({ h1FontWeight })}
            />

            {/* Text Transform */}
            <SelectControl
                label={__('H1 Text Transform', 'embedpress')}
                value={h1TextTransform}
                options={[
                    { label: 'None', value: 'none' },
                    { label: 'Uppercase', value: 'uppercase' },
                    { label: 'Lowercase', value: 'lowercase' },
                    { label: 'Capitalize', value: 'capitalize' }
                ]}
                onChange={(h1TextTransform) => setAttributes({ h1TextTransform })}
            />

            {/* Color Picker */}
            <ColorPalette
                value={h1Color}
                onChange={(h1Color) => setAttributes({ h1Color })}
            />
        </div>
    )
}

export const Heading2 = ({ attributes, setAttributes }) => {
    const { h2FontSize, h2LineHeight, h2LetterSpacing, h2FontFamily, h2FontWeight, h2TextTransform, h2Color } = attributes;

    return (
        <div>
            {/* Font Size */}
            <RangeControl
                label={__('H2 Font Size', 'embedpress')}
                value={h2FontSize}
                onChange={(h2FontSize) => setAttributes({ h2FontSize })}
                min={10}
                max={100}
            />

            {/* Line Height */}
            <RangeControl
                label={__('H2 Line Height', 'embedpress')}
                value={h2LineHeight}
                onChange={(h2LineHeight) => setAttributes({ h2LineHeight })}
                min={1}
                max={3}
                step={0.1}
            />

            {/* Letter Spacing */}
            <RangeControl
                label={__('H2 Letter Spacing', 'embedpress')}
                value={h2LetterSpacing}
                onChange={(h2LetterSpacing) => setAttributes({ h2LetterSpacing })}
                min={-5}
                max={10}
                step={0.1}
            />

            {/* Font Family */}
            <SelectControl
                label={__('H2 Font Family', 'embedpress')}
                value={h2FontFamily}
                options={[
                    { label: 'Default', value: 'default' },
                    { label: 'Arial', value: 'Arial, sans-serif' },
                    { label: 'Times New Roman', value: 'Times New Roman, serif' },
                    { label: 'Georgia', value: 'Georgia, serif' },
                    { label: 'Courier New', value: 'Courier New, monospace' },
                    { label: 'Verdana', value: 'Verdana, sans-serif' }
                ]}
                onChange={(h2FontFamily) => setAttributes({ h2FontFamily })}
            />

            {/* Font Weight */}
            <SelectControl
                label={__('H2 Font Weight', 'embedpress')}
                value={h2FontWeight}
                options={[
                    { label: 'Normal', value: 'normal' },
                    { label: 'Bold', value: 'bold' },
                    { label: 'Light', value: 'light' }
                ]}
                onChange={(h2FontWeight) => setAttributes({ h2FontWeight })}
            />

            {/* Text Transform */}
            <SelectControl
                label={__('H2 Text Transform', 'embedpress')}
                value={h2TextTransform}
                options={[
                    { label: 'None', value: 'none' },
                    { label: 'Uppercase', value: 'uppercase' },
                    { label: 'Lowercase', value: 'lowercase' },
                    { label: 'Capitalize', value: 'capitalize' }
                ]}
                onChange={(h2TextTransform) => setAttributes({ h2TextTransform })}
            />

            {/* Color Picker */}
            <ColorPalette
                value={h2Color}
                onChange={(h2Color) => setAttributes({ h2Color })}
            />
        </div>
    );
}

export const Heading3 = ({ attributes, setAttributes }) => {
    const { h3FontSize, h3LineHeight, h3LetterSpacing, h3FontFamily, h3FontWeight, h3TextTransform, h3Color } = attributes;

    return (
        <div>
            {/* Font Size */}
            <RangeControl
                label={__('H3 Font Size', 'embedpress')}
                value={h3FontSize}
                onChange={(h3FontSize) => setAttributes({ h3FontSize })}
                min={10}
                max={100}
            />

            {/* Line Height */}
            <RangeControl
                label={__('H3 Line Height', 'embedpress')}
                value={h3LineHeight}
                onChange={(h3LineHeight) => setAttributes({ h3LineHeight })}
                min={1}
                max={3}
                step={0.1}
            />

            {/* Letter Spacing */}
            <RangeControl
                label={__('H3 Letter Spacing', 'embedpress')}
                value={h3LetterSpacing}
                onChange={(h3LetterSpacing) => setAttributes({ h3LetterSpacing })}
                min={-5}
                max={10}
                step={0.1}
            />

            {/* Font Family */}
            <SelectControl
                label={__('H3 Font Family', 'embedpress')}
                value={h3FontFamily}
                options={[
                    { label: 'Default', value: 'default' },
                    { label: 'Arial', value: 'Arial, sans-serif' },
                    { label: 'Times New Roman', value: 'Times New Roman, serif' },
                    { label: 'Georgia', value: 'Georgia, serif' },
                    { label: 'Courier New', value: 'Courier New, monospace' },
                    { label: 'Verdana', value: 'Verdana, sans-serif' }
                ]}
                onChange={(h3FontFamily) => setAttributes({ h3FontFamily })}
            />

            {/* Font Weight */}
            <SelectControl
                label={__('H3 Font Weight', 'embedpress')}
                value={h3FontWeight}
                options={[
                    { label: 'Normal', value: 'normal' },
                    { label: 'Bold', value: 'bold' },
                    { label: 'Light', value: 'light' }
                ]}
                onChange={(h3FontWeight) => setAttributes({ h3FontWeight })}
            />

            {/* Text Transform */}
            <SelectControl
                label={__('H3 Text Transform', 'embedpress')}
                value={h3TextTransform}
                options={[
                    { label: 'None', value: 'none' },
                    { label: 'Uppercase', value: 'uppercase' },
                    { label: 'Lowercase', value: 'lowercase' },
                    { label: 'Capitalize', value: 'capitalize' }
                ]}
                onChange={(h3TextTransform) => setAttributes({ h3TextTransform })}
            />

            {/* Color Picker */}
            <ColorPalette
                value={h3Color}
                onChange={(h3Color) => setAttributes({ h3Color })}
            />
        </div>
    );
}

export const Heading4 = ({ attributes, setAttributes }) => {
    const { h4FontSize, h4LineHeight, h4LetterSpacing, h4FontFamily, h4FontWeight, h4TextTransform, h4Color } = attributes;

    return (
        <div>
            {/* Font Size */}
            <RangeControl
                label={__('H4 Font Size', 'embedpress')}
                value={h4FontSize}
                onChange={(h4FontSize) => setAttributes({ h4FontSize })}
                min={10}
                max={100}
            />

            {/* Line Height */}
            <RangeControl
                label={__('H4 Line Height', 'embedpress')}
                value={h4LineHeight}
                onChange={(h4LineHeight) => setAttributes({ h4LineHeight })}
                min={1}
                max={3}
                step={0.1}
            />

            {/* Letter Spacing */}
            <RangeControl
                label={__('H4 Letter Spacing', 'embedpress')}
                value={h4LetterSpacing}
                onChange={(h4LetterSpacing) => setAttributes({ h4LetterSpacing })}
                min={-5}
                max={10}
                step={0.1}
            />

            {/* Font Family */}
            <SelectControl
                label={__('H4 Font Family', 'embedpress')}
                value={h4FontFamily}
                options={[
                    { label: 'Default', value: 'default' },
                    { label: 'Arial', value: 'Arial, sans-serif' },
                    { label: 'Times New Roman', value: 'Times New Roman, serif' },
                    { label: 'Georgia', value: 'Georgia, serif' },
                    { label: 'Courier New', value: 'Courier New, monospace' },
                    { label: 'Verdana', value: 'Verdana, sans-serif' }
                ]}
                onChange={(h4FontFamily) => setAttributes({ h4FontFamily })}
            />

            {/* Font Weight */}
            <SelectControl
                label={__('H4 Font Weight', 'embedpress')}
                value={h4FontWeight}
                options={[
                    { label: 'Normal', value: 'normal' },
                    { label: 'Bold', value: 'bold' },
                    { label: 'Light', value: 'light' }
                ]}
                onChange={(h4FontWeight) => setAttributes({ h4FontWeight })}
            />

            {/* Text Transform */}
            <SelectControl
                label={__('H4 Text Transform', 'embedpress')}
                value={h4TextTransform}
                options={[
                    { label: 'None', value: 'none' },
                    { label: 'Uppercase', value: 'uppercase' },
                    { label: 'Lowercase', value: 'lowercase' },
                    { label: 'Capitalize', value: 'capitalize' }
                ]}
                onChange={(h4TextTransform) => setAttributes({ h4TextTransform })}
            />

            {/* Color Picker */}
            <ColorPalette
                value={h4Color}
                onChange={(h4Color) => setAttributes({ h4Color })}
            />
        </div>
    );
}
export const Heading5 = ({ attributes, setAttributes }) => {
    const { h5FontSize, h5LineHeight, h5LetterSpacing, h5FontFamily, h5FontWeight, h5TextTransform, h5Color } = attributes;

    return (
        <div>
            {/* Font Size */}
            <RangeControl
                label={__('H5 Font Size', 'embedpress')}
                value={h5FontSize}
                onChange={(h5FontSize) => setAttributes({ h5FontSize })}
                min={10}
                max={100}
            />

            {/* Line Height */}
            <RangeControl
                label={__('H5 Line Height', 'embedpress')}
                value={h5LineHeight}
                onChange={(h5LineHeight) => setAttributes({ h5LineHeight })}
                min={1}
                max={3}
                step={0.1}
            />

            {/* Letter Spacing */}
            <RangeControl
                label={__('H5 Letter Spacing', 'embedpress')}
                value={h5LetterSpacing}
                onChange={(h5LetterSpacing) => setAttributes({ h5LetterSpacing })}
                min={-5}
                max={10}
                step={0.1}
            />

            {/* Font Family */}
            <SelectControl
                label={__('H5 Font Family', 'embedpress')}
                value={h5FontFamily}
                options={[
                    { label: 'Default', value: 'default' },
                    { label: 'Arial', value: 'Arial, sans-serif' },
                    { label: 'Times New Roman', value: 'Times New Roman, serif' },
                    { label: 'Georgia', value: 'Georgia, serif' },
                    { label: 'Courier New', value: 'Courier New, monospace' },
                    { label: 'Verdana', value: 'Verdana, sans-serif' }
                ]}
                onChange={(h5FontFamily) => setAttributes({ h5FontFamily })}
            />

            {/* Font Weight */}
            <SelectControl
                label={__('H5 Font Weight', 'embedpress')}
                value={h5FontWeight}
                options={[
                    { label: 'Normal', value: 'normal' },
                    { label: 'Bold', value: 'bold' },
                    { label: 'Light', value: 'light' }
                ]}
                onChange={(h5FontWeight) => setAttributes({ h5FontWeight })}
            />

            {/* Text Transform */}
            <SelectControl
                label={__('H5 Text Transform', 'embedpress')}
                value={h5TextTransform}
                options={[
                    { label: 'None', value: 'none' },
                    { label: 'Uppercase', value: 'uppercase' },
                    { label: 'Lowercase', value: 'lowercase' },
                    { label: 'Capitalize', value: 'capitalize' }
                ]}
                onChange={(h5TextTransform) => setAttributes({ h5TextTransform })}
            />

            {/* Color Picker */}
            <ColorPalette
                value={h5Color}
                onChange={(h5Color) => setAttributes({ h5Color })}
            />
        </div>
    );
}

export const Heading6 = ({ attributes, setAttributes }) => {
    const { h6FontSize, h6LineHeight, h6LetterSpacing, h6FontFamily, h6FontWeight, h6TextTransform, h6Color } = attributes;

    return (
        <div>
            {/* Font Size */}
            <RangeControl
                label={__('H6 Font Size', 'embedpress')}
                value={h6FontSize}
                onChange={(h6FontSize) => setAttributes({ h6FontSize })}
                min={10}
                max={100}
            />

            {/* Line Height */}
            <RangeControl
                label={__('H6 Line Height', 'embedpress')}
                value={h6LineHeight}
                onChange={(h6LineHeight) => setAttributes({ h6LineHeight })}
                min={1}
                max={3}
                step={0.1}
            />

            {/* Letter Spacing */}
            <RangeControl
                label={__('H6 Letter Spacing', 'embedpress')}
                value={h6LetterSpacing}
                onChange={(h6LetterSpacing) => setAttributes({ h6LetterSpacing })}
                min={-5}
                max={10}
                step={0.1}
            />

            {/* Font Family */}
            <SelectControl
                label={__('H6 Font Family', 'embedpress')}
                value={h6FontFamily}
                options={[
                    { label: 'Default', value: 'default' },
                    { label: 'Arial', value: 'Arial, sans-serif' },
                    { label: 'Times New Roman', value: 'Times New Roman, serif' },
                    { label: 'Georgia', value: 'Georgia, serif' },
                    { label: 'Courier New', value: 'Courier New, monospace' },
                    { label: 'Verdana', value: 'Verdana, sans-serif' }
                ]}
                onChange={(h6FontFamily) => setAttributes({ h6FontFamily })}
            />

            {/* Font Weight */}
            <SelectControl
                label={__('H6 Font Weight', 'embedpress')}
                value={h6FontWeight}
                options={[
                    { label: 'Normal', value: 'normal' },
                    { label: 'Bold', value: 'bold' },
                    { label: 'Light', value: 'light' }
                ]}
                onChange={(h6FontWeight) => setAttributes({ h6FontWeight })}
            />

            {/* Text Transform */}
            <SelectControl
                label={__('H6 Text Transform', 'embedpress')}
                value={h6TextTransform}
                options={[
                    { label: 'None', value: 'none' },
                    { label: 'Uppercase', value: 'uppercase' },
                    { label: 'Lowercase', value: 'lowercase' },
                    { label: 'Capitalize', value: 'capitalize' }
                ]}
                onChange={(h6TextTransform) => setAttributes({ h6TextTransform })}
            />

            {/* Color Picker */}
            <ColorPalette
                value={h6Color}
                onChange={(h6Color) => setAttributes({ h6Color })}
            />
        </div>
    );
}

export const NormalText = ({ attributes, setAttributes }) => {
    const { pFontSize, pLineHeight, pLetterSpacing, pFontFamily, pFontWeight, pTextTransform, pColor } = attributes;

    console.log({ pFontSize });

    return (
        <div>
            {/* Font Size */}
            <RangeControl
                label={__('p Font Size', 'embedpress')}
                value={pFontSize}
                onChange={(pFontSize) => setAttributes({ pFontSize })}
                min={10}
                max={100}
            />

            {/* Line Height */}
            <RangeControl
                label={__('p Line Height', 'embedpress')}
                value={pLineHeight}
                onChange={(pLineHeight) => setAttributes({ pLineHeight })}
                min={1}
                max={3}
                step={0.1}
            />

            {/* Letter Spacing */}
            <RangeControl
                label={__('p Letter Spacing', 'embedpress')}
                value={pLetterSpacing}
                onChange={(pLetterSpacing) => setAttributes({ pLetterSpacing })}
                min={-5}
                max={10}
                step={0.1}
            />

            {/* Font Family */}
            <SelectControl
                label={__('p Font Family', 'embedpress')}
                value={pFontFamily}
                options={[
                    { label: 'Default', value: 'default' },
                    { label: 'Arial', value: 'Arial, sans-serif' },
                    { label: 'Times New Roman', value: 'Times New Roman, serif' },
                    { label: 'Georgia', value: 'Georgia, serif' },
                    { label: 'Courier New', value: 'Courier New, monospace' },
                    { label: 'Verdana', value: 'Verdana, sans-serif' }
                ]}
                onChange={(pFontFamily) => setAttributes({ pFontFamily })}
            />

            {/* Font Weight */}
            <SelectControl
                label={__('p Font Weight', 'embedpress')}
                value={pFontWeight}
                options={[
                    { label: 'Normal', value: 'normal' },
                    { label: 'Bold', value: 'bold' },
                    { label: 'Light', value: 'light' }
                ]}
                onChange={(pFontWeight) => setAttributes({ pFontWeight })}
            />

            {/* Text Transform */}
            <SelectControl
                label={__('p Text Transform', 'embedpress')}
                value={pTextTransform}
                options={[
                    { label: 'None', value: 'none' },
                    { label: 'Uppercase', value: 'uppercase' },
                    { label: 'Lowercase', value: 'lowercase' },
                    { label: 'Capitalize', value: 'capitalize' }
                ]}
                onChange={(pTextTransform) => setAttributes({ pTextTransform })}
            />

            {/* Color Picker */}
            <ColorPalette
                value={pColor}
                onChange={(pColor) => setAttributes({ pColor })}
            />
        </div>
    );
}


const GoogleDocs = ({ attributes, setAttributes }) => {

    const { docViewer, themeMode, customColor, presentation, position, download, draw, toolbar, copy_text, doc_rotation, powered_by, url } = attributes;


    const [activeTab, setActiveTab] = useState('heading_1');


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

    // Dynamically get attribute value
    const getAttr = (key) => attributes[`${activeTab}${key}`] || '';

    // Dynamically update attribute
    const updateAttribute = (key, value) => {
        setAttributes({ [`${activeTab}${key}`]: value });
    };

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

                        <PanelBody title={<div className='ep-pannel-icon'>{EPIcon} {__('Document Styles', 'embedpress')}</div>} initialOpen={false}>
                            <TabPanel
                                onSelect={(tabName) => setActiveTab(tabName)}
                                tabs={[
                                    { name: 'heading_1', title: 'H1' },
                                    { name: 'heading_2', title: 'H2' },
                                    { name: 'heading_3', title: 'H3' },
                                    { name: 'heading_4', title: 'H4' },
                                    { name: 'heading_5', title: 'H5' },
                                    { name: 'heading_6', title: 'H6' },
                                    { name: 'normal_text', title: 'P' }
                                ]}
                            >
                                {() => {
                                    switch (activeTab) {
                                        case 'heading_1':
                                            return <Heading1 attributes={attributes} setAttributes={setAttributes} />;
                                        case 'heading_2':
                                            return <Heading2 attributes={attributes} setAttributes={setAttributes} />;
                                        case 'heading_3':
                                            return <Heading3 attributes={attributes} setAttributes={setAttributes} />;
                                        case 'heading_4':
                                            return <Heading4 attributes={attributes} setAttributes={setAttributes} />;
                                        case 'heading_5':
                                            return <Heading5 attributes={attributes} setAttributes={setAttributes} />;
                                        case 'heading_6':
                                            return <Heading6 attributes={attributes} setAttributes={setAttributes} />;
                                        case 'normal_text':
                                            return <NormalText attributes={attributes} setAttributes={setAttributes} />;
                                        default:
                                            return null;
                                    }
                                }}
                            </TabPanel>

                        </PanelBody>
                    </Fragment>

                )
            }
        </Fragment>

    )
}

export default GoogleDocs;