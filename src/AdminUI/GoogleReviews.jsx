/**
 * EmbedPress — Google Reviews settings (React)
 * Configuration card + searchable place picker + shortcode generator with live preview.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';

const REST_NS = '/embedpress/v1/google-reviews';

const DEFAULTS = {
    limit: 5,
    min_rating: 0,
    layout: 'list',
    show_photo: true,
    show_stars: true,
    show_date: true,
    show_link: true,
};

const bootstrap = (typeof window !== 'undefined' && window.epGoogleReviewsAdmin) || {};

function api(method, path, params, body) {
    let url = (bootstrap.restUrl || '/wp-json' + REST_NS) + path;
    if (params) {
        const qs = Object.keys(params)
            .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
            .join('&');
        if (qs) url += '?' + qs;
    }
    const init = {
        method,
        headers: {
            'X-WP-Nonce': bootstrap.nonce || '',
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
    };
    if (body) init.body = JSON.stringify(body);
    return fetch(url, init).then((r) =>
        r.json().then((d) => ({ ok: r.ok, status: r.status, body: d }))
    );
}

function buildShortcode(selected, options) {
    if (!selected) return '';
    const parts = ['embedpress_google_reviews', `place_id="${selected.place_id}"`];
    if (selected.main_text) {
        parts.push(`place_name="${selected.main_text.replace(/"/g, '&quot;')}"`);
    }
    ['limit', 'min_rating', 'layout', 'show_photo', 'show_stars', 'show_date', 'show_link'].forEach((k) => {
        let v = options[k];
        if (v === DEFAULTS[k]) return;
        if (typeof v === 'boolean') v = v ? 'true' : 'false';
        parts.push(`${k}="${v}"`);
    });
    return `[${parts.join(' ')}]`;
}

/* ---------- Configuration card ---------- */
const ConfigurationCard = () => {
    const [apiKey, setApiKey] = useState('');
    const [keyPlaceholder, setKeyPlaceholder] = useState('AIza…');
    const [keyConfigured, setKeyConfigured] = useState(false);
    const [cacheTtl, setCacheTtl] = useState(21600);
    const [status, setStatus] = useState({ text: '', tone: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        api('GET', '/settings').then((res) => {
            if (!res.ok) return;
            setKeyConfigured(!!res.body.api_key_configured);
            if (res.body.api_key_configured && res.body.api_key_masked) {
                setKeyPlaceholder(res.body.api_key_masked);
            }
            if (res.body.cache_ttl) setCacheTtl(parseInt(res.body.cache_ttl, 10));
        });
    }, []);

    const flash = (text, tone) => {
        setStatus({ text, tone });
        setTimeout(() => setStatus({ text: '', tone: '' }), 3000);
    };

    const handleSave = () => {
        setSaving(true);
        const payload = { cache_ttl: cacheTtl };
        if (apiKey.trim()) payload.api_key = apiKey.trim();
        api('POST', '/settings', null, payload).then((res) => {
            setSaving(false);
            if (res.ok) {
                flash('Saved.', 'success');
                setApiKey('');
                setKeyConfigured(!!res.body.api_key_configured);
                if (res.body.api_key_masked) setKeyPlaceholder(res.body.api_key_masked);
            } else {
                flash((res.body && res.body.message) || 'Save failed.', 'error');
            }
        });
    };

    const handleClearCache = () => {
        api('POST', '/clear-cache', null, {}).then((res) => {
            if (res.ok) flash(`Cleared (${res.body.deleted || 0})`, 'success');
            else flash('Failed.', 'error');
        });
    };

    return (
        <section className="ep-gr-card">
            <header className="ep-gr-card-header">
                <h2>API configuration</h2>
                <p>Reviews are fetched server-side; your key never reaches the browser.</p>
            </header>

            <div className="ep-gr-card-body">
                <div className="ep-gr-row ep-gr-row--two">
                    <div className="ep-gr-field ep-gr-field--grow">
                        <label htmlFor="ep-gr-api-key">
                            <strong>Google Places API key</strong>
                            {keyConfigured && (
                                <span className="ep-gr-key-status">✓ Configured</span>
                            )}
                        </label>
                        <input
                            id="ep-gr-api-key"
                            type="text"
                            autoComplete="off"
                            placeholder={keyPlaceholder}
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                        />
                        <span className="description">
                            Get a key from{' '}
                            <a
                                href="https://console.cloud.google.com/apis/library/places-backend.googleapis.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Google Cloud Console
                            </a>
                            . Enable <code>Places API</code> and <code>Places API (New)</code>.
                        </span>
                    </div>

                    <div className="ep-gr-field ep-gr-field--narrow">
                        <label htmlFor="ep-gr-cache-ttl">
                            <strong>Cache reviews for</strong>
                        </label>
                        <select
                            id="ep-gr-cache-ttl"
                            value={cacheTtl}
                            onChange={(e) => setCacheTtl(parseInt(e.target.value, 10))}
                        >
                            <option value={3600}>1 hour</option>
                            <option value={21600}>6 hours</option>
                            <option value={86400}>24 hours</option>
                        </select>
                        <span className="description">Lower = fresher; higher = lower quota cost.</span>
                    </div>
                </div>
            </div>

            <footer className="ep-gr-card-footer">
                <div className="ep-gr-actions">
                    <button
                        type="button"
                        className="button button-primary"
                        disabled={saving}
                        onClick={handleSave}
                    >
                        {saving ? 'Saving…' : 'Save changes'}
                    </button>
                    <button type="button" className="button" onClick={handleClearCache}>
                        Clear reviews cache
                    </button>
                </div>
                {status.text && (
                    <span className={`ep-gr-status ep-gr-status--${status.tone}`} aria-live="polite">
                        {status.text}
                    </span>
                )}
            </footer>
        </section>
    );
};

