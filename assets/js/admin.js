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
    $(document).on('click', '.embedpress-license-activation-btn', function (e) {
        e.preventDefault();

        const $licensesKey = $('#embedpress-pro-license-key').val();

        // var ajaxUrl = 'embedpress/license/activate'; // Replace with the actual URL

        $.ajax({
            type: 'POST',
            url: ajaxurl,
            data: {
                // Your data to be sent in the request body
                action: 'embedpress/license/activate',
                _nonce: wpdeveloperLicenseManagerConfig.nonce, //
                license_key: $licensesKey,
            },
            success: function (response) {
                // Handle the successful response here
                console.log('Success:', response);
            },
            error: function (xhr, status, error) {
                // Handle errors here
                console.error('Error:', status, error);
            }
        });

    });


})(jQuery);
