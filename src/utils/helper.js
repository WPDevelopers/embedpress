/**
 * EmbedPress Helper Functions
 * 
 * Collection of utility functions for the EmbedPress block
 */

/**
 * Save source data for analytics tracking
 */
export const saveSourceData = (clientId, url) => {
    if (typeof embedpressGutenbergData === 'undefined' || !embedpressGutenbergData.ajax_url) {
        return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', embedpressGutenbergData.ajax_url);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log('EmbedPress: Source data saved successfully');
        } else {
            console.error('EmbedPress: Failed to save source data:', xhr.statusText);
        }
    };

    xhr.onerror = function () {
        console.error('EmbedPress: Request failed:', xhr.statusText);
    };

    const data = {
        action: 'save_source_data',
        block_id: clientId,
        source_url: url,
        _source_nonce: embedpressGutenbergData.source_nonce || '',
    };

    const encodedData = Object.keys(data)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
        .join('&');

    xhr.send(encodedData);
};

/**
 * Delete source data when block is removed
 */
export const deleteSourceData = (clientId) => {
    if (typeof embedpressGutenbergData === 'undefined' || !embedpressGutenbergData.ajax_url) {
        return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', embedpressGutenbergData.ajax_url);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log('EmbedPress: Source data deleted successfully');
        } else {
            console.error('EmbedPress: Failed to delete source data:', xhr.statusText);
        }
    };

    xhr.onerror = function () {
        console.error('EmbedPress: Request failed:', xhr.statusText);
    };

    const data = {
        action: 'delete_source_data',
        block_id: clientId,
        _source_nonce: embedpressGutenbergData.source_nonce || '',
    };

    const encodedData = Object.keys(data)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
        .join('&');

    xhr.send(encodedData);
};

/**
 * Track removed blocks and clean up their data
 */
export const removedBlockID = () => {
    if (typeof wp === 'undefined' || !wp.data) {
        return;
    }

    const getBlockList = () => wp.data.select('core/block-editor').getBlocks();
    let previousBlockList = getBlockList();

    wp.data.subscribe(() => {
        const currentBlockList = getBlockList();
        const removedBlocks = previousBlockList.filter(block => !currentBlockList.includes(block));

        if (removedBlocks.length && (currentBlockList.length < previousBlockList.length)) {
            const removedBlockClientIDs = removedBlocks
                .filter(block => block.name === 'embedpress/embedpress' && block.attributes.clientId)
                .map(block => block.attributes.clientId);

            if (removedBlockClientIDs.length > 0) {
                console.log(`EmbedPress: Blocks with IDs ${removedBlockClientIDs} were removed`);
                removedBlockClientIDs.forEach(clientId => deleteSourceData(clientId));
            }
        }

        previousBlockList = currentBlockList;
    });
};


/**
 * Get player options for custom player
 */
export const getPlayerOptions = ({ attributes }) => {
    const { customPlayer } = attributes;

    if (!customPlayer) {
        return '';
    }

    const {
        playerPreset,
        playerColor,
        posterThumbnail,
        playerPip,
        playerRestart,
        playerRewind,
        playerFastForward,
        playerTooltip,
        playerHideControls,
        playerDownload,
        // YouTube options
        starttime,
        endtime,
        relatedvideos,
        muteVideo,
        fullscreen,
        // Vimeo options
        vstarttime,
        vautoplay,
        vautopause,
        vdnt
    } = attributes;

    const playerOptions = {
        rewind: playerRewind,
        restart: playerRestart,
        pip: playerPip,
        poster_thumbnail: posterThumbnail,
        player_color: playerColor,
        player_preset: playerPreset,
        fast_forward: playerFastForward,
        player_tooltip: playerTooltip,
        hide_controls: playerHideControls,
        download: playerDownload,
        // YouTube
        ...(starttime && { start: starttime }),
        ...(endtime && { end: endtime }),
        ...(relatedvideos && { rel: relatedvideos }),
        ...(muteVideo && { mute: muteVideo }),
        ...(fullscreen && { fullscreen: fullscreen }),
        // Vimeo
        ...(vstarttime && { t: vstarttime }),
        ...(vautoplay && { autoplay: vautoplay }),
        ...(vautopause && { autopause: vautopause }),
        ...(vdnt && { dnt: vdnt }),
    };

    return JSON.stringify(playerOptions);
};

