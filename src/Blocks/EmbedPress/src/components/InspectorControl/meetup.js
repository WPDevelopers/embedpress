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
    } = attributes;

    // Only show Meetup controls if URL contains meetup.com and /events
    const isMeetupRssFeed = url && url.includes('meetup.com') && url.includes('/events');

    if (!isMeetupRssFeed) {
        return null;
    }

    return (
        <PanelBody 
            title={<div className='ep-pannel-icon'>{EPIcon} {__('Meetup Settings', 'embedpress')}</div>} 
            initialOpen={false}
        >
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
        </PanelBody>
    );
}

