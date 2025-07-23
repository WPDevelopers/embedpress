import React, { useState, useEffect } from 'react';

const EmbedDetailsModal = ({ isOpen, onClose, embedData }) => {
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [detailedData, setDetailedData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [currentFilter, setCurrentFilter] = useState('all');
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
    }, [detailedData, currentFilter]);

    // Infinite scroll effect
    useEffect(() => {
        const handleScroll = (e) => {
            const { scrollTop, scrollHeight, clientHeight } = e.target;
            const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100; // 100px threshold

            console.log('Scroll event:', {
                scrollTop,
                scrollHeight,
                clientHeight,
                isNearBottom,
                hasMore,
                loadingMore,
                loading,
                filteredDataLength: filteredData.length
            });

            if (isNearBottom && hasMore && !loadingMore && !loading) {
                console.log('Triggering loadMore()');
                loadMore();
            }
        };

        const modalBody = document.querySelector('.ep-modal-body');
        if (modalBody && isOpen) {
            modalBody.addEventListener('scroll', handleScroll);
            return () => modalBody.removeEventListener('scroll', handleScroll);
        }
    }, [hasMore, loadingMore, loading, isOpen]);

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

        if (currentFilter === 'all') {
            setFilteredData(detailedData.data);
        } else {
            const filtered = detailedData.data.filter(item => item.source === currentFilter);
            setFilteredData(filtered);
        }

        const resultLength = currentFilter === 'all' ? detailedData.data.length : detailedData.data.filter(item => item.source === currentFilter).length;

        console.log('Filter applied:', {
            currentFilter,
            totalData: detailedData.data.length,
            filteredData: resultLength,
            sampleData: detailedData.data.slice(0, 3).map(item => ({ source: item.source, title: item.post_title }))
        });
    };

    const handleFilterChange = (filter) => {
        setCurrentFilter(filter);
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

    return (
        <div className="ep-modal-overlay" onClick={onClose}>
            <div className="ep-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="ep-modal-header">
                    <h3>
                        <span className="ep-modal-icon">👁️</span>
                        Embedded Content Details
                        <span className="ep-pro-badge">PRO</span>
                    </h3>
                    <button className="ep-modal-close" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                <div className="ep-modal-body">
                    {loading ? (
                        <div className="ep-loading-state">
                            <div className="ep-spinner"></div>
                            <p>Loading embed details...</p>
                        </div>
                    ) : detailedData?.error ? (
                        <div className="ep-error-state">
                            {detailedData.error === 'pro_required' ? (
                                <div className="ep-pro-required">
                                    <div className="ep-pro-icon">🔒</div>
                                    <h3>Pro Feature Required</h3>
                                    <p>{detailedData.message}</p>
                                    <div className="ep-pro-features">
                                        <h4>With EmbedPress Pro you get:</h4>
                                        <ul>
                                            <li>✅ Detailed embed analytics</li>
                                            <li>✅ Content performance insights</li>
                                            <li>✅ Advanced filtering options</li>
                                            <li>✅ Export capabilities</li>
                                            <li>✅ Priority support</li>
                                        </ul>
                                    </div>
                                    <button className="ep-upgrade-btn">
                                        Upgrade to Pro
                                    </button>
                                </div>
                            ) : (
                                <div className="ep-api-error">
                                    <div className="ep-error-icon">⚠️</div>
                                    <h3>Error Loading Data</h3>
                                    <p>{detailedData.message}</p>
                                    <button className="ep-retry-btn" onClick={loadDetailedEmbedData}>
                                        Try Again
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="ep-embed-summary">
                                <div className="ep-summary-card">
                                    <span className="ep-summary-number">{detailedData?.summary?.total || embedData?.content_by_type?.total || 0}</span>
                                    <span className="ep-summary-label">Total Embeds</span>
                                </div>
                                <div className="ep-summary-card">
                                    <span className="ep-summary-number">{detailedData?.summary?.gutenberg || embedData?.content_by_type?.gutenberg || 0}</span>
                                    <span className="ep-summary-label">Gutenberg</span>
                                </div>
                                <div className="ep-summary-card">
                                    <span className="ep-summary-number">{detailedData?.summary?.elementor || embedData?.content_by_type?.elementor || 0}</span>
                                    <span className="ep-summary-label">Elementor</span>
                                </div>
                                <div className="ep-summary-card">
                                    <span className="ep-summary-number">{detailedData?.summary?.shortcode || embedData?.content_by_type?.shortcode || 0}</span>
                                    <span className="ep-summary-label">Shortcode</span>
                                </div>
                            </div>

                            <div className="ep-embed-list">
                                <div className="ep-list-header">
                                    <h4>Recent Embedded Content</h4>
                                    <div className="ep-list-filters">
                                        <select
                                            className="ep-filter-select"
                                            value={currentFilter}
                                            onChange={(e) => handleFilterChange(e.target.value)}
                                        >
                                            <option value="all">All Sources</option>
                                            <option value="gutenberg">Gutenberg</option>
                                            <option value="elementor">Elementor</option>
                                            <option value="shortcode">Shortcode</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="ep-embed-table">
                                    <div className="ep-table-header">
                                        <div className="ep-table-col">Content</div>
                                        <div className="ep-table-col">Source</div>
                                        <div className="ep-table-col">Embed Count</div>
                                        <div className="ep-table-col">Modified</div>
                                        <div className="ep-table-col">Actions</div>
                                    </div>

                                    <div className="ep-table-body">
                                        {Array.isArray(filteredData) && filteredData.length > 0 ? filteredData.map((item, index) => (
                                            <div key={index} className="ep-table-row">
                                                <div className="ep-table-col ep-content-info" data-label="Content">
                                                    <div className="ep-content-title">
                                                        {item.post_title || 'Untitled'}
                                                    </div>
                                                    <div className="ep-content-meta">
                                                        ID: {item.post_id} • {item.post_type}
                                                    </div>
                                                </div>
                                                <div className="ep-table-col" data-label="Source">
                                                    <span className={`ep-source-badge ep-source-${item.source}`}>
                                                        {item.source}
                                                    </span>
                                                </div>
                                                <div className="ep-table-col ep-count-col" data-label="Count">
                                                    <span className="ep-embed-count">
                                                        {item.embed_count || 1}
                                                    </span>
                                                </div>
                                                <div className="ep-table-col ep-date-col" data-label="Modified">
                                                    {formatDate(item.modified_date)}
                                                </div>
                                                <div className="ep-table-col ep-actions-col" data-label="Actions">
                                                    <a
                                                        href={item.view_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="ep-action-btn ep-view-btn"
                                                        title="View Page"
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                            <path d="M8 3C5.5 3 3.5 4.5 2 7c1.5 2.5 3.5 4 6 4s4.5-1.5 6-4c-1.5-2.5-3.5-4-6-4z" stroke="currentColor" strokeWidth="1.5" />
                                                            <circle cx="8" cy="7" r="2" stroke="currentColor" strokeWidth="1.5" />
                                                        </svg>
                                                    </a>
                                                    <a
                                                        href={item.edit_url}
                                                        className="ep-action-btn ep-edit-btn"
                                                        title="Edit Content"
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
                                                <p>No embedded content found</p>
                                                <small>Create some embeds to see them here</small>
                                            </div>
                                        )}

                                        {/* Loading indicator for infinite scroll */}
                                        {loadingMore && (
                                            <div className="ep-loading-more">
                                                <div className="ep-spinner-small"></div>
                                                <span>Loading more...</span>
                                            </div>
                                        )}

                                        {/* Debug: Manual load more button */}
                                        {hasMore && !loading && detailedData?.data && (
                                            <div className="ep-debug-load-more" style={{padding: '16px', textAlign: 'center', borderTop: '1px solid #f1f5f9'}}>
                                                <button
                                                    onClick={loadMore}
                                                    disabled={loadingMore}
                                                    style={{
                                                        background: '#f3f4f6',
                                                        border: '1px solid #d1d5db',
                                                        padding: '8px 16px',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {loadingMore ? 'Loading...' : 'Load More (Debug)'}
                                                </button>
                                                <div style={{fontSize: '12px', color: '#6b7280', marginTop: '8px'}}>
                                                    Page: {currentPage}, HasMore: {hasMore.toString()}, Total Items: {detailedData?.data?.length || 0}, Filtered: {filteredData.length}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="ep-modal-footer">
                    <div className="ep-footer-info">
                        <span className="ep-footer-text">
                            Showing {filteredData.length} of {detailedData?.data?.length || 0} items
                        </span>
                    </div>
                    <button className="ep-btn ep-btn-secondary" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmbedDetailsModal;
