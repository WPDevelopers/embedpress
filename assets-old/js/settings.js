/**
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2018 EmbedPress. All rights reserved.
 * @license     GPLv2 or later
 * @since       1.7.0
 */
(function ($) {
    'use strict';

    $(function () {
        $('.color-field').wpColorPicker();
    });

    //control global embed iframe size
    $('.enableglobalembedresize').on('change', embedpressEnableglobalembedresize);
    embedpressEnableglobalembedresize();

    function embedpressEnableglobalembedresize(e) {
        var check = $('.enableglobalembedresize:checked').val();
        var selector = $('.embedpress-allow-globla-dimension').closest( "tr" );
        if(check!=='1'){
            selector.hide();
        }else{
            selector.show();
        }
    }

})(jQuery);
