/**
 * Editor-side view + download count badge for PDF / Document blocks.
 *
 * Renders the same "N views · M downloads" badge shown on the frontend by
 * static/js/ep-view-count.js, but inside the Gutenberg editor canvas, fetching
 * live counts from the REST endpoint. Mirrors the frontend's content-id
 * derivation so the count matches what visitors see.
 *
 * Respects the per-embed toggles (showViewCount / showDownloadCount) and the
 * global master gate localized in embedpressGutenbergData.viewCount.
 */
const { useState, useEffect } = wp.element;

const cfg = (typeof embedpressGutenbergData !== 'undefined' && embedpressGutenbergData.viewCount) || {};

/**
 * Mirror of deriveContentId() in static/js/ep-view-count.js for the URL-hash
 * branch (the editor never has a server-assigned content id). Keeps the editor
 * preview count consistent with the frontend for the same embed URL.
 */
function deriveContentId(url, embedType) {
    let hash = '';
    try {
        hash = btoa(unescape(encodeURIComponent(url || ''))).replace(/[^a-zA-Z0-9]/g, '').substring(0, 10);
    } catch (e) {
        hash = String((url || '').length);
    }
    return 'ep-' + embedType + '-' + hash;
}

function fmt(template, n) {
    return (template || '%s').replace('%s', Number(n).toLocaleString());
}

function getJson(url, contentId) {
    if (!url) return Promise.resolve(null);
    const sep = url.indexOf('?') === -1 ? '?' : '&';
    return fetch(url + sep + 'content_id=' + encodeURIComponent(contentId), { credentials: 'same-origin' })
        .then((r) => (r.ok ? r.json() : null))
        .then((j) => (j && typeof j.count === 'number' ? j.count : null))
        .catch(() => null);
}

const ViewIcon = (
    <svg className="ep-view-count__icon" width="14" height="14" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        strokeLinejoin="round" aria-hidden="true">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const DownloadIcon = (
    <svg className="ep-view-count__icon" width="14" height="14" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        strokeLinejoin="round" aria-hidden="true">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

/**
 * @param {Object}  props
 * @param {string}  props.href              Embed URL (PDF/document file URL).
 * @param {string}  props.embedType         'PDF' | 'Document' (matches frontend).
 * @param {boolean} props.showViewCount     Per-embed view toggle.
 * @param {boolean} props.showDownloadCount Per-embed download toggle.
 */
const ViewCountBadge = ({ href, embedType, showViewCount = true, showDownloadCount = true }) => {
    const labels = cfg.labels || {};
    const showViews = !!cfg.viewEnabled && showViewCount !== false;
    const showDownloads = !!cfg.downloadEnabled && showDownloadCount !== false;

    const [views, setViews] = useState(null);
    const [downloads, setDownloads] = useState(null);

    useEffect(() => {
        let cancelled = false;
        if (!href || (!showViews && !showDownloads)) return undefined;
        const contentId = deriveContentId(href, embedType);

        if (showViews) {
            getJson(cfg.restUrl, contentId).then((c) => { if (!cancelled) setViews(c === null ? 0 : c); });
        }
        if (showDownloads) {
            getJson(cfg.downloadUrl, contentId).then((c) => { if (!cancelled) setDownloads(c === null ? 0 : c); });
        }
        return () => { cancelled = true; };
    }, [href, embedType, showViews, showDownloads]);

    if (!href || (!showViews && !showDownloads)) return null;

    const viewVisible = showViews && views !== null;
    const downloadVisible = showDownloads && downloads !== null;
    if (!viewVisible && !downloadVisible) return null;

    return (
        <div className="ep-view-count">
            {viewVisible && (
                <span className="ep-view-count__item ep-view-count__item--views">
                    {ViewIcon}
                    <span className="ep-view-count__label">
                        {fmt(views === 1 ? labels.singular : labels.plural, views)}
                    </span>
                </span>
            )}
            {viewVisible && downloadVisible && <span className="ep-view-count__sep">·</span>}
            {downloadVisible && (
                <span className="ep-view-count__item ep-view-count__item--downloads">
                    {DownloadIcon}
                    <span className="ep-view-count__label">
                        {fmt(downloads === 1 ? labels.downloadSingular : labels.downloadPlural, downloads)}
                    </span>
                </span>
            )}
        </div>
    );
};

export default ViewCountBadge;
