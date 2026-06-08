/**
 * EmbedPress — public-facing view + download count badge for PDF/Document.
 *
 * Discovers wrappers carrying [data-embed-type="PDF"|"Document"] across
 * Gutenberg blocks, [embedpress] shortcode, and Elementor widgets. Renders
 * a single inline badge that reads
 *
 *      👁 N views   ⤓ M downloads
 *
 * Views are self-recorded on first paint (session-deduped server-side).
 * Downloads are recorded when the bundled PDF.js viewer posts a
 * {source:'embedpress-pdf-viewer', type:'download'} message from inside its
 * iframe — i.e., when the visitor clicks Save/Download/Open from the PDF.js
 * toolbar. There is intentionally NO external download button.
 */
(function () {
    'use strict';

    var cfg = window.embedpressViewCount || {};
    if (!cfg.restUrl || !cfg.types || !cfg.types.length) {
        return;
    }

    var processed = new WeakSet();
    var SESSION_COOKIE = 'ep_vc_session';
    // contentId -> wrapper element, so postMessage receivers can find the
    // badge they need to update.
    var contentIdIndex = Object.create(null);

    function ensureSessionId() {
        var m = document.cookie.match(/(?:^|;\s*)ep_vc_session=([^;]+)/);
        if (m) return decodeURIComponent(m[1]);
        var tm = document.cookie.match(/(?:^|;\s*)ep_session_id=([^;]+)/);
        var sid = tm ? decodeURIComponent(tm[1]) : ('ep-vc-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10));
        document.cookie = SESSION_COOKIE + '=' + encodeURIComponent(sid) + '; path=/; max-age=86400; samesite=lax';
        return sid;
    }
    var sessionId = ensureSessionId();

    function getEmbedUrl(el) {
        var iframe = el.tagName === 'IFRAME' ? el : el.querySelector('iframe');
        var src = iframe && iframe.getAttribute('src');
        if (src) {
            try {
                var u = new URL(src, window.location.href);
                var fileParam = u.searchParams.get('file');
                if (fileParam) return decodeURIComponent(fileParam);
            } catch (e) { /* fall through */ }
            return src;
        }
        return el.getAttribute('data-embed-url')
            || el.getAttribute('data-url')
            || el.getAttribute('data-src')
            || el.getAttribute('href')
            || '';
    }

    function deriveContentId(el, embedType) {
        var existing = el.getAttribute('data-embedpress-content')
            || el.getAttribute('data-source-id')
            || el.getAttribute('data-emid');
        if (existing) return existing;
        var url = getEmbedUrl(el);
        var hash = '';
        try {
            hash = btoa(unescape(encodeURIComponent(url))).replace(/[^a-zA-Z0-9]/g, '').substring(0, 10);
        } catch (e) {
            hash = String(url.length);
        }
        var contentId = 'ep-' + embedType + '-' + hash;
        el.setAttribute('data-embedpress-content', contentId);
        return contentId;
    }

    function fmt(n, key, fallback) {
        var template = (cfg.labels && cfg.labels[key]) || fallback;
        return template.replace('%s', n.toLocaleString());
    }
    function formatViews(n) { return fmt(n, n === 1 ? 'singular' : 'plural', '%s views'); }
    function formatDownloads(n) { return fmt(n, n === 1 ? 'downloadSingular' : 'downloadPlural', '%s downloads'); }

    function buildBadge() {
        var wrapper = document.createElement('div');
        wrapper.className = 'ep-view-count';
        wrapper.innerHTML =
            '<span class="ep-view-count__item ep-view-count__item--views" hidden>' +
                '<svg class="ep-view-count__icon" width="14" height="14" viewBox="0 0 24 24" ' +
                'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
                'stroke-linejoin="round" aria-hidden="true">' +
                '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/>' +
                '<circle cx="12" cy="12" r="3"/>' +
                '</svg>' +
                '<span class="ep-view-count__label" data-views></span>' +
            '</span>' +
            '<span class="ep-view-count__sep" hidden></span>' +
            '<span class="ep-view-count__item ep-view-count__item--downloads" hidden>' +
                '<svg class="ep-view-count__icon" width="14" height="14" viewBox="0 0 24 24" ' +
                'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
                'stroke-linejoin="round" aria-hidden="true">' +
                '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>' +
                '<polyline points="7 10 12 15 17 10"/>' +
                '<line x1="12" y1="15" x2="12" y2="3"/>' +
                '</svg>' +
                '<span class="ep-view-count__label" data-downloads></span>' +
            '</span>';
        return wrapper;
    }

    function placeAfter(el, node) {
        if (el.tagName === 'IFRAME') {
            if (el.parentNode) el.parentNode.insertBefore(node, el.nextSibling);
        } else {
            el.appendChild(node);
        }
    }

    function ensureBadgeFor(el) {
        var isIframe = el.tagName === 'IFRAME';
        var existing = isIframe
            ? (el.nextElementSibling && el.nextElementSibling.classList && el.nextElementSibling.classList.contains('ep-view-count') ? el.nextElementSibling : null)
            : el.querySelector(':scope > .ep-view-count');
        if (existing) return existing;
        var badge = buildBadge();
        placeAfter(el, badge);
        return badge;
    }

    function setViewCount(el, count) {
        var badge = ensureBadgeFor(el);
        var item = badge.querySelector('.ep-view-count__item--views');
        item.hidden = false;
        item.querySelector('[data-views]').textContent = formatViews(count);
        el.setAttribute('data-ep-view-count', String(count));
        syncSeparator(badge);
    }

    function setDownloadCount(el, count) {
        var badge = ensureBadgeFor(el);
        var item = badge.querySelector('.ep-view-count__item--downloads');
        item.hidden = false;
        item.querySelector('[data-downloads]').textContent = formatDownloads(count);
        el.setAttribute('data-ep-download-count', String(count));
        syncSeparator(badge);
    }

    function syncSeparator(badge) {
        var v = badge.querySelector('.ep-view-count__item--views');
        var d = badge.querySelector('.ep-view-count__item--downloads');
        var sep = badge.querySelector('.ep-view-count__sep');
        sep.hidden = v.hidden || d.hidden;
        if (!sep.hidden) sep.textContent = '·';
    }

    function postForm(url, params) {
        var body = new URLSearchParams();
        Object.keys(params).forEach(function (k) {
            if (params[k] != null && params[k] !== '') body.set(k, params[k]);
        });
        return fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body.toString()
        })
            .then(function (r) { return r.ok ? r.json() : null; })
            .then(function (j) { return j && typeof j.count === 'number' ? j.count : null; })
            .catch(function () { return null; });
    }
    function getJson(url, query) {
        var sep = url.indexOf('?') === -1 ? '?' : '&';
        var full = url + sep + 'content_id=' + encodeURIComponent(query);
        return fetch(full, { credentials: 'same-origin' })
            .then(function (r) { return r.ok ? r.json() : null; })
            .then(function (j) { return j && typeof j.count === 'number' ? j.count : null; })
            .catch(function () { return null; });
    }

    // The per-embed block/widget toggle is the ONLY thing that shows a counter.
    // The global option never overrides it. Editors emit an explicit marker on
    // the wrapper:
    //   data-ep-views="on"  -> show this counter for this embed
    //   data-ep-views="off" -> hide this counter for this embed
    //   absent              -> off (e.g. embeds saved before this feature)
    function resolve(el, attr) {
        return el.getAttribute(attr) === 'on';
    }
    function viewAllowed(el) {
        return resolve(el, 'data-ep-views');
    }
    function downloadAllowed(el) {
        return resolve(el, 'data-ep-downloads');
    }

    function processElement(el) {
        if (processed.has(el)) return;
        var embedType = el.getAttribute('data-embed-type');
        if (!embedType || cfg.types.indexOf(embedType) === -1) return;
        processed.add(el);

        var contentId = deriveContentId(el, embedType);
        var embedUrl  = getEmbedUrl(el);
        contentIdIndex[contentId] = el;

        if (viewAllowed(el) && cfg.trackUrl) {
            postForm(cfg.trackUrl, {
                content_id: contentId,
                session_id: sessionId,
                embed_type: embedType,
                embed_url: embedUrl
            }).then(function (count) {
                if (count === null) return getJson(cfg.restUrl, contentId);
                return count;
            }).then(function (count) {
                if (count === null) return;
                setViewCount(el, count);
            });
        }

        if (downloadAllowed(el) && cfg.downloadUrl) {
            getJson(cfg.downloadUrl, contentId).then(function (count) {
                setDownloadCount(el, count === null ? 0 : count);
            });
        }
    }

    function scan(root) {
        var nodes = (root || document).querySelectorAll('[data-embed-type]');
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].parentElement && nodes[i].parentElement.closest('[data-embed-type]')) continue;
            processElement(nodes[i]);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { scan(); });
    } else {
        scan();
    }

    if ('MutationObserver' in window) {
        new MutationObserver(function (mutations) {
            mutations.forEach(function (m) {
                m.addedNodes.forEach(function (n) {
                    if (n.nodeType !== 1) return;
                    if (n.matches && n.matches('[data-embed-type]')) processElement(n);
                    if (n.querySelectorAll) n.querySelectorAll('[data-embed-type]').forEach(processElement);
                });
            });
        }).observe(document.body, { childList: true, subtree: true });
    }

    // Refresh view badge after analytics tracker fires its own view event.
    document.addEventListener('embedpress:view', function (ev) {
        var detail = ev && ev.detail;
        if (!detail || !detail.contentId) return;
        var el = contentIdIndex[detail.contentId];
        if (!el || !cfg.restUrl) return;
        getJson(cfg.restUrl, detail.contentId).then(function (c) {
            if (c !== null) setViewCount(el, c);
        });
    });

    /**
     * Receive download notifications from the bundled PDF.js viewer
     * (static/pdf/web/ep-scripts.js posts these when the toolbar
     * Download / Save buttons are clicked). Resolves the wrapper from
     * event.source.frameElement so we credit the right embed when the
     * page contains multiple PDFs.
     */
    window.addEventListener('message', function (ev) {
        var data = ev && ev.data;
        if (!data || data.source !== 'embedpress-pdf-viewer' || data.type !== 'download') return;
        // Need an endpoint to POST to; the actual per-embed gate is
        // downloadAllowed(el) below (after we resolve which embed sent this),
        // so a per-embed opt-in still tracks when the global default is off.
        if (!cfg.downloadTrackUrl) return;

        var sourceFrame = null;
        try {
            // event.source is a Window; locate its iframe in the host doc.
            var frames = document.getElementsByTagName('iframe');
            for (var i = 0; i < frames.length; i++) {
                if (frames[i].contentWindow === ev.source) { sourceFrame = frames[i]; break; }
            }
        } catch (e) { /* cross-origin — try fallback by href below */ }

        // Only accept a frame match that resolves to a real embed wrapper —
        // if the source iframe isn't inside one (e.g. an unrelated frame
        // postMessaged) we fall through to URL matching below.
        var el = sourceFrame ? sourceFrame.closest('[data-embed-type]') : null;
        if (!el) {
            // Fallback: match by file= URL when no frame match.
            try {
                var u = new URL(data.href || '', window.location.href);
                var fileParam = u.searchParams.get('file');
                if (fileParam) {
                    var target = decodeURIComponent(fileParam);
                    document.querySelectorAll('[data-embed-type]').forEach(function (n) {
                        if (!el && getEmbedUrl(n) === target) el = n;
                    });
                }
            } catch (e) { /* ignore */ }
        }
        if (!el) return;
        if (!downloadAllowed(el)) return;

        var embedType = el.getAttribute('data-embed-type');
        var contentId = el.getAttribute('data-embedpress-content') || deriveContentId(el, embedType);
        var embedUrl  = getEmbedUrl(el);

        postForm(cfg.downloadTrackUrl, {
            content_id: contentId,
            session_id: sessionId,
            embed_type: embedType,
            embed_url: embedUrl
        }).then(function (count) {
            if (count === null) return;
            setDownloadCount(el, count);
        });
    });
})();
