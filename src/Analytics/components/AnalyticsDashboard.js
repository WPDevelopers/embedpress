import React, { useState, useEffect } from 'react';
import WorldMap from './WorldMap';
import Header from './Header';
import Overview from './Overview';
import SplineChart from './SplineChart';
import PieChart from './PieChart';
import ProOverlay from './ProOverlay';
import { AnalyticsDataProvider } from '../services/AnalyticsDataProvider';
import { differenceInDays } from 'date-fns';

export default function AnalyticsDashboard() {
    const [activeTabOne, setActiveTabOne] = useState('location');
    const [activeTabTwo, setActiveTabTwo] = useState('device');
    const [activeTabThree, setActiveTabThree] = useState('analytics');
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateRange, setDateRange] = useState(30);
    const [customDateRange, setCustomDateRange] = useState(null);
    const [viewType, setViewType] = useState('all');
    const [deviceSubTab, setDeviceSubTab] = useState('device');
    const [browserSubTab, setBrowserSubTab] = useState('browsers');
    const [contentTypeFilter, setContentTypeFilter] = useState('all');

    useEffect(() => {
        loadAnalyticsData();
    }, [dateRange, customDateRange, contentTypeFilter]);

    const loadAnalyticsData = async () => {
        try {
            setLoading(true);
            setError(null);

            let data;
            // Prepare filters object
            const filters = {
                content_type: contentTypeFilter
            };

            // Use custom date range if available, otherwise use preset range
            if (customDateRange && customDateRange.startDate && customDateRange.endDate) {
                console.log('Loading analytics with custom date range:', customDateRange, 'and filters:', filters);
                data = await AnalyticsDataProvider.getAllAnalyticsData(
                    dateRange,
                    customDateRange.startDate,
                    customDateRange.endDate,
                    filters
                );
            } else {
                console.log('Loading analytics with preset date range:', dateRange, 'and filters:', filters);
                data = await AnalyticsDataProvider.getAllAnalyticsData(dateRange, null, null, filters);
            }

            console.log('Analytics data loaded in dashboard:', data);
            setAnalyticsData(data);
        } catch (err) {
            setError(err.message);
            console.error('Failed to load analytics data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDateRangeChange = (range) => {
        console.log('Date range changed:', range);
        setCustomDateRange(range);

        // Convert preset labels to day ranges for fallback
        const presetRanges = {
            'Today': 1,
            'Yesterday': 1,
            'Last week': 7,
            'Last month': 30,
            'Last quarter': 90
        };

        if (presetRanges[range.label]) {
            setDateRange(presetRanges[range.label]);
        } else if (range.startDate && range.endDate) {
            // For custom ranges, calculate the difference
            const days = differenceInDays(range.endDate, range.startDate);
            setDateRange(Math.max(1, days)); // Ensure at least 1 day
        } else {
            // Fallback to 30 days if no valid range
            setDateRange(30);
        }
    };

    const handleExportPDF = () => {
        console.log('Export PDF clicked');
        // TODO: Implement PDF export functionality
    };

    const handleRefreshCache = async () => {
        try {
            const response = await fetch(embedpressAnalyticsData.ajaxUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    action: 'embedpress_clear_content_cache',
                    nonce: embedpressAnalyticsData.cacheNonce
                })
            });

            const result = await response.json();

            if (result.success) {
                console.log('Cache cleared successfully');
                // Reload analytics data to get fresh counts
                loadAnalyticsData();
            } else {
                console.error('Failed to clear cache:', result.data);
            }
        } catch (error) {
            console.error('Error clearing cache:', error);
        }
    };

    return (
        <>

            <div className="ep-analytics-dashboard">

                {/* Heading */}
                <Header
                    onDateRangeChange={handleDateRangeChange}
                    onExportPDF={handleExportPDF}
                    onRefreshCache={handleRefreshCache}
                />

                {/* Loading State */}
                {loading ? (
                    <div className="ep-loading-state">
                        <p>Loading analytics data...</p>
                    </div>
                ) : (
                    <>
                        {/* Overview Cards */}
                        <Overview
                            data={analyticsData}
                            loading={loading}
                            contentTypeFilter={contentTypeFilter}
                            onFilterChange={(type, value) => {
                                console.log('Filter changed:', type, value);
                                if (type === 'content_type') {
                                    setContentTypeFilter(value);
                                }
                            }}
                        />

                        {/* Graps Analytics */}
                        <div className="ep-main-graphs">
                            <div className="ep-card-wrapper views-chart">
                                <div class="ep-card-header">
                                    <div className="tab-header-wrapper">
                                        <div className="tabs">
                                            <div
                                                className={`tab ${activeTabOne === 'location' ? 'active' : ''}`}
                                                onClick={() => setActiveTabOne('location')}
                                            >
                                                Viewer Locations
                                            </div>

                                            <div
                                                className={`tab ${activeTabOne === 'time' ? 'active' : ''}`}
                                                onClick={() => setActiveTabOne('time')}
                                            >
                                                Views Over Time
                                            </div>
                                        </div>
                                        <select
                                            name="view"
                                            id="views"
                                            value={viewType}
                                            onChange={(e) => setViewType(e.target.value)}
                                        >
                                            <option value="all">Overview</option>
                                            <option value="views">Views</option>
                                            <option value="clicks">Clicks</option>
                                            <option value="impressions">Impressions</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="graph-placeholder">
                                    {activeTabOne === 'time' && (
                                        <ProOverlay showOverlay={activeTabOne === 'time'}>
                                            {/* Spline Graph chart */}
                                            <SplineChart
                                                data={analyticsData}
                                                loading={loading}
                                                viewType={viewType}
                                            />
                                        </ProOverlay>
                                    )}

                                    {activeTabOne === 'location' && (
                                        <ProOverlay showOverlay={activeTabOne === 'location'}>
                                            <WorldMap
                                                data={analyticsData?.geoAnalytics}
                                                loading={loading}
                                                viewType={viewType}
                                            />
                                        </ProOverlay>
                                    )}
                                </div>
                            </div>
                            <ProOverlay>
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
                            </ProOverlay>
                        </div>

                        {/* Tables */}
                        <div className="ep-table-wrapper">
                            <ProOverlay>
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
                                                    <tr>
                                                        <td colSpan="4" className="no-data-message">
                                                            {loading ? 'Loading referral analytics...' : 'No referral analytics data available'}
                                                        </td>
                                                    </tr>
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </ProOverlay>

                            <ProOverlay>
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
                                                            <th>Platform</th>
                                                            <th>Views</th>
                                                            <th>Clicks</th>
                                                            <th>Impressions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {analyticsData?.content?.content_analytics && analyticsData.content.content_analytics.length > 0 ?
                                                            analyticsData.content.content_analytics.map((content, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td>{content.title || content.content_id}</td>
                                                                        <td>{content.embed_type}</td>
                                                                        <td>{content.total_views?.toLocaleString() || 0}</td>
                                                                        <td>{content.total_clicks?.toLocaleString() || 0}</td>
                                                                        <td>{content.total_impressions?.toLocaleString() || 0}</td>
                                                                    </tr>
                                                                )
                                                            }) :
                                                            <tr>
                                                                <td colSpan="5" className="no-data-message">
                                                                    {loading ? 'Loading content analytics...' : 'No content analytics data available'}
                                                                </td>
                                                            </tr>
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
                                                            <tr>
                                                                <td colSpan="5" className="no-data-message">
                                                                    {loading ? 'Loading views analytics...' : 'No views analytics data available'}
                                                                </td>
                                                            </tr>
                                                        }
                                                    </tbody>
                                                </table>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </ProOverlay>
                        </div>
                    </>
                )}

                {/* Error State */}
                {error && (
                    <div className="ep-error-state">
                        <p>Error loading analytics: {error}</p>
                        <button onClick={loadAnalyticsData}>Retry</button>
                    </div>
                )}


            </div>

        </>
    );
}