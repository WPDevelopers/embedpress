/**
 * Internal dependencies
 */

import ControlHeader from '../common/control-heading';
import {
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { PanelBody, ToggleControl, SelectControl, ColorPalette } = wp.components;
import { addProAlert, isPro, removeAlert } from '../common/helper';
import { EPIcon, InfoIcon } from '../common/icons';

const DocControls = ({ attributes, setAttributes }) => {

    const { docViewer, themeMode, customColor, presentation, position, download, draw, toolbar, copy_text, doc_rotation, powered_by } = attributes;
    const isProPluginActive = embedpressObj.is_pro_plugin_active;

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

    return (

        <PanelBody title={<div className='ep-pannel-icon'>{EPIcon} {__('Document Controls', 'embedpress')}</div>} initialOpen={false}>

            <SelectControl
                label="Viewer"
                value={docViewer}
                options={[
                    { label: 'Custom', value: 'custom' },
                    { label: 'MS Office', value: 'office' },
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
                (docViewer === 'custom') && (

                    <div className={isProPluginActive ? "pro-control-active" : "pro-control"} onClick={(e) => { addProAlert(e, isProPluginActive) }}>
                        <ToggleControl
                            label={__('Toolbar', 'embedpress')}
                            description={__('Show or Hide toolbar. Note: If you disable toolbar access then every toolbar options will be disabled', 'embedpress')}
                            onChange={(toolbar) =>
                                setAttributes({ toolbar })
                            }
                            checked={toolbar}
                            style={{ marginTop: '30px' }}
                        />
                        {
                            (!isProPluginActive) && (
                                <span className='isPro'>{__('pro', 'embedpress')}</span>
                            )
                        }
                    </div>
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

                        <div className={isProPluginActive ? "pro-control-active" : "pro-control"} onClick={(e) => { addProAlert(e, isProPluginActive) }}>
                            <ToggleControl
                                label={__('Print/Download', 'embedpress')}
                                onChange={(download) =>
                                    setAttributes({ download })
                                }
                                checked={download}
                            />
                            {
                                (!isProPluginActive) && (
                                    <span className='isPro'>{__('pro', 'embedpress')}</span>
                                )
                            }
                        </div>

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