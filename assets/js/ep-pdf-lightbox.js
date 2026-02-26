/**
 * EmbedPress PDF Lightbox — thumbnail preview + lightbox for single PDF block/widget/shortcode
 */
(function () {
    'use strict';

    // =========================================
    // Module 1: Thumbnail Generator
    // =========================================
    var ThumbnailGenerator = {
        pdfjsLoaded: false,
        pdfjsLoading: false,
        loadCallbacks: [],

        loadPdfJs: function (callback) {
            if (this.pdfjsLoaded && window.pdfjsLib) {
                callback();
                return;
            }

            this.loadCallbacks.push(callback);

            if (this.pdfjsLoading) return;
            this.pdfjsLoading = true;

            var self = this;
            var scriptUrl = (typeof embedpressObj !== 'undefined' && embedpressObj.pluginUrl)
                ? embedpressObj.pluginUrl + 'assets/pdf/build/script.js'
                : null;

            if (!scriptUrl) {
                var scripts = document.querySelectorAll('script[src*="embedpress"]');
                for (var i = 0; i < scripts.length; i++) {
                    var match = scripts[i].src.match(/(.*embedpress[^/]*\/(?:assets|static)\/)/);
                    if (match) {
                        scriptUrl = match[1] + 'pdf/build/script.js';
                        break;
                    }
                }
            }

            if (!scriptUrl) {
                self.pdfjsLoading = false;
                return;
            }

            var script = document.createElement('script');
            script.src = scriptUrl;
            script.type = 'module';
            script.onload = function () {
                setTimeout(function () {
                    if (window.pdfjsLib || globalThis.pdfjsLib) {
                        if (!window.pdfjsLib) window.pdfjsLib = globalThis.pdfjsLib;
                        var workerUrl = scriptUrl.replace('script.js', 'pdf.worker.js');
                        window.pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
                        self.pdfjsLoaded = true;
                    }
                    self.pdfjsLoading = false;
                    self.loadCallbacks.forEach(function (cb) { cb(); });
                    self.loadCallbacks = [];
                }, 50);
            };
            script.onerror = function () {
                self.pdfjsLoading = false;
                self.loadCallbacks = [];
            };
            document.head.appendChild(script);
        },

        renderThumbnail: function (canvas, pdfUrl) {
            if (!window.pdfjsLib) return;

            canvas.setAttribute('data-loading', 'true');

            var loadingTask = window.pdfjsLib.getDocument(pdfUrl);
            loadingTask.promise.then(function (pdf) {
                pdf.getPage(1).then(function (page) {
                    var containerWidth = canvas.parentElement ? canvas.parentElement.offsetWidth : 400;
                    var scale = containerWidth / page.getViewport({ scale: 1 }).width;
                    scale = Math.max(scale, 0.5);
                    var viewport = page.getViewport({ scale: scale });

                    canvas.width = viewport.width;
                    canvas.height = viewport.height;

                    var ctx = canvas.getContext('2d');
                    page.render({
                        canvasContext: ctx,
                        viewport: viewport
                    }).promise.then(function () {
                        canvas.removeAttribute('data-loading');
                    });
                });
            }).catch(function () {
                canvas.removeAttribute('data-loading');
                canvas.style.display = 'none';
                var wrap = canvas.parentElement;
                if (wrap && !wrap.querySelector('.ep-pdf-thumbnail-placeholder')) {
                    var placeholder = document.createElement('div');
                    placeholder.className = 'ep-pdf-thumbnail-placeholder';
                    placeholder.innerHTML = '<svg viewBox="0 0 24 24" width="48" height="48" fill="#999"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v7h7v9H6z"/></svg>';
                    wrap.appendChild(placeholder);
                }
            });
        },

        initAll: function () {
            var canvases = document.querySelectorAll('.ep-pdf-thumbnail-canvas[data-pdf-url]');
            if (!canvases.length) return;

            var self = this;
            this.loadPdfJs(function () {
                if (!window.pdfjsLib) return;

                if ('IntersectionObserver' in window) {
                    var observer = new IntersectionObserver(function (entries) {
                        entries.forEach(function (entry) {
                            if (entry.isIntersecting) {
                                var c = entry.target;
                                observer.unobserve(c);
                                self.renderThumbnail(c, c.dataset.pdfUrl);
                            }
                        });
                    }, { rootMargin: '200px' });

                    canvases.forEach(function (c) { observer.observe(c); });
                } else {
                    canvases.forEach(function (c) {
                        self.renderThumbnail(c, c.dataset.pdfUrl);
                    });
                }
            });
        }
    };

    // =========================================
    // Module 2: Lightbox
    // =========================================
    var Lightbox = {
        lightboxEl: null,
        iframe: null,
        isOpen: false,

        init: function () {
            this.createLightboxElement();
            this.bindEvents();
        },

        createLightboxElement: function () {
            if (document.querySelector('.ep-pdf-lightbox')) return;

            var lightbox = document.createElement('div');
            lightbox.className = 'ep-pdf-lightbox';
            lightbox.innerHTML =
                '<div class="ep-pdf-lightbox__overlay">' +
                    '<button class="ep-pdf-lightbox__close" aria-label="Close">&times;</button>' +
                    '<div class="ep-pdf-lightbox__viewer">' +
                        '<iframe class="ep-pdf-lightbox__iframe" src="" allowfullscreen></iframe>' +
                    '</div>' +
                '</div>';

            document.body.appendChild(lightbox);

            this.lightboxEl = lightbox;
            this.iframe = lightbox.querySelector('.ep-pdf-lightbox__iframe');
        },

        bindEvents: function () {
            var self = this;

            // Delegate click on thumbnail wraps
            document.addEventListener('click', function (e) {
                var wrap = e.target.closest('.ep-pdf-thumbnail-wrap');
                if (!wrap) return;

                e.preventDefault();
                self.openFromElement(wrap);
            });

            // Close button
            if (this.lightboxEl) {
                this.lightboxEl.querySelector('.ep-pdf-lightbox__close').addEventListener('click', function () {
                    self.close();
                });

                // Close on overlay click (not on viewer)
                this.lightboxEl.querySelector('.ep-pdf-lightbox__overlay').addEventListener('click', function (e) {
                    if (e.target === e.currentTarget) {
                        self.close();
                    }
                });
            }

            // Keyboard escape
            document.addEventListener('keydown', function (e) {
                if (!self.isOpen) return;
                if (e.key === 'Escape') self.close();
            });
        },

        openFromElement: function (wrapEl) {
            var pdfUrl = wrapEl.dataset.pdfUrl;
            var viewerStyle = wrapEl.dataset.viewerStyle || 'modern';
            var viewerParams = wrapEl.dataset.viewerParams || '';

            if (!pdfUrl) return;

            var viewerSrc = this.buildViewerUrl(pdfUrl, viewerStyle, viewerParams);
            this.iframe.src = viewerSrc;

            this.lightboxEl.classList.add('ep-pdf-lightbox--open');
            document.body.style.overflow = 'hidden';
            this.isOpen = true;
        },

        close: function () {
            if (!this.lightboxEl) return;
            this.lightboxEl.classList.remove('ep-pdf-lightbox--open');
            this.iframe.src = '';
            document.body.style.overflow = '';
            this.isOpen = false;
        },

        buildViewerUrl: function (pdfUrl, viewerStyle, viewerParams) {
            var encodedFile = encodeURIComponent(pdfUrl);
            var pdfRenderer = '';
            var flipbookRenderer = '';

            if (typeof embedpressObj !== 'undefined') {
                pdfRenderer = embedpressObj.pdfRenderer || '';
                flipbookRenderer = embedpressObj.flipbookRenderer || '';
            }

            if (viewerStyle === 'flip-book' && flipbookRenderer) {
                return flipbookRenderer + '&file=' + encodedFile + '&key=' + viewerParams;
            } else if (pdfRenderer) {
                return pdfRenderer + '&file=' + encodedFile + '#key=' + viewerParams;
            }

            return pdfUrl;
        }
    };

    // =========================================
    // Module 3: Initialization
    // =========================================
    function init() {
        var thumbnails = document.querySelectorAll('.ep-pdf-thumbnail-wrap');
        if (!thumbnails.length) return;

        ThumbnailGenerator.initAll();
        Lightbox.init();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Elementor re-init support
    if (typeof jQuery !== 'undefined') {
        jQuery(window).on('elementor/frontend/init', function () {
            if (typeof elementorFrontend !== 'undefined') {
                elementorFrontend.hooks.addAction(
                    'frontend/element_ready/embedpress_pdf.default',
                    function ($scope) {
                        var canvases = $scope.find('.ep-pdf-thumbnail-canvas[data-pdf-url]');
                        if (canvases.length) {
                            ThumbnailGenerator.loadPdfJs(function () {
                                if (!window.pdfjsLib) return;
                                canvases.each(function () {
                                    ThumbnailGenerator.renderThumbnail(this, this.dataset.pdfUrl);
                                });
                            });
                        }
                        if (!Lightbox.lightboxEl) {
                            Lightbox.init();
                        }
                    }
                );
            }
        });
    }
})();
