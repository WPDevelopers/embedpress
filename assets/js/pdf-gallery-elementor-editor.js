/**
 * EmbedPress PDF Gallery - Elementor Editor Script
 * Repeater-style UI with PDF thumbnails, reorder, and custom thumbnail support
 * Uses $e.run API for proper persistence and widget re-render
 */
(function ($) {
    'use strict';

    if (typeof elementor === 'undefined') return;

    // Stored references for re-rendering on section switch
    var _panel = null;
    var _model = null;
    var _view = null;

    // PDF.js loader
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
        if (typeof embedpressObj !== 'undefined' && embedpressObj.assets_url) {
            baseUrl = embedpressObj.assets_url;
        } else if (typeof embedpressGutenbergData !== 'undefined') {
            if (embedpressGutenbergData.assetsUrl) {
                baseUrl = embedpressGutenbergData.assetsUrl;
            } else if (embedpressGutenbergData.staticUrl) {
                baseUrl = embedpressGutenbergData.staticUrl.replace(/static\/?$/, 'assets/');
            }
        }

        if (!baseUrl) {
            // Try to derive from known script path
            var scripts = document.querySelectorAll('script[src*="embedpress"]');
            for (var i = 0; i < scripts.length; i++) {
                var match = scripts[i].src.match(/(.*\/embedpress\/assets\/)/);
                if (match) {
                    baseUrl = match[1];
                    break;
                }
            }
        }

        if (!baseUrl) {
            callback();
            return;
        }

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

    function renderPdfToCanvas(canvas, pdfUrl) {
        ensurePdfjsLoaded(function () {
            if (!window.pdfjsLib) return;

            var loadingTask = window.pdfjsLib.getDocument(pdfUrl);
            loadingTask.promise.then(function (pdf) {
                pdf.getPage(1).then(function (page) {
                    var scale = 1.0;
                    var viewport = page.getViewport({ scale: scale });
                    var targetWidth = 120;
                    scale = targetWidth / viewport.width;
                    viewport = page.getViewport({ scale: scale });

                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                    var ctx = canvas.getContext('2d');
                    page.render({ canvasContext: ctx, viewport: viewport });
                    canvas.dataset.rendered = pdfUrl;
                });
            }).catch(function () {
                // PDF load failed - show fallback
            });
        });
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

    function buildRepeaterItem(item, index, totalCount) {
        var name = item.fileName || (item.url ? item.url.split('/').pop() : 'PDF');
        var hasCustomThumb = !!(item.customThumbnailUrl);

        var thumbContent = '';
        if (hasCustomThumb) {
            thumbContent =
                '<img src="' + item.customThumbnailUrl + '" alt="' + name + '" />' +
                '<div class="ep-pdf-gallery-repeater-item__thumb-overlay">' +
                    '<i class="eicon-edit"></i>' +
                '</div>';
        } else {
            thumbContent =
                '<canvas class="ep-pdf-gallery-repeater-item__canvas" data-pdf-url="' + item.url + '"></canvas>' +
                '<div class="ep-pdf-gallery-repeater-item__thumb-overlay">' +
                    '<i class="eicon-image"></i>' +
                '</div>';
        }

        var thumbActions = '';
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

        var html =
            '<div class="ep-pdf-gallery-repeater-item" data-index="' + index + '">' +
                '<div class="ep-pdf-gallery-repeater-item__thumb ep-pdf-gallery-thumb-click" data-index="' + index + '">' +
                    thumbContent +
                '</div>' +
                '<div class="ep-pdf-gallery-repeater-item__content">' +
                    '<div class="ep-pdf-gallery-repeater-item__name" title="' + name + '">' + name + '</div>' +
                    '<div class="ep-pdf-gallery-repeater-item__thumb-label">Thumbnail</div>' +
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

        // Render PDF thumbnails to canvases
        $repeater.find('.ep-pdf-gallery-repeater-item__canvas').each(function () {
            var canvas = this;
            var pdfUrl = $(canvas).data('pdf-url');
            if (pdfUrl && canvas.dataset.rendered !== pdfUrl) {
                renderPdfToCanvas(canvas, pdfUrl);
            }
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

                selection.forEach(function (file) {
                    if (existingUrls.indexOf(file.url) === -1) {
                        currentItems.push({
                            id: file.id,
                            url: file.url,
                            fileName: file.filename || file.title || '',
                            customThumbnailId: 0,
                            customThumbnailUrl: ''
                        });
                    }
                });

                setPdfItems(_view, currentItems);
                renderRepeater(currentItems);
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

        // Set custom thumbnail (button click)
        $section.off('click.epThumbSet').on('click.epThumbSet', '.ep-pdf-gallery-thumb-set', function (e) {
            e.preventDefault();
            var index = parseInt($(this).data('index'), 10);
            openThumbnailPicker(index);
        });

        // Thumbnail area click (open picker)
        $section.off('click.epThumbClick').on('click.epThumbClick', '.ep-pdf-gallery-thumb-click', function (e) {
            e.preventDefault();
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
