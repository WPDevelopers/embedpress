/**
 * Note: This is complex initialization, but it is necessary for Gutenberg and Elementor compatibility. There are some known issues in Gutenberg that require this complex setup.
 */
var playerInit = [];


// Event listener for when the DOM content is loaded
document.addEventListener('DOMContentLoaded', function () {


  const overlayMask = document.createElement('div');
  overlayMask.className = 'overlay-mask';


  // Select all embed wrappers with the class 'ep-embed-content-wraper'
  let embedWrappers = document.querySelectorAll('.ep-embed-content-wraper');

  // Initialize the player for each embed wrapper
  embedWrappers.forEach(wrapper => {
    initPlayer(wrapper);
  });

  // Mutation observer to detect any changes in the DOM
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      const addedNodes = Array.from(mutation.addedNodes);
      addedNodes.forEach(node => {
        traverseAndInitPlayer(node);
      });
    });
  });

  // Start observing changes in the entire document body and its subtree
  observer.observe(document.body, { childList: true, subtree: true });

  // Recursive function to traverse the DOM and initialize the player for each embed wrapper
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


});


// Function to initialize the player for a given wrapper
function initPlayer(wrapper) {
  const playerId = wrapper.getAttribute('data-playerid');

  // Get the options for the player from the wrapper's data attribute
  let options = document.querySelector(`[data-playerid='${playerId}']`)?.getAttribute('data-options');



  if (!options) {
    return false;
  }

  // Parse the options string into a JSON object
  if (typeof options === 'string') {
    try {
      options = JSON.parse(options);
    } catch (e) {
      return;
    }
  } else {
    return;
  }

  // Advanced Privacy Mode: defer Plyr init + show click-to-load overlay.
  // Iframes have already had `src` neutralized server-side; we restore on click.
  if (options.privacy_mode && wrapper.classList.contains('ep-privacy-pending')) {
    epShowPrivacyOverlay(wrapper, options, function () {
      wrapper.classList.remove('ep-privacy-pending');
      epRestorePrivacyIframes(wrapper);
      // Mark wrapper so the recursive init knows to auto-play once Plyr
      // is ready. The click on the overlay is a user gesture, so the
      // play() promise is allowed here.
      wrapper.setAttribute('data-ep-autoplay-after-init', '1');
      wrapper.classList.remove('plyr-initialized');
      initPlayer(wrapper);
    });
    return;
  }


  if (!options.poster_thumbnail) {
    wrapper.style.opacity = "1";
  }

  // Create DOM elements from the icon strings
  const pipPlayIconElement = document.createElement('div');
  pipPlayIconElement.className = 'pip-play';
  pipPlayIconElement.innerHTML = '<svg width="20" height="20" viewBox="-0.15 -0.112 0.9 0.9" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin" class="jam jam-play"><path fill="#fff" d="M.518.357A.037.037 0 0 0 .506.306L.134.08a.039.039 0 0 0-.02-.006.038.038 0 0 0-.038.037v.453c0 .007.002.014.006.02a.039.039 0 0 0 .052.012L.506.37A.034.034 0 0 0 .518.358zm.028.075L.174.658A.115.115 0 0 1 .017.622.109.109 0 0 1 0 .564V.111C0 .05.051 0 .114 0c.021 0 .042.006.06.017l.372.226a.11.11 0 0 1 0 .189z"/></svg>';
  pipPlayIconElement.style.display = 'none';


  const pipPauseIconElement = document.createElement('div');
  pipPauseIconElement.className = 'pip-pause';
  pipPauseIconElement.innerHTML = '<svg fill="#fff" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 2.5 2.5" xml:space="preserve"><path d="M1.013.499 1.006.5V.499H.748a.054.054 0 0 0-.054.054v1.394c0 .03.024.054.054.054h.266a.054.054 0 0 0 .054-.054V.553a.054.054 0 0 0-.054-.054zm.793 1.448V.553a.054.054 0 0 0-.054-.054L1.745.5V.499h-.258a.054.054 0 0 0-.054.054v1.394c0 .03.024.054.054.054h.265a.054.054 0 0 0 .054-.054z"/></svg>';

  const pipCloseElement = document.createElement('div');
  pipCloseElement.className = 'pip-close';
  pipCloseElement.innerHTML = '<svg width="20" height="20" viewBox="0 0 0.9 0.9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M.198.198a.037.037 0 0 1 .053 0L.45.397.648.199a.037.037 0 1 1 .053.053L.503.45l.198.198a.037.037 0 0 1-.053.053L.45.503.252.701A.037.037 0 0 1 .199.648L.397.45.198.252a.037.037 0 0 1 0-.053z" fill="#fff"/></svg>';

  // Check if the player has not been initialized for this wrapper
  if (playerId && !wrapper.classList.contains('plyr-initialized')) {


    let selector = `[data-playerid='${playerId}'] .ose-embedpress-responsive`;


    if (options.self_hosted && options.hosted_format === 'video') {
      selector = `[data-playerid='${playerId}'] .ose-embedpress-responsive video`;
    }
    else if (options.self_hosted && options.hosted_format === 'audio') {
      selector = `[data-playerid='${playerId}'] .ose-embedpress-responsive audio`;
      wrapper.style.opacity = "1";
    }

    // Adaptive Streaming (Pro): attach hls.js / dash.js when source is .m3u8 / .mpd.
    if (options.adaptive_streaming && options.self_hosted && options.hosted_format === 'video') {
      var videoEl = wrapper.querySelector('.ose-embedpress-responsive video');
      epAttachAdaptiveStreaming(videoEl);
    }


    // Set the main color of the player
    document.querySelector(`[data-playerid='${playerId}']`).style.setProperty('--plyr-color-main', options.player_color);
    document.querySelector(`[data-playerid='${playerId}'].custom-player-preset-1, [data-playerid='${playerId}'].custom-player-preset-3, [data-playerid='${playerId}'].custom-player-preset-4`)?.style.setProperty('--plyr-range-fill-background', '#ffffff');

    // Set the poster thumbnail for the player
    if (document.querySelector(`[data-playerid='${playerId}'] iframe`)) {
      document.querySelector(`[data-playerid='${playerId}'] iframe`).setAttribute('data-poster', options.poster_thumbnail);
    }
    if (document.querySelector(`[data-playerid='${playerId}'] video`)) {
      document.querySelector(`[data-playerid='${playerId}'] video`).setAttribute('data-poster', options.poster_thumbnail);
    }

    // Define the controls to be displayed
    const controls = [
      'play-large',
      options.restart ? 'restart' : '',
      options.rewind ? 'rewind' : '',
      'play',
      options.fast_forward ? 'fast-forward' : '',
      'progress',
      'current-time',
      'duration',
      'mute',
      'volume',
      'captions',
      'settings',
      options.pip ? 'pip' : '',
      'airplay',
      options.download ? 'download' : '',
      options.fullscreen ? 'fullscreen' : '',

    ].filter(control => control !== '');

    // Detect if we're on iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    // Detect if this is a YouTube video
    const isYouTube = document.querySelector(`[data-playerid='${playerId}'] iframe[src*="youtube"]`) !== null;

    // For iOS YouTube videos, we need to use fallback fullscreen instead of native
    // because webkitEnterFullscreen() doesn't work on iframes
    const shouldUseFallbackFullscreen = isIOS && isYouTube;



    // New preset family (`ep-*`) renders its own DOM controls via
    // window.epPlayer; hide Plyr's bar so plyr.css is irrelevant for these.
    // ep-player.css is loaded inside Gutenberg's iframed canvas via the
    // editorStyle dependency chain (see AssetManager `blocks-editor-style`
    // deps), so the editor preview matches the front-end.
    const isNewPreset = typeof options.player_preset === 'string'
      && options.player_preset.indexOf('ep-') === 0;
    const plyrControls = isNewPreset ? [] : controls;

    // Create a new Plyr player instance with the specified options and controls
    const player = new Plyr(selector, {
      controls: plyrControls,
      seekTime: 10,
      poster: options.poster_thumbnail,
      storage: {
        enabled: true,
        key: 'plyr_volume'
      },
      displayDuration: true,
      tooltips: { controls: options.player_tooltip, seek: options.player_tooltip },
      hideControls: options.hide_controls,
      // iOS fullscreen configuration - use fallback for YouTube on iOS
      fullscreen: {
        enabled: options.fullscreen !== false,
        fallback: true,
        iosNative: !shouldUseFallbackFullscreen // Disable iosNative for YouTube on iOS
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

    playerInit[playerId] = player;

    // Hand off to ep-player for non-legacy presets. The runtime is
    // idempotent and binds to Plyr's API — Plyr remains the playback
    // engine; only the UI is replaced.
    if (isNewPreset && window.epPlayer && typeof window.epPlayer.mount === 'function') {
      try { window.epPlayer.mount(wrapper, player, options); } catch (e) {}
    }

    // Privacy Mode: if the click-to-load overlay just consented, kick off
    // playback automatically once the player is ready. Without this the
    // viewer has to click the main play button — a double-click experience.
    if (wrapper.getAttribute('data-ep-autoplay-after-init') === '1') {
      wrapper.removeAttribute('data-ep-autoplay-after-init');
      var autoPlay = function () { try { player.play(); } catch (e) {} };
      if (typeof player.once === 'function') {
        player.once('ready', autoPlay);
        player.once('canplay', autoPlay);
      } else {
        setTimeout(autoPlay, 100);
      }
    }

    // Each Pro feature initializes independently — a failure in one must
    // never prevent the next one from running. (Card 81243 acceptance:
    // "every feature should work independently".)
    function epSafeInit(name, fn) {
      try { fn(); }
      catch (err) {
        if (window.console && window.console.error) {
          window.console.error('[EmbedPress] ' + name + ' init failed:', err);
        }
      }
    }

    if (options.auto_resume) {
      epSafeInit('auto_resume', function () { epInitAutoResume(player, wrapper, options); });
    }
    if (options.end_screen) {
      epSafeInit('end_screen', function () { epInitEndScreen(player, wrapper, options.end_screen); });
    }
    if (options.timed_cta && options.timed_cta.length) {
      epSafeInit('timed_cta', function () { epInitTimedCTA(player, wrapper, options.timed_cta); });
    }
    if (options.chapters && options.chapters.items && options.chapters.items.length) {
      epSafeInit('chapters', function () { epInitChapters(player, wrapper, options.chapters); });
    }
    if (options.email_capture) {
      epSafeInit('email_capture', function () { epInitEmailCapture(player, wrapper, options.email_capture); });
    }
    if (options.action_lock) {
      epSafeInit('action_lock', function () { epInitActionLock(player, wrapper, options.action_lock); });
    }
    if (options.lms_tracking) {
      epSafeInit('lms_tracking', function () { epInitLmsTracking(player, wrapper, options.lms_tracking); });
    }
    if (options.heatmap) {
      epSafeInit('heatmap', function () { epInitHeatmap(player, wrapper, options.heatmap); });
    }


    // iOS YouTube fullscreen fix: Ensure iframe has proper attributes
    if (shouldUseFallbackFullscreen) {
      const iframe = document.querySelector(`[data-playerid='${playerId}'] iframe[src*="youtube"]`);
      if (iframe) {
        // Ensure the iframe allows fullscreen
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('webkitallowfullscreen', '');
        iframe.setAttribute('mozallowfullscreen', '');

        // Add iOS-specific class for styling
        iframe.classList.add('ios-youtube-iframe');

        // Listen for fullscreen events to handle iOS-specific behavior
        player.on('enterfullscreen', () => {
          // Force viewport meta tag update for better fullscreen experience
          const viewport = document.querySelector('meta[name="viewport"]');
          if (viewport) {
            const originalContent = viewport.getAttribute('content');
            viewport.setAttribute('data-original-content', originalContent);
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
          }
        });

        player.on('exitfullscreen', () => {
          // Restore original viewport meta tag
          const viewport = document.querySelector('meta[name="viewport"]');
          if (viewport && viewport.hasAttribute('data-original-content')) {
            viewport.setAttribute('content', viewport.getAttribute('data-original-content'));
            viewport.removeAttribute('data-original-content');
          }
        });
      }
    }



    // Mark the wrapper as initialized
    wrapper.classList.add('plyr-initialized');

    const posterElement = wrapper.querySelector('.plyr__poster');

    if (posterElement) {
      const interval = setInterval(() => {
        const computedBg = window.getComputedStyle(posterElement).getPropertyValue('background-image');
        if (posterElement.style.backgroundImage || (computedBg && computedBg !== 'none')) {
          wrapper.style.opacity = '1';
          clearInterval(interval);
        }
      }, 200);

      // Fallback: ensure the player becomes visible even if poster never loads
      setTimeout(() => {
        clearInterval(interval);
        wrapper.style.opacity = '1';
      }, 5000);
    } else {
      // No poster element found — show the player immediately
      wrapper.style.opacity = '1';
    }

  }

  // Check for the existence of the player's pip button at regular intervals
  const pipInterval = setInterval(() => {

    let playerPip = document.querySelector(`[data-playerid="${playerId}"] [data-plyr="pip"]`);
    if (playerPip) {
      clearInterval(pipInterval);

      let options = document.querySelector(`[data-playerid="${playerId}"]`).getAttribute('data-options');

      options = JSON.parse(options);
      if (!options.self_hosted) {

        const iframeSelector = document.querySelector(`[data-playerid="${playerId}"] .plyr__video-wrapper`);

        // Add click event listener to toggle the pip mode
        playerPip.addEventListener('click', () => {
          iframeSelector.classList.toggle('pip-mode');

          let parentElement = iframeSelector.parentElement;
          while (parentElement) {
            parentElement.style.zIndex = '9999';
            parentElement = parentElement.parentElement;
          }

        });



        if (options.pip) {
          iframeSelector.appendChild(pipPlayIconElement);
          iframeSelector.appendChild(pipPauseIconElement);
          iframeSelector.appendChild(pipCloseElement);
          const pipPlay = document.querySelector(`[data-playerid="${playerId}"] .plyr__video-wrapper .pip-play`);
          const pipPause = document.querySelector(`[data-playerid="${playerId}"] .plyr__video-wrapper .pip-pause`);
          const pipClose = document.querySelector(`[data-playerid="${playerId}"] .plyr__video-wrapper .pip-close`);

          pipClose.addEventListener('click', () => {
            iframeSelector.classList.remove('pip-mode');
          });


          iframeSelector.addEventListener('click', () => {
            const ariaPressedValue = document.querySelector(`[data-playerid="${playerId}"] .plyr__controls [data-plyr="play"]`).getAttribute('aria-pressed');

            if (ariaPressedValue === 'true') {
              pipPause.style.display = 'none';
              pipPlay.style.display = 'flex';
            } else {
              pipPlay.style.display = 'none';
              pipPause.style.display = 'flex';
            }
          });

        }


      }
    }

  }, 200);

}

/**
 * Auto Resume Playback
 *
 * Persists the current playhead in localStorage and prompts the viewer
 * to resume on revisit. Only active for sources where Plyr exposes
 * `currentTime` and `duration` (self-hosted video/audio, Vimeo, YouTube).
 *
 * Storage key includes the source URL so each video has its own slot.
 * Entries older than the TTL or beyond 95% completion are discarded.
 */
function epInitAutoResume(player, wrapper, options) {
  var TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
  var COMPLETE_PCT = 0.95;
  var threshold = Math.max(5, parseInt(options.auto_resume_threshold, 10) || 30);

  var sourceKey = epResumeSourceKey(wrapper);
  if (!sourceKey) return;

  var storageKey = 'embedpress_resume::' + sourceKey;

  function readEntry() {
    try {
      var raw = window.localStorage.getItem(storageKey);
      if (!raw) return null;
      var entry = JSON.parse(raw);
      if (!entry || typeof entry.t !== 'number') return null;
      if (Date.now() - entry.savedAt > TTL_MS) {
        window.localStorage.removeItem(storageKey);
        return null;
      }
      return entry;
    } catch (e) {
      return null;
    }
  }

  function writeEntry(t, duration) {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({
        t: t,
        d: duration || 0,
        savedAt: Date.now()
      }));
    } catch (e) { /* quota — ignore */ }
  }

  function clearEntry() {
    try { window.localStorage.removeItem(storageKey); } catch (e) {}
  }

  // Save position periodically while playing.
  var lastSaved = 0;
  player.on('timeupdate', function () {
    var now = player.currentTime || 0;
    var dur = player.duration || 0;
    if (now < threshold) return;
    if (dur && now / dur >= COMPLETE_PCT) return;
    if (Math.abs(now - lastSaved) < 5) return; // throttle to ~5s
    lastSaved = now;
    writeEntry(now, dur);
  });

  player.on('ended', clearEntry);

  // Show resume prompt once metadata is ready.
  function maybePrompt() {
    var entry = readEntry();
    if (!entry || entry.t < threshold) return;
    var dur = player.duration || entry.d || 0;
    if (dur && entry.t / dur >= COMPLETE_PCT) {
      clearEntry();
      return;
    }
    epShowResumePrompt(wrapper, entry.t, function (resume) {
      if (resume) {
        try { player.currentTime = entry.t; } catch (e) {}
      } else {
        clearEntry();
        try { player.currentTime = 0; } catch (e) {}
      }
      // Auto-play after either choice — the click was a user gesture, so
      // the play promise is allowed here. Without this the viewer has to
      // click the main play button afterwards (double-click).
      try { player.play(); } catch (e) {}
    });
  }

  if (player.duration > 0) {
    maybePrompt();
  } else {
    player.once('loadedmetadata', maybePrompt);
    // YouTube fires 'ready' before duration on some browsers.
    player.once('ready', function () {
      if (player.duration > 0) maybePrompt();
    });
  }
}

function epResumeSourceKey(wrapper) {
  var media = wrapper.querySelector('video, audio, iframe');
  if (!media) return '';
  var src = media.getAttribute('src') || media.currentSrc || '';
  if (!src && media.querySelector) {
    var srcEl = media.querySelector('source');
    if (srcEl) src = srcEl.getAttribute('src') || '';
  }
  return src.replace(/[?#].*$/, '');
}

function epFormatTime(seconds) {
  seconds = Math.max(0, Math.floor(seconds));
  var h = Math.floor(seconds / 3600);
  var m = Math.floor((seconds % 3600) / 60);
  var s = seconds % 60;
  var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
  return h > 0 ? h + ':' + pad(m) + ':' + pad(s) : m + ':' + pad(s);
}

/**
 * Drop-off Heatmap
 *
 * Posts the viewer's current 1-percent bucket to /heatmap/sample at most
 * once per `interval` seconds while the video is playing. No personal
 * data is sent — only the URL of the video and the bucket index.
 */
function epInitHeatmap(player, wrapper, settings) {
  var videoUrl = epResumeSourceKey(wrapper) || '';
  if (!videoUrl) return;
  var lastSent = 0;
  var lastBucket = -1;
  var interval = (settings.interval || 30) * 1000;

  player.on('timeupdate', function () {
    var dur = player.duration || 0;
    if (!dur) return;
    var now = Date.now();
    if (now - lastSent < interval) return;

    var pct = Math.min(99, Math.max(0, Math.floor((player.currentTime / dur) * 100)));
    if (pct === lastBucket) return; // skip if viewer hasn't moved out of bucket
    lastBucket = pct;
    lastSent = now;

    var body = new FormData();
    body.append('video_url', videoUrl);
    body.append('bucket', pct);
    fetch(settings.rest_url, {
      method: 'POST',
      headers: { 'X-WP-Nonce': settings.nonce },
      body: body,
      credentials: 'same-origin',
      keepalive: true
    }).catch(function () {});
  });
}

/**
 * Course Completion Tracking
 *
 * Tracks actual playback time (not just current position) so seeking to
 * the end doesn't credit a watch-through. When watched_seconds /
 * total_seconds crosses the configured threshold, dispatches the
 * `embedpress:video-completed` event and POSTs to /completion. Fires
 * once per session, persisted in sessionStorage.
 */
function epInitLmsTracking(player, wrapper, settings) {
  var sourceKey = epResumeSourceKey(wrapper) || (wrapper.getAttribute('data-playerid') || '');
  var storageKey = 'embedpress_completed::' + sourceKey;
  try {
    if (window.sessionStorage.getItem(storageKey)) return;
  } catch (e) {}

  var threshold = (settings.threshold || 90) / 100;
  var watched = 0;
  var lastT = null;
  var fired = false;

  function tick() {
    if (fired) return;
    var t = player.currentTime || 0;
    if (lastT !== null) {
      var delta = t - lastT;
      // Count only forward, small steps as watched (skip cuts forward).
      if (delta > 0 && delta < 2) watched += delta;
    }
    lastT = t;

    var dur = player.duration || 0;
    if (!dur) return;
    var ratio = watched / dur;
    if (ratio >= threshold && t / dur >= threshold) {
      fired = true;
      epReportCompletion(wrapper, settings, watched, dur, storageKey);
    }
  }

  player.on('timeupdate', tick);
  player.on('seeking', function () { lastT = null; }); // pause counting across seeks
  player.on('ended', function () {
    if (fired) return;
    var dur = player.duration || 0;
    if (dur && watched / dur >= threshold) {
      fired = true;
      epReportCompletion(wrapper, settings, watched, dur, storageKey);
    }
  });
}

function epReportCompletion(wrapper, settings, watched, total, storageKey) {
  var videoUrl = epResumeSourceKey(wrapper) || '';
  var detail = {
    video_url:       videoUrl,
    watched_seconds: Math.round(watched),
    total_seconds:   Math.round(total),
  };

  // Public JS event — LMS plugins can listen client-side.
  document.dispatchEvent(new CustomEvent('embedpress:video-completed', { detail: detail }));

  // Server callback — fires `embedpress_video_completed` action server-side.
  var body = new FormData();
  body.append('video_url', detail.video_url);
  body.append('watched_seconds', detail.watched_seconds);
  body.append('total_seconds', detail.total_seconds);

  fetch(settings.rest_url, {
    method: 'POST',
    headers: { 'X-WP-Nonce': settings.nonce },
    body: body,
    credentials: 'same-origin'
  }).finally(function () {
    try { window.sessionStorage.setItem(storageKey, '1'); } catch (e) {}
  });
}

/**
 * Adaptive Streaming
 *
 * Wires hls.js / dash.js into the <video> element when the source is a
 * manifest (.m3u8 / .mpd). Both libraries are lazy-loaded from jsDelivr
 * once per page so they don't impact pages that don't use streaming.
 *
 * Native HLS playback (Safari) is preferred — hls.js only attaches when
 * MediaSource is required.
 */
function epAttachAdaptiveStreaming(videoEl) {
  if (!videoEl) return;
  var src = videoEl.getAttribute('src') || '';
  if (!src) {
    var srcEl = videoEl.querySelector('source');
    if (srcEl) src = srcEl.getAttribute('src') || '';
  }
  if (!src) return;
  var lower = src.toLowerCase().replace(/[?#].*$/, '');

  if (lower.endsWith('.m3u8')) {
    // Native HLS (Safari) — let the browser handle it.
    if (videoEl.canPlayType('application/vnd.apple.mpegurl')) return;
    epLoadScript('https://cdn.jsdelivr.net/npm/hls.js@1', function () {
      if (typeof window.Hls === 'undefined' || !window.Hls.isSupported()) return;
      var hls = new window.Hls();
      hls.loadSource(src);
      hls.attachMedia(videoEl);
    });
    return;
  }

  if (lower.endsWith('.mpd')) {
    epLoadScript('https://cdn.jsdelivr.net/npm/dashjs@4/dist/dash.all.min.js', function () {
      if (typeof window.dashjs === 'undefined') return;
      var p = window.dashjs.MediaPlayer().create();
      p.initialize(videoEl, src, false);
    });
  }
}

function epLoadScript(src, onReady) {
  var existing = document.querySelector('script[data-ep-src="' + src + '"]');
  if (existing) {
    if (existing.dataset.epLoaded === '1') {
      onReady();
    } else {
      existing.addEventListener('load', onReady, { once: true });
    }
    return;
  }
  var s = document.createElement('script');
  s.src = src;
  s.async = true;
  s.dataset.epSrc = src;
  s.addEventListener('load', function () {
    s.dataset.epLoaded = '1';
    onReady();
  });
  document.head.appendChild(s);
}

/**
 * Action Lock
 *
 * Blocks playback until the viewer completes a configured action.
 * Unlock state persists per video in sessionStorage. Verification is
 * best-effort (open-window heuristic for shares/links, login round-trip
 * for the login type).
 */
function epInitActionLock(player, wrapper, settings) {
  var sourceKey = epResumeSourceKey(wrapper) || (wrapper.getAttribute('data-playerid') || '');
  var storageKey = 'embedpress_unlock::' + sourceKey;

  try {
    if (window.sessionStorage.getItem(storageKey)) return;
  } catch (e) {}

  var unlocked = false;
  var overlay = epBuildActionLockOverlay(wrapper, settings, function () {
    unlocked = true;
    try { window.sessionStorage.setItem(storageKey, '1'); } catch (e) {}
    if (overlay && overlay.parentNode) overlay.remove();
    try { player.play(); } catch (e) {}
  });

  // Stop play attempts while locked.
  player.on('play', function () {
    if (!unlocked) {
      try { player.pause(); } catch (e) {}
    }
  });

  // Pause now in case autoplay started.
  try { player.pause(); } catch (e) {}
}

function epBuildActionLockOverlay(wrapper, settings, onUnlock) {
  if (wrapper.querySelector('.ep-action-lock')) return null;

  var overlay = document.createElement('div');
  overlay.className = 'ep-action-lock ep-action-lock--' + settings.type;

  var inner = document.createElement('div');
  inner.className = 'ep-action-lock__inner';

  if (settings.headline) {
    var h = document.createElement('p');
    h.className = 'ep-action-lock__headline';
    h.textContent = settings.headline;
    inner.appendChild(h);
  }
  if (settings.message) {
    var m = document.createElement('p');
    m.className = 'ep-action-lock__message';
    m.textContent = settings.message;
    inner.appendChild(m);
  }

  var actions = document.createElement('div');
  actions.className = 'ep-action-lock__actions';

  if (settings.type === 'share') {
    (settings.share_networks || []).forEach(function (net) {
      var url = epShareUrlFor(net, settings.share_url);
      if (!url) return;
      var btn = epOpenWindowButton(net.charAt(0).toUpperCase() + net.slice(1), url, onUnlock);
      btn.classList.add('ep-action-lock__btn--' + net);
      actions.appendChild(btn);
    });
  } else if (settings.type === 'link') {
    if (settings.link_url) {
      var linkBtn = epOpenWindowButton(settings.link_text || 'Open link', settings.link_url, onUnlock);
      actions.appendChild(linkBtn);
    }
  } else if (settings.type === 'login') {
    if (settings.login_url) {
      var loginBtn = document.createElement('a');
      loginBtn.className = 'ep-action-lock__btn ep-action-lock__btn--primary';
      loginBtn.href = settings.login_url;
      loginBtn.textContent = 'Log in';
      actions.appendChild(loginBtn);
    }
  }

  inner.appendChild(actions);
  overlay.appendChild(inner);
  wrapper.appendChild(overlay);
  return overlay;
}

function epShareUrlFor(network, target) {
  var encoded = encodeURIComponent(target || window.location.href);
  switch (network) {
    case 'facebook':
      return 'https://www.facebook.com/sharer/sharer.php?u=' + encoded;
    case 'twitter':
      return 'https://twitter.com/intent/tweet?url=' + encoded;
    case 'linkedin':
      return 'https://www.linkedin.com/sharing/share-offsite/?url=' + encoded;
    default:
      return '';
  }
}

function epOpenWindowButton(label, url, onComplete) {
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'ep-action-lock__btn ep-action-lock__btn--primary';
  btn.textContent = label;
  btn.addEventListener('click', function () {
    var w = window.open(url, '_blank', 'noopener,noreferrer,width=600,height=520');
    btn.disabled = true;
    btn.textContent = 'Verifying…';

    // Best-effort: unlock once the user returns focus to the host page.
    var armed = false;
    setTimeout(function () { armed = true; }, 1500);
    var onFocus = function () {
      if (!armed) return;
      window.removeEventListener('focus', onFocus);
      onComplete();
    };
    window.addEventListener('focus', onFocus);

    // Fallback: if popup was blocked, navigate parent and unlock.
    if (!w) {
      window.removeEventListener('focus', onFocus);
      onComplete();
    }
  });
  return btn;
}

/**
 * Email Capture
 *
 * Pauses playback at the configured trigger and shows a form overlay.
 * On submit posts to /embedpress/v1/lead and resumes. Submission is
 * remembered per video in localStorage so the prompt fires once.
 */
function epInitEmailCapture(player, wrapper, settings) {
  var sourceKey = epResumeSourceKey(wrapper) || (window.location.pathname + ':' + (wrapper.getAttribute('data-playerid') || ''));
  var storageKey = 'embedpress_lead::' + sourceKey;

  // In the block editor, ignore the "already submitted" localStorage flag so
  // toggling the option in the inspector reliably re-shows the form.
  // Otherwise a single test submit permanently hides it.
  var isEditor = !!(document.body && (
    document.body.classList.contains('block-editor-page') ||
    document.body.classList.contains('wp-admin') ||
    document.querySelector('.block-editor')
  ));

  // Already submitted? Skip entirely (front-end only).
  try {
    if (!isEditor && window.localStorage.getItem(storageKey)) return;
  } catch (e) {}

  var triggered = false;
  player.on('timeupdate', function () {
    if (triggered) return;
    var now = player.currentTime || 0;
    var dur = player.duration || 0;
    var triggerAt;
    if (settings.unit === 'percent' && dur > 0) {
      triggerAt = (settings.time / 100) * dur;
    } else {
      triggerAt = settings.time;
    }
    if (now < triggerAt) return;
    triggered = true;
    try { player.pause(); } catch (e) {}
    epShowEmailCaptureForm(wrapper, settings, function (submitted) {
      if (submitted) {
        try { window.localStorage.setItem(storageKey, '1'); } catch (e) {}
      }
      try { player.play(); } catch (e) {}
    });
  });
}

function epShowEmailCaptureForm(wrapper, settings, onDone) {
  if (wrapper.querySelector('.ep-lead-form')) return;

  var overlay = document.createElement('div');
  overlay.className = 'ep-lead-form';

  var form = document.createElement('form');
  form.className = 'ep-lead-form__inner';
  form.setAttribute('novalidate', 'true');

  var headline = document.createElement('p');
  headline.className = 'ep-lead-form__headline';
  headline.textContent = settings.headline || 'Enter your email to keep watching';
  form.appendChild(headline);

  var nameInput = null;
  if (settings.require_name) {
    nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.required = true;
    nameInput.placeholder = 'Your name';
    nameInput.className = 'ep-lead-form__input';
    form.appendChild(nameInput);
  }

  var emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.required = true;
  emailInput.placeholder = 'you@example.com';
  emailInput.className = 'ep-lead-form__input';
  form.appendChild(emailInput);

  var error = document.createElement('p');
  error.className = 'ep-lead-form__error';
  error.style.display = 'none';
  form.appendChild(error);

  var actions = document.createElement('div');
  actions.className = 'ep-lead-form__actions';

  var submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'ep-lead-form__btn ep-lead-form__btn--primary';
  submit.textContent = settings.button_text || 'Continue';
  actions.appendChild(submit);

  if (settings.allow_skip) {
    var skip = document.createElement('button');
    skip.type = 'button';
    skip.className = 'ep-lead-form__btn';
    skip.textContent = 'Skip';
    skip.addEventListener('click', function () {
      overlay.remove();
      onDone(false);
    });
    actions.appendChild(skip);
  }
  form.appendChild(actions);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    error.style.display = 'none';
    var email = (emailInput.value || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      error.textContent = 'Please enter a valid email address.';
      error.style.display = 'block';
      return;
    }
    if (nameInput && !(nameInput.value || '').trim()) {
      error.textContent = 'Please enter your name.';
      error.style.display = 'block';
      return;
    }
    submit.disabled = true;
    submit.textContent = 'Sending…';

    var body = new FormData();
    body.append('email', email);
    if (nameInput) body.append('name', nameInput.value.trim());
    body.append('video_url', epResumeSourceKey(wrapper) || '');
    body.append('page_url', window.location.href);

    fetch(settings.rest_url, {
      method: 'POST',
      headers: { 'X-WP-Nonce': settings.nonce },
      body: body
    }).then(function (res) {
      // Resume even on error; we don't want to trap the viewer.
      overlay.remove();
      onDone(true);
    }).catch(function () {
      overlay.remove();
      onDone(true);
    });
  });

  overlay.appendChild(form);
  wrapper.appendChild(overlay);
}

/**
 * Video Chapters
 *
 * Renders tick marks on the progress bar at each chapter's start, a
 * top-left badge showing the current chapter (toggle to expand the full
 * list), and click-to-seek behavior on both ticks and list items.
 */
function epInitChapters(player, wrapper, settings) {
  var items = (settings.items || []).slice().sort(function (a, b) { return a.time - b.time; });
  var showTitle = settings.show_title !== false;
  var label, list, ticksHost, tooltipEl;
  // Anchor overlays to the embed wrapper. CSS gives .ep-embed-content-wraper
  // position:relative so top/left on the absolute label resolve here, not on
  // some far-away ancestor.
  wrapper.classList.add('ep-has-chapters');

  function findCurrentIndex(t) {
    if (!items.length) return -1;
    // Clamp before the first chapter to chapter 0 so the label always
    // reflects a chapter once playback starts, instead of going blank
    // when the first chapter doesn't start at exactly 0.
    if (t < items[0].time) return 0;
    var idx = 0;
    for (var i = 0; i < items.length; i++) {
      if (t >= items[i].time) idx = i; else break;
    }
    return idx;
  }

  function buildPanel() {
    if (showTitle && !label) {
      label = document.createElement('button');
      label.type = 'button';
      label.className = 'ep-chapter-label';
      label.setAttribute('aria-label', 'Toggle chapter list');
      label.innerHTML = '<span class="ep-chapter-label__title"></span><span class="ep-chapter-label__caret">▾</span>';
      label.addEventListener('click', function (e) {
        e.stopPropagation();
        list.classList.toggle('ep-chapter-list--open');
      });
      wrapper.appendChild(label);
    }

    list = document.createElement('div');
    list.className = 'ep-chapter-list';
    items.forEach(function (item, idx) {
      var row = document.createElement('button');
      row.type = 'button';
      row.className = 'ep-chapter-list__item';
      row.dataset.idx = idx;
      row.innerHTML = '<span class="ep-chapter-list__time">' + epFormatTime(item.time) + '</span>'
        + '<span class="ep-chapter-list__title"></span>';
      row.querySelector('.ep-chapter-list__title').textContent = item.title;
      row.addEventListener('click', function () {
        try { player.currentTime = item.time; } catch (e) {}
        list.classList.remove('ep-chapter-list--open');
      });
      list.appendChild(row);
    });
    wrapper.appendChild(list);
  }

  function buildTicks() {
    var dur = player.duration || 0;
    if (!dur) return;
    var progress = wrapper.querySelector('.plyr__progress');
    if (!progress) return;

    if (ticksHost) ticksHost.remove();
    ticksHost = document.createElement('div');
    ticksHost.className = 'ep-chapter-bar';

    // Drop chapters whose start is past the video duration — they'd
    // compute to >100% and produce calc(6068% - 4px)-style overflowing
    // segments. Clamp the resulting percentages to [0,100] as a final
    // guard against sub-second `dur` races during YouTube IFrame ready.
    var sorted = items
      .filter(function (it) { return it && typeof it.time === 'number' && it.time < dur; });
    // Prepend a synthetic [0 → first-chapter-start] segment so the bar
    // covers the full duration. Carry an empty title so the tooltip
    // doesn't lie about which chapter the viewer is over.
    if (sorted[0] && sorted[0].time > 0) {
      sorted.unshift({ time: 0, title: '' });
    }
    if (!sorted.length) return;

    // Render one DOM segment per chapter — these visually replace Plyr's
    // continuous fill. Plyr's native track is hidden via CSS; the input
    // and thumb stay interactive (segments use pointer-events: none).
    progress.classList.add('ep-chapters-split');

    var GAP_PX = 4;
    var segs = [];
    sorted.forEach(function (item, i) {
      var startPct = Math.max(0, Math.min(100, (item.time / dur) * 100));
      var endPct = (i + 1 < sorted.length)
        ? Math.max(0, Math.min(100, (sorted[i + 1].time / dur) * 100))
        : 100;
      var spanPct = endPct - startPct;
      if (spanPct <= 0) return;

      var seg = document.createElement('div');
      seg.className = 'ep-chapter-seg';
      var leftOffset = (i === 0) ? 0 : (GAP_PX / 2);
      var rightOffset = (i === sorted.length - 1) ? 0 : (GAP_PX / 2);
      seg.style.left = 'calc(' + startPct + '% + ' + leftOffset + 'px)';
      seg.style.width = 'calc(' + spanPct + '% - ' + (leftOffset + rightOffset) + 'px)';

      var fill = document.createElement('div');
      fill.className = 'ep-chapter-seg__fill';
      seg.appendChild(fill);

      seg._start = item.time;
      seg._end = (i + 1 < sorted.length) ? sorted[i + 1].time : dur;
      seg._title = item.title;
      seg._fill = fill;

      ticksHost.appendChild(seg);
      segs.push(seg);
    });

    function updateFills(t) {
      segs.forEach(function (seg) {
        var span = seg._end - seg._start;
        var local = Math.max(0, Math.min(span, t - seg._start));
        seg._fill.style.width = (span > 0 ? (local / span) * 100 : 0) + '%';
      });
    }

    function onMove(e) {
      var rect = progress.getBoundingClientRect();
      if (!rect.width) return;
      var pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      var t = pct * dur;
      var hovered = null;
      for (var i = 0; i < segs.length; i++) {
        if (t >= segs[i]._start && t <= segs[i]._end) { hovered = segs[i]; break; }
      }
      segs.forEach(function (s) { s.classList.toggle('ep-chapter-seg--hover', s === hovered); });
      // Append the chapter title as a second line inside Plyr's existing
      // seek tooltip. Plyr binds its own mousemove handler first (during
      // Plyr init); ours runs after, so by this point Plyr has already
      // written the time string and we can append without a race.
      var tip = progress.querySelector('.plyr__tooltip');
      if (!tip) return;
      // Strip any prior chapter line we appended on the previous move so
      // we don't accumulate <br> stacks if Plyr's update is skipped.
      var existing = tip.querySelector('.ep-chapter-tooltip-title');
      if (existing) existing.remove();
      var existingBr = tip.querySelector('br.ep-chapter-tooltip-br');
      if (existingBr) existingBr.remove();
      if (hovered && hovered._title) {
        var br = document.createElement('br');
        br.className = 'ep-chapter-tooltip-br';
        var titleSpan = document.createElement('span');
        titleSpan.className = 'ep-chapter-tooltip-title';
        titleSpan.textContent = hovered._title;
        tip.appendChild(br);
        tip.appendChild(titleSpan);
      }
    }
    function onLeave() {
      segs.forEach(function (s) { s.classList.remove('ep-chapter-seg--hover'); });
      var tip = progress.querySelector('.plyr__tooltip');
      if (tip) {
        var existing = tip.querySelector('.ep-chapter-tooltip-title');
        if (existing) existing.remove();
        var existingBr = tip.querySelector('br.ep-chapter-tooltip-br');
        if (existingBr) existingBr.remove();
      }
    }
    progress.addEventListener('mousemove', onMove);
    progress.addEventListener('mouseleave', onLeave);

    updateFills(player.currentTime || 0);
    player.on('timeupdate', function () { updateFills(player.currentTime || 0); });
    player.on('seeked', function () { updateFills(player.currentTime || 0); });

    progress.appendChild(ticksHost);
  }

  function refreshLabel() {
    if (!label) return;
    var idx = findCurrentIndex(player.currentTime || 0);
    var titleEl = label.querySelector('.ep-chapter-label__title');
    if (idx < 0) {
      titleEl.textContent = '';
      label.classList.add('ep-chapter-label--hidden');
    } else {
      titleEl.textContent = items[idx].title;
      label.classList.remove('ep-chapter-label--hidden');
    }
    Array.prototype.forEach.call(list.querySelectorAll('.ep-chapter-list__item'), function (row, i) {
      row.classList.toggle('ep-chapter-list__item--active', i === idx);
    });
  }

  buildPanel();
  if (player.duration > 0) buildTicks();
  player.on('loadedmetadata', buildTicks);
  player.on('ready', buildTicks);
  player.on('timeupdate', refreshLabel);
  player.on('play', refreshLabel);
  player.on('seeked', refreshLabel);
  refreshLabel();

  // Click-outside to close list
  document.addEventListener('click', function (e) {
    if (!list.classList.contains('ep-chapter-list--open')) return;
    if (label && (label.contains(e.target) || list.contains(e.target))) return;
    list.classList.remove('ep-chapter-list--open');
  });
}

/**
 * Timed CTA
 *
 * Items fire at their `time` (seconds), render an overlay anchored to the
 * bottom of the player, and auto-hide after `duration` (0 = until dismissed
 * or video ends). Each item fires at most once per session.
 */
function epInitTimedCTA(player, wrapper, items) {
  // Shallow clone so flags don't mutate the data-options literal.
  var queue = items.map(function (it) {
    return Object.assign({}, it, { _shown: false, _el: null, _timer: null });
  });

  player.on('timeupdate', function () {
    var now = player.currentTime || 0;
    queue.forEach(function (item) {
      if (item._shown) return;
      if (now < item.time) return;
      item._shown = true;
      epShowTimedCTA(wrapper, item);
    });
  });

  player.on('seeked', function () {
    var now = player.currentTime || 0;
    queue.forEach(function (item) {
      if (item._shown && now < item.time && item._el) {
        item._el.remove();
        if (item._timer) clearTimeout(item._timer);
        item._shown = false;
      }
    });
  });

  player.on('ended', function () {
    queue.forEach(function (item) {
      if (item._el) item._el.remove();
      if (item._timer) clearTimeout(item._timer);
    });
  });
}

function epShowTimedCTA(wrapper, item) {
  var el = document.createElement('div');
  el.className = 'ep-timed-cta';
  item._el = el;

  var inner = document.createElement('div');
  inner.className = 'ep-timed-cta__inner';

  if (item.headline) {
    var h = document.createElement('p');
    h.className = 'ep-timed-cta__headline';
    h.textContent = item.headline;
    inner.appendChild(h);
  }
  if (item.button_text && item.button_url) {
    var btn = document.createElement('a');
    btn.className = 'ep-timed-cta__btn';
    btn.href = item.button_url;
    btn.target = '_blank';
    btn.rel = 'noopener noreferrer';
    btn.textContent = item.button_text;
    inner.appendChild(btn);
  }
  el.appendChild(inner);

  if (item.dismissible !== false) {
    var close = document.createElement('button');
    close.type = 'button';
    close.className = 'ep-timed-cta__close';
    close.setAttribute('aria-label', 'Close');
    close.innerHTML = '&times;';
    close.addEventListener('click', function () {
      el.remove();
      if (item._timer) clearTimeout(item._timer);
    });
    el.appendChild(close);
  }

  wrapper.appendChild(el);

  if (item.duration && item.duration > 0) {
    item._timer = setTimeout(function () {
      if (el.parentNode) el.remove();
    }, item.duration * 1000);
  }
}

/**
 * Advanced Privacy Mode
 *
 * Renders a click-to-load overlay over the wrapper. The iframe's real `src`
 * has already been stashed in `data-ep-privacy-src` server-side; here we
 * just show a poster + play button and restore the URL on click.
 */
function epShowPrivacyOverlay(wrapper, options, onConsent) {
  if (wrapper.querySelector('.ep-privacy-overlay')) return;
  wrapper.style.opacity = '1';

  var overlay = document.createElement('div');
  overlay.className = 'ep-privacy-overlay';

  var poster = options.poster_thumbnail || epGuessYouTubeThumbnail(wrapper);
  if (poster) {
    overlay.style.backgroundImage = 'url("' + poster.replace(/"/g, '\\"') + '")';
    overlay.classList.add('ep-privacy-overlay--has-poster');
  }

  var play = document.createElement('button');
  play.type = 'button';
  play.className = 'ep-privacy-overlay__play';
  play.setAttribute('aria-label', 'Load and play video');
  play.innerHTML = '<svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true"><circle cx="32" cy="32" r="32" fill="rgba(0,0,0,0.6)"/><polygon points="26,20 26,44 46,32" fill="#fff"/></svg>';

  var msg = document.createElement('p');
  msg.className = 'ep-privacy-overlay__msg';
  msg.textContent = options.privacy_message || 'Click to load. By playing, you accept third-party cookies.';

  overlay.appendChild(play);
  overlay.appendChild(msg);

  overlay.addEventListener('click', function () {
    overlay.remove();
    onConsent();
  });

  wrapper.appendChild(overlay);
}

function epRestorePrivacyIframes(wrapper) {
  var iframes = wrapper.querySelectorAll('iframe[data-ep-privacy-src]');
  iframes.forEach(function (iframe) {
    var src = iframe.getAttribute('data-ep-privacy-src');
    iframe.removeAttribute('data-ep-privacy-src');
    if (src) iframe.setAttribute('src', src);
  });
}

function epGuessYouTubeThumbnail(wrapper) {
  var iframe = wrapper.querySelector('iframe[data-ep-privacy-src]');
  if (!iframe) return '';
  var src = iframe.getAttribute('data-ep-privacy-src') || '';
  var m = src.match(/(?:youtube(?:-nocookie)?\.com\/embed\/|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
  return m ? 'https://img.youtube.com/vi/' + m[1] + '/hqdefault.jpg' : '';
}

/**
 * Custom End Screen
 *
 * Renders a configurable overlay when the video reaches `ended`. Three modes:
 *  - message: simple message (+ optional replay)
 *  - cta:     message + button linking elsewhere
 *  - redirect: redirects after a countdown
 */
function epInitEndScreen(player, wrapper, settings) {
  player.on('ended', function () {
    epShowEndScreen(wrapper, settings, function () {
      try {
        player.currentTime = 0;
        player.play();
      } catch (e) {}
    });
  });
}

function epShowEndScreen(wrapper, settings, onReplay) {
  // Avoid duplicates if 'ended' fires twice.
  var existing = wrapper.querySelector('.ep-end-screen');
  if (existing) existing.remove();

  var mode = settings.mode || 'message';
  var msg = settings.message || '';
  var showReplay = settings.show_replay !== false;

  var overlay = document.createElement('div');
  overlay.className = 'ep-end-screen ep-end-screen--' + mode;

  var inner = document.createElement('div');
  inner.className = 'ep-end-screen__inner';

  if (msg) {
    var p = document.createElement('p');
    p.className = 'ep-end-screen__msg';
    p.textContent = msg;
    inner.appendChild(p);
  }

  if (mode === 'cta' && settings.button_url && settings.button_text) {
    var cta = document.createElement('a');
    cta.className = 'ep-end-screen__btn ep-end-screen__btn--primary';
    cta.href = settings.button_url;
    cta.target = '_blank';
    cta.rel = 'noopener noreferrer';
    cta.textContent = settings.button_text;
    inner.appendChild(cta);
  }

  var actions = document.createElement('div');
  actions.className = 'ep-end-screen__actions';

  if (showReplay) {
    var replay = document.createElement('button');
    replay.type = 'button';
    replay.className = 'ep-end-screen__btn';
    replay.textContent = 'Replay';
    replay.addEventListener('click', function () {
      overlay.remove();
      onReplay();
    });
    actions.appendChild(replay);
  }

  if (mode === 'redirect' && settings.redirect_url) {
    var countdown = Math.max(0, parseInt(settings.countdown, 10) || 0);
    var countEl = document.createElement('p');
    countEl.className = 'ep-end-screen__countdown';
    inner.appendChild(countEl);

    var redirectNow = function () {
      window.location.href = settings.redirect_url;
    };

    if (countdown === 0) {
      redirectNow();
      return;
    }

    countEl.textContent = 'Redirecting in ' + countdown + 's…';
    var remaining = countdown;
    var timer = setInterval(function () {
      remaining -= 1;
      if (remaining <= 0) {
        clearInterval(timer);
        redirectNow();
        return;
      }
      countEl.textContent = 'Redirecting in ' + remaining + 's…';
    }, 1000);

    var cancel = document.createElement('button');
    cancel.type = 'button';
    cancel.className = 'ep-end-screen__btn';
    cancel.textContent = 'Cancel';
    cancel.addEventListener('click', function () {
      clearInterval(timer);
      overlay.remove();
    });
    actions.appendChild(cancel);
  }

  if (actions.childNodes.length) inner.appendChild(actions);
  overlay.appendChild(inner);
  wrapper.appendChild(overlay);
}

function epShowResumePrompt(wrapper, time, onChoice) {
  if (wrapper.querySelector('.ep-resume-prompt')) return;
  var overlay = document.createElement('div');
  overlay.className = 'ep-resume-prompt';
  overlay.innerHTML =
    '<div class="ep-resume-prompt__inner">' +
      '<p class="ep-resume-prompt__msg">Resume at ' + epFormatTime(time) + '?</p>' +
      '<div class="ep-resume-prompt__actions">' +
        '<button type="button" class="ep-resume-prompt__btn ep-resume-prompt__btn--primary" data-action="resume">Resume</button>' +
        '<button type="button" class="ep-resume-prompt__btn" data-action="restart">Start Over</button>' +
      '</div>' +
    '</div>';
  overlay.addEventListener('click', function (e) {
    var action = e.target && e.target.getAttribute && e.target.getAttribute('data-action');
    if (!action) return;
    overlay.remove();
    onChoice(action === 'resume');
  });
  wrapper.appendChild(overlay);
}
