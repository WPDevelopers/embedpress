const { useState, useEffect } = wp.element;

export const mergeAtts = (defaults, attributes) => {
    const out = {};
    Object.keys(defaults).forEach(key => {
        if (key in attributes) {
            out[key] = attributes[key];
        }
        else {
            out[key] = defaults[key];
        }
    });
    return out;
}
export const getParams = (params, attributes, defaults) => {
    const atts = mergeAtts(defaults, attributes);

    return { ...params, ...atts };
}

export const arrToObject = (defaults) => {
    const defaultsObj = {};

    defaults.forEach(element => {
        defaultsObj[element] = '';
    });
    return defaultsObj;
}

export const isSelfHostedVideo = (url) => {
    return url.match(/\.(mp4|mov|avi|wmv|flv|mkv|webm|mpeg|mpg)$/i);
}
export const isSelfHostedAudio = (url) => {
    return url.match(/\.(mp3|wav|ogg|aac)$/i);
}

export const isFacebookPage = (url) => {
    const facebookPageRegex = /^(https?:\/\/)?(www\.)?facebook\.com\/\d{15,}\/?$/;
    return facebookPageRegex.test(url);
}


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

    const _isSelfHostedAudio = (isSelfHostedAudio(url));
    const _isSelfHostedVideo = (isSelfHostedVideo(url));


    // console.log({vautopause, vdnt})

    const intervalId = setInterval(() => {

        let playerElement = document.querySelector(`[data-playerid="${clientId}"] .ose-embedpress-responsive`);

        if (isSelfHostedVideo(url)) {
            playerElement = document.querySelector(`[data-playerid="${clientId}"] .ose-embedpress-responsive video`);
        }
        else if (isSelfHostedAudio(url)) {
            playerElement = document.querySelector(`[data-playerid="${clientId}"] .ose-embedpress-responsive audio`);
        }

        if (playerElement) {
            clearInterval(intervalId);

            let options = document.querySelector(`[data-playerid="${clientId}"]`).getAttribute('data-options');
            options = JSON.parse(options);

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

            player.poster = posterThumbnail;
        }
    }, 200);


}