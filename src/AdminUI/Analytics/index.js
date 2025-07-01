/**
 * EmbedPress Analytics Component
 */

import React from 'react';

const Analytics = () => {
    return (
        <div className="embedpress-analytics">
            <h1>Analytics</h1>
            <p>View detailed analytics for your embeds.</p>

            <div className="analytics-overview">
                <div className="metric-card">
                    <h3>Total Views</h3>
                    <span className="metric-value">0</span>
                    <span className="metric-change">+0%</span>
                </div>

                <div className="metric-card">
                    <h3>Total Clicks</h3>
                    <span className="metric-value">0</span>
                    <span className="metric-change">+0%</span>
                </div>

                <div className="metric-card">
                    <h3>Impressions</h3>
                    <span className="metric-value">0</span>
                    <span className="metric-change">+0%</span>
                </div>

                <div className="metric-card">
                    <h3>Unique Viewers</h3>
                    <span className="metric-value">0</span>
                    <span className="metric-change">+0%</span>
                </div>
            </div>

            <div className="analytics-charts">
                <div className="chart-container">
                    <h3>Views Over Time</h3>
                    <div className="chart-placeholder">
                        Chart will be rendered here
                    </div>
                </div>

                <div className="chart-container">
                    <h3>Top Performing Embeds</h3>
                    <div className="chart-placeholder">
                        Chart will be rendered here
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
