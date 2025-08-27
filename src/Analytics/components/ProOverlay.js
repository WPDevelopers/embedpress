import React, { useState } from 'react';

const { __ } = wp.i18n;

export default function ProOverlay({ children, showOverlay = true, onEyeClick = null }) {
    const [showProModal, setShowProModal] = useState(false);

    // Check if pro is active from global data
    const isProActive = window.embedpressAnalyticsData?.isProActive || false;

    // If pro is active, just render children without overlay
    if (isProActive || !showOverlay) {
        return children;
    }

    const handleEyeClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (onEyeClick) {
            onEyeClick();
        } else {
            setShowProModal(true);
        }
    };

    const handleCloseModal = () => {
        setShowProModal(false);
    };

    const handleUpgradeClick = () => {
        window.open('https://wpdeveloper.com/in/upgrade-embedpress', '_blank');
        setShowProModal(false);
    };

    return (
        <div className="ep-pro-section-wrapper">
            {/* Content with overlay */}
            <div className="ep-pro-content-container">
                {children}
                
                {/* Pro overlay */}
                <div className="ep-pro-overlay">
                    <div className="ep-pro-overlay-content">
                        <button 
                            className="ep-pro-eye-icon"
                            onClick={handleEyeClick}
                            title="View Pro Features"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Pro Modal */}
            {showProModal && (
                <div className="ep-modal-overlay" onClick={handleCloseModal}>
                    <div className="ep-modal-content ep-analytics-pro-modal" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="ep-modal-close"
                            onClick={handleCloseModal}
                            aria-label={__('Close modal', 'embedpress')}
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </button>

                        <div className="ep-modal-header">
                            <div className="ep-embedpress-logo">
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16 0C7.163 0 0 7.163 0 16s7.163 16 16 16 16-7.163 16-16S24.837 0 16 0zm0 29C8.82 29 3 23.18 3 16S8.82 3 16 3s13 5.82 13 13-5.82 13-13 13z" fill="#6C5CE7"/>
                                    <path d="M22 12l-6 6-6-6" stroke="#6C5CE7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span className="ep-logo-text">{__('EmbedPress', 'embedpress')}</span>
                            </div>
                            <h2 className="ep-modal-title">{__('Access Advanced Analytics', 'embedpress')}</h2>
                            <p className="ep-modal-subtitle">{__('Want deeper insights? Go Pro with EmbedPress.', 'embedpress')}</p>
                        </div>

                        <div className="ep-modal-body">
                            <div className="ep-pro-features-grid">
                                <div className="ep-pro-feature-item">
                                    <div className="ep-feature-icon ep-analytics-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3 3v18h18" stroke="#6C5CE7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M18 9l-5 5-4-4-4 4" stroke="#6C5CE7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                    <div className="ep-feature-content">
                                        <h4>{__('Per Embed Analytics', 'embedpress')}</h4>
                                        <p>{__('View analytics for each embedded content, including views and clicks.', 'embedpress')}</p>
                                    </div>
                                </div>

                                <div className="ep-pro-feature-item">
                                    <div className="ep-feature-icon ep-geo-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="12" cy="12" r="10" stroke="#6C5CE7" strokeWidth="2"/>
                                            <path d="M2 12h20" stroke="#6C5CE7" strokeWidth="2"/>
                                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="#6C5CE7" strokeWidth="2"/>
                                        </svg>
                                    </div>
                                    <div className="ep-feature-content">
                                        <h4>{__('Geo Tracking', 'embedpress')}</h4>
                                        <p>{__('See where your viewers are located with country and city analytics.', 'embedpress')}</p>
                                    </div>
                                </div>

                                <div className="ep-pro-feature-item">
                                    <div className="ep-feature-icon ep-device-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="#6C5CE7" strokeWidth="2"/>
                                            <line x1="8" y1="21" x2="16" y2="21" stroke="#6C5CE7" strokeWidth="2"/>
                                            <line x1="12" y1="17" x2="12" y2="21" stroke="#6C5CE7" strokeWidth="2"/>
                                        </svg>
                                    </div>
                                    <div className="ep-feature-content">
                                        <h4>{__('Device Analytics', 'embedpress')}</h4>
                                        <p>{__('Understand what devices your visitors are using - mobile, desktop, or tablet.', 'embedpress')}</p>
                                    </div>
                                </div>

                                <div className="ep-pro-feature-item">
                                    <div className="ep-feature-icon ep-referral-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="#6C5CE7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="#6C5CE7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                    <div className="ep-feature-content">
                                        <h4>{__('Referral Tracking', 'embedpress')}</h4>
                                        <p>{__('See which pages or sites are sending traffic to your embedded content.', 'embedpress')}</p>
                                    </div>
                                </div>

                                <div className="ep-pro-feature-item">
                                    <div className="ep-feature-icon ep-email-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#6C5CE7" strokeWidth="2"/>
                                            <polyline points="22,6 12,13 2,6" stroke="#6C5CE7" strokeWidth="2"/>
                                        </svg>
                                    </div>
                                    <div className="ep-feature-content">
                                        <h4>{__('Email Reports', 'embedpress')}</h4>
                                        <p>{__('Automatically receive weekly or monthly analytics reports in your inbox.', 'embedpress')}</p>
                                    </div>
                                </div>

                                <div className="ep-pro-feature-item">
                                    <div className="ep-feature-icon ep-export-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#6C5CE7" strokeWidth="2"/>
                                            <polyline points="14,2 14,8 20,8" stroke="#6C5CE7" strokeWidth="2"/>
                                            <line x1="16" y1="13" x2="8" y2="13" stroke="#6C5CE7" strokeWidth="2"/>
                                            <line x1="16" y1="17" x2="8" y2="17" stroke="#6C5CE7" strokeWidth="2"/>
                                            <polyline points="10,9 9,9 8,9" stroke="#6C5CE7" strokeWidth="2"/>
                                        </svg>
                                    </div>
                                    <div className="ep-feature-content">
                                        <h4>{__('Advanced Export', 'embedpress')}</h4>
                                        <p>{__('Export your analytics data in PDF format with professional reports.', 'embedpress')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="ep-pro-actions">
                                <button
                                    className="ep-unlock-pro-btn"
                                    onClick={handleUpgradeClick}
                                >
                                    {__('Unlock Pro Features', 'embedpress')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
