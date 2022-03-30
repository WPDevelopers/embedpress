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
})();
