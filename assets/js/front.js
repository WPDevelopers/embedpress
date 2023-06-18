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


})(jQuery);


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
    };
    elementorFrontend.hooks.addAction("frontend/element_ready/embedpres_elementor.default", filterableGalleryHandler);
    elementorFrontend.hooks.addAction("frontend/element_ready/embedpress_pdf.default", filterableGalleryHandler);
    elementorFrontend.hooks.addAction("frontend/element_ready/embedpres_document.default", filterableGalleryHandler);
});


// document.addEventListener('DOMContentLoaded', function () {
//     testHellowWorld();
// });

// testHellowWorld();
