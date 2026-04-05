/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { useState, useEffect, useRef, Fragment } = wp.element;
const {
    BlockControls,
    MediaPlaceholder,
    MediaUpload,
    useBlockProps,
} = wp.blockEditor;
const {
    ToolbarButton,
    ToolbarGroup,
    Button,
} = wp.components;

/**
 * Internal dependencies
 */
import Inspector from "../inspector";
import { PdfIcon } from "../../../GlobalCoponents/icons";
import { isPro, removeAlert } from '../../../GlobalCoponents/helper';
import { getPlayButtonIconPath, getPlayButtonIconViewBox } from '../play-button-icons';

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

const ALLOWED_MEDIA_TYPES = ['application/pdf'];

// Module-level PDF.js loader — ensures the script is loaded only once
var pdfjsLoadPromise = null;

function ensurePdfjsLoaded(callback) {
    if (window.pdfjsLib) {
        callback(true);
        return;
    }

    if (pdfjsLoadPromise) {
        pdfjsLoadPromise.then(callback);
        return;
    }

    var baseUrl = '';
    if (typeof embedpressGutenbergData !== 'undefined') {
        if (embedpressGutenbergData.assetsUrl) {
            baseUrl = embedpressGutenbergData.assetsUrl;
        } else if (embedpressGutenbergData.staticUrl) {
            baseUrl = embedpressGutenbergData.staticUrl.replace(/static\/?$/, 'assets/');
        }
    }

    if (!baseUrl) {
        console.error('[EP PDF Gallery] No assetsUrl or staticUrl found in embedpressGutenbergData');
        callback(false);
        return;
    }

    var scriptSrc = baseUrl + 'pdf/build/script.js';
    pdfjsLoadPromise = new Promise(function (resolve) {
        var script = document.createElement('script');
        script.src = scriptSrc;
        script.type = 'module';
        script.onload = function () {
            // Module scripts execute asynchronously; pdfjsLib is set on globalThis
            setTimeout(function () {
                if (window.pdfjsLib || globalThis.pdfjsLib) {
                    if (!window.pdfjsLib) window.pdfjsLib = globalThis.pdfjsLib;
                    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
                        baseUrl + 'pdf/build/pdf.worker.js';
                    resolve(true);
                } else {
                    console.error('[EP PDF Gallery] Script loaded but pdfjsLib not found');
                    resolve(false);
                }
            }, 50);
        };
        script.onerror = function () {
            console.error('[EP PDF Gallery] Failed to load PDF.js from:', scriptSrc);
            resolve(false);
        };
        document.head.appendChild(script);
    });

    pdfjsLoadPromise.then(callback);
}

function renderPdfThumbnail(canvas, pdfUrl, onRendered) {
    ensurePdfjsLoaded(function (ok) {
        if (!ok || !window.pdfjsLib) {
            console.error('[EP PDF Gallery] PDF.js not available, cannot render:', pdfUrl);
            return;
        }

        var loadingTask = window.pdfjsLib.getDocument(pdfUrl);
        loadingTask.promise.then(function (pdf) {
            pdf.getPage(1).then(function (page) {
                var containerWidth = canvas.parentElement ? canvas.parentElement.offsetWidth : 400;
                var targetWidth = Math.max(containerWidth * (window.devicePixelRatio || 1), 600);
                var scale = targetWidth / page.getViewport({ scale: 1 }).width;
                scale = Math.max(scale, 1);
                var viewport = page.getViewport({ scale: scale });

                canvas.width = viewport.width;
                canvas.height = viewport.height;
                var ctx = canvas.getContext('2d');
                page.render({ canvasContext: ctx, viewport: viewport }).promise.then(function () {
                    canvas.dataset.rendered = pdfUrl;
                    if (onRendered) onRendered(canvas);
                }).catch(function (err) {
                    console.error('[EP PDF Gallery] Page render failed:', err);
                });
            }).catch(function (err) {
                console.error('[EP PDF Gallery] getPage failed:', err);
            });
        }).catch(function (err) {
            console.error('[EP PDF Gallery] getDocument failed:', err);
        });
    });
}

/**
 * Upload a rendered canvas as PNG thumbnail to WordPress via AJAX.
 */
