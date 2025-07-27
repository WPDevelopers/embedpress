(function() {
  "use strict";
  var _a;
  const isPyr = (_a = document.querySelector("[data-playerid]")) == null ? void 0 : _a.getAttribute("data-playerid");
  if (!isPyr) {
    var scriptUrl = "https://www.youtube.com/s/player/9d15588c/www-widgetapi.vflset/www-widgetapi.js";
    try {
      var ttPolicy = window.trustedTypes.createPolicy("youtube-widget-api", { createScriptURL: function(x) {
        return x;
      } });
      scriptUrl = ttPolicy.createScriptURL(scriptUrl);
    } catch (e) {
    }
    var YT;
    if (!window["YT"]) YT = { loading: 0, loaded: 0 };
    var YTConfig;
    if (!window["YTConfig"]) YTConfig = { "host": "https://www.youtube.com" };
    if (!YT.loading) {
      YT.loading = 1;
      (function() {
        var l = [];
        YT.ready = function(f) {
          if (YT.loaded) f();
          else l.push(f);
        };
        window.onYTReady = function() {
          YT.loaded = 1;
          var i = 0;
          for (; i < l.length; i++) try {
            l[i]();
          } catch (e) {
          }
        };
        YT.setConfig = function(c2) {
          var k;
          for (k in c2) if (c2.hasOwnProperty(k)) YTConfig[k] = c2[k];
        };
        var a = document.createElement("script");
        a.type = "text/javascript";
        a.id = "www-widgetapi-script";
        a.src = scriptUrl;
        a.async = true;
        var c = document.currentScript;
        if (c) {
          var n = c.nonce || c.getAttribute("nonce");
          if (n) a.setAttribute(
            "nonce",
            n
          );
        }
        var b = document.getElementsByTagName("script")[0];
        b.parentNode.insertBefore(a, b);
      })();
    }
  }
  let adsConainers = document.querySelectorAll("[data-sponsored-id]");
  document.querySelector("[data-sponsored-id]");
  const player = [];
  adsConainers = Array.from(adsConainers);
  const getYTVideoId = (url) => {
    if (typeof url !== "string") {
      return false;
    }
    const regex = /(?:youtube\.com\/(?:[^\/]+\/[^\/]+\/|(?:v|e(?:mbed)?)\/|[^#]*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    if (match && match[1]) {
      return match[1];
    }
    return false;
  };
  const hashParentClass = (element, className) => {
    var _a2;
    var parent = element.parentNode;
    while (parent && !((_a2 = parent.classList) == null ? void 0 : _a2.contains(className))) {
      parent = parent.parentNode;
    }
    return !!parent;
  };
  const adInitialization = (adContainer, index) => {
    if (!adContainer) {
      return;
    }
    const adAtts = JSON.parse(atob(adContainer == null ? void 0 : adContainer.getAttribute("data-sponsored-attrs")));
    adAtts.clientId;
    adContainer.getAttribute("data-sponsored-id");
    const adStartAfter = adAtts.adStart * 1e3;
    adAtts.adContent;
    const adVideo = adContainer.querySelector(".ep-ad");
    const adSource = adAtts.adSource;
    const srcUrl = adAtts.url || adAtts.embedpress_embeded_link;
    const adSkipButtonAfter = parseInt(adAtts.adSkipButtonAfter);
    addWrapperForYoutube(adContainer, srcUrl, adAtts);
    const adTemplate = adContainer.querySelector(".main-ad-template");
    const progressBar = adContainer.querySelector(".progress-bar");
    const skipButton = adContainer.querySelector(".skip-ad-button");
    const adRunningTime = adContainer.querySelector(".sponsored-running-time");
    var playerId;
    const adMask = adContainer;
    let playbackInitiated = false;
    if (skipButton && adSource !== "video") {
      skipButton.style.display = "inline-block";
    }
    const hashClass = hashParentClass(adContainer, "ep-content-protection-enabled");
    if (hashClass) {
      adContainer.classList.remove("sponsored-mask");
    }
    adMask == null ? void 0 : adMask.addEventListener("click", function() {
      var _a2, _b, _c;
      if (adContainer.classList.contains("sponsored-mask")) {
        playerId = (_a2 = adContainer.querySelector("[data-playerid]")) == null ? void 0 : _a2.getAttribute("data-playerid");
        if (typeof playerInit !== "undefined" && playerInit.length > 0) {
          (_b = playerInit[playerId]) == null ? void 0 : _b.play();
        }
        if (getYTVideoId(srcUrl)) {
          (_c = player[index]) == null ? void 0 : _c.playVideo();
        }
        if (!playbackInitiated) {
          setTimeout(() => {
            if (adSource !== "image") {
              adContainer.querySelector(".ep-embed-content-wraper").classList.add("hidden");
            }
            adTemplate == null ? void 0 : adTemplate.classList.add("sponsored-running");
            if (adVideo && adSource === "video") {
              adVideo.muted = false;
              adVideo.play();
            }
          }, adStartAfter);
          playbackInitiated = true;
        }
        adContainer.classList.remove("sponsored-mask");
      }
    });
    adVideo == null ? void 0 : adVideo.addEventListener("timeupdate", () => {
      const currentTime = adVideo == null ? void 0 : adVideo.currentTime;
      const videoDuration = adVideo == null ? void 0 : adVideo.duration;
      if (currentTime <= videoDuration) {
        const remainingTime = Math.max(0, videoDuration - currentTime);
        adRunningTime.innerText = Math.floor(remainingTime / 60) + ":" + (Math.floor(remainingTime) % 60).toString().padStart(2, "0");
      }
      if (!isNaN(currentTime) && !isNaN(videoDuration)) {
        const progress = currentTime / videoDuration * 100;
        progressBar.style.width = progress + "%";
        if (currentTime >= adSkipButtonAfter) {
          skipButton.style.display = "inline-block";
        }
      }
    });
    skipButton == null ? void 0 : skipButton.addEventListener("click", () => {
      var _a2, _b;
      adTemplate.remove();
      if (typeof playerInit !== "undefined" && playerInit.length > 0) {
        (_a2 = playerInit[playerId]) == null ? void 0 : _a2.play();
      }
      if (getYTVideoId(srcUrl)) {
        (_b = player[index]) == null ? void 0 : _b.playVideo();
      }
      adContainer.querySelector(".ep-embed-content-wraper").classList.remove("hidden");
    });
    adVideo == null ? void 0 : adVideo.addEventListener("play", () => {
      var _a2;
      if (playerInit && (playerInit == null ? void 0 : playerInit.length) > 0) {
        (_a2 = playerInit[playerId]) == null ? void 0 : _a2.stop();
      }
    });
    adVideo == null ? void 0 : adVideo.addEventListener("ended", () => {
      adTemplate.remove();
      adContainer.querySelector(".ep-embed-content-wraper").classList.remove("hidden");
    });
  };
  const addWrapperForYoutube = (adContainer, srcUrl, adAtts) => {
    const youtubeIframe = adContainer.querySelector(`.ose-youtube iframe`);
    if (youtubeIframe && getYTVideoId(srcUrl)) {
      const divWrapper = document.createElement("div");
      divWrapper.className = "ad-youtube-video";
      youtubeIframe.setAttribute("width", adAtts.width);
      youtubeIframe.setAttribute("height", adAtts.height);
      youtubeIframe.parentNode.replaceChild(divWrapper, youtubeIframe);
      divWrapper.appendChild(youtubeIframe);
    }
  };
  function onYouTubeIframeAPIReady(iframe, srcUrl, adVideo, index) {
    if (iframe && getYTVideoId(srcUrl) !== null) {
      player[index] = new YT.Player(iframe, {
        videoId: getYTVideoId(srcUrl),
        events: {
          "onReady": (event) => onPlayerReady(event, adVideo)
        }
      });
    }
  }
  function onPlayerReady(event, adVideo) {
    adVideo == null ? void 0 : adVideo.addEventListener("ended", function() {
      event.target.playVideo();
    });
    adVideo == null ? void 0 : adVideo.addEventListener("play", function() {
      event.target.pauseVideo();
    });
  }
  if (adsConainers.length > 0 && embedpressFrontendData.isProPluginActive) {
    window.onload = function() {
      let yVideos = setInterval(() => {
        var youtubeVideos = document.querySelectorAll(".ose-youtube");
        if (youtubeVideos.length > 0) {
          clearInterval(yVideos);
          youtubeVideos.forEach((yVideo, index) => {
            var _a2, _b, _c;
            const srcUrl = (_a2 = yVideo.querySelector("iframe")) == null ? void 0 : _a2.getAttribute("src");
            const adVideo = (_b = yVideo.closest(".sponsored-mask")) == null ? void 0 : _b.querySelector(".ep-ad");
            const isYTChannel = (_c = yVideo.closest(".sponsored-mask")) == null ? void 0 : _c.querySelector(".ep-youtube-channel");
            if (adVideo && !isYTChannel) {
              onYouTubeIframeAPIReady(yVideo, srcUrl, adVideo, index);
            }
          });
        }
      }, 100);
    };
    let ytIndex = 0;
    adsConainers.forEach((adContainer, epAdIndex) => {
      var _a2;
      adContainer.setAttribute("data-ad-index", epAdIndex);
      adInitialization(adContainer, ytIndex);
      if (getYTVideoId((_a2 = adContainer.querySelector("iframe")) == null ? void 0 : _a2.getAttribute("src"))) {
        ytIndex++;
      }
    });
  } else {
    jQuery(".sponsored-mask").removeClass("sponsored-mask");
  }
})();
//# sourceMappingURL=ads.build.js.map
