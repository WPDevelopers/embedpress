/**
 * EmbedPress PDF Gallery - Frontend Script
 *
 * Handles:
 * - PDF.js thumbnail generation (first page render)
 * - Carousel layout initialization
 * - Popup/lightbox with prev/next navigation
 */
(function () {
    'use strict';

    // =========================================
    // Module 1: PDF Thumbnail Generator
    // =========================================
    var ThumbnailGenerator = {
        pdfjsLoaded: false,
        pdfjsLoading: false,
        loadCallbacks: [],

        /**
         * Load PDF.js library dynamically
         */
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
                // Try to find from existing script tags
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
                // Module scripts set pdfjsLib on globalThis; wait a tick for execution
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

        /**
         * Render first page of a PDF to a canvas
         */
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
                // Show fallback placeholder
                canvas.removeAttribute('data-loading');
                canvas.style.display = 'none';
                var wrap = canvas.parentElement;
                if (wrap && !wrap.querySelector('.ep-pdf-gallery__placeholder')) {
                    var placeholder = document.createElement('div');
                    placeholder.className = 'ep-pdf-gallery__placeholder';
                    placeholder.innerHTML = '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v7h7v9H6z"/></svg>';
                    wrap.appendChild(placeholder);
                }
            });
        },

        /**
         * Initialize all thumbnails with IntersectionObserver
         */
        initAll: function () {
            var canvases = document.querySelectorAll('.ep-pdf-gallery__canvas[data-pdf-src]');
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
                                self.renderThumbnail(c, c.dataset.pdfSrc);
                            }
                        });
                    }, { rootMargin: '200px' });

                    canvases.forEach(function (c) { observer.observe(c); });
                } else {
                    canvases.forEach(function (c) {
                        self.renderThumbnail(c, c.dataset.pdfSrc);
                    });
                }
            });
        }
    };

    // =========================================
    // Module 2: Carousel
    // =========================================
    var Carousel = {
        init: function (gallery) {
            var carouselEl = gallery.querySelector('.ep-pdf-gallery__carousel');
            if (!carouselEl) return;

            var track = carouselEl.querySelector('.ep-pdf-gallery__carousel-track');
            var items = carouselEl.querySelectorAll('.ep-pdf-gallery__item');
            var prevBtn = carouselEl.querySelector('.ep-pdf-gallery__carousel-prev');
            var nextBtn = carouselEl.querySelector('.ep-pdf-gallery__carousel-next');
            var dotsContainer = carouselEl.querySelector('.ep-pdf-gallery__carousel-dots');

            if (!track || !items.length) return;

            var options;
            try {
                options = JSON.parse(gallery.dataset.carouselOptions || '{}');
            } catch (e) {
                options = {};
            }

            var slidesPerView = options.slidesPerView || 3;
            var gap = parseInt(gallery.dataset.gap) || 20;
            var loop = options.loop !== false;
            var autoplay = options.autoplay || false;
            var autoplaySpeed = options.autoplaySpeed || 3000;
            var showDots = options.dots || false;
            var currentIndex = 0;
            var totalSlides = items.length;
            var autoplayTimer = null;

            // Responsive slides per view
            function getSlidesPerView() {
                var w = window.innerWidth;
                if (w <= 767) return 1;
                if (w <= 1024) return Math.min(slidesPerView, 2);
                return slidesPerView;
            }

            function updateLayout() {
                var spv = getSlidesPerView();
                var containerWidth = carouselEl.offsetWidth;
                var slideWidth = (containerWidth - gap * (spv - 1)) / spv;

                items.forEach(function (item) {
                    item.style.width = slideWidth + 'px';
                    item.style.marginRight = gap + 'px';
                });

                // Last item no margin
                if (items.length) {
                    items[items.length - 1].style.marginRight = '0';
                }

                goTo(currentIndex, false);
            }

            function goTo(index, animate) {
                var spv = getSlidesPerView();
                var maxIndex = Math.max(0, totalSlides - spv);

                if (loop) {
                    if (index > maxIndex) index = 0;
                    if (index < 0) index = maxIndex;
                } else {
                    index = Math.max(0, Math.min(index, maxIndex));
                }

                currentIndex = index;

                var containerWidth = carouselEl.offsetWidth;
                var slideWidth = (containerWidth - gap * (spv - 1)) / spv;
                var offset = index * (slideWidth + gap);

                track.style.transition = animate !== false ? 'transform 0.4s ease' : 'none';
                track.style.transform = 'translateX(-' + offset + 'px)';

                updateDots();
                updateArrows();
            }

            function updateArrows() {
                if (!prevBtn || !nextBtn) return;
                if (loop) return;
                var spv = getSlidesPerView();
                var maxIndex = Math.max(0, totalSlides - spv);
                prevBtn.classList.toggle('ep-hidden', currentIndex <= 0);
                nextBtn.classList.toggle('ep-hidden', currentIndex >= maxIndex);
            }

            function updateDots() {
                if (!dotsContainer || !showDots) return;
                var spv = getSlidesPerView();
                var totalDots = Math.max(1, totalSlides - spv + 1);

                dotsContainer.innerHTML = '';
                for (var i = 0; i < totalDots; i++) {
                    var dot = document.createElement('button');
                    dot.className = 'ep-pdf-gallery__carousel-dot' + (i === currentIndex ? ' active' : '');
                    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
                    (function (idx) {
                        dot.addEventListener('click', function () { goTo(idx, true); });
                    })(i);
                    dotsContainer.appendChild(dot);
                }
            }

            function startAutoplay() {
                if (!autoplay) return;
                stopAutoplay();
                autoplayTimer = setInterval(function () {
                    goTo(currentIndex + 1, true);
                }, autoplaySpeed);
            }

            function stopAutoplay() {
                if (autoplayTimer) {
                    clearInterval(autoplayTimer);
                    autoplayTimer = null;
                }
            }

            // Event listeners
            if (prevBtn) {
                prevBtn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    goTo(currentIndex - 1, true);
                    stopAutoplay();
                    startAutoplay();
                });
            }
            if (nextBtn) {
                nextBtn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    goTo(currentIndex + 1, true);
                    stopAutoplay();
                    startAutoplay();
                });
            }

            // Touch/swipe support
            var touchStartX = 0;
            var touchDiff = 0;
            track.addEventListener('touchstart', function (e) {
                touchStartX = e.touches[0].clientX;
                stopAutoplay();
            }, { passive: true });
            track.addEventListener('touchmove', function (e) {
                touchDiff = e.touches[0].clientX - touchStartX;
            }, { passive: true });
            track.addEventListener('touchend', function () {
                if (Math.abs(touchDiff) > 50) {
                    if (touchDiff < 0) goTo(currentIndex + 1, true);
                    else goTo(currentIndex - 1, true);
                }
                touchDiff = 0;
                startAutoplay();
            });

            window.addEventListener('resize', function () { updateLayout(); });

            // Init
            updateLayout();
            if (showDots) updateDots();
            startAutoplay();
        }
    };

    // =========================================
    // Module 3: Popup Controller
    // =========================================
    var Popup = {
        popupEl: null,
        iframe: null,
        counterEl: null,
        prevBtn: null,
        nextBtn: null,
        currentGallery: null,
        currentIndex: 0,
        isOpen: false,

        init: function () {
            this.createPopupElement();
            this.bindEvents();
        },

        createPopupElement: function () {
            if (document.querySelector('.ep-pdf-gallery__popup')) return;

            var popup = document.createElement('div');
            popup.className = 'ep-pdf-gallery__popup';
            popup.innerHTML =
                '<div class="ep-pdf-gallery__popup-overlay">' +
                    '<button class="ep-pdf-gallery__popup-close" aria-label="Close">&times;</button>' +
                    '<button class="ep-pdf-gallery__popup-prev" aria-label="Previous PDF">' +
                        '<svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>' +
                    '</button>' +
                    '<button class="ep-pdf-gallery__popup-next" aria-label="Next PDF">' +
                        '<svg viewBox="0 0 24 24"><path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/></svg>' +
                    '</button>' +
                    '<div class="ep-pdf-gallery__popup-counter"></div>' +
                    '<div class="ep-pdf-gallery__popup-viewer">' +
                        '<iframe class="ep-pdf-gallery__popup-iframe" src="" allowfullscreen></iframe>' +
                    '</div>' +
                '</div>';

            document.body.appendChild(popup);

            this.popupEl = popup;
            this.iframe = popup.querySelector('.ep-pdf-gallery__popup-iframe');
            this.counterEl = popup.querySelector('.ep-pdf-gallery__popup-counter');
            this.prevBtn = popup.querySelector('.ep-pdf-gallery__popup-prev');
            this.nextBtn = popup.querySelector('.ep-pdf-gallery__popup-next');
        },

        bindEvents: function () {
            var self = this;

            // Delegate click on gallery items
            document.addEventListener('click', function (e) {
                var item = e.target.closest('.ep-pdf-gallery__item');
                if (!item) return;

                var gallery = item.closest('.ep-pdf-gallery');
                if (!gallery) return;

                e.preventDefault();
                self.currentGallery = gallery;
                self.currentIndex = parseInt(item.dataset.pdfIndex) || 0;
                self.open();
            });

            // Close button
            if (this.popupEl) {
                this.popupEl.querySelector('.ep-pdf-gallery__popup-close').addEventListener('click', function () {
                    self.close();
                });

                // Close on overlay click (not on viewer)
                this.popupEl.querySelector('.ep-pdf-gallery__popup-overlay').addEventListener('click', function (e) {
                    if (e.target === e.currentTarget) {
                        self.close();
                    }
                });

                // Prev/Next
                this.prevBtn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    self.prev();
                });
                this.nextBtn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    self.next();
                });
            }

            // Keyboard
            document.addEventListener('keydown', function (e) {
                if (!self.isOpen) return;
                if (e.key === 'Escape') self.close();
                if (e.key === 'ArrowLeft') self.prev();
                if (e.key === 'ArrowRight') self.next();
            });
        },

        open: function () {
            if (!this.currentGallery || !this.popupEl) return;

            var items = this.currentGallery.querySelectorAll('.ep-pdf-gallery__item');
            if (this.currentIndex >= items.length) return;

            var item = items[this.currentIndex];
            var pdfUrl = item.dataset.pdfUrl;
            if (!pdfUrl) return;

            var viewerSrc = this.buildViewerUrl(pdfUrl);
            this.iframe.src = viewerSrc;

            this.popupEl.classList.add('ep-pdf-gallery__popup--open');
            document.body.style.overflow = 'hidden';
            this.isOpen = true;

            this.updateCounter(items.length);
            this.updateNavButtons(items.length);
        },

        close: function () {
            if (!this.popupEl) return;
            this.popupEl.classList.remove('ep-pdf-gallery__popup--open');
            this.iframe.src = '';
            document.body.style.overflow = '';
            this.isOpen = false;
        },

        prev: function () {
            if (this.currentIndex > 0) {
                this.currentIndex--;
                this.iframe.src = '';
                this.open();
            }
        },

        next: function () {
            var items = this.currentGallery ? this.currentGallery.querySelectorAll('.ep-pdf-gallery__item') : [];
            if (this.currentIndex < items.length - 1) {
                this.currentIndex++;
                this.iframe.src = '';
                this.open();
            }
        },

        updateCounter: function (total) {
            if (this.counterEl) {
                this.counterEl.textContent = (this.currentIndex + 1) + ' / ' + total;
            }
        },

        updateNavButtons: function (total) {
            if (this.prevBtn) {
                this.prevBtn.classList.toggle('ep-hidden', this.currentIndex <= 0);
            }
            if (this.nextBtn) {
                this.nextBtn.classList.toggle('ep-hidden', this.currentIndex >= total - 1);
            }
        },

        buildViewerUrl: function (pdfUrl) {
            if (!this.currentGallery) return pdfUrl;

            var viewerStyle = this.currentGallery.dataset.viewerStyle || 'modern';
            var viewerParams = this.currentGallery.dataset.viewerParams || '';
            var encodedFile = encodeURIComponent(pdfUrl);

            // Get viewer base URLs from localized data
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

            // Fallback: just open the PDF directly
            return pdfUrl;
        }
    };

    // =========================================
    // Module 4: Initialization
    // =========================================
    function initGalleries() {
        var galleries = document.querySelectorAll('.ep-pdf-gallery');
        if (!galleries.length) return;

        // Init thumbnails
        ThumbnailGenerator.initAll();

        // Init layouts
        galleries.forEach(function (gallery) {
            var layout = gallery.dataset.layout;

            // Set CSS custom properties from data attributes
            var columns = gallery.dataset.columns || 3;
            var columnsTablet = gallery.dataset.columnsTablet || 2;
            var columnsMobile = gallery.dataset.columnsMobile || 1;
            var gap = gallery.dataset.gap || 20;
            var radius = gallery.dataset.borderRadius;

            gallery.style.setProperty('--ep-gallery-columns', columns);
            gallery.style.setProperty('--ep-gallery-columns-tablet', columnsTablet);
            gallery.style.setProperty('--ep-gallery-columns-mobile', columnsMobile);
            gallery.style.setProperty('--ep-gallery-gap', gap + 'px');
            if (radius !== undefined) {
                gallery.style.setProperty('--ep-gallery-radius', radius + 'px');
            }

            if (layout === 'carousel') {
                Carousel.init(gallery);
            }
        });

        // Init popup
        Popup.init();
    }

    // Run on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGalleries);
    } else {
        initGalleries();
    }

    // Elementor editor: re-initialize when widget is rendered/re-rendered
    if (typeof jQuery !== 'undefined') {
        jQuery(window).on('elementor/frontend/init', function () {
            if (typeof elementorFrontend !== 'undefined') {
                elementorFrontend.hooks.addAction(
                    'frontend/element_ready/embedpress_pdf_gallery.default',
                    function ($scope) {
                        var gallery = $scope.find('.ep-pdf-gallery')[0];
                        if (!gallery) return;

                        // Set CSS custom properties from data attributes
                        var columns = gallery.dataset.columns || 3;
                        var columnsTablet = gallery.dataset.columnsTablet || 2;
                        var columnsMobile = gallery.dataset.columnsMobile || 1;
                        var gap = gallery.dataset.gap || 20;
                        var radius = gallery.dataset.borderRadius;

                        gallery.style.setProperty('--ep-gallery-columns', columns);
                        gallery.style.setProperty('--ep-gallery-columns-tablet', columnsTablet);
                        gallery.style.setProperty('--ep-gallery-columns-mobile', columnsMobile);
                        gallery.style.setProperty('--ep-gallery-gap', gap + 'px');
                        if (radius !== undefined) {
                            gallery.style.setProperty('--ep-gallery-radius', radius + 'px');
                        }

                        // Re-init thumbnails within this widget
                        var canvases = gallery.querySelectorAll('.ep-pdf-gallery__canvas[data-pdf-src]');
                        if (canvases.length) {
                            ThumbnailGenerator.loadPdfJs(function () {
                                if (!window.pdfjsLib) return;
                                canvases.forEach(function (c) {
                                    ThumbnailGenerator.renderThumbnail(c, c.dataset.pdfSrc);
                                });
                            });
                        }

                        // Re-init carousel if needed
                        var layout = gallery.dataset.layout;
                        if (layout === 'carousel') {
                            Carousel.init(gallery);
                        }
                    }
                );
            }
        });
    }
})();
