/**
 * EmbedPress Admin Dashboard Component
 */

import React from 'react';

const Dashboard = () => {
    return (
        <div className="embedpress-admin-dashboard">
            <h1>EmbedPress Dashboard</h1>
            <p>Welcome to the EmbedPress admin dashboard.</p>
            
            <div className="dashboard-stats">
                <div className="stat-card">
                    <h3>Total Embeds</h3>
                    <span className="stat-number">0</span>
                </div>
                
                <div className="stat-card">
                    <h3>Total Views</h3>
                    <span className="stat-number">0</span>
                </div>
                
                <div className="stat-card">
                    <h3>Active Blocks</h3>
                    <span className="stat-number">0</span>
                </div>
            </div>
            
            <div className="dashboard-actions">
                <button className="button button-primary">
                    Create New Embed
                </button>
                
                <button className="button">
                    View Analytics
                </button>
                
                <button className="button">
                    Settings
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
