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



    // Create a new Plyr player instance with the specified options and controls
    const player = new Plyr(selector, {
      controls: controls,
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

    // Auto Resume Playback (Pro)
    if (options.auto_resume) {
      epInitAutoResume(player, wrapper, options);
    }

    // Custom End Screen (Pro)
    if (options.end_screen) {
      epInitEndScreen(player, wrapper, options.end_screen);
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
      }
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
