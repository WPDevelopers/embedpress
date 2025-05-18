export const addProAlert = (e, isProPluginActive) => {
    if (!isProPluginActive) {
        document.querySelector('.pro__alert__wrap').style.display = 'block';
    }
}

export const removeAlert = () => {
    if (document.querySelector('.pro__alert__wrap')) {
        document.querySelector('.pro__alert__wrap .pro__alert__card .button').addEventListener('click', (e) => {
            document.querySelector('.pro__alert__wrap').style.display = 'none';
        });
    }
}

export const isPro = (display) => {
    const alertPro = `
		<div class="pro__alert__wrap" style="display: none;">
			<div class="pro__alert__card">
				<img src="../wp-content/plugins/embedpress/EmbedPress/Ends/Back/Settings/assets/img/alert.svg" alt=""/>
					<h2>Opps...</h2>
					<p>You need to upgrade to the <a href="https://wpdeveloper.com/in/upgrade-embedpress" target="_blank">Premium</a> Version to use this feature</p>
					<a href="#" class="button radius-10">Close</a>
			</div>
		</div>
		`;

    const dom = document.createElement('div');
    dom.innerHTML = alertPro;

    return dom;
}
export const removeTipsAlert = () => {
    if (document.querySelector('.tips__alert__wrap')) {
        document.querySelector('.tips__alert__wrap .tips__alert__card .button').addEventListener('click', (e) => {
            document.querySelector('.tips__alert__wrap').style.display = 'none';
        });
    }
}

export const addTipsTrick = (e) => {
    document.querySelector('.tips__alert__wrap').style.display = 'block';
}


export const tipsTricksAlert = () => {
    const alertTipsTricks = `
		<div class="tips__alert__wrap" style="display: none;">
			<div class="tips__alert__card">
				<img src="../wp-content/plugins/embedpress/EmbedPress/Ends/Back/Settings/assets/img/idea.svg" alt=""/>
					<h2>Simply add "/live" to the channel's URL to embed a live video.</h2>
					<p>Note: If there are multiple live videos on the channel, just the most recent ones will be seen. </p>
					<a href="#" class="button radius-10">Close</a>
			</div>
		</div>
		`;

    const dom = document.createElement('div');
    dom.innerHTML = alertTipsTricks;

    return dom;
}

export const saveSourceData = (clientId, url) => {
    const xhr = new XMLHttpRequest();

    xhr.open('POST', ajaxurl);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log('Request successful:', xhr.responseText);
        } else {
            console.error('Request failed:', xhr.statusText);
        }
    };

    xhr.onerror = function () {
        console.error('Request failed:', xhr.statusText);
    };

    const data = {
        action: 'save_source_data',
        block_id: clientId,
        source_url: url,
        _source_nonce: embedpressObj.source_nonce,

    };

    const encodedData = Object.keys(data)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
        .join('&');

    xhr.send(encodedData);

};

export const deleteSourceData = (clientId) => {
    const xhr = new XMLHttpRequest();

    xhr.open('POST', ajaxurl);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log('Request successful:', xhr.responseText);
        } else {
            console.error('Request failed:', xhr.statusText);
        }
    };

    xhr.onerror = function () {
        console.error('Request failed:', xhr.statusText);
    };

    const data = {
        action: 'delete_source_data',
        block_id: clientId,
        _source_nonce: embedpressObj.source_nonce,
    };

    const encodedData = Object.keys(data)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
        .join('&');

    xhr.send(encodedData);

};


