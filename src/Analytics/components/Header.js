import React from 'react';
import DateRangePicker from './DateRangePicker';

const { __ } = wp.i18n;

const Header = ({ onDateRangeChange, onExportPDF, onRefreshCache }) => {
    return (
        <>
            <div className='ep-header-wrapper'>
                <div className='header-content'>
                    <h3 className="dashboard-title">{__('Embedded Content Analytics Summary', 'embedpress')}</h3>
                    <p>{__('Get insights of your embedded PDF, video, audio, and 250+ other source performances with EmbedPress', 'embedpress')}</p>
                </div>
                <div className='header-info'>
                    <div className='button-wrapper'>
                        <DateRangePicker onDateRangeChange={onDateRangeChange} />
                        <button
                            className='ep-btn primary'
                            onClick={onExportPDF}
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_2104_5909)">
                                    <path d="M9.33398 2V4.66667C9.33398 4.84348 9.40422 5.01305 9.52925 5.13807C9.65427 5.2631 9.82384 5.33333 10.0007 5.33333H12.6673" stroke="#5b4e96" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M3.33398 8V3.33333C3.33398 2.97971 3.47446 2.64057 3.72451 2.39052C3.97456 2.14048 4.3137 2 4.66732 2H9.33398L12.6673 5.33333V8" stroke="#5b4e96" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M3.33398 12H4.33398C4.5992 12 4.85355 11.8946 5.04109 11.7071C5.22863 11.5196 5.33398 11.2652 5.33398 11C5.33398 10.7348 5.22863 10.4804 5.04109 10.2929C4.85355 10.1054 4.5992 10 4.33398 10H3.33398V14" stroke="#5b4e96" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M11.334 12H12.6673" stroke="#5b4e96" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M13.334 10H11.334V14" stroke="#5b4e96" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M7.33398 10V14H8.00065C8.35427 14 8.69341 13.8595 8.94346 13.6095C9.19351 13.3594 9.33398 13.0203 9.33398 12.6667V11.3333C9.33398 10.9797 9.19351 10.6406 8.94346 10.3905C8.69341 10.1405 8.35427 10 8.00065 10H7.33398Z" stroke="#5b4e96" strokeLinecap="round" strokeLinejoin="round" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_2104_5909">
                                        <rect width="16" height="16" fill="#5b4e96" />
                                    </clipPath>
                                </defs>
                            </svg>
                            {__('Export Analytics', 'embedpress')}
                        </button>
                        <button
                            className='ep-btn'
                            onClick={onRefreshCache}
                            title={__('Refresh embed count cache', 'embedpress')}
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_2104_4599)">
                                    <path d="M2.69922 7.33329C2.86781 6.04712 3.49937 4.86648 4.47567 4.01237C5.45198 3.15827 6.70609 2.68926 8.00326 2.69314C9.30043 2.69702 10.5517 3.17352 11.5229 4.03345C12.4941 4.89337 13.1186 6.07777 13.2795 7.36493C13.4404 8.65209 13.1266 9.95376 12.397 11.0263C11.6674 12.0988 10.5719 12.8687 9.31559 13.1917C8.05929 13.5148 6.72831 13.3689 5.5718 12.7814C4.4153 12.1939 3.51255 11.2051 3.03255 9.99996M2.69922 13.3333V9.99996H6.03255" stroke="#5B4E96" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_2104_4599">
                                        <rect width="16" height="16" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;
