import React, { useState } from 'react';
import Example from './Example';
import Header from './Header';
import Overview from './Overview';
import SplineChart from '../components/SplineChart';
import PieChart from '../components/PieChart';

export default function AnalyticsDashboard () {
  const [activeTabOne, setActiveTabOne] = useState('time');
  const [activeTabTwo, setActiveTabTwo] = useState('device');
  const [activeTabThree, setActiveTabThree] = useState('analytics');

  return (
    <>

        <div className="ep-analytics-dashboard">

            {/* Heading */}
            <Header />

            {/* Overview Cards */}
            <Overview />

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
                            <select name="view" id="views">
                                <option>Views</option>
                                <option>Views 1</option>
                                <option>Views 2</option>
                            </select>
                        </div>
                    </div>
                    <div className="graph-placeholder">
                        {activeTabOne === 'time' && (
                            <>
                            {/* Spline Graph chart */}
                                <SplineChart />
                            </>
                        )}

                        {activeTabOne === 'location' && (
                            <>
                                <Example />
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
                                    <button className='ep-btn primary'>Device</button>
                                    <button className='ep-btn'>Resolutions</button>
                                </div>
                                {/* Pie chart */}
                                <PieChart activeTab="device" />
                            </>
                        )}

                        {activeTabTwo === 'browser' && (
                            <>
                                <div className='button-wrapper'>
                                    <button className='ep-btn primary'>Browsers</button>
                                    <button className='ep-btn'>Operating systems</button>
                                    <button className='ep-btn'>Devices</button>
                                </div>
                                <PieChart activeTab="browser" />
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
                                <tr>
                                    <td>YouTube</td>
                                    <td>1764</td>
                                    <td>5373</td>
                                    <td>30%</td>
                                </tr>
                                <tr>
                                    <td>Vimeo</td>
                                    <td>2451</td>
                                    <td>6345</td>
                                    <td>40%</td>
                                </tr>
                                <tr>
                                    <td>YouTube</td>
                                    <td>1764</td>
                                    <td>5373</td>
                                    <td>30%</td>
                                </tr>
                                <tr>
                                    <td>Vimeo</td>
                                    <td>2451</td>
                                    <td>6345</td>
                                    <td>40%</td>
                                </tr>
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
                                        <tr>
                                            <td>Test</td>
                                            <td>YouTube</td>
                                            <td>1764</td>
                                            <td>5373</td>
                                            <td>5373</td>
                                            <td>5373</td>
                                        </tr>
                                        <tr>
                                            <td>Example</td>
                                            <td>Vimeo</td>
                                            <td>2451</td>
                                            <td>6345</td>
                                            <td>6345</td>
                                            <td>6345</td>
                                        </tr>
                                        <tr>
                                            <td>Test</td>
                                            <td>YouTube</td>
                                            <td>1764</td>
                                            <td>5373</td>
                                            <td>5373</td>
                                            <td>5373</td>
                                        </tr>
                                        <tr>
                                            <td>Example</td>
                                            <td>Vimeo</td>
                                            <td>2451</td>
                                            <td>6345</td>
                                            <td>6345</td>
                                            <td>6345</td>
                                        </tr>
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
                                        <tr>
                                            <td>How to Embed</td>
                                            <td>YouTube</td>
                                            <td>8000</td>
                                            <td>7000</td>
                                            <td>87%</td>
                                        </tr>
                                        <tr>
                                            <td>Vimeo Tips</td>
                                            <td>Vimeo</td>
                                            <td>6000</td>
                                            <td>4500</td>
                                            <td>75%</td>
                                        </tr>
                                        <tr>
                                            <td>How to Embed</td>
                                            <td>YouTube</td>
                                            <td>8000</td>
                                            <td>7000</td>
                                            <td>87%</td>
                                        </tr>
                                        <tr>
                                            <td>Vimeo Tips</td>
                                            <td>Vimeo</td>
                                            <td>6000</td>
                                            <td>4500</td>
                                            <td>75%</td>
                                        </tr>
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