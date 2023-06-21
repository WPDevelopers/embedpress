/**
 * Note: This is complex initialization, but it is necessary for Gutenberg and Elementor compatibility. There are some known issues in Gutenberg that require this complex setup.
 */

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
  let options = document.querySelector(`[data-playerid="${playerId}"]`)?.getAttribute('data-options');
  
  if(!options) {
    return false;
  }

  // Parse the options string into a JSON object
  options = JSON.parse(options);  

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


    let selector = `[data-playerid="${playerId}"] .ose-embedpress-responsive`;

    if (options.self_hosted && options.hosted_format === 'video') {
      selector = `[data-playerid="${playerId}"] .ose-embedpress-responsive video`;
    }
    else if (options.self_hosted && options.hosted_format === 'audio') {
      selector = `[data-playerid="${playerId}"] .ose-embedpress-responsive audio`;
    }


    // Set the main color of the player
    document.querySelector(`[data-playerid="${playerId}"]`).style.setProperty('--plyr-color-main', options.player_color);
    document.querySelector(`[data-playerid="${playerId}"].custom-player-preset-1, [data-playerid="${playerId}"].custom-player-preset-3, [data-playerid="${playerId}"].custom-player-preset-4`)?.style.setProperty('--plyr-range-fill-background', '#ffffff');

    // Set the poster thumbnail for the player
    if (document.querySelector(`[data-playerid="${playerId}"] iframe`)) {
      document.querySelector(`[data-playerid="${playerId}"] iframe`).setAttribute('data-poster', options.poster_thumbnail);
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

    // Mark the wrapper as initialized
    wrapper.classList.add('plyr-initialized');
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

          console.log(pipClose);

          pipClose.addEventListener('click', () => {
            iframeSelector.classList.remove('pip-mode');
            console.log(iframeSelector.classList);
          });


          iframeSelector.addEventListener('click', () => {
            const ariaPressedValue = document.querySelector(`[data-playerid="${playerId}"] .plyr__controls [data-plyr="play"]`).getAttribute('aria-pressed');

            console.log(ariaPressedValue);
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
