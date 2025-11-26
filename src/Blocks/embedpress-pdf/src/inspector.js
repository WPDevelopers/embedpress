/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { useState, useEffect, Fragment } = wp.element;
const {
    BlockControls,
    BlockIcon,
    MediaPlaceholder,
    InspectorControls,
    useBlockProps
} = wp.blockEditor;


const {
    __experimentalToggleGroupControl: ToggleGroupControl,
    __experimentalToggleGroupControlOption: ToggleGroupControlOption,
} = wp.components;



const {
    ToolbarButton,
    RangeControl,
    PanelBody,
    ExternalLink,
    ToggleControl,
    TextControl,
    SelectControl,
    RadioControl,
    ColorPalette,
    Tooltip,
} = wp.components;

const { applyFilters } = wp.hooks;

/**
 * Internal dependencies
 */
import ControlHeader from '../../GlobalCoponents/control-heading';
import LockControl from '../../GlobalCoponents/lock-control';
import ContentShare from '../../GlobalCoponents/social-share-control';
import AdControl from '../../GlobalCoponents/ads-control';
import Upgrade from '../../GlobalCoponents/upgrade';
import CustomBranding from "../../GlobalCoponents/custombranding";
import { EPIcon, InfoIcon } from "../../GlobalCoponents/icons";

