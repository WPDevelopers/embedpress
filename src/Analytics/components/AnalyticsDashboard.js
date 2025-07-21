import React, { useState, useEffect } from 'react';
import WorldMap from './WorldMap';
import Header from './Header';
import Overview from './Overview';
import SplineChart from './SplineChart';
import PieChart from './PieChart';
import { AnalyticsDataProvider } from '../services/AnalyticsDataProvider';

export default function AnalyticsDashboard() {
    const [activeTabOne, setActiveTabOne] = useState('time');
    const [activeTabTwo, setActiveTabTwo] = useState('device');
    const [activeTabThree, setActiveTabThree] = useState('analytics');
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateRange, setDateRange] = useState(30);
    const [viewType, setViewType] = useState('views');
    const [deviceSubTab, setDeviceSubTab] = useState('device');
    const [browserSubTab, setBrowserSubTab] = useState('browsers');

    useEffect(() => {
        loadAnalyticsData();
    }, [dateRange]);

    const loadAnalyticsData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await AnalyticsDataProvider.getAllAnalyticsData(dateRange);
            setAnalyticsData(data);
        } catch (err) {
            setError(err.message);
            console.error('Failed to load analytics data:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>

            <div className="ep-analytics-dashboard">

                {/* Heading */}
                <Header />

                {/* Loading State */}
                {loading && (
                    <div className="ep-loading-state">
                        <p>Loading analytics data...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="ep-error-state">
                        <p>Error loading analytics: {error}</p>
                        <button onClick={loadAnalyticsData}>Retry</button>
                    </div>
                )}

                {/* Overview Cards */}
                <Overview
                    data={analyticsData}
                    loading={loading}
                    onFilterChange={(type, value) => {
                        // Handle filter changes if needed
                        console.log('Filter changed:', type, value);
                    }}
                />

                {/* Graps Analytics */}
                <div className="ep-main-graphs">
                    <div className="ep-card-wrapper views-chart">
                        <div class="ep-card-header">
                            <div className="tab-header-wrapper">
                                <div className="tabs">
                                    <div
                                        className={`tab ${activeTabOne === 'time' ? 'active' : ''}`}
                                        onClick={() => setActiveTabOne('time')}
                                    >
                                        Views Over Time
                                    </div>
                                    <div
                                        className={`tab ${activeTabOne === 'location' ? 'active' : ''}`}
                                        onClick={() => setActiveTabOne('location')}
                                    >
                                        Viewer Locations
                                    </div>
                                </div>
                                <select
                                    name="view"
                                    id="views"
                                    value={viewType}
                                    onChange={(e) => setViewType(e.target.value)}
                                >
                                    <option value="views">Views</option>
                                    <option value="clicks">Clicks</option>
                                    <option value="impressions">Impressions</option>
                                </select>
                            </div>
                        </div>
                        <div className="graph-placeholder">
                            {activeTabOne === 'time' && (
                                <>
                                    {/* Spline Graph chart */}
                                    <SplineChart
                                        data={analyticsData}
                                        loading={loading}
                                        viewType={viewType}
                                    />
                                </>
                            )}

                            {activeTabOne === 'location' && (
                                <>
                                    <WorldMap
                                        data={analyticsData?.geoAnalytics}
                                        loading={loading}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                    <div className="ep-card-wrapper device-analytics">
                        <div class="ep-card-header">
                            <div className="tabs">
                                <div
                                    className={`tab ${activeTabTwo === 'device' ? 'active' : ''}`}
                                    onClick={() => setActiveTabTwo('device')}
                                >
                                    Device Analytics
                                </div>
                                <div
                                    className={`tab ${activeTabTwo === 'browser' ? 'active' : ''}`}
                                    onClick={() => setActiveTabTwo('browser')}
                                >
                                    Browser Analytics
                                </div>
                            </div>
                        </div>

                        <div className="pie-placeholder">
                            {activeTabTwo === 'device' && (
                                <>
                                    <div className='button-wrapper'>
                                        <button
                                            className={`ep-btn ${deviceSubTab === 'device' ? 'primary' : ''}`}
                                            onClick={() => setDeviceSubTab('device')}
                                        >
                                            Device
                                        </button>
                                        <button
                                            className={`ep-btn ${deviceSubTab === 'resolutions' ? 'primary' : ''}`}
                                            onClick={() => setDeviceSubTab('resolutions')}
                                        >
                                            Resolutions
                                        </button>
                                    </div>
                                    {/* Pie chart */}
                                    <PieChart
                                        activeTab="device"
                                        subTab={deviceSubTab}
                                        data={analyticsData}
                                        loading={loading}
                                    />
                                </>
                            )}

                            {activeTabTwo === 'browser' && (
                                <>
                                    <div className='button-wrapper'>
                                        <button
                                            className={`ep-btn ${browserSubTab === 'browsers' ? 'primary' : ''}`}
                                            onClick={() => setBrowserSubTab('browsers')}
                                        >
                                            Browsers
                                        </button>
                                        <button
                                            className={`ep-btn ${browserSubTab === 'os' ? 'primary' : ''}`}
                                            onClick={() => setBrowserSubTab('os')}
                                        >
                                            Operating Systems
                                        </button>
                                        <button
                                            className={`ep-btn ${browserSubTab === 'devices' ? 'primary' : ''}`}
                                            onClick={() => setBrowserSubTab('devices')}
                                        >
                                            Devices
                                        </button>
                                    </div>
                                    <PieChart
                                        activeTab="browser"
                                        subTab={browserSubTab}
                                        data={analyticsData}
                                        loading={loading}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tables */}
                <div className="ep-table-wrapper">
                    <div className="ep-card-wrapper refallal-wrapper-table">
                        <div class="ep-card-header">
                            <h4>Referral Sources</h4>
                        </div>
                        <div className='tab-table-content'>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Source</th>
                                        <th>Visitors</th>
                                        <th>Total Visits</th>
                                        <th>Percentage</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analyticsData?.referralAnalytics?.referral_sources ?
                                        analyticsData.referralAnalytics.referral_sources.map((source, index) => (
                                            <tr key={index}>
                                                <td>{source.source}</td>
                                                <td>{source.visitors?.toLocaleString() || 0}</td>
                                                <td>{source.total_visits?.toLocaleString() || 0}</td>
                                                <td>{source.percentage || 0}%</td>
                                            </tr>
                                        )) :
                                        // Fallback data
                                        [
                                            { source: "YouTube", visitors: 1764, total_visits: 5373, percentage: 30 },
                                            { source: "Vimeo", visitors: 2451, total_visits: 6345, percentage: 40 },
                                            { source: "Google", visitors: 1200, total_visits: 3500, percentage: 20 },
                                            { source: "Direct", visitors: 800, total_visits: 1800, percentage: 10 }
                                        ].map((source, index) => (
                                            <tr key={index}>
                                                <td>{source.source}</td>
                                                <td>{source.visitors.toLocaleString()}</td>
                                                <td>{source.total_visits.toLocaleString()}</td>
                                                <td>{source.percentage}%</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="ep-card-wrapper analytics-wrapper-table">
                        <div class="ep-card-header">
                            <div className="tabs">
                                <div
                                    className={`tab ${activeTabThree === 'analytics' ? 'active' : ''}`}
                                    onClick={() => setActiveTabThree('analytics')}
                                >
                                    Per Embed Analytics
                                </div>
                                <div
                                    className={`tab ${activeTabThree === 'perform' ? 'active' : ''}`}
                                    onClick={() => setActiveTabThree('perform')}
                                >
                                    Top Performing Content
                                </div>
                            </div>
                        </div>

                        <div className="tab-table-content">
                            {activeTabThree === 'analytics' && (
                                <>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Content</th>
                                                <th>Type</th>
                                                <th>Unique Viewers</th>
                                                <th>Views</th>
                                                <th>Clicks</th>
                                                <th>Impressions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {analyticsData?.content?.content_analytics ?
                                                analyticsData.content.content_analytics.map((content, index) => {
                                                    console.log({ content });
                                                    return (
                                                        (
                                                            <tr key={index}>
                                                                <td>{content.title || content.content_id}</td>
                                                                <td>{content.embed_type}</td>
                                                                <td>{content.unique_viewers?.toLocaleString() || 0}</td>
                                                                <td>{content.total_views?.toLocaleString() || 0}</td>
                                                                <td>{content.total_clicks?.toLocaleString() || 0}</td>
                                                                <td>{content.total_impressions?.toLocaleString() || 0}</td>
                                                            </tr>
                                                        )
                                                    )
                                                }) :
                                                // Fallback data
                                                [
                                                    { title: "Sample Video", embed_type: "YouTube", unique_viewers: 1764, total_views: 5373, total_clicks: 5373, total_impressions: 5373 },
                                                    { title: "Demo Content", embed_type: "Vimeo", unique_viewers: 2451, total_views: 6345, total_clicks: 6345, total_impressions: 6345 },
                                                    { title: "Tutorial", embed_type: "YouTube", unique_viewers: 1200, total_views: 3500, total_clicks: 3200, total_impressions: 4000 },
                                                    { title: "Presentation", embed_type: "Google Slides", unique_viewers: 800, total_views: 2100, total_clicks: 1800, total_impressions: 2500 }
                                                ].map((content, index) => (
                                                    <tr key={index}>
                                                        <td>{content.title}</td>
                                                        <td>{content.embed_type}</td>
                                                        <td>{content.unique_viewers.toLocaleString()}</td>
                                                        <td>{content.total_views.toLocaleString()}</td>
                                                        <td>{content.total_clicks.toLocaleString()}</td>
                                                        <td>{content.total_impressions.toLocaleString()}</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </>
                            )}

                            {activeTabThree === 'perform' && (
                                <>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Title</th>
                                                <th>Platform</th>
                                                <th>Views</th>
                                                <th>Clicks</th>
                                                <th>CTR (%)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {analyticsData?.content?.top_performing ?
                                                analyticsData.content.top_performing.map((content, index) => {
                                                    const ctr = content.total_views > 0 ?
                                                        Math.round((content.total_clicks / content.total_views) * 100) : 0;
                                                    return (
                                                        <tr key={index}>
                                                            <td>{content.title || content.content_id}</td>
                                                            <td>{content.embed_type}</td>
                                                            <td>{content.total_views?.toLocaleString() || 0}</td>
                                                            <td>{content.total_clicks?.toLocaleString() || 0}</td>
                                                            <td>{ctr}%</td>
                                                        </tr>
                                                    );
                                                }) :
                                                // Fallback data
                                                [
                                                    { title: "How to Embed", embed_type: "YouTube", total_views: 8000, total_clicks: 7000 },
                                                    { title: "Vimeo Tips", embed_type: "Vimeo", total_views: 6000, total_clicks: 4500 },
                                                    { title: "Tutorial Guide", embed_type: "YouTube", total_views: 5500, total_clicks: 4200 },
                                                    { title: "Best Practices", embed_type: "Google Slides", total_views: 4000, total_clicks: 2800 }
                                                ].map((content, index) => {
                                                    const ctr = Math.round((content.total_clicks / content.total_views) * 100);
                                                    return (
                                                        <tr key={index}>
                                                            <td>{content.title}</td>
                                                            <td>{content.embed_type}</td>
                                                            <td>{content.total_views.toLocaleString()}</td>
                                                            <td>{content.total_clicks.toLocaleString()}</td>
                                                            <td>{ctr}%</td>
                                                        </tr>
                                                    );
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </>
                            )}
                        </div>
                    </div>
                </div>

            </div>

        </>
    );
}