function uploadPdfThumbnail(canvas, pdfUrl, fileName, attachmentId) {
    var gutenbergData = typeof embedpressGutenbergData !== 'undefined' ? embedpressGutenbergData : null;
    if (!gutenbergData || !gutenbergData.ajaxUrl || !gutenbergData.pdfGalleryNonce) {
        console.error('[EP PDF Gallery] Missing ajaxUrl or pdfGalleryNonce in embedpressGutenbergData');
        return null;
    }

    var dataUrl;
    try {
        dataUrl = canvas.toDataURL('image/png');
    } catch (e) {
        console.error('[EP PDF Gallery] toDataURL failed (CORS?):', e.message);
        return null;
    }

    var formData = new FormData();
    formData.append('action', 'ep_upload_pdf_thumbnail');
    formData.append('nonce', gutenbergData.pdfGalleryNonce);
    formData.append('image_data', dataUrl);
    formData.append('pdf_url', pdfUrl);
    formData.append('file_name', fileName || '');
    if (attachmentId) {
        formData.append('attachment_id', attachmentId);
    }

    return fetch(gutenbergData.ajaxUrl, { method: 'POST', body: formData })
        .then(function (r) { return r.json(); })
        .then(function (data) {
            if (data.success && data.data && data.data.url) {
                return { url: data.data.url, id: data.data.id };
            }
            console.error('[EP PDF Gallery] Upload failed, response:', data);
            return null;
        })
        .catch(function (err) {
            console.error('[EP PDF Gallery] Upload fetch error:', err);
            return null;
        });
}

/**
 * Try to get a cached thumbnail from the server for a PDF attachment.
 * Returns a promise that resolves to { url, id } or null.
 */
function getCachedThumbnail(attachmentId) {
    var gutenbergData = typeof embedpressGutenbergData !== 'undefined' ? embedpressGutenbergData : null;
    if (!gutenbergData || !gutenbergData.ajaxUrl || !gutenbergData.pdfGalleryNonce || !attachmentId) {
        return Promise.resolve(null);
    }

    var formData = new FormData();
    formData.append('action', 'ep_generate_pdf_thumbnail');
    formData.append('nonce', gutenbergData.pdfGalleryNonce);
    formData.append('attachment_id', attachmentId);

    return fetch(gutenbergData.ajaxUrl, { method: 'POST', body: formData })
        .then(function (r) { return r.json(); })
        .then(function (data) {
            if (data.success && data.data && data.data.url) {
                return { url: data.data.url, id: data.data.id };
            }
            return null;
        })
        .catch(function () {
            return null;
        });
}

