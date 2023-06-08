document.addEventListener('DOMContentLoaded', function () {
  let embedWrappers = document.querySelectorAll('.ep-embed-content-wraper');

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
      let options = document.querySelector(`[data-playerid="${playerId}"]`).getAttribute('data-options');
      options = JSON.parse(options);

      document.querySelector(`[data-playerid="${playerId}"] iframe`).setAttribute('data-poster', options.poster_thumbnail);

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
        'download',
        'fullscreen'
      ].filter(control => control !== '');

      const player = new Plyr(selector, {
        controls: controls,
        seekTime: 10,
        ads: { enabled: false, publisherId: '', tagUrl: 'https://googleads.github.io/googleads-ima-html5/vsi/' },
        poster: options.poster_thumbnail,
        storage: {
          enabled: true,
          key: 'plyr_volume'
        },
        displayDuration: true,
        tooltips: { controls: options.player_tooltip, seek: options.player_tooltip },
        hideControls: options.hide_controls

      });

      wrapper.classList.add('plyr-initialized');
    }



    const pipInterval = setInterval(() => {
      let playerPip = document.querySelector(`[data-playerid="${playerId}"] [data-plyr="pip"]`);
      if (playerPip) {
        clearInterval(pipInterval);
        // const playerPip = document.querySelector(`[data-playerid="${playerId}"] [data-plyr="pip"]`);
        const iframeSelector = document.querySelector(`[data-playerid="${playerId}"] iframe`);

        playerPip.addEventListener('click', () => {
          playerCustomPip(iframeSelector, playerPip);
          console.log('clicked');
        });
      }
    }, 200);

  }

  const playerCustomPip = (iframeSelector, pipButton) => {
    iframeSelector.classList.toggle('pip-mode');
  }

  // Rest of the code...
});
