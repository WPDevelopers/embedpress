import React, { useEffect, useState, useCallback } from 'react';
import { AnalyticsDataProvider } from '../services/AnalyticsDataProvider';

const { __ } = wp.i18n;

const STATUS_LABEL = {
    ok: __('Healthy', 'embedpress'),
    broken: __('Broken', 'embedpress'),
    unknown: __('Inconclusive', 'embedpress'),
    pending: __('Not yet checked', 'embedpress'),
};

function resolveStatus(item) {
    const status = item?.last_check_status;
    if (status === 'unknown' && !item?.last_check_at_ts) {
        return 'pending';
    }
    return status || 'pending';
}

function formatRelative(ts) {
    if (!ts) return __('—', 'embedpress');

    const date = new Date(ts * 1000);
    const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);

    if (diffSec < 60) return __('just now', 'embedpress');
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} ${__('min ago', 'embedpress')}`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} ${__('hr ago', 'embedpress')}`;
    return `${Math.floor(diffSec / 86400)} ${__('days ago', 'embedpress')}`;
}

function StatusPill({ status, code }) {
    const cls = `ep-status-pill ep-status-${status || 'pending'}`;
    const label = STATUS_LABEL[status] || STATUS_LABEL.pending;
    return (
        <span className={cls}>
            {label}
            {code ? <small> · {code}</small> : null}
        </span>
    );
}

export default function BrokenEmbedsTable() {
    const [items, setItems] = useState([]);
    const [brokenCount, setBrokenCount] = useState(0);
    const [inconclusiveCount, setInconclusiveCount] = useState(0);
    const [lastScanAt, setLastScanAt] = useState(null);
    const [onlyBroken, setOnlyBroken] = useState(false);
    const [loading, setLoading] = useState(true);
    const [scanning, setScanning] = useState(false);
    const [recheckingUrl, setRecheckingUrl] = useState(null);
    const [error, setError] = useState(null);

    const loadList = useCallback(async (opts = {}) => {
        try {
            setLoading(true);
            setError(null);
            const data = await AnalyticsDataProvider.getBrokenEmbeds({
                onlyBroken: opts.onlyBroken !== undefined ? opts.onlyBroken : onlyBroken,
            });
            const list = Array.isArray(data?.items) ? data.items : [];
            setItems(list);
            setBrokenCount(data?.broken_count || 0);
            setInconclusiveCount(
                list.filter((it) => it.last_check_status === 'unknown' && it.last_check_at_ts).length
            );
            setLastScanAt(data?.last_scan_at || null);
        } catch (err) {
            setError(err?.message || 'Failed to load broken embeds');
        } finally {
            setLoading(false);
        }
    }, [onlyBroken]);

    useEffect(() => {
        loadList();
    }, [loadList]);

    const handleRecheckAll = async () => {
        try {
            setScanning(true);
            await AnalyticsDataProvider.recheckBrokenEmbeds();
            await loadList();
        } catch (err) {
            setError(err?.message || 'Re-check failed');
        } finally {
            setScanning(false);
        }
    };

    const handleRecheckOne = async (url, embedType) => {
        try {
            setRecheckingUrl(url);
            await AnalyticsDataProvider.recheckBrokenEmbeds({ url, embedType });
            await loadList();
        } catch (err) {
            setError(err?.message || 'Re-check failed');
        } finally {
            setRecheckingUrl(null);
        }
    };

    const toggleOnlyBroken = () => {
        const next = !onlyBroken;
        setOnlyBroken(next);
        loadList({ onlyBroken: next });
    };

    return (
        <div className="ep-broken-embeds">
            <div className="ep-broken-embeds__toolbar">
                <div className="ep-broken-embeds__summary">
                    <span className="ep-broken-embeds__count">
                        {brokenCount} {__('broken', 'embedpress')}
                    </span>
                    {inconclusiveCount > 0 ? (
                        <span
                            className="ep-broken-embeds__count ep-broken-embeds__count--unknown"
                            title={__('URLs the scanner could not verify (e.g. anti-bot 403, timeout). They may still work for visitors.', 'embedpress')}
                        >
                            {inconclusiveCount} {__('inconclusive', 'embedpress')}
                        </span>
                    ) : null}
                    <span className="ep-broken-embeds__last-scan">
                        {__('Last scan:', 'embedpress')}{' '}
                        {lastScanAt ? lastScanAt : __('not yet run', 'embedpress')}
                    </span>
                </div>
                <div className="ep-broken-embeds__actions">
                    <label className="ep-broken-embeds__filter">
                        <input
                            type="checkbox"
                            checked={onlyBroken}
                            onChange={toggleOnlyBroken}
                        />
                        {__('Show only broken', 'embedpress')}
                    </label>
                    <button
                        type="button"
                        className="ep-btn ep-btn-primary"
                        onClick={handleRecheckAll}
                        disabled={scanning}
                    >
                        {scanning ? __('Scanning…', 'embedpress') : __('Re-check All', 'embedpress')}
                    </button>
                </div>
            </div>

            {error && (
                <div className="ep-error-state">
                    <p>{error}</p>
                </div>
            )}

            <div className='embed-broken-content'>
                <table>
                    <thead>
                        <tr>
                            <th>{__('Page Title', 'embedpress')}</th>
                            <th>{__('Source URL', 'embedpress')}</th>
                            <th>{__('Type', 'embedpress')}</th>
                            <th>{__('Status', 'embedpress')}</th>
                            <th>{__('Last Checked', 'embedpress')}</th>
                            <th>{__('Action', 'embedpress')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length > 0 ? items.map((item) => {
                            const displayStatus = resolveStatus(item);
                            return (
                                <tr key={item.id} className={`ep-row-status-${displayStatus}`}>
                                    <td>{item.title || item.content_id}</td>
                                    <td className="ep-truncate" title={item.embed_url}>
                                        <a href={item.embed_url} target="_blank" rel="noreferrer noopener">
                                            {item.embed_url}
                                        </a>
                                    </td>
                                    <td>{item.embed_type}</td>
                                    <td>
                                        <StatusPill status={displayStatus} code={item.last_check_code} />
                                        {item.last_check_message && (displayStatus === 'broken' || displayStatus === 'unknown') ? (
                                            <div className="ep-broken-embeds__msg" title={item.last_check_message}>
                                                {item.last_check_message}
                                            </div>
                                        ) : null}
                                    </td>
                                    <td>{formatRelative(item.last_check_at_ts)}</td>
                                    <td className="ep-broken-embeds__row-actions">
                                        {item.edit_link ? (
                                            <a className="ep-btn ep-btn-ghost" href={item.edit_link} target="_blank" rel="noreferrer noopener">
                                                {__('Edit', 'embedpress')}
                                            </a>
                                        ) : null}
                                        <button
                                            type="button"
                                            className="ep-btn ep-btn-ghost"
                                            onClick={() => handleRecheckOne(item.embed_url, item.embed_type)}
                                            disabled={recheckingUrl === item.embed_url}
                                        >
                                            {recheckingUrl === item.embed_url ? __('…', 'embedpress') : __('Re-check', 'embedpress')}
                                        </button>
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan="6" className="no-data-message">
                                    {loading
                                        ? __('Loading broken embed report…', 'embedpress')
                                        : onlyBroken
                                            ? __('No broken embeds detected. All your sources look healthy.', 'embedpress')
                                            : __('No tracked embeds yet — once visitors interact with embedded content it will appear here.', 'embedpress')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
