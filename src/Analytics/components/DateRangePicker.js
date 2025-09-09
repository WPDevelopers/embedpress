import React, { useState, useRef, useEffect } from 'react';
import { format, subDays, subWeeks, subMonths, subQuarters, startOfDay, endOfDay, isWithinInterval, isSameDay } from 'date-fns';

const DateRangePicker = ({ onDateRangeChange, initialRange = null }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedRange, setSelectedRange] = useState(initialRange || {
        startDate: startOfDay(subDays(new Date(), 30)),
        endDate: endOfDay(new Date()),
        label: 'Last month'
    });
    const [tempRange, setTempRange] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [isSelectingRange, setIsSelectingRange] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, right: 'auto' });
    const dropdownRef = useRef(null);
    const triggerRef = useRef(null);

    const presetRanges = [
        {
            label: 'Today',
            getValue: () => ({
                startDate: startOfDay(new Date()),
                endDate: endOfDay(new Date())
            })
        },
        {
            label: 'Yesterday',
            getValue: () => ({
                startDate: startOfDay(subDays(new Date(), 1)),
                endDate: endOfDay(subDays(new Date(), 1))
            })
        },
        {
            label: 'Last week',
            getValue: () => ({
                startDate: startOfDay(subWeeks(new Date(), 1)),
                endDate: endOfDay(new Date())
            })
        },
        {
            label: 'Last month',
            getValue: () => ({
                startDate: startOfDay(subMonths(new Date(), 1)),
                endDate: endOfDay(new Date())
            })
        },
        {
            label: 'Last quarter',
            getValue: () => ({
                startDate: startOfDay(subQuarters(new Date(), 1)),
                endDate: endOfDay(new Date())
            })
        }
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                triggerRef.current && !triggerRef.current.contains(event.target)) {
                setIsOpen(false);
                setIsSelectingRange(false);
                setTempRange(null);
            }
        };

        const handleResize = () => {
            if (isOpen) {
                calculatePosition();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleResize);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleResize);
        };
    }, [isOpen]);

    const calculatePosition = () => {
        if (!triggerRef.current) return;

        const triggerRect = triggerRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const dropdownWidth = 600; // Expected dropdown width
        const dropdownHeight = 400; // Expected dropdown height

        let top = triggerRect.bottom + 8;
        let left = triggerRect.left;
        let right = 'auto';

        // Check if dropdown would go off the right edge
        if (left + dropdownWidth > viewportWidth) {
            right = viewportWidth - triggerRect.right;
            left = 'auto';
        }

        // Check if dropdown would go off the bottom edge
        if (top + dropdownHeight > viewportHeight) {
            top = triggerRect.top - dropdownHeight - 8;
        }

        // Ensure dropdown doesn't go off the left edge
        if (left < 16) {
            left = 16;
            right = 'auto';
        }

        setDropdownPosition({ top, left, right });
    };

    const toggleDropdown = () => {
        if (!isOpen) {
            calculatePosition();
        }
        setIsOpen(!isOpen);
    };

    const handlePresetSelect = (preset) => {
        const range = preset.getValue();
        const newRange = { ...range, label: preset.label };
        setSelectedRange(newRange);
        setIsSelectingRange(false);
        setTempRange(null);
        onDateRangeChange(newRange);
        // Close dropdown after selection
        // setTimeout(() => setIsOpen(false), 100);
    };

    const handleCustomDateClick = (date) => {
        if (!isSelectingRange) {
            // Normalize to start of day for the start date
            const normalizedStartDate = startOfDay(date);
            setTempRange({ startDate: normalizedStartDate, endDate: null });
            setIsSelectingRange(true);
        } else {
            if (tempRange.startDate && date >= tempRange.startDate) {
                // Normalize start date to start of day and end date to end of day
                const normalizedStartDate = startOfDay(tempRange.startDate);
                const normalizedEndDate = endOfDay(date);

                const newRange = {
                    startDate: normalizedStartDate,
                    endDate: normalizedEndDate,
                    label: 'Custom range'
                };
                setSelectedRange(newRange);
                setTempRange(null);
                setIsSelectingRange(false);
                onDateRangeChange(newRange);
                // Close dropdown after custom range selection
                // setTimeout(() => setIsOpen(false), 100);
            } else {
                // Reset with new start date normalized to start of day
                const normalizedStartDate = startOfDay(date);
                setTempRange({ startDate: normalizedStartDate, endDate: null });
            }
        }
    };

    const handleReset = () => {
        // Reset to default range (Last month)
        const defaultRange = {
            startDate: startOfDay(subDays(new Date(), 30)),
            endDate: endOfDay(new Date()),
            label: 'Last month'
        };
        setSelectedRange(defaultRange);
        setTempRange(null);
        setIsSelectingRange(false);
        onDateRangeChange(defaultRange);
        // Close dropdown after reset
        // setTimeout(() => setIsOpen(false), 100);
    };

    const formatDisplayDate = () => {
        if (selectedRange.startDate && selectedRange.endDate) {
            if (isSameDay(selectedRange.startDate, selectedRange.endDate)) {
                return format(selectedRange.startDate, 'dd MMM yy');
            }
            return `${format(selectedRange.startDate, 'dd MMM yy')} - ${format(selectedRange.endDate, 'dd MMM yy')}`;
        }
        return 'Select date range';
    };

    const renderCalendar = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);

        // Start from Monday (1) instead of Sunday (0)
        const startDate = new Date(firstDay);
        const dayOfWeek = firstDay.getDay();
        const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        startDate.setDate(startDate.getDate() - mondayOffset);

        const days = [];
        const current = new Date(startDate);

        for (let i = 0; i < 42; i++) {
            days.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }

        const isDateInRange = (date) => {
            const rangeToCheck = tempRange || selectedRange;
            if (rangeToCheck && rangeToCheck.startDate && rangeToCheck.endDate) {
                return isWithinInterval(date, { start: rangeToCheck.startDate, end: rangeToCheck.endDate });
            }
            return false;
        };

        const isDateSelected = (date) => {
            const rangeToCheck = tempRange || selectedRange;
            if (rangeToCheck) {
                if (rangeToCheck.startDate && isSameDay(date, rangeToCheck.startDate)) return true;
                if (rangeToCheck.endDate && isSameDay(date, rangeToCheck.endDate)) return true;
            }
            return false;
        };

        const isToday = (date) => {
            return isSameDay(date, new Date());
        };

        return (
            <div className="ep-calendar">
                <div className="ep-calendar-header">
                    <button
                        onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
                        className="ep-calendar-nav"
                        type="button"
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <span className="ep-calendar-title">
                        {format(currentMonth, 'MMMM yyyy')}
                    </span>
                    <button
                        onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
                        className="ep-calendar-nav"
                        type="button"
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
                <div className="ep-calendar-weekdays">
                    {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
                        <div key={day} className="ep-calendar-weekday">{day}</div>
                    ))}
                </div>
                <div className="ep-calendar-days">
                    {days.map((day, index) => {
                        const isOtherMonth = day.getMonth() !== month;
                        const isSelected = isDateSelected(day);
                        const inRange = isDateInRange(day);
                        const todayClass = isToday(day) ? 'ep-calendar-day-today' : '';

                        const currentRange = tempRange || selectedRange;
                        const isRangeStart = currentRange?.startDate && isSameDay(day, currentRange.startDate);
                        const isRangeEnd = currentRange?.endDate && isSameDay(day, currentRange.endDate);
                        const isRowStart = index % 7 === 0;
                        const isRowEnd = (index + 1) % 7 === 0;


                        const className = [
                            `day-${index}`,
                            'ep-calendar-day',
                            isOtherMonth && 'ep-calendar-day-other-month',
                            isSelected && 'ep-calendar-day-selected',
                            inRange && 'ep-calendar-day-in-range',
                            isRangeStart && 'ep-calendar-day-range-start',
                            isRangeEnd && 'ep-calendar-day-range-end',
                            isRowStart && 'ep-calendar-day-row-start',
                            isRowEnd && 'ep-calendar-day-row-end',
                            todayClass
                        ]
                            .filter(Boolean)
                            .join(' ');


                        return (
                            <button
                                key={index}
                                onClick={() => handleCustomDateClick(day)}
                                type="button"
                                className={className}
                            >
                                {day.getDate()}
                            </button>
                        );
                    })}
                </div>

            </div>
        );
    };

    return (
        <div className="ep-date-range-picker">
            <button
                ref={triggerRef}
                className="ep-date-range-trigger"
                onClick={toggleDropdown}
                type="button"
            >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M12.6667 2.66667H3.33333C2.59695 2.66667 2 3.26362 2 4V13.3333C2 14.0697 2.59695 14.6667 3.33333 14.6667H12.6667C13.403 14.6667 14 14.0697 14 13.3333V4C14 3.26362 13.403 2.66667 12.6667 2.66667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10.6667 1.33333V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M5.33333 1.33333V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 6.66667H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{formatDisplayDate()}</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={`ep-dropdown-arrow ${isOpen ? 'open' : ''}`}>
                    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            {isOpen && (
                <div
                    ref={dropdownRef}
                    className="ep-date-range-dropdown"
                    style={{
                        position: 'fixed',
                        top: dropdownPosition.top,
                        left: dropdownPosition.left,
                        right: dropdownPosition.right,
                        zIndex: 9999
                    }}
                >
                    <div className="ep-date-range-content">
                        <div className="ep-date-range-presets">
                            <div className='range-preset-inner'>
                                {presetRanges.map((preset, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handlePresetSelect(preset)}
                                        type="button"
                                        className={`ep-preset-button ${selectedRange.label === preset.label ? 'active' : ''
                                            }`}
                                    >
                                        {preset.label}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={handleReset}
                                type="button"
                                className="ep-reset-button"
                            >
                                Reset
                            </button>
                        </div>
                        <div className="ep-date-range-calendar">
                            {renderCalendar()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DateRangePicker;
