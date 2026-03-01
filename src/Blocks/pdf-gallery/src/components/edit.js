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
    console.log('[EP PDF Gallery] Loading PDF.js from:', scriptSrc);

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
                    console.log('[EP PDF Gallery] PDF.js loaded successfully');
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

        console.log('[EP PDF Gallery] Rendering first page:', pdfUrl);
        var loadingTask = window.pdfjsLib.getDocument(pdfUrl);
        loadingTask.promise.then(function (pdf) {
            pdf.getPage(1).then(function (page) {
                var scale = 1.0;
                var viewport = page.getViewport({ scale: scale });
                var targetWidth = 400;
                scale = targetWidth / viewport.width;
                viewport = page.getViewport({ scale: scale });

                canvas.width = viewport.width;
                canvas.height = viewport.height;
                var ctx = canvas.getContext('2d');
                page.render({ canvasContext: ctx, viewport: viewport }).promise.then(function () {
                    canvas.dataset.rendered = pdfUrl;
                    console.log('[EP PDF Gallery] Page rendered to canvas');
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
function uploadPdfThumbnail(canvas, pdfUrl, fileName) {
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

    console.log('[EP PDF Gallery] Uploading thumbnail, size:', Math.round(dataUrl.length / 1024), 'KB');

    var formData = new FormData();
    formData.append('action', 'ep_upload_pdf_thumbnail');
    formData.append('nonce', gutenbergData.pdfGalleryNonce);
    formData.append('image_data', dataUrl);
    formData.append('pdf_url', pdfUrl);
    formData.append('file_name', fileName || '');

    return fetch(gutenbergData.ajaxUrl, { method: 'POST', body: formData })
        .then(function (r) { return r.json(); })
        .then(function (data) {
            if (data.success && data.data && data.data.url) {
                console.log('[EP PDF Gallery] Upload success:', data.data.url);
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

function Edit(props) {
    const { attributes, setAttributes, clientId, isSelected } = props;
    const { pdfItems, layout, columns, gap, thumbnailAspectRatio, thumbnailBorderRadius } = attributes;

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
    useEffect(() => {
        if (!pdfItems || !pdfItems.length) return;

        var needsThumb = pdfItems.filter(function (item) {
            return !item.customThumbnailUrl && !item.autoThumbnailUrl;
        });

        if (needsThumb.length) {
            console.log('[EP PDF Gallery] Items needing thumbnails:', needsThumb.length);
        }

        pdfItems.forEach(function (item, index) {
            if (item.customThumbnailUrl || item.autoThumbnailUrl) return;
            var canvas = canvasRefs.current[index];
            if (!canvas || canvas.dataset.rendered === item.url) return;

            renderPdfThumbnail(canvas, item.url, function (renderedCanvas) {
                // Upload the rendered canvas as a real PNG image
                var result = uploadPdfThumbnail(renderedCanvas, item.url, item.fileName);
                if (result) {
                    result.then(function (thumbData) {
                        if (!thumbData) return;
                        // Use ref to get latest items to avoid stale closure
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
                    });
                }
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
                    multiple={true}
                    onSelect={onSelectFiles}
                />
            </div>
        );
    }

    var isMasonry = layout === 'masonry';
    var isCarousel = layout === 'carousel';
    var isBookshelf = layout === 'bookshelf';
    var gridStyle;
    if (isMasonry) {
        gridStyle = {
            display: 'block',
            columnCount: columns,
            columnGap: gap + 'px',
        };
    } else if (isCarousel) {
        gridStyle = {
            display: 'flex',
            gap: gap + 'px',
            overflowX: 'auto',
        };
    } else if (isBookshelf) {
        // Editor uses grid preview — frontend uses carousel JS
        gridStyle = {};
    } else {
        gridStyle = {
            display: 'grid',
            gridTemplateColumns: 'repeat(' + columns + ', 1fr)',
            gap: gap + 'px',
        };
    }

    var itemStyle = {
        borderRadius: thumbnailBorderRadius + 'px',
    };
    if (isMasonry) {
        itemStyle.breakInside = 'avoid';
        itemStyle.marginBottom = gap + 'px';
    } else if (isCarousel) {
        itemStyle.flex = '0 0 calc(' + (100 / columns) + '% - ' + gap + 'px)';
        itemStyle.aspectRatio = thumbnailAspectRatio.replace(':', '/');
    } else if (isBookshelf) {
        // CSS handles bookshelf item styling via data-layout attribute
    } else {
        itemStyle.aspectRatio = thumbnailAspectRatio.replace(':', '/');
    }

    return (
        <div {...blockProps}>
            <Inspector attributes={attributes} setAttributes={setAttributes} />

            <BlockControls>
                <ToolbarGroup>
                    <MediaUpload
                        allowedTypes={ALLOWED_MEDIA_TYPES}
                        multiple={true}
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

            <div className="ep-pdf-gallery-editor" data-layout={layout}>
                <div className="ep-pdf-gallery-editor__grid" style={gridStyle}>
                    {pdfItems.map(function (item, index) {
                        return (
                            <div className="ep-pdf-gallery-editor__item" key={item.url + '-' + index}
                                 style={itemStyle}>

                                {(item.customThumbnailUrl || item.autoThumbnailUrl) ? (
                                    <img src={item.customThumbnailUrl || item.autoThumbnailUrl} alt={item.fileName} />
                                ) : (
                                    <canvas
                                        ref={function (el) { canvasRefs.current[index] = el; }}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                )}

                                <div className="ep-pdf-gallery-editor__item-name">
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
                                        <button className="ep-pdf-gallery-editor__item-btn"
                                                title={__('Remove', 'embedpress')}
                                                onClick={() => removeItem(index)}>
                                            &times;
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* Add more button */}
                    <MediaUpload
                        allowedTypes={ALLOWED_MEDIA_TYPES}
                        multiple={true}
                        onSelect={onSelectFiles}
                        render={({ open }) => (
                            <button className="ep-pdf-gallery-editor__add-btn"
                                    style={itemStyle}
                                    onClick={open}>
                                <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                                {__('Add PDF', 'embedpress')}
                            </button>
                        )}
                    />
                </div>
            </div>
        </div>
    );
}

export default Edit;
