import React, { useState, useEffect } from 'react';
import ProRequiredModal from './ProRequiredModal';

const { __ } = wp.i18n;

const EmbedDetailsModal = ({ isOpen, onClose, embedData }) => {
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [detailedData, setDetailedData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [currentFilter, setCurrentFilter] = useState('all');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        if (isOpen && embedData) {
            setCurrentPage(1);
            setDetailedData([]);
            setFilteredData([]);
            setHasMore(true); // Reset hasMore to true when opening modal
            loadDetailedEmbedData(1, true);
        }
    }, [isOpen, embedData]);

    useEffect(() => {
        filterData();
    }, [detailedData, currentFilter, searchKeyword]);

    // Infinite scroll effect
    useEffect(() => {
        const handleScroll = (e) => {
            const { scrollTop, scrollHeight, clientHeight } = e.target;
            const isNearBottom = scrollTop + clientHeight >= scrollHeight - 50; // Reduced threshold

            // Only trigger if we have data and are not already loading
            if (isNearBottom && hasMore && !loadingMore && !loading && filteredData.length > 0) {
                console.log('Triggering loadMore()');
                loadMore();
            }
        };

        const modalBody = document.querySelector('.ep-modal-body');
        if (modalBody && isOpen && !detailedData?.error) {
            modalBody.addEventListener('scroll', handleScroll, { passive: true });
            return () => modalBody.removeEventListener('scroll', handleScroll);
        }
    }, [hasMore, loadingMore, loading, isOpen, filteredData.length, detailedData?.error]);

    console.log({ isOpen, embedData, hasMore });


    const loadDetailedEmbedData = async (page = 1, reset = false) => {
        if (reset) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }

        try {
            const limit = 20; // Load 20 items per page
            const offset = (page - 1) * limit;

            const response = await fetch(`${embedpressAnalyticsData.restUrl}embed-details?limit=${limit}&offset=${offset}`, {
                method: 'GET',
                headers: {
                    'X-WP-Nonce': embedpressAnalyticsData.nonce,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            console.log('API Response:', data);

            if (response.ok) {
                if (reset) {
                    setDetailedData(data);
                } else {
                    // Append new data for infinite scroll
                    setDetailedData(prev => ({
                        ...data,
                        data: [...(prev.data || []), ...(data.data || [])]
                    }));
                }

                // Use the has_more field from API response
                const apiHasMore = data.has_more !== undefined ? data.has_more : false;
                setHasMore(apiHasMore);
                setCurrentPage(page);

                console.log(`API hasMore: ${apiHasMore}, received ${data.data ? data.data.length : 0} items`);
            } else {
                // Handle error response (like pro license required)
                if (response.status === 403) {
                    setDetailedData({
                        error: 'pro_required',
                        message: data.error || 'Pro license required'
                    });
                } else {
                    setDetailedData({
                        error: 'api_error',
                        message: data.error || 'Failed to load data'
                    });
                }
            }
        } catch (error) {
            console.error('Failed to load detailed embed data:', error);
            setDetailedData({ error: 'network_error', message: 'Network error occurred' });
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const filterData = () => {
        if (!detailedData?.data) {
            setFilteredData([]);
            return;
        }

        let filtered = detailedData.data;

        // Apply source filter
        if (currentFilter !== 'all') {
            filtered = filtered.filter(item => item.source === currentFilter);
        }

        // Apply search keyword filter
        if (searchKeyword.trim()) {
            const keyword = searchKeyword.toLowerCase().trim();
            filtered = filtered.filter(item => {
                const title = (item.post_title || '').toLowerCase();
                const postType = (item.post_type || '').toLowerCase();
                const source = (item.source || '').toLowerCase();
                const embedType = (item.embed_type || '').toLowerCase();

                return title.includes(keyword) ||
                    postType.includes(keyword) ||
                    source.includes(keyword) ||
                    embedType.includes(keyword) ||
                    item.post_id.toString().includes(keyword);
            });
        }

        setFilteredData(filtered);

        console.log('Filter applied:', {
            currentFilter,
            searchKeyword,
            totalData: detailedData.data.length,
            filteredData: filtered.length,
            sampleData: filtered.slice(0, 3).map(item => ({ source: item.source, title: item.post_title }))
        });
    };

    const handleFilterChange = (filter) => {
        setCurrentFilter(filter);
    };

    const handleSearchChange = (e) => {
        setSearchKeyword(e.target.value);
    };

    const clearSearch = () => {
        setSearchKeyword('');
    };

    const loadMore = () => {
        if (!loadingMore && hasMore) {
            loadDetailedEmbedData(currentPage + 1, false);
        }
    };



    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!isOpen) return null;

    const isProActive = window.embedpressAnalyticsData?.isProActive || false;

    if (!isProActive) {
        return <ProRequiredModal onClose={onClose} />;
    }

    return (
        <div className="ep-modal-overlay" onClick={onClose}>
            <div className="ep-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="ep-modal-header">
                    <h3>
                        {__('Embedded Content Detailed Analytics', 'embedpress')}
                    </h3>
                    <button className="ep-modal-close" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                <div className="ep-modal-body">
                    {loading ? (
                        <div className="ep-skeleton-container">
                            {/* Summary Cards Skeleton */}
                            <div className="ep-embed-summary">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="ep-summary-card ep-skeleton-card">
                                        <div className="ep-skeleton ep-skeleton-number"></div>
                                        <div className="ep-skeleton ep-skeleton-label"></div>
                                    </div>
                                ))}
                            </div>

                            {/* List Header Skeleton */}
                            <div className="ep-embed-list">
                                <div className="ep-list-header">
                                    <div className="ep-skeleton ep-skeleton-title"></div>
                                    <div className="ep-list-filters">
                                        <div className="ep-search-container">
                                            <div className="ep-skeleton ep-skeleton-search"></div>
                                        </div>
                                        <div className="ep-skeleton ep-skeleton-select"></div>
                                    </div>
                                </div>

                                {/* Table Skeleton */}
                                <div className="ep-embed-table">
                                    <div className="ep-table-header">
                                        <div className="ep-table-col ep-content-col">{__('Page Title', 'embedpress')}</div>
                                        <div className="ep-table-col ep-source-col">{__('Editor/Builder', 'embedpress')}</div>
                                        <div className="ep-table-col ep-count-col">{__('Embed Count', 'embedpress')}</div>
                                        <div className="ep-table-col ep-date-col">{__('Last Updated', 'embedpress')}</div>
                                        <div className="ep-table-col ep-actions-col">{__('Actions', 'embedpress')}</div>
                                    </div>

                                    <div className="ep-table-body">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <div key={i} className="ep-table-row ep-skeleton-row">
                                                <div className="ep-table-col ep-content-info">
                                                    <div className="ep-skeleton ep-skeleton-content-title"></div>
                                                    <div className="ep-skeleton ep-skeleton-content-meta"></div>
                                                </div>
                                                <div className="ep-table-col">
                                                    <div className="ep-skeleton ep-skeleton-badge"></div>
                                                </div>
                                                <div className="ep-table-col ep-count-col">
                                                    <div className="ep-skeleton ep-skeleton-count"></div>
                                                </div>
                                                <div className="ep-table-col ep-date-col">
                                                    <div className="ep-skeleton ep-skeleton-date"></div>
                                                </div>
                                                <div className="ep-table-col ep-actions-col">
                                                    <div className="ep-skeleton ep-skeleton-action"></div>
                                                    <div className="ep-skeleton ep-skeleton-action"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : detailedData?.error ? (
                        <div className="ep-error-state">
                            {detailedData.error === 'pro_required' ? (
                                <ProRequiredModal onClose={onClose} />
                            ) : (
                                <div className="ep-api-error">
                                    <div className="ep-error-icon">⚠️</div>
                                    <h3>{__('Error Loading Data', 'embedpress')}</h3>
                                    <p>{detailedData.message}</p>
                                    <button className="ep-retry-btn" onClick={loadDetailedEmbedData}>
                                        {__('Try Again', 'embedpress')}
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="ep-embed-summary">
                                <div className="ep-summary-card">
                                    <span className="ep-summary-number">{detailedData?.summary?.total || embedData?.content_by_type?.total || 0}</span>
                                    <span className="ep-summary-label">{__('Total Embeds', 'embedpress')}</span>
                                </div>
                                <div className="ep-summary-card">
                                    <span className="ep-summary-number">{detailedData?.summary?.gutenberg || embedData?.content_by_type?.gutenberg || 0}</span>
                                    <span className="ep-summary-label">{__('Gutenberg', 'embedpress')}</span>
                                </div>
                                <div className="ep-summary-card">
                                    <span className="ep-summary-number">{detailedData?.summary?.elementor || embedData?.content_by_type?.elementor || 0}</span>
                                    <span className="ep-summary-label">{__('Elementor', 'embedpress')}</span>
                                </div>
                                <div className="ep-summary-card">
                                    <span className="ep-summary-number">{detailedData?.summary?.shortcode || embedData?.content_by_type?.shortcode || 0}</span>
                                    <span className="ep-summary-label">{__('Shortcode', 'embedpress')}</span>
                                </div>
                            </div>

                            <div className="ep-embed-list">
                                <div className="ep-list-header">
                                    <h4>{__('Recent Embeds Overview', 'embedpress')}</h4>
                                    <div className="ep-list-filters">
                                        <div className="ep-search-container">
                                            <input
                                                type="text"
                                                className="ep-search-input"
                                                placeholder={__('Search by title, type, or ID...', 'embedpress')}
                                                value={searchKeyword}
                                                onChange={handleSearchChange}
                                            />
                                            {searchKeyword && (
                                                <button
                                                    className="ep-search-clear"
                                                    onClick={clearSearch}
                                                    title={__('Clear search', 'embedpress')}
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                        <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                        <select
                                            className="ep-filter-select"
                                            value={currentFilter}
                                            onChange={(e) => handleFilterChange(e.target.value)}
                                        >
                                            <option value="all">{__('All Sources', 'embedpress')}</option>
                                            <option value="gutenberg">{__('Gutenberg', 'embedpress')}</option>
                                            <option value="elementor">{__('Elementor', 'embedpress')}</option>
                                            <option value="shortcode">{__('Shortcode', 'embedpress')}</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="ep-embed-table">
                                    <div className="ep-table-header">
                                        <div className="ep-table-col ep-content-col">{__('Page Title', 'embedpress')}</div>
                                        <div className="ep-table-col ep-source-col">{__('Editor/Builder', 'embedpress')}</div>
                                        <div className="ep-table-col ep-count-col">{__('Embed Count', 'embedpress')}</div>
                                        <div className="ep-table-col ep-date-col">{__('Last Updated', 'embedpress')}</div>
                                        <div className="ep-table-col ep-actions-col">{__('Actions', 'embedpress')}</div>
                                    </div>

                                    <div className="ep-table-body">
                                        {Array.isArray(filteredData) && filteredData.length > 0 ? filteredData.map((item, index) => (
                                            <div key={index} className="ep-table-row">
                                                <div className="ep-table-col ep-content-info" data-label={__('Content', 'embedpress')}>
                                                    <div className="ep-content-title">
                                                        {item.post_title || __('Untitled', 'embedpress')}
                                                    </div>
                                                    <div className="ep-content-meta">
                                                        {__('ID:', 'embedpress')} {item.post_id} • {item.post_type}
                                                    </div>
                                                </div>
                                                <div className="ep-table-col" data-label={__('Source', 'embedpress')}>
                                                    <span className={`ep-source-badge ep-source-${item.source}`}>
                                                        {item.source}
                                                    </span>
                                                </div>
                                                <div className="ep-table-col ep-count-col" data-label={__('Count', 'embedpress')}>
                                                    <span className="ep-embed-count">
                                                        {item.embed_count || 1}
                                                    </span>
                                                </div>
                                                <div className="ep-table-col ep-date-col" data-label={__('Modified', 'embedpress')}>
                                                    {formatDate(item.modified_date)}
                                                </div>
                                                <div className="ep-table-col ep-actions-col" data-label={__('Actions', 'embedpress')}>
                                                    <a
                                                        href={item.view_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="ep-action-btn ep-view-btn"
                                                        title={__('View Page', 'embedpress')}
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                            <path d="M8 3C5.5 3 3.5 4.5 2 7c1.5 2.5 3.5 4 6 4s4.5-1.5 6-4c-1.5-2.5-3.5-4-6-4z" stroke="currentColor" strokeWidth="1.5" />
                                                            <circle cx="8" cy="7" r="2" stroke="currentColor" strokeWidth="1.5" />
                                                        </svg>
                                                    </a>
                                                    <a
                                                        href={item.edit_url}
                                                        className="ep-action-btn ep-edit-btn"
                                                        title={__('Edit Content', 'embedpress')}
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                            <path d="M11.5 2.5l2 2L6 12H4v-2l7.5-7.5z" stroke="currentColor" strokeWidth="1.5" />
                                                        </svg>
                                                    </a>
                                                </div>
                                            </div>
                                        )) : !detailedData?.error && (
                                            <div className="ep-empty-state">
                                                <div className="ep-empty-icon">📎</div>
                                                <p>{__('No embedded content found', 'embedpress')}</p>
                                                <small>{__('Create some embeds to see them here', 'embedpress')}</small>
                                            </div>
                                        )}


                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {
                    !detailedData?.error === 'pro_required' && (

                        <div className="ep-modal-footer">
                            <div className="ep-footer-info">
                                {loadingMore ? (
                                    <div className="ep-footer-loading">
                                        <div className="ep-spinner-small"></div>
                                        <span className="ep-footer-text">
                                            {__('Showing', 'embedpress')} {filteredData.length} {__('of', 'embedpress')} {detailedData?.data?.length || 0} {__('items', 'embedpress')}
                                            {hasMore && <span className="ep-more-available"> • {__('More available', 'embedpress')}</span>}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="ep-footer-text">
                                        {__('Showing', 'embedpress')} {filteredData.length} {__('of', 'embedpress')} {detailedData?.data?.length || 0} {__('items', 'embedpress')}
                                        {hasMore && <span className="ep-more-available"> • {__('More available', 'embedpress')}</span>}
                                    </span>
                                )}
                            </div>
                            <div className="ep-footer-actions">
                                <button className="ep-btn ep-btn-secondary" onClick={onClose}>
                                    {__('Close', 'embedpress')}
                                </button>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default EmbedDetailsModal;
