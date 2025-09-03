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



    const loadDetailedEmbedData = async (page = 1, reset = false) => {
        // Check if pro is active before making API call
        const isProActive = embedpressAnalyticsData?.isProActive || false;

        if (!isProActive) {
            // Set pro required error without making API call
            setDetailedData({
                error: 'pro_required',
                message: 'Pro license required'
            });
            setLoading(false);
            setLoadingMore(false);
            return;
        }

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

    const handleUpgradeClick = () => {
        window.open('https://wpdeveloper.com/in/upgrade-embedpress', '_blank');
    };

    if (!isOpen) return null;

    const isProActive = embedpressAnalyticsData?.isProActive || false;

    // Demo data for non-pro users
    const demoData = {
        summary: {
            total_views: 1247,
            total_impressions: 3891,
            total_clicks: 156,
            avg_engagement: 12.5
        },
        pages: [
            {
                id: 1,
                title: "Getting Started with EmbedPress",
                url: "https://example.com/getting-started",
                source: "gutenberg",
                embed_count: 3,
                last_updated: "2024-01-15"
            },
            {
                id: 2,
                title: "Advanced YouTube Embeds",
                url: "https://example.com/youtube-embeds",
                source: "elementor",
                embed_count: 5,
                last_updated: "2024-01-12"
            },
            {
                id: 3,
                title: "PDF Document Showcase",
                url: "https://example.com/pdf-showcase",
                source: "shortcode",
                embed_count: 2,
                last_updated: "2024-01-10"
            },
            {
                id: 4,
                title: "Social Media Integration",
                url: "https://example.com/social-media",
                source: "gutenberg",
                embed_count: 4,
                last_updated: "2024-01-08"
            },
            {
                id: 5,
                title: "Interactive Maps Tutorial",
                url: "https://example.com/maps-tutorial",
                source: "elementor",
                embed_count: 1,
                last_updated: "2024-01-05"
            }
        ]
    };

    // Use demo data if pro is not active
    const displayData = !isProActive ? demoData : detailedData;

    console.log('displayData:', displayData);


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

                <div className={`ep-modal-body ${!isProActive ? 'ep-modal-body-blurred' : ''}`}>
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
                                        <div className="ep-filter-select-wrapper">
                                            <div className="ep-skeleton ep-skeleton-select"></div>
                                        </div>
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
                    ) : displayData?.error ? (
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
                                    <span className="ep-summary-number">{displayData?.summary?.total_views || 0}</span>
                                    <span className="ep-summary-label">{__('Total Views', 'embedpress')}</span>
                                </div>
                                <div className="ep-summary-card">
                                    <span className="ep-summary-number">{displayData?.summary?.total_impressions || 0}</span>
                                    <span className="ep-summary-label">{__('Total Impressions', 'embedpress')}</span>
                                </div>
                                <div className="ep-summary-card">
                                    <span className="ep-summary-number">{displayData?.summary?.total_clicks || 0}</span>
                                    <span className="ep-summary-label">{__('Total Clicks', 'embedpress')}</span>
                                </div>
                                <div className="ep-summary-card">
                                    <span className="ep-summary-number">{displayData?.summary?.avg_engagement || 0}%</span>
                                    <span className="ep-summary-label">{__('Avg Engagement', 'embedpress')}</span>
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
                                        <div className="ep-filter-select-wrapper">
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
                                            <svg className="ep-filter-select-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
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
                                        {Array.isArray(displayData.pages) && displayData.pages.length > 0 ? displayData.pages.map((item, index) => (
                                            <div key={index} className="ep-table-row">
                                                <div className="ep-table-col ep-content-info" data-label={__('Content', 'embedpress')}>
                                                    <div className="ep-content-title">
                                                        {item.title || __('Untitled', 'embedpress')}
                                                    </div>
                                                    <div className="ep-content-meta">
                                                        {__('ID:', 'embedpress')} {item.id} • {item.url}
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
                                                    {item.last_updated}
                                                </div>
                                                <div className="ep-table-col ep-actions-col" data-label={__('Actions', 'embedpress')}>
                                                    <button className="ep-action-btn ep-view-btn" title={__('View Page', 'embedpress')}>
                                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                            <path d="M8 3C5.5 3 3.5 4.5 2 7c1.5 2.5 3.5 4 6 4s4.5-1.5 6-4c-1.5-2.5-3.5-4-6-4z" stroke="currentColor" strokeWidth="1.5" />
                                                            <circle cx="8" cy="7" r="2" stroke="currentColor" strokeWidth="1.5" />
                                                        </svg>
                                                    </button>
                                                    <button className="ep-action-btn ep-edit-btn" title={__('Edit Content', 'embedpress')}>
                                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                            <path d="M11.5 2.5l2 2L6 12H4v-2l7.5-7.5z" stroke="currentColor" strokeWidth="1.5" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        )) : !detailedData?.error && (
                                            <div className="ep-empty-state">
                                                <div className="ep-empty-icon">📎</div>
                                                <p>{__('No embedded content found', 'embedpress')}</p>
                                                <small>{__('Create some embeds to see them here', 'embedpress')}</small>
                                            </div>
                                        )}

                                        {/* Loading More Skeleton Rows */}
                                        {loadingMore && (
                                            <>
                                                {[1, 2, 3].map(i => (
                                                    <div key={`loading-${i}`} className="ep-table-row ep-skeleton-row">
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
                                            </>
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
                                <span className="ep-footer-text">
                                    {__('Showing', 'embedpress')} {filteredData.length} {__('of', 'embedpress')} {detailedData?.data?.length || 0} {__('items', 'embedpress')}
                                    {hasMore && <span className="ep-more-available"> • {__('More available', 'embedpress')}</span>}
                                    {loadingMore && <span className="ep-loading-indicator"> • {__('Loading more...', 'embedpress')}</span>}
                                </span>
                            </div>
                            <div className="ep-footer-actions">
                                <button className="ep-btn ep-btn-secondary" onClick={onClose}>
                                    {__('Close', 'embedpress')}
                                </button>
                            </div>
                        </div>
                    )
                }

                {/* Pro Unlock Overlay */}
                {!isProActive && (
                    <div className="ep-pro-unlock-overlay">
                        <div className="ep-pro-unlock-content">
                            <div className="ep-pro-unlock-actions">
                                <button className="ep-unlock-btn ep-unlock-btn-primary" onClick={handleUpgradeClick}>
                                    {__('Unlock Pro Features', 'embedpress')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmbedDetailsModal;
