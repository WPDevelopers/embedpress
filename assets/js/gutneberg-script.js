function handlePosterImageLoad() {
    wp.data.subscribe(() => {
        var posterImages = document.querySelectorAll(".plyr__poster");
        var videoWrappers = document.querySelectorAll("[data-playerid]");

        // Iterate over each posterImage
        posterImages.forEach(function (posterImage) {
            if (posterImage) {
                var observer = new MutationObserver(function (mutationsList, observer) {
                    var posterImageStyle = window.getComputedStyle(posterImage);
                    if (posterImageStyle.getPropertyValue('background-image') !== 'none') {
                        setTimeout(function () {
                            videoWrapper.style.opacity = "1";
                        }, 200);
                        observer.disconnect();
                    }
                });

                observer.observe(posterImage, {
                    attributes: true,
                    attributeFilter: ['style']
                });
            }
        });

        // Iterate over each videoWrapper
        videoWrappers.forEach(function (videoWrapper) {
            if (videoWrapper && posterImages.length > 0) {
                videoWrapper.style.opacity = "1";
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", handlePosterImageLoad);
