import React from 'react';
import DateRangePicker from './DateRangePicker';
import ExportDropdown from '../components/ExportDropdown';



const { __ } = wp.i18n;

const Header = ({ onDateRangeChange, onExport, onRefreshCache }) => {
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
                        <ExportDropdown onExport={onExport} />
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
