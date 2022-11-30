/**
 * WordPress dependencies
 */
 import { getParams } from '../functions';
 
 const { isShallowEqualObjects } = wp.isShallowEqual;
 const { useState, useEffect } = wp.element;
 const { __ } = wp.i18n;
 const { addFilter } = wp.hooks;



const {
    TextControl,
    SelectControl,
    RangeControl,
    ToggleControl,
} = wp.components;


export const init = () => {
    addFilter('embedpress_block_rest_param', 'embedpress', getYoutubeParams, 10);
}

export const getYoutubeParams = (params, attributes) => {
    if(!attributes.url || !isYTChannel(attributes.url)){
        return params;
    }
    // which attributes should be passed with rest api.
    const defaults = {
        pagesize: 6,
    };

    return getParams(params, attributes, defaults);
}

export const isYTChannel = (url) => {
    return url.match(/\/channel\/|\/c\/|\/user\/|(?:https?:\/\/)?(?:www\.)?(?:youtube.com\/)(\w+)[^?\/]*$/i);
}

/**
 *
 * @param {object} attributes
 * @returns
 */

export const useYTChannel = (attributes) => {
    // which attribute should call embed();
    const defaults = {
        pagesize: null,
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

export const DynamicStyleYTChannel = ({ clientId, attributes }) => {
    if (!isYTChannel(attributes ? attributes.url : '')) {
        return <React.Fragment></React.Fragment>;
    }
}

export default function Youtube({ attributes, setAttributes }) {

    const {
        ispagination,
        pagesize,
        columns,
        gapbetweenvideos
    } = attributes;

    return (
        <div>

            <RangeControl
                label={__('Video Per Page')}
                value={pagesize}
                onChange={(pagesize) => setAttributes({ pagesize })}
                min={1}
                max={50}
            />
            <p>Specify the number of videos you wish to show on each page.</p>

            <SelectControl
                label={__("Column")}
                value={columns}
                options={[
                    { label: 'Auto', value: 'auto' },
                    { label: '2', value: '2' },
                    { label: '3', value: '3' },
                    { label: '4', value: '4' },
                    { label: '6', value: '6' },
                ]}
                onChange={(columns) => setAttributes({ columns })}
                __nextHasNoMarginBottom
            />

            <RangeControl
                label={__('Gap Between Videos')}
                value={gapbetweenvideos}
                onChange={(gap) => setAttributes({ gapbetweenvideos: gap })}
                min={1}
                max={100}
            />
            <p>Specify the gap between youtube videos.</p>


            <ToggleControl
                label={__("Pagination")}
                checked={ispagination}
                onChange={(ispagination) => setAttributes({ ispagination })}
            />
        </div>
    )
}
