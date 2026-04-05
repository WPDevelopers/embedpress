/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { useState, useEffect, Fragment } = wp.element;
const {
    BlockControls,
    BlockIcon,
    MediaPlaceholder,
    MediaUpload,
    MediaUploadCheck,
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
    Button,
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
import { isPro, removeAlert } from '../../GlobalCoponents/helper';

const isProPluginActive = typeof embedpressGutenbergData !== 'undefined' && embedpressGutenbergData.isProPluginActive;

const showProAlert = (e) => {
    if (isProPluginActive) return;
    let alertWrap = document.querySelector('.pro__alert__wrap');
    if (!alertWrap) {
        document.querySelector('body').append(isPro('none'));
        removeAlert();
        alertWrap = document.querySelector('.pro__alert__wrap');
    }
    if (alertWrap) {
        alertWrap.style.display = 'block';
    }
};

const Inspector = ({ attributes, setAttributes }) => {

    const { href, mime, id, unitoption, width, height, powered_by, themeMode, customColor, presentation, lazyLoad, position, flipbook_toolbar_position, download, add_text, draw, open, toolbar, copy_text, toolbar_position, doc_details, doc_rotation, add_image, selection_tool, scrolling, spreads, sharePosition, contentShare, adManager, adSource, adFileUrl, adWidth, adHeight, adXPosition, adYPosition, viewerStyle, displayMode, lightboxThumbnail, triggerText, triggerColor, triggerBgColor, triggerFontSize, triggerBorderRadius, zoomIn, zoomOut, fitView, bookmark, pageNumber, watermarkText, watermarkFontSize, watermarkColor, watermarkOpacity, watermarkStyle } = attributes;


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

                <TextControl
                    label={__('Open at Page', 'embedpress')}
                    help={__('Set the page number to open the PDF at. Visitors can also use ?eppage=N in the URL.', 'embedpress')}
                    value={pageNumber || 1}
                    type={'number'}
                    onChange={(value) => {
                        const num = parseInt(value, 10);
                        setAttributes({ pageNumber: num > 0 ? num : 1 });
                    }}
                />

                <SelectControl
                    label="Display Mode"
                    value={displayMode}
                    options={[
                        { label: 'Inline Viewer', value: 'inline' },
                        { label: 'Thumbnail + Lightbox', value: 'lightbox' },
                        { label: 'Button + Lightbox', value: 'button' },
                        { label: 'Link + Lightbox', value: 'link' },
                        { label: 'Text + Lightbox', value: 'text' },
                    ]}
                    onChange={(displayMode) =>
                        setAttributes({ displayMode })
                    }
                    __nextHasNoMarginBottom
                />

                {(displayMode === 'button' || displayMode === 'link' || displayMode === 'text') && (
                    <Fragment>
                        <TextControl
                            label={__('Display Text', 'embedpress')}
                            value={triggerText || 'View PDF'}
                            onChange={(val) => setAttributes({ triggerText: val })}
                            __nextHasNoMarginBottom
                        />

                        <div style={{ marginBottom: '16px' }}>
                            <ControlHeader headerText={__('Text Color', 'embedpress')} />
                            <ColorPalette
                                value={triggerColor}
                                onChange={(val) => setAttributes({ triggerColor: val || '' })}
                            />
                        </div>

                        {displayMode === 'button' && (
                            <Fragment>
                                <div style={{ marginBottom: '16px' }}>
                                    <ControlHeader headerText={__('Background Color', 'embedpress')} />
                                    <ColorPalette
                                        value={triggerBgColor}
                                        onChange={(val) => setAttributes({ triggerBgColor: val || '' })}
                                    />
                                </div>

                                <RangeControl
                                    label={__('Border Radius', 'embedpress')}
                                    value={parseInt(triggerBorderRadius) || 6}
                                    onChange={(val) => setAttributes({ triggerBorderRadius: String(val) })}
                                    min={0}
                                    max={50}
                                    __nextHasNoMarginBottom
                                />
                            </Fragment>
                        )}

                        <RangeControl
                            label={__('Font Size', 'embedpress')}
                            value={parseInt(triggerFontSize) || 15}
                            onChange={(val) => setAttributes({ triggerFontSize: String(val) })}
                            min={10}
                            max={40}
                            __nextHasNoMarginBottom
                        />
                    </Fragment>
                )}

                {displayMode === 'lightbox' && (
                    isProPluginActive ? (
                        <div className="ep-lightbox-thumbnail-control" style={{ marginBottom: '16px' }}>
                            <ControlHeader headerText={__('Custom Thumbnail', 'embedpress')} />
                            {lightboxThumbnail ? (
                                <div>
                                    <img src={lightboxThumbnail} alt="" style={{ maxWidth: '100%', borderRadius: '4px', marginBottom: '8px' }} />
                                    <Button
                                        isDestructive
                                        isSmall
                                        onClick={() => setAttributes({ lightboxThumbnail: '' })}
                                    >
                                        {__('Remove Thumbnail', 'embedpress')}
                                    </Button>
                                </div>
                            ) : (
                                <MediaUploadCheck>
                                    <MediaUpload
                                        onSelect={(media) => {
                                            if (media && media.url) {
                                                setAttributes({ lightboxThumbnail: media.url });
                                            }
                                        }}
                                        allowedTypes={['image']}
                                        render={({ open }) => (
                                            <Button
                                                isSecondary
                                                onClick={open}
                                            >
                                                {__('Upload Thumbnail', 'embedpress')}
                                            </Button>
                                        )}
                                    />
                                </MediaUploadCheck>
                            )}
                            <p style={{ color: '#757575', fontSize: '12px', marginTop: '4px' }}>
                                {__('Leave empty to auto-generate from PDF first page.', 'embedpress')}
                            </p>
                        </div>
                    ) : (
                        <div className={"pro-control"} onClick={showProAlert}>
                            <div className="ep-lightbox-thumbnail-control" style={{ marginBottom: '16px' }}>
                                <ControlHeader headerText={__('Custom Thumbnail', 'embedpress')} />
                                <Button isSecondary>
                                    {__('Upload Thumbnail', 'embedpress')}
                                </Button>
                                <p style={{ color: '#757575', fontSize: '12px', marginTop: '4px' }}>
                                    {__('Leave empty to auto-generate from PDF first page.', 'embedpress')}
                                </p>
                            </div>
                            <span className='isPro'>{__('pro', 'embedpress')}</span>
                        </div>
                    )
                )}

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

                            {displayMode === 'inline' && (
                                <ToggleControl
                                    label={__('Powered By', 'embedpress')}
                                    onChange={(powered_by) =>
                                        setAttributes({ powered_by })
                                    }
                                    checked={powered_by}
                                />
                            )}


                        </Fragment>
                    )
                }
            </PanelBody>

            <PanelBody title={<div className='ep-pannel-icon'>{EPIcon} {__('Watermark', 'embedpress')}</div>} initialOpen={false}>
                {isProPluginActive ? (
                    <Fragment>
                        <TextControl
                            label={__('Watermark Text', 'embedpress')}
                            value={watermarkText}
                            placeholder={__('e.g. CONFIDENTIAL', 'embedpress')}
                            onChange={(watermarkText) => setAttributes({ watermarkText })}
                        />

                        {watermarkText && (
                            <Fragment>
                                <SelectControl
                                    label={__('Watermark Style', 'embedpress')}
                                    value={watermarkStyle}
                                    options={[
                                        { label: __('Center Diagonal', 'embedpress'), value: 'center' },
                                        { label: __('Tiled / Repeated', 'embedpress'), value: 'tiled' },
                                    ]}
                                    onChange={(watermarkStyle) => setAttributes({ watermarkStyle })}
                                    __nextHasNoMarginBottom
                                />

                                <RangeControl
                                    label={__('Font Size (px)', 'embedpress')}
                                    value={watermarkFontSize}
                                    onChange={(watermarkFontSize) => setAttributes({ watermarkFontSize })}
                                    min={10}
                                    max={200}
                                />

                                <div>
                                    <ControlHeader headerText={__('Color', 'embedpress')} />
                                    <ColorPalette
                                        colors={colors}
                                        value={watermarkColor}
                                        onChange={(watermarkColor) => setAttributes({ watermarkColor: watermarkColor || '#000000' })}
                                    />
                                </div>

                                <RangeControl
                                    label={__('Opacity (%)', 'embedpress')}
                                    value={watermarkOpacity}
                                    onChange={(watermarkOpacity) => setAttributes({ watermarkOpacity })}
                                    min={1}
                                    max={100}
                                />
                            </Fragment>
                        )}
                    </Fragment>
                ) : (
                    <div className={"pro-control"} onClick={showProAlert}>
                        <TextControl
                            label={__('Watermark Text', 'embedpress')}
                            placeholder={__('e.g. CONFIDENTIAL', 'embedpress')}
                            disabled
                        />
                        
                        <SelectControl
                            label={__('Watermark Style', 'embedpress')}
                            options={[
                                { label: __('Center Diagonal', 'embedpress'), value: 'center' },
                                { label: __('Tiled / Repeated', 'embedpress'), value: 'tiled' },
                            ]}
                            disabled
                        />
                        
                        <RangeControl
                            label={__('Font Size (px)', 'embedpress')}
                            value={watermarkFontSize || 48}
                            min={10}
                            max={200}
                            disabled
                        />
                        
                        <div>
                            <ControlHeader headerText={__('Color', 'embedpress')} />
                            <div style={{ opacity: 0.5, pointerEvents: 'none' }}>
                                <ColorPalette
                                    colors={colors}
                                    value={watermarkColor || '#000000'}
                                />
                            </div>
                        </div>
                        
                        <RangeControl
                            label={__('Opacity (%)', 'embedpress')}
                            value={watermarkOpacity || 15}
                            min={1}
                            max={100}
                            disabled
                        />
                        
                        <span className='isPro'>{__('pro', 'embedpress')}</span>
                    </div>
                )}
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
