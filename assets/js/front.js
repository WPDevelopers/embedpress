/**
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2023 EmbedPress. All rights reserved.
 * @license     GPLv2 or later
 * @since       1.7.0
 */



let epGlobals = {};

(function ($) {
    'use strict';
    // function equivalent to jquery ready()
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    ready(function () {
        let option = {
            forceObject: true,
        };
        let selector = document.querySelectorAll('.embedpress-embed-document-pdf');
        if (selector.length) {
            selector.forEach((function (value, index, thisArg) {
                let id = value.dataset['emid'];
                let src = value.dataset['emsrc'];
                PDFObject.embed(src, "." + id, option);
            }));
        }
        if (typeof epGlobals.youtubeChannelGallery === 'function') {
            epGlobals.youtubeChannelGallery();
        }
    });

    /**
     *
     * Make embeds responsive so they don't overflow their container.
     */

    /**
     * Add max-width & max-height to <iframe> elements, depending on their width & height props.
     *
     *
     * @return {void}
     */
    function embedPressResponsiveEmbeds() {
        var proportion, parentWidth;

        // Loop iframe elements.
        document.querySelectorAll('iframe').forEach(function (iframe) {
            // Only continue if the iframe has a width & height defined.
            if (iframe.width && iframe.height) {
                // Calculate the proportion/ratio based on the width & height.
                proportion = parseFloat(iframe.width) / parseFloat(iframe.height);
                // Get the parent element's width.
                parentWidth = parseFloat(window.getComputedStyle(iframe.parentElement, null).width.replace('px', ''));
                // Set the max-width & height.
                iframe.style.maxWidth = '100%';
                iframe.style.maxHeight = Math.round(parentWidth / proportion).toString() + 'px';
            }
        });
    }

    // Run on initial load.
    embedPressResponsiveEmbeds();

    // Run on resize.
    window.onresize = embedPressResponsiveEmbeds;


    function hasClass(ele, cls) {
        return !!ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
    }

    function addClass(ele, cls) {
        if (!hasClass(ele, cls)) ele.className += " " + cls;
    }

    function removeClass(ele, cls) {
        if (hasClass(ele, cls)) {
            var reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
            ele.className = ele.className.replace(reg, " ");
        }
    }
    if (!Element.prototype.matches) {
        Element.prototype.matches =
            Element.prototype.matchesSelector ||
            Element.prototype.webkitMatchesSelector ||
            Element.prototype.mozMatchesSelector ||
            Element.prototype.msMatchesSelector ||
            Element.prototype.oMatchesSelector ||
            function (s) {
                var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                    i = matches.length;
                while (--i >= 0 && matches.item(i) !== this) { }
                return i > -1;
            };
    }
    var delegate = function (el, evt, sel, handler) {
        el.addEventListener(evt, function (event) {
            var t = event.target;
            while (t && t !== this) {
                if (t.matches(sel)) {
                    handler.call(t, event);
                }
                t = t.parentNode;
            }
        });
    };

    function sendRequest(url, postData, callback) {
        var req = createXMLHTTPObject();
        if (!req) return;
        var method = postData ? "POST" : "GET";
        req.open(method, url, true);
        if (postData) {
            req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        }
        req.onreadystatechange = function () {
            if (req.readyState != 4) return;
            if (req.status != 200 && req.status != 304) {
                return;
            }
            callback(req);
        };
        if (req.readyState == 4) return;
        req.send(postData);
    }

    var XMLHttpFactories = [
        function () {
            return new XMLHttpRequest();
        },
        function () {
            return new ActiveXObject("Msxml3.XMLHTTP");
        },
        function () {
            return new ActiveXObject("Msxml2.XMLHTTP.6.0");
        },
        function () {
            return new ActiveXObject("Msxml2.XMLHTTP.3.0");
        },
        function () {
            return new ActiveXObject("Msxml2.XMLHTTP");
        },
        function () {
            return new ActiveXObject("Microsoft.XMLHTTP");
        },
    ];

    function createXMLHTTPObject() {
        var xmlhttp = false;
        for (var i = 0; i < XMLHttpFactories.length; i++) {
            try {
                xmlhttp = XMLHttpFactories[i]();
            } catch (e) {
                continue;
            }
            break;
        }
        return xmlhttp;
    }

    epGlobals.youtubeChannelGallery = function () {
        var playerWraps = document.getElementsByClassName("ep-player-wrap");
        if (playerWraps && playerWraps.length) {
            for (var i = 0, im = playerWraps.length; im > i; i++) {
                youtubeChannelEvents(playerWraps[i])
            }
        }
    }

    function youtubeChannelEvents(playerWrap) {

        delegate(playerWrap, "click", ".item", function (event) {
            var embed = "https://www.youtube.com/embed/";
            var vid = this.getAttribute("data-vid");
            var iframe = playerWrap.getElementsByTagName("iframe");
            if (vid) {
                if (iframe) {
                    var vidSrc = iframe[0].src.replace(/(.*\/embed\/)([^\?&"'>]+)(.+)?/, `\$1${vid}\$3`);
                    if (vidSrc.indexOf('autoplay') > 0) {
                        vidSrc = vidSrc.replace('autoplay=0', 'autoplay=1');
                    }
                    else {
                        vidSrc += '&autoplay=1';
                    }
                    iframe[0].src = vidSrc;
                    playerWrap.scrollIntoView();
                }
            }
        });

        var currentPage = 1;

        let nearestEpContentId = playerWrap.querySelector('.ep-youtube__content__block').getAttribute('data-unique-id');

        delegate(playerWrap, "click", ".ep-next, .ep-prev", function (event) {
            const totalPages = event.target.closest('.ose-youtube').getAttribute('data-total-pages');
            const closestClass = event.target.closest('.ose-youtube').classList;

            const activePage = document.querySelector(`.${closestClass[1]} .embedpress-page-active`);
            if (activePage) {
                document.querySelector(`.${closestClass[1]} .embedpress-page-active`).classList.remove('embedpress-page-active');
            }



            var isNext = this.classList.contains("ep-next");

            if (isNext) {
                currentPage++;
            } else {
                currentPage--;
            }

            var data = {
                action: "youtube_rest_api",
                playlistid: this.getAttribute("data-playlistid"),
                pagetoken: this.getAttribute("data-pagetoken"),
                pagesize: this.getAttribute("data-pagesize"),
                currentpage: currentPage
            };

            var formBody = [];
            for (var property in data) {
                var encodedKey = encodeURIComponent(property);
                var encodedValue = encodeURIComponent(data[property]);
                formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");

            var galleryWrapper = playerWrap.getElementsByClassName(
                "ep-youtube__content__block"
            );

            playerWrap.setAttribute('data-current-page', currentPage);


            let x = 1;

            sendRequest("/wp-admin/admin-ajax.php", formBody, function (request) {
                if (galleryWrapper && galleryWrapper[0] && request.responseText) {
                    var response = JSON.parse(request.responseText);
                    galleryWrapper[0].outerHTML = response.html;

                    var currentPageNode =
                        galleryWrapper[0].getElementsByClassName("current-page");
                    if (currentPageNode && currentPageNode[0]) {
                        currentPageNode[0].textContent = currentPage;

                    }
                }
            });

            const intervalID = setInterval(() => {
                x++

                if (playerWrap.querySelector('.ep-youtube__content__block')) {
                    const newNearestEpContentId = playerWrap
                        .querySelector('.ep-youtube__content__block')
                        .getAttribute('data-unique-id');

                    if (newNearestEpContentId !== nearestEpContentId && playerWrap.querySelector(`[data-page="${currentPage}"]`)) {
                        playerWrap.querySelector(`[data-page="${currentPage}"]`).classList.add('embedpress-page-active');
                        nearestEpContentId = newNearestEpContentId;
                        clearInterval(intervalID);
                    }
                }

                if (x > 100) {
                    clearInterval(intervalID);
                }
            }, 100);

        });
    }

    //Load more for OpenaSea collection
    const epLoadMore = () => {

        $('.embedpress-gutenberg-wrapper .ep-nft-gallery-wrapper').each(function () {
            let selctorEl = `[data-nftid='${$(this).data('nftid')}']`;

            let loadmorelabel = $(selctorEl).data('loadmorelabel');
            let iconcolor = $(selctorEl + " .nft-loadmore").data('iconcolor');

            let spinicon = `<svg width="18" height="18" fill="${iconcolor || '#fff'}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><style>.spinner_GuJz{transform-origin:center;animation:spinner_STY6 1.5s linear infinite}@keyframes spinner_STY6{100%{transform:rotate(360deg)}}</style><g class="spinner_GuJz"><circle cx="3" cy="12" r="2"/><circle cx="21" cy="12" r="2"/><circle cx="12" cy="21" r="2"/><circle cx="12" cy="3" r="2"/><circle cx="5.64" cy="5.64" r="2"/><circle cx="18.36" cy="18.36" r="2"/><circle cx="5.64" cy="18.36" r="2"/><circle cx="18.36" cy="5.64" r="2"/></g></svg>`;

            $(selctorEl + ` .ep_nft_item`).slice(0, $(selctorEl).data('itemparpage')).show();
            $('.embedpress-gutenberg-wrapper .ep-nft-gallery-wrapper .ep-loadmore-wrapper button').css('display', 'flex');

            $(selctorEl + " .nft-loadmore").click(function (e) {
                //change the text of the button
                $(this).html(loadmorelabel + spinicon);
                //disable the button
                $(this).prop("disabled", true);
                //wait for 1 seconds
                setTimeout(function () {
                    //change the text back
                    $(selctorEl + " .nft-loadmore").text(loadmorelabel);
                    //enable the button
                    $(selctorEl + " .nft-loadmore").prop("disabled", false);
                    $(selctorEl + " .ep_nft_item:hidden").slice(0, $(selctorEl).data('itemparpage')).fadeIn("slow");
                    if ($(selctorEl + " .ep_nft_item:hidden").length == 0) {
                        $(selctorEl + " .nft-loadmore").fadeOut("slow");
                    }
                }, 500);
            });
        });
    };

    if ($('.embedpress-gutenberg-wrapper .ep-nft-gallery-wrapper').length > 0) {
        epLoadMore();
    }

    // Content protection system function 
    const unlockSubmitHander = (perentSel, that) => {
        var ep_client_id = jQuery(that).closest('form').find('input[name="ep_client_id"]').val();
        var password = jQuery(`input[name="pass_${ep_client_id}"]`).val();
        var epbase = jQuery(`input[name="ep_base_${ep_client_id}"]`).val();
        var hash_key = jQuery(`input[name="hash_key_${ep_client_id}"]`).val();
        const buttonText = jQuery(that).closest('.password-form-container').find('input[type="submit"]').val();
        const unlokingText = jQuery(that).data('unlocking-text');


        var data = {
            'action': 'lock_content_form_handler',
            'client_id': ep_client_id,
            'password': password,
            'hash_key': hash_key,
            'epbase': epbase
        };

        jQuery('#' + perentSel + '-' + ep_client_id + ' .password-form input[type="submit"]').val(unlokingText);

        jQuery.post(eplocalize.ajaxurl, data, function (response) {
            if (response.success) {
                if (!response.embedHtml) {

                    jQuery('#' + perentSel + '-' + ep_client_id + ' .password-form input[type="submit"]').val(buttonText);
                    jQuery('#' + perentSel + '-' + ep_client_id + ' .password-form input[type="password"]').val('');
                    jQuery(that).closest('.password-form-container').find('.error-message').removeClass('hidden');
                }
                else {
                    jQuery('#' + perentSel + '-' + ep_client_id + ' .ep-embed-content-wraper').html(response.embedHtml);

                    if (jQuery('#' + perentSel + '-' + ep_client_id + ' .ose-youtube').length > 0) {
                        epGlobals.youtubeChannelGallery();
                    }

                    if ($('.embedpress-gutenberg-wrapper .ep-nft-gallery-wrapper').length > 0) {
                        epLoadMore();
                    }

                    // Custom player initialization when content protection enabled
                    document.querySelector('#' + perentSel + '-' + ep_client_id + ' .ep-embed-content-wraper').classList.remove('plyr-initialized');

                    initPlayer(document.querySelector('#' + perentSel + '-' + ep_client_id + ' .ep-embed-content-wraper'));

                }
            } else {
                jQuery('#password-error_' + ep_client_id).html(response.form);
                jQuery('#password-error_' + ep_client_id).show();
            }
        }, 'json');
    }

    // unlockSubmitHander called for gutentberg
    jQuery('.ep-gutenberg-content .password-form').submit(function (e) {
        e.preventDefault(); // Prevent the default form submission
        unlockSubmitHander('ep-gutenberg-content', this);
    });

    window.addEventListener('load', function (e) {
        const urlParams = new URLSearchParams(window.location.search);
        const hash = urlParams.get('hash');

        // find the element with the matching id
        const element = document.getElementById(hash);

        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }

    });

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

        console.log(instaPostData.children || []);
        let carouselTemplate = '';
        if (instaPostData.media_type === 'CAROUSEL_ALBUM') {
            carouselTemplate += `<div class="popup-carousel"><div class="cg-carousel__track js-carousel__track">`;

            instaPostData.children.data?.map((item) => {
                if (item.media_type.toLowerCase() === 'video') {
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
            if (instaPostData.media_type.toLowerCase() === 'video') {
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
                                        src="https://awplife.com/demo/instagram-feed-gallery-premium/wp-content/plugins/instagram-feed-gallery-premium//img/instagram-gallery-premium.png"
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
    epGlobals.instaPopup = (container) => {
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
            epGlobals.instaPopup(container);
        });
    }

    $('.popup-close').click(function (e) {
        // Hide the popup by setting display to none
        $('.insta-popup').hide();
        $('.popup-container').remove();
    });


    const instafeeds = document.querySelectorAll('.ose-instagram-feed');

    epGlobals.initializeTabs = (containerEl) => {

        const tabs = containerEl.querySelectorAll('.tabs li');
        const items = containerEl.querySelectorAll('.insta-gallery-item');

        // Initial tab selection
        showItems('ALL');

        tabs.forEach(tab => {
            tab.addEventListener('click', function () {
                if (tab.classList.contains('active')) {
                    return;
                } else {
                    const mediaType = tab.getAttribute('data-media-type');
                    showItems(mediaType);
                    tabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                }
            });
        });

        function showItems(mediaType) {
            items.forEach(item => {
                if (mediaType === 'ALL' || item.getAttribute('data-media-type') === mediaType) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        }
    }

    if (instafeeds.length > 0) {
        instafeeds.forEach(function (feed) {
            epGlobals.initializeTabs(feed);
        });
    }


})(jQuery);


document.addEventListener('DOMContentLoaded', function () {

    epGlobals.initCarousel = (carouselSelector, options, carouselId) => {

        console.log(options);
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

            console.log(options);

            if (options.arrows) {
                document.querySelector(`[data-carouselid="${carouselId}"] .cg-carousel__btns`).classList.remove('hidden');
            }

            epGlobals.initCarousel(carouselSelector, options, carouselId);

        });
    }



});



jQuery(window).on("elementor/frontend/init", function () {

    var filterableGalleryHandler = function ($scope, $) {

        // Get the Elementor unique selector for this widget
        let classes = $scope[0].className;
        let selectorEl = '.' + classes.split(' ').join('.');

        console.log(selectorEl);

        const epElLoadMore = () => {

            const spinicon = '<svg width="18" height="18" fill="#fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><style>.spinner_GuJz{transform-origin:center;animation:spinner_STY6 1.5s linear infinite}@keyframes spinner_STY6{100%{transform:rotate(360deg)}}</style><g class="spinner_GuJz"><circle cx="3" cy="12" r="2"/><circle cx="21" cy="12" r="2"/><circle cx="12" cy="21" r="2"/><circle cx="12" cy="3" r="2"/><circle cx="5.64" cy="5.64" r="2"/><circle cx="18.36" cy="18.36" r="2"/><circle cx="5.64" cy="18.36" r="2"/><circle cx="18.36" cy="5.64" r="2"/></g></svg>';

            $('.elementor-widget-container .ep-nft-gallery-wrapper').each(function () {
                let selctorEl = `.elementor-widget-container [data-nftid='${$(this).data('nftid')}']`;
                let loadmorelabel = $(selctorEl).data('loadmorelabel');
                $(selctorEl + ` .ep_nft_item`).slice(0, $(selctorEl).data('itemparpage')).show();
                $('.elementor-widget-container .ep-nft-gallery-wrapper .ep-loadmore-wrapper button').css('display', 'flex');

                $(selctorEl + " .nft-loadmore").click(function (e) {
                    //change the text of the button
                    $(this).html(loadmorelabel + spinicon);

                    //disable the button
                    $(this).prop("disabled", true);
                    //wait for 1 seconds
                    setTimeout(function () {
                        //change the text back
                        $(selctorEl + " .nft-loadmore").text(loadmorelabel);
                        //enable the button
                        $(selctorEl + " .nft-loadmore").prop("disabled", false);
                        $(selctorEl + " .ep_nft_item:hidden").slice(0, $(selctorEl).data('itemparpage')).fadeIn("slow");
                        if ($(selctorEl + " .ep_nft_item:hidden").length == 0) {
                            $(selctorEl + " .nft-loadmore").fadeOut("slow");
                        }
                    }, 500);
                });
            });
        };

        if ($('.elementor-widget-container .ep-nft-gallery-wrapper').length > 0) {
            epElLoadMore();
        }

        // Content protection system function 
        const unlockElSubmitHander = (perentSel, that) => {
            var ep_client_id = jQuery(that).closest('form').find('input[name="ep_client_id"]').val();
            var password = jQuery(`input[name="pass_${ep_client_id}"]`).val();
            var epbase = jQuery(`input[name="ep_base_${ep_client_id}"]`).val();
            var hash_key = jQuery(`input[name="hash_key_${ep_client_id}"]`).val();
            const buttonText = jQuery(that).closest('.password-form-container').find('input[type="submit"]').val();
            const unlokingText = jQuery(that).data('unlocking-text');

            var data = {
                'action': 'lock_content_form_handler',
                'client_id': ep_client_id,
                'password': password,
                'hash_key': hash_key,
                'epbase': epbase
            };

            jQuery('#' + perentSel + '-' + ep_client_id + ' .password-form input[type="submit"]').val(unlokingText);

            jQuery.post(eplocalize.ajaxurl, data, function (response) {
                if (response.success) {
                    if (!response.embedHtml) {
                        jQuery('#' + perentSel + '-' + ep_client_id + ' .password-form input[type="submit"]').val(buttonText);
                        jQuery('#' + perentSel + '-' + ep_client_id + ' .password-form input[type="password"]').val('');
                        jQuery(that).closest('.password-form-container').find('.error-message').removeClass('hidden');
                    }
                    else {
                        if ($('.ep-content-locked').has('#' + perentSel + '-' + ep_client_id).length) {
                            $('.ep-content-locked').removeClass('ep-content-locked');
                        }

                        jQuery('#' + perentSel + '-' + ep_client_id + ' .ep-embed-content-wraper').html(response.embedHtml);

                        $('#' + perentSel + '-' + ep_client_id).removeClass('ep-content-protection-enabled');

                        if (jQuery('#' + perentSel + '-' + ep_client_id + ' .ose-youtube').length > 0) {
                            epGlobals.youtubeChannelGallery();
                        }

                        if ($('.elementor-widget-container .ep-nft-gallery-wrapper').length > 0) {
                            epElLoadMore();
                        }
                    }
                } else {
                    jQuery('#password-error_' + ep_client_id).html(response.form);
                    jQuery('#password-error_' + ep_client_id).show();
                }
            }, 'json');
        }

        // unlockElSubmitHander called for Elementor
        jQuery('.ep-elementor-content .password-form').submit(function (e) {
            e.preventDefault(); // Prevent the default form submission
            unlockElSubmitHander('ep-elementor-content', this);
        });


        const instaWrappers = document.querySelectorAll('.ep-embed-content-wraper');

        if (instaWrappers.length > 0) {
            instaWrappers.forEach((wrapper) => {
                const carouselId = wrapper.getAttribute('data-carouselid');

                if (!carouselId) return;

                let options = wrapper.getAttribute(`data-carousel-options`);

                options = JSON.parse(options);
                const carouselSelector = `[data-carouselid="${carouselId}"] .embedpress-insta-container`;

                console.log(options);

                if (options.arrows) {
                    document.querySelector(`[data-carouselid="${carouselId}"] .cg-carousel__btns`).classList.remove('hidden');
                }

                epGlobals.initCarousel(carouselSelector, options, carouselId);

            });
        }

        const instaFeed = document.querySelector(`${selectorEl} .ose-instagram-feed`);
        const instaGallery = document.querySelector(`${selectorEl} .insta-gallery`);
        if (instaFeed) {
            epGlobals.initializeTabs(instaFeed);
        }
        if (instaFeed) {
            epGlobals.instaPopup(instaFeed);

        }

    };
    elementorFrontend.hooks.addAction("frontend/element_ready/embedpres_elementor.default", filterableGalleryHandler);
    elementorFrontend.hooks.addAction("frontend/element_ready/embedpress_pdf.default", filterableGalleryHandler);
    elementorFrontend.hooks.addAction("frontend/element_ready/embedpres_document.default", filterableGalleryHandler);
});



