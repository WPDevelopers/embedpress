/**
 * EmbedPress PDF Gallery - Elementor Editor Script
 * Handles multi-select PDF media library integration
 * Uses $e.run API for proper persistence and widget re-render
 */
(function ($) {
    'use strict';

    if (typeof elementor === 'undefined') return;

    // Stored references for re-rendering on section switch
    var _panel = null;
    var _model = null;
    var _view = null;

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

        // $e.run may cause panel controls to re-render, so re-populate list after a delay
        setTimeout(function () {
            if (_panel && _model) {
                ensureListRendered(items);
            }
        }, 300);
    }

    function renderPdfList($list, items) {
        $list.empty();

        if (!items.length) {
            $list.append('<div class="ep-pdf-gallery-empty">No PDF files selected.</div>');
            return;
        }

        items.forEach(function (item, index) {
            var name = item.fileName || (item.url ? item.url.split('/').pop() : 'PDF');
            var $item = $(
                '<div class="ep-pdf-gallery-list-item" data-index="' + index + '">' +
                    '<span class="ep-pdf-gallery-list-item__icon">' +
                        '<svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/></svg>' +
                    '</span>' +
                    '<span class="ep-pdf-gallery-list-item__name" title="' + name + '">' + name + '</span>' +
                    '<button class="ep-pdf-gallery-list-item__remove" data-index="' + index + '" title="Remove">&times;</button>' +
                '</div>'
            );
            $list.append($item);
        });
    }

    /**
     * Find the list container in the panel and render items into it.
     * Optionally accepts items to avoid re-reading from model.
     */
    function ensureListRendered(itemsOverride) {
        if (!_panel) return;
        var $list = _panel.$el.find('.ep-pdf-gallery-list');
        if (!$list.length) return;

        var items = itemsOverride || getPdfItems(_model);

        // Only re-render if list is empty or stale
        var currentCount = $list.find('.ep-pdf-gallery-list-item').length;
        if (currentCount !== items.length || items.length === 0) {
            renderPdfList($list, items);
        }
    }

    function bindEvents() {
        if (!_panel) return;
        var $section = _panel.$el;

        // Select PDFs button
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
                            customThumbnailUrl: ''
                        });
                    }
                });

                setPdfItems(_view, currentItems);
                var $list = _panel.$el.find('.ep-pdf-gallery-list');
                if ($list.length) renderPdfList($list, currentItems);
            });

            frame.open();
        });

        // Remove item
        $section.off('click.epPdfRemove').on('click.epPdfRemove', '.ep-pdf-gallery-list-item__remove', function (e) {
            e.preventDefault();
            var index = parseInt($(this).data('index'), 10);
            var items = getPdfItems(_model);
            items.splice(index, 1);
            setPdfItems(_view, items);
            var $list = _panel.$el.find('.ep-pdf-gallery-list');
            if ($list.length) renderPdfList($list, items);
        });

        // Clear all
        $section.off('click.epPdfClear').on('click.epPdfClear', '.ep-pdf-gallery-clear-btn', function (e) {
            e.preventDefault();
            setPdfItems(_view, []);
            var $list = _panel.$el.find('.ep-pdf-gallery-list');
            if ($list.length) renderPdfList($list, []);
        });
    }

    // Hook into widget panel open
    elementor.hooks.addAction('panel/open_editor/widget/embedpress_pdf_gallery', function (panel, model, view) {
        _panel = panel;
        _model = model;
        _view = view;

        setTimeout(function () {
            ensureListRendered();
            bindEvents();
        }, 100);
    });

    // Re-render the PDF list when the "PDF Files" section is activated
    // This handles the case where switching sections clears our dynamic DOM
    elementor.channels.editor.on('section:activated', function (sectionName) {
        if (sectionName === 'section_pdf_files' && _panel && _model) {
            setTimeout(function () {
                ensureListRendered();
                bindEvents();
            }, 100);
        }
    });

})(jQuery);