const Inspector = ({ attributes, setAttributes }) => {

    const { href, mime, id, unitoption, width, height, powered_by, themeMode, customColor, presentation, lazyLoad, position, flipbook_toolbar_position, download, add_text, draw, open, toolbar, copy_text, toolbar_position, doc_details, doc_rotation, add_image, selection_tool, scrolling, spreads, sharePosition, contentShare, adManager, adSource, adFileUrl, adWidth, adHeight, adXPosition, adYPosition, viewerStyle, zoomIn, zoomOut, fitView, bookmark } = attributes;


    // Constants
    const min = 1;
    const max = 1000;

    // Color palette for ColorPalette component
    const colors = [
        { name: '', color: '#823535' },
        { name: '', color: '#008000' },
        { name: '', color: '#403A81' },
        { name: '', color: '#333333' },
        { name: '', color: '#000264' },
    ];

    let widthMin = 0;
    let widthMax = 100;

    if (unitoption == 'px') {
        widthMax = 1500;
    }


    const toobarPlaceholder = applyFilters('embedpress.togglePlaceholder', [], __('Toolbar', 'embedpress'), true);
    const printPlaceholder = applyFilters('embedpress.togglePlaceholder', [], __('Print/Download', 'embedpress'), true);
    const drawPlaceholder = applyFilters('embedpress.togglePlaceholder', [], __('Draw', 'embedpress'), false);
    const copyPlaceholder = applyFilters('embedpress.togglePlaceholder', [], __('Copy Text', 'embedpress'), true);

    const scrollingPlaceholder = applyFilters('embedpress.selectPlaceholder', [], __('Default Scrolling', 'embedpress'), '-1', 'Page Scrolling');

    const selectionPlaceholder = applyFilters('embedpress.selectPlaceholder', [], __('Default Selection Tool', 'embedpress'), '0', 'Text Tool');

    return (

        <InspectorControls key="inspector">
            <PanelBody title={<div className='ep-pannel-icon'>{EPIcon} {__('Embed Size', 'embedpress')}</div>}>

                <div className='ep-controls-margin'>

                    <div className={'ep-pdf-width-contol'}>

                        <RadioControl
                            selected={unitoption}
                            options={[
                                { label: '%', value: '%' },
                                { label: 'PX', value: 'px' },
                            ]}
                            onChange={(unitoption) =>
                                setAttributes({ unitoption })
                            }
                            className={'ep-unit-choice-option'}
                        />


                        <div className="ep-width-control-with-tooltip">
                            <TextControl
                                label={
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        {__("Width")}
                                        <Tooltip
                                            text={__("Works as max container width", "embedpress")}
                                            position="top"
                                        >
                                            <span style={{ display: 'inline-flex', cursor: 'help' }}>
                                                {InfoIcon}
                                            </span>
                                        </Tooltip>
                                    </span>
                                }
                                value={width}
                                type={'number'}
                                onChange={(width) =>
                                    setAttributes({ width })
                                }
                            />
                        </div>



                    </div>

                    <TextControl
                        label={__(
                            'Height',
                            'embedpress'
                        )}
                        value={height}
                        type={'number'}
                        onChange={(height) =>
                            setAttributes({ height })
                        }
                    />
                </div>
            </PanelBody>

            <PanelBody title={<div className='ep-pannel-icon'>{EPIcon} {__('Document Controls', 'embedpress')}</div>} initialOpen={false}>

                <TextControl
                    label={__('Document URL', 'embedpress')}
                    type="text"
                    value={attributes.href || ''}
                    onChange={(href) => setAttributes({ href })}
                />

                <SelectControl
                    label="Viewer Style"
                    value={viewerStyle}
                    options={[
                        { label: 'Modern', value: 'modern' },
                        { label: 'Flip Book', value: 'flip-book' },
                    ]}
                    onChange={(viewerStyle) =>
                        setAttributes({ viewerStyle })
                    }
                    __nextHasNoMarginBottom
                />

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

                {applyFilters('embedpress.pdfControls', [toobarPlaceholder], attributes, setAttributes, 'toolbar')}

                {
                    toolbar && (
                        <Fragment>


                            {
                                (viewerStyle === 'flip-book') ? (
                                    <ToggleGroupControl label="Toolbar Position" value={flipbook_toolbar_position} onChange={(flipbook_toolbar_position) => setAttributes({ flipbook_toolbar_position })}>
                                        <ToggleGroupControlOption value="top" label="Top" />
                                        <ToggleGroupControlOption value="bottom" label="Bottom" />
                                    </ToggleGroupControl>
                                ) : (
                                    <ToggleGroupControl label="Toolbar Position" value={position} onChange={(position) => setAttributes({ position })}>
                                        <ToggleGroupControlOption value="top" label="Top" />
                                        <ToggleGroupControlOption value="bottom" label="Bottom" />
                                    </ToggleGroupControl>
                                )
                            }


                            <ToggleControl
                                label={__('Presentation Mode', 'embedpress')}
                                onChange={(presentation) =>
                                    setAttributes({ presentation })
                                }
                                checked={presentation}
                            />

                            <ToggleControl
                                label={__('Lazy Load', 'embedpress')}
                                onChange={(lazyLoad) =>
                                    setAttributes({ lazyLoad })
                                }
                                checked={lazyLoad}
                            />

                            {applyFilters('embedpress.pdfControls', [printPlaceholder], attributes, setAttributes, 'print')}


                            {
                                (viewerStyle === 'modern') ? (
                                    <Fragment>
                                        <ToggleControl
                                            label={__('Add Text', 'embedpress')}
                                            onChange={(add_text) =>
                                                setAttributes({ add_text })
                                            }
                                            checked={add_text}
                                        />

                                        {applyFilters('embedpress.pdfControls', [drawPlaceholder], attributes, setAttributes, 'draw')}
                                        {applyFilters('embedpress.pdfControls', [copyPlaceholder], attributes, setAttributes, 'copyText')}


                                        <ToggleControl
                                            label={__('Add Image', 'embedpress')}
                                            onChange={(add_image) =>
                                                setAttributes({ add_image })
                                            }
                                            checked={add_image}
                                        />
                                        <ToggleControl
                                            label={__('Rotation', 'embedpress')}
                                            onChange={(doc_rotation) =>
                                                setAttributes({ doc_rotation })
                                            }
                                            checked={doc_rotation}
                                        />

                                        <ToggleControl
                                            label={__('Properties', 'embedpress')}
                                            onChange={(doc_details) =>
                                                setAttributes({ doc_details })
                                            }
                                            checked={doc_details}
                                        />

                                        {applyFilters('embedpress.pdfControls', [selectionPlaceholder], attributes, setAttributes, 'selectionTool')}

                                        {applyFilters('embedpress.pdfControls', [scrollingPlaceholder], attributes, setAttributes, 'scrolling')}

                                        {
                                            scrolling !== '1' && (
                                                <SelectControl
                                                    label="Default Spreads"
                                                    value={spreads}
                                                    options={[
                                                        { label: 'No Spreads', value: '0' },
                                                        { label: 'Odd Spreads', value: '1' },
                                                        { label: 'Even Spreads', value: '2' },
                                                    ]}
                                                    onChange={(spreads) =>
                                                        setAttributes({ spreads })
                                                    }
                                                    __nextHasNoMarginBottom
                                                />
                                            )
                                        }

                                    </Fragment>
                                ) : (
                                    <Fragment>
                                        <ToggleControl
                                            label={__('Zoom In', 'embedpress')}
                                            onChange={(zoomIn) =>
                                                setAttributes({ zoomIn })
                                            }
                                            checked={zoomIn}
                                        />
                                        <ToggleControl
                                            label={__('Zoom Out', 'embedpress')}
                                            onChange={(zoomOut) =>
                                                setAttributes({ zoomOut })
                                            }
                                            checked={zoomOut}
                                        />
                                        <ToggleControl
                                            label={__('Fit View', 'embedpress')}
                                            onChange={(fitView) =>
                                                setAttributes({ fitView })
                                            }
                                            checked={fitView}
                                        />
                                        <ToggleControl
                                            label={__('Bookmark', 'embedpress')}
                                            onChange={(bookmark) =>
                                                setAttributes({ bookmark })
                                            }
                                            checked={bookmark}
                                        />
                                    </Fragment>
                                )
                            }

                            <ToggleControl
                                label={__('Powered By', 'embedpress')}
                                onChange={(powered_by) =>
                                    setAttributes({ powered_by })
                                }
                                checked={powered_by}
                            />


                        </Fragment>
                    )
                }
            </PanelBody>

            <CustomBranding attributes={attributes} setAttributes={setAttributes} />
            <AdControl attributes={attributes} setAttributes={setAttributes} />
            <LockControl attributes={attributes} setAttributes={setAttributes} />
            <ContentShare attributes={attributes} setAttributes={setAttributes} />

            <Upgrade />

        </InspectorControls>
    );
};

export default Inspector;
