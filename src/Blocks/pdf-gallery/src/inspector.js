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
import { PLAY_BUTTON_ICONS } from './play-button-icons';

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
        thumbnailAspectRatio, thumbnailBorderRadius, bookshelfStyle,
        showPlayButton, playButtonIcon, playButtonColor, playButtonSize,
        playButtonBg, playButtonShape, hoverOverlayColor, playButtonAlwaysShow,
        carouselAutoplay, carouselAutoplaySpeed, carouselLoop,
        carouselArrows, carouselDots, slidesPerView,
        viewerStyle, themeMode, customColor, toolbar, position,
        flipbook_toolbar_position, presentation, download,
        copy_text, draw, add_text, add_image, doc_rotation,
        doc_details, zoomIn, zoomOut, fitView, bookmark,
        watermarkText, watermarkFontSize, watermarkColor,
        watermarkOpacity, watermarkStyle,
    } = attributes;

    const themeColors = [
        { name: '', color: '#823535' },
        { name: '', color: '#008000' },
        { name: '', color: '#403A81' },
        { name: '', color: '#333333' },
        { name: '', color: '#000264' },
    ];

    const iconColors = [
        { name: 'White', color: '#ffffff' },
        { name: 'Black', color: '#000000' },
        { name: 'Dark Gray', color: '#333333' },
        { name: 'Blue', color: '#1e73dc' },
        { name: 'Red', color: '#dc3232' },
    ];

    const bgColors = [
        { name: 'Blue', color: 'rgba(30, 115, 220, 0.85)' },
        { name: 'Dark', color: 'rgba(0, 0, 0, 0.6)' },
        { name: 'White', color: 'rgba(255, 255, 255, 0.9)' },
        { name: 'Red', color: 'rgba(220, 50, 50, 0.85)' },
        { name: 'Purple', color: 'rgba(91, 78, 150, 0.85)' },
    ];

    const overlayColors = [
        { name: 'Dark', color: 'rgba(0, 0, 0, 0.35)' },
        { name: 'Darker', color: 'rgba(0, 0, 0, 0.55)' },
        { name: 'Light', color: 'rgba(0, 0, 0, 0.15)' },
        { name: 'Blue', color: 'rgba(30, 115, 220, 0.25)' },
        { name: 'None', color: 'rgba(0, 0, 0, 0)' },
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
                        { label: __('Carousel', 'embedpress') + (isProPluginActive ? '' : ' (Pro)'), value: 'carousel' },
                        ...(!isProPluginActive ? [{ label: __('Bookshelf (Pro)', 'embedpress'), value: 'bookshelf' }] : []),
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
                    label={__('Gap', 'embedpress')}
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
                    label={__('Border Radius', 'embedpress')}
                    value={thumbnailBorderRadius}
                    onChange={(val) => setAttributes({ thumbnailBorderRadius: val })}
                    min={0}
                    max={30}
                />

                {layout === 'bookshelf' && (
                    <SelectControl
                        label={__('Shelf Style', 'embedpress')}
                        value={bookshelfStyle}
                        options={[
                            { label: __('Dark Wood', 'embedpress'), value: 'dark-wood' },
                            { label: __('Light Wood', 'embedpress'), value: 'light-wood' },
                            { label: __('Glass', 'embedpress'), value: 'glass' },
                        ]}
                        onChange={(val) => setAttributes({ bookshelfStyle: val })}
                    />
                )}
            </PanelBody>

            {/* Play Button Settings */}
            <PanelBody title={<div className='ep-pannel-icon'>{EPIcon} {__('Play Button', 'embedpress')}</div>} initialOpen={false}>
                <ToggleControl
                    label={__('Show Play Button', 'embedpress')}
                    checked={showPlayButton}
                    onChange={(val) => setAttributes({ showPlayButton: val })}
                />

                {showPlayButton && (
                    <Fragment>
                        <SelectControl
                            label={__('Icon', 'embedpress')}
                            value={playButtonIcon}
                            options={[
                                ...Object.keys(PLAY_BUTTON_ICONS).map(function (key) {
                                    return { label: PLAY_BUTTON_ICONS[key].label, value: key };
                                }),
                                { label: __('None (Background Only)', 'embedpress'), value: 'none' },
                            ]}
                            onChange={(val) => setAttributes({ playButtonIcon: val })}
                        />

                        {playButtonIcon !== 'none' && (
                            <Fragment>
                                <div>
                                    <ControlHeader headerText={__('Icon Color', 'embedpress')} />
                                    <ColorPalette
                                        colors={iconColors}
                                        value={playButtonColor}
                                        onChange={(val) => setAttributes({ playButtonColor: val || '#ffffff' })}
                                    />
                                </div>

                                <RangeControl
                                    label={__('Icon Size', 'embedpress')}
                                    value={playButtonSize}
                                    onChange={(val) => setAttributes({ playButtonSize: val })}
                                    min={24}
                                    max={80}
                                />
                            </Fragment>
                        )}

                        <div>
                            <ControlHeader headerText={__('Background Color', 'embedpress')} />
                            <ColorPalette
                                colors={bgColors}
                                value={playButtonBg}
                                onChange={(val) => setAttributes({ playButtonBg: val || '' })}
                                clearable={true}
                            />
                        </div>

                        {playButtonBg && (
                            <SelectControl
                                label={__('Background Shape', 'embedpress')}
                                value={playButtonShape}
                                options={[
                                    { label: __('Circle', 'embedpress'), value: 'circle' },
                                    { label: __('Rounded Square', 'embedpress'), value: 'rounded-square' },
                                    { label: __('None', 'embedpress'), value: 'none' },
                                ]}
                                onChange={(val) => setAttributes({ playButtonShape: val })}
                            />
                        )}

                        <div>
                            <ControlHeader headerText={__('Hover Overlay Color', 'embedpress')} />
                            <ColorPalette
                                colors={overlayColors}
                                value={hoverOverlayColor}
                                onChange={(val) => setAttributes({ hoverOverlayColor: val || 'rgba(0, 0, 0, 0.35)' })}
                            />
                        </div>

                        <ToggleControl
                            label={__('Always Visible', 'embedpress')}
                            help={playButtonAlwaysShow
                                ? __('Button is always visible', 'embedpress')
                                : __('Button appears on hover', 'embedpress')}
                            checked={playButtonAlwaysShow}
                            onChange={(val) => setAttributes({ playButtonAlwaysShow: val })}
                        />
                    </Fragment>
                )}
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

            {/* PDF Viewer (Popup) Settings */}
            <PanelBody title={<div className='ep-pannel-icon'>{EPIcon} {__('PDF Viewer (Popup)', 'embedpress')}</div>} initialOpen={false}>
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
                    label={__('Theme Mode', 'embedpress')}
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
                            colors={themeColors}
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
                                    label={__('Font Size', 'embedpress')}
                                    value={watermarkFontSize}
                                    onChange={(val) => setAttributes({ watermarkFontSize: val })}
                                    min={10}
                                    max={200}
                                />

                                <div>
                                    <ControlHeader headerText={__('Color', 'embedpress')} />
                                    <ColorPalette
                                        colors={themeColors}
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
                            label={__('Font Size', 'embedpress')}
                            value={watermarkFontSize || 48}
                            min={10}
                            max={200}
                            disabled
                        />

                        <div>
                            <ControlHeader headerText={__('Color', 'embedpress')} />
                            <div style={{ opacity: 0.5, pointerEvents: 'none' }}>
                                <ColorPalette
                                    colors={themeColors}
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
