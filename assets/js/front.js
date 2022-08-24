/**
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2022 EmbedPress. All rights reserved.
 * @license     GPLv2 or later
 * @since       1.7.0
 */
(function () {
    'use strict';
    // function equivalent to jquery ready()
    function ready(fn) {
        if (document.readyState !== 'loading'){
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    ready(function() {
        let option = {
            forceObject: true,
        };
        let selector = document.querySelectorAll('.embedpress-embed-document-pdf');
        if (selector.length) {
            selector.forEach((function(value, index, thisArg) {
               let id = value.dataset['emid'];
               let src = value.dataset['emsrc'];
                PDFObject.embed(src, "."+id, option);
            }));
        }
        youtubeChannelGallery();
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
        document.querySelectorAll( 'iframe' ).forEach( function( iframe ) {
            // Only continue if the iframe has a width & height defined.
            if ( iframe.width && iframe.height ) {
                // Calculate the proportion/ratio based on the width & height.
                proportion = parseFloat( iframe.width ) / parseFloat( iframe.height );
                // Get the parent element's width.
                parentWidth = parseFloat( window.getComputedStyle( iframe.parentElement, null ).width.replace( 'px', '' ) );
                // Set the max-width & height.
                iframe.style.maxWidth = '100%';
                iframe.style.maxHeight = Math.round( parentWidth / proportion ).toString() + 'px';
            }
        } );
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
            function(s) {
                var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                    i = matches.length;
                while (--i >= 0 && matches.item(i) !== this) {}
                return i > -1;
            };
    }
    var delegate = function(el, evt, sel, handler) {
        el.addEventListener(evt, function(event) {
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
        req.onreadystatechange = function() {
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
        function() {
            return new XMLHttpRequest();
        },
        function() {
            return new ActiveXObject("Msxml3.XMLHTTP");
        },
        function() {
            return new ActiveXObject("Msxml2.XMLHTTP.6.0");
        },
        function() {
            return new ActiveXObject("Msxml2.XMLHTTP.3.0");
        },
        function() {
            return new ActiveXObject("Msxml2.XMLHTTP");
        },
        function() {
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
    function youtubeChannelGallery() {
        var playerWraps = document.getElementsByClassName("ep-player-wrap");
        if (playerWraps && playerWraps.length) {
            for (var i=0, im=playerWraps.length; im>i; i++) {
                youtubeChannelEvents(playerWraps[i])
            }
        }
    }
    function youtubeChannelEvents(playerWrap){
        delegate(playerWrap, "click", ".item", function(event) {
            var embed = "https://www.youtube.com/embed/";
            var vid = this.getAttribute("data-vid");
            var iframe = playerWrap.getElementsByTagName("iframe");
            if(vid) {
                if(iframe){
                    var vidSrc = iframe[0].src.replace(/(.*\/embed\/)([^\?&"'>]+)(.+)?/, `\$1${vid}\$3`);
                    if (vidSrc.indexOf('autoplay') > 0)
                    {
                        vidSrc = vidSrc.replace('autoplay=0', 'autoplay=1');
                    }
                    else
                    {
                        vidSrc += '&autoplay=1';
                    }
                    iframe[0].src = vidSrc;
                    playerWrap.scrollIntoView();
                }
            }
        });
        var currentPage = 1;
        delegate(playerWrap, "click", ".ep-next, .ep-prev", function(event) {
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
            };

            var formBody = [];
            for (var property in data) {
                var encodedKey = encodeURIComponent(property);
                var encodedValue = encodeURIComponent(data[property]);
                formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");

            var loader = playerWrap.getElementsByClassName("ep-loader");
            var galleryWrapper = playerWrap.getElementsByClassName(
                "ep-youtube__content__block"
            );
            removeClass(loader[0], "hide");
            addClass(galleryWrapper[0], "loading");
            sendRequest("/wp-admin/admin-ajax.php", formBody, function(request) {
                addClass(loader[0], "hide");
                removeClass(galleryWrapper[0], "loading");

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
        });
    }
})();
