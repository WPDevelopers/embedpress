function handlePosterImageLoad() {
    wp.data.subscribe(() => {
        var posterImage = document.querySelector(".plyr__poster");
        var videoWrapper = document.querySelector(".plyr__video-wrapper");

        // Check if posterImage exists
        if (posterImage) {
            console.log("after condition", posterImage);

            var observer = new MutationObserver(function (mutationsList, observer) {
                var posterImageStyle = window.getComputedStyle(posterImage);
                if (posterImageStyle.getPropertyValue('background-image') !== 'none') {
                    console.log("After background-image property");
                    setTimeout(function () {
                        videoWrapper.style.opacity = "1";
                    }, 200);
                    observer.disconnect();
                }
            });

            observer.observe(posterImage, { attributes: true, attributeFilter: ['style'] });
        }

        if (videoWrapper && posterImage) {
            videoWrapper.style.opacity = "1";
        }

    });

}

document.addEventListener("DOMContentLoaded", handlePosterImageLoad);
