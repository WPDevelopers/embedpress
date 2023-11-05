var scriptUrl = 'https:\/\/www.youtube.com\/s\/player\/9d15588c\/www-widgetapi.vflset\/www-widgetapi.js'; try { var ttPolicy = window.trustedTypes.createPolicy("youtube-widget-api", { createScriptURL: function (x) { return x } }); scriptUrl = ttPolicy.createScriptURL(scriptUrl) } catch (e) { } var YT; if (!window["YT"]) YT = { loading: 0, loaded: 0 }; var YTConfig; if (!window["YTConfig"]) YTConfig = { "host": "https://www.youtube.com" };
if (!YT.loading) {
    YT.loading = 1; (function () {
        var l = []; YT.ready = function (f) { if (YT.loaded) f(); else l.push(f) }; window.onYTReady = function () { YT.loaded = 1; var i = 0; for (; i < l.length; i++)try { l[i]() } catch (e) { } }; YT.setConfig = function (c) { var k; for (k in c) if (c.hasOwnProperty(k)) YTConfig[k] = c[k] }; var a = document.createElement("script"); a.type = "text/javascript"; a.id = "www-widgetapi-script"; a.src = scriptUrl; a.async = true; var c = document.currentScript; if (c) {
            var n = c.nonce || c.getAttribute("nonce"); if (n) a.setAttribute("nonce",
                n)
        } var b = document.getElementsByTagName("script")[0]; b.parentNode.insertBefore(a, b)
    })()
};


let adsConainers = document.querySelectorAll('[data-ad-id]');

adsConainers = Array.from(adsConainers);

const getYTVideoId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/[^\/]+\/|(?:v|e(?:mbed)?)\/|[^#]*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);

    if (match && match[1]) {
        return match[1];
    } else {
        return null; // Invalid URL or couldn't find the video ID
    }
}

const adInitialization = (adContainer) => {
    const adAtts = JSON.parse(atob(adContainer.getAttribute('data-ad-attrs')));;
    const blockId = adAtts.clientId;
    const blockIdMD5 = adContainer.getAttribute('data-ad-id');
    const adStartAfter = adAtts.adStart * 1000;
    const adContent = adAtts.adContent;
    const adVideo = adContainer.querySelector('#ad-' + blockId + ' .ep-ad');
    const youtubeIframe = adContainer.querySelector(`.ose-youtube iframe`);
    const adVideos = [];
    const srcUrl = adAtts.url;
    let player;


    if (youtubeIframe && getYTVideoId(srcUrl)) {

        const divWrapper = document.createElement('div');
        divWrapper.className = 'ad-youtube-video';
        youtubeIframe.setAttribute('width', adAtts.width);
        youtubeIframe.setAttribute('height', adAtts.height);
        youtubeIframe.parentNode.replaceChild(divWrapper, youtubeIframe);
        divWrapper.appendChild(youtubeIframe);


        function onYouTubeIframeAPIReady() {
            // Find the iframe by its src attribute
            const iframe = document.querySelector('.ad-youtube-video');

            if (iframe && getYTVideoId(srcUrl) !== null) {
                player = new YT.Player(iframe, {
                    videoId: getYTVideoId(srcUrl),

                    events: {
                        'onReady': onPlayerReady,
                    }
                });
                console.log(getYTVideoId(srcUrl));
            }

        }

        // This function is called when the player is ready
        function onPlayerReady(event) {
            adVideo.addEventListener('ended', function () {
                event.target.playVideo();
            });

            adVideo.addEventListener('play', function () {
                event.target.pauseVideo();
            });
        }

        window.onload = function () {
            onYouTubeIframeAPIReady();
        };

    }


    // let adVideo = adContainer.querySelector('#ad-' + blockId + ' .ep-ad');
    adVideos.push(adVideo);

    const adTemplate = adContainer.querySelector('#ad-' + blockId);
    const progressBar = adContainer.querySelector('#ad-' + blockId + ' .progress-bar');
    const skipButton = adContainer.querySelector('#ad-' + blockId + ' .skip-ad-button');

    const adMask = adContainer.querySelector('.ose-embedpress-responsive');

    let playbackInitiated = false;


    adMask.addEventListener('click', function () {

        adContainer.classList.remove('ad-mask');

        if (!playbackInitiated) {
            setTimeout(() => {
                adContainer.querySelector('.ose-embedpress-responsive').style.display = 'none';
                adTemplate.classList.add('ad-running');
                console.log(adTemplate);
                adVideo.muted = false;
                adVideo.play();
            }, adStartAfter);

            playbackInitiated = true;
        }
    });

    adVideo.addEventListener('timeupdate', () => {
        const currentTime = adVideo.currentTime;
        const videoDuration = adVideo.duration;

        if (!isNaN(currentTime) && !isNaN(videoDuration)) {
            const progress = (currentTime / videoDuration) * 100;
            progressBar.style.width = progress + '%';

            if (currentTime >= 3) {
                // Show the skip button after 3 seconds
                skipButton.style.display = 'inline-block';
            }
        }
    });


    // Add a click event listener to the skip button
    skipButton.addEventListener('click', () => {
        adTemplate.remove();
        if (getYTVideoId(srcUrl)) {
            player.playVideo();
        }
        adContainer.querySelector('.ose-embedpress-responsive').style.display = 'inline-block';
    });

    // Add an event listener to check for video end
    adVideo.addEventListener('ended', () => {
        // Remove the main ad template from the DOM when the video ends
        adTemplate.remove();
        adContainer.querySelector('.ose-embedpress-responsive').style.display = 'inline-block';
    });

}

console.log(adsConainers);

if (adsConainers.length > 0) {
    adsConainers.forEach(element => {
        console.log("Initializing");
        adInitialization(element);
    });
}