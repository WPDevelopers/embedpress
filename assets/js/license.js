/**
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2018 EmbedPress. All rights reserved.
 * @license     GPLv2 or later
 * @since       1.7.0
 */
(function ($) {
    'use strict';

    var __ = wp.i18n.__;
    var addQueryArgs = wp.url.addQueryArgs;
    
    $(document).on('click', '.embedpress-license-activation-btn', function (e) {
        e.preventDefault();
        let $this = $(this);

        const licensesKey = $('#embedpress-pro-license-key').val();

        if (licensesKey) {
            $this.attr('disabled', 'disabled');
            $this.html(__('Sending Request.....', 'embedpress'));
        }

        $.ajax({
            type: 'POST',
            url: ajaxurl,
            data: {
                // Your data to be sent in the request body
                action: 'embedpress/license/activate',
                _nonce: wpdeveloperLicenseManagerNonce.embedpress_lisence_nonce, //
                license_key: licensesKey,
            },
            success: function (response) {
                // Handle the successful response here
                if (!response.success) {
                    $this.html(__('Active License', 'embedpress'));
                    $this.removeAttr('disabled');
                    $('.embedpress-toast__message.toast__message--error p').text(response?.data?.message);
                    $('.toast__message--error').addClass('show-toast');

                    setTimeout(() => {
                        $('.toast__message--error').removeClass('show-toast');
                    }, 2000);

                }
                else if (response.data.license === 'valid') {
                    activationMessage();
                }
                else if (response.data.license === 'required_otp') {
                    $this.html(__('Verification Required', 'embedpress'));
                    $('#valid-license-key-message').removeClass('hidden');
                    $('#email-placeholder').text(response.data.customer_email);
                    $('#embedpress-pro-license-key').attr('disabled', 'disabled');

                    $('.embedpress-toast__message.toast__message--success p').text('Verification Code Sent successfully');
                    $('.toast__message--success').addClass('show-toast');

                    setTimeout(() => {
                        $('.toast__message--success').removeClass('show-toast');
                    }, 2000);

                    $('#otp-varify-form').removeClass('hidden');
                }
            },
            error: function (xhr, status, error) {
                // Handle errors here
                console.error('Error:', status, error);
            }
        });

    });

    $(document).on('click', '.embedpress-verification-activation-btn', function (e) {
        e.preventDefault();
        let $this = $(this);

        const licensesKey = $('#embedpress-pro-license-key').val();
        const otpCode = $('#embedpress-pro-verification-key').val();

        $('#invalid-verification-key-message').addClass('hidden');

        if (licensesKey) {
            $this.attr('disabled', 'disabled');
            $this.html(__('Verifying.....', 'embedpress'));
        }
        // var ajaxUrl = 'embedpress/license/activate'; // Replace with the actual URL

        $.ajax({
            type: 'POST',
            url: ajaxurl,
            data: {
                // Your data to be sent in the request body
                action: 'embedpress/license/submit-otp',
                _nonce: wpdeveloperLicenseManagerNonce.embedpress_lisence_nonce, //
                license: licensesKey,
                otp: otpCode,
            },
            success: function (response) {
                // Handle the successful response here
                console.log('Success:', response);
                if (!response.success) {
                    $this.html('Verify');
                    $this.removeAttr('disabled');
                    $('.embedpress-toast__message.toast__message--error p').text(response?.data?.message);
                    $('.toast__message--error').addClass('show-toast');
                    setTimeout(() => {
                        $('.toast__message--error').removeClass('show-toast');
                    }, 2000);

                }
                else {
                    $this.html(__('Verified', 'embedpress'));
                    activationMessage();
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
        $('#resend-license-verification-key').text(__('Resending', 'embedpress'));

        $.ajax({
            type: 'POST',
            url: ajaxurl,
            data: {
                // Your data to be sent in the request body
                action: 'embedpress/license/resend-otp',
                _nonce: wpdeveloperLicenseManagerNonce.embedpress_lisence_nonce, //
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
                    $('.embedpress-toast__message.toast__message--success p').text('Verification Code Resent Successfully.');
                    $('.toast__message--success').addClass('show-toast');

                    setTimeout(() => {
                        $('.toast__message--success').removeClass('show-toast');
                    }, 2000);
                }

                $('#resend-license-verification-key').text(__('Resend', 'embedpress'));

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
        const otpCode = $('#embedpress-pro-verification-key').val();

        console.log(licensesKey);

        if (licensesKey) {
            $this.attr('disabled', 'disabled');
            $this.html(__('Deactivating.....', 'embedpress'));
        }
        // var ajaxUrl = 'embedpress/license/activate'; // Replace with the actual URL

        $.ajax({
            type: 'POST',
            url: ajaxurl,
            data: {
                // Your data to be sent in the request body
                action: 'embedpress/license/deactivate',
                _nonce: wpdeveloperLicenseManagerNonce.embedpress_lisence_nonce, //
            },
            success: function (response) {
                // Handle the successful response here
                console.log('Success:', response);
                if (response.success) {
                    deactivationMessage();
                }
            },
            error: function (xhr, status, error) {
                // Handle errors here
                console.error('Error:', status, error);
            }
        });

    });

    function activationMessage() {
        var currentUrl = window.location.href;
        var newUrl = addQueryArgs(currentUrl,  {
            success: true,
            message: __('License has been activated', 'embedpress')
        });
        window.location.href = newUrl;
    }
    function deactivationMessage() {
        var currentUrl = window.location.href;
        var newUrl = addQueryArgs(currentUrl,  {
            success: true,
            message: __('License has been deactivated', 'embedpress')
        });
        
        window.location.href = newUrl;
    }



})(jQuery);
