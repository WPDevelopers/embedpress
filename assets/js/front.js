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
        if(selector.length){
            selector.each(function(index, value) {
                var $this = $(this),
                    id = $this.data('emid'),
                    src = $this.data('emsrc');
                    PDFObject.embed(src, "."+id);
            });
        }
    });

})(jQuery);
