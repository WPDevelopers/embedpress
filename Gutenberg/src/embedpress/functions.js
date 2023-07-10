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



let epGlobals = {};

(function ($) {
    'use strict';
    // function equivalent to jquery ready()
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    const prevIcon = '<svg width="20" height="30" viewBox="-5 0 23 23" xmlns="http://www.w3.org/2000/svg"><path d="M11.24.29.361 10.742l-.06.054a.97.97 0 0 0-.301.642v.124a.97.97 0 0 0 .3.642l.054.044L11.239 22.71a1.061 1.061 0 0 0 1.459 0 .964.964 0 0 0 0-1.402l-10.15-9.746 10.15-9.87a.964.964 0 0 0 0-1.402 1.061 1.061 0 0 0-1.459 0Z" fill="#fff"/></svg>';

    const nextIcon = '<svg width="20" height="30" viewBox="-5 0 23 23" xmlns="http://www.w3.org/2000/svg"><path d="m1.76.29 10.879 10.452.06.054a.97.97 0 0 1 .301.642v.124a.97.97 0 0 1-.3.642l-.054.044L1.761 22.71a1.061 1.061 0 0 1-1.459 0 .964.964 0 0 1 0-1.402l10.15-9.746-10.15-9.87a.964.964 0 0 1 0-1.402 1.061 1.061 0 0 1 1.459 0Z" fill="#fff"/></svg>';

    epGlobals.initCarousel = () => {
        const carousel = document.addEventListener('click', () => {
            
        });
    }

    epGlobals.initCarousel = (selector, options) => {
        $(selector).slick({
            loop: true,
            autoplay: true,
            centerPadding: '60px',
            slidesToShow: 4,
            slidesToScroll: 4,
            prevArrow: '<button type="button" class="slick-prev">' + prevIcon + '</button>',

            nextArrow: '<button type="button" class="slick-next">' + nextIcon + '</button>'
        });
    }

    setTimeout(() => {
        if ($('.carousel').length > 0) {
            epGlobals.initCarousel('.carousel', {});
        }

        console.log($('.carousel'));

    }, 15000);


    console.log('this is a carousel');

})(jQuery);