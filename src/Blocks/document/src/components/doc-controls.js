/**
 * Internal dependencies
 */

import ControlHeader from '../../../GlobalCoponents/control-heading';
import {
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { applyFilters } = wp.hooks;

const { PanelBody, ToggleControl, SelectControl, TextControl, ColorPalette } = wp.components;
import { addProAlert, isPro, removeAlert } from '../../../GlobalCoponents/helper';
import { EPIcon, InfoIcon } from '../../../GlobalCoponents/icons';

const DocControls = ({ attributes, setAttributes }) => {

    const { docViewer, themeMode, customColor, presentation, position, download, draw, toolbar, copy_text, doc_rotation, powered_by, href } = attributes;

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

        <PanelBody title={<div className='ep-pannel-icon'>{EPIcon} {__('Document Controls', 'embedpress')}</div>} initialOpen={false}>

            <TextControl
                label={__('Document URL', 'embedpress')}
                type="text"
                value={href || ''}
                onChange={(href) => setAttributes({ href })}
            />

            <SelectControl
                label="Viewer"
                value={docViewer}
                options={[
                    { label: 'Custom', value: 'custom' },
                    { label: 'MS Office', value: 'office' },
                    { label: 'Google', value: 'google' },
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

        
    )
}

export default DocControls;
