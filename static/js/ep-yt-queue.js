/**
 * EmbedPress — YouTube Playlist (Queue + Theatre)
 *
 * Wires up the .ep-yt-playlist shells emitted by
 * EmbedPress\Providers\TemplateLayouts\YoutubeLayout (queue + theatre).
 * Per-layout selectors differ (queue uses .ep-yt-queue__*, theatre uses
 * .ep-yt-theatre__*) but the interaction model is the same:
 *   - click-to-swap: clicking an item/card swaps the iframe src to that vid,
 *     updates the active highlight and the "N / M" position counter
 *   - infinite scroll: when scrolled near the end of the list/strip,
 *     fetches the next page of items via WP REST and appends them
 *   - loop: when ended (postMessage from YT iframe), advance to next or
 *     restart from 1 if loop is on
 *   - shuffle: randomize playback order; toggling off restores natural order
 *   - theatre extras: prev/next arrow buttons scroll the card strip
 *
 * No framework dependency — vanilla DOM. Safe to enqueue multiple times;
 * the per-instance `init` guard prevents double-binding.
 */
(function () {
    'use strict';

    var ROOT_SELECTOR      = '.ep-yt-playlist';
    var INFINITE_SCROLL_PX = 120;
    var INIT_FLAG          = 'epYtPlaylistInit';

    // Per-layout selector tables — keep markup contracts in one place.
    // New Pro layouts plug in here without any other JS change.
    var SELECTORS = {
        queue: {
            iframe:     '.ep-yt-queue__iframe',
            list:       '.ep-yt-queue__items',
            item:       '.ep-yt-queue__item',
            activeItem: '.ep-yt-queue__item.is-active',
            loader:     '.ep-yt-queue__loader',
            loopBtn:    '.ep-yt-queue__loop',
            shuffleBtn: '.ep-yt-queue__shuffle',
            posCurrent: '.ep-yt-queue__position-current',
            scrollAxis: 'y'
        },
        theatre: {
            iframe:     '.ep-yt-theatre__iframe',
            list:       '.ep-yt-theatre__strip',
            item:       '.ep-yt-theatre__card',
            activeItem: '.ep-yt-theatre__card.is-active',
            loader:     '.ep-yt-theatre__loader',
            loopBtn:    '.ep-yt-theatre__loop',
            shuffleBtn: '.ep-yt-theatre__shuffle',
            posCurrent: '.ep-yt-theatre__position-current',
            navPrev:    '.ep-yt-theatre__nav--prev',
            navNext:    '.ep-yt-theatre__nav--next',
            scrollAxis: 'x'
        },
        // Library: no inline player. Clicking a card opens the modal.
        library: {
            iframe:     '.ep-yt-library__modal-iframe',
            list:       '.ep-yt-library__grid',
            item:       '.ep-yt-library__card',
            activeItem: '.ep-yt-library__card.is-active',
            loader:     '.ep-yt-library__loader',
            modal:      '.ep-yt-library__modal',
            modalClose: '.ep-yt-library__modal-close',
            posCurrent: '.ep-yt-library__position-current',
            scrollAxis: 'y'
        },
        spotlight: {
            iframe:     '.ep-yt-spotlight__iframe',
            list:       '.ep-yt-spotlight__rail',
            item:       '.ep-yt-spotlight__rail-card',
            activeItem: '.ep-yt-spotlight__rail-card.is-active',
            loader:     '.ep-yt-spotlight__loader',
            loopBtn:    '.ep-yt-spotlight__loop',
            shuffleBtn: '.ep-yt-spotlight__shuffle',
            posCurrent: '.ep-yt-spotlight__position-current',
            heroTitle:  '.ep-yt-spotlight__hero-title',
            heroDesc:   '.ep-yt-spotlight__hero-desc',
            scrollAxis: 'y'
        },
        cinema: {
            iframe:     '.ep-yt-cinema__iframe',
            list:       '.ep-yt-cinema__items',
            item:       '.ep-yt-cinema__item',
            activeItem: '.ep-yt-cinema__item.is-active',
            loader:     '.ep-yt-cinema__loader',
            loopBtn:    '.ep-yt-cinema__loop',
            shuffleBtn: '.ep-yt-cinema__shuffle',
            posCurrent: '.ep-yt-cinema__position-current',
            overlayOpen:  '.ep-yt-cinema__open-queue',
            overlayClose: '.ep-yt-cinema__close-queue',
            overlay:      '.ep-yt-cinema__overlay',
            scrollAxis: 'y'
        },
        magazine: {
            iframe:     '.ep-yt-magazine__iframe',
            list:       '.ep-yt-magazine__rail',
            item:       '.ep-yt-magazine__rail-item',
            activeItem: '.ep-yt-magazine__rail-item.is-active',
            loader:     '.ep-yt-magazine__loader',
            loopBtn:    '.ep-yt-magazine__loop',
            shuffleBtn: '.ep-yt-magazine__shuffle',
            posCurrent: '.ep-yt-magazine__position-current',
            heroTitle:  '.ep-yt-magazine__hero-title',
            heroDesc:   '.ep-yt-magazine__hero-desc',
            readMore:   '.ep-yt-magazine__readmore',
            scrollAxis: 'y'
        }
    };

    function ready(fn) {
        if (document.readyState !== 'loading') fn();
        else document.addEventListener('DOMContentLoaded', fn);
    }
    function $$(root, sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); }
    function $(root, sel) { return root.querySelector(sel); }

    function getLayout(root) {
        var l = root.getAttribute('data-layout') || 'queue';
        return SELECTORS[l] ? l : 'queue';
    }

    function swapVideoId(iframe, vid) {
        if (!iframe || !vid) return;
        try {
            var src = iframe.src;
            var next = src.replace(/(\/embed\/)([^?&"'>]+)(.*)?/, '$1' + vid + '$3');
            if (/[?&]autoplay=0/.test(next)) {
                next = next.replace(/([?&])autoplay=0/, '$1autoplay=1');
            } else if (next.indexOf('autoplay=') === -1) {
                next += (next.indexOf('?') === -1 ? '?' : '&') + 'autoplay=1';
            }
            iframe.src = next;
        } catch (err) { /* ignore */ }
    }

    function setActive(root, sel, item) {
        $$(root, sel.activeItem).forEach(function (el) { el.classList.remove('is-active'); });
        if (item) {
            item.classList.add('is-active');
            var list = $(root, sel.list);
            if (list && typeof item.scrollIntoView === 'function') {
                var listRect = list.getBoundingClientRect();
                var itemRect = item.getBoundingClientRect();
                var off = sel.scrollAxis === 'x'
                    ? (itemRect.left < listRect.left || itemRect.right > listRect.right)
                    : (itemRect.top < listRect.top || itemRect.bottom > listRect.bottom);
                if (off) {
                    item.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
                }
            }
        }
    }

    function updateCounter(root, sel) {
        var current = $(root, sel.posCurrent);
        var active  = $(root, sel.activeItem);
        if (current && active) {
            current.textContent = active.getAttribute('data-index') || '';
        }
    }

    function playByIndex(root, sel, index, state) {
        var items = $$(root, sel.item);
        if (!items.length) return;
        if (index >= items.length) {
            if (state.loop) index = 0;
            else return;
        }
        if (index < 0) index = 0;
        var item   = items[index];
        var iframe = $(root, sel.iframe);
        var vid    = item.getAttribute('data-vid');
        if (!vid || !iframe) return;
        swapVideoId(iframe, vid);
        setActive(root, sel, item);
        updateCounter(root, sel);
    }

    function visualIndex(root, sel, item) {
        var items = $$(root, sel.item);
        return items.indexOf(item);
    }

    function attachClickToSwap(root, sel, state) {
        var list = $(root, sel.list);
        if (!list) return;
        list.addEventListener('click', function (event) {
            var item = event.target.closest(sel.item);
            if (!item || !list.contains(item)) return;
            event.preventDefault();
            state.cursor = visualIndex(root, sel, item);
            playByIndex(root, sel, state.cursor, state);
            // Layouts that have a "hero" area (Spotlight, Magazine) promote
            // the clicked item's title + description into that area.
            if (sel.heroTitle || sel.heroDesc) {
                var titleEl = sel.heroTitle ? $(root, sel.heroTitle) : null;
                var descEl  = sel.heroDesc  ? $(root, sel.heroDesc)  : null;
                if (titleEl) {
                    var t = item.getAttribute('data-title') || '';
                    if (t) titleEl.textContent = t;
                }
                if (descEl) {
                    var d = item.getAttribute('data-description') || '';
                    if (d !== '') descEl.textContent = d;
                }
            }
            // Library: open the modal player on click.
            if (sel.modal && state.layout === 'library') {
                var modal = $(root, sel.modal);
                if (modal) modal.hidden = false;
            }
        });
    }

    // Cinema overlay queue + Library modal close wiring.
    function attachLayoutExtras(root, sel, state) {
        if (state.layout === 'cinema') {
            var openBtn  = $(root, sel.overlayOpen);
            var closeBtn = $(root, sel.overlayClose);
            var overlay  = $(root, sel.overlay);
            if (openBtn && overlay) openBtn.addEventListener('click', function () { overlay.classList.add('is-open'); });
            if (closeBtn && overlay) closeBtn.addEventListener('click', function () { overlay.classList.remove('is-open'); });
        }
        if (state.layout === 'library') {
            var modal = $(root, sel.modal);
            var close = $(root, sel.modalClose);
            if (close && modal) close.addEventListener('click', function () { modal.hidden = true; });
            if (modal) modal.addEventListener('click', function (event) {
                if (event.target === modal) modal.hidden = true; // backdrop click
            });
        }
        if (state.layout === 'magazine') {
            var more = $(root, sel.readMore);
            var desc = $(root, sel.heroDesc);
            if (more && desc) more.addEventListener('click', function () {
                desc.classList.toggle('is-expanded');
                more.textContent = desc.classList.contains('is-expanded')
                    ? (more.getAttribute('data-collapse-label') || 'Show less')
                    : (more.getAttribute('data-expand-label')   || 'Read more');
            });
        }
    }

    function attachLoopShuffle(root, sel, state) {
        var loopBtn    = $(root, sel.loopBtn);
        var shuffleBtn = $(root, sel.shuffleBtn);
        if (loopBtn) {
            loopBtn.addEventListener('click', function () {
                state.loop = !state.loop;
                loopBtn.setAttribute('aria-pressed', String(state.loop));
            });
        }
        if (shuffleBtn) {
            shuffleBtn.addEventListener('click', function () {
                state.shuffle = !state.shuffle;
                shuffleBtn.setAttribute('aria-pressed', String(state.shuffle));
                if (state.shuffle) shuffleOrder(root, sel, state);
                else restoreOrder(root, sel, state);
            });
        }
    }

    function shuffleOrder(root, sel, state) {
        var list = $(root, sel.list);
        if (!list) return;
        var items = $$(root, sel.item);
        if (!state.originalOrder) {
            state.originalOrder = items.map(function (i) { return i.getAttribute('data-vid'); });
        }
        var shuffled = items.slice();
        for (var i = shuffled.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = shuffled[i]; shuffled[i] = shuffled[j]; shuffled[j] = tmp;
        }
        shuffled.forEach(function (el) { list.appendChild(el); });
        var active = $(root, sel.activeItem);
        state.cursor = visualIndex(root, sel, active);
    }

    function restoreOrder(root, sel, state) {
        if (!state.originalOrder) return;
        var list = $(root, sel.list);
        if (!list) return;
        var byVid = {};
        $$(root, sel.item).forEach(function (el) {
            byVid[el.getAttribute('data-vid')] = el;
        });
        state.originalOrder.forEach(function (vid) {
            if (byVid[vid]) list.appendChild(byVid[vid]);
        });
        var active = $(root, sel.activeItem);
        state.cursor = visualIndex(root, sel, active);
    }

    function attachInfiniteScroll(root, sel, state) {
        var list = $(root, sel.list);
        if (!list) return;
        list.addEventListener('scroll', function () {
            if (state.loadingNext || !state.nextPageToken) return;
            var remaining = sel.scrollAxis === 'x'
                ? list.scrollWidth - list.scrollLeft - list.clientWidth
                : list.scrollHeight - list.scrollTop - list.clientHeight;
            if (remaining < INFINITE_SCROLL_PX) {
                fetchNextPage(root, sel, state);
            }
        });

        // Hard cap on initial-fill rounds — protects against pathological
        // cases where the container grows along with the strip and the
        // "is it scrollable yet?" predicate never flips to false.
        var fillRounds = 0;
        function fillUntilScrollable() {
            if (!state.nextPageToken || state.loadingNext) return;
            if (fillRounds >= 3) return;
            var room = sel.scrollAxis === 'x'
                ? list.scrollWidth <= list.clientWidth + 8
                : list.scrollHeight <= list.clientHeight + 8;
            if (room) {
                fillRounds++;
                fetchNextPage(root, sel, state).then(function () {
                    setTimeout(fillUntilScrollable, 50);
                });
            }
        }
        setTimeout(fillUntilScrollable, 50);
    }

    function attachTheatreNavButtons(root, sel) {
        var prev = $(root, sel.navPrev);
        var next = $(root, sel.navNext);
        var list = $(root, sel.list);
        if (!list) return;
        function pageBy(dir) {
            list.scrollBy({ left: dir * list.clientWidth * 0.8, behavior: 'smooth' });
        }
        if (prev) prev.addEventListener('click', function () { pageBy(-1); });
        if (next) next.addEventListener('click', function () { pageBy(1); });
    }

    function fetchNextPage(root, sel, state) {
        if (state.loadingNext || !state.nextPageToken) return Promise.resolve();
        state.loadingNext = true;
        var loader = $(root, sel.loader);
        if (loader) loader.hidden = false;

        var data = window.embedpressFrontendData || {};
        var restUrl = (data.rest_url || '/wp-json/') + 'embedpress/v1/youtube-playlist-items';

        var params = new URLSearchParams({
            playlist_id: state.playlistId,
            page_token:  state.nextPageToken,
            page_size:   String(state.pageSize),
            offset:      String($$(root, sel.item).length),
            layout:      state.layout
        });

        var headers = { 'Accept': 'application/json' };
        if (data.rest_nonce) headers['X-WP-Nonce'] = data.rest_nonce;

        return fetch(restUrl + '?' + params.toString(), { headers: headers, credentials: 'same-origin' })
            .then(function (r) { return r.ok ? r.json() : Promise.reject(r); })
            .then(function (payload) {
                if (payload && payload.html) {
                    var list = $(root, sel.list);
                    list.insertAdjacentHTML('beforeend', payload.html);
                }
                state.nextPageToken = payload && payload.next_page_token ? payload.next_page_token : '';
                root.setAttribute('data-next-page-token', state.nextPageToken);
                if (state.shuffle) {
                    shuffleOrder(root, sel, state);
                } else {
                    state.originalOrder = $$(root, sel.item).map(function (i) {
                        return i.getAttribute('data-vid');
                    });
                }
            })
            .catch(function () { state.nextPageToken = ''; })
            .finally(function () {
                state.loadingNext = false;
                if (loader) loader.hidden = true;
            });
    }

    function attachEndedListener(root, sel, state) {
        var iframe = $(root, sel.iframe);
        if (!iframe) return;
        try {
            iframe.contentWindow.postMessage(JSON.stringify({
                event: 'listening',
                id:    state.id
            }), '*');
        } catch (e) { /* non-fatal */ }
    }

    function handleEnded(state) {
        var root = state.root;
        var sel  = SELECTORS[state.layout];
        if (state.shuffle) {
            var items = $$(root, sel.item);
            if (items.length <= 1) return;
            var next = state.cursor;
            for (var attempt = 0; attempt < 5; attempt++) {
                next = Math.floor(Math.random() * items.length);
                if (next !== state.cursor) break;
            }
            state.cursor = next;
            playByIndex(root, sel, next, state);
        } else {
            state.cursor++;
            playByIndex(root, sel, state.cursor, state);
        }
    }

    function bindGlobalMessageRouter() {
        if (window[INIT_FLAG + 'MsgBound']) return;
        window[INIT_FLAG + 'MsgBound'] = true;
        window.addEventListener('message', function (event) {
            if (typeof event.data !== 'string') return;
            if (event.origin.indexOf('youtube.com') === -1 && event.origin.indexOf('youtube-nocookie.com') === -1) return;
            var data;
            try { data = JSON.parse(event.data); } catch (e) { return; }
            if (data && data.event === 'onStateChange' && data.info === 0) {
                $$(document, ROOT_SELECTOR).forEach(function (root) {
                    var sel = SELECTORS[getLayout(root)];
                    var iframe = $(root, sel.iframe);
                    if (iframe && iframe.contentWindow === event.source) {
                        var state = root[INIT_FLAG + 'State'];
                        if (state) handleEnded(state);
                    }
                });
            }
        });
    }

    function initOne(root) {
        if (root[INIT_FLAG]) return;
        root[INIT_FLAG] = true;

        var layout = getLayout(root);
        var sel    = SELECTORS[layout];
        var active = $(root, sel.activeItem) || $(root, sel.item);
        var state  = {
            root:           root,
            layout:         layout,
            id:             'epyp-' + Math.random().toString(36).slice(2, 9),
            playlistId:     root.getAttribute('data-playlist-id') || '',
            pageSize:       parseInt(root.getAttribute('data-pagesize'), 10) || 6,
            nextPageToken:  root.getAttribute('data-next-page-token') || '',
            cursor:         active ? visualIndex(root, sel, active) : 0,
            loop:           false,
            shuffle:        false,
            loadingNext:    false,
            originalOrder:  null
        };
        root[INIT_FLAG + 'State'] = state;

        attachClickToSwap(root, sel, state);
        attachLoopShuffle(root, sel, state);
        attachInfiniteScroll(root, sel, state);
        attachEndedListener(root, sel, state);
        if (layout === 'theatre') attachTheatreNavButtons(root, sel);
    }

    function init() {
        bindGlobalMessageRouter();
        $$(document, ROOT_SELECTOR).forEach(initOne);

        if (typeof window.MutationObserver === 'function') {
            var obs = new MutationObserver(function (mutations) {
                mutations.forEach(function (m) {
                    Array.prototype.forEach.call(m.addedNodes || [], function (node) {
                        if (node.nodeType !== 1) return;
                        if (node.matches && node.matches(ROOT_SELECTOR)) initOne(node);
                        if (node.querySelectorAll) {
                            Array.prototype.forEach.call(node.querySelectorAll(ROOT_SELECTOR), initOne);
                        }
                    });
                });
            });
            obs.observe(document.body, { childList: true, subtree: true });
        }
    }

    ready(init);
})();
