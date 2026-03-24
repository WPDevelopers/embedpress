/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const {
    InspectorControls,
} = wp.blockEditor;

const {
    PanelBody,
    RangeControl,
    SelectControl,
    ToggleControl,
    ColorPalette,
    TextControl,
} = wp.components;

const { applyFilters } = wp.hooks;

/**
 * Internal dependencies
 */
import ControlHeader from '../../GlobalCoponents/control-heading';
import { EPIcon } from "../../GlobalCoponents/icons";
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
    const {
        layout, columns, columnsTablet, columnsMobile, gap,
        thumbnailAspectRatio, thumbnailBorderRadius,
        carouselAutoplay, carouselAutoplaySpeed, carouselLoop,
        carouselArrows, carouselDots, slidesPerView,
        viewerStyle, themeMode, customColor, toolbar, position,
        flipbook_toolbar_position, presentation, download,
        copy_text, draw, add_text, add_image, doc_rotation,
        doc_details, zoomIn, zoomOut, fitView, bookmark,
        watermarkText, watermarkFontSize, watermarkColor,
        watermarkOpacity, watermarkStyle,
    } = attributes;

    const colors = [
        { name: '', color: '#823535' },
        { name: '', color: '#008000' },
        { name: '', color: '#403A81' },
        { name: '', color: '#333333' },
        { name: '', color: '#000264' },
    ];

    // Pro placeholders (same pattern as embedpress-pdf block)
    const toobarPlaceholder = applyFilters('embedpress.togglePlaceholder', [], __('Toolbar', 'embedpress'), true);
    const printPlaceholder = applyFilters('embedpress.togglePlaceholder', [], __('Print/Download', 'embedpress'), true);
    const drawPlaceholder = applyFilters('embedpress.togglePlaceholder', [], __('Draw', 'embedpress'), false);
    const copyPlaceholder = applyFilters('embedpress.togglePlaceholder', [], __('Copy Text', 'embedpress'), true);

    return (
        <InspectorControls key="inspector">

            {/* Layout Settings */}
            <PanelBody title={<div className='ep-pannel-icon'>{EPIcon} {__('Layout', 'embedpress')}</div>}>
                <SelectControl
                    label={__('Layout Type', 'embedpress')}
                    value={layout}
                    options={applyFilters('embedpress.galleryLayoutOptions', [
                        { label: __('Grid', 'embedpress'), value: 'grid' },
                        { label: __('Masonry', 'embedpress'), value: 'masonry' },
                        ...(isProPluginActive
                            ? [
                                { label: __('Carousel', 'embedpress'), value: 'carousel' },
                                { label: __('Bookshelf', 'embedpress'), value: 'bookshelf' },
                            ]
                            : [
                                { label: __('Carousel (Pro)', 'embedpress'), value: 'carousel' },
                                { label: __('Bookshelf (Pro)', 'embedpress'), value: 'bookshelf' },
                            ]
                        ),
                    ])}
                    onChange={(val) => {
                        if ((val === 'bookshelf' || val === 'carousel') && !isProPluginActive) {
                            showProAlert();
                            return;
                        }
                        setAttributes({ layout: val });
                    }}
                />

                {layout !== 'carousel' && (
                    <Fragment>
                        <RangeControl
                            label={__('Columns (Desktop)', 'embedpress')}
                            value={columns}
                            onChange={(val) => setAttributes({ columns: val })}
                            min={1}
                            max={6}
                        />
                        <RangeControl
                            label={__('Columns (Tablet)', 'embedpress')}
                            value={columnsTablet}
                            onChange={(val) => setAttributes({ columnsTablet: val })}
                            min={1}
                            max={4}
                        />
                        <RangeControl
                            label={__('Columns (Mobile)', 'embedpress')}
                            value={columnsMobile}
                            onChange={(val) => setAttributes({ columnsMobile: val })}
                            min={1}
                            max={3}
                        />
                    </Fragment>
                )}

                <RangeControl
                    label={__('Gap (px)', 'embedpress')}
                    value={gap}
                    onChange={(val) => setAttributes({ gap: val })}
                    min={0}
                    max={60}
                />

                {layout !== 'bookshelf' && (
                    <SelectControl
                        label={__('Thumbnail Aspect Ratio', 'embedpress')}
                        value={thumbnailAspectRatio}
                        options={[
                            { label: '4:3', value: '4:3' },
                            { label: '1:1', value: '1:1' },
                            { label: '3:4', value: '3:4' },
                            { label: '16:9', value: '16:9' },
                        ]}
                        onChange={(val) => setAttributes({ thumbnailAspectRatio: val })}
                    />
                )}

                <RangeControl
                    label={__('Border Radius (px)', 'embedpress')}
                    value={thumbnailBorderRadius}
                    onChange={(val) => setAttributes({ thumbnailBorderRadius: val })}
                    min={0}
                    max={30}
                />
            </PanelBody>

            {/* Carousel Settings */}
            {layout === 'carousel' && (
                <PanelBody title={<div className='ep-pannel-icon'>{EPIcon} {__('Carousel', 'embedpress')}</div>} initialOpen={false}>
                    <RangeControl
                        label={__('Slides Per View', 'embedpress')}
                        value={slidesPerView}
                        onChange={(val) => setAttributes({ slidesPerView: val })}
                        min={1}
                        max={6}
                    />
                    <ToggleControl
                        label={__('Autoplay', 'embedpress')}
                        checked={carouselAutoplay}
                        onChange={(val) => setAttributes({ carouselAutoplay: val })}
                    />
                    {carouselAutoplay && (
                        <RangeControl
                            label={__('Autoplay Speed (ms)', 'embedpress')}
                            value={carouselAutoplaySpeed}
                            onChange={(val) => setAttributes({ carouselAutoplaySpeed: val })}
                            min={1000}
                            max={10000}
                            step={500}
                        />
                    )}
                    <ToggleControl
                        label={__('Loop', 'embedpress')}
                        checked={carouselLoop}
                        onChange={(val) => setAttributes({ carouselLoop: val })}
                    />
                    <ToggleControl
                        label={__('Arrows', 'embedpress')}
                        checked={carouselArrows}
                        onChange={(val) => setAttributes({ carouselArrows: val })}
                    />
                    <ToggleControl
                        label={__('Dots', 'embedpress')}
                        checked={carouselDots}
                        onChange={(val) => setAttributes({ carouselDots: val })}
                    />
                </PanelBody>
            )}

            {/* PDF Viewer Settings */}
            <PanelBody title={<div className='ep-pannel-icon'>{EPIcon} {__('PDF Viewer', 'embedpress')}</div>} initialOpen={false}>
                <SelectControl
                    label={__('Viewer Style', 'embedpress')}
                    value={viewerStyle}
                    options={[
                        { label: __('Modern', 'embedpress'), value: 'modern' },
                        { label: __('Flip Book', 'embedpress'), value: 'flip-book' },
                    ]}
                    onChange={(val) => setAttributes({ viewerStyle: val })}
                />

                <SelectControl
                    label={__('Theme', 'embedpress')}
                    value={themeMode}
                    options={[
                        { label: __('System Default', 'embedpress'), value: 'default' },
                        { label: __('Dark', 'embedpress'), value: 'dark' },
                        { label: __('Light', 'embedpress'), value: 'light' },
                        { label: __('Custom', 'embedpress'), value: 'custom' },
                    ]}
                    onChange={(val) => setAttributes({ themeMode: val })}
                />

                {themeMode === 'custom' && (
                    <Fragment>
                        <ControlHeader headerText={__('Custom Color', 'embedpress')} />
                        <ColorPalette
                            colors={colors}
                            value={customColor}
                            onChange={(val) => setAttributes({ customColor: val })}
                        />
                    </Fragment>
                )}

                {applyFilters('embedpress.pdfControls', [toobarPlaceholder], attributes, setAttributes, 'toolbar')}

                {toolbar && (
                    <Fragment>
                        {viewerStyle !== 'flip-book' && (
                            <SelectControl
                                label={__('Toolbar Position', 'embedpress')}
                                value={position}
                                options={[
                                    { label: __('Top', 'embedpress'), value: 'top' },
                                    { label: __('Bottom', 'embedpress'), value: 'bottom' },
                                ]}
                                onChange={(val) => setAttributes({ position: val })}
                            />
                        )}

                        {viewerStyle === 'flip-book' && (
                            <SelectControl
                                label={__('Toolbar Position', 'embedpress')}
                                value={flipbook_toolbar_position}
                                options={[
                                    { label: __('Top', 'embedpress'), value: 'top' },
                                    { label: __('Bottom', 'embedpress'), value: 'bottom' },
                                ]}
                                onChange={(val) => setAttributes({ flipbook_toolbar_position: val })}
                            />
                        )}

                        <ToggleControl
                            label={__('Presentation Mode', 'embedpress')}
                            checked={presentation}
                            onChange={(val) => setAttributes({ presentation: val })}
                        />

                        {applyFilters('embedpress.pdfControls', [printPlaceholder], attributes, setAttributes, 'print')}

                        {viewerStyle !== 'flip-book' && (
                            <Fragment>
                                {applyFilters('embedpress.pdfControls', [copyPlaceholder], attributes, setAttributes, 'copyText')}
                                {applyFilters('embedpress.pdfControls', [drawPlaceholder], attributes, setAttributes, 'draw')}

                                <ToggleControl
                                    label={__('Add Text', 'embedpress')}
                                    checked={add_text}
                                    onChange={(val) => setAttributes({ add_text: val })}
                                />
                                <ToggleControl
                                    label={__('Add Image', 'embedpress')}
                                    checked={add_image}
                                    onChange={(val) => setAttributes({ add_image: val })}
                                />
                                <ToggleControl
                                    label={__('Rotation', 'embedpress')}
                                    checked={doc_rotation}
                                    onChange={(val) => setAttributes({ doc_rotation: val })}
                                />
                                <ToggleControl
                                    label={__('Properties', 'embedpress')}
                                    checked={doc_details}
                                    onChange={(val) => setAttributes({ doc_details: val })}
                                />
                            </Fragment>
                        )}

                        {viewerStyle === 'flip-book' && (
                            <Fragment>
                                <ToggleControl
                                    label={__('Zoom In', 'embedpress')}
                                    checked={zoomIn}
                                    onChange={(val) => setAttributes({ zoomIn: val })}
                                />
                                <ToggleControl
                                    label={__('Zoom Out', 'embedpress')}
                                    checked={zoomOut}
                                    onChange={(val) => setAttributes({ zoomOut: val })}
                                />
                                <ToggleControl
                                    label={__('Fit View', 'embedpress')}
                                    checked={fitView}
                                    onChange={(val) => setAttributes({ fitView: val })}
                                />
                                <ToggleControl
                                    label={__('Bookmark', 'embedpress')}
                                    checked={bookmark}
                                    onChange={(val) => setAttributes({ bookmark: val })}
                                />
                            </Fragment>
                        )}
                    </Fragment>
                )}
            </PanelBody>

            {/* Watermark Settings */}
            <PanelBody title={<div className='ep-pannel-icon'>{EPIcon} {__('Watermark', 'embedpress')}</div>} initialOpen={false}>
                {isProPluginActive ? (
                    <Fragment>
                        <TextControl
                            label={__('Watermark Text', 'embedpress')}
                            value={watermarkText}
                            placeholder={__('e.g. CONFIDENTIAL', 'embedpress')}
                            onChange={(val) => setAttributes({ watermarkText: val })}
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
                                    onChange={(val) => setAttributes({ watermarkStyle: val })}
                                />

                                <RangeControl
                                    label={__('Font Size (px)', 'embedpress')}
                                    value={watermarkFontSize}
                                    onChange={(val) => setAttributes({ watermarkFontSize: val })}
                                    min={10}
                                    max={200}
                                />

                                <div>
                                    <ControlHeader headerText={__('Color', 'embedpress')} />
                                    <ColorPalette
                                        colors={colors}
                                        value={watermarkColor}
                                        onChange={(val) => setAttributes({ watermarkColor: val || '#000000' })}
                                    />
                                </div>

                                <RangeControl
                                    label={__('Opacity (%)', 'embedpress')}
                                    value={watermarkOpacity}
                                    onChange={(val) => setAttributes({ watermarkOpacity: val })}
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
        </InspectorControls>
    );
};

export default Inspector;