/* ---------- Place picker ---------- */
const PlacePicker = ({ selected, onSelect, onClear }) => {
    const [q, setQ] = useState('');
    const [predictions, setPredictions] = useState([]);
    const [open, setOpen] = useState(false);
    const [searching, setSearching] = useState(false);
    const [noResults, setNoResults] = useState(false);
    const [error, setError] = useState(null);
    const debounceRef = useRef(null);

    useEffect(() => {
        clearTimeout(debounceRef.current);
        setError(null);
        if (q.trim().length < 2) {
            setPredictions([]);
            setOpen(false);
            setNoResults(false);
            return;
        }
        setSearching(true);
        debounceRef.current = setTimeout(() => {
            api('GET', '/search', { q: q.trim() }).then((res) => {
                setSearching(false);
                if (res.ok && Array.isArray(res.body.predictions)) {
                    setPredictions(res.body.predictions);
                    setOpen(res.body.predictions.length > 0);
                    setNoResults(res.body.predictions.length === 0);
                } else {
                    // REST error: WP_Error body shape is { code, message, data: { status } }
                    setPredictions([]);
                    setOpen(false);
                    setNoResults(false);
                    setError(
                        (res.body && (res.body.message || res.body.code)) ||
                            `Search failed (HTTP ${res.status}).`
                    );
                }
            }).catch((e) => {
                setSearching(false);
                setError('Network error — could not reach the server.');
            });
        }, 300);
        return () => clearTimeout(debounceRef.current);
    }, [q]);

    const pick = (p) => {
        onSelect(p);
        setQ('');
        setPredictions([]);
        setOpen(false);
        setNoResults(false);
        setError(null);
    };

    return (
        <div className="ep-gr-picker">
            {!selected ? (
                <div className="ep-gr-field ep-gr-picker-field">
                    <label htmlFor="ep-gr-search">
                        <strong>Search for a place</strong>
                    </label>
                    <input
                        id="ep-gr-search"
                        type="text"
                        className="regular-text"
                        autoComplete="off"
                        placeholder="e.g. Sydney Opera House"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />
                    {searching && !error && <span className="ep-gr-searching">Searching…</span>}
                    {open && (
                        <ul className="ep-gr-suggestions" role="listbox">
                            {predictions.map((p) => (
                                <li
                                    key={p.place_id}
                                    role="option"
                                    tabIndex={0}
                                    onClick={() => pick(p)}
                                    onKeyDown={(e) => e.key === 'Enter' && pick(p)}
                                >
                                    <strong>{p.main_text || p.description}</strong>
                                    {p.secondary_text && <span>{p.secondary_text}</span>}
                                </li>
                            ))}
                        </ul>
                    )}
                    {!searching && noResults && !error && (
                        <p className="ep-gr-inline-note ep-gr-inline-note--muted">
                            No matches for “{q.trim()}”. Try a different spelling or include the city.
                        </p>
                    )}
                    {error && (
                        <p className="ep-gr-inline-note ep-gr-inline-note--error" role="alert">
                            <strong>Search failed:</strong> {error}
                            {/missing|api[_ ]?key|not configured/i.test(error) && (
                                <>
                                    {' '}Add your Google Places API key above and save before searching.
                                </>
                            )}
                        </p>
                    )}
                </div>
            ) : (
                <div className="ep-gr-selected">
                    <div className="ep-gr-selected-info">
                        <strong>{selected.main_text}</strong>
                        {selected.secondary_text && <span>{selected.secondary_text}</span>}
                        <code>{selected.place_id}</code>
                    </div>
                    <button type="button" className="button-link" onClick={onClear}>
                        Change
                    </button>
                </div>
            )}
        </div>
    );
};

