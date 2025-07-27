(function() {
  "use strict";
  function handlePosterImageLoad() {
    wp.data.subscribe(() => {
      var posterImages = document.querySelectorAll(".plyr__poster");
      var videoWrappers = document.querySelectorAll("[data-playerid]");
      posterImages.forEach(function(posterImage) {
        if (posterImage) {
          var observer = new MutationObserver(function(mutationsList, observer2) {
            var posterImageStyle = window.getComputedStyle(posterImage);
            if (posterImageStyle.getPropertyValue("background-image") !== "none") {
              setTimeout(function() {
                videoWrapper.style.opacity = "1";
              }, 200);
              observer2.disconnect();
            }
          });
          observer.observe(posterImage, {
            attributes: true,
            attributeFilter: ["style"]
          });
        }
      });
      videoWrappers.forEach(function(videoWrapper2) {
        if (videoWrapper2 && posterImages.length > 0) {
          videoWrapper2.style.opacity = "1";
        }
      });
    });
  }
  document.addEventListener("DOMContentLoaded", handlePosterImageLoad);
})();
//# sourceMappingURL=gutenberg.build.js.map
