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
                removedBlockClientIDs.forEach(clientId => deleteSourceData(clientId));
            }
        }

        previousBlockList = currentBlockList;
    });
};

/**
 * Generate social share icons HTML
 */
export const shareIconsHtml = (sharePosition, shareFacebook, shareTwitter, sharePinterest, shareLinkedin) => {
    let shareHtml = `<div class="ep-social-share share-position-${sharePosition}">`;

    if (shareFacebook) {
        shareHtml += `
        <a href="#" class="ep-social-icon facebook" target="_blank">
            <svg fill="#ffffff" height="24" width="24" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
        </a>`;
    }

    if (shareTwitter) {
        shareHtml += `
        <a href="#" class="ep-social-icon twitter" target="_blank">
            <svg fill="#ffffff" height="24" width="24" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
        </a>`;
    }

    if (sharePinterest) {
        shareHtml += `
        <a href="#" class="ep-social-icon pinterest" target="_blank">
            <svg fill="#ffffff" height="24" width="24" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
            </svg>
        </a>`;
    }

    if (shareLinkedin) {
        shareHtml += `
        <a href="#" class="ep-social-icon linkedin" target="_blank">
            <svg fill="#ffffff" height="24" width="24" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
        </a>`;
    }

    shareHtml += '</div>';
    return shareHtml;
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
    const ytChannelPattern = /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:c\/|channel\/|user\/|@)[\w.-]+\/?$/i;
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
