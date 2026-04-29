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
                    <h1 className="ep-cp__title">Custom Player</h1>
                    <p className="ep-cp__subtitle">Marketing &amp; learning data captured from your videos</p>
                </div>
            </div>
        </div>
    </div>
);

const TabBar = ({ tab, onChange, counts }) => {
    const items = [
        { key: 'leads',       label: 'Leads',          hint: 'Email captures' },
        { key: 'heatmap',     label: 'Drop-off Heatmap', hint: 'Where viewers leave' },
        { key: 'completions', label: 'Completions',    hint: 'Watch-through events' },
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

/* ---------- LEADS ---------- */

const LeadsTab = ({ onTotal }) => {
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
            page: 'embedpress-custom-player',
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
                <a className="ep-cp__btn ep-cp__btn--secondary" href={exportUrl}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2v8m0 0L4.5 6.5M8 10l3.5-3.5M2 13h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    Export CSV
                </a>
            </div>

            {state.loading ? <Spinner /> : state.error ? (
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
            <div className="ep-cp__filters">
                <label className="ep-cp__field ep-cp__field--grow">
                    <span>Video</span>
                    <select value={selected || ''} onChange={(e) => setSelected(e.target.value)}>
                        {state.videos.map((v) => (
                            <option key={v.key} value={v.key}>
                                {truncate(v.url || v.key, 60)} — {v.samples.toLocaleString()} samples
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            {current && (
                <>
                    <div className="ep-cp__statgrid">
                        <div className="ep-cp__stat">
                            <span className="ep-cp__stat-label">Total samples</span>
                            <span className="ep-cp__stat-value">{current.samples.toLocaleString()}</span>
                        </div>
                        <div className="ep-cp__stat ep-cp__stat--wide">
                            <span className="ep-cp__stat-label">Video URL</span>
                            <code className="ep-cp__stat-code">{current.url || current.key}</code>
                        </div>
                    </div>

                    <div className="ep-cp__chartwrap">
                        <div className="ep-cp__chart">
                            {current.buckets.map((count, i) => {
                                const h = max > 0 ? (count / max) * 100 : 0;
                                return (
                                    <div key={i}
                                         className="ep-cp__chart-bar"
                                         style={{ height: `${h}%` }}
                                         title={`${i}%: ${count} viewers`}>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="ep-cp__chart-axis">
                            <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
                        </div>
                    </div>
                    <p className="ep-cp__muted ep-cp__hint">Each bar represents 1% of the video. Taller = more viewers reached that point.</p>
                </>
            )}
        </div>
    );
};

/* ---------- COMPLETIONS ---------- */

const CompletionsTab = ({ onTotal }) => {
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
    const setLeadsCount       = useCallback((n) => setCounts((c) => ({ ...c, leads: n })), []);
    const setHeatmapCount     = useCallback((n) => setCounts((c) => ({ ...c, heatmap: n })), []);
    const setCompletionsCount = useCallback((n) => setCounts((c) => ({ ...c, completions: n })), []);

    return (
        <div className="ep-cp">
            <Header />
            <TabBar tab={tab} onChange={setTab} counts={counts} />
            <div className="ep-cp__body">
                {tab === 'leads'       && <LeadsTab onTotal={setLeadsCount} />}
                {tab === 'heatmap'     && <HeatmapTab onTotal={setHeatmapCount} />}
                {tab === 'completions' && <CompletionsTab onTotal={setCompletionsCount} />}
            </div>
        </div>
    );
};

export default CustomPlayer;
