import React, { useState, useRef, useEffect } from 'react';

const { __ } = wp.i18n;

const ExportDropdown = ({ onExport }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showProModal, setShowProModal] = useState(false);
    const dropdownRef = useRef(null);

    // Check if pro is active from global data
    const isProActive = window.embedpressAnalyticsData?.isProActive || false;

    const exportOptions = [
        {
            format: 'pdf',
            label: __('Export as PDF', 'embedpress'),
            icon: (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_pdf)">
                        <path d="M9.33398 2V4.66667C9.33398 4.84348 9.40422 5.01305 9.52925 5.13807C9.65427 5.2631 9.82384 5.33333 10.0007 5.33333H12.6673" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M3.33398 8V3.33333C3.33398 2.97971 3.47446 2.64057 3.72451 2.39052C3.97456 2.14048 4.3137 2 4.66732 2H9.33398L12.6673 5.33333V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M3.33398 12H4.33398C4.5992 12 4.85355 11.8946 5.04109 11.7071C5.22863 11.5196 5.33398 11.2652 5.33398 11C5.33398 10.7348 5.22863 10.4804 5.04109 10.2929C4.85355 10.1054 4.5992 10 4.33398 10H3.33398V14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M11.334 12H12.6673" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M13.334 10H11.334V14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M7.33398 10V14H8.00065C8.35427 14 8.69341 13.8595 8.94346 13.6095C9.19351 13.3594 9.33398 13.0203 9.33398 12.6667V11.3333C9.33398 10.9797 9.19351 10.6406 8.94346 10.3905C8.69341 10.1405 8.35427 10 8.00065 10H7.33398Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                    <defs>
                        <clipPath id="clip0_pdf">
                            <rect width="16" height="16" fill="white" />
                        </clipPath>
                    </defs>
                </svg>
            )
        },
        {
            format: 'excel',
            label: __('Export as Excel', 'embedpress'),
            icon: (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H2C1.44772 2 1 2.44772 1 3V13C1 13.5523 1.44772 14 2 14H14C14.5523 14 15 13.5523 15 13V3C15 2.44772 14.5523 2 14 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 6L8 10L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 10L8 6L11 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            )
        },
        {
            format: 'csv',
            label: __('Export as CSV', 'embedpress'),
            icon: (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H2C1.44772 2 1 2.44772 1 3V13C1 13.5523 1.44772 14 2 14H14C14.5523 14 15 13.5523 15 13V3C15 2.44772 14.5523 2 14 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M1 5H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M1 9H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 2V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 2V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            )
        }
    ];

    const handleButtonClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isProActive) {
            setShowProModal(true);
        } else {
            setIsOpen(!isOpen);
        }
    };

    const handleExportClick = (e, format) => {
        e.preventDefault();
        e.stopPropagation();

        setIsOpen(false);
        if (onExport) {
            onExport(format);
        }
    };

    const handleCloseProModal = () => {
        setShowProModal(false);
    };

    const handleUpgradeClick = () => {
        window.open('https://wpdeveloper.com/in/upgrade-embedpress', '_blank');
        setShowProModal(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <div className="ep-export-dropdown" ref={dropdownRef}>
                <button
                    type="button"
                    className="ep-btn primary ep-export-trigger"
                    onClick={handleButtonClick}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_2104_5909)">
                            <path d="M9.33398 2V4.66667C9.33398 4.84348 9.40422 5.01305 9.52925 5.13807C9.65427 5.2631 9.82384 5.33333 10.0007 5.33333H12.6673" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M3.33398 8V3.33333C3.33398 2.97971 3.47446 2.64057 3.72451 2.39052C3.97456 2.14048 4.3137 2 4.66732 2H9.33398L12.6673 5.33333V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M3.33398 12H4.33398C4.5992 12 4.85355 11.8946 5.04109 11.7071C5.22863 11.5196 5.33398 11.2652 5.33398 11C5.33398 10.7348 5.22863 10.4804 5.04109 10.2929C4.85355 10.1054 4.5992 10 4.33398 10H3.33398V14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M11.334 12H12.6673" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M13.334 10H11.334V14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M7.33398 10V14H8.00065C8.35427 14 8.69341 13.8595 8.94346 13.6095C9.19351 13.3594 9.33398 13.0203 9.33398 12.6667V11.3333C9.33398 10.9797 9.19351 10.6406 8.94346 10.3905C8.69341 10.1405 8.35427 10 8.00065 10H7.33398Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                        <defs>
                            <clipPath id="clip0_2104_5909">
                                <rect width="16" height="16" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                    {__('Export Analytics', 'embedpress')}
                    {isProActive && (
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className={`ep-dropdown-arrow ${isOpen ? 'open' : ''}`}
                        >
                            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    )}
                </button>

                {isProActive && isOpen && (
                    <div className="ep-export-dropdown-menu">
                        {exportOptions.map((option) => (
                            <button
                                key={option.format}
                                type="button"
                                className="ep-export-option"
                                onClick={(e) => handleExportClick(e, option.format)}
                            >
                                <span className="ep-export-icon">{option.icon}</span>
                                <span className="ep-export-label">{option.label}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Pro Modal for non-pro users */}
            {showProModal && (
                <div className="ep-modal-overlay" onClick={handleCloseProModal}>
                    <div className="ep-modal-content ep-analytics-pro-modal" onClick={(e) => e.stopPropagation()}>
                        <button
                            type="button"
                            className="ep-modal-close"
                            onClick={handleCloseProModal}
                            aria-label={__('Close modal', 'embedpress')}
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>

                        <div className="ep-modal-header">
                            <div className="ep-embedpress-logo">
                                <svg id="EmbedPress" xmlns="http://www.w3.org/2000/svg" width="218.97" height="50.864" viewBox="0 0 218.97 50.864">
                                    <path id="Path_1" data-name="Path 1" d="M0,0V9.811H2.84V2.84H9.788V0Z" fill="#9595c1" />
                                    <g id="Group_2" data-name="Group 2" transform="translate(0.075 6.39)">
                                        <g id="Group_1" data-name="Group 1" transform="translate(70.34 9.594)">
                                            <path id="Path_2" data-name="Path 2" d="M300,86.009V68.1h12.581v3.028h-9.06V75.4h8.872v3.028h-8.872v4.554h9.06v3.028Z" transform="translate(-300 -68.1)" fill="#25396f" />
                                            <path id="Path_3" data-name="Path 3" d="M382.577,101.391V93.223a2.025,2.025,0,0,0-2.183-2.3,3.719,3.719,0,0,0-2.911,1.62l-.023.047v8.825h-3.122V93.246a2.025,2.025,0,0,0-2.183-2.3,3.725,3.725,0,0,0-2.911,1.643l-.047.047v8.779h-3.1V88.529h3.1v2.159l.352-.516a5.557,5.557,0,0,1,4.178-1.972,3.328,3.328,0,0,1,3.5,2.277l.117.4.211-.352a5.4,5.4,0,0,1,4.389-2.324c2.418,0,3.709,1.314,3.709,3.8v9.389Z" transform="translate(-350.585 -83.482)" fill="#25396f" />
                                            <path id="Path_4" data-name="Path 4" d="M468.194,86.338a5.014,5.014,0,0,1-3.943-1.948l-.352-.446v2.066h-3.1V68.1h3.1v7.135l.352-.446a4.88,4.88,0,0,1,3.943-1.948c3.4,0,5.68,2.723,5.68,6.783S471.644,86.338,468.194,86.338Zm-1.1-10.821a4.1,4.1,0,0,0-3.169,1.62l-.023.047V82l.023.047a4.122,4.122,0,0,0,3.145,1.573c2.136,0,3.568-1.62,3.568-4.037C470.682,77.16,469.226,75.517,467.09,75.517Z" transform="translate(-423.057 -68.1)" fill="#25396f" />
                                            <path id="Path_5" data-name="Path 5" d="M532.677,101.643a6.772,6.772,0,0,1-.211-13.543c3.849,0,6.455,2.864,6.455,7.112v.563h-9.882l.023.211a3.771,3.771,0,0,0,4.014,3.239,5.917,5.917,0,0,0,3.5-1.221l1.314,1.925A7.907,7.907,0,0,1,532.677,101.643Zm-.211-11.149a3.378,3.378,0,0,0-3.474,3.1l-.023.211h6.971l-.023-.211A3.246,3.246,0,0,0,532.466,90.494Z" transform="translate(-472.8 -83.406)" fill="#25396f" />
                                            <path id="Path_6" data-name="Path 6" d="M596.18,86.338c-3.45,0-5.68-2.652-5.68-6.76,0-4.061,2.277-6.783,5.68-6.783a4.98,4.98,0,0,1,3.943,1.948l.352.446V68.1H603.6V86.033h-3.122V83.967l-.352.446A5.025,5.025,0,0,1,596.18,86.338Zm1.056-10.821c-2.089,0-3.544,1.667-3.544,4.061,0,2.371,1.455,4.037,3.544,4.037a3.988,3.988,0,0,0,3.192-1.6l.023-.047V77.16l-.023-.047A3.954,3.954,0,0,0,597.236,75.517Z" transform="translate(-522.314 -68.1)" fill="#25396f" />
                                            <path id="Path_7" data-name="Path 7" d="M659.6,86.009V68.1h8.38c4.108,0,5.962,2.864,5.962,5.7s-1.831,5.7-5.962,5.7h-4.859v6.5Zm3.521-9.553h4.342a2.674,2.674,0,0,0,2.887-2.676,2.636,2.636,0,0,0-2.887-2.676h-4.342Z" transform="translate(-575.195 -68.1)" fill="#25396f" />
                                            <path id="Path_8" data-name="Path 8" d="M730.6,101.391V88.529h3.1v2.183l.352-.446a5.6,5.6,0,0,1,3.873-2.066v2.981a6.846,6.846,0,0,0-.775-.047,4.611,4.611,0,0,0-3.427,1.6l-.024.047v8.614Z" transform="translate(-629.53 -83.482)" fill="#25396f" />
                                            <path id="Path_9" data-name="Path 9" d="M774.377,101.643a6.772,6.772,0,0,1-.211-13.543c3.849,0,6.455,2.864,6.455,7.112v.563h-9.882l.023.211a3.771,3.771,0,0,0,4.014,3.239,5.971,5.971,0,0,0,3.5-1.221l1.314,1.925A7.951,7.951,0,0,1,774.377,101.643Zm-.235-11.149a3.378,3.378,0,0,0-3.474,3.1l-.023.211h6.971l-.023-.211A3.232,3.232,0,0,0,774.143,90.494Z" transform="translate(-657.768 -83.406)" fill="#25396f" />
                                            <path id="Path_10" data-name="Path 10" d="M836.78,101.8a8.763,8.763,0,0,1-5.68-1.9l1.291-2.112a7.911,7.911,0,0,0,4.53,1.713c1.526,0,2.418-.61,2.418-1.62,0-1.033-1.314-1.291-2.864-1.6-2.23-.446-5.023-1.009-5.023-4.014,0-1.925,1.643-3.967,5.234-3.967a8.385,8.385,0,0,1,5.093,1.667l-1.174,2.019a5.9,5.9,0,0,0-3.9-1.408c-1.338,0-2.277.634-2.277,1.526,0,.915,1.174,1.15,2.676,1.455,2.3.469,5.187,1.056,5.187,4.225C842.32,100.2,840.137,101.8,836.78,101.8Z" transform="translate(-706.44 -83.559)" fill="#25396f" />
                                            <path id="Path_11" data-name="Path 11" d="M890.88,101.8a8.763,8.763,0,0,1-5.68-1.9l1.291-2.112a7.911,7.911,0,0,0,4.53,1.713c1.526,0,2.418-.61,2.418-1.62,0-1.033-1.314-1.291-2.864-1.6-2.23-.446-5.023-1.009-5.023-4.014,0-1.925,1.643-3.967,5.234-3.967a8.385,8.385,0,0,1,5.093,1.667l-1.174,2.019a5.9,5.9,0,0,0-3.9-1.408c-1.338,0-2.277.634-2.277,1.526,0,.915,1.174,1.15,2.676,1.455,2.3.469,5.187,1.056,5.187,4.225C896.42,100.2,894.237,101.8,890.88,101.8Z" transform="translate(-747.842 -83.559)" fill="#25396f" />
                                        </g>
                                        <path id="Path_12" data-name="Path 12" d="M181.871,174.9v6.971H174.9v2.84h9.811V174.9Z" transform="translate(-133.923 -140.238)" fill="#9595c1" />
                                        <path id="Path_13" data-name="Path 13" d="M49.349,33.65a12.6,12.6,0,0,0-9.53-6.337,12.422,12.422,0,0,0-6.83,1.127c-.235.117-.493.235-.728.376A12.566,12.566,0,0,0,26.3,36.209h0L19.446,55.761A7.141,7.141,0,0,1,16.23,59.8c-.117.07-.258.141-.4.211a6.863,6.863,0,0,1-3.685.61,6.792,6.792,0,0,1-5.117-3.4A6.706,6.706,0,0,1,6.443,52.1a6.78,6.78,0,0,1,3.216-4.061c.141-.07.258-.141.4-.211a6.826,6.826,0,0,1,3.685-.61c.047,0,.094.023.141.023l-1.408,4.108a.532.532,0,0,0,.329.681L16.442,53.2a.507.507,0,0,0,.657-.329l3.145-8.943a.857.857,0,0,0-.047-.681.805.805,0,0,0-.54-.446l-3.31-.962a.834.834,0,0,0-.235-.047l-.305-.094v.023c-.469-.117-.939-.188-1.408-.258a12.539,12.539,0,0,0-6.854,1.127c-.258.117-.493.258-.728.376A12.559,12.559,0,0,0,.809,50.527a12.4,12.4,0,0,0,1.1,9.53,12.6,12.6,0,0,0,9.53,6.337,12.422,12.422,0,0,0,6.83-1.127c.235-.117.493-.235.728-.376a12.5,12.5,0,0,0,5.938-7.37h0l6.9-19.552V37.9a7.239,7.239,0,0,1,3.192-4.014c.117-.07.258-.141.4-.211a6.863,6.863,0,0,1,3.685-.61A6.729,6.729,0,0,1,41.6,45.645c-.141.07-.258.141-.4.211a6.91,6.91,0,0,1-3.709.61,6.669,6.669,0,0,1-1.15-.235H36.3L34.186,45.6a.422.422,0,0,0-.54.282L32,50.55a.448.448,0,0,0,.305.587l2.605.751a11.149,11.149,0,0,0,1.925.376,12.457,12.457,0,0,0,6.83-1.127h.023c.258-.117.493-.258.751-.376A12.64,12.64,0,0,0,49.349,33.65Z" transform="translate(-0.321 -27.225)" fill="#5b4e96" />
                                    </g>
                                </svg>
                            </div>
                            <h2 className="ep-modal-title">{__('Access Advanced Analytics Export', 'embedpress')}</h2>
                            <p className="ep-modal-subtitle">{__('Export your analytics data in multiple formats with EmbedPress Pro.', 'embedpress')}</p>
                        </div>

                        <div className="ep-modal-body">
                            <div className="ep-pro-features-grid">
                                <div className="ep-pro-feature-item">
                                    <div className="ep-feature-icon ep-export-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#6C5CE7" strokeWidth="2" />
                                            <polyline points="14,2 14,8 20,8" stroke="#6C5CE7" strokeWidth="2" />
                                            <line x1="16" y1="13" x2="8" y2="13" stroke="#6C5CE7" strokeWidth="2" />
                                            <line x1="16" y1="17" x2="8" y2="17" stroke="#6C5CE7" strokeWidth="2" />
                                            <polyline points="10,9 9,9 8,9" stroke="#6C5CE7" strokeWidth="2" />
                                        </svg>
                                    </div>
                                    <div className="ep-feature-content">
                                        <h4>{__('Export as PDF', 'embedpress')}</h4>
                                        <p>{__('Generate professional PDF reports with charts and detailed analytics.', 'embedpress')}</p>
                                    </div>
                                </div>

                                <div className="ep-pro-feature-item">
                                    <div className="ep-feature-icon ep-export-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#6C5CE7" strokeWidth="2" />
                                            <polyline points="14,2 14,8 20,8" stroke="#6C5CE7" strokeWidth="2" />
                                            <path d="M8 13h8M8 17h8M8 9h2" stroke="#6C5CE7" strokeWidth="2" />
                                        </svg>
                                    </div>
                                    <div className="ep-feature-content">
                                        <h4>{__('Export as Excel', 'embedpress')}</h4>
                                        <p>{__('Download Excel files for advanced data analysis and reporting.', 'embedpress')}</p>
                                    </div>
                                </div>

                                <div className="ep-pro-feature-item">
                                    <div className="ep-feature-icon ep-export-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#6C5CE7" strokeWidth="2" />
                                            <polyline points="14,2 14,8 20,8" stroke="#6C5CE7" strokeWidth="2" />
                                            <path d="M8 13h8M8 17h4" stroke="#6C5CE7" strokeWidth="2" />
                                        </svg>
                                    </div>
                                    <div className="ep-feature-content">
                                        <h4>{__('Export as CSV', 'embedpress')}</h4>
                                        <p>{__('Get CSV files for easy data import into other analytics tools.', 'embedpress')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="ep-pro-actions">
                                <button
                                    type="button"
                                    className="ep-unlock-pro-btn"
                                    onClick={handleUpgradeClick}
                                >
                                    {__('Unlock Pro Features', 'embedpress')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ExportDropdown;
