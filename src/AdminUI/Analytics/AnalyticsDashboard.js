import React, { useState } from 'react';
import Example from './Example';
import viewerImg from './img/viewer.png';
import AnalyticsImgOne from './img/analytics-one.png';
import AnalyticsImgTwo from './img/analytics-two.png';

export default function AnalyticsDashboard () {
  const [activeTabOne, setActiveTabOne] = useState('time');
  const [activeTabTwo, setActiveTabTwo] = useState('device');
  const [activeTabThree, setActiveTabThree] = useState('analytics');

  return (
    <>

        <div className="ep-analytics-dashboard">
            <div className='ep-header-wrapper'>
                <div className='header-content'>
                    <h3 className="dashboard-title">EmbedPress Analytics</h3>
                    <p>Comprehensive insights into your embedded content performace</p>
                </div>
                <div className='header-info'>
                    <div className='button-wrapper'>
                        <button>btn 1</button>
                        <button>btn 1</button>
                        <button>btn 1</button>
                    </div>
                </div>
            </div>

            {/* Overview Cards */}
            <div className='ep-card-wrapper overview-wrapper'>
                <div className='ep-card-header'>
                    <h4>Analytics Overview</h4>
                    <select name="overview" id="overview">
                        <option>Elementor</option>
                        <option>Gutenbarg</option>
                        <option>Others</option>
                    </select>
                </div>
                <div className="ep-overview-cards">
                    <div className="ep-card">
                        <div className='card-top'>
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="36" height="36" rx="8" fill="#5B4E96"/>
                                <path d="M13.8336 14.6665L10.5 18.0001L13.8336 21.3337" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M22.168 14.6665L25.5016 18.0001L22.168 21.3337" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M19.6676 11.3342L16.334 24.6685" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <h5 className="card-title">Total Embeds</h5>
                        </div>
                        <h2>100k</h2>
                        <p className="card-sub">
                            <svg className='up-icon' width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_2054_4270)">
                                <path d="M2 11.8327L6 7.83268L8.66667 10.4993L14 5.16602" stroke="#0E9F6E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M9.33203 5.16602H13.9987V9.83268" stroke="#0E9F6E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </g>
                                <defs>
                                <clipPath id="clip0_2054_4270">
                                <rect width="16" height="16" fill="white" transform="translate(0 0.5)"/>
                                </clipPath>
                                </defs>
                            </svg>
                            <span className='up'>20%</span> 
                            vs last month
                        </p>
                    </div>
                    <div className="ep-card">
                        <div className='card-top'>
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="36" height="36" rx="8" fill="#FF7552"/>
                                <g clip-path="url(#clip0_2054_3763)">
                                <path d="M16.334 18.0007C16.334 18.4427 16.5096 18.8666 16.8221 19.1792C17.1347 19.4917 17.5586 19.6673 18.0007 19.6673C18.4427 19.6673 18.8666 19.4917 19.1792 19.1792C19.4917 18.8666 19.6673 18.4427 19.6673 18.0007C19.6673 17.5586 19.4917 17.1347 19.1792 16.8221C18.8666 16.5096 18.4427 16.334 18.0007 16.334C17.5586 16.334 17.1347 16.5096 16.8221 16.8221C16.5096 17.1347 16.334 17.5586 16.334 18.0007Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M25.5 18C23.5 21.3333 21 23 18 23C15 23 12.5 21.3333 10.5 18C12.5 14.6667 15 13 18 13C21 13 23.5 14.6667 25.5 18Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </g>
                                <defs>
                                <clipPath id="clip0_2054_3763">
                                <rect width="20" height="20" fill="white" transform="translate(8 8)"/>
                                </clipPath>
                                </defs>
                            </svg>
                            <h5 className="card-title">Total Views</h5>
                        </div>
                        <h2>100k</h2>
                        <p className="card-sub">
                            <svg className='down-icon' width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_2054_4921)">
                                <path d="M2 5.16602L6 9.16602L8.66667 6.49935L14 11.8327" stroke="#F05252" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M13.9987 7.16602V11.8327H9.33203" stroke="#F05252" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </g>
                                <defs>
                                <clipPath id="clip0_2054_4921">
                                <rect width="16" height="16" fill="white" transform="translate(0 0.5)"/>
                                </clipPath>
                                </defs>
                            </svg>
                            <span className='down'>20%</span> 
                            vs last month
                        </p>
                    </div>
                    <div className="ep-card">
                        <div className='card-top'>
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="36" height="36" rx="8" fill="#FEAF30"/>
                                <g clip-path="url(#clip0_2054_310)">
                                <path d="M11.334 21.334C11.334 21.6623 11.3986 21.9874 11.5243 22.2907C11.6499 22.594 11.8341 22.8696 12.0662 23.1018C12.2984 23.3339 12.574 23.518 12.8773 23.6437C13.1806 23.7693 13.5057 23.834 13.834 23.834C14.1623 23.834 14.4874 23.7693 14.7907 23.6437C15.094 23.518 15.3696 23.3339 15.6018 23.1018C15.8339 22.8696 16.018 22.594 16.1437 22.2907C16.2693 21.9874 16.334 21.6623 16.334 21.334C16.334 21.0057 16.2693 20.6806 16.1437 20.3773C16.018 20.074 15.8339 19.7984 15.6018 19.5662C15.3696 19.3341 15.094 19.1499 14.7907 19.0243C14.4874 18.8986 14.1623 18.834 13.834 18.834C13.5057 18.834 13.1806 18.8986 12.8773 19.0243C12.574 19.1499 12.2984 19.3341 12.0662 19.5662C11.8341 19.7984 11.6499 20.074 11.5243 20.3773C11.3986 20.6806 11.334 21.0057 11.334 21.334Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M19.666 21.334C19.666 21.997 19.9294 22.6329 20.3982 23.1018C20.8671 23.5706 21.503 23.834 22.166 23.834C22.8291 23.834 23.4649 23.5706 23.9338 23.1018C24.4026 22.6329 24.666 21.997 24.666 21.334C24.666 20.6709 24.4026 20.0351 23.9338 19.5662C23.4649 19.0974 22.8291 18.834 22.166 18.834C21.503 18.834 20.8671 19.0974 20.3982 19.5662C19.9294 20.0351 19.666 20.6709 19.666 21.334Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M21.6214 15.642L21.0139 14.5911C20.8805 14.3845 20.1339 14.422 20.083 14.667L19.9355 15.817" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M24.4668 20.3442L22.1002 16.0667C21.9427 15.8083 21.6068 15.5 20.916 15.5C20.226 15.5 19.666 15.8733 19.666 16.3333V21.3333" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M14.3789 15.6423L14.9864 14.5915C15.1197 14.384 15.8664 14.4223 15.9172 14.6673L16.0647 15.8173" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M11.5332 20.3442L13.8999 16.0667C14.0574 15.8083 14.3932 15.5 15.084 15.5C15.774 15.5 16.334 15.8733 16.334 16.3333V21.3333" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M19.6673 18H16.334V19.6667H19.6673V18Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </g>
                                <defs>
                                <clipPath id="clip0_2054_310">
                                <rect width="20" height="20" fill="white" transform="translate(8 8)"/>
                                </clipPath>
                                </defs>
                            </svg>
                            <h5 className="card-title">Unique Views</h5>
                        </div>
                        <h2>100k</h2>
                        <p className="card-sub">
                            <svg className='down-icon' width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_2054_4921)">
                                <path d="M2 5.16602L6 9.16602L8.66667 6.49935L14 11.8327" stroke="#F05252" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M13.9987 7.16602V11.8327H9.33203" stroke="#F05252" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </g>
                                <defs>
                                <clipPath id="clip0_2054_4921">
                                <rect width="16" height="16" fill="white" transform="translate(0 0.5)"/>
                                </clipPath>
                                </defs>
                            </svg>
                            <span className='down'>25%</span> 
                            vs last month
                        </p>
                    </div>
                    <div className="ep-card">
                        <div className='card-top'>
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="36" height="36" rx="8" fill="#3675FE"/>
                                <g clip-path="url(#clip0_2054_1778)">
                                <path d="M14.666 18.8333V11.75C14.666 11.4185 14.7977 11.1005 15.0321 10.8661C15.2666 10.6317 15.5845 10.5 15.916 10.5C16.2475 10.5 16.5655 10.6317 16.7999 10.8661C17.0343 11.1005 17.166 11.4185 17.166 11.75V18" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M17.166 17.5834V15.9167C17.166 15.7526 17.1983 15.5901 17.2612 15.4384C17.324 15.2867 17.4161 15.1489 17.5321 15.0329C17.6482 14.9168 17.786 14.8247 17.9377 14.7619C18.0893 14.6991 18.2519 14.6667 18.416 14.6667C18.5802 14.6667 18.7427 14.6991 18.8944 14.7619C19.046 14.8247 19.1838 14.9168 19.2999 15.0329C19.416 15.1489 19.508 15.2867 19.5709 15.4384C19.6337 15.5901 19.666 15.7526 19.666 15.9167V18.0001" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M19.666 16.75C19.666 16.4185 19.7977 16.1005 20.0321 15.8661C20.2666 15.6317 20.5845 15.5 20.916 15.5C21.2475 15.5 21.5655 15.6317 21.7999 15.8661C22.0343 16.1005 22.166 16.4185 22.166 16.75V18" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M22.1658 17.5833C22.1658 17.2517 22.2975 16.9338 22.532 16.6994C22.7664 16.4649 23.0843 16.3333 23.4158 16.3333C23.7474 16.3333 24.0653 16.4649 24.2997 16.6994C24.5341 16.9338 24.6658 17.2517 24.6658 17.5833V21.3333C24.6658 22.6593 24.1391 23.9311 23.2014 24.8688C22.2637 25.8065 20.9919 26.3333 19.6658 26.3333H17.9992H18.1725C17.3445 26.3334 16.5293 26.1279 15.8003 25.7352C15.0713 25.3424 14.4513 24.7748 13.9958 24.0833C13.9412 24.0001 13.8867 23.9167 13.8325 23.8333C13.5725 23.4341 12.66 21.8433 11.0942 19.0599C10.9346 18.7762 10.8919 18.4414 10.9753 18.1267C11.0587 17.812 11.2616 17.5423 11.5408 17.3749C11.8382 17.1965 12.1867 17.1225 12.531 17.1648C12.8752 17.2071 13.1955 17.3631 13.4408 17.6083L14.6658 18.8333" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </g>
                                <defs>
                                <clipPath id="clip0_2054_1778">
                                <rect width="20" height="20" fill="white" transform="translate(8 8)"/>
                                </clipPath>
                                </defs>
                            </svg>
                            <h5 className="card-title">Total Clicks</h5>
                        </div>
                        <h2>100k</h2>
                        <p className="card-sub">
                            <svg className='up-icon' width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_2054_4270)">
                                <path d="M2 11.8327L6 7.83268L8.66667 10.4993L14 5.16602" stroke="#0E9F6E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M9.33203 5.16602H13.9987V9.83268" stroke="#0E9F6E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </g>
                                <defs>
                                <clipPath id="clip0_2054_4270">
                                <rect width="16" height="16" fill="white" transform="translate(0 0.5)"/>
                                </clipPath>
                                </defs>
                            </svg>
                            <span className='up'>80%</span> 
                            vs last month
                        </p>
                    </div>
                    <div className="ep-card">
                        <div className='card-top'>
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="36" height="36" rx="8" fill="#6136FE"/>
                                <g clip-path="url(#clip0_2054_4412)">
                                <path d="M10.5 10.5V25.5H25.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M24.666 23V25.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M21.334 21.334V25.5007" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M18 18.834V25.5007" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M14.666 21.334V25.5007" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M10.5 17.1667C15.5 17.1667 14.6667 13 18 13C21.3333 13 20.5 17.1667 25.5 17.1667" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </g>
                                <defs>
                                <clipPath id="clip0_2054_4412">
                                <rect width="20" height="20" fill="white" transform="translate(8 8)"/>
                                </clipPath>
                                </defs>
                            </svg>
                            <h5 className="card-title">Total Impressions</h5>
                        </div>
                        <h2>100k</h2>
                        <p className="card-sub">
                            <svg className='up-icon' width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_2054_4270)">
                                <path d="M2 11.8327L6 7.83268L8.66667 10.4993L14 5.16602" stroke="#0E9F6E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M9.33203 5.16602H13.9987V9.83268" stroke="#0E9F6E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </g>
                                <defs>
                                <clipPath id="clip0_2054_4270">
                                <rect width="16" height="16" fill="white" transform="translate(0 0.5)"/>
                                </clipPath>
                                </defs>
                            </svg>
                            <span className='up'>80%</span> 
                            vs last month
                        </p>
                    </div>
                </div>
            </div>

            {/* views & Device Analytics */}
            <div className="main-graphs">
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
                                <option>Views one</option>
                                <option>Views two</option>
                            </select>
                        </div>
                    </div>
                    <div className="graph-placeholder">
                        {activeTabOne === 'time' && (
                            <>
                                <img src={viewerImg} alt="img" />
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
                                    <button>btn 1</button>
                                    <button>btn 2</button>
                                </div>
                                <img src={AnalyticsImgOne} alt="img" />
                            </>
                        )}

                        {activeTabTwo === 'browser' && (
                            <>
                                <img src={AnalyticsImgTwo} alt="img" />
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Tables */}
            <div className="table-wrapper">
                <div className="ep-card-wrapper refallal-wrapper-table">
                    <div class="ep-card-header">
                        <h4>Referral Sources</h4>
                    </div>
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
                        </tbody>
                    </table>
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
                            <div className="table-content-wrapper">
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
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTabThree === 'perform' && (
                            <div className="table-content-wrapper">
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
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>

    </>
  );
}