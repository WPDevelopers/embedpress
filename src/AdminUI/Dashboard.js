/**
 * EmbedPress Admin Dashboard Component
 */

import React, { useState } from 'react';
import MilestoneNotification from './MilestoneNotification';

const Dashboard = () => {
    const [showMilestone, setShowMilestone] = useState(false);

    const handleOpenMilestone = () => {
        setShowMilestone(true);
    };

    const handleCloseMilestone = () => {
        setShowMilestone(false);
    };

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

                <button className="button" onClick={handleOpenMilestone}>
                    Show Milestone
                </button>
            </div>

            {/* Milestone Notification */}
            <MilestoneNotification
                isOpen={showMilestone}
                onClose={handleCloseMilestone}
                activeInstallations="32K+"
                embedStats={[
                    { label: 'Total Embeds', value: '100k' },
                    { label: 'Total Embeds', value: '200k' },
                    { label: 'Total Embeds', value: '80k' },
                    { label: 'Total Embeds', value: '30k' }
                ]}
            />
        </div>
    );
};

export default Dashboard;
