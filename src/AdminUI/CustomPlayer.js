/**
 * Custom Player admin app — Leads / Heatmap / Completions tabs.
 *
 * Backed by Pro REST endpoints registered by Lead_Capture, Heatmap_Tracker,
 * Completion_Tracker (see embedpress-pro/includes/Classes/CustomPlayer/).
 * Localised data shipped via window.embedpressCustomPlayerData.
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';

const data = window.embedpressCustomPlayerData || {};
const REST = data.restUrl || '/wp-json/embedpress/v1/';
const NONCE = data.nonce || '';
const ASSETS = data.assetsUrl || '';

function apiFetch(path, params = {}) {
    const url = new URL(REST.replace(/\/$/, '') + '/' + path.replace(/^\//, ''), window.location.origin);
    Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v);
    });
    return fetch(url.toString(), {
        credentials: 'same-origin',
        headers: { 'X-WP-Nonce': NONCE, 'Accept': 'application/json' },
    }).then((r) => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
    });
}

/* ---------- shared bits ---------- */

const Header = () => (
    <div className="ep-cp__header">
        <div className="ep-cp__header-inner">
            <div className="ep-cp__brand">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                    <rect width="36" height="36" rx="8" fill="#5B4E96" />
                    <path d="M14 12 L14 24 L24 18 Z" fill="#fff" />
                </svg>
                <div>
                    <h1 className="ep-cp__title">Player &amp; Engagement</h1>
                    <p className="ep-cp__subtitle">Marketing &amp; learning data captured from your videos</p>
                </div>
            </div>
        </div>
    </div>
);

const TabBar = ({ tab, onChange, counts }) => {
    const items = [
        { key: 'leads', label: 'Leads', hint: 'Email captures' },
        { key: 'heatmap', label: 'Drop-off Heatmap', hint: 'Where viewers leave' },
        { key: 'completions', label: 'Completions', hint: 'Watch-through events' },
    ];
    return (
        <div className="ep-cp__tabs" role="tablist">
            {items.map((it) => (
                <button
                    key={it.key}
                    role="tab"
                    aria-selected={tab === it.key}
                    className={`ep-cp__tab ${tab === it.key ? 'ep-cp__tab--active' : ''}`}
                    onClick={() => onChange(it.key)}
                >
                    <span className="ep-cp__tab-label">{it.label}</span>
                    <span className="ep-cp__tab-hint">{it.hint}</span>
                    {counts[it.key] !== undefined && counts[it.key] !== null && (
                        <span className="ep-cp__tab-count">{counts[it.key]}</span>
                    )}
                </button>
            ))}
        </div>
    );
};

const EmptyState = ({ icon, title, body }) => (
    <div className="ep-cp__empty">
        <div className="ep-cp__empty-icon">{icon}</div>
        <h3 className="ep-cp__empty-title">{title}</h3>
        <p className="ep-cp__empty-body">{body}</p>
    </div>
);

const Spinner = () => (
    <div className="ep-cp__spinner">
        <div className="ep-cp__spinner-dot"></div>
        <div className="ep-cp__spinner-dot"></div>
        <div className="ep-cp__spinner-dot"></div>
    </div>
);

const truncate = (s, n = 40) => {
    if (!s) return '';
    return s.length > n ? s.slice(0, n - 1) + '…' : s;
};

const formatDate = (s) => {
    if (!s) return '';
    const d = new Date(s.replace(' ', 'T'));
    if (Number.isNaN(d.valueOf())) return s;
    return d.toLocaleString();
};

// Drop-off magnitude at the cliff bucket — used in the callout copy
// ("X% of viewers leave in this 5% window"). Pulled out so the JSX
// stays readable.
const cliffDropPct = (stats) => {
    if (!stats || stats.cliffBucket == null) return 0;
    const a = stats.retention[stats.cliffBucket];
    const b = stats.retention[stats.cliffBucket + 5] || 0;
    return (a - b) * 100;
};

