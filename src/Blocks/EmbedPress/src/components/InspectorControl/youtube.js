/**
 * WordPress dependencies
 */
import { getParams } from '../../../../../utils/functions';
import { addProAlert, isPro, removeAlert, addTipsTrick, removeTipsAlert, tipsTricksAlert, wrapFiltered } from '../../../../GlobalCoponents/helper';
import { EPIcon } from '../../../../GlobalCoponents/icons';
import CustomBranding from './custombranding';
import CustomPlayerControls from '../../../../GlobalCoponents/custom-player-controls';
import CustomPlayerAdvancedPanels from '../../../../GlobalCoponents/custom-player-advanced-panels';


const { isShallowEqualObjects } = wp.isShallowEqual;
const { useState, useEffect } = wp.element;
const { applyFilters } = wp.hooks;
const { __ } = wp.i18n;
const { addFilter } = wp.hooks;



const {
    TextControl,
    SelectControl,
    RangeControl,
    ToggleControl,
    PanelBody,
} = wp.components;



export const init = () => {
    addFilter('embedpress_block_rest_param', 'embedpress', getYoutubeParams, 10);
}

export const getYoutubeParams = (params, attributes) => {

    if (!attributes.url) {
        return params;
    }


    let ytvAtts = {};
    let ytcAtts = {};

    if (isYTVideo(attributes.url) || isYTLive(attributes.url) || isYTShorts(attributes.url)) {
        ytvAtts = {
            videosize: 'fixed',
            starttime: '',
            endtime: '',
            autoplay: false,
            muteVideo: true,
            controls: '2',
            fullscreen: true,
            videoannotations: true,
            progressbarcolor: 'red',
            closedcaptions: false,
            modestbranding: '0',
            relatedvideos: true,
            customPlayer: false,
            posterThumbnail: '',
            playerPreset: '',
            playerColor: '',
            playerRestart: false,
            playerRewind: false,
            playerFastForward: false,
            playerTooltip: false,
            playerHideControls: false,
        }
    }

    if ((isYTChannel(attributes.url) || isYTPlaylist(attributes.url)) && !isYTLive(attributes.url)) {
        // Default differs by URL: playlist → queue (new immersive layout),
        // channel → gallery (legacy).
        ytcAtts = {
            pagesize: 6,
            ytChannelLayout: isYTPlaylist(attributes.url) ? 'queue' : 'gallery',
            ytPlaylistMode: 'playlist',
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
    if (!url) return false;
    const youtubeChannelMatch = url.match(/^(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:c\/|channel\/|user\/|@)([^\/\?]+)/i);

    if (!youtubeChannelMatch) {
        return false;
    }

    return true;
};

// Any YouTube URL with a list= parameter:
//   /playlist?list=PL…              (playlist landing)
//   /watch?v=…&list=PL|RD|UU…        (video inside playlist / Mix radio)
export const isYTPlaylist = (url) => {
    if (!url) return false;
    return /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:playlist|watch)\?(?:[^#]*&)?list=[\w-]+/i.test(url);
};

export const isYTLive = (url) => {
    if (!url) return false;
    const liveMatch = url.match(/^https?:\/\/(?:www\.)?youtube\.com\/(?:channel\/[\w-]+|@[\w-]+)\/live$/);
    if (!liveMatch)
        return false;
    return true;
}

export const isYTShorts = (url) => {
    if (!url) return false;
    const regex = /^https:\/\/www\.youtube\.com\/shorts\/[A-Za-z0-9_-]+$/;
    return regex.test(url);
}

export const isYTVideo = (url) => {
    if (!url) return false;
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
        ytChannelLayout: null,
        ytPlaylistLayout: null,
        ytPlaylistMode: null,
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
        muteVideo: null,
        controls: null,
        fullscreen: null,
        videoannotations: null,
        progressbarcolor: null,
        closedcaptions: null,
        modestbranding: null,
        relatedvideos: null,
        customPlayer: null,
        posterThumbnail: null,
        playerPreset: null,
        playerColor: null,
        playerRestart: null,
        playerRewind: null,
        playerFastForward: null,
        playerTooltip: null,
        playerHideControls: null,
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

export const useYoutube = (attributes, url) => {
    // Note: init() is already called in index.js, so we don't need to call it here
    const isChannelLike = isYTChannel(url) || isYTPlaylist(url);
    const attrs = isChannelLike ? useYTChannel(attributes) : useYTVideo(attributes);

    return {
        youtubeParams: attrs,
        isYTChannel: isYTChannel(url),
        isYTPlaylist: isYTPlaylist(url),
        isYTVideo: isYTVideo(url),
        isYTLive: isYTLive(url),
    };
}


export default function Youtube({ attributes, setAttributes, isYTChannel, isYTPlaylist, isYTVideo, isYTLive, isYTShorts }) {

    const {
        url,
        ispagination,
        pagesize,
        ytChannelLayout,
        ytPlaylistLayout,
        ytPlaylistMode,
        columns,
        gapbetweenvideos,
        videosize,
        starttime,
        endtime,
        autoplay,
        muteVideo,
        controls,
        fullscreen,
        videoannotations,
        progressbarcolor,
        closedcaptions,
        modestbranding,
        relatedvideos,
        customPlayer
    } = attributes;

    // Playlist URLs (including watch?v=…&list=…) get a mode toggle so the
    // user can pick "single video" vs "playlist queue" — the URL alone is
    // ambiguous when both v= and list= are present.
    const showPlaylistMode = isYTPlaylist;
    const effectivePlaylistMode = ytPlaylistMode || 'playlist';
    const showLayoutControls = !showPlaylistMode || effectivePlaylistMode === 'playlist';
    // Playlist-only layouts (Queue / Theatre) live on ytPlaylistLayout to
    // keep them isolated from the channel layouts (ytChannelLayout).
    const effectivePlaylistLayout = ytPlaylistLayout || 'queue';


    const isProPluginActive = embedpressGutenbergData.isProPluginActive;

    const onSelectImage = (logo) => {
        setAttributes({ posterThumbnail: logo.sizes.full.url });
    }
    const removeImage = (e) => {
        setAttributes({ posterThumbnail: '' });
    }

    if (!document.querySelector('.pro__alert__wrap')) {
        document.querySelector('body').append(isPro('none'));
        removeAlert();
    }

    if (!document.querySelector('.tips__alert__wrap')) {
        document.querySelector('body').append(tipsTricksAlert('none'));
        removeTipsAlert();
    }

    const togglePlaceholder = applyFilters('embedpress.togglePlaceholder', [], __('Closed Captions', 'embedpress'), true);
    const selectPlaceholder = applyFilters('embedpress.selectPlaceholder', [], __('Modest Branding', 'embedpress'), 'display', 'Display');

    if (ytChannelLayout === 'grid' && columns === 1) {
        setAttributes({ columns: 3 });
    }
    if (ytChannelLayout === 'list') {
        setAttributes({ columns: 1 });
    }
    let videoPerPageText = 'Video per page';
    if (ytChannelLayout === 'carousel') {
        videoPerPageText = "Number of videos (max 50)"
    }

    let proLabel = ' (Pro)';
    if (isProPluginActive) {
        proLabel = '';
    }

    if (!isProPluginActive && (ytChannelLayout == 'grid' || ytChannelLayout == 'carousel')) {
        addProAlert(null, isProPluginActive);
        setAttributes({ ytChannelLayout: 'gallery' });
    }

    return (
        <div>


            {
                ((isYTChannel || isYTPlaylist) && !isYTLive) && (
                    <div className={'ep__channel-yt-video-options'}>
                        <PanelBody title={<div className='ep-pannel-icon'>{EPIcon} {__(isYTPlaylist && !isYTChannel ? 'YouTube Playlist' : 'YouTube Channel', 'embedpress')}</div>} initialOpen={false}>

                        {showPlaylistMode && (
                            <>
                                <SelectControl
                                    label={__('Embed as', 'embedpress')}
                                    value={effectivePlaylistMode}
                                    options={[
                                        { label: __('Playlist (queue / gallery / list / grid / carousel)', 'embedpress'), value: 'playlist' },
                                        { label: __('Single video (just the first video, no playlist UI)', 'embedpress'), value: 'single' },
                                    ]}
                                    onChange={(ytPlaylistMode) => setAttributes({ ytPlaylistMode })}
                                    __nextHasNoMarginBottom
                                />
                                <p style={{ marginTop: '-8px', marginBottom: '12px' }}>
                                    {effectivePlaylistMode === 'single'
                                        ? __('Renders just the v= video (or the playlist\'s first item) as a plain embed.', 'embedpress')
                                        : __('Renders the full playlist with the layout selected below.', 'embedpress')}
                                </p>
                            </>
                        )}

                        {showLayoutControls && (<>
                        {isYTPlaylist ? (
                            <SelectControl
                                label={__("Playlist Layout", "embedpress")}
                                value={effectivePlaylistLayout}
                                options={[
                                    { label: __('Queue (player + scrollable list)', 'embedpress'), value: 'queue' },
                                    { label: __('Theatre (player + horizontal cards)', 'embedpress'), value: 'theatre' },
                                    { label: __('Library (grid of cards + modal player)', 'embedpress') + proLabel, value: 'library' },
                                    { label: __('Spotlight (hero player + side rail)', 'embedpress') + proLabel, value: 'spotlight' },
                                    { label: __('Cinema (immersive player + slide-out queue)', 'embedpress') + proLabel, value: 'cinema' },
                                    { label: __('Magazine (editorial hero + rail)', 'embedpress') + proLabel, value: 'magazine' },
                                ]}
                                onChange={(ytPlaylistLayout) => setAttributes({ ytPlaylistLayout })}
                                __nextHasNoMarginBottom
                            />
                        ) : (
                            <SelectControl
                                label={__("Layout", "embedpress")}
                                value={ytChannelLayout || 'gallery'}
                                options={[
                                    { label: 'Gallery', value: 'gallery' },
                                    { label: 'List', value: 'list' },
                                    { label: 'Grid' + proLabel, value: 'grid' },
                                    { label: 'Carousel' + proLabel, value: 'carousel' },
                                ]}
                                onChange={(ytChannelLayout) => setAttributes({ ytChannelLayout })}
                                __nextHasNoMarginBottom
                            />
                        )}

                        <TextControl
                            label={__(videoPerPageText)}
                            value={pagesize}
                            onChange={(pagesize) => setAttributes({ pagesize })}
                        />
                        <p>Specify the number of videos you wish to show on each page.</p>

                        {/* Channel-only options (Column/Gap/Pagination) — hidden for
                            playlist URLs, whose layouts (Queue/Theatre) own their
                            own visual shape. */}
                        {!isYTPlaylist && ytChannelLayout !== 'list' && ytChannelLayout !== 'carousel' && (
                            <SelectControl
                                label={__("Column")}
                                value={columns}
                                options={[
                                    { label: 'Auto', value: 'auto' },
                                    { label: '1', value: '1' },
                                    { label: '2', value: '2' },
                                    { label: '3', value: '3' },
                                    { label: '4', value: '4' },
                                    { label: '6', value: '6' },
                                ]}
                                onChange={(columns) => setAttributes({ columns })}
                                __nextHasNoMarginBottom
                            />
                        )}
                        {!isYTPlaylist && ytChannelLayout !== 'carousel' && (
                            <div>
                                <RangeControl
                                    label={__('Gap Between Videos')}
                                    value={gapbetweenvideos}
                                    onChange={(gap) => setAttributes({ gapbetweenvideos: gap })}
                                    min={1}
                                    max={100}
                                />
                                <p>Specify the gap between youtube videos.</p>
                            </div>
                        )}

                        {!isYTPlaylist && ytChannelLayout != 'carousel' && (
                                <ToggleControl
                                    label={__("Pagination")}
                                    checked={ispagination}
                                    onChange={(ispagination) => setAttributes({ ispagination })}
                                />
                            )
                        }
                        </>)}

                        <div className={'ep-tips-and-tricks'}>
                            {EPIcon}
                            <a href="#" target={'_blank'} onClick={(e) => { e.preventDefault(); addTipsTrick(e) }}> {__("Tips & Tricks", "embedpress")} </a>
                        </div>

                        </PanelBody>
                    </div>
                )
            }


            {
                (isYTVideo || isYTLive || isYTShorts) && (
                    <div className={'ep__single-yt-video-options'}>
                        <PanelBody title={<div className='ep-pannel-icon'>{EPIcon} {__('Video Controls', 'embedpress')}</div>} initialOpen={false}>
                            <ToggleControl
                                label={__("Enable Custom Player", "embedpress")}
                                checked={customPlayer}
                                onChange={(customPlayer) => setAttributes({ customPlayer })}
                            />

                            {
                                !customPlayer ? (
                                    <div className={'ep-video-controlers'}>
                                        <TextControl
                                            label={__("Start Time (in seconds)")}
                                            value={starttime}
                                            onChange={(starttime) => setAttributes({ starttime })}
                                            type={'number'}
                                            className={'ep-control-field'}
                                        />

                                        <TextControl
                                            label={__("End Time (in seconds)")}
                                            value={endtime}
                                            onChange={(endtime) => setAttributes({ endtime })}
                                            type={'number'}
                                            className={'ep-control-field'}
                                        />

                                        <ToggleControl
                                            label={__("Auto Play")}
                                            checked={autoplay}
                                            onChange={(autoplay) => setAttributes({ autoplay })}
                                        />
                                        {
                                            autoplay && (
                                                <div className='ep-yt-mute-videos'>
                                                    <ToggleControl
                                                        label={__("Mute")}
                                                        checked={muteVideo}
                                                        onChange={(muteVideo) => setAttributes({ muteVideo })}
                                                    />
                                                    <p>Mute the video to ensure autoplay works smoothly across all browsers. Recommended for autoplay-enabled videos.</p>
                                                </div>
                                            )
                                        }


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

                                        {wrapFiltered(applyFilters('embedpress.youtubeControls', [togglePlaceholder], attributes, setAttributes, 'closedCaptions'))}
                                        {wrapFiltered(applyFilters('embedpress.youtubeControls', [selectPlaceholder], attributes, setAttributes, 'modestBranding'))}

                                        <div className='ep-yt-related-videos'>
                                            <ToggleControl
                                                label={__("Related Videos")}
                                                checked={relatedvideos}
                                                onChange={(relatedvideos) => setAttributes({ relatedvideos })}
                                            />
                                            <p>Enable to display related videos from all channels. Otherwise, related videos will show from the same channel.</p>
                                        </div>

                                    </div>
                                ) : (
                                    <div className={'ep-video-controlers'}>
                                        <CustomPlayerControls attributes={attributes} setAttributes={setAttributes} isYTVideo={isYTVideo} isYTLive={isYTLive} />
                                    </div>
                                )
                            }

                        </PanelBody>
                        <CustomPlayerAdvancedPanels attributes={attributes} setAttributes={setAttributes} isYTVideo={isYTVideo} isYTLive={isYTLive} />
                    </div>
                )
            }
        </div>


    )
}
