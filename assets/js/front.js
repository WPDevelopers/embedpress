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
                PDFObject?.embed(src, "." + id, option);
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

    epGlobals.handlePosterImageLoad = function () {
        var posterImages = document.querySelectorAll(".plyr__poster");
        posterImages.forEach(function (posterImage) {
            if (posterImage) {
                var videoWrappers = document.querySelectorAll("[data-playerid]");
                videoWrappers.forEach(function (videoWrapper) {
                    var observer = new MutationObserver(function (mutationsList, observer) {
                        var posterImageStyle = window.getComputedStyle(posterImage);
                        if (posterImageStyle.getPropertyValue('background-image') !== 'none') {
                            setTimeout(function () {
                                videoWrapper.style.opacity = "1";
                            }, 200);
                            observer.disconnect();
                        }
                    });

                    observer.observe(posterImage, { attributes: true, attributeFilter: ['style'] });
                });
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

        let epContentBlock = playerWrap.querySelector('.ep-youtube__content__block');
        let parentElement = epContentBlock.parentElement;

        // Get the value of data-channel-url attribute from a sibling
        let channelUrl = parentElement.querySelector('[data-channel-url]').getAttribute('data-channel-url');


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
                channelUrl: channelUrl,
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
        var post_id = jQuery(`input[name="post_id"]`).val();
        const buttonText = jQuery(that).closest('.password-form-container').find('input[type="submit"]').val();
        const unlokingText = jQuery(that).data('unlocking-text');


        var data = {
            'action': 'lock_content_form_handler',
            'client_id': ep_client_id,
            'password': password,
            'post_id': post_id,
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

                    if (eplocalize.is_pro_plugin_active) {
                        const adIdEl = document.querySelector('#' + perentSel + '-' + ep_client_id + ' [data-sponsored-id]');
                        adInitialization(adIdEl, adIdEl?.getAttribute('data-ad-index'));
                    }

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
    const getPopupTemplate = (instPost, hashtag = '', accountType) => {

        let instaPostData = JSON.parse(instPost);


        let likeIcon = '<svg aria-label="Like" class="x1lliihq x1n2onr6" color="#262626" fill="#262626" height="24" viewBox="0 0 24 24" width="24"><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"/></svg>';

        if (instaPostData.like_count > 0) {
            likeIcon = '<svg aria-label="Unlike" class="x1lliihq x1n2onr6" color="#FF3040" fill="#FF3040" height="24" viewBox="0 0 48 48" width="24"><path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"/></svg>';
        }

        const commentsIcon = '<svg aria-label="Comment" class="x1lliihq x1n2onr6" color="#000" height="24" viewBox="0 0 24 24" width="24"><path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"/></svg>';

        const shareIcon = '<svg width="20" height="20" viewBox="0 0 0.6 0.6" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg"><path stroke-width="1" d="m.543.282-.2-.2A.025.025 0 0 0 .3.1v.089a.275.275 0 0 0-.25.274V.5a.025.025 0 0 0 .045.015.3.3 0 0 1 .197-.101L.3.413V.5a.025.025 0 0 0 .043.018l.2-.2a.025.025 0 0 0 0-.035M.35.44V.388A.025.025 0 0 0 .325.363L.286.365a.35.35 0 0 0-.185.074.225.225 0 0 1 .224-.201A.025.025 0 0 0 .35.213V.16L.49.3Z"/></svg>';

        const instaIcon = '<svg width="18" height="18" viewBox="0 0 0.338 0.338" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M.248.079H.27M.102.012h.135a.09.09 0 0 1 .09.09v.135a.09.09 0 0 1-.09.09H.102a.09.09 0 0 1-.09-.09V.102a.09.09 0 0 1 .09-.09ZM.17.237a.068.068 0 1 1 0-.135.068.068 0 0 1 0 .135Z" stroke="#000" stroke-width=".032"/></svg>';



        const instaUserInfo = instPost.user_info;

        let getDate = new Date(instaPostData.timestamp);
        getDate = getDate.toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

        let getTime = new Date(instaPostData.timestamp);
        getTime = getTime.toLocaleString('en-US', { hour12: false, hour: 'numeric', minute: 'numeric', second: 'numeric' });

        let captionText = instaPostData.caption ? instaPostData.caption : '';
        const tagRegex = /(#\w+)/g;

        const wrapTag = (match) => {
            const tag = match.substring(1); // Remove the '#' character
            const tagUrl = `https://www.instagram.com/explore/tags/${tag}`;
            return `<span class="tag-wrapper"><a target="_blank" href="${tagUrl}">${match}</a></span>`;
        };

        captionText = captionText.replace(tagRegex, wrapTag);

        let carouselTemplate = '';
        if (instaPostData.media_type === 'CAROUSEL_ALBUM') {
            carouselTemplate += `<div class="popup-carousel"><div class="cg-carousel__track js-carousel__track">`;

            instaPostData.children.data?.map((item) => {
                if (item.media_type?.toLowerCase() === 'video') {
                    carouselTemplate += `<video width="630" class="popup-media-image cg-carousel__slide js-carousel__slide" controls src="${item.media_url || ''}" alt="${item.caption || ''}" controlsList="nodownload"></video>`;
                }
                else {
                    carouselTemplate += `<img width="630" class="popup-media-image cg-carousel__slide js-carousel__slide" src="${item.media_url || ''}" alt="${item.caption || ''}" />`;
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

        let srcUrl = `https://www.instagram.com/${instaPostData.username}/`;

        if (hashtag) {
            instaPostData.username = '#' + hashtag;
            srcUrl = `https://www.instagram.com/explore/tags/${hashtag}/`;
        }


        let likeComments = '';

        if (eplocalize.is_pro_plugin_active && accountType === 'business') {
            if (instaPostData.show_likes_count == 'true') {
                likeComments += `
                    <div class="embedpress-inline popup-like-button"><a target="_blank" href="${instaPostData.permalink}">${likeIcon} ${instaPostData.like_count || 0}</a></div> 
                `;
            }
            if (instaPostData.show_comments_count == 'true') {
                likeComments += `
                    <div class="embedpress-inline"><a target="_blank" href="${instaPostData.permalink}">${commentsIcon} ${instaPostData.comments_count || 0}</a></div>
                `;
            }
        }


        let followBtn = '';
        if (instaPostData.popup_follow_button_text == 'false') {
            instaPostData.popup_follow_button_text = '';
        }
        if (instaPostData.popup_follow_button == 'true' || instaPostData.popup_follow_button == 'yes') {
            followBtn = `<div class="insta-followbtn">
                <a target="_new" href="${srcUrl}" type="button" class="btn btn-primary">${instaPostData.popup_follow_button_text}</a>
            </div>`;
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
                            <div class="embedpress-popup-header-img"> <a target="_blank" href="${srcUrl}"
                                    target="_blank" class="embedpress-href">
                                     <img decoding="async" loading="lazy" class="embedpress-popup-round" src="${instaPostData.profile_picture_url}" width="30" height="30"> <span class="embedpress-popup-username">${instaPostData.username}</span>
                                </a>
                            </div>
                            ${followBtn}
                        </div>
                        <div class="embedpress-popup-text">${captionText}</div>
                        <div class="embedpress-popup-stats">
                            ${likeComments}
                                <div class="embedpress-inline">
                                <div class="embedpress-popup-share-buttons"> <a
                                        href="https://www.facebook.com/sharer/sharer.php?u=${instaPostData.permalink}" target="_blank">
                                        <span class="dashicons dashicons-facebook"></span></a> <a
                                        href="https://twitter.com/intent/tweet?url=${instaPostData.permalink}"
                                        target="_blank"><span>
                                        <svg viewBox="0 0 18 18" aria-hidden="true" class="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-lrsllp r-18jsvk2 r-16y2uox r-8kz0gk" width="18" height="18"><path d="M13.683 1.688h2.481l-5.42 6.195 6.377 8.43h-4.993L8.217 11.2l-4.474 5.113H1.26l5.798-6.626L.941 1.688H6.06l3.535 4.673zm-.871 13.14h1.375L5.313 3.095H3.838z"/></svg>
                                        </span></a>                                       
                                        <a href="https://www.linkedin.com/shareArticle?mini=true&amp;url=${instaPostData.permalink}"
                                        target="_blank"><span class="dashicons dashicons-linkedin"></span></a> <a
                                        href="https://pinterest.com/pin/create/button/?url=${instaPostData.permalink}"
                                        target="_blank"><span class="dashicons dashicons-pinterest"></span></a></div>
                                <div class="embedpress-href embedpress-popup-share">${shareIcon}</div>
                            </div><div class="embedpress-inline embedpress-popup-instagram-buttons"><a
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
                const accountType = container?.closest('.instagram-container')?.getAttribute('data-connected-acc-type');

                let hashtag = '';

                if (instaItem.closest('.instagram-container').getAttribute('data-hashtag')) {
                    hashtag = instaItem?.closest('.instagram-container')?.getAttribute('data-hashtag');
                }

                const closestPopup = event.target.closest('.ose-instagram-feed')?.querySelector('.insta-popup');

                if (closestPopup) {
                    closestPopup.style.display = 'block';
                }


                var feedElement = event.target.closest('.ose-instagram-feed');
                if (feedElement) {
                    var popupElement = feedElement.querySelector('.popup-is-initialized');
                    if (popupElement) {
                        popupElement.innerHTML = getPopupTemplate(postData, hashtag, accountType);
                    }
                }

                if (!document.querySelector(`#post-${postid}`)?.classList.contains('carousel-is-initialized')) {
                    const carousel = new CgCarousel(`#post-${postid}`, { slidesPerView: 1, loop: true }, {});

                    const next = document.querySelector(`#post-${postid} .js-carousel__next-1`);
                    next?.addEventListener('click', () => carousel.next());

                    const prev = document.querySelector(`#post-${postid} .js-carousel__prev-1`);
                    prev?.addEventListener('click', () => carousel.prev());

                    document.querySelector(`#post-${postid}`)?.classList.add('carousel-is-initialized');
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

    $(document).on('click', function (e) {
        if (e.target.classList.contains('popup-wrapper')) {
            $('.insta-popup').hide();
            $('.popup-container').remove();
        }
    });


    const instafeeds = document.querySelectorAll('.ose-instagram-feed');

    epGlobals.initializeTabs = (containerEl) => {

        // Initial tab selection
        showItems('ALL');

        containerEl.addEventListener('click', function (event) {
            const clickedElement = event.target;
            if (!clickedElement) {
                return; // No element clicked, ignore the event
            }

            if (containerEl.querySelector('.load-more-button-container') && (clickedElement.getAttribute('data-media-type') === 'VIDEO' || clickedElement.getAttribute('data-media-type') === 'CAROUSEL_ALBUM')) {
                containerEl.querySelector('.load-more-button-container').style.display = 'none';
            }
            else if (containerEl.querySelector('.load-more-button-container') && (clickedElement.getAttribute('data-media-type') === 'ALL')) {
                containerEl.querySelector('.load-more-button-container').style.display = 'flex';
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
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            }
        }
    }

    epGlobals.instaLoadMore = () => {
        // Unbind any previously bound click event to avoid multiple bindings
        $('.insta-load-more-button').off('click').on('click', function (e) {
            const that = $(this);
            const loadmoreBtn = that.closest('.load-more-button-container');
            const loadmoreKey = loadmoreBtn.data('loadmorekey');
            const connectedAccount = that.closest('.instagram-container').data('connected-acc-type');
            const feedType = that.closest('.instagram-container').data('feed-type');
            const hashtagId = that.closest('.instagram-container').data('hashtag-id');
            const userId = that.closest('.instagram-container').data('uid');
            let loadedPosts = loadmoreBtn.data('loaded-posts') || 0;
            let postsPerPage = loadmoreBtn.data('posts-per-page') || 0;
            const params = JSON.stringify(that.closest('.instagram-container').data('params'));


            const instaContainer = that.closest('.instagram-container');

            const spinicon = `<svg class="insta-loadmore-spinicon" width="18" height="18" fill="${'#fff'}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><style>.spinner_GuJz{transform-origin:center;animation:spinner_STY6 1.5s linear infinite}@keyframes spinner_STY6{100%{transform:rotate(360deg)}}</style><g class="spinner_GuJz"><circle cx="3" cy="12" r="2"/><circle cx="21" cy="12" r="2"/><circle cx="12" cy="21" r="2"/><circle cx="12" cy="3" r="2"/><circle cx="5.64" cy="5.64" r="2"/><circle cx="18.36" cy="18.36" r="2"/><circle cx="5.64" cy="18.36" r="2"/><circle cx="18.36" cy="5.64" r="2"/></g></svg>`;

            // Check if no spinicon exists
            if (instaContainer.find('.insta-loadmore-spinicon').length === 0) {
                that.append(spinicon);
            }

            that.attr('disabled', true);

            var data = {
                'action': 'loadmore_data_handler',
                'user_id': userId,
                'loaded_posts': loadedPosts,
                'posts_per_page': postsPerPage,
                'feed_type': feedType,
                'connected_account_type': connectedAccount,
                'loadmore_key': loadmoreKey,
                'params': params,
                '_nonce': eplocalize.nonce
            };

            if (feedType === 'hashtag_type') {
                data.hashtag_id = hashtagId;
            }

            jQuery.post(eplocalize.ajaxurl, data, function (response) {
                if (response.total_feed_posts >= response.next_post_index) {
                    var $responseHtml = $(response.html);

                    instaContainer.find('.insta-gallery').append($responseHtml);
                    that.removeAttr('disabled');

                    instaContainer.find('.insta-loadmore-spinicon').remove();

                    loadedPosts = response.next_post_index;

                    loadmoreBtn.data('loaded-posts', loadedPosts);

                    // After loading more items, reinitialize the tabs for the specific container
                    const containerEl = loadmoreBtn.closest('.ose-instagram-feed')[0];
                    epGlobals.initializeTabs(containerEl);

                    if (response.total_feed_posts === response.next_post_index) {
                        loadmoreBtn.remove();
                    }
                } else {
                    loadmoreBtn.remove();
                }
            });
        });
    }


    if (instafeeds.length > 0) {
        instafeeds.forEach(function (feed) {
            epGlobals.initializeTabs(feed);
        });
    }

    if ($('.embedpress-gutenberg-wrapper .ose-instagram-feed').length > 0) {
        epGlobals.instaLoadMore();
    }

    $(document).on({
        mouseenter: function () {
            $('.embedpress-popup-share-buttons').addClass('show');
        },
        mouseleave: function () {
            var buttons = $('.embedpress-popup-share-buttons');
            setTimeout(function () {
                if (!buttons.is(':hover')) buttons.removeClass('show');
            }, 200);
        }
    }, '.embedpress-href.embedpress-popup-share, .embedpress-popup-share-buttons');

    $(document).on({
        mouseenter: function () {
            $(this).addClass('show');
        },
        mouseleave: function () {
            $(this).removeClass('show');
        }
    }, '.embedpress-popup-share-buttons');





})(jQuery);



document.addEventListener('DOMContentLoaded', function () {

    epGlobals.initCarousel = (carouselSelector, options, carouselId) => {

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
        next?.addEventListener('click', () => carousel.next());

        const prev = document.querySelector(`[data-carouselid="${carouselId}"] #js-carousel__prev-1`);
        prev?.addEventListener('click', () => carousel.prev());
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

            epGlobals.initCarousel(carouselSelector, options, carouselId);

        });
    }

    // Youtube Channel Carousel

    const youtubeCarouselWraper = document.querySelectorAll('[data-youtube-channel-carousel]');

    if (youtubeCarouselWraper.length > 0) {
        youtubeCarouselWraper.forEach((wrapper) => {
            const carouselId = wrapper.getAttribute('data-youtube-channel-carousel');
            if (!carouselId) return;

            // let options = wrapper.getAttribute(`data-carousel-options`);

            // options = JSON.parse(options);

            const carouselSelector = `[data-youtube-channel-carousel="${carouselId}"] .youtube__content__body`;

            // if (options.arrows) {
            //     document.querySelector(`[data-youtube-channel-carousel="${carouselId}"] .cg-carousel__btns`).classList.remove('hidden');
            // }

            const options = {
                slidesPerView: 2,
                autoplay: true,
                loop: true,
                breakpoints: {
                    768: {
                        slidesPerView: 2
                    },
                    1024: {
                        slidesPerView: 4
                    }
                }
            }

            // epGlobals.initCarousel(carouselSelector, options, {});

        });
    }



});

document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.youtube-carousel');

    if(!carousel) {
        return;
    }
    
    const items = document.querySelectorAll('.item');
    const prevButton = document.querySelector('.preview');
    const nextButton = document.querySelector('.next');

    let itemsToShow = getItemsToShow(); // Determine items to show based on screen width

    const totalItems = items.length;
    let currentIndex = 0;

    function updateCarousel() {
        const offset = -currentIndex * (100 / itemsToShow);
        carousel.style.transform = `translateX(${offset}%)`;
    }

    function nextSlide() {
        const remainingItems = totalItems - (currentIndex + itemsToShow);
        if (remainingItems >= itemsToShow) {
            currentIndex += itemsToShow;
        } else if (remainingItems > 0) {
            currentIndex += remainingItems;
        } else {
            currentIndex = 0;
        }
        updateCarousel();
    }

    function prevSlide() {
        if (currentIndex > 0) {
            currentIndex -= itemsToShow;
            if (currentIndex < 0) {
                currentIndex = 0;
            }
        } else {
            currentIndex = totalItems - itemsToShow;
        }
        updateCarousel();
    }

    nextButton?.addEventListener('click', nextSlide);
    prevButton?.addEventListener('click', prevSlide);

    // Optional: Autoplay
    let autoplay = false;
    const autoplayInterval = 3000; // Change the time as needed
    let autoplayId;

    function startAutoplay() {
        autoplayId = setInterval(nextSlide, autoplayInterval);
    }

    function stopAutoplay() {
        clearInterval(autoplayId);
    }

    if (autoplay) {
        startAutoplay();

        // Stop autoplay on mouseover, resume on mouseout
        carousel.addEventListener('mouseover', stopAutoplay);
        carousel.addEventListener('mouseout', startAutoplay);
    }

    // Handle responsive behavior
    window.addEventListener('resize', () => {
        itemsToShow = getItemsToShow();
        updateCarousel();

    });

    function getItemsToShow() {
        const width = window.innerWidth;
        if (width >= 1024) {
            return 3;
        } else if (width >= 768) {
            return 2;
        } else {
            return 1;
        }
    }
});




jQuery(window).on("elementor/frontend/init", function () {

    var filterableGalleryHandler = function ($scope, $) {

        // Get the Elementor unique selector for this widget
        let classes = $scope[0].className;
        let selectorEl = '.' + classes.split(' ').join('.');

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
            var post_id = jQuery(`input[name="post_id"]`).val();
            const buttonText = jQuery(that).closest('.password-form-container').find('input[type="submit"]').val();
            const unlokingText = jQuery(that).data('unlocking-text');

            var data = {
                'action': 'lock_content_form_handler',
                'client_id': ep_client_id,
                'password': password,
                'post_id': post_id,
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
        if (instaGallery) {
            epGlobals.instaPopup(instaGallery);

            $('.popup-close').click(function (e) {
                // Hide the popup by setting display to none
                $('.insta-popup').hide();
                $('.popup-container').remove();
            });

        }

        if ($('.elementor-widget-container .ose-instagram-feed').length > 0) {
            epGlobals.instaLoadMore();
        }

    };

    const adsHandler = function ($scope, $) {
        window.epAdIndex = typeof (window.epAdIndex) === 'undefined' ? 0 : window.epAdIndex + 1;
        let classes = $scope[0].className;
        let classJoint = '.' + classes.split(' ').join('.');
        const selectorEl = document.querySelector(classJoint + ' [data-sponsored-id]');

        if (jQuery('body').hasClass('elementor-editor-active') && eplocalize.is_pro_plugin_active) {
            adInitialization(selectorEl, window.epAdIndex);
        }

    }

    elementorFrontend.hooks.addAction("frontend/element_ready/embedpres_elementor.default", filterableGalleryHandler);
    elementorFrontend.hooks.addAction("frontend/element_ready/embedpress_pdf.default", filterableGalleryHandler);
    elementorFrontend.hooks.addAction("frontend/element_ready/embedpres_document.default", filterableGalleryHandler);
    elementorFrontend.hooks.addAction("frontend/element_ready/embedpres_elementor.default", adsHandler);
    elementorFrontend.hooks.addAction("frontend/element_ready/embedpres_elementor.default", epGlobals.handlePosterImageLoad);
});


function presentationModeForIOS(iframes) {
    iframes?.forEach(function (iframe) {
        iframe.onload = function () {
            var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            var button = iframeDoc?.querySelector('#presentationMode.presentationMode');
            button?.addEventListener('click', function () {
                iframe.classList.toggle('presentationModeEnabledIosDevice');
            });
            iframeDoc?.addEventListener('keydown', function (event) {
                if (event.keyCode === 27) {
                    iframe.classList.remove('presentationModeEnabledIosDevice');
                }
            });
        };
    });
}

function isIOSDevice() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

if (isIOSDevice()) {
    var iframes = document.querySelectorAll('.embedpress-embed-document-pdf');
    presentationModeForIOS(iframes)
}

document.addEventListener("DOMContentLoaded", epGlobals.handlePosterImageLoad);



// document.addEventListener('DOMContentLoaded', function () {
//     const videoPopup = document.getElementById('videoPopup');
//     const videoIframe = document.getElementById('videoIframe');
//     const videoDescription = document.getElementById('videoDescription');
//     const closeBtn = document.querySelector('.close');
//     const nextBtn = document.getElementById('nextVideo');
//     const prevBtn = document.getElementById('prevVideo');

//     let currentIndex = -1;

//     function openVideoPopup(index) {
//         const items = document.querySelectorAll('.layout-grid .item, .layout-list .item, .layout-carousel .item');
//         if (index >= 0 && index < items.length) {
//             currentIndex = index;
//             const videoId = items[currentIndex].getAttribute('data-vid');
//             const description = items[currentIndex].querySelector('.video-description').innerHTML;

//             if (videoId) {
//                 videoIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
//                 videoDescription.innerHTML = description;
//                 videoPopup.style.display = 'block';

//                 // Update navigation buttons visibility
//                 updateNavigationButtons();
//             }
//         }
//     }

//     function closeVideoPopup() {
//         videoPopup.style.display = 'none';
//         videoIframe.src = '';
//         videoDescription.innerHTML = '';
//     }

//     function updateNavigationButtons() {
//         const items = document.querySelectorAll('.layout-grid .item, .layout-list .item, .layout-carousel .item');
//         if (currentIndex <= 0) {
//             prevBtn.style.display = 'none';
//         } else {
//             prevBtn.style.display = 'block';
//         }

//         if (currentIndex >= items.length - 1) {
//             nextBtn.style.display = 'none';
//         } else {
//             nextBtn.style.display = 'block';
//         }
//     }

//     document.addEventListener('click', function (event) {
//         const items = document.querySelectorAll('.layout-grid .item, .layout-list .item, .layout-carousel .item');
//         const item = event.target.closest('.layout-grid .item, .layout-list .item, .layout-carousel .item');
//         if (item) {
//             const index = Array.prototype.indexOf.call(items, item);
//             openVideoPopup(index);
//         }
//     });

//     closeBtn.addEventListener('click', closeVideoPopup);

//     window.addEventListener('click', function (event) {
//         if (event.target === videoPopup) {
//             closeVideoPopup();
//         }
//     });

//     nextBtn.addEventListener('click', function () {
//         const items = document.querySelectorAll('.layout-grid .item, .layout-list .item, .layout-carousel .item');
//         if (currentIndex >= 0 && currentIndex < items.length - 1) {
//             openVideoPopup(currentIndex + 1);
//         }
//     });

//     prevBtn.addEventListener('click', function () {
//         if (currentIndex > 0) {
//             openVideoPopup(currentIndex - 1);
//         }
//     });
// });


jQuery(document).ready(function ($) {

    let currentIndex = -1;

    function createVideoPopup() {
        const videoPopupHtml = `
            <div id="videoPopup" class="video-popup">
                <div class="video-popup-content">
                    <span class="close">&times;</span>
                    <div class="video-popup-inner-content">
                        <iframe id="videoIframe" frameborder="0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
                        <div id="videoDescription"></div>
                    </div>
                    <div class="popup-controls">
                        <span id="prevVideo" class="nav-icon prev-icon">&#10094;</span>
                        <span id="nextVideo" class="nav-icon next-icon">&#10095;</span>
                    </div>
                </div>
            </div>`;
        return $(videoPopupHtml).appendTo('body');
    }

    function openVideoPopup(index) {
        const items = $('.layout-grid .item, .layout-list .item, .layout-carousel .item');
        if (index >= 0 && index < items.length) {
            // Remove any existing video popup before creating a new one
            $('#videoPopup').remove();

            currentIndex = index;
            const videoId = $(items[currentIndex]).data('vid');
            const videoPopup = createVideoPopup();
            const videoIframe = videoPopup.find('#videoIframe');
            const videoDescriptionContainer = videoPopup.find('#videoDescription');
            const closeBtn = videoPopup.find('.close');
            const nextBtn = videoPopup.find('#nextVideo');
            const prevBtn = videoPopup.find('#prevVideo');

            if (videoId) {
                fetchVideoData(videoId, videoIframe, videoDescriptionContainer);
                videoPopup.show();
                updateNavigationButtons(nextBtn, prevBtn, items);

                closeBtn.on('click', () => {
                    closeVideoPopup(videoPopup);
                });

                $(window).on('click', function (event) {
                    if ($(event.target).is(videoPopup)) {
                        closeVideoPopup(videoPopup);
                    }
                });

                nextBtn.on('click', function () {
                    if (currentIndex >= 0 && currentIndex < items.length - 1) {
                        openVideoPopup(currentIndex + 1);
                    }
                });

                prevBtn.on('click', function () {
                    if (currentIndex > 0) {
                        openVideoPopup(currentIndex - 1);
                    }
                });
            }
        }
    }


    function closeVideoPopup(videoPopup) {
        videoPopup.remove();
        currentIndex = -1; // Reset the index
    }

    function updateNavigationButtons(nextBtn, prevBtn, items) {
        prevBtn.toggle(currentIndex > 0);
        nextBtn.toggle(currentIndex < items.length - 1);
    }

    function fetchVideoData(videoId, videoIframe, videoDescriptionContainer) {
        const data = {
            action: 'fetch_video_description',
            vid: videoId
        };

        $.post(eplocalize.ajaxurl, data, function (response) {
            if (response.success) {
                videoIframe.attr('src', `https://www.youtube.com/embed/${videoId}?autoplay=1`);
                videoDescriptionContainer.html(response.data.description);
            } else {
                console.error('Error fetching video data:', response?.data?.error);
            }
        });
    }

    $(document).on('click', '.layout-grid .item, .layout-list .item, .layout-carousel .item', function () {
        const items = $('.layout-grid .item, .layout-list .item, .layout-carousel .item');
        const index = items.index(this);
        openVideoPopup(index);
    });
});



// pause audio/video

jQuery(document).ready(function () {
    const players = jQuery('.enabled-auto-pause audio, .enabled-auto-pause video');

    function pauseAllExcept(currentPlayer) {
        players.each(function () {
            if (this !== currentPlayer[0]) {
                this.pause();
            }
        });
    }

    players.on('play', function () {
        pauseAllExcept(jQuery(this));
    });
});
