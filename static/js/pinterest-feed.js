/**
 * EmbedPress Pinterest Feed — frontend renderer.
 *
 * For every <div class="ep-pinterest-feed"> on the page:
 *   1. Read the data-feed JSON (server-emitted config).
 *   2. Fetch /embedpress/v1/pinterest-feed?url=...&limit=...
 *   3. Paint the profile header (avatar, name, follower stats, Follow CTA)
 *      when the API returns profile metadata (connected account only).
 *   4. Paint the boards filter strip (when the API returns the boards list).
 *   5. Paint masonry/grid items with title, description, board name, hover
 *      overlay (Save + share), and lazy-loaded thumbnails.
 *   6. Click → in-page lightbox (image + title + description + open-pin link).
 *
 * Dispatches an `ep-pinterest-feed:rendered` event after each hydration so
 * Pro can extend (load-more, infinite scroll, content protection, etc.)
 * without touching this file.
 */
(function () {
    'use strict';

    var REST_ROOT, REST_NONCE = '';
    try {
        if (window.embedpressFrontendData && window.embedpressFrontendData.restUrl) {
            REST_ROOT  = window.embedpressFrontendData.restUrl;
            REST_NONCE = window.embedpressFrontendData.restNonce || '';
        } else if (window.wpApiSettings && window.wpApiSettings.root) {
            REST_ROOT  = window.wpApiSettings.root;
            REST_NONCE = window.wpApiSettings.nonce || '';
        } else {
            REST_ROOT  = '/wp-json/';
        }
    } catch (e) {
        REST_ROOT = '/wp-json/';
    }

    function ready(fn) {
        if (document.readyState !== 'loading') fn();
        else document.addEventListener('DOMContentLoaded', fn);
    }

    function parseConfig(el) {
        try { return JSON.parse(el.getAttribute('data-feed') || '{}'); }
        catch (e) { return {}; }
    }

    function buildPinterestUrl(cfg, boardOverride) {
        var u = 'https://www.pinterest.com/' + (cfg.username || '') + '/';
        if (boardOverride !== undefined) {
            if (boardOverride) u += boardOverride + '/';
        } else if (cfg.board) {
            u += cfg.board + '/';
        }
        return u;
    }

    function fetchFeed(cfg, boardOverride) {
        var base = REST_ROOT.replace(/\/+$/, '') + '/embedpress/v1/pinterest-feed';
        var url = base
            + '?url='   + encodeURIComponent(buildPinterestUrl(cfg, boardOverride))
            + '&limit=' + (parseInt(cfg.postsPerPage, 10) || 12);
        var headers = { 'Accept': 'application/json' };
        if (REST_NONCE) headers['X-WP-Nonce'] = REST_NONCE;
        return fetch(url, { headers: headers, credentials: 'same-origin' })
            .then(function (r) {
                if (!r.ok) throw new Error('HTTP ' + r.status);
                return r.json();
            });
    }

    function formatCount(n) {
        if (n === null || n === undefined) return '';
        n = Number(n);
        if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        if (n >= 1000)    return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
        return String(n);
    }

    function escapeHtml(s) {
        return String(s || '').replace(/[&<>"']/g, function (c) {
            return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
        });
    }

    // ─── Header rendering ──────────────────────────────────────────────

    function renderHeader(container, cfg, data) {
        var header = container.querySelector('[data-ep-header]');
        if (!header || !cfg.showHeader) return;

        var profile = data.profile || null;
        var username = data.username || cfg.username || '';
        var profileUrl = cfg.profileUrl || 'https://www.pinterest.com/' + username + '/';

        // We always paint at least the basic handle + follow CTA.
        // Profile metadata (avatar, follower count) only when API connected.

        var avatarImg = header.querySelector('[data-ep-avatar]');
        var nameEl    = header.querySelector('[data-ep-name]');
        var handleEl  = header.querySelector('[data-ep-handle]');
        var aboutEl   = header.querySelector('[data-ep-about]');
        var statsEl   = header.querySelector('[data-ep-stats]');
        var followBtn = header.querySelector('[data-ep-follow]');

        // Display name + handle
        if (nameEl)   nameEl.textContent  = (profile && (profile.business_name || profile.username)) || username;
        if (handleEl) { handleEl.textContent = '@' + username; handleEl.href = profileUrl; }

        // Avatar (fallback to monogram circle)
        if (avatarImg) {
            if (profile && profile.profile_image) {
                avatarImg.src = profile.profile_image;
                avatarImg.alt = username;
            } else {
                // Build a monogram SVG as a data URL — keeps the header
                // visually balanced even without an avatar URL.
                var letter = (username || '?').charAt(0).toUpperCase();
                var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">'
                    + '<rect width="96" height="96" fill="#e60023"/>'
                    + '<text x="48" y="58" font-family="-apple-system, BlinkMacSystemFont, sans-serif" '
                    + 'font-size="42" font-weight="700" fill="#fff" text-anchor="middle">'
                    + escapeHtml(letter) + '</text></svg>';
                avatarImg.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
                avatarImg.alt = username;
            }
        }

        // About text
        if (aboutEl) {
            if (profile && profile.about) {
                aboutEl.textContent = profile.about;
                aboutEl.hidden = false;
            } else {
                aboutEl.hidden = true;
            }
        }

        // Stats row
        if (statsEl) {
            statsEl.innerHTML = '';
            if (profile) {
                [['follower_count', 'followers'], ['following_count', 'following'],
                 ['board_count', 'boards'], ['pin_count', 'pins']].forEach(function (pair) {
                    if (profile[pair[0]] !== null && profile[pair[0]] !== undefined) {
                        var li = document.createElement('li');
                        li.innerHTML = '<strong>' + escapeHtml(formatCount(profile[pair[0]])) + '</strong>' + escapeHtml(pair[1]);
                        statsEl.appendChild(li);
                    }
                });
            }
        }

        if (followBtn) followBtn.href = profileUrl;

        header.hidden = false;
    }

    // ─── Boards filter strip ───────────────────────────────────────────

    function renderFilters(container, cfg, data, onSelect) {
        var nav = container.querySelector('[data-ep-filters]');
        if (!nav || !cfg.showFilters) return;

        var boards = (data.boards || []).filter(function (b) { return b.name; });
        if (boards.length === 0) {
            nav.hidden = true;
            return;
        }

        nav.innerHTML = '';
        nav.hidden = false;

        var all = document.createElement('button');
        all.className = 'ep-pinterest-feed__filter-chip';
        all.setAttribute('aria-pressed', cfg.board ? 'false' : 'true');
        all.textContent = 'All pins';
        all.addEventListener('click', function () { onSelect(''); paintActive(nav, ''); });
        nav.appendChild(all);

        boards.forEach(function (b) {
            var chip = document.createElement('button');
            chip.className = 'ep-pinterest-feed__filter-chip';
            chip.setAttribute('aria-pressed', cfg.board === b.slug ? 'true' : 'false');
            chip.dataset.boardSlug = b.slug;
            chip.textContent = b.name + (b.pin_count ? ' (' + b.pin_count + ')' : '');
            chip.addEventListener('click', function () { onSelect(b.slug); paintActive(nav, b.slug); });
            nav.appendChild(chip);
        });
    }

    function paintActive(nav, slug) {
        nav.querySelectorAll('.ep-pinterest-feed__filter-chip').forEach(function (chip) {
            var match = slug ? chip.dataset.boardSlug === slug : !chip.dataset.boardSlug;
            chip.setAttribute('aria-pressed', match ? 'true' : 'false');
        });
    }

    // ─── Pin cards ─────────────────────────────────────────────────────

    var lazyObserver = null;
    function lazyObs() {
        if (lazyObserver || typeof IntersectionObserver === 'undefined') return lazyObserver;
        lazyObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var img = entry.target;
                var src = img.getAttribute('data-src');
                if (src) {
                    img.setAttribute('src', src);
                    img.removeAttribute('data-src');
                }
                lazyObserver.unobserve(img);
            });
        }, { rootMargin: '200px 0px' });
        return lazyObserver;
    }

    function buildPinCard(pin, cfg, onOpen) {
        var card = document.createElement('div');
        card.className = 'ep-pinterest-feed__item';
        card.tabIndex = 0;
        card.addEventListener('click', function (e) {
            if (e.target.closest('.ep-pinterest-feed__save') ||
                e.target.closest('.ep-pinterest-feed__share')) return;
            onOpen(pin);
        });
        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(pin); }
        });

        var img = document.createElement('img');
        img.alt = pin.title || '';
        img.loading = 'lazy';
        if (pin.image) {
            var obs = lazyObs();
            if (obs) {
                img.setAttribute('data-src', pin.image);
                obs.observe(img);
            } else {
                img.setAttribute('src', pin.image);
            }
        }
        card.appendChild(img);

        var overlay = document.createElement('div');
        overlay.className = 'ep-pinterest-feed__overlay';
        card.appendChild(overlay);

        if (pin.link) {
            var save = document.createElement('a');
            save.className = 'ep-pinterest-feed__save';
            save.href = pin.link;
            save.target = cfg.openIn === 'same-tab' ? '_self' : '_blank';
            save.rel = 'noopener noreferrer';
            save.textContent = 'Save';
            card.appendChild(save);

            var share = document.createElement('a');
            share.className = 'ep-pinterest-feed__share';
            share.href = 'https://www.pinterest.com/pin-builder/?url=' + encodeURIComponent(pin.link);
            share.target = '_blank';
            share.rel = 'noopener noreferrer';
            share.setAttribute('aria-label', 'Share on Pinterest');
            share.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/></svg>';
            card.appendChild(share);
        }

        if (cfg.showTitle || cfg.showDescription || cfg.showBoardName) {
            var meta = document.createElement('div');
            meta.className = 'ep-pinterest-feed__meta';

            if (cfg.showTitle && pin.title) {
                var t = document.createElement('p');
                t.className = 'ep-pinterest-feed__title';
                t.textContent = pin.title;
                meta.appendChild(t);
            }
            if (cfg.showDescription && pin.description) {
                var d = document.createElement('p');
                d.className = 'ep-pinterest-feed__description';
                d.textContent = pin.description;
                meta.appendChild(d);
            }
            if (cfg.showBoardName && pin.board_name) {
                var b = document.createElement('p');
                b.className = 'ep-pinterest-feed__board';
                b.textContent = pin.board_name;
                meta.appendChild(b);
            }
            if (meta.childNodes.length > 0) card.appendChild(meta);
        }

        return card;
    }

    // ─── Lightbox ─────────────────────────────────────────────────────

    function openLightbox(pin, cfg) {
        var overlay = document.createElement('div');
        overlay.className = 'ep-pinterest-feed__lightbox';
        overlay.innerHTML =
            '<button class="ep-pinterest-feed__lightbox-close" aria-label="Close">✕</button>' +
            '<div class="ep-pinterest-feed__lightbox-inner" role="dialog" aria-modal="true">' +
                '<div class="ep-pinterest-feed__lightbox-image">' +
                    '<img alt="' + escapeHtml(pin.title || '') + '" src="' + escapeHtml(pin.image || '') + '" />' +
                '</div>' +
                '<div class="ep-pinterest-feed__lightbox-body">' +
                    (pin.title ? '<h2 class="ep-pinterest-feed__lightbox-title">' + escapeHtml(pin.title) + '</h2>' : '') +
                    (pin.description ? '<p class="ep-pinterest-feed__lightbox-desc">' + escapeHtml(pin.description) + '</p>' : '') +
                    (pin.link
                        ? '<a class="ep-pinterest-feed__lightbox-link" href="' + escapeHtml(pin.link) + '" target="_blank" rel="noopener">View on Pinterest</a>'
                        : '') +
                '</div>' +
            '</div>';
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        function close() {
            overlay.remove();
            document.body.style.overflow = '';
            document.removeEventListener('keydown', onKey);
        }
        function onKey(e) { if (e.key === 'Escape') close(); }

        overlay.addEventListener('click', function (e) {
            if (e.target === overlay || e.target.classList.contains('ep-pinterest-feed__lightbox-close')) close();
        });
        document.addEventListener('keydown', onKey);
    }

    // ─── Render orchestration ──────────────────────────────────────────

    function renderInto(grid, pins, cfg, onOpen) {
        grid.innerHTML = '';
        if (pins.length === 0) {
            grid.parentElement.querySelector('.ep-pinterest-feed__empty').hidden = false;
            return;
        }
        pins.forEach(function (pin) {
            grid.appendChild(buildPinCard(pin, cfg, onOpen));
        });
    }

    function showError(container, message) {
        var grid = container.querySelector('[data-ep-grid]');
        if (grid) grid.innerHTML = '';
        var err = container.querySelector('[data-ep-error]');
        if (err) { err.textContent = message; err.hidden = false; }
    }

    function hydrate(container) {
        if (container.dataset.epHydrated) return;
        container.dataset.epHydrated = '1';

        var cfg = parseConfig(container);
        if (!cfg.username) { showError(container, 'Pinterest Feed: missing username.'); return; }

        var grid = container.querySelector('[data-ep-grid]');
        if (!grid) return;

        function openPin(pin) { openLightbox(pin, cfg); }

        function load(boardOverride) {
            // Show skeletons while we reload (filter switch).
            if (boardOverride !== undefined) {
                grid.innerHTML = '';
                var c = parseInt(cfg.postsPerPage, 10) || 12;
                for (var i = 0; i < c; i++) {
                    var s = document.createElement('div');
                    s.className = 'ep-pinterest-feed__skeleton';
                    s.style.setProperty('--ep-skeleton-h', (220 + (i * 53) % 180) + 'px');
                    grid.appendChild(s);
                }
            }

            fetchFeed(cfg, boardOverride)
                .then(function (data) {
                    renderHeader(container, cfg, data);
                    if (boardOverride === undefined) {
                        renderFilters(container, cfg, data, function (slug) { load(slug); });
                    }
                    renderInto(grid, data.pins || [], cfg, openPin);
                    container.dispatchEvent(new CustomEvent('ep-pinterest-feed:rendered', {
                        bubbles: true,
                        detail: { config: cfg, data: data, board: boardOverride }
                    }));
                })
                .catch(function (err) {
                    showError(container, 'Pinterest Feed could not be loaded.');
                    if (window.console) console.warn('[ep-pinterest-feed]', err);
                });
        }

        load();
    }

    function hydrateAll() {
        document.querySelectorAll('.ep-pinterest-feed').forEach(hydrate);
    }

    ready(hydrateAll);
    document.addEventListener('ep-pinterest-feed:rehydrate', hydrateAll);

    // In the Elementor editor the widget DOM is inserted into the preview
    // iframe AFTER our DOMContentLoaded listener has already fired, so a
    // one-shot hydration would never see the container. Two safety nets:
    //
    //   1. Elementor's `element_ready` action fires whenever a widget is
    //      added or re-rendered in the editor — we re-scan the document
    //      for any feed nodes that haven't been hydrated yet.
    //   2. A MutationObserver covers other dynamic-insertion sources
    //      (Pro AJAX, Customizer previews, etc.).
    function reHydrateNew() {
        document.querySelectorAll('.ep-pinterest-feed').forEach(function (el) {
            if (!el.dataset.epHydrated) hydrate(el);
        });
    }

    if (window.elementorFrontend && window.elementorFrontend.hooks) {
        window.elementorFrontend.hooks.addAction(
            'frontend/element_ready/embedpres_elementor.default',
            reHydrateNew
        );
    } else {
        // elementorFrontend may register after our script runs.
        window.addEventListener('elementor/frontend/init', function () {
            if (window.elementorFrontend && window.elementorFrontend.hooks) {
                window.elementorFrontend.hooks.addAction(
                    'frontend/element_ready/embedpres_elementor.default',
                    reHydrateNew
                );
            }
        });
    }

    if (typeof MutationObserver !== 'undefined') {
        var domObs = new MutationObserver(function (mutations) {
            for (var i = 0; i < mutations.length; i++) {
                var added = mutations[i].addedNodes;
                for (var j = 0; j < added.length; j++) {
                    if (added[j].nodeType !== 1) continue;
                    if (added[j].classList && added[j].classList.contains('ep-pinterest-feed')) {
                        hydrate(added[j]);
                    } else if (added[j].querySelectorAll) {
                        var inner = added[j].querySelectorAll('.ep-pinterest-feed');
                        for (var k = 0; k < inner.length; k++) hydrate(inner[k]);
                    }
                }
            }
        });
        ready(function () {
            domObs.observe(document.documentElement, { childList: true, subtree: true });
        });
    }

    window.EPPinterestFeed = { hydrate: hydrate, hydrateAll: hydrateAll };
})();
