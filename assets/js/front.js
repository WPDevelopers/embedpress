/**
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2018 EmbedPress. All rights reserved.
 * @license     GPLv2 or later
 * @since       1.7.0
 */
(function ($) {
    'use strict';
    $( document ).ready(function() {
        var selector = $('.embedpress-embed-document-pdf');
        let option = {
            forceObject: true,
        };
        if(selector.length){
            selector.each(function(index, value) {
                var $this = $(this),
                    id = $this.data('emid'),
                    src = $this.data('emsrc');
                    PDFObject.embed(src, "."+id, option);
            });
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

})(jQuery);
