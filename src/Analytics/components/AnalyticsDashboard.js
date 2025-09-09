import React, { useState, useEffect } from 'react';

import WorldMap from './WorldMap';
import Header from './Header';
import Overview from './Overview';
import SplineChart from './SplineChart';
import PieChart from './PieChart';
import ProOverlay from './ProOverlay';
import { AnalyticsDataProvider } from '../services/AnalyticsDataProvider';
import { differenceInDays } from 'date-fns';
import AnalyticsSkelton from './AnalyticsSkelton';
const { __ } = wp.i18n;
export default function AnalyticsDashboard() {
    const [activeTabOne, setActiveTabOne] = useState('location');
    const [activeTabTwo, setActiveTabTwo] = useState('device');
    const [activeTabThree, setActiveTabThree] = useState('analytics');
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [overviewLoading, setOverviewLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dateRange, setDateRange] = useState(30);
    const [customDateRange, setCustomDateRange] = useState(null);
    const [viewType, setViewType] = useState('all');
    const [deviceSubTab, setDeviceSubTab] = useState('device');
    const [browserSubTab, setBrowserSubTab] = useState('browsers');
    const [contentTypeFilter, setContentTypeFilter] = useState('all');

    // Check if pro is active
    const isProActive = window.embedpressAnalyticsData?.isProActive || false;

    // Dummy data for when pro is not active
    const dummyAnalyticsData = {
        referralAnalytics: {
            referral_sources: [
                { source: 'Google', visitors: 1764, total_visits: 5373, percentage: 45 },
                { source: 'Facebook', visitors: 987, total_visits: 2451, percentage: 28 },
                { source: 'Twitter', visitors: 654, total_visits: 1876, percentage: 18 },
                { source: 'Direct', visitors: 432, total_visits: 987, percentage: 9 }
            ]
        },
        content: {
            content_analytics: [
                { title: 'YouTube Video Tutorial', content_id: 'yt_123', embed_type: 'YouTube', total_views: 1764, total_clicks: 5373, total_impressions: 8456 },
                { title: 'Vimeo Product Demo', content_id: 'vm_456', embed_type: 'Vimeo', total_views: 2451, total_clicks: 6345, total_impressions: 9876 },
                { title: 'Google Maps Location', content_id: 'gm_789', embed_type: 'Google Maps', total_views: 1876, total_clicks: 4567, total_impressions: 7654 },
                { title: 'PDF Document', content_id: 'pdf_012', embed_type: 'PDF', total_views: 1234, total_clicks: 3456, total_impressions: 5678 }
            ],
            top_performing: [
                { title: 'YouTube Video Tutorial', content_id: 'yt_123', embed_type: 'YouTube', total_views: 1764, total_clicks: 5373 },
                { title: 'Vimeo Product Demo', content_id: 'vm_456', embed_type: 'Vimeo', total_views: 2451, total_clicks: 6345 },
                { title: 'Google Maps Location', content_id: 'gm_789', embed_type: 'Google Maps', total_views: 1876, total_clicks: 4567 },
                { title: 'PDF Document', content_id: 'pdf_012', embed_type: 'PDF', total_views: 1234, total_clicks: 3456 }
            ]
        }
    };

    // Use dummy data when pro is not active
    const displayAnalyticsData = isProActive ? analyticsData : dummyAnalyticsData;

    useEffect(() => {
        loadAnalyticsData();
    }, [dateRange, customDateRange]);

    // Separate effect for content type filter changes - only update overview
    useEffect(() => {
        if (analyticsData) {
            loadOverviewData();
        }
    }, [contentTypeFilter]);

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
                data = await AnalyticsDataProvider.getAllAnalyticsData(
                    dateRange,
                    customDateRange.startDate,
                    customDateRange.endDate,
                    filters
                );
            } else {
                data = await AnalyticsDataProvider.getAllAnalyticsData(dateRange, null, null, filters);
            }

            setAnalyticsData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const loadOverviewData = async () => {
        try {
            setOverviewLoading(true);

            // Prepare filters object
            const filters = {
                content_type: contentTypeFilter
            };

            let overviewData;
            // Use custom date range if available, otherwise use preset range
            if (customDateRange && customDateRange.startDate && customDateRange.endDate) {
                overviewData = await AnalyticsDataProvider.getOverviewData(
                    dateRange,
                    customDateRange.startDate,
                    customDateRange.endDate,
                    filters
                );
            } else {
                overviewData = await AnalyticsDataProvider.getOverviewData(dateRange, null, null, filters);
            }

            // Update only the overview part of analytics data
            setAnalyticsData(prevData => ({
                ...prevData,
                overview: overviewData
            }));
        } catch (error) {
            setError(error.message);
        } finally {
            setOverviewLoading(false);
        }
    };

    const handleDateRangeChange = (range) => {
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

    const handleExport = async (format) => {
        try {
            // Don't set loading state to avoid page refresh
            // Call the export API
            const response = await AnalyticsDataProvider.exportData(format, dateRange);

            if (response && response.success) {
                // Check if this is a frontend export (PDF)
                if (response.frontend_export && response.export_type === 'pdf') {
                    // Handle frontend PDF generation from HTML
                    generatePDFFromHTML(response.html_content, response.filename);
                } else if (response.download_url) {
                    // Handle backend-generated files (CSV, Excel)
                    const link = document.createElement('a');
                    link.href = response.download_url;
                    link.download = response.filename || `embedpress-analytics-${format}-${new Date().toISOString().split('T')[0]}.${format}`;
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } else {
                    alert('Export failed. Please try again.');
                }
            } else {
                alert('Export failed. Please try again.');
            }
        } catch (error) {
            alert('Export failed: ' + error.message);
        }
    };

    /**
     * Generate PDF from HTML content using browser's print functionality
     */
    const generatePDFFromHTML = (htmlContent, filename) => {
        // Create a new window with the HTML content
        const printWindow = window.open('', '_blank');
        printWindow.document.write(htmlContent);
        printWindow.document.close();

        // Wait for content to load, then trigger print
        printWindow.onload = () => {
            printWindow.print();
            // Close the window after printing
            setTimeout(() => {
                printWindow.close();
            }, 1000);
        };
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
                // Reload analytics data to get fresh counts
                loadAnalyticsData();
            }
        } catch (error) {
            // Handle error silently
        }
    };

    return (
        <>

            <div className="ep-analytics-dashboard">

                {/* Heading */}
                <Header
                    onDateRangeChange={handleDateRangeChange}
                    onExport={handleExport}
                    onRefreshCache={handleRefreshCache}
                />

                {/* Loading State */}
                {loading ? (
                    <AnalyticsSkelton />
                ) : (
                    <>
                        {/* Overview Cards */}
                        <Overview
                            data={analyticsData}
                            loading={overviewLoading}
                            contentTypeFilter={contentTypeFilter}
                            onFilterChange={(type, value) => {
                                if (type === 'content_type') {
                                    setContentTypeFilter(value);
                                }
                            }}
                        />

                        {/* Graps Analytics */}
                        <div className="ep-main-graphs">
                            <div className="ep-card-wrapper views-chart">
                                <div className="graph-placeholder">
                                    <div className="ep-card-header">
                                        <div className="tab-header-wrapper">
                                            <div className="tabs">
                                                <div
                                                    className={`tab ${activeTabOne === 'location' ? 'active' : ''}`}
                                                    onClick={() => setActiveTabOne('location')}
                                                >
                                                    {__('Viewer Locations', 'embedpress')}
                                                </div>

                                                <div
                                                    className={`tab ${activeTabOne === 'time' ? 'active' : ''}`}
                                                    onClick={() => setActiveTabOne('time')}
                                                >
                                                    {__('Views Over Time', 'embedpress')}
                                                </div>
                                            </div>
                                            <select
                                                name="view"
                                                id="views"
                                                value={viewType}
                                                onChange={(e) => setViewType(e.target.value)}
                                            >
                                                <option value="all">{__('Overview', 'embedpress')}</option>
                                                <option value="views">{__('Views', 'embedpress')}</option>
                                                <option value="clicks">{__('Clicks', 'embedpress')}</option>
                                                <option value="impressions">{__('Impressions', 'embedpress')}</option>
                                            </select>
                                        </div>
                                    </div>
                                    <ProOverlay showOverlay={!isProActive}>
                                        {activeTabOne === 'time' && (
                                            <SplineChart
                                                data={analyticsData}
                                                loading={loading}
                                                viewType={viewType}
                                            />
                                        )}

                                        {activeTabOne === 'location' && (
                                            <WorldMap
                                                data={analyticsData?.geoAnalytics}
                                                loading={loading}
                                                viewType={viewType}
                                            />
                                        )}
                                    </ProOverlay>
                                </div>

                            </div>
                            <div className="ep-card-wrapper device-analytics">
                                <div className="ep-card-header">
                                    <div className="tabs">
                                        <div
                                            className={`tab ${activeTabTwo === 'device' ? 'active' : ''}`}
                                            onClick={() => setActiveTabTwo('device')}
                                        >
                                            {__('Device Analytics', 'embedpress')}
                                        </div>
                                        <div
                                            className={`tab ${activeTabTwo === 'browser' ? 'active' : ''}`}
                                            onClick={() => setActiveTabTwo('browser')}
                                        >
                                            {__('Browser Analytics', 'embedpress')}
                                        </div>
                                    </div>
                                </div>

                                <ProOverlay showOverlay={!isProActive}>
                                    <div className="pie-placeholder">
                                        {activeTabTwo === 'device' && (
                                            <>
                                                <div className='button-wrapper'>
                                                    <button
                                                        className={`ep-btn ${deviceSubTab === 'device' ? 'primary' : ''}`}
                                                        onClick={() => setDeviceSubTab('device')}
                                                    >
                                                        {__('Device', 'embedpress')}
                                                    </button>
                                                    <button
                                                        className={`ep-btn ${deviceSubTab === 'resolutions' ? 'primary' : ''}`}
                                                        onClick={() => setDeviceSubTab('resolutions')}
                                                    >
                                                        {__('Resolutions', 'embedpress')}
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
                                                        {__('Browsers', 'embedpress')}
                                                    </button>
                                                    <button
                                                        className={`ep-btn ${browserSubTab === 'os' ? 'primary' : ''}`}
                                                        onClick={() => setBrowserSubTab('os')}
                                                    >
                                                        {__('Operating Systems', 'embedpress')}
                                                    </button>
                                                    <button
                                                        className={`ep-btn ${browserSubTab === 'devices' ? 'primary' : ''}`}
                                                        onClick={() => setBrowserSubTab('devices')}
                                                    >
                                                        {__('Devices', 'embedpress')}
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
                                </ProOverlay>
                            </div>
                        </div>
                        {/* Tables */}
                        <div className="ep-table-wrapper">
                            <div className="ep-card-wrapper refallal-wrapper-table">
                                <div className="ep-card-header">
                                    <h4>{__('UTM Traffic Source', 'embedpress')}</h4>
                                </div>
                                <ProOverlay showOverlay={!isProActive}>
                                    <div className='tab-table-content'>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>{__('Traffic Source', 'embedpress')}</th>
                                                    <th>{__('Clicks', 'embedpress')}</th>
                                                    <th>{__('Views', 'embedpress')}</th>
                                                    <th>{__('CTR', 'embedpress')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {displayAnalyticsData?.referralAnalytics?.referral_sources ?
                                                    displayAnalyticsData.referralAnalytics.referral_sources.map((source, index) => (
                                                        <tr key={index}>
                                                            <td>{source.source}</td>
                                                            <td>{source.visitors?.toLocaleString() || 0}</td>
                                                            <td>{source.total_visits?.toLocaleString() || 0}</td>
                                                            <td>{source.percentage || 0}%</td>
                                                        </tr>
                                                    )) :
                                                    <tr>
                                                        <td colSpan="4" className="no-data-message">
                                                            {loading ? __('Loading referral analytics...', 'embedpress') : __('No referral analytics data available', 'embedpress')}
                                                        </td>
                                                    </tr>
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </ProOverlay>
                            </div>

                            <div className="ep-card-wrapper analytics-wrapper-table">
                                <div className="ep-card-header">
                                    <div className="tabs">
                                        <div
                                            className={`tab ${activeTabThree === 'analytics' ? 'active' : ''}`}
                                            onClick={() => setActiveTabThree('analytics')}
                                        >
                                            {__('Per Embed Analytics', 'embedpress')}
                                        </div>
                                        <div
                                            className={`tab ${activeTabThree === 'perform' ? 'active' : ''}`}
                                            onClick={() => setActiveTabThree('perform')}
                                        >
                                            {__('Top Performing Content', 'embedpress')}
                                        </div>
                                    </div>
                                </div>

                                <ProOverlay showOverlay={!isProActive}>
                                    <div className="tab-table-content">
                                        {activeTabThree === 'analytics' && (
                                            <>
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>{__('Page Title', 'embedpress')}</th>
                                                            <th>{__('Source', 'embedpress')}</th>
                                                            <th>{__('Views', 'embedpress')}</th>
                                                            <th>{__('Clicks', 'embedpress')}</th>
                                                            <th>{__('Impressions', 'embedpress')}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {displayAnalyticsData?.content?.content_analytics && displayAnalyticsData.content.content_analytics.length > 0 ?
                                                            displayAnalyticsData.content.content_analytics.map((content, index) => {
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
                                                                    {loading ? __('Loading content analytics...', 'embedpress') : __('No content analytics data available', 'embedpress')}
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
                                                            <th>{__('Page Title', 'embedpress')}</th>
                                                            <th>{__('Source', 'embedpress')}</th>
                                                            <th>{__('Views', 'embedpress')}</th>
                                                            <th>{__('Clicks', 'embedpress')}</th>
                                                            <th>{__('CTR (%)', 'embedpress')}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {displayAnalyticsData?.content?.top_performing ?
                                                            displayAnalyticsData.content.top_performing.map((content, index) => {
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
                                                                    {loading ? __('Loading views analytics...', 'embedpress') : __('No views analytics data available', 'embedpress')}
                                                                </td>
                                                            </tr>
                                                        }
                                                    </tbody>
                                                </table>
                                            </>
                                        )}
                                    </div>
                                </ProOverlay>
                            </div>
                        </div>
                    </>
                )}

                {/* Error State */}
                {error && (
                    <div className="ep-error-state">
                        <p>{__('Error loading analytics:', 'embedpress')} {error}</p>
                        <button onClick={loadAnalyticsData}>{__('Retry', 'embedpress')}</button>
                    </div>
                )}


            </div>

        </>
    );
}