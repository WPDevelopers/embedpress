var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
(function() {
  "use strict";
  document.addEventListener("DOMContentLoaded", function() {
    const overlayMask = document.createElement("div");
    overlayMask.className = "overlay-mask";
    let embedWrappers = document.querySelectorAll(".ep-embed-content-wraper");
    embedWrappers.forEach((wrapper) => {
      initPlayer(wrapper);
    });
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        const addedNodes = Array.from(mutation.addedNodes);
        addedNodes.forEach((node) => {
          traverseAndInitPlayer(node);
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    function traverseAndInitPlayer(node) {
      if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains("ep-embed-content-wraper")) {
        initPlayer(node);
      }
      if (node.hasChildNodes()) {
        node.childNodes.forEach((childNode) => {
          traverseAndInitPlayer(childNode);
        });
      }
    }
  });
  function initPlayer(wrapper) {
    var _a, _b;
    const playerId = wrapper.getAttribute("data-playerid");
    console.log({ wrapper });
    let options = (_a = document.querySelector(`[data-playerid='${playerId}']`)) == null ? void 0 : _a.getAttribute("data-options");
    if (!options) {
      return false;
    }
    if (typeof options === "string") {
      try {
        options = JSON.parse(options);
      } catch (e) {
        console.error("Invalid JSON format:", e);
        return;
      }
    } else {
      console.error("Options is not a string");
      return;
    }
    const pipPlayIconElement = document.createElement("div");
    pipPlayIconElement.className = "pip-play";
    pipPlayIconElement.innerHTML = '<svg width="20" height="20" viewBox="-0.15 -0.112 0.9 0.9" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin" class="jam jam-play"><path fill="#fff" d="M.518.357A.037.037 0 0 0 .506.306L.134.08a.039.039 0 0 0-.02-.006.038.038 0 0 0-.038.037v.453c0 .007.002.014.006.02a.039.039 0 0 0 .052.012L.506.37A.034.034 0 0 0 .518.358zm.028.075L.174.658A.115.115 0 0 1 .017.622.109.109 0 0 1 0 .564V.111C0 .05.051 0 .114 0c.021 0 .042.006.06.017l.372.226a.11.11 0 0 1 0 .189z"/></svg>';
    pipPlayIconElement.style.display = "none";
    const pipPauseIconElement = document.createElement("div");
    pipPauseIconElement.className = "pip-pause";
    pipPauseIconElement.innerHTML = '<svg fill="#fff" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 2.5 2.5" xml:space="preserve"><path d="M1.013.499 1.006.5V.499H.748a.054.054 0 0 0-.054.054v1.394c0 .03.024.054.054.054h.266a.054.054 0 0 0 .054-.054V.553a.054.054 0 0 0-.054-.054zm.793 1.448V.553a.054.054 0 0 0-.054-.054L1.745.5V.499h-.258a.054.054 0 0 0-.054.054v1.394c0 .03.024.054.054.054h.265a.054.054 0 0 0 .054-.054z"/></svg>';
    const pipCloseElement = document.createElement("div");
    pipCloseElement.className = "pip-close";
    pipCloseElement.innerHTML = '<svg width="20" height="20" viewBox="0 0 0.9 0.9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M.198.198a.037.037 0 0 1 .053 0L.45.397.648.199a.037.037 0 1 1 .053.053L.503.45l.198.198a.037.037 0 0 1-.053.053L.45.503.252.701A.037.037 0 0 1 .199.648L.397.45.198.252a.037.037 0 0 1 0-.053z" fill="#fff"/></svg>';
    if (playerId && !wrapper.classList.contains("plyr-initialized")) {
      let selector = `[data-playerid='${playerId}'] .ose-embedpress-responsive`;
      if (options.self_hosted && options.hosted_format === "video") {
        selector = `[data-playerid='${playerId}'] .ose-embedpress-responsive video`;
      } else if (options.self_hosted && options.hosted_format === "audio") {
        selector = `[data-playerid='${playerId}'] .ose-embedpress-responsive audio`;
        wrapper.style.opacity = "1";
      }
      document.querySelector(`[data-playerid='${playerId}']`).style.setProperty("--plyr-color-main", options.player_color);
      (_b = document.querySelector(`[data-playerid='${playerId}'].custom-player-preset-1, [data-playerid='${playerId}'].custom-player-preset-3, [data-playerid='${playerId}'].custom-player-preset-4`)) == null ? void 0 : _b.style.setProperty("--plyr-range-fill-background", "#ffffff");
      if (document.querySelector(`[data-playerid='${playerId}'] iframe`)) {
        document.querySelector(`[data-playerid='${playerId}'] iframe`).setAttribute("data-poster", options.poster_thumbnail);
      }
      if (document.querySelector(`[data-playerid='${playerId}'] video`)) {
        document.querySelector(`[data-playerid='${playerId}'] video`).setAttribute("data-poster", options.poster_thumbnail);
      }
      const controls = [
        "play-large",
        options.restart ? "restart" : "",
        options.rewind ? "rewind" : "",
        "play",
        options.fast_forward ? "fast-forward" : "",
        "progress",
        "current-time",
        "duration",
        "mute",
        "volume",
        "captions",
        "settings",
        options.pip ? "pip" : "",
        "airplay",
        options.download ? "download" : "",
        options.fullscreen ? "fullscreen" : ""
      ].filter((control) => control !== "");
      new Plyr(selector, {
        controls,
        seekTime: 10,
        poster: options.poster_thumbnail,
        storage: {
          enabled: true,
          key: "plyr_volume"
        },
        displayDuration: true,
        tooltips: { controls: options.player_tooltip, seek: options.player_tooltip },
        hideControls: options.hide_controls,
        youtube: __spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues({}, options.autoplay && { autoplay: options.autoplay }), options.start && { start: options.start }), options.end && { end: options.end }), options.rel && { rel: options.rel }), options.fullscreen && { fs: options.fullscreen }),
        vimeo: __spreadValues(__spreadValues(__spreadValues(__spreadValues({
          byline: false,
          portrait: false,
          title: false,
          speed: true,
          transparent: false,
          controls: false
        }, options.t && { t: options.t }), options.vautoplay && { autoplay: options.vautoplay }), options.autopause && { autopause: options.autopause }), options.dnt && { dnt: options.dnt })
      });
      wrapper.classList.add("plyr-initialized");
      const posterElement = wrapper.querySelector(".plyr__poster");
      if (posterElement) {
        const interval = setInterval(() => {
          if (posterElement && posterElement.style.backgroundImage) {
            wrapper.style.opacity = "1";
            clearInterval(interval);
          }
        }, 200);
      }
    }
    const pipInterval = setInterval(() => {
      let playerPip = document.querySelector(`[data-playerid="${playerId}"] [data-plyr="pip"]`);
      if (playerPip) {
        clearInterval(pipInterval);
        let options2 = document.querySelector(`[data-playerid="${playerId}"]`).getAttribute("data-options");
        options2 = JSON.parse(options2);
        if (!options2.self_hosted) {
          const iframeSelector = document.querySelector(`[data-playerid="${playerId}"] .plyr__video-wrapper`);
          playerPip.addEventListener("click", () => {
            iframeSelector.classList.toggle("pip-mode");
            let parentElement = iframeSelector.parentElement;
            while (parentElement) {
              parentElement.style.zIndex = "9999";
              parentElement = parentElement.parentElement;
            }
          });
          if (options2.pip) {
            iframeSelector.appendChild(pipPlayIconElement);
            iframeSelector.appendChild(pipPauseIconElement);
            iframeSelector.appendChild(pipCloseElement);
            const pipPlay = document.querySelector(`[data-playerid="${playerId}"] .plyr__video-wrapper .pip-play`);
            const pipPause = document.querySelector(`[data-playerid="${playerId}"] .plyr__video-wrapper .pip-pause`);
            const pipClose = document.querySelector(`[data-playerid="${playerId}"] .plyr__video-wrapper .pip-close`);
            pipClose.addEventListener("click", () => {
              iframeSelector.classList.remove("pip-mode");
              console.log(iframeSelector.classList);
            });
            iframeSelector.addEventListener("click", () => {
              const ariaPressedValue = document.querySelector(`[data-playerid="${playerId}"] .plyr__controls [data-plyr="play"]`).getAttribute("aria-pressed");
              console.log(ariaPressedValue);
              if (ariaPressedValue === "true") {
                pipPause.style.display = "none";
                pipPlay.style.display = "flex";
              } else {
                pipPlay.style.display = "none";
                pipPause.style.display = "flex";
              }
            });
          }
        }
      }
    }, 200);
  }
})();
//# sourceMappingURL=initplyr.build.js.map