/* ---------- Shortcode generator + live preview ---------- */
const ShortcodeGenerator = () => {
    const [selected, setSelected] = useState(null);
    const [options, setOptions] = useState({
        limit: 3,
        min_rating: 0,
        layout: 'list',
        show_photo: true,
        show_stars: true,
        show_date: true,
        show_link: true,
    });
    const [previewHtml, setPreviewHtml] = useState('');
    const [previewLoading, setPreviewLoading] = useState(false);
    const [previewError, setPreviewError] = useState(null);
    const [copied, setCopied] = useState(false);
    const previewDebounceRef = useRef(null);

    const updateOption = (k, v) => setOptions((prev) => ({ ...prev, [k]: v }));

    const refreshPreview = useCallback(() => {
        if (!selected) return;
        setPreviewLoading(true);
        setPreviewError(null);
        const params = {
            place_id: selected.place_id,
            place_name: selected.main_text || '',
            limit: options.limit,
            min_rating: options.min_rating,
            layout: options.layout,
            show_photo: options.show_photo,
            show_stars: options.show_stars,
            show_date: options.show_date,
            show_link: options.show_link,
        };
        api('GET', '/preview', params).then((res) => {
            setPreviewLoading(false);
            if (res.ok && res.body.html) {
                setPreviewHtml(res.body.html);
            } else {
                setPreviewHtml('');
                setPreviewError(
                    (res.body && (res.body.message || res.body.code)) ||
                        `Preview failed (HTTP ${res.status}).`
                );
            }
        }).catch(() => {
            setPreviewLoading(false);
            setPreviewError('Network error — could not reach the server.');
        });
    }, [selected, options]);

    useEffect(() => {
        clearTimeout(previewDebounceRef.current);
        if (selected) {
            previewDebounceRef.current = setTimeout(refreshPreview, 250);
        } else {
            setPreviewHtml('');
        }
        return () => clearTimeout(previewDebounceRef.current);
    }, [selected, options, refreshPreview]);

    const shortcode = buildShortcode(selected, options);

    const handleCopy = () => {
        if (!shortcode) return;
        const writeText = (text) => {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                return navigator.clipboard.writeText(text);
            }
            // Fallback
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            return Promise.resolve();
        };
        writeText(shortcode).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <section className="ep-gr-card">
            <header className="ep-gr-card-header">
                <h2>Shortcode generator</h2>
                <p>Search for a business, tweak the display options, then copy the shortcode.</p>
            </header>

            <div className="ep-gr-card-body">
                <div className="ep-gr-callout">
                    <strong>When to use this:</strong> the shortcode is the universal path — paste it into
                    classic editor, Bricks, Divi, custom theme templates, or any builder that accepts
                    shortcodes.{' '}
                    <em>In Gutenberg?</em> Add the <strong>Google Reviews</strong> block from the EmbedPress
                    category instead.{' '}
                    <em>In Elementor?</em> Drop in the <strong>EmbedPress Google Reviews</strong> widget — both
                    expose the same options inline so you don’t have to copy a shortcode.
                </div>

                <PlacePicker
                    selected={selected}
                    onSelect={setSelected}
                    onClear={() => setSelected(null)}
                />

                <div className="ep-gr-split">
                    {/* LEFT: controls */}
                    <div className="ep-gr-split-pane">
                        <h3>Display options</h3>

                        <div className="ep-gr-row ep-gr-row--three">
                            <div className="ep-gr-field">
                                <label htmlFor="ep-gr-limit">Limit</label>
                                <select
                                    id="ep-gr-limit"
                                    value={options.limit}
                                    onChange={(e) => updateOption('limit', parseInt(e.target.value, 10))}
                                >
                                    {[1, 2, 3, 4, 5].map((n) => (
                                        <option key={n} value={n}>{n}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="ep-gr-field">
                                <label htmlFor="ep-gr-min-rating">Min. rating</label>
                                <select
                                    id="ep-gr-min-rating"
                                    value={options.min_rating}
                                    onChange={(e) => updateOption('min_rating', parseInt(e.target.value, 10))}
                                >
                                    <option value={0}>Any</option>
                                    <option value={3}>3+</option>
                                    <option value={4}>4+</option>
                                    <option value={5}>5</option>
                                </select>
                            </div>
                            <div className="ep-gr-field">
                                <label htmlFor="ep-gr-layout">Layout</label>
                                <select
                                    id="ep-gr-layout"
                                    value={options.layout}
                                    onChange={(e) => updateOption('layout', e.target.value)}
                                >
                                    <option value="list">List</option>
                                    <option value="grid">Grid</option>
                                    <option value="carousel">Carousel</option>
                                </select>
                            </div>
                        </div>

                        <fieldset className="ep-gr-toggles">
                            <legend>Show</legend>
                            {[
                                ['show_photo', 'Photo'],
                                ['show_stars', 'Stars'],
                                ['show_date', 'Date'],
                                ['show_link', '“View on Google” link'],
                            ].map(([k, label]) => (
                                <label key={k}>
                                    <input
                                        type="checkbox"
                                        checked={options[k]}
                                        onChange={(e) => updateOption(k, e.target.checked)}
                                    />
                                    {label}
                                </label>
                            ))}
                        </fieldset>

                        <div className="ep-gr-field ep-gr-shortcode-field">
                            <label htmlFor="ep-gr-shortcode">
                                <strong>Generated shortcode</strong>
                            </label>
                            <div className="ep-gr-shortcode-row">
                                <textarea
                                    id="ep-gr-shortcode"
                                    rows={2}
                                    readOnly
                                    value={shortcode}
                                    placeholder="Pick a place above to generate a shortcode."
                                />
                                <button
                                    type="button"
                                    className="button button-primary"
                                    disabled={!shortcode}
                                    onClick={handleCopy}
                                >
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                            <span className="description">Paste into any post, page, or page-builder widget.</span>
                        </div>
                    </div>

                    {/* RIGHT: live preview */}
                    <div className="ep-gr-split-pane">
                        <h3>Live preview</h3>
                        <div className="ep-gr-preview-wrap">
                            {previewLoading && <span className="ep-gr-preview-loading">Loading…</span>}
                            {previewError ? (
                                <p className="ep-gr-inline-note ep-gr-inline-note--error" role="alert">
                                    <strong>Preview failed:</strong> {previewError}
                                </p>
                            ) : previewHtml ? (
                                <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                            ) : (
                                <p className="ep-gr-preview-empty">
                                    Pick a place to preview the output here.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

/* ---------- Root ---------- */
const GoogleReviews = () => {
    return (
        <div className="ep-gr-app">
            <header className="ep-gr-page-title">
                <h1>Google Reviews</h1>
                <p>
                    Embed Google Business reviews on any page, post, or page-builder widget — search
                    a place, configure the look, and copy the generated shortcode.
                </p>
            </header>

            <div className="ep-gr-stack">
                <ConfigurationCard />
                <ShortcodeGenerator />
            </div>
        </div>
    );
};

export default GoogleReviews;
