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


export const initCustomPlayers = () => {
    let embedWrappers = document.querySelectorAll('.ep-embed-content-wraper');
    console.log(embedWrappers);
    embedWrappers.forEach(wrapper => {
        initPlayer(wrapper);
    });

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            const addedNodes = Array.from(mutation.addedNodes);
            addedNodes.forEach(node => {
                traverseAndInitPlayer(node);
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    function traverseAndInitPlayer(node) {
        if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('ep-embed-content-wraper')) {
            initPlayer(node);
        }

        if (node.hasChildNodes()) {
            node.childNodes.forEach(childNode => {
                traverseAndInitPlayer(childNode);
            });
        }
    }

    function initPlayer(wrapper) {
        const playerId = wrapper.getAttribute('data-playerid');
        if (playerId && !wrapper.classList.contains('plyr-initialized')) {
            const selector = `[data-playerid="${playerId}"] > .ose-embedpress-responsive`;
            new Plyr(selector, {
                controls: [
                    'play-large', 'restart', 'rewind', 'play', 'fast-forward', 'progress', 'current-time',
                    'duration', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'download', 'fullscreen'
                ],
                seekTime: 10,
                ads: { enabled: false, publisherId: '', tagUrl: 'https://googleads.github.io/googleads-ima-html5/vsi/' }
            });
            wrapper.classList.add('plyr-initialized');
        }
    }
}