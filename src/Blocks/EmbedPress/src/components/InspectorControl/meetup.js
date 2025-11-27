/**
 * WordPress dependencies
 */
import { getParams } from '../../../../../utils/functions';
import { EPIcon } from '../../../../GlobalCoponents/icons';

const { isShallowEqualObjects } = wp.isShallowEqual;
const { useState, useEffect } = wp.element;
const { __ } = wp.i18n;
const { addFilter } = wp.hooks;
const {
    PanelBody,
    SelectControl,
    ToggleControl,
    RangeControl,
} = wp.components;

export const init = () => {
    addFilter('embedpress_block_rest_param', 'embedpress', getMeetupParams, 10);
}

export const getMeetupParams = (params, attributes) => {
    if (!attributes.url || !attributes.url.includes('meetup.com')) {
        return params;
    }
    // which attributes should be passed with rest api.
    const defaults = {
        meetupOrderBy: 'date',
        meetupOrder: 'ASC',
        meetupPerPage: 10,
        meetupEnablePagination: true,
        meetupTimezone: 'wp_timezone',
        meetupDateFormat: 'wp_date_format',
        meetupTimeFormat: 'wp_time_format',
    };

    return getParams(params, attributes, defaults);
}

export const useMeetup = (attributes) => {
    // which attribute should call embed();
    const defaults = {
        meetupOrderBy: null,
        meetupOrder: null,
        meetupPerPage: null,
        meetupEnablePagination: null,
        meetupTimezone: null,
        meetupDateFormat: null,
        meetupTimeFormat: null,
    };

    const param = getParams({}, attributes, defaults);
    const [atts, setAtts] = useState(param);

    useEffect(() => {
        const param = getParams(atts, attributes, defaults);
        if (!isShallowEqualObjects(atts || {}, param)) {
            setAtts(param);
        }
    }, [attributes]);

    return atts;
}

/**
 * Meetup Inspector Controls
 *
 * Provides controls for Meetup RSS feed embeds including:
 * - Ordering (by date, title, attendees)
 * - Sort direction (ASC/DESC)
 * - Events per page
 * - Pagination toggle
 */