function Edit(props) {
    const { attributes, setAttributes, clientId, isSelected } = props;
    const {
        pdfItems, layout, columns, columnsTablet, columnsMobile, gap,
        thumbnailAspectRatio, thumbnailBorderRadius, bookshelfStyle,
        showPlayButton, playButtonIcon, playButtonColor, playButtonSize,
        playButtonBg, playButtonShape, hoverOverlayColor, playButtonAlwaysShow,
        slidesPerView,
    } = attributes;

    const blockProps = useBlockProps();
    const canvasRefs = useRef({});
    const pdfItemsRef = useRef(pdfItems);

    // Keep ref in sync for async callbacks
    useEffect(() => { pdfItemsRef.current = pdfItems; }, [pdfItems]);

    // Set clientId on mount
    useEffect(() => {
        if (!attributes.clientId) {
            setAttributes({ clientId });
        }
    }, []);

    // Render PDF thumbnails via PDF.js, then upload as real images
    // First tries to get a cached thumbnail from the server to avoid regeneration
    useEffect(() => {
        if (!pdfItems || !pdfItems.length) return;

        pdfItems.forEach(function (item, index) {
            if (item.customThumbnailUrl || item.autoThumbnailUrl) return;
            var canvas = canvasRefs.current[index];
            if (!canvas || canvas.dataset.rendered === item.url) return;

            function applyThumbnail(thumbData) {
                if (!thumbData) return;
                var latest = pdfItemsRef.current || [];
                var updated = latest.map(function (it) {
                    if (it.url === item.url && !it.autoThumbnailUrl) {
                        return Object.assign({}, it, {
                            autoThumbnailId: thumbData.id,
                            autoThumbnailUrl: thumbData.url,
                        });
                    }
                    return it;
                });
                setAttributes({ pdfItems: updated });
            }

            // Try cached thumbnail from server first
            getCachedThumbnail(item.id).then(function (cached) {
                if (cached) {
                    applyThumbnail(cached);
                    return;
                }

                // No cache — render client-side and upload
                renderPdfThumbnail(canvas, item.url, function (renderedCanvas) {
                    var result = uploadPdfThumbnail(renderedCanvas, item.url, item.fileName, item.id);
                    if (result) {
                        result.then(applyThumbnail);
                    }
                });
            });
        });
    }, [pdfItems]);

    function onSelectFiles(media) {
        if (!media || !media.length) return;

        var newItems = media.map(function (file) {
            return {
                id: file.id,
                url: file.url,
                fileName: file.filename || file.title || '',
                customThumbnailId: 0,
                customThumbnailUrl: '',
                autoThumbnailId: 0,
                autoThumbnailUrl: '',
            };
        });

        // Merge with existing items, avoid duplicates by URL
        var existingUrls = (pdfItems || []).map(function (item) { return item.url; });
        var unique = newItems.filter(function (item) { return existingUrls.indexOf(item.url) === -1; });

        setAttributes({ pdfItems: (pdfItems || []).concat(unique) });
    }

    function removeItem(index) {
        var updated = pdfItems.filter(function (_, i) { return i !== index; });
        setAttributes({ pdfItems: updated });
    }

    function moveItem(fromIndex, toIndex) {
        if (toIndex < 0 || toIndex >= pdfItems.length) return;
        var updated = [].concat(pdfItems);
        var item = updated.splice(fromIndex, 1)[0];
        updated.splice(toIndex, 0, item);
        setAttributes({ pdfItems: updated });
    }

    function setCustomThumbnail(index, media) {
        var updated = pdfItems.map(function (item, i) {
            if (i === index) {
                return Object.assign({}, item, {
                    customThumbnailId: media.id,
                    customThumbnailUrl: media.url,
                });
            }
            return item;
        });
        setAttributes({ pdfItems: updated });
    }

    function removeCustomThumbnail(index) {
        var updated = pdfItems.map(function (item, i) {
            if (i === index) {
                return Object.assign({}, item, {
                    customThumbnailId: 0,
                    customThumbnailUrl: '',
                });
            }
            return item;
        });
        setAttributes({ pdfItems: updated });
    }

    // Empty state - show media placeholder
    if (!pdfItems || !pdfItems.length) {
        return (
            <div {...blockProps}>
                <Inspector attributes={attributes} setAttributes={setAttributes} />
                <MediaPlaceholder
                    icon={PdfIcon}
                    labels={{
                        title: __('PDF Gallery', 'embedpress'),
                        instructions: __('Select multiple PDF files to create a gallery.', 'embedpress'),
                    }}
                    allowedTypes={ALLOWED_MEDIA_TYPES}
                    multiple="add"
                    onSelect={onSelectFiles}
                />
            </div>
        );
    }

    var isBookshelf = layout === 'bookshelf';
    var isCarousel = layout === 'carousel';

    // CSS variables for the gallery container — same as frontend
    var containerStyle = {
        '--ep-gallery-columns-desktop': columns,
        '--ep-gallery-columns-tablet': columnsTablet,
        '--ep-gallery-columns-mobile': columnsMobile,
        '--ep-gallery-gap': gap + 'px',
        '--ep-gallery-radius': thumbnailBorderRadius + 'px',
    };
    if (isCarousel) {
        var spv = slidesPerView || 3;
        var gapPx = gap || 20;
        // calc: (100% - gaps) / slides — approximate with a fixed container assumption
        containerStyle['--ep-carousel-slide-width'] = 'calc((100% - ' + (gapPx * (spv - 1)) + 'px) / ' + spv + ')';
    }

    // Build play button icon style
    var viewIconStyle = {
        width: playButtonSize + 'px',
        height: playButtonSize + 'px',
        fill: playButtonColor || '#ffffff',
    };
    if (playButtonBg) {
        viewIconStyle.backgroundColor = playButtonBg;
        viewIconStyle.padding = Math.round(playButtonSize * 0.22) + 'px';
        viewIconStyle.boxSizing = 'content-box';
        if (playButtonShape === 'circle') {
            viewIconStyle.borderRadius = '50%';
        } else if (playButtonShape === 'rounded-square') {
            viewIconStyle.borderRadius = '12px';
        }
    }
    if (playButtonAlwaysShow) {
        viewIconStyle.opacity = '1';
        viewIconStyle.transform = 'scale(1)';
    }

    // Overlay style
    var overlayStyle = {};
    if (hoverOverlayColor && hoverOverlayColor !== 'rgba(0, 0, 0, 0.35)') {
        overlayStyle.background = hoverOverlayColor;
    }
    if (playButtonAlwaysShow) {
        overlayStyle.background = hoverOverlayColor || 'rgba(0, 0, 0, 0.35)';
    }

    // Render a single gallery item
    function renderItem(item, index) {
        return (
            <div className={'ep-pdf-gallery__item' + (playButtonAlwaysShow ? ' ep-pdf-gallery__item--always-show' : '')} key={item.url + '-' + index}>
                <div className="ep-pdf-gallery__thumbnail-wrap" data-ratio={thumbnailAspectRatio}>
                    {(item.customThumbnailUrl || item.autoThumbnailUrl) ? (
                        <img src={item.customThumbnailUrl || item.autoThumbnailUrl} alt={item.fileName} />
                    ) : (
                        <canvas
                            ref={function (el) { canvasRefs.current[index] = el; }}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    )}
                    {showPlayButton !== false && (
                        <div className="ep-pdf-gallery__overlay" style={overlayStyle}>
                            {playButtonIcon !== 'none' && (
                                <svg className="ep-pdf-gallery__view-icon"
                                    viewBox={getPlayButtonIconViewBox(playButtonIcon)}
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={viewIconStyle}>
                                    <path d={getPlayButtonIconPath(playButtonIcon)} />
                                </svg>
                            )}
                        </div>
                    )}
                </div>
                <div className="ep-pdf-gallery__book-title">
                    {item.fileName || 'PDF'}
                </div>

                {isSelected && (
                    <div className="ep-pdf-gallery-editor__item-actions">
                        {index > 0 && (
                            <button className="ep-pdf-gallery-editor__item-btn"
                                    title={__('Move Left', 'embedpress')}
                                    onClick={() => moveItem(index, index - 1)}>
                                &#8592;
                            </button>
                        )}
                        {index < pdfItems.length - 1 && (
                            <button className="ep-pdf-gallery-editor__item-btn"
                                    title={__('Move Right', 'embedpress')}
                                    onClick={() => moveItem(index, index + 1)}>
                                &#8594;
                            </button>
                        )}
                        {isProPluginActive ? (
                            <Fragment>
                                <MediaUpload
                                    allowedTypes={['image']}
                                    onSelect={(media) => setCustomThumbnail(index, media)}
                                    render={({ open }) => (
                                        <button className="ep-pdf-gallery-editor__item-btn"
                                                title={__('Custom Thumbnail', 'embedpress')}
                                                onClick={open}>
                                            &#128247;
                                        </button>
                                    )}
                                />
                                {item.customThumbnailUrl && (
                                    <button className="ep-pdf-gallery-editor__item-btn"
                                            title={__('Remove Custom Thumbnail', 'embedpress')}
                                            onClick={() => removeCustomThumbnail(index)}>
                                        &#8634;
                                    </button>
                                )}
                            </Fragment>
                        ) : (
                            <button className="ep-pdf-gallery-editor__item-btn"
                                    title={__('Custom Thumbnail (Pro)', 'embedpress')}
                                    onClick={showProAlert}>
                                &#128247;
                            </button>
                        )}
                        <button className="ep-pdf-gallery-editor__item-btn"
                                title={__('Remove', 'embedpress')}
                                onClick={() => removeItem(index)}>
                            &times;
                        </button>
                    </div>
                )}
            </div>
        );
    }

    // Add PDF button
    var addButton = (
        <MediaUpload
            allowedTypes={ALLOWED_MEDIA_TYPES}
            multiple="add"
            onSelect={onSelectFiles}
            render={({ open }) => (
                <button className="ep-pdf-gallery-editor__add-btn" onClick={open}>
                    <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                    {__('Add PDF', 'embedpress')}
                </button>
            )}
        />
    );

    return (
        <div {...blockProps}>
            <Inspector attributes={attributes} setAttributes={setAttributes} />

            <BlockControls>
                <ToolbarGroup>
                    <MediaUpload
                        allowedTypes={ALLOWED_MEDIA_TYPES}
                        multiple="add"
                        onSelect={onSelectFiles}
                        render={({ open }) => (
                            <ToolbarButton
                                label={__('Add PDFs', 'embedpress')}
                                icon="plus"
                                onClick={open}
                            />
                        )}
                    />
                    <ToolbarButton
                        label={__('Replace All', 'embedpress')}
                        icon="update"
                        onClick={() => setAttributes({ pdfItems: [] })}
                    />
                </ToolbarGroup>
            </BlockControls>

            <div
                className="ep-pdf-gallery ep-pdf-gallery--editor"
                data-layout={layout}
                data-shelf-style={bookshelfStyle || 'dark-wood'}
                style={containerStyle}
            >
                <div className="ep-pdf-gallery__grid">
                    {pdfItems.map(function (item, index) {
                        return renderItem(item, index);
                    })}
                    {addButton}
                </div>
            </div>
        </div>
    );
}

export default Edit;
