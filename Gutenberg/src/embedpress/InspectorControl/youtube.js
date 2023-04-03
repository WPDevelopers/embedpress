/**
 * WordPress dependencies
 */
import { getParams } from '../functions';
import { addProAlert, isPro, removeAlert } from '../../common/helper';
import CustomBranding from './custombranding';

const { isShallowEqualObjects } = wp.isShallowEqual;
const { useState, useEffect } = wp.element;
const { __ } = wp.i18n;
const { addFilter } = wp.hooks;



const {
    TextControl,
    SelectControl,
    RangeControl,
    ToggleControl,
    PanelBody,
    Button,
} = wp.components;

import {
    MediaUpload,
} from "@wordpress/block-editor";


export const init = () => {
    addFilter('embedpress_block_rest_param', 'embedpress', getYoutubeParams, 10);
}

export const getYoutubeParams = (params, attributes) => {

    if (!attributes.url) {
        return params;
    }


    let ytvAtts = {};
    let ytcAtts = {};

    if (isYTVideo(attributes.url)) {
        ytvAtts = {
            videosize: 'fixed',
            starttime: '',
            endtime: '',
            autoplay: false,
            controls: '2',
            fullscreen: true,
            videoannotations: true,
            progressbarcolor: 'red',
            closedcaptions: false,
            modestbranding: '0',
            relatedvideos: true,
        }
    }

    if (isYTChannel(attributes.url)) {
        ytcAtts = {
            pagesize: 6,
        }
    }

    // which attributes should be passed with rest api.
    const defaults = {
        ...ytvAtts,
        ...ytcAtts
    };

    return getParams(params, attributes, defaults);
}

export const isYTChannel = (url) => {
    return url.match(/\/channel\/|\/c\/|\/user\/|\/@[a-z]|(?:https?:\/\/)?(?:www\.)?(?:youtube.com\/)(\w+)[^?\/]*$/i);
}

export const isYTVideo = (url) => {
    const youtubeRegex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/i;
    const youtubeMatch = url.match(youtubeRegex);
    if (!youtubeMatch) return false;

    const videoId = youtubeMatch[7];
    return videoId.length === 11;
};




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

export const useYTVideo = (attributes) => {
    // which attribute should call embed();
    const defaults = {
        videosize: null,
        starttime: null,
        endtime: null,
        autoplay: null,
        controls: null,
        fullscreen: null,
        videoannotations: null,
        progressbarcolor: null,
        closedcaptions: null,
        modestbranding: null,
        relatedvideos: null,
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



export default function Youtube({ attributes, setAttributes, isYTChannel, isYTVideo }) {

    const {
        ispagination,
        pagesize,
        columns,
        gapbetweenvideos,
        videosize,
        starttime,
        endtime,
        autoplay,
        controls,
        fullscreen,
        videoannotations,
        progressbarcolor,
        closedcaptions,
        modestbranding,
        relatedvideos,
        customlogo,
        logoX,
        logoY,
        customlogoUrl,
        logoOpacity
    } = attributes;

    const isProPluginActive = embedpressObj.is_pro_plugin_active;

    const onSelectImage = (logo) => {
        console.log(logo.sizes.full.url);
        setAttributes({ customlogo: logo.sizes.full.url });
    }
    const removeImage = (e) => {
        setAttributes({ customlogo: '' });
    }

    if (!document.querySelector('.pro__alert__wrap')) {
        document.querySelector('body').append(isPro('none'));
        removeAlert();
    }

    return (
        <div>

            {
                isYTChannel && (
                    <div className={'ep__channel-yt-video-options'}>
                        <TextControl
                            label={__("Video Per Page")}
                            value={pagesize}
                            onChange={(pagesize) => setAttributes({ pagesize })}
                            type={'number'}
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

            {
                isYTVideo && (
                    <div className={'ep__single-yt-video-options'}>
                        <PanelBody title={__("YouTube Video Controls", 'embedpress')} initialOpen={false}>
                            <div className={'ep-video-controlers'}>
                                <TextControl
                                    label={__("Start Time (in seconds)")}
                                    value={starttime}
                                    onChange={(starttime) => setAttributes({ starttime })}
                                    type={'text'}
                                    className={'ep-control-field'}
                                />

                                <TextControl
                                    label={__("End Time (in seconds)")}
                                    value={endtime}
                                    onChange={(endtime) => setAttributes({ endtime })}
                                    type={'text'}
                                    className={'ep-control-field'}
                                />

                                <ToggleControl
                                    label={__("Auto Play")}
                                    checked={autoplay}
                                    onChange={(autoplay) => setAttributes({ autoplay })}
                                />

                                <SelectControl
                                    label={__("Controls", "embedpress")}
                                    value={controls}
                                    options={[
                                        { label: 'Display immediately', value: '1' },
                                        { label: 'Hide controls', value: '0' },
                                        { label: 'Display after user initiation immediately', value: '2' },
                                    ]}
                                    onChange={(controls) => setAttributes({ controls })}
                                    className={'ep-select-control-field'}
                                    __nextHasNoMarginBottom
                                />

                                <ToggleControl
                                    label={__("Fullscreen Button")}
                                    checked={fullscreen}
                                    onChange={(fullscreen) => setAttributes({ fullscreen })}
                                />

                                <ToggleControl
                                    label={__("Video Annotations")}
                                    checked={videoannotations}
                                    onChange={(videoannotations) => setAttributes({ videoannotations })}
                                />

                                <SelectControl
                                    label={__("Progress Bar Color", "embedpress")}
                                    value={progressbarcolor}
                                    options={[
                                        { label: 'Red', value: 'red' },
                                        { label: 'White', value: 'white' },
                                    ]}
                                    onChange={(progressbarcolor) => setAttributes({ progressbarcolor })}
                                    className={'ep-select-control-field'}
                                    __nextHasNoMarginBottom
                                />

                                <div className={isProPluginActive ? "pro-control-active" : "pro-control"} onClick={(e) => { addProAlert(e, isProPluginActive) }}>
                                    <ToggleControl
                                        label={__("Closed Captions")}
                                        checked={closedcaptions}
                                        onChange={(closedcaptions) => setAttributes({ closedcaptions })}
                                    />

                                    {
                                        (!isProPluginActive) && (
                                            <span className='isPro'>{__('pro', 'embedpress')}</span>
                                        )
                                    }
                                </div>

                                <div className={isProPluginActive ? "pro-control-active" : "pro-control"} onClick={(e) => { addProAlert(e, isProPluginActive) }}>
                                    <SelectControl
                                        label={__("Modest Branding", "embedpress")}
                                        value={modestbranding}
                                        options={[
                                            { label: 'Display', value: '0' },
                                            { label: 'Do Not Display', value: '1' },
                                        ]}
                                        onChange={(modestbranding) => setAttributes({ modestbranding })}
                                        className={'ep-select-control-field'}
                                        __nextHasNoMarginBottom
                                    />
                                    {
                                        (!isProPluginActive) && (
                                            <span className='isPro'>{__('pro', 'embedpress')}</span>
                                        )
                                    }
                                </div>

                                <div className='ep-yt-related-videos'>
                                    <ToggleControl
                                        label={__("Related Videos")}
                                        checked={relatedvideos}
                                        onChange={(relatedvideos) => setAttributes({ relatedvideos })}
                                    />
                                    <p>Enable to display related videos from all channels. Otherwise, related videos will show from the same channel.</p>
                                </div>

                            </div>
                        </PanelBody>
                        <CustomBranding attributes={attributes} setAttributes={setAttributes} />
                    </div>
                )
            }
        </div>


    )
}
