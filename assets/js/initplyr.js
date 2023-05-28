document.addEventListener('DOMContentLoaded', function () {
    const interval = setInterval(() => {
        const targetElement = document.querySelector('.ep-embed-content-wraper');
        console.log('ok');
        if (targetElement) {
            clearInterval(interval);
            initPlayer();
        }
    }, 100);

    function initPlayer() {
        const epEmbedWrapper = document.querySelectorAll('.ep-embed-content-wraper');
        epEmbedWrapper.forEach(wrapper => {
            const playerId = wrapper.getAttribute('data-playerid');
            if (playerId) {
                const selector = `[data-playerid="${playerId}"] > .ose-embedpress-responsive`;
                new Plyr(selector, {});
            }
        });
    }

});