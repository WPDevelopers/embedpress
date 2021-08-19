/**
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2018 EmbedPress. All rights reserved.
 * @license     GPLv2 or later
 * @since       1.7.0
 */
(function ($) {
    'use strict';

    $(document).on('click', '.embedpress-plugin-notice-dismissible.is-dismissible', function () {
        var data = {
            action: 'embedpress_notice_dismiss',
            security: EMBEDPRESS_ADMIN_PARAMS.nonce,
        };

        $.post(EMBEDPRESS_ADMIN_PARAMS.ajaxurl, data, function () {

        });
    });
})(jQuery);