// Heatmap labels read in seconds-of-aggregate-viewer-time, not raw
// sample counts — "46 samples" is meaningless to admins, "23 minutes
// watched" is immediately legible.
const formatWatchTime = (seconds) => {
    if (!seconds || seconds < 1) return '0s';
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const m = Math.floor(seconds / 60);
    if (m < 60) return `${m} min`;
    const h = Math.floor(m / 60);
    const rem = m % 60;
    return rem ? `${h}h ${rem}m` : `${h}h`;
};

/* ---------- LEADS ---------- */

const LeadsTab = ({ onTotal }) => {
    // Free plugin: bail before any apiFetch, render the upgrade prompt in
    // the same panel slot the spinner / EmptyState / table would occupy.

    const [filters, setFilters] = useState({ from: '', to: '', q: '' });
    const [page, setPage] = useState(1);
    const [state, setState] = useState({ loading: true, error: null, rows: [], total: 0, totalPages: 1 });

    const load = useCallback(() => {
        setState((s) => ({ ...s, loading: true, error: null }));
        apiFetch('leads', { ...filters, page, per_page: 25 })
            .then((res) => {
                setState({ loading: false, error: null, rows: res.data || [], total: res.total || 0, totalPages: res.total_pages || 1 });
                onTotal && onTotal(res.total || 0);
            })
            .catch((e) => setState((s) => ({ ...s, loading: false, error: e.message })));
    }, [filters, page, onTotal]);

    useEffect(() => { load(); }, [load]);

    const exportUrl = useMemo(() => {
        const params = new URLSearchParams({
            page: 'embedpress-player-engagement',
            tab: 'leads',
            embedpress_export: 'leads',
            _wpnonce: data.exportNonce || '',
            from: filters.from || '',
            to: filters.to || '',
            q: filters.q || '',
        });
        return (data.adminUrl || '/wp-admin/admin.php') + '?' + params.toString();
    }, [filters]);

    return (
        <div className="ep-cp__panel">
            <div className="ep-cp__filters">
                <label className="ep-cp__field">
                    <span>From</span>
                    <input type="date" value={filters.from} onChange={(e) => { setFilters({ ...filters, from: e.target.value }); setPage(1); }} />
                </label>
                <label className="ep-cp__field">
                    <span>To</span>
                    <input type="date" value={filters.to} onChange={(e) => { setFilters({ ...filters, to: e.target.value }); setPage(1); }} />
                </label>
                <label className="ep-cp__field ep-cp__field--grow">
                    <span>Search</span>
                    <input type="search" placeholder="email or video URL"
                        value={filters.q}
                        onChange={(e) => { setFilters({ ...filters, q: e.target.value }); setPage(1); }} />
                </label>
                {data.isProActive ? (
                    <a className="ep-cp__btn ep-cp__btn--secondary" href={exportUrl}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2v8m0 0L4.5 6.5M8 10l3.5-3.5M2 13h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        Export CSV
                    </a>
                ) : (
                    <button type="button" className="ep-cp__btn ep-cp__btn--secondary" disabled aria-disabled="true" title="Available on EmbedPress Pro" style={{ pointerEvents: 'none', opacity: 0.5 }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2v8m0 0L4.5 6.5M8 10l3.5-3.5M2 13h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        Export CSV
                    </button>
                )}
            </div>

            {!data.isProActive ? (
                <UpgradePanel />
            ) : state.loading ? <Spinner /> : state.error ? (
                <EmptyState
                    icon="⚠️"
                    title="Couldn't load leads"
                    body={state.error}
                />
            ) : state.rows.length === 0 ? (
                <EmptyState
                    icon={<svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect x="6" y="12" width="36" height="24" rx="3" stroke="#DCDCE5" strokeWidth="2" /><path d="M6 16l18 12 18-12" stroke="#DCDCE5" strokeWidth="2" /></svg>}
                    title="No leads captured yet"
                    body="When viewers submit the email-capture form on a video, they'll appear here."
                />
            ) : (
                <>
                    <div className="ep-cp__count">
                        Showing {state.rows.length} of <strong>{state.total}</strong> leads
                    </div>
                    <div className="ep-cp__tablewrap">
                        <table className="ep-cp__table">
                            <thead>
                                <tr>
                                    <th>Captured</th>
                                    <th>Email</th>
                                    <th>Name</th>
                                    <th>Video</th>
                                    <th>Page</th>
                                </tr>
                            </thead>
                            <tbody>
                                {state.rows.map((r) => (
                                    <tr key={r.id}>
                                        <td>{formatDate(r.created_at)}</td>
                                        <td><strong>{r.email}</strong></td>
                                        <td>{r.name || <span className="ep-cp__muted">—</span>}</td>
                                        <td><a href={r.video_url} target="_blank" rel="noopener noreferrer">{truncate(r.video_url, 36)}</a></td>
                                        <td><a href={r.page_url} target="_blank" rel="noopener noreferrer">{truncate(r.page_url, 36)}</a></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {state.totalPages > 1 && (
                        <div className="ep-cp__pagination">
                            <button disabled={page <= 1} onClick={() => setPage(page - 1)}>← Prev</button>
                            <span>Page {page} of {state.totalPages}</span>
                            <button disabled={page >= state.totalPages} onClick={() => setPage(page + 1)}>Next →</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

/* ---------- HEATMAP ---------- */

const HeatmapTab = ({ onTotal }) => {
    if (!data.isProActive) return <div className="ep-cp__panel"><UpgradePanel /></div>;

    const [state, setState] = useState({ loading: true, error: null, videos: [] });
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        apiFetch('heatmap/list')
            .then((res) => {
                setState({ loading: false, error: null, videos: res.data || [] });
                onTotal && onTotal(res.total || 0);
                if (res.data && res.data.length > 0) setSelected(res.data[0].key);
            })
            .catch((e) => setState({ loading: false, error: e.message, videos: [] }));
    }, [onTotal]);

    const current = useMemo(
        () => state.videos.find((v) => v.key === selected),
        [state.videos, selected]
    );
    const max = current ? Math.max(1, ...current.buckets) : 1;

    // Each sample ≈ 30s of one viewer's watch time (see initplyr.js
    // epInitHeatmap interval; capped at 30s by the §4.7 acceptance
    // criterion of ≤1 request per viewer per 30s). Turns raw "samples"
    // into minutes-watched, which is what admins actually read.
    const SAMPLE_SECONDS = 30;
    const stats = useMemo(() => {
        if (!current) return null;
        const buckets = current.buckets || [];
        const total = buckets.reduce((a, b) => a + b, 0);
        if (!total) return null;
        // Retention = suffix sum / total. Always monotonically decreasing.
        const retention = new Array(buckets.length).fill(0);
        let suffix = 0;
        for (let i = buckets.length - 1; i >= 0; i--) {
            suffix += buckets[i];
            retention[i] = suffix / total;
        }
        // Smooth the (noisy) bucket array with a 5-bucket centered
        // moving average so we can find a meaningful re-watch peak
        // even with sparse data — a single random 30s sample shouldn't
        // dominate "most rewatched".
        const smooth = buckets.map((_, i) => {
            const lo = Math.max(0, i - 2);
            const hi = Math.min(buckets.length - 1, i + 2);
            let sum = 0, n = 0;
            for (let j = lo; j <= hi; j++) { sum += buckets[j]; n++; }
            return sum / n;
        });
        // Average watch position — sample-weighted mean.
        let weightedSum = 0;
        for (let i = 0; i < buckets.length; i++) weightedSum += buckets[i] * (i + 0.5);
        const avgWatchPct = weightedSum / total;
        // Half-audience drop-off — first bucket where retention < 50%.
        let medianDropPct = null;
        for (let i = 0; i < retention.length; i++) {
            if (retention[i] < 0.5) { medianDropPct = i; break; }
        }
        // Re-watch peak — highest smoothed engagement bucket, but only
        // outside the start-of-video bias zone. Every viewer's first
        // sample lands at 0% before the playhead has moved out of the
        // bucket, so the first ~5 buckets are always inflated and
        // labeling them "most rewatched" is meaningless.
        const PEAK_SEARCH_START = 5;
        const PEAK_SEARCH_END = 95;
        const avgEngagement = total / buckets.length;
        let peakBucket = PEAK_SEARCH_START;
        for (let i = PEAK_SEARCH_START + 1; i < Math.min(smooth.length, PEAK_SEARCH_END); i++) {
            if (smooth[i] > smooth[peakBucket]) peakBucket = i;
        }
        const peakSignificant = smooth[peakBucket] > avgEngagement * 1.5;
        // Biggest drop-off — bucket with the steepest retention decline
        // within a 5%-window (where the audience falls off a cliff).
        // Skip the first 5% for the same start-bias reason.
        let cliffBucket = null;
        let cliffDrop = 0;
        for (let i = PEAK_SEARCH_START; i < retention.length - 5; i++) {
            const drop = retention[i] - retention[i + 5];
            if (drop > cliffDrop) { cliffDrop = drop; cliffBucket = i; }
        }
        const cliffSignificant = cliffDrop > 0.15; // ≥15-pt audience drop in 5%
        // Completion rate = retention at the very last bucket.
        const completionRate = retention[retention.length - 1] || 0;

        return {
            total, retention, smooth, avgWatchPct, medianDropPct,
            peakBucket, peakSignificant, cliffBucket, cliffSignificant,
            completionRate, totalSeconds: total * SAMPLE_SECONDS,
        };
    }, [current, SAMPLE_SECONDS]);

    // Build the SVG path strings for the retention curve. We render at
    // viewBox 100×100 and let the SVG stretch — non-scaling-stroke
    // keeps the line crisp at any size.
    const chartPaths = useMemo(() => {
        if (!stats) return null;
        const pts = stats.retention.map((r, i) => [i, (1 - r) * 100]);
        // Smooth path via cardinal-style midpoint interpolation. With
        // monotonically-decreasing retention this avoids the jagged
        // 1%-step staircase look without distorting the data.
        let line = `M ${pts[0][0]},${pts[0][1]}`;
        for (let i = 1; i < pts.length; i++) {
            const [px, py] = pts[i - 1];
            const [x, y] = pts[i];
            const cx = (px + x) / 2;
            line += ` Q ${px},${py} ${cx},${(py + y) / 2} T ${x},${y}`;
        }
        const last = pts[pts.length - 1];
        const area = `${line} L ${last[0]},100 L 0,100 Z`;
        return { line, area };
    }, [stats]);

    if (state.loading) return <div className="ep-cp__panel"><Spinner /></div>;
    if (state.error) {
        return (
            <div className="ep-cp__panel">
                <EmptyState icon="⚠️" title="Couldn't load heatmap" body={state.error} />
            </div>
        );
    }
    if (state.videos.length === 0) {
        return (
            <div className="ep-cp__panel">
                <EmptyState
                    icon={<svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect x="6" y="30" width="6" height="12" fill="#DCDCE5" /><rect x="14" y="22" width="6" height="20" fill="#DCDCE5" /><rect x="22" y="14" width="6" height="28" fill="#DCDCE5" /><rect x="30" y="20" width="6" height="22" fill="#DCDCE5" /><rect x="38" y="34" width="6" height="8" fill="#DCDCE5" /></svg>}
                    title="No heatmap data yet"
                    body="Enable Drop-off Heatmap on a video and have viewers play it. Each visit contributes anonymous samples."
                />
            </div>
        );
    }

    return (
        <div className="ep-cp__panel">
            {current && stats && (
                <>
                    {/* KPI row — same visual language as Analytics Overview
                        cards: white box, light gray border, label on top,
                        big navy number below. No icons, no change %. */}
                    <div className="ep-cp__kpis">
                        <div className="ep-cp__kpi">
                            <span className="ep-cp__kpi-label">Avg. watch</span>
                            <h2 className="ep-cp__kpi-value">{stats.avgWatchPct.toFixed(0)}%</h2>
                        </div>
                        <div className="ep-cp__kpi">
                            <span className="ep-cp__kpi-label">Completion rate</span>
                            <h2 className="ep-cp__kpi-value">{Math.round(stats.completionRate * 100)}%</h2>
                        </div>
                        <div className="ep-cp__kpi">
                            <span className="ep-cp__kpi-label">Half-audience by</span>
                            <h2 className="ep-cp__kpi-value">{stats.medianDropPct != null ? `${stats.medianDropPct}%` : '—'}</h2>
                        </div>
                        <div className="ep-cp__kpi">
                            <span className="ep-cp__kpi-label">Total watch time</span>
                            <h2 className="ep-cp__kpi-value">{formatWatchTime(stats.totalSeconds)}</h2>
                        </div>
                    </div>

                    {/* Chart card — wraps the retention curve in the same
                        ep-card-wrapper container the Analytics dashboard uses,
                        so the look is consistent across the admin. */}
                    <div className="ep-card-wrapper">
                        <div className="ep-card-header">
                            <h4>Audience retention</h4>
                            <select value={selected || ''} onChange={(e) => setSelected(e.target.value)}>
                                {state.videos.map((v) => {
                                    const label = v.title || v.url || '(untitled)';
                                    return (
                                        <option key={v.key} value={v.key}>
                                            {truncate(label, 50)}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        <div className="ep-cp__retention">
                            <div className="ep-cp__retention-yaxis">
                                <span>100%</span>
                                <span>50%</span>
                                <span>0%</span>
                            </div>
                            <div className="ep-cp__retention-plot">
                                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="ep-cp__retention-svg" aria-hidden="true">
                                    <defs>
                                        <linearGradient id="ep-cp-retention-fill" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#5b4e96" stopOpacity="0.18" />
                                            <stop offset="100%" stopColor="#5b4e96" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    {[50].map((y) => (
                                        <line key={y} x1="0" x2="100" y1={y} y2={y}
                                            stroke="#e2e6f1" strokeWidth="0.4"
                                            vectorEffect="non-scaling-stroke" />
                                    ))}
                                    {chartPaths && (
                                        <>
                                            <path d={chartPaths.area} fill="url(#ep-cp-retention-fill)" />
                                            <path d={chartPaths.line} fill="none"
                                                stroke="#5b4e96" strokeWidth="1.2"
                                                vectorEffect="non-scaling-stroke"
                                                strokeLinejoin="round" strokeLinecap="round" />
                                        </>
                                    )}
                                </svg>
                            </div>
                            <div className="ep-cp__retention-xaxis">
                                <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
            {current && !stats && (
                <EmptyState icon="📊" title="Not enough data yet" body="Once viewers play this video, the retention curve will appear here." />
            )}
        </div>
    );
};

/* ---------- COMPLETIONS ---------- */

const CompletionsTab = ({ onTotal }) => {
    if (!data.isProActive) return <div className="ep-cp__panel"><UpgradePanel /></div>;

    const [state, setState] = useState({ loading: true, error: null, rows: [], days: 14 });

    useEffect(() => {
        apiFetch('completions')
            .then((res) => {
                setState({ loading: false, error: null, rows: res.data || [], days: res.days || 14 });
                onTotal && onTotal(res.total || 0);
            })
            .catch((e) => setState({ loading: false, error: e.message, rows: [], days: 14 }));
    }, [onTotal]);

    if (state.loading) return <div className="ep-cp__panel"><Spinner /></div>;
    if (state.error) {
        return (
            <div className="ep-cp__panel">
                <EmptyState icon="⚠️" title="Couldn't load completions" body={state.error} />
            </div>
        );
    }
    if (state.rows.length === 0) {
        return (
            <div className="ep-cp__panel">
                <EmptyState
                    icon={<svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" stroke="#DCDCE5" strokeWidth="2" /><path d="M16 24l6 6 12-12" stroke="#DCDCE5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                    title="No completion records yet"
                    body="LMS adapters may have already consumed completions through the embedpress_video_completed action. The fallback log keeps the last 14 days for debugging."
                />
            </div>
        );
    }

    return (
        <div className="ep-cp__panel">
            <p className="ep-cp__muted ep-cp__hint">
                {state.rows.length} entries from the last {state.days} days. Older entries are auto-pruned.
            </p>
            <div className="ep-cp__tablewrap">
                <table className="ep-cp__table">
                    <thead>
                        <tr>
                            <th>Completed</th>
                            <th>User</th>
                            <th>Video</th>
                            <th>Watched</th>
                            <th>Page</th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.rows.map((e, i) => {
                            const watchedPct = e.total_seconds > 0 ? Math.round((e.watched_seconds / e.total_seconds) * 100) : 0;
                            return (
                                <tr key={i}>
                                    <td>{formatDate(e.completed_at)}</td>
                                    <td>{e.user_login || <span className="ep-cp__muted">guest</span>}</td>
                                    <td><a href={e.video_url} target="_blank" rel="noopener noreferrer">{truncate(e.video_url, 36)}</a></td>
                                    <td>
                                        <div className="ep-cp__progress">
                                            <div className="ep-cp__progress-bar" style={{ width: `${watchedPct}%` }}></div>
                                            <span className="ep-cp__progress-label">{watchedPct}%</span>
                                        </div>
                                    </td>
                                    <td><a href={e.page_url} target="_blank" rel="noopener noreferrer">{truncate(e.page_url, 36)}</a></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

/* ---------- UPGRADE PANEL (free / Pro inactive) ---------- */
/* Engagement data only stores in Pro, so the free version mounts the same
 * React shell but swaps the data tabs for a single upgrade panel. Same
 * Header + TabBar so the layout reads as "this is what you'd get". */

const UPGRADE_URL = 'https://wpdeveloper.com/in/upgrade-embedpress';

const UPGRADE_FEATURES = [
    'Email Capture',
    'Drop-Off Heatmap',
    'Action Lock',
    'Timed CTAs',
    'Chapters',
    'LMS Completion',
];

const UpgradePanel = () => (
    <div className="ep-cp__upgrade">
        <span className="ep-cp__upgrade-lock" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
        </span>
        <h2 className="ep-cp__upgrade-title">Engagement data lives in Pro</h2>
        <p className="ep-cp__upgrade-body">{UPGRADE_FEATURES.join(' · ')}</p>
        <a href={UPGRADE_URL} target="_blank" rel="noopener noreferrer" className="ep-cp__upgrade-cta">
            Unlock Pro
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </a>
    </div>
);

/* ---------- ROOT ---------- */

const CustomPlayer = () => {
    const [tab, setTab] = useState(() => {
        const u = new URLSearchParams(window.location.search);
        return u.get('tab') || 'leads';
    });
    const [counts, setCounts] = useState({ leads: null, heatmap: null, completions: null });

    useEffect(() => {
        const u = new URLSearchParams(window.location.search);
        u.set('tab', tab);
        const newUrl = window.location.pathname + '?' + u.toString();
        window.history.replaceState(null, '', newUrl);
    }, [tab]);

    // Stable callbacks — recreating these per render would invalidate the
    // child useCallback deps and produce a request loop.
    const setLeadsCount = useCallback((n) => setCounts((c) => ({ ...c, leads: n })), []);
    const setHeatmapCount = useCallback((n) => setCounts((c) => ({ ...c, heatmap: n })), []);
    const setCompletionsCount = useCallback((n) => setCounts((c) => ({ ...c, completions: n })), []);

    return (
        <div className="ep-cp">
            <Header />
            <TabBar tab={tab} onChange={setTab} counts={counts} />
            <div className="ep-cp__body">
                {tab === 'leads' && <LeadsTab onTotal={setLeadsCount} />}
                {tab === 'heatmap' && <HeatmapTab onTotal={setHeatmapCount} />}
                {tab === 'completions' && <CompletionsTab onTotal={setCompletionsCount} />}
            </div>
        </div>
    );
};

export default CustomPlayer;
