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
        let $this = $(this);

        const licensesKey = $('#embedpress-pro-license-key').val();

        if (licensesKey) {
            $this.attr('disabled', 'disabled');
            $this.html('Sending Request.....');
        }
        // var ajaxUrl = 'embedpress/license/activate'; // Replace with the actual URL


        $.ajax({
            type: 'POST',
            url: ajaxurl,
            data: {
                // Your data to be sent in the request body
                action: 'embedpress/license/activate',
                _nonce: wpdeveloperLicenseManagerConfig.nonce, //
                license_key: licensesKey,
            },
            success: function (response) {
                // Handle the successful response here
                console.log('Success:', response);
                if (!response.success) {
                    $this.html('Active License');
                    $this.removeAttr('disabled');
                    $('#invalid-license-key-message').removeClass('hidden');
                    $('.embedpress-toast__message.toast__message--error p').text(response?.data?.message);
                    $('.toast__message--error').addClass('show-toast');

                    setTimeout(() => {
                        $('.toast__message--error').removeClass('show-toast');
                    }, 2000);

                }
                else {
                    $this.html('Varification Required');
                    $('#valid-license-key-message').removeClass('hidden');
                    $('#email-placeholder').text(response.data.customer_email);
                    $('#embedpress-pro-license-key').attr('disabled', 'disabled');

                    $('.embedpress-toast__message.toast__message--success p').text('Verification Code Sent');
                    $('.toast__message--success').addClass('show-toast');

                    setTimeout(() => {
                        $('.toast__message--success').removeClass('show-toast');
                    }, 2000);

                    if (response.data.license === 'required_otp') {
                        $('#otp-varify-form').removeClass('hidden');
                    }
                }
            },
            error: function (xhr, status, error) {
                // Handle errors here
                console.error('Error:', status, error);
            }
        });

    });


    $(document).on('click', '.embedpress-varification-activation-btn', function (e) {
        e.preventDefault();
        let $this = $(this);

        const licensesKey = $('#embedpress-pro-license-key').val();
        const otpCode = $('#embedpress-pro-varification-key').val();

        $('#invalid-varification-key-message').addClass('hidden');

        if (licensesKey) {
            $this.attr('disabled', 'disabled');
            $this.html('Verifying.....');
        }
        // var ajaxUrl = 'embedpress/license/activate'; // Replace with the actual URL

        $.ajax({
            type: 'POST',
            url: ajaxurl,
            data: {
                // Your data to be sent in the request body
                action: 'embedpress/license/submit-otp',
                _nonce: wpdeveloperLicenseManagerConfig.nonce, //
                license: licensesKey,
                otp: otpCode,
            },
            success: function (response) {
                // Handle the successful response here
                console.log('Success:', response);
                if (!response.success) {
                    $this.html('Verify');
                    $this.removeAttr('disabled');
                    $('#invalid-varification-key-message').removeClass('hidden');
                    $('#invalid-varification-key-message').text(response?.data?.message);

                    $('.embedpress-toast__message.toast__message--error p').text(response?.data?.message);
                    $('.toast__message--error').addClass('show-toast');
                    setTimeout(() => {
                        $('.toast__message--error').removeClass('show-toast');
                    }, 2000);

                }
                else {
                    $this.html('Verified');
                    location.reload();
                }
            },
            error: function (xhr, status, error) {
                // Handle errors here
                console.error('Error:', status, error);
            }
        });

    });
    $(document).on('click', '#resend-license-verification-key', function (e) {
        e.preventDefault();
        let $this = $(this);


        const licensesKey = $('#embedpress-pro-license-key').val();
        $('#resend-license-verification-key').text('"Resending"');

        $.ajax({
            type: 'POST',
            url: ajaxurl,
            data: {
                // Your data to be sent in the request body
                action: 'embedpress/license/resend-otp',
                _nonce: wpdeveloperLicenseManagerConfig.nonce, //
                license: licensesKey,
            },
            success: function (response) {
                // Handle the successful response here
                console.log('Success:', response);
                if (!response.success) {
                    $('.embedpress-toast__message.toast__message--error p').text(response?.data?.message);
                    $('.toast__message--error').addClass('show-toast');

                    setTimeout(() => {
                        $('.toast__message--error').removeClass('show-toast');
                    }, 2000);

                }
                else {
                    $('.embedpress-toast__message.toast__message--success p').text(response?.data?.message);
                    $('.toast__message--success').addClass('show-toast');

                    setTimeout(() => {
                        $('.toast__message--success').removeClass('show-toast');
                    }, 2000);
                }
            },
            error: function (xhr, status, error) {
                // Handle errors here
                console.error('Error:', status, error);
            }
        });

    });

    $(document).on('click', '.embedpress-license-deactivation-btn', function (e) {
        e.preventDefault();
        let $this = $(this);

        const licensesKey = $('#embedpress-pro-license-key').val();
        const otpCode = $('#embedpress-pro-varification-key').val();

        console.log(licensesKey);

        if (licensesKey) {
            $this.attr('disabled', 'disabled');
            $this.html('Deactivating.....');
        }
        // var ajaxUrl = 'embedpress/license/activate'; // Replace with the actual URL

        $.ajax({
            type: 'POST',
            url: ajaxurl,
            data: {
                // Your data to be sent in the request body
                action: 'embedpress/license/deactivate',
                _nonce: wpdeveloperLicenseManagerConfig.nonce, //
            },
            success: function (response) {
                // Handle the successful response here
                console.log('Success:', response);
                if (response.success) {
                    $this.html('Deactivated');

                    location.reload();
                }
            },
            error: function (xhr, status, error) {
                // Handle errors here
                console.error('Error:', status, error);
            }
        });

    });



})(jQuery);
