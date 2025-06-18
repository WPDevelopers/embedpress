/**
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2023 EmbedPress. All rights reserved.
 * @license     GPLv2 or later
 * @since       1.7.0
 */



let instaGlobals = {};

(function ($) {
    'use strict';

    // Get the insta-gallery container element
    const getPopupTemplate = (instPost) => {

        let instaPostData = JSON.parse(instPost);

        let likeIcon = '<svg aria-label="Like" class="x1lliihq x1n2onr6" color="#262626" fill="#262626" height="24" viewBox="0 0 24 24" width="24"><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"/></svg>';

        if (instaPostData.like_count > 0) {
            likeIcon = '<svg aria-label="Unlike" class="x1lliihq x1n2onr6" color="#FF3040" fill="#FF3040" height="24" viewBox="0 0 48 48" width="24"><path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"/></svg>';
        }

        const commentsIcon = '<svg aria-label="Comment" class="x1lliihq x1n2onr6" color="#000" height="24" viewBox="0 0 24 24" width="24"><path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"/></svg>';

        const shareIcon = '<svg aria-label="Share Post" class="x1lliihq x1n2onr6" color="#000" fill="#737373" height="24" viewBox="0 0 24 24" width="24"><path fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="M22 3 9.218 10.083m2.48 10.251L22 3.001H2l7.218 7.083 2.48 10.25z"/></svg>';

        const instaIcon = '<svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" xml:space="preserve" width="20" height="20"><style>.st0{fill:none;stroke:#000;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10}</style><path class="st0" d="M14.375 19.375h-8.75c-2.75 0-5-2.25-5-5v-8.75c0-2.75 2.25-5 5-5h8.75c2.75 0 5 2.25 5 5v8.75c0 2.75-2.25 5-5 5z"/><path class="st0" d="M14.375 10A4.375 4.375 0 0 1 10 14.375 4.375 4.375 0 0 1 5.625 10a4.375 4.375 0 0 1 8.75 0zm1.25-5.625A.625.625 0 0 1 15 5a.625.625 0 0 1-.625-.625.625.625 0 0 1 1.25 0z"/></svg>';

        const instaUserInfo = instPost.user_info;

        let getDate = new Date(instaPostData.timestamp);
        getDate = getDate.toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

        let getTime = new Date(instaPostData.timestamp);
        getTime = getTime.toLocaleString('en-US', { hour12: false, hour: 'numeric', minute: 'numeric', second: 'numeric' });

        let captionText = instaPostData.caption ? instaPostData.caption : '';
        const tagRegex = /(#\w+)/g;

        let tagUrl = 'https://www.instagram.com/explore/tags/$1';

        tagUrl = tagUrl.replace(/#/g, '');

        const wrapTag = `<span class="tag-wrapper"><a target="_blank" href="${tagUrl}">$1</a></span>`;

        captionText = captionText.replace(tagRegex, wrapTag);

        let carouselTemplate = '';
        if (instaPostData.media_type === 'CAROUSEL_ALBUM') {
            carouselTemplate += `<div class="popup-carousel"><div class="cg-carousel__track js-carousel__track">`;

            instaPostData.children.data?.map((item) => {
                console.log(item);
                if (item.media_type?.toLowerCase() === 'video') {
                    carouselTemplate += `<video width="630" class="popup-media-image cg-carousel__slide js-carousel__slide" controls src="${item.media_url || ''}" alt="${item.caption || ''}" controlsList="nodownload"></video>`;
                }
                else {
                    carouselTemplate += `<img width="630" class="popup-media-image cg-carousel__slide js-carousel__slide" src="${item.media_url || ''}" alt="${item.caption || ''}" />`;
                    console.log(item);
                }
            });

            carouselTemplate += `</div></div>`;

            carouselTemplate += `<div class="cg-carousel__btns">
                    <button class="cg-carousel__btn js-carousel__prev-1"><svg width="20" height="30" viewBox="-5 0 23 23" xmlns="http://www.w3.org/2000/svg"><path d="M11.24.29.361 10.742l-.06.054a.97.97 0 0 0-.301.642v.124a.97.97 0 0 0 .3.642l.054.044L11.239 22.71a1.061 1.061 0 0 0 1.459 0 .964.964 0 0 0 0-1.402l-10.15-9.746 10.15-9.87a.964.964 0 0 0 0-1.402 1.061 1.061 0 0 0-1.459 0Z" fill="#fff"/></svg></button>

                    <button class="cg-carousel__btn js-carousel__next-1"><svg width="20" height="30" viewBox="-5 0 23 23" xmlns="http://www.w3.org/2000/svg"><path d="m1.76.29 10.879 10.452.06.054a.97.97 0 0 1 .301.642v.124a.97.97 0 0 1-.3.642l-.054.044L1.761 22.71a1.061 1.061 0 0 1-1.459 0 .964.964 0 0 1 0-1.402l10.15-9.746-10.15-9.87a.964.964 0 0 1 0-1.402 1.061 1.061 0 0 1 1.459 0Z" fill="#fff"/></svg></button>
                </div>`
        }
        else {
            if (instaPostData.media_type?.toLowerCase() === 'video') {
                carouselTemplate += `<video width="630" class="popup-media-image" controls src="${instaPostData.media_url || ''}" alt="${instaPostData.caption || ''}"></video>`;
            }
            else {
                carouselTemplate += `<img width="630" class="popup-media-image" src="${instaPostData.media_url || ''}" alt="${instaPostData.caption || ''}" />`;
            }
        }


        let popupHtml = '';
        popupHtml += `
        <div class="popup-container">
                <div class="popup-md-9 white">
                    <div class="embedpress-popup-block embedpress-popup-img" id="post-${instaPostData.id}">
                        ${carouselTemplate}
                    </div>
                </div>
                <div class="popup-md-3 red">
                    <div class="embedpress-popup-block embedpress-popup-info">
                        <div class="embedpress-popup-header">
                            <div class="embedpress-popup-header-img"> <a target="_blank" href="https://www.instagram.com/${instaPostData.username}/"
                                    target="_blank" class="embedpress-href"> <img decoding="async" loading="lazy"
                                        class="embedpress-popup-round"
                                        src="http://2.gravatar.com/avatar/b642b4217b34b1e8d3bd915fc65c4452?s=150&d=mm&r=g"
                                        width="30" height="30"> <span class="embedpress-popup-username">${instaPostData.username}</span>
                                </a>
                            </div>
                            <div class="insta-followbtn">
                                <a target="_new" href="https://www.instagram.com/${instaPostData.username}/" type="button" class="btn btn-primary">Follow</a>
                            </div>
                        </div>
                        <div class="embedpress-popup-text">${captionText}</div>
                        <div class="embedpress-popup-stats">
                            <div class="embedpress-inline"><a target="_blank" href="${instaPostData.permalink}">${likeIcon} ${instaPostData.like_count || 0}</a></div> <div
                                class="embedpress-inline"><a target="_blank" href="${instaPostData.permalink}">${commentsIcon} ${instaPostData.comments_count || 0}</a></div><div class="embedpress-inline">
                                <p class="embedpress-popup-share-buttons hidden"> <a
                                        href="https://www.facebook.com/sharer/sharer.php?u=${instaPostData.permalink}"><span
                                            class="fa fa-facebook-square shr-btn shr-btn-fcbk"></span></a> <a
                                        href="https://twitter.com/home?status=${instaPostData.permalink}"
                                        target="_blank"><span class="fa fa-twitter-square shr-btn"></span></a> <a
                                        href="https://plus.google.com/share?url=${instaPostData.permalink}"
                                        target="_blank"><span class="fa fa-google-plus-square shr-btn"></span></a> <a
                                        href="https://www.linkedin.com/shareArticle?mini=true&amp;url=${instaPostData.permalink}"
                                        target="_blank"><span class="fa fa-linkedin-square shr-btn"></span></a> <a
                                        href="https://pinterest.com/pin/create/button/?url=${instaPostData.permalink}"
                                        target="_blank"><span class="fa fa-pinterest-square shr-btn"></span></a></p>
                                <div class="embedpress-href embedpress-popup-share">${shareIcon}</div>
                            </div><div class="embedpress-inline"><a
                                    href="${instaPostData.permalink}" target="_blank"
                                    class="embedpress-href">${instaIcon}</a></div>
                        </div>
                        
                    </div>
                </div>
            </div>
        `;

        // INIT CAROUSEL


        return popupHtml;
    }

    // Add a click event listener to the insta-gallery container
    instaGlobals.instaPopup = (container) => {
        container?.addEventListener('click', function (event) {
            // Check if the clicked element has the class insta-gallery-item
            const instaItem = event.target.closest('.insta-gallery-item');

            if (instaItem) {

                const postData = instaItem.dataset.postdata;

                const postid = instaItem.getAttribute('data-insta-postid');
                const postIndex = instaItem.getAttribute('data-postindex');
                const tkey = instaItem.parentElement.parentElement.getAttribute('data-tkey');

                const closestPopup = event.target.closest('.ose-instagram-feed').querySelector('.insta-popup');
                closestPopup.style.display = 'block';

                event.target.closest('.ose-instagram-feed').querySelector('.popup-is-initialized').innerHTML = getPopupTemplate(postData);

                if (!document.querySelector(`#post-${postid}`).classList.contains('carousel-is-initialized')) {
                    const carousel = new CgCarousel(`#post-${postid}`, { slidesPerView: 1, loop: true }, {});

                    // const plyer = new Plyr(`#post-${postid} video`);
                    // console.log(plyer);

                    const next = document.querySelector(`#post-${postid} .js-carousel__next-1`);
                    next?.addEventListener('click', () => carousel.next());

                    const prev = document.querySelector(`#post-${postid} .js-carousel__prev-1`);
                    prev?.addEventListener('click', () => carousel.prev());

                    document.querySelector(`#post-${postid}`).classList.add('carousel-is-initialized');
                }

            }
        });
    }


    const instaContainers = document.querySelectorAll('.embedpress-gutenberg-wrapper .insta-gallery');
    if (instaContainers.length > 0) {
        instaContainers.forEach((container) => {
            instaGlobals.instaPopup(container);
        });
    }

    $('.popup-close').click(function (e) {
        // Hide the popup by setting display to none
        $('.insta-popup').hide();
        $('.popup-container').remove();
    });


    const instafeeds = document.querySelectorAll('.ose-instagram-feed');

    instaGlobals.initializeTabs = (containerEl) => {

        // Initial tab selection
        showItems('ALL');

        containerEl.addEventListener('click', function (event) {
            const clickedElement = event.target;
            if (!clickedElement) {
                return; // No element clicked, ignore the event
            }

            // Handle tab click
            if (clickedElement.matches('.tabs li')) {
                if (clickedElement.classList.contains('active')) {
                    return;
                } else {
                    const mediaType = clickedElement.getAttribute('data-media-type');
                    showItems(mediaType);

                    const tabs = containerEl.querySelectorAll('.tabs li');
                    tabs.forEach(t => t.classList.remove('active'));
                    clickedElement.classList.add('active');
                }
            }

        });

        function showItems(mediaType) {
            const items = containerEl.getElementsByClassName('insta-gallery-item');
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (mediaType === 'ALL' || item.getAttribute('data-media-type') === mediaType) {
                    console.log(item.getAttribute('data-media-type'));
                    console.log(mediaType);
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            }
        }
    }

    instaGlobals.instaLoadMore = () => {
        $('.insta-load-more-button').on('click', function (e) {
            const loadmoreBtn = $(this).closest('.load-more-button-container');
            const tkey = loadmoreBtn.data('loadmorekey');
            const connectedAccount = $(`[data-tkey="${tkey}"]`).data('connected-acc-type');
            const feedType = $(`[data-tkey="${tkey}"]`).data('feed-type');
            const hashtagId = $(`[data-tkey="${tkey}"]`).data('hashtag-id');
            const userId = $(`[data-tkey="${tkey}"]`).data('uid');
            let loadedPosts = loadmoreBtn.data('loaded-posts') || 0;
            let postsPerPage = loadmoreBtn.data('posts-per-page') || 0;

            const spinicon = `<svg class="insta-loadmore-spinicon" width="18" height="18" fill="${'#fff'}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><style>.spinner_GuJz{transform-origin:center;animation:spinner_STY6 1.5s linear infinite}@keyframes spinner_STY6{100%{transform:rotate(360deg)}}</style><g class="spinner_GuJz"><circle cx="3" cy="12" r="2"/><circle cx="21" cy="12" r="2"/><circle cx="12" cy="21" r="2"/><circle cx="12" cy="3" r="2"/><circle cx="5.64" cy="5.64" r="2"/><circle cx="18.36" cy="18.36" r="2"/><circle cx="5.64" cy="18.36" r="2"/><circle cx="18.36" cy="5.64" r="2"/></g></svg>`;

            $(this).append(spinicon);

            var data = {
                'action': 'loadmore_data_handler',
                'insta_transient_key': tkey,
                'loaded_posts': loadedPosts,
                'user_id': userId,
                'posts_per_page': postsPerPage,
                'feed_type': feedType,
                'connected_account_type': connectedAccount
            };

            if (feedType === 'hashtag_type') {
                data.hashtag_id = hashtagId;
            }

            jQuery.post(eplocalize.ajaxurl, data, function (response) {
                if (response.total_feed_posts >= response.next_post_index) {
                    var $responseHtml = $(response.html);//
                    $(`[data-tkey="${tkey}"] .insta-gallery`).append($responseHtml);
                    $responseHtml.animate({ opacity: 1 }, 1000);
                    $('.insta-loadmore-spinicon').remove();
                    loadedPosts = response.next_post_index;
                    loadmoreBtn.data('loaded-posts', loadedPosts);

                    // After loading more items, reinitialize the tabs for the specific container
                    const containerEl = loadmoreBtn.closest('.ose-instagram-feed')[0];
                    console.log(containerEl);
                    instaGlobals.initializeTabs(containerEl);

                    if (response.total_feed_posts == response.next_post_index) {
                        loadmoreBtn.hide();
                    }
                } else {
                    loadmoreBtn.hide();
                }
            });
        });

    }

    if (instafeeds.length > 0) {
        instafeeds.forEach(function (feed) {
            instaGlobals.initializeTabs(feed);
        });
    }

    instaGlobals.instaLoadMore();


})(jQuery);


document.addEventListener('DOMContentLoaded', function () {

    instaGlobals.initCarousel = (carouselSelector, options, carouselId) => {

        const carouselOptions = {
            slidesPerView: options.slideshow,
            spacing: options.spacing,
            loop: options.loop,
            autoplay: options.autoplay,
            transitionSpeed: options.transitionspeed,
            autoplaySpeed: options.autoplayspeed,
            arrows: options.arrows,
            breakpoints: {
                768: {
                    slidesPerView: parseInt(options.slideshow) - 1
                },
                1024: {
                    slidesPerView: parseInt(options.slideshow)
                }
            }
        };

        // INIT CAROUSEL
        const carousel = new CgCarousel(carouselSelector, carouselOptions, {});

        // Navigation
        const next = document.querySelector(`[data-carouselid="${carouselId}"] #js-carousel__next-1`);
        next.addEventListener('click', () => carousel.next());

        const prev = document.querySelector(`[data-carouselid="${carouselId}"] #js-carousel__prev-1`);
        prev.addEventListener('click', () => carousel.prev());
    }

    const instaWrappers = document.querySelectorAll('.ep-embed-content-wraper');

    if (instaWrappers.length > 0) {
        instaWrappers.forEach((wrapper) => {
            const carouselId = wrapper.getAttribute('data-carouselid');

            if (!carouselId) return;

            let options = wrapper.getAttribute(`data-carousel-options`);

            options = JSON.parse(options);
            const carouselSelector = `[data-carouselid="${carouselId}"] .embedpress-insta-container`;

            if (options.arrows) {
                document.querySelector(`[data-carouselid="${carouselId}"] .cg-carousel__btns`).classList.remove('hidden');
            }

            instaGlobals.initCarousel(carouselSelector, options, carouselId);

        });
    }



});



jQuery(window).on("elementor/frontend/init", function () {

    var filterableGalleryHandler = function ($scope, $) {

        const instaWrappers = document.querySelectorAll('.ep-embed-content-wraper');

        if (instaWrappers.length > 0) {
            instaWrappers.forEach((wrapper) => {
                const carouselId = wrapper.getAttribute('data-carouselid');

                if (!carouselId) return;

                let options = wrapper.getAttribute(`data-carousel-options`);

                options = JSON.parse(options);
                const carouselSelector = `[data-carouselid="${carouselId}"] .embedpress-insta-container`;

                if (options.arrows) {
                    document.querySelector(`[data-carouselid="${carouselId}"] .cg-carousel__btns`).classList.remove('hidden');
                }

                instaGlobals.initCarousel(carouselSelector, options, carouselId);

            });
        }

        const instaFeed = document.querySelector(`${selectorEl} .ose-instagram-feed`);
        const instaGallery = document.querySelector(`${selectorEl} .insta-gallery`);
        if (instaFeed) {
            instaGlobals.initializeTabs(instaFeed);
        }
        if (instaFeed) {
            instaGlobals.instaPopup(instaFeed);

        }

    };
    elementorFrontend.hooks.addAction("frontend/element_ready/embedpres_elementor.default", filterableGalleryHandler);
});