export default function Meetup({ attributes, setAttributes }) {
    const {
        url,
        meetupOrderBy,
        meetupOrder,
        meetupPerPage,
        meetupEnablePagination,
        meetupTimezone,
        meetupDateFormat,
        meetupTimeFormat,
    } = attributes;

    // Check if it's a Meetup URL
    const isMeetupUrl = url && url.includes('meetup.com');

    // Check if it's an RSS feed (multiple events) vs single event
    // RSS feeds end with /events or /events/ or /events/rss
    // Single events have /events/{event-id}/ pattern (e.g., /events/311370528/)
    const isMeetupRssFeed = isMeetupUrl && (
        url.endsWith('/events') ||
        url.endsWith('/events/') ||
        url.includes('/events/rss')
    );

    if (!isMeetupUrl) {
        return null;
    }

    return (
        <PanelBody
            title={<div className='ep-pannel-icon'>{EPIcon} {__('Meetup Settings', 'embedpress')}</div>}
            initialOpen={false}
        >
            {/* Only show these controls for RSS feeds (multiple events), not single events */}
            {isMeetupRssFeed && (
                <>
                    <SelectControl
                        label={__('Order By', 'embedpress')}
                        value={meetupOrderBy}
                        options={[
                            { label: __('Date', 'embedpress'), value: 'date' },
                            { label: __('Title', 'embedpress'), value: 'title' },
                            { label: __('Attendees', 'embedpress'), value: 'attendees' },
                        ]}
                        onChange={(meetupOrderBy) => setAttributes({ meetupOrderBy })}
                        help={__('Choose how to sort the events', 'embedpress')}
                        __nextHasNoMarginBottom
                    />

                    <SelectControl
                        label={__('Order', 'embedpress')}
                        value={meetupOrder}
                        options={[
                            { label: __('Ascending', 'embedpress'), value: 'ASC' },
                            { label: __('Descending', 'embedpress'), value: 'DESC' },
                        ]}
                        onChange={(meetupOrder) => setAttributes({ meetupOrder })}
                        help={__('Sort direction', 'embedpress')}
                        __nextHasNoMarginBottom
                    />

                    <RangeControl
                        label={__('Events Per Page', 'embedpress')}
                        value={meetupPerPage}
                        onChange={(meetupPerPage) => setAttributes({ meetupPerPage })}
                        min={1}
                        max={50}
                        step={1}
                        help={__('Number of events to show per page', 'embedpress')}
                    />

                    <ToggleControl
                        label={__('Enable Load More', 'embedpress')}
                        checked={meetupEnablePagination}
                        onChange={(meetupEnablePagination) => setAttributes({ meetupEnablePagination })}
                        help={__('Show a "Load More" button to load additional events', 'embedpress')}
                    />
                </>
            )}

            <SelectControl
                label={__('Timezone', 'embedpress')}
                value={meetupTimezone}
                options={[
                    { label: __('Visitor Timezone (Auto-detect)', 'embedpress'), value: 'visitor_timezone' },
                    { label: __('WordPress Site Timezone', 'embedpress'), value: 'wp_timezone' },
                    { label: __('UTC', 'embedpress'), value: 'UTC' },
                    { label: __('America/New_York (EST/EDT)', 'embedpress'), value: 'America/New_York' },
                    { label: __('America/Chicago (CST/CDT)', 'embedpress'), value: 'America/Chicago' },
                    { label: __('America/Denver (MST/MDT)', 'embedpress'), value: 'America/Denver' },
                    { label: __('America/Los_Angeles (PST/PDT)', 'embedpress'), value: 'America/Los_Angeles' },
                    { label: __('Europe/London (GMT/BST)', 'embedpress'), value: 'Europe/London' },
                    { label: __('Europe/Paris (CET/CEST)', 'embedpress'), value: 'Europe/Paris' },
                    { label: __('Asia/Tokyo (JST)', 'embedpress'), value: 'Asia/Tokyo' },
                    { label: __('Australia/Sydney (AEST/AEDT)', 'embedpress'), value: 'Australia/Sydney' },
                ]}
                onChange={(meetupTimezone) => setAttributes({ meetupTimezone })}
                help={__('Select timezone for displaying event dates and times. Visitor timezone will auto-detect based on their browser.', 'embedpress')}
                __nextHasNoMarginBottom
            />

            <SelectControl
                label={__('Date Format', 'embedpress')}
                value={meetupDateFormat}
                options={[
                    { label: __('WordPress Date Format', 'embedpress'), value: 'wp_date_format' },
                    { label: __('MM/DD/YYYY', 'embedpress'), value: 'm/d/Y' },
                    { label: __('DD/MM/YYYY', 'embedpress'), value: 'd/m/Y' },
                    { label: __('YYYY-MM-DD', 'embedpress'), value: 'Y-m-d' },
                    { label: __('Month DD, YYYY', 'embedpress'), value: 'F j, Y' },
                    { label: __('DD Month YYYY', 'embedpress'), value: 'j F Y' },
                ]}
                onChange={(meetupDateFormat) => setAttributes({ meetupDateFormat })}
                help={__('Select date format for event dates', 'embedpress')}
                __nextHasNoMarginBottom
            />

            <SelectControl
                label={__('Time Format', 'embedpress')}
                value={meetupTimeFormat}
                options={[
                    { label: __('WordPress Time Format', 'embedpress'), value: 'wp_time_format' },
                    { label: __('12-hour (h:mm AM/PM)', 'embedpress'), value: 'g:i A' },
                    { label: __('24-hour (HH:mm)', 'embedpress'), value: 'H:i' },
                ]}
                onChange={(meetupTimeFormat) => setAttributes({ meetupTimeFormat })}
                help={__('Select time format for event times', 'embedpress')}
                __nextHasNoMarginBottom
            />
        </PanelBody>
    );
}