export const removedBlockID = () => {
    const getBlockList = () => wp.data.select('core/block-editor').getBlocks();
    let previousBlockList = getBlockList();
    wp.data.subscribe(() => {
        const currentBlockList = getBlockList();
        const removedBlocks = previousBlockList.filter(block => !currentBlockList.includes(block));

        if (removedBlocks.length && (currentBlockList.length < previousBlockList.length)) {
            const removedBlockClientIDs = removedBlocks.map(block => block.attributes.clientId);
            // console.log(`Blocks with IDs ${removedBlockClientIDs} were removed`);
            deleteSourceData(removedBlockClientIDs);

        }

        previousBlockList = currentBlockList;
    });
}
export const shareIconsHtml = (sharePosition, shareFacebook, shareTwitter, sharePinterest, shareLinkedin) => {
    let shareHtml = `<div class="ep-social-share share-position-${sharePosition}">`;

    // Only add Facebook icon if shareFacebook is true
    if (shareFacebook) {
        shareHtml += `
        <a href="#" class="ep-social-icon facebook" target="_blank">
            <svg width="64px" height="64px" viewBox="0 -6 512 512" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0" /><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" /><g id="SVGRepo_iconCarrier"><path fill="#475a96" d="M0 0h512v500H0z" /><path d="M375.717 112.553H138.283c-8.137 0-14.73 6.594-14.73 14.73v237.434c0 8.135 6.594 14.73 14.73 14.73h127.826V276.092h-34.781v-40.28h34.781v-29.705c0-34.473 21.055-53.244 51.807-53.244 14.73 0 27.391 1.097 31.08 1.587v36.026l-21.328.01c-16.725 0-19.963 7.947-19.963 19.609v25.717h39.887l-5.193 40.28h-34.693v103.355h68.012c8.135 0 14.73-6.596 14.73-14.73V127.283c-.001-8.137-6.596-14.73-14.731-14.73z" fill="#ffffff" /></g></svg>
        </a>`;
    }

    // Only add Twitter icon if shareTwitter is true
    if (shareTwitter) {
        shareHtml += `
        <a href="#" class="ep-social-icon twitter" target="_blank">
            <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 248 204">
                <path fill="#ffffff"
                    d="M221.95 51.29c.15 2.17.15 4.34.15 6.53 0 66.73-50.8 143.69-143.69 143.69v-.04c-27.44.04-54.31-7.82-77.41-22.64 3.99.48 8 .72 12.02.73 22.74.02 44.83-7.61 62.72-21.66-21.61-.41-40.56-14.5-47.18-35.07 7.57 1.46 15.37 1.16 22.8-.87-23.56-4.76-40.51-25.46-40.51-49.5v-.64c7.02 3.91 14.88 6.08 22.92 6.32C11.58 63.31 4.74 33.79 18.14 10.71c25.64 31.55 63.47 50.73 104.08 52.76-4.07-17.54 1.49-35.92 14.61-48.25 20.34-19.12 52.33-18.14 71.45 2.19 11.31-2.23 22.15-6.38 32.07-12.26-3.77 11.69-11.66 21.62-22.2 27.93 10.01-1.18 19.79-3.86 29-7.95-6.78 10.16-15.32 19.01-25.2 26.16z" />
            </svg>
        </a>`;
    }

    // Only add Pinterest icon if sharePinterest is true
    if (sharePinterest) {
        shareHtml += `
        <a href="#" class="ep-social-icon pinterest" target="_blank">
            <svg xmlns="http://www.w3.org/2000/svg" height="800" width="1200" viewBox="-36.42015 -60.8 315.6413 364.8">
                <path
                    d="M121.5 0C54.4 0 0 54.4 0 121.5 0 173 32 217 77.2 234.7c-1.1-9.6-2-24.4.4-34.9 2.2-9.5 14.2-60.4 14.2-60.4s-3.6-7.3-3.6-18c0-16.9 9.8-29.5 22-29.5 10.4 0 15.4 7.8 15.4 17.1 0 10.4-6.6 26-10.1 40.5-2.9 12.1 6.1 22 18 22 21.6 0 38.2-22.8 38.2-55.6 0-29.1-20.9-49.4-50.8-49.4-34.6 0-54.9 25.9-54.9 52.7 0 10.4 4 21.6 9 27.7 1 1.2 1.1 2.3.8 3.5-.9 3.8-3 12.1-3.4 13.8-.5 2.2-1.8 2.7-4.1 1.6-15.2-7.1-24.7-29.2-24.7-47.1 0-38.3 27.8-73.5 80.3-73.5 42.1 0 74.9 30 74.9 70.2 0 41.9-26.4 75.6-63 75.6-12.3 0-23.9-6.4-27.8-14 0 0-6.1 23.2-7.6 28.9-2.7 10.6-10.1 23.8-15.1 31.9 11.4 3.5 23.4 5.4 36 5.4 67.1 0 121.5-54.4 121.5-121.5C243 54.4 188.6 0 121.5 0z"
                    fill="#fff" />
            </svg>
        </a>`;
    }

    // Only add LinkedIn icon if shareLinkedin is true
    if (shareLinkedin) {
        shareHtml += `
        <a href="#" class="ep-social-icon linkedin" target="_blank">
            <svg fill="#ffffff" height="800px" width="800px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 310 310" xml:space="preserve"><g id="XMLID_801_"><path id="XMLID_802_" d="M72.16,99.73H9.927c-2.762,0-5,2.239-5,5v199.928c0,2.762,2.238,5,5,5H72.16c2.762,0,5-2.238,5-5V104.73
        C77.16,101.969,74.922,99.73,72.16,99.73z"/><path id="XMLID_803_" d="M41.066,0.341C18.422,0.341,0,18.743,0,41.362C0,63.991,18.422,82.4,41.066,82.4
        c22.626,0,41.033-18.41,41.033-41.038C82.1,18.743,63.692,0.341,41.066,0.341z"/><path id="XMLID_804_" d="M230.454,94.761c-24.995,0-43.472,10.745-54.679,22.954V104.73c0-2.761-2.238-5-5-5h-59.599
        c-2.762,0-5,2.239-5,5v199.928c0,2.762,2.238,5,5,5h62.097c2.762,0,5-2.238,5-5v-98.918c0-33.333,9.054-46.319,32.29-46.319
        c25.306,0,27.317,20.818,27.317,48.034v97.204c0,2.762,2.238,5,5,5H305c2.762,0,5-2.238,5-5V194.995
        C310,145.43,300.549,94.761,230.454,94.761z"/></g></svg>
        </a>`;
    }

    shareHtml += `</div>`;

    return shareHtml;
}

