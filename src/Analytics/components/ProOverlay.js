import React, { useState } from 'react';

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
                    <div className="ep-modal-content ep-pro-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="ep-modal-header">
                            <h3>🚀 Unlock Premium Analytics</h3>
                            <button 
                                className="ep-modal-close"
                                onClick={handleCloseModal}
                                aria-label="Close modal"
                            >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                            </button>
                        </div>
                        
                        <div className="ep-modal-body">
                            <div className="ep-pro-features">
                                <div className="ep-pro-feature-item">
                                    <div className="ep-feature-icon">📊</div>
                                    <div className="ep-feature-content">
                                        <h4>Advanced Analytics</h4>
                                        <p>Get detailed insights into your embedded content performance with comprehensive analytics.</p>
                                    </div>
                                </div>
                                
                                <div className="ep-pro-feature-item">
                                    <div className="ep-feature-icon">🌍</div>
                                    <div className="ep-feature-content">
                                        <h4>Geographic Analytics</h4>
                                        <p>See where your viewers are coming from with interactive world maps and location data.</p>
                                    </div>
                                </div>
                                
                                <div className="ep-pro-feature-item">
                                    <div className="ep-feature-icon">📱</div>
                                    <div className="ep-feature-content">
                                        <h4>Device & Browser Analytics</h4>
                                        <p>Understand your audience better with detailed device, browser, and OS analytics.</p>
                                    </div>
                                </div>
                                
                                <div className="ep-pro-feature-item">
                                    <div className="ep-feature-icon">🎯</div>
                                    <div className="ep-feature-content">
                                        <h4>Per-Embed Analytics</h4>
                                        <p>Track individual embed performance and identify your top-performing content.</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="ep-pro-actions">
                                <button 
                                    className="ep-upgrade-btn"
                                    onClick={handleUpgradeClick}
                                >
                                    Upgrade to Pro
                                </button>
                                <button 
                                    className="ep-learn-more-btn"
                                    onClick={() => window.open('https://embedpress.com/features/', '_blank')}
                                >
                                    Learn More
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