/**
 * Get carousel options for Instagram carousel
 */
export const getCarouselOptions = ({ attributes }) => {
    const {
        instaLayout,
        slidesShow,
        slidesScroll,
        carouselAutoplay,
        autoplaySpeed,
        transitionSpeed,
        carouselLoop,
        carouselArrows,
        carouselSpacing,
    } = attributes;

    if (instaLayout !== 'insta-carousel') {
        return '';
    }

    const carouselOptions = {
        layout: instaLayout,
        slideshow: slidesShow,
        autoplay: carouselAutoplay,
        autoplayspeed: autoplaySpeed,
        transitionspeed: transitionSpeed,
        loop: carouselLoop,
        arrows: carouselArrows,
        spacing: carouselSpacing
    };

    return JSON.stringify(carouselOptions);
};

/**
 * Platform Detection Functions
 */

// Self-hosted media detection
export const isSelfHostedVideo = (url) => {
    return url.match(/\.(mp4|mov|avi|wmv|flv|mkv|webm|mpeg|mpg)$/i);
};

export const isSelfHostedAudio = (url) => {
    return url.match(/\.(mp3|wav|ogg|aac)$/i);
};

// YouTube detection
export const isYTChannel = (url) => {
    const ytChannelPattern = /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:c\/|channel\/|user\/|@)[\w-]+\/?$/i;
    return ytChannelPattern.test(url);
};

export const isYTVideo = (url) => {
    const ytVideoPattern = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)[\w-]+/i;
    return ytVideoPattern.test(url) && !isYTChannel(url) && !isYTLive(url) && !isYTShorts(url);
};

export const isYTLive = (url) => {
    const ytLivePattern = /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:c\/|channel\/|user\/|@)[\w-]+\/live\/?$/i;
    return ytLivePattern.test(url);
};

export const isYTShorts = (url) => {
    const ytShortsPattern = /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/[\w-]+/i;
    return ytShortsPattern.test(url);
};

// Vimeo detection
export const isVimeoVideo = (url) => {
    const vimeoPattern = /^(?:https?:\/\/)?(?:www\.)?vimeo\.com\/\d+/i;
    return vimeoPattern.test(url);
};

// Wistia detection
export const isWistiaVideo = (url) => {
    const wistiaPattern = /\/medias\/|(?:https?:\/\/)?(?:www\.)?(?:wistia.com\/)(\w+)[^?\/]*$/i;
    return wistiaPattern.test(url);
};

// Instagram detection
export const isInstagramFeed = (url) => {
    const instaPattern = /^(?:https?:\/\/)?(?:www\.)?instagram\.com\/[\w.-]+\/?$/i;
    return instaPattern.test(url);
};

export const isInstagramHashtag = (url) => {
    const hashtagPattern = /^(?:https?:\/\/)?(?:www\.)?instagram\.com\/explore\/tags\/[\w.-]+\/?$/i;
    return hashtagPattern.test(url);
};

// OpenSea detection
export const isOpensea = (url) => {
    const openseaPattern = /^(?:https?:\/\/)?(?:www\.)?opensea\.io\/collection\/[\w.-]+\/?$/i;
    return openseaPattern.test(url);
};

export const isOpenseaSingle = (url) => {
    const openseaSinglePattern = /^(?:https?:\/\/)?(?:www\.)?opensea\.io\/assets\/[\w.-]+\/[\w.-]+\/?$/i;
    return openseaSinglePattern.test(url);
};

// Calendly detection
export const isCalendly = (url) => {
    const calendlyPattern = /^(?:https?:\/\/)?(?:www\.)?calendly\.com\/[\w.-]+/i;
    return calendlyPattern.test(url);
};

