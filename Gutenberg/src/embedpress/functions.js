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


export const initCustomPlayer = (clientId, attributes) => {

    const {
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
    } = attributes;

    const intervalId = setInterval(() => {
        const playerElement = document.querySelector(`[data-playerid="${clientId}"] > .ose-embedpress-responsive`);

        if (playerElement) {
            clearInterval(intervalId);

            const player = new Plyr(playerElement, {
                controls: [
                    'play-large', 'restart', 'rewind', 'play', 'fast-forward', 'progress', 'current-time',
                    'duration', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'download', 'fullscreen'
                ],
                hideControls: playerHideControls,
                tooltips: { controls: playerTooltip, seek: playerTooltip },
                vimeo: {
                    // Vimeo-specific options go here
                    byline: false,
                    portrait: false,
                    title: false,
                    speed: true,
                    transparent: false,
                    controls: false,
                  }

            });

            player.poster = posterThumbnail;
        }
    }, 200);
}