export const passwordShowHide = (value) => {
    if (document.querySelector('.lock-content-pass-input span')) {
        const showEye = document.querySelector('.lock-content-pass-input .pass-show');
        const hideEye = document.querySelector('.lock-content-pass-input .pass-hide');

        if (value === 'show') {
            showEye.classList.remove('active');
            hideEye.classList.add('active');
            document.querySelector('.lock-content-pass-input input').setAttribute('type', 'text');
        }
        if (value === 'hide') {
            hideEye.classList.remove('active');
            showEye.classList.add('active');
            document.querySelector('.lock-content-pass-input input').setAttribute('type', 'password');
        }
    }
}

export const copiedMessage = () => {
    const passwordInput = document.querySelector(".lock-content-pass-input input");
    const tooltip = document.querySelector('.copy-tooltip');
    setTimeout(() => {
        tooltip.classList.add('show');
    }, 10);

    setTimeout(() => {
        tooltip.classList.remove('show');
        passwordInput.selectionStart = passwordInput.selectionEnd;
    }, 1000);
}

export const copyPassword = (inputRef) => {

    const passwordInput = inputRef.current;
    const tempInput = document.createElement('input');
    tempInput.type = 'text';
    tempInput.value = passwordInput.value;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');

    passwordInput.select();
    document.body.removeChild(tempInput);

    setTimeout(() => {
        passwordInput.selectionStart = passwordInput.selectionEnd;
    }, 1000);

    copiedMessage();
}

export const isFileUrl = (url) => {
    const pattern = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/i;
    return pattern.test(url);
}

export const epGetColorBrightness = (hexColor) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    // Convert the RGB color to HSL
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;

    // Calculate the brightness position in percentage
    const brightnessPercentage = Math.round(l / 255 * 100);

    return brightnessPercentage;
}
export const epAdjustHexColor = (hexColor, percentage) => {
    // Convert hex color to RGB values
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    // Calculate adjusted RGB values
    const adjustment = Math.round((percentage / 100) * 255);
    const newR = Math.max(Math.min(r + adjustment, 255), 0);
    const newG = Math.max(Math.min(g + adjustment, 255), 0);
    const newB = Math.max(Math.min(b + adjustment, 255), 0);

    // Convert adjusted RGB values back to hex color
    const newHexColor = '#' + ((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1);

    return newHexColor;
}

// check if is valid instafeed url
export const isInstagramFeed = (url) => {
    const pattern = /^(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:[a-zA-Z0-9_\.]+\/?|explore\/tags\/[a-zA-Z0-9_\-]+\/?)$/;
    return pattern.test(url);
}


const pattern = /^(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:[a-zA-Z0-9_\.]+\/?|explore\/tags\/[a-zA-Z0-9_\-]+\/?)$/;
const url = "your-instagram-url-here"; // Replace this with the actual URL you want to check
const isMatch = pattern.test(url);


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

        // youtube options
        starttime,
        endtime,
        relatedvideos,
        muteVideo,
        fullscreen,

        // vimeo options
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

        // youutube
        ...(starttime && { start: starttime }),
        ...(endtime && { end: endtime }),
        ...(relatedvideos && { rel: relatedvideos }),
        ...(muteVideo && { mute: muteVideo }),
        ...(fullscreen && { start: fullscreen }),

        // vimeo
        ...(vstarttime && { t: vstarttime }),
        ...(vautoplay && { autoplay: vautoplay }),
        ...(vautopause && { autopause: vautopause }),
        ...(vdnt && { dnt: vdnt }),

    };

    const playerOptionsString = JSON.stringify(playerOptions);

    return playerOptionsString;

}

export const sanitizeUrl = (url) => {
    if (url.startsWith('/') || url.startsWith('#')) {
        return url;
    }

    try {
        const urlObject = new URL(url);

        // Check if the protocol is valid (allowing only 'http' and 'https')
        if (!['http:', 'https:', 'ftp:', 'ftps:', 'mailto:', 'news:', 'irc:', 'irc6:', 'ircs:', 'gopher:', 'nntp:', 'feed:', 'telnet:', 'mms:', 'rtsp:', 'sms:', 'svn:', 'tel:', 'fax:', 'xmpp:', 'webcal:', 'urn:'].includes(urlObject.protocol)) {
            throw new Error('Invalid protocol');
        }

        // If all checks pass, return the sanitized URL
        return urlObject.toString();
    } catch (error) {
        console.error('Error sanitizing URL:', error.message);
        return '/404';
    }
}


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

    const carouselOptionsString = JSON.stringify(carouselOptions);

    return carouselOptionsString;
}

export const isInstagramHashtag = (url) => {
    const instagramHashtagRegex = /^https?:\/\/(?:www\.)?instagram\.com\/explore\/tags\/([^/]+)\/?$/i;
    return instagramHashtagRegex.test(url);
}