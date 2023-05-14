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

const DocControls = ({ attributes, setAttributes }) => {

    const { themeMode, customColor, presentation, position, download, draw, toolbar, copy_text, doc_rotation, powered_by } = attributes;
    const isProPluginActive = embedpressObj.is_pro_plugin_active;

    if (!document.querySelector('.pro__alert__wrap')) {
        document.querySelector('body').append(isPro('none'));
        removeAlert();
    }

    return (
        <PanelBody
            title={__('Doc Control Settings', 'embedpress')}
            initialOpen={false}
        >
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

            {
                (themeMode === 'custom') && (
                    <div>
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


            {
                toolbar && (
                    <Fragment>
                        <ToggleGroupControl label="Toolbar Position" value={position} onChange={(position) => setAttributes({ position })}>
                            <ToggleGroupControlOption value="top" label="Top" />
                            <ToggleGroupControlOption value="bottom" label="Bottom" />
                        </ToggleGroupControl>


                        <ToggleControl
                            label={__('Presentation Mode', 'embedpress')}
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

                        <div className={isProPluginActive ? "pro-control-active" : "pro-control"} onClick={(e) => { addProAlert(e, isProPluginActive) }}>
                            <ToggleControl
                                label={__('Copy Text', 'embedpress')}
                                onChange={(copy_text) =>
                                    setAttributes({ copy_text })
                                }
                                checked={copy_text}
                                className={'disabled'}
                            />
                            {
                                (!isProPluginActive) && (
                                    <span className='isPro'>{__('pro', 'embedpress')}</span>
                                )
                            }
                        </div>
                        <ToggleControl
                            label={__('Rotation', 'embedpress')}
                            onChange={(doc_rotation) =>
                                setAttributes({ doc_rotation })
                            }
                            checked={doc_rotation}
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