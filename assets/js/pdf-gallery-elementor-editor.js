/**
 * EmbedPress PDF Gallery - Elementor Editor Script
 * Repeater-style UI with PDF thumbnails, reorder, and custom thumbnail support
 * Auto-generates thumbnails via WP media sizes or server-side AJAX fallback
 * Uses $e.run API for proper persistence and widget re-render
 */
(function ($) {
    'use strict';

    if (typeof elementor === 'undefined') return;

    // Stored references for re-rendering on section switch
    var _panel = null;
    var _model = null;
    var _view = null;

    // Track which PDFs are currently generating thumbnails (by URL)
    var _generatingThumbs = {};

    // Pro feature check
    function isProActive() {
        return !!(window.epPdfGallery && epPdfGallery.isProActive);
    }

    function showProAlert() {
        if (isProActive()) return;
        var alertWrap = document.querySelector('.pro__alert__wrap');
        if (!alertWrap) {
            // Build pro alert modal
            var overlay = document.createElement('div');
            overlay.className = 'pro__alert__wrap';
            overlay.style.display = 'block';
            overlay.innerHTML =
                '<div class="pro__alert__card">' +
                    '<button class="pro__alert__close">&times;</button>' +
                    '<img src="" alt="">' +
                    '<h2>Starter Plan</h2>' +
                    '<p>You need to upgrade to the starter plan to use this feature.</p>' +
                    '<a href="https://wpdeveloper.com/in/upgrade-embedpress" target="_blank" class="pro__alert__btn">Upgrade to Starter</a>' +
                '</div>';
            document.body.appendChild(overlay);
            // Close handlers
            overlay.addEventListener('click', function (e) {
                if (e.target === overlay || e.target.classList.contains('pro__alert__close')) {
                    overlay.style.display = 'none';
                }
            });
        } else {
            alertWrap.style.display = 'block';
        }
    }

    function getPdfItems(model) {
        var raw = model.getSetting('pdf_items_json');
        if (!raw) return [];
        try {
            var items = JSON.parse(raw);
            return Array.isArray(items) ? items : [];
        } catch (e) {
            return [];
        }
    }

    function setPdfItems(view, items) {
        var container = view.getContainer();
        $e.run('document/elements/settings', {
            container: container,
            settings: {
                pdf_items_json: JSON.stringify(items)
            },
            options: {
                external: true
            }
        });

        // Re-populate list after Elementor re-renders panel controls
        setTimeout(function () {
            if (_panel && _model) {
                renderRepeater(items);
            }
        }, 300);
    }

    // ── PDF.js loader ──────────────────────────────────────────────────
    var _pdfjsLoaded = false;
    var _pdfjsLoading = false;
    var _pdfjsCallbacks = [];

    function loadPdfJs(callback) {
        if (_pdfjsLoaded && window.pdfjsLib) { callback(true); return; }
        _pdfjsCallbacks.push(callback);
        if (_pdfjsLoading) return;
        _pdfjsLoading = true;

        var assetsUrl = (window.epPdfGallery && epPdfGallery.assetsUrl) ? epPdfGallery.assetsUrl : '';
        if (!assetsUrl) {
            console.error('[EP PDF Gallery] No assetsUrl found in epPdfGallery');
            _pdfjsLoading = false;
            _pdfjsCallbacks.forEach(function (cb) { cb(false); });
            _pdfjsCallbacks = [];
            return;
        }

        var scriptSrc = assetsUrl + 'pdf/build/script.js';
        var script = document.createElement('script');
        script.src = scriptSrc;
        script.type = 'module';
        script.onload = function () {
            // Module scripts execute asynchronously; pdfjsLib is set on globalThis
            // Give module a tick to execute
            setTimeout(function () {
                if (window.pdfjsLib || globalThis.pdfjsLib) {
                    if (!window.pdfjsLib) window.pdfjsLib = globalThis.pdfjsLib;
                    window.pdfjsLib.GlobalWorkerOptions.workerSrc = assetsUrl + 'pdf/build/pdf.worker.js';
                    _pdfjsLoaded = true;
                } else {
                    console.error('[EP PDF Gallery] Script loaded but pdfjsLib not found');
                }
                _pdfjsLoading = false;
                _pdfjsCallbacks.forEach(function (cb) { cb(_pdfjsLoaded); });
                _pdfjsCallbacks = [];
            }, 50);
        };
        script.onerror = function () {
            console.error('[EP PDF Gallery] Failed to load PDF.js from:', scriptSrc);
            _pdfjsLoading = false;
            _pdfjsCallbacks.forEach(function (cb) { cb(false); });
            _pdfjsCallbacks = [];
        };
        document.head.appendChild(script);
    }

    // ── Render first page of PDF to an off-screen canvas, return data-URL ─
    function renderPdfFirstPage(pdfUrl, callback) {
        loadPdfJs(function (ok) {
            if (!ok || !window.pdfjsLib) {
                console.error('[EP PDF Gallery] PDF.js not available, cannot render:', pdfUrl);
                callback(null);
                return;
            }

            window.pdfjsLib.getDocument(pdfUrl).promise.then(function (pdf) {
                pdf.getPage(1).then(function (page) {
                    var targetWidth = Math.max(400 * (window.devicePixelRatio || 1), 600);
                    var scale = targetWidth / page.getViewport({ scale: 1 }).width;
                    scale = Math.max(scale, 1);
                    var viewport = page.getViewport({ scale: scale });

                    var canvas = document.createElement('canvas');
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                    var ctx = canvas.getContext('2d');

                    page.render({ canvasContext: ctx, viewport: viewport }).promise.then(function () {
                        try {
                            var dataUrl = canvas.toDataURL('image/png');
                            callback(dataUrl);
                        } catch (e) {
                            console.error('[EP PDF Gallery] toDataURL failed (CORS?):', e.message);
                            callback(null);
                        }
                    }).catch(function (err) {
                        console.error('[EP PDF Gallery] Page render failed:', err);
                        callback(null);
                    });
                }).catch(function (err) {
                    console.error('[EP PDF Gallery] getPage failed:', err);
                    callback(null);
                });
            }).catch(function (err) {
                console.error('[EP PDF Gallery] getDocument failed:', err);
                callback(null);
            });
        });
    }

    // ── Upload a base64 image to WordPress via AJAX ─────────────────────
    function uploadThumbnailImage(dataUrl, pdfUrl, fileName, callback, attachmentId) {
        if (!window.epPdfGallery || !epPdfGallery.ajaxUrl) {
            console.error('[EP PDF Gallery] No AJAX URL configured');
            callback('', 0);
            return;
        }

        // Use FormData to handle large base64 payloads reliably
        var formData = new FormData();
        formData.append('action', 'ep_upload_pdf_thumbnail');
        formData.append('nonce', epPdfGallery.nonce);
        formData.append('image_data', dataUrl);
        formData.append('pdf_url', pdfUrl);
        formData.append('file_name', fileName);
        if (attachmentId) {
            formData.append('attachment_id', attachmentId);
        }

        $.ajax({
            url: epPdfGallery.ajaxUrl,
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.success && response.data && response.data.url) {
                    callback(response.data.url, response.data.id);
                } else {
                    console.error('[EP PDF Gallery] Upload failed, response:', response);
                    callback('', 0);
                }
            },
            error: function (xhr, status, err) {
                console.error('[EP PDF Gallery] Upload AJAX error:', status, err);
                callback('', 0);
            }
        });
    }

    /**
     * Helper: apply a generated thumbnail to item data and refresh UI.
     */
    function applyThumbToItem(pdfUrl, thumbUrl, thumbId) {
        if (!_model || !_view) {
            console.error('[EP PDF Gallery] No model/view to apply thumbnail');
            return;
        }
        var currentItems = getPdfItems(_model);
        var applied = false;
        for (var i = 0; i < currentItems.length; i++) {
            if (currentItems[i].url === pdfUrl && !currentItems[i].autoThumbnailUrl) {
                currentItems[i].autoThumbnailId = thumbId || 0;
                currentItems[i].autoThumbnailUrl = thumbUrl;
                applied = true;
                break;
            }
        }
        if (applied) {
            setPdfItems(_view, currentItems);
            renderRepeater(currentItems);
        }
    }

    /**
     * Auto-generate thumbnails for items that don't have any.
     * Uses client-side PDF.js to render first page, then uploads as PNG.
     * Processes sequentially to avoid overloading.
     */
    function autoGenerateThumbnails(items) {
        var queue = [];

        items.forEach(function (item) {
            if (!item.autoThumbnailUrl && !item.customThumbnailUrl && item.url) {
                queue.push(item);
            }
        });

        if (!queue.length) {
            return;
        }

        function processNext(queueIndex) {
            if (queueIndex >= queue.length) {
                return;
            }

            var item = queue[queueIndex];
            var pdfUrl = item.url;

            // Skip if already generating
            if (_generatingThumbs[pdfUrl]) {
                processNext(queueIndex + 1);
                return;
            }

            _generatingThumbs[pdfUrl] = true;
            updateThumbLoading(pdfUrl, true);

            // First check if server already has a cached thumbnail
            if (item.id && window.epPdfGallery && epPdfGallery.ajaxUrl) {
                $.post(epPdfGallery.ajaxUrl, {
                    action: 'ep_generate_pdf_thumbnail',
                    nonce: epPdfGallery.nonce,
                    attachment_id: item.id
                }, function (response) {
                    if (response.success && response.data && response.data.url) {
                        delete _generatingThumbs[pdfUrl];
                        applyThumbToItem(pdfUrl, response.data.url, response.data.id);
                        processNext(queueIndex + 1);
                        return;
                    }
                    // No cached thumbnail, render client-side
                    doClientRender();
                }).fail(function () {
                    doClientRender();
                });
            } else {
                doClientRender();
            }

            function doClientRender() {
                // Render first page via PDF.js client-side
                renderPdfFirstPage(pdfUrl, function (dataUrl) {
                    if (!dataUrl) {
                        delete _generatingThumbs[pdfUrl];
                        updateThumbLoading(pdfUrl, false);
                        processNext(queueIndex + 1);
                        return;
                    }

                    // Upload the rendered PNG to WordPress
                    uploadThumbnailImage(dataUrl, pdfUrl, item.fileName || '', function (uploadedUrl, uploadedId) {
                        delete _generatingThumbs[pdfUrl];
                        if (uploadedUrl) {
                            applyThumbToItem(pdfUrl, uploadedUrl, uploadedId);
                        } else {
                            updateThumbLoading(pdfUrl, false);
                        }
                        processNext(queueIndex + 1);
                    }, item.id);
                });
            }
        }

        processNext(0);
    }

    /**
     * Update the loading state of a thumbnail by PDF URL
     */
    function updateThumbLoading(pdfUrl, isLoading) {
        if (!_panel) return;
        // Find the item by matching data-pdf-url
        _panel.$el.find('.ep-pdf-gallery-repeater-item').each(function () {
            var index = parseInt($(this).data('index'), 10);
            var items = getPdfItems(_model);
            if (items[index] && items[index].url === pdfUrl) {
                var $thumb = $(this).find('.ep-pdf-gallery-repeater-item__thumb');
                if (isLoading) {
                    $thumb.addClass('is-generating');
                    // Replace content with spinner if not already
                    if (!$thumb.find('.ep-pdf-gallery-repeater-item__spinner').length) {
                        $thumb.html('<div class="ep-pdf-gallery-repeater-item__spinner"></div>');
                    }
                } else {
                    $thumb.removeClass('is-generating');
                }
            }
        });
    }

    function buildRepeaterItem(item, index, totalCount) {
        var name = item.fileName || (item.url ? item.url.split('/').pop() : 'PDF');
        var hasCustomThumb = !!(item.customThumbnailUrl);
        var hasAutoThumb = !!(item.autoThumbnailUrl);
        var hasThumb = hasCustomThumb || hasAutoThumb;
        var thumbUrl = hasCustomThumb ? item.customThumbnailUrl : (hasAutoThumb ? item.autoThumbnailUrl : '');
        var isGenerating = !!(item.url && _generatingThumbs[item.url]);

        var thumbContent = '';
        if (hasThumb) {
            thumbContent =
                '<img src="' + thumbUrl + '" alt="' + name + '" />' +
                '<div class="ep-pdf-gallery-repeater-item__thumb-overlay">' +
                    '<i class="eicon-edit"></i>' +
                '</div>';
        } else if (isGenerating) {
            thumbContent =
                '<div class="ep-pdf-gallery-repeater-item__spinner"></div>';
        } else {
            thumbContent =
                '<div class="ep-pdf-gallery-repeater-item__thumb-placeholder">' +
                    '<svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/></svg>' +
                '</div>' +
                '<div class="ep-pdf-gallery-repeater-item__thumb-overlay">' +
                    '<i class="eicon-image"></i>' +
                '</div>';
        }

        var thumbActions = '';
        if (isProActive()) {
            if (hasCustomThumb) {
                thumbActions =
                    '<button class="ep-pdf-gallery-repeater-item__thumb-btn ep-pdf-gallery-thumb-change" data-index="' + index + '" type="button">Change</button>' +
                    '<button class="ep-pdf-gallery-repeater-item__thumb-btn ep-pdf-gallery-repeater-item__thumb-btn--remove ep-pdf-gallery-thumb-remove" data-index="' + index + '" type="button">Remove</button>';
            } else {
                thumbActions =
                    '<button class="ep-pdf-gallery-repeater-item__thumb-btn ep-pdf-gallery-thumb-set" data-index="' + index + '" type="button">' +
                        '<i class="eicon-image" style="margin-right:3px;font-size:10px;"></i>Custom Thumbnail' +
                    '</button>';
            }
        } else {
            thumbActions =
                '<button class="ep-pdf-gallery-repeater-item__thumb-btn ep-pdf-gallery-thumb-pro" data-index="' + index + '" type="button">' +
                    '<i class="eicon-image" style="margin-right:3px;font-size:10px;"></i>Custom Thumbnail <span style="color:#ff6b6b;font-size:10px;font-weight:600;margin-left:3px;">Pro</span>' +
                '</button>';
        }

        var statusLabel = '';
        if (isGenerating) {
            statusLabel = '<span class="ep-pdf-gallery-repeater-item__status">Generating...</span>';
        } else if (hasAutoThumb && !hasCustomThumb) {
            statusLabel = '<span class="ep-pdf-gallery-repeater-item__status">Auto-generated</span>';
        }

        var html =
            '<div class="ep-pdf-gallery-repeater-item" data-index="' + index + '">' +
                '<div class="ep-pdf-gallery-repeater-item__thumb ep-pdf-gallery-thumb-click" data-index="' + index + '">' +
                    thumbContent +
                '</div>' +
                '<div class="ep-pdf-gallery-repeater-item__content">' +
                    '<div class="ep-pdf-gallery-repeater-item__name" title="' + name + '">' + name + '</div>' +
                    '<div class="ep-pdf-gallery-repeater-item__thumb-label">Thumbnail ' + statusLabel + '</div>' +
                    '<div class="ep-pdf-gallery-repeater-item__thumb-actions">' +
                        thumbActions +
                    '</div>' +
                    '<div class="ep-pdf-gallery-repeater-item__order-actions">' +
                        '<button class="ep-pdf-gallery-repeater-item__order-btn ep-pdf-gallery-move-up" data-index="' + index + '" title="Move Up" type="button"' + (index === 0 ? ' disabled' : '') + '>' +
                            '<svg width="12" height="12" viewBox="0 0 24 24"><path fill="currentColor" d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>' +
                        '</button>' +
                        '<button class="ep-pdf-gallery-repeater-item__order-btn ep-pdf-gallery-move-down" data-index="' + index + '" title="Move Down" type="button"' + (index === totalCount - 1 ? ' disabled' : '') + '>' +
                            '<svg width="12" height="12" viewBox="0 0 24 24"><path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg>' +
                        '</button>' +
                    '</div>' +
                '</div>' +
                '<button class="ep-pdf-gallery-repeater-item__remove-btn ep-pdf-gallery-remove-item" data-index="' + index + '" title="Remove" type="button">&times;</button>' +
            '</div>';

        return html;
    }

    function renderRepeater(itemsOverride) {
        if (!_panel) return;
        var $repeater = _panel.$el.find('.ep-pdf-gallery-repeater');
        if (!$repeater.length) return;

        var items = itemsOverride || getPdfItems(_model);
        $repeater.empty();

        if (!items.length) {
            $repeater.append('<div class="ep-pdf-gallery-empty">No PDF files added yet. Click "Add PDF Files" to get started.</div>');
            return;
        }

        items.forEach(function (item, index) {
            $repeater.append(buildRepeaterItem(item, index, items.length));
        });
    }

    function openThumbnailPicker(index) {
        var frame = wp.media({
            title: 'Select Custom Thumbnail',
            library: { type: 'image' },
            multiple: false,
            button: { text: 'Set Thumbnail' }
        });

        frame.on('select', function () {
            var attachment = frame.state().get('selection').first().toJSON();
            var items = getPdfItems(_model);
            if (items[index]) {
                items[index].customThumbnailId = attachment.id;
                items[index].customThumbnailUrl = attachment.url;
                setPdfItems(_view, items);
                renderRepeater(items);
            }
        });

        frame.open();
    }

    function bindEvents() {
        if (!_panel) return;
        var $section = _panel.$el;

        // Add PDF Files button
        $section.off('click.epPdfSelect').on('click.epPdfSelect', '.ep-pdf-gallery-select-btn', function (e) {
            e.preventDefault();

            var frame = wp.media({
                title: 'Select PDF Files',
                library: { type: 'application/pdf' },
                multiple: 'add',
                button: { text: 'Add to Gallery' }
            });

            frame.on('select', function () {
                var selection = frame.state().get('selection').toJSON();
                var currentItems = getPdfItems(_model);
                var existingUrls = currentItems.map(function (item) { return item.url; });

                var hasNewWithoutThumb = false;

                selection.forEach(function (file) {
                    if (existingUrls.indexOf(file.url) === -1) {
                        // Check if WordPress already generated a preview thumbnail
                        var autoThumbUrl = '';
                        if (file.sizes) {
                            if (file.sizes.medium) {
                                autoThumbUrl = file.sizes.medium.url;
                            } else if (file.sizes.thumbnail) {
                                autoThumbUrl = file.sizes.thumbnail.url;
                            } else if (file.sizes.full) {
                                autoThumbUrl = file.sizes.full.url;
                            }
                        }

                        currentItems.push({
                            id: file.id,
                            url: file.url,
                            fileName: file.filename || file.title || '',
                            customThumbnailId: 0,
                            customThumbnailUrl: '',
                            autoThumbnailId: 0,
                            autoThumbnailUrl: autoThumbUrl
                        });

                        if (!autoThumbUrl) {
                            hasNewWithoutThumb = true;
                        }
                    }
                });

                setPdfItems(_view, currentItems);
                renderRepeater(currentItems);

                // Auto-generate thumbnails for items without one
                if (hasNewWithoutThumb) {
                    autoGenerateThumbnails(currentItems);
                }
            });

            frame.open();
        });

        // Remove item
        $section.off('click.epPdfRemove').on('click.epPdfRemove', '.ep-pdf-gallery-remove-item', function (e) {
            e.preventDefault();
            var index = parseInt($(this).data('index'), 10);
            var items = getPdfItems(_model);
            items.splice(index, 1);
            setPdfItems(_view, items);
            renderRepeater(items);
        });

        // Move up
        $section.off('click.epMoveUp').on('click.epMoveUp', '.ep-pdf-gallery-move-up', function (e) {
            e.preventDefault();
            var index = parseInt($(this).data('index'), 10);
            if (index <= 0) return;
            var items = getPdfItems(_model);
            var temp = items[index];
            items[index] = items[index - 1];
            items[index - 1] = temp;
            setPdfItems(_view, items);
            renderRepeater(items);
        });

        // Move down
        $section.off('click.epMoveDown').on('click.epMoveDown', '.ep-pdf-gallery-move-down', function (e) {
            e.preventDefault();
            var index = parseInt($(this).data('index'), 10);
            var items = getPdfItems(_model);
            if (index >= items.length - 1) return;
            var temp = items[index];
            items[index] = items[index + 1];
            items[index + 1] = temp;
            setPdfItems(_view, items);
            renderRepeater(items);
        });

        // Pro thumbnail button (show upgrade alert)
        $section.off('click.epThumbPro').on('click.epThumbPro', '.ep-pdf-gallery-thumb-pro', function (e) {
            e.preventDefault();
            e.stopPropagation();
            showProAlert();
        });

        // Set custom thumbnail (button click)
        $section.off('click.epThumbSet').on('click.epThumbSet', '.ep-pdf-gallery-thumb-set', function (e) {
            e.preventDefault();
            var index = parseInt($(this).data('index'), 10);
            openThumbnailPicker(index);
        });

        // Thumbnail area click (open picker)
        $section.off('click.epThumbClick').on('click.epThumbClick', '.ep-pdf-gallery-thumb-click', function (e) {
            e.preventDefault();
            if (!isProActive()) { showProAlert(); return; }
            var index = parseInt($(this).data('index'), 10);
            openThumbnailPicker(index);
        });

        // Change custom thumbnail
        $section.off('click.epThumbChange').on('click.epThumbChange', '.ep-pdf-gallery-thumb-change', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var index = parseInt($(this).data('index'), 10);
            openThumbnailPicker(index);
        });

        // Remove custom thumbnail
        $section.off('click.epThumbRemove').on('click.epThumbRemove', '.ep-pdf-gallery-thumb-remove', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var index = parseInt($(this).data('index'), 10);
            var items = getPdfItems(_model);
            if (items[index]) {
                items[index].customThumbnailId = 0;
                items[index].customThumbnailUrl = '';
                setPdfItems(_view, items);
                renderRepeater(items);
            }
        });

        // Clear all
        $section.off('click.epPdfClear').on('click.epPdfClear', '.ep-pdf-gallery-clear-btn', function (e) {
            e.preventDefault();
            setPdfItems(_view, []);
            renderRepeater([]);
        });
    }

    // Hook into widget panel open
    elementor.hooks.addAction('panel/open_editor/widget/embedpress_pdf_gallery', function (panel, model, view) {
        _panel = panel;
        _model = model;
        _view = view;

        setTimeout(function () {
            renderRepeater();
            bindEvents();

            // Auto-generate thumbnails for existing items that don't have one
            var items = getPdfItems(_model);
            if (items.length) {
                autoGenerateThumbnails(items);
            }
        }, 100);
    });

    // Re-render the repeater when the "PDF Files" section is activated
    elementor.channels.editor.on('section:activated', function (sectionName) {
        if (sectionName === 'section_pdf_files' && _panel && _model) {
            setTimeout(function () {
                renderRepeater();
                bindEvents();
            }, 100);
        }
    });

})(jQuery);