// TikTok detection
export const isTikTok = (url) => {
    const tiktokPattern = /^(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@[\w.-]+\/video\/([\w.-]+)$/i;
    return tiktokPattern.test(url);
};

// Spreaker detection
export const isSpreakerUrl = (url) => {
    const spreakerPattern = /^https?:\/\/(www\.)?spreaker\.com\/(show|user|podcast|episode)\/[^/]+/;
    return spreakerPattern.test(url);
};

// Google Photos detection
export const isGooglePhotosUrl = (url) => {
    const googlePhotosPattern = /^https:\/\/(photos\.app\.goo\.gl|photos\.google\.com)\/.*$/i;
    return googlePhotosPattern.test(url);
};

/**
 * Custom Player Initialization
 */
export const initCustomPlayer = (clientId, attributes) => {
    const {
        url,
        posterThumbnail,
        customPlayer,
        playerTooltip,
        playerHideControls,
        playerPreset,
        playerColor,
        playerPip,
        playerRestart,
        playerRewind,
        playerFastForward,
        fullscreen,
        vautopause,
        vdnt,
        vstarttime
    } = attributes;

    const autoPause = vautopause ? true : false;
    const vDnt = vdnt ? true : false;

    const _isSelfHostedAudio = isSelfHostedAudio(url);
    const _isSelfHostedVideo = isSelfHostedVideo(url);

    const intervalId = setInterval(() => {
        let playerElement = document.querySelector(`[data-playerid="${clientId}"] .ose-embedpress-responsive`);

        if (isSelfHostedVideo(url)) {
            playerElement = document.querySelector(`[data-playerid="${clientId}"] .ose-embedpress-responsive video`);
        } else if (isSelfHostedAudio(url)) {
            playerElement = document.querySelector(`[data-playerid="${clientId}"] .ose-embedpress-responsive audio`);
        }

        if (playerElement && typeof Plyr !== 'undefined') {
            clearInterval(intervalId);

            let options = document.querySelector(`[data-playerid="${clientId}"]`).getAttribute('data-options');
            options = JSON.parse(options);
            
            document.querySelector(`[data-playerid="${clientId}"]`).style.opacity = '1';

            const player = new Plyr(playerElement, {
                controls: [
                    'play-large',
                    'restart',
                    'rewind',
                    'play',
                    'fast-forward',
                    'progress',
                    'current-time',
                    'duration',
                    'mute',
                    'volume',
                    'captions',
                    'settings',
                    _isSelfHostedAudio ? '' : 'pip',
                    'airplay',
                    options.download ? 'download' : '',
                    _isSelfHostedAudio ? '' : 'fullscreen',
                ],
                hideControls: playerHideControls,
                tooltips: { controls: playerTooltip, seek: playerTooltip },
                // iOS fullscreen configuration
                fullscreen: {
                    enabled: true,
                    fallback: true,
                    iosNative: true
                },
                // Enable playsinline for iOS devices to allow custom controls
                playsinline: true,
                youtube: {
                    ...(options.autoplay && { autoplay: options.autoplay }),
                    ...(options.start && { start: options.start }),
                    ...(options.end && { end: options.end }),
                    ...(options.rel && { rel: options.rel }),
                    ...(options.fullscreen && { fs: options.fullscreen })
                },
                vimeo: {
                    byline: false,
                    portrait: false,
                    title: false,
                    speed: true,
                    transparent: false,
                    controls: false,
                    ...(options.t && { t: options.t }),
                    ...(options.vautoplay && { autoplay: options.vautoplay }),
                    ...(options.autopause && { autopause: options.autopause }),
                    ...(options.dnt && { dnt: options.dnt }),
                }
            });

            if (posterThumbnail) {
                player.poster = posterThumbnail;
            }
        }
    }, 200);
};

/**
 * Instagram Carousel Initialization
 */
export const initCarousel = (clientId, attributes) => {
    const {
        url,
        instaLayout,
        slidesShow,
        slidesScroll,
        carouselAutoplay,
        autoplaySpeed,
        transitionSpeed,
        carouselLoop,
        carouselArrows,
        carouselSpacing
    } = attributes;

    const options = {
        layout: instaLayout,
        slidesPerView: slidesShow,
        spacing: carouselSpacing,
        loop: carouselLoop,
        autoplay: carouselAutoplay,
        autoplaySpeed: autoplaySpeed,
        transitionSpeed: transitionSpeed,
        arrows: carouselArrows,
        breakpoints: {
            768: {
                slidesPerView: 2
            },
            1024: {
                slidesPerView: 4
            }
        }
    };

    const intervalId = setInterval(() => {
        let carouselSelector = document.querySelector(`[data-carouselid="${clientId}"] .embedpress-insta-container`);
        if (carouselSelector && typeof CgCarousel !== 'undefined') {
            clearInterval(intervalId);

            const carousel = new CgCarousel(`[data-carouselid="${clientId}"] .embedpress-insta-container`, options, {});

            if (carouselArrows) {
                const btnsElement = document.querySelector(`[data-carouselid="${clientId}"] .cg-carousel__btns`);
                if (btnsElement) {
                    btnsElement.classList.remove('hidden');
                }
            } else {
                const btnsElement = document.querySelector(`[data-carouselid="${clientId}"] .cg-carousel__btns`);
                if (btnsElement) {
                    btnsElement.classList.add('hidden');
                }
            }

            // Navigation
            const next1 = document.querySelector(`[data-carouselid="${clientId}"] #js-carousel__next-1`);
            if (next1) {
                next1.addEventListener('click', () => carousel.next());
            }

            const prev1 = document.querySelector(`[data-carouselid="${clientId}"] #js-carousel__prev-1`);
            if (prev1) {
                prev1.addEventListener('click', () => carousel.prev());
            }
        }
    }, 200);
};


export const getEmbedType = (url) => {
    if (!url) return '';

    const patterns = [
        // Video platforms
        { regex: /(?:youtube\.com|youtu\.be)/i, provider: 'YouTube' },
        { regex: /vimeo\.com/i, provider: 'Vimeo' },
        { regex: /wistia\.(?:com|net)/i, provider: 'Wistia' },
        { regex: /twitch\.tv/i, provider: 'Twitch' },
        { regex: /dailymotion\.com/i, provider: 'Dailymotion' },

        // Google services
        { regex: /docs\.google\.com/i, provider: 'Google Docs' },
        { regex: /sheets\.google\.com/i, provider: 'Google Sheets' },
        { regex: /slides\.google\.com/i, provider: 'Google Slides' },
        { regex: /forms\.google\.com/i, provider: 'Google Forms' },
        { regex: /drive\.google\.com/i, provider: 'Google Drive' },
        { regex: /(?:maps\.google\.com|goo\.gl)/i, provider: 'Google Maps' },
        { regex: /(?:photos\.google\.com|photos\.app\.goo\.gl)/i, provider: 'Google Photos' },

        // Social media
        { regex: /instagram\.com/i, provider: 'Instagram' },
        { regex: /(?:twitter\.com|x\.com)/i, provider: 'Twitter' },
        { regex: /linkedin\.com/i, provider: 'LinkedIn' },
        { regex: /facebook\.com/i, provider: 'Facebook' },

        // Audio platforms
        { regex: /soundcloud\.com/i, provider: 'SoundCloud' },
        { regex: /spotify\.com/i, provider: 'Spotify' },
        { regex: /spreaker\.com/i, provider: 'Spreaker' },
        { regex: /boomplay\.com/i, provider: 'Boomplay' },

        // Business tools
        { regex: /calendly\.com/i, provider: 'Calendly' },
        { regex: /airtable\.com/i, provider: 'Airtable' },
        { regex: /canva\.com/i, provider: 'Canva' },

        // Development
        { regex: /github\.com/i, provider: 'GitHub' },

        // E-commerce
        { regex: /opensea\.io/i, provider: 'OpenSea' },
        { regex: /gumroad\.com/i, provider: 'Gumroad' },

        // Media
        { regex: /giphy\.com/i, provider: 'GIPHY' },
        { regex: /(?:radio\.nrk\.no|nrk\.no)/i, provider: 'NRK Radio' },

        // Documents
        { regex: /\.pdf$/i, provider: 'PDF Document' }
    ];

    for (const { regex, provider } of patterns) {
        if (regex.test(url)) return provider;
    }

    // Fallback: extract domain name and capitalize it
    const domainMatch = url.match(/https?:\/\/(?:www\.)?([^.\/]+)\.(?:com|net|org|io|tv|co|fm|ly)/i);
    if (domainMatch?.[1]) {
        const domain = domainMatch[1];
        return domain.charAt(0).toUpperCase() + domain.slice(1);
    }

    return '';
};
