/**
 * WordPress dependencies
 */
const { useBlockProps } = wp.blockEditor;

/**
 * Save component for EmbedPress PDF Gallery block
 * Outputs the gallery HTML that the frontend JS will enhance
 */
const Save = ({ attributes }) => {
    const blockProps = useBlockProps.save();

    const {
        pdfItems,
        layout,
        columns,
        columnsTablet,
        columnsMobile,
        gap,
        thumbnailAspectRatio,
        thumbnailBorderRadius,
        viewerStyle,
        themeMode,
        customColor,
        toolbar,
        position,
        flipbook_toolbar_position,
        presentation,
        download,
        copy_text,
        draw,
        add_text,
        add_image,
        doc_rotation,
        doc_details,
        zoomIn,
        zoomOut,
        fitView,
        bookmark,
        watermarkText,
        watermarkFontSize,
        watermarkColor,
        watermarkOpacity,
        watermarkStyle,
        clientId,
        carouselAutoplay,
        carouselAutoplaySpeed,
        carouselLoop,
        carouselArrows,
        carouselDots,
        slidesPerView,
    } = attributes;

    if (!pdfItems || !pdfItems.length) {
        return null;
    }

    // Generate viewer params (base64 encoded)
    function getViewerParams() {
        var colorsObj = {};
        if (themeMode === 'custom') {
            colorsObj.customColor = (customColor && customColor !== 'default') ? customColor : '#403A81';
        }

        var params = {
            themeMode: themeMode || 'default',
            ...colorsObj,
            presentation: presentation || false,
            position: position || 'top',
            flipbook_toolbar_position: flipbook_toolbar_position || 'bottom',
            download: download || false,
            toolbar: toolbar || false,
            copy_text: copy_text || false,
            add_text: add_text || false,
            draw: draw || false,
            doc_details: doc_details || false,
            doc_rotation: doc_rotation || false,
            add_image: add_image || false,
            zoom_in: zoomIn || false,
            zoom_out: zoomOut || false,
            fit_view: fitView || false,
            bookmark: bookmark || false,
            watermark_text: watermarkText || '',
            watermark_font_size: watermarkFontSize || '48',
            watermark_color: watermarkColor || '#000000',
            watermark_opacity: watermarkOpacity || '15',
            watermark_style: watermarkStyle || 'center',
        };

        var queryString = new URLSearchParams(params).toString();
        return btoa(encodeURIComponent(queryString).replace(/%([0-9A-F]{2})/g, function (match, p1) {
            return String.fromCharCode(parseInt(p1, 16));
        }));
    }

    var viewerParams = getViewerParams();
    var galleryId = 'ep-gallery-' + (clientId || '').substring(0, 8);

    var carouselOptions = JSON.stringify({
        autoplay: carouselAutoplay,
        autoplaySpeed: carouselAutoplaySpeed,
        loop: carouselLoop,
        arrows: carouselArrows,
        dots: carouselDots,
        slidesPerView: slidesPerView,
    });

    var containerStyle = {
        '--ep-gallery-columns': columns,
        '--ep-gallery-columns-tablet': columnsTablet,
        '--ep-gallery-columns-mobile': columnsMobile,
        '--ep-gallery-gap': gap + 'px',
        '--ep-gallery-radius': thumbnailBorderRadius + 'px',
    };

    var renderItems = function () {
        return pdfItems.map(function (item, index) {
            return (
                <div
                    className="ep-pdf-gallery__item"
                    key={item.url + '-' + index}
                    data-pdf-url={item.url}
                    data-pdf-index={index}
                    data-pdf-name={item.fileName || ''}
                >
                    <div className="ep-pdf-gallery__thumbnail-wrap" data-ratio={thumbnailAspectRatio}>
                        {(item.customThumbnailUrl || item.autoThumbnailUrl) ? (
                            <img src={item.customThumbnailUrl || item.autoThumbnailUrl} alt={item.fileName || 'PDF'} />
                        ) : (
                            <canvas className="ep-pdf-gallery__canvas" data-pdf-src={item.url} data-loading="true" />
                        )}
                        <div className="ep-pdf-gallery__overlay">
                            <svg className="ep-pdf-gallery__view-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 3l2.3 2.3-2.89 2.87 1.42 1.42L18.7 6.7 21 9V3h-6zM3 9l2.3-2.3 2.87 2.89 1.42-1.42L6.7 5.3 9 3H3v6zm6 12l-2.3-2.3 2.89-2.87-1.42-1.42L5.3 17.3 3 15v6h6zm12-6l-2.3 2.3-2.87-2.89-1.42 1.42 2.89 2.87L15 21h6v-6z" />
                            </svg>
                        </div>
                        <div className="ep-pdf-gallery__book-title">
                            {item.fileName || 'PDF'}
                        </div>
                    </div>
                </div>
            );
        });
    };

    return (
        <div {...blockProps}>
            <div
                className="ep-pdf-gallery"
                data-layout={layout}
                data-columns={columns}
                data-columns-tablet={columnsTablet}
                data-columns-mobile={columnsMobile}
                data-gap={gap}
                data-border-radius={thumbnailBorderRadius}
                data-viewer-style={viewerStyle}
                data-viewer-params={viewerParams}
                data-gallery-id={galleryId}
                data-carousel-options={(layout === 'carousel' || layout === 'bookshelf') ? carouselOptions : undefined}
                style={containerStyle}
            >
                {(layout === 'carousel' || layout === 'bookshelf') ? (
                    <div className="ep-pdf-gallery__carousel">
                        <div className="ep-pdf-gallery__carousel-track">
                            {renderItems()}
                        </div>
                        <button className="ep-pdf-gallery__carousel-prev" aria-label="Previous">
                            <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" /></svg>
                        </button>
                        <button className="ep-pdf-gallery__carousel-next" aria-label="Next">
                            <svg viewBox="0 0 24 24"><path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" /></svg>
                        </button>
                        <div className="ep-pdf-gallery__carousel-dots" />
                    </div>
                ) : (
                    <div className="ep-pdf-gallery__grid">
                        {renderItems()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Save;
