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
        callback();
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

    if (!baseUrl) return;

    pdfjsLoadPromise = new Promise(function (resolve) {
        var script = document.createElement('script');
        script.src = baseUrl + 'pdf/build/script.js';
        script.onload = function () {
            if (window.pdfjsLib) {
                window.pdfjsLib.GlobalWorkerOptions.workerSrc =
                    baseUrl + 'pdf/build/pdf.worker.js';
            }
            resolve();
        };
        script.onerror = function () {
            resolve();
        };
        document.head.appendChild(script);
    });

    pdfjsLoadPromise.then(callback);
}

function renderPdfThumbnail(canvas, pdfUrl) {
    ensurePdfjsLoaded(function () {
        if (!window.pdfjsLib) return;

        var loadingTask = window.pdfjsLib.getDocument(pdfUrl);
        loadingTask.promise.then(function (pdf) {
            pdf.getPage(1).then(function (page) {
                var scale = 1.0;
                var viewport = page.getViewport({ scale: scale });
                var targetWidth = 300;
                scale = targetWidth / viewport.width;
                viewport = page.getViewport({ scale: scale });

                canvas.width = viewport.width;
                canvas.height = viewport.height;
                var ctx = canvas.getContext('2d');
                page.render({ canvasContext: ctx, viewport: viewport });
                canvas.dataset.rendered = pdfUrl;
            });
        }).catch(function () {
            // Failed to render, canvas stays empty
        });
    });
}

function Edit(props) {
    const { attributes, setAttributes, clientId, isSelected } = props;
    const { pdfItems, layout, columns, gap, thumbnailAspectRatio, thumbnailBorderRadius } = attributes;

    const blockProps = useBlockProps();
    const canvasRefs = useRef({});

    // Set clientId on mount
    useEffect(() => {
        if (!attributes.clientId) {
            setAttributes({ clientId });
        }
    }, []);

    // Render PDF thumbnails via PDF.js when items change
    useEffect(() => {
        if (!pdfItems || !pdfItems.length) return;

        pdfItems.forEach(function (item, index) {
            if (item.customThumbnailUrl) return;
            var canvas = canvasRefs.current[index];
            if (!canvas || canvas.dataset.rendered === item.url) return;

            renderPdfThumbnail(canvas, item.url);
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

    var gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(' + columns + ', 1fr)',
        gap: gap + 'px',
    };

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

            <div className="ep-pdf-gallery-editor">
                <div className="ep-pdf-gallery-editor__grid" style={gridStyle}>
                    {pdfItems.map(function (item, index) {
                        return (
                            <div className="ep-pdf-gallery-editor__item" key={item.url + '-' + index}
                                 style={{ borderRadius: thumbnailBorderRadius + 'px', aspectRatio: thumbnailAspectRatio.replace(':', '/') }}>

                                {item.customThumbnailUrl ? (
                                    <img src={item.customThumbnailUrl} alt={item.fileName} />
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
                                    style={{ borderRadius: thumbnailBorderRadius + 'px', aspectRatio: thumbnailAspectRatio.replace(':', '/') }}
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
