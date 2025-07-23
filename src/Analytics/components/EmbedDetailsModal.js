import React, { useState, useEffect } from 'react';

const EmbedDetailsModal = ({ isOpen, onClose, embedData }) => {
    const [loading, setLoading] = useState(false);
    const [detailedData, setDetailedData] = useState([]);

    useEffect(() => {
        if (isOpen && embedData) {
            loadDetailedEmbedData();
        }
    }, [isOpen, embedData]);

    const loadDetailedEmbedData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${embedpressAnalyticsData.restUrl}embed-details`, {
                method: 'GET',
                headers: {
                    'X-WP-Nonce': embedpressAnalyticsData.nonce,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setDetailedData(data);
            }
        } catch (error) {
            console.error('Failed to load detailed embed data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getEmbedTypeIcon = (type) => {
        const iconMap = {
            'youtube': '🎥',
            'vimeo': '📹',
            'pdf': '📄',
            'google-docs': '📝',
            'google-slides': '📊',
            'google-sheets': '📈',
            'elementor': '🎨',
            'gutenberg': '📝',
            'shortcode': '⚡'
        };
        return iconMap[type.toLowerCase()] || '📎';
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
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </button>
                </div>

                <div className="ep-modal-body">
                    {loading ? (
                        <div className="ep-loading-state">
                            <div className="ep-spinner"></div>
                            <p>Loading embed details...</p>
                        </div>
                    ) : (
                        <>
                            <div className="ep-embed-summary">
                                <div className="ep-summary-card">
                                    <span className="ep-summary-number">{embedData?.total || 0}</span>
                                    <span className="ep-summary-label">Total Embeds</span>
                                </div>
                                <div className="ep-summary-card">
                                    <span className="ep-summary-number">{embedData?.gutenberg || 0}</span>
                                    <span className="ep-summary-label">Gutenberg</span>
                                </div>
                                <div className="ep-summary-card">
                                    <span className="ep-summary-number">{embedData?.elementor || 0}</span>
                                    <span className="ep-summary-label">Elementor</span>
                                </div>
                                <div className="ep-summary-card">
                                    <span className="ep-summary-number">{embedData?.shortcode || 0}</span>
                                    <span className="ep-summary-label">Shortcode</span>
                                </div>
                            </div>

                            <div className="ep-embed-list">
                                <div className="ep-list-header">
                                    <h4>Recent Embedded Content</h4>
                                    <div className="ep-list-filters">
                                        <select className="ep-filter-select">
                                            <option value="all">All Types</option>
                                            <option value="gutenberg">Gutenberg</option>
                                            <option value="elementor">Elementor</option>
                                            <option value="shortcode">Shortcode</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="ep-embed-table">
                                    <div className="ep-table-header">
                                        <div className="ep-table-col">Content</div>
                                        <div className="ep-table-col">Type</div>
                                        <div className="ep-table-col">Source</div>
                                        <div className="ep-table-col">Modified</div>
                                        <div className="ep-table-col">Actions</div>
                                    </div>

                                    <div className="ep-table-body">
                                        {detailedData.length > 0 ? detailedData.map((item, index) => (
                                            <div key={index} className="ep-table-row">
                                                <div className="ep-table-col ep-content-info">
                                                    <div className="ep-content-title">
                                                        {item.post_title || 'Untitled'}
                                                    </div>
                                                    <div className="ep-content-meta">
                                                        ID: {item.post_id} • {item.post_type}
                                                    </div>
                                                </div>
                                                <div className="ep-table-col">
                                                    <span className="ep-embed-type">
                                                        {getEmbedTypeIcon(item.embed_type)} {item.embed_type}
                                                    </span>
                                                </div>
                                                <div className="ep-table-col">
                                                    <span className="ep-source-badge ep-source-{item.source}">
                                                        {item.source}
                                                    </span>
                                                </div>
                                                <div className="ep-table-col ep-date-col">
                                                    {formatDate(item.modified_date)}
                                                </div>
                                                <div className="ep-table-col ep-actions-col">
                                                    <a 
                                                        href={item.view_url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="ep-action-btn ep-view-btn"
                                                        title="View Page"
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                            <path d="M8 3C5.5 3 3.5 4.5 2 7c1.5 2.5 3.5 4 6 4s4.5-1.5 6-4c-1.5-2.5-3.5-4-6-4z" stroke="currentColor" strokeWidth="1.5"/>
                                                            <circle cx="8" cy="7" r="2" stroke="currentColor" strokeWidth="1.5"/>
                                                        </svg>
                                                    </a>
                                                    <a 
                                                        href={item.edit_url} 
                                                        className="ep-action-btn ep-edit-btn"
                                                        title="Edit Content"
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                            <path d="M11.5 2.5l2 2L6 12H4v-2l7.5-7.5z" stroke="currentColor" strokeWidth="1.5"/>
                                                        </svg>
                                                    </a>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="ep-empty-state">
                                                <div className="ep-empty-icon">📎</div>
                                                <p>No embedded content found</p>
                                                <small>Create some embeds to see them here</small>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="ep-modal-footer">
                    <button className="ep-btn ep-btn-secondary" onClick={onClose}>
                        Close
                    </button>
                    <button className="ep-btn ep-btn-primary">
                        Export List
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmbedDetailsModal;
