/**
 * EmbedPress Milestone Notification Component
 * Displays milestone achievements with animation from bottom right
 */

import React, { useState, useEffect } from 'react';
import './MilestoneNotification.scss';

const MilestoneNotification = ({ 
    isOpen = false, 
    onClose,
    activeInstallations = '32K+',
    embedStats = [
        { label: 'Total Embeds', value: '100k' },
        { label: 'Total Embeds', value: '200k' },
        { label: 'Total Embeds', value: '80k' },
        { label: 'Total Embeds', value: '30k' }
    ]
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Trigger animation after component mounts
            setTimeout(() => {
                setIsVisible(true);
                setIsAnimating(true);
            }, 100);
        } else {
            setIsAnimating(false);
            // Wait for animation to complete before hiding
            setTimeout(() => {
                setIsVisible(false);
            }, 300);
        }
    }, [isOpen]);

    const handleClose = () => {
        setIsAnimating(false);
        setTimeout(() => {
            setIsVisible(false);
            if (onClose) onClose();
        }, 300);
    };

    if (!isVisible && !isOpen) return null;

    return (
        <div className={`milestone-overlay ${isAnimating ? 'milestone-overlay--visible' : ''}`}>
            <div className={`milestone-notification ${isAnimating ? 'milestone-notification--visible' : ''}`}>
                {/* Header */}
                <div className="milestone-header">
                    <h2 className="milestone-title">Your Milestones</h2>
                    <button 
                        className="milestone-close" 
                        onClick={handleClose}
                        aria-label="Close"
                    >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" fill="currentColor"/>
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="milestone-content">
                    {/* Achievement Banner */}
                    <div className="milestone-achievement">
                        <h3 className="milestone-achievement-title">
                            You've reached <span className="milestone-highlight">{activeInstallations} active installations</span>
                        </h3>
                        <p className="milestone-achievement-subtitle">
                            Setup almost complete unlock full performance insights
                        </p>
                        <a href="#analytics" className="milestone-link">
                            View Analytics
                        </a>
                    </div>

                    {/* Stats Grid */}
                    <div className="milestone-stats">
                        <div className="milestone-stats-inner">
                            {embedStats.map((stat, index) => (
                                <div key={index} className="milestone-stat-card">
                                    <div className="milestone-stat-label">{stat.label}</div>
                                    <div className="milestone-stat-value">{stat.value}</div>
                                </div>
                            ))}
                        </div>

                        {/* CTA Button */}
                        <button className="milestone-cta">
                            Unlock Premium Analytics
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MilestoneNotification;

