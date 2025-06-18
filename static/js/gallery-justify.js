(function(){
    function justifyGallery() {
        const justify_scale = screen.height * 0.2;
        let items = document.querySelectorAll('.photos-gallery-justify .photo-item');

        items.forEach(item => {
            let image = item.querySelector('img');
            if (!image) return;

            function adjustItem() {
                let ratio = image.naturalWidth / image.naturalHeight;
                item.style.width = justify_scale * ratio + 'px';
                item.style.flexGrow = ratio;
            }

            if (image.complete) {
                adjustItem();
            } else {
                image.onload = adjustItem;
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', justifyGallery);
    } else {
        justifyGallery();
    }


    window.addEventListener('load', justifyGallery);
})();

console.log("checking for justifyGallery");