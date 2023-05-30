document.addEventListener('DOMContentLoaded', function () {
  const embedWrappers = document.querySelectorAll('.ep-embed-content-wraper');
  embedWrappers.forEach(wrapper => {
    initPlayer(wrapper);
  });

  document.addEventListener('DOMNodeInserted', handleDOMNodeInserted, false);

  function handleDOMNodeInserted(event) {
    const targetElement = event.target.querySelector('.ep-embed-content-wraper');
    if (targetElement) {
      initPlayer(targetElement);
    }
  }

  function initPlayer(wrapper) {
    const playerId = wrapper.getAttribute('data-playerid');
    if (playerId && !wrapper.classList.contains('plyr-initialized')) {
      const selector = `[data-playerid="${playerId}"] > .ose-embedpress-responsive`;
      new Plyr(selector, {
        controls: [
          'play-large', // The large play button in the center
          'restart', // Restart playback
          'rewind', // Rewind by the seek time (default 10 seconds)
          'play', // Play/pause playback
          'fast-forward', // Fast forward by the seek time (default 10 seconds)
          'progress', // The progress bar and scrubber for playback and buffering
          'current-time', // The current time of playback
          'duration', // The full duration of the media
          'mute', // Toggle mute
          'volume', // Volume control
          'captions', // Toggle captions
          'settings', // Settings menu
          'pip', // Picture-in-picture (currently Safari only)
          'airplay', // Airplay (currently Safari only)
          'download', // Show a download button with a link to either the current source or a custom URL you specify in your options
          'fullscreen', // Toggle fullscreen
        ],
        seekTime: 10,
        ads: { enabled: false, publisherId: '', tagUrl: 'https://googleads.github.io/googleads-ima-html5/vsi/' }

        // Adjust the seek time as needed (in seconds)
      });
      wrapper.classList.add('plyr-initialized');
    }
  }
});
