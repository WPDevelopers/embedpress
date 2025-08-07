function embedPressRemoveURLParameter(url, parameter) {
    //prefer to use l.search if you have a location/link object
    let urlparts = url.split('?');
    if (urlparts.length >= 2) {

        let prefix = encodeURIComponent(parameter) + '=';
        let pars = urlparts[1].split(/[&;]/g);

        //reverse iteration as may be destructive
        for (var i = pars.length; i-- > 0;) {
            //idiom for string.startsWith
            if (pars[i].lastIndexOf(prefix, 0) !== -1) {
                pars.splice(i, 1);
            }
        }

        return urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : '');
    }
    return url;
}
jQuery(document).ready(function ($) {
    $('.ep-color-picker').wpColorPicker();
    let formDataChanged = false;
    let $settingsForm = $('.embedpress-settings-form');
    let _$Forminputs = $('.embedpress-settings-form :input:not([type=submit], [disabled], button, [readonly])');
    _$Forminputs.on('change', function (e) {
        //':input' selector get all form fields even textarea, input, or select
        formDataChanged = false;
        let fields_to_avoids = ['ep_settings_nonce', '_wp_http_referer', 'g_loading_animation', 'submit'];
        let types_to_avoid = ['button'];
        let yes_no_type_checkbox_radios = ['yt_branding', 'embedpress_document_powered_by', 'embedpress_pro_twitch_autoplay', 'embedpress_pro_twitch_chat'];
        let radio_names = [];
        for (var i = 0; i < _$Forminputs.length; i++) {
            let ip = _$Forminputs[i];
            let input_type = ip.type;
            let input_name = ip.name;
            if (!fields_to_avoids.includes(input_name) && !types_to_avoid.includes(input_type)) {
                let $e_input = $(ip);
                if ('radio' === input_type) {
                    if (!radio_names.includes(input_name)) {

                        let $checked_radio = $(`input[name="${input_name}"]:checked`);
                        let $input__radio_wrap = $checked_radio.parents('.input__radio_wrap');
                        let checked_radio_value = $checked_radio.val();
                        $input__radio_wrap.data('value', checked_radio_value);

                        if ($input__radio_wrap.data('value') != $input__radio_wrap.data('default')) {
                            formDataChanged = true;
                            //break;
                        }
                        radio_names.push(input_name);
                    }
                } else if ('checkbox' === input_type) {
                    if ($e_input.is(":checked")) {
                        $e_input.data('value', $e_input.val());
                    } else {
                        if (yes_no_type_checkbox_radios.includes(input_name)) {
                            $e_input.data('value', 'no');
                        } else {
                            $e_input.data('value', '');
                        }
                    }
                    if ($e_input.data('value') != $e_input.data('default')) {
                        formDataChanged = true;
                    }
                } else {
                    if ($e_input.val() != $e_input.data('default')) {
                        formDataChanged = true;
                        //break;
                    }
                }

            }

        }
        if (formDataChanged === true) {
            $settingsForm.find('.embedpress-submit-btn').addClass('ep-settings-form-changed');
        } else {
            $settingsForm.find('.embedpress-submit-btn').removeClass('ep-settings-form-changed');
        }
    });

    window.onbeforeunload = function () {
        if (formDataChanged === true) {
            return "You have unsaved data. Are you sure to leave without saving them?";
        } else {
            return;
        }
    };

    // Sidebar Menu Toggle
    $('.sidebar__dropdown .sidebar__link--toggler').on('click', function (e) {
        e.preventDefault();
        let $this = $(this);
        let $sidebarItem = $('.sidebar__item');
        $sidebarItem.removeClass('show');
        $this.parent().addClass('show');
        if ($this.siblings('.dropdown__menu').hasClass('show')) {
            $this.siblings('.dropdown__menu').removeClass('show');
            $this.siblings('.dropdown__menu').slideUp();
            $sidebarItem.removeClass('show');
        } else {
            $('.dropdown__menu.show').slideUp().removeClass('show');
            $this.siblings('.dropdown__menu').addClass('show');
            // $('.sidebar__menu .dropdown__menu.show').slideUp();
            $this.siblings('.dropdown__menu').slideDown();
        }
    })

    // Sidebar Toggle
    $('.sidebar__toggler').on('click', function (e) {
        e.preventDefault();
        $(this).siblings('.sidebar__menu').slideToggle();
    })

    // Logo Remove
    $('.preview__remove').on('click', function (e) {
        e.preventDefault();

        let $logo_remove_btn = $(this);
        let $main_adjustment_wrap = $logo_remove_btn.parents('.logo__adjust__wrap');
        $main_adjustment_wrap.find('.preview__logo').attr('src', '');
        $main_adjustment_wrap.find(".logo__upload__preview").hide();
        $main_adjustment_wrap.find(".logo__upload").show();
        $main_adjustment_wrap.find(".instant__preview__img").attr('src', '');
        $main_adjustment_wrap.find('.preview__logo__input').val('');
        $main_adjustment_wrap.find('.preview__logo__input_id').val('');
        $settingsForm.find('.embedpress-submit-btn').addClass('ep-settings-form-changed');
        formDataChanged = true;
    })

    // Logo Controller
    let rangeSlider = function () {
        let $slider = $('.logo__adjust');
        $slider.each(function () {
            let $es = $(this),
                previewImg = $es.find('.preview__logo'),
                opRange = $es.find('.opacity__range'),
                xRange = $es.find('.x__range'),
                yRange = $es.find('.y__range'),
                $range__value = $es.find('.range__value');
            $range__value.each(function () {
                $(this).html($(this).prev().attr('value'));
            });

            opRange.on('input', function () {
                $(this).next($range__value).val(this.value);
                previewImg.css('opacity', this.value / 100);
            });
            xRange.on('input', function () {
                $(this).next($range__value).val(this.value);
                previewImg.css('right', this.value + "%");
            });
            yRange.on('input', function () {
                $(this).next($range__value).val(this.value);
                previewImg.css('bottom', this.value + "%");
            });
        });



    };

    rangeSlider();

    $('.template__wrapper .input__switch .logo__adjust__toggler').on('click', function (e) {
        e.preventDefault();
        $('.logo__adjust__wrap').not($(this).parents('.form__control__wrap').children('.logo__adjust__wrap')).slideUp();
        $('.template__wrapper .input__switch .logo__adjust__toggler').not($(this)).removeClass('show');
        $(this).toggleClass('show');
        $(this).parents('.form__control__wrap').children('.logo__adjust__wrap').slideToggle();
    })

    $('.form__control__wrap .input__switch input').on('click', function () {
        $(this).siblings('.logo__adjust__toggler.show').trigger('click');
    })

    let proFeatureAlert = function () {

        $(document).on('click', '.isPro', function () {
            $(this).siblings('.pro__alert__wrap').fadeIn();
        });

        $(document).on('click', '.pro__alert__card .button', function (e) {
            e.preventDefault();
            $(this).parents('.pro__alert__wrap').fadeOut();
        });
    }

    proFeatureAlert();

    // custom logo upload for youtube
    $(document).on('click', '.logo__upload', function (e) {
        e.preventDefault();
        let $logo_uploader_btn = $(this);
        let $main_adjustment_wrap = $logo_uploader_btn.parent('.logo__adjust__wrap');
        let curElement = $main_adjustment_wrap.find('.preview__logo');
        //let $yt_logo_upload_wrap =   $main_adjustment_wrap.find("#yt_logo_upload_wrap");
        let $yt_logo__upload__preview = $main_adjustment_wrap.find(".logo__upload__preview");
        let $yt_logo_preview = $main_adjustment_wrap.find(".instant__preview__img");
        let $yt_logo_url = $main_adjustment_wrap.find('.preview__logo__input');
        let $yt_logo_id = $main_adjustment_wrap.find('.preview__logo__input_id');
        let button = $(this),
            yt_logo_uploader = wp.media({
                title: 'Custom Logo',
                library: {
                    uploadedTo: wp.media.view.settings.post.id,
                    type: 'image'
                },
                button: {
                    text: 'Use this image'
                },
                multiple: false
            }).on('select', function () {
                let attachment = yt_logo_uploader.state().get('selection').first().toJSON();
                if (attachment && attachment.id && attachment.url) {
                    $logo_uploader_btn.hide();
                    $yt_logo_url.val(attachment.url);
                    $yt_logo_id.val(attachment.id);
                    $yt_logo_preview.attr('src', attachment.url);
                    $yt_logo__upload__preview.show();
                    curElement.attr('src', attachment.url);
                    $settingsForm.find('.embedpress-submit-btn').addClass('ep-settings-form-changed');
                    formDataChanged = true;
                } else {
                    console.log('something went wrong using selected image');
                }
            }).open();
    });


    // Elements
    $(document).on('change', '.element-check', function (e) {
        let $input = $(this);
        $.ajax({
            url: ajaxurl,
            type: 'post',
            data: {
                action: 'embedpress_elements_action',
                _wpnonce: embedpressObj.nonce,
                element_type: $input.data('type'),
                element_name: $input.data('name'),
                checked: $input.is(":checked"),
            },
            success: function (response) {
                if (response && response.success) {
                    showSuccessMessage();
                } else {
                    showErrorMessage();
                }
            },
            error: function (error) {
                showErrorMessage();
            },
        });
    });

    // track changes in settings page

    // Save EmbedPRess Settings data using Ajax
    $(document).on('submit', 'form.embedpress-settings-form', function (e) {
        e.preventDefault();
        let $form = $(this);
        let $submit_btn = $form.find('.embedpress-submit-btn');
        let submit_text = $submit_btn.text();
        const form_data = $form.serializeArray();
        const $submit_type = $submit_btn.attr('value');

        $submit_btn.text('Saving...'); //@TODO; Translate the text;
        const ajaxAction = {
            name: "action",
            value: 'embedpress_settings_action'
        };
        form_data.push(ajaxAction);
        form_data.push({
            name: 'submit',
            value: $submit_type,
        });
        $.ajax({
            url: ajaxurl,
            type: 'post',
            dataType: 'json',
            data: form_data,
            success: function (response) {
                $submit_btn.removeClass('ep-settings-form-changed');
                if (response && response.success) {
                    showSuccessMessage();
                    $submit_btn.text(submit_text);
                    formDataChanged = false;
                } else {
                    $submit_btn.text(submit_text);
                    showErrorMessage();
                }
            },
            error: function (error) {
                $submit_btn.removeClass('ep-settings-form-changed');
                $submit_btn.text(submit_text);
                showErrorMessage();
            },
        });
    });
    /**
    * It shows success message in a toast alert
    * */
    function showSuccessMessage() {
        let $success_message_node = $('.toast__message--success');
        $success_message_node.addClass('show');
        setTimeout(function () {
            $success_message_node.removeClass('show');
        }, 3000);
    }
    /**
    * It shows error message in a toast alert
    * */
    function showErrorMessage() {
        let $error_message_node = $('.toast__message--error');
        $error_message_node.addClass('show');
        setTimeout(function () {
            $error_message_node.removeClass('show');
        }, 3000);
    }


    // license
    $(document).on('click', '.embedpress-license-deactivation-btn', function (e) {
        let $this = $(this);
        setTimeout(function () {
            $this.attr('disabled', 'disabled');
        }, 2000);
        $this.html('Deactivating.....');
    });
    $(document).on('click', '.embedpress-license-activation-btn', function (e) {
        let $this = $(this);
        let val = $('#embedpress-pro-license-key').val();
        if (val) {
            setTimeout(function () {
                $this.attr('disabled', 'disabled');
            }, 2000);
            $this.html('Activating.....');
        }
    });


    // Helpers
    function copyToClipboard(text) {
        if (window.clipboardData && window.clipboardData.setData) {
            // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
            return window.clipboardData.setData("Text", text);

        }
        else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
            var textarea = document.createElement("textarea");
            textarea.textContent = text;
            textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in Microsoft Edge.
            document.body.appendChild(textarea);
            textarea.select();
            try {
                return document.execCommand("copy");  // Security exception may be thrown by some browsers.
            }
            catch (ex) {
                console.warn("Copy to clipboard failed.", ex);
                return false;
            }
            finally {
                document.body.removeChild(textarea);
            }
        }
    }
    function validateUrl(value) {
        return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
    }
    // Generate Shortcode
    let $shortcodePreview = $('#ep-shortcode');

    $(document).on('click', '#ep-shortcode-btn', function (e) {
        e.preventDefault();
        let $linkNode = $('#ep-link');
        let link = $linkNode.val();
        if (!validateUrl(link)) {
            show_attention_alert('Please enter a valid URL.');
            $linkNode.val('');
            $shortcodePreview.val('');
            return;
        }
        $linkNode.val('');
        var arr = link.split('.');
        if (arr[arr.length - 1] === 'pdf') {
            $shortcodePreview.val('[embedpress_pdf]' + link + '[/embedpress_pdf]');
        }
        else {
            $shortcodePreview.val('[embedpress]' + link + '[/embedpress]');
        }
        $shortcodePreview.focus();
    });

    $(document).on('click', '#ep-shortcode-cp', function (e) {
        e.preventDefault();
        let shortcode = $shortcodePreview.val();
        if (shortcode.length < 1) {
            show_error_alert('Please enter a valid URL and generate a shortcode first.');
            return;
        }
        copyToClipboard(shortcode);
        $shortcodePreview.removeClass('active');
        show_success_alert('Copied to your clipboard successfully.');
    });

    $shortcodePreview.on('focus', function (e) {
        $(this).select();
    });

    function show_attention_alert(message = '') {
        let $attention_message_node = $('.toast__message--attention');
        if (message.length > 0) {
            $attention_message_node.find('p').html(message);
        }
        $attention_message_node.addClass('show');
        setTimeout(function () {
            $attention_message_node.removeClass('show');
            history.pushState('', '', embedPressRemoveURLParameter(location.href, 'attention'));
        }, 3000);
    }

    function show_error_alert(message = '') {
        let $error_message_node = $('.toast__message--error');
        if (message.length > 0) {
            $error_message_node.find('p').html(message);
        }
        $error_message_node.addClass('show');
        setTimeout(function () {
            $error_message_node.removeClass('show');
            history.pushState('', '', embedPressRemoveURLParameter(location.href, 'error'));
        }, 3000);
    }

    function show_success_alert(message = '') {
        let $success_message_node = $('.toast__message--success');
        if (message.length > 0) {
            $success_message_node.find('p').html(message);
        }
        $success_message_node.addClass('show');
        setTimeout(function () {
            $success_message_node.removeClass('show');
            history.pushState('', '', embedPressRemoveURLParameter(location.href, 'success'));
        }, 3000);
    }

    function customConfirm(message, onYes, onNo) {
        const dialogBox = document.createElement('div');
        dialogBox.classList.add('custom-dialog');

        const messageElement = document.createElement('p');
        messageElement.textContent = message;

        const yesButton = document.createElement('button');
        yesButton.textContent = 'Yes';
        yesButton.addEventListener('click', () => {
            document.body.removeChild(dialogBox);
            onYes();
        });

        const noButton = document.createElement('button');
        noButton.textContent = 'No';
        noButton.addEventListener('click', () => {
            document.body.removeChild(dialogBox);
            onNo();
        });

        dialogBox.appendChild(messageElement);
        dialogBox.appendChild(yesButton);
        dialogBox.appendChild(noButton);

        document.body.appendChild(dialogBox);
    }

    $('.account-delete-button').on('click', function () {
        customConfirm('Are you sure you want to delete?', onDeleteConfirmed, onDeleteCancelled);
        $that = $(this);
        $userId = $that.closest('tr').data('userid');
        $accountType = $that.closest('tr').data('accounttype');

        $that.css('pointer-events', 'none');

        function onDeleteConfirmed() {

            // Add code here to perform AJAX request or other actions for deletion

            var data = {
                'action': 'delete_instagram_account',
                'user_id': $userId,
                'account_type': $accountType,
                '_nonce': embedpressObj.nonce
            };


            jQuery.post(ajaxurl, data, function (response) {
                if (response) {
                    $that.css('pointer-events', 'all');
                    $that.closest('tr').remove();
                }
            });
        }

        function onDeleteCancelled() {
            $that.css('pointer-events', 'all');
            // Code when deletion is cancelled
        }


    });

    $('#instagram-form').on('submit', function (e) {
        e.preventDefault(); // Prevent default form submission


        if ($('#instagram-form p').length > 0) {
            $('#instagram-form p').remove();
        }

        var access_token = $('#instagram-access-token').val();
        var account_type = $('#account-option').val();

        $('#instagram-form button').text('Connecting...');
        $('#instagram-form button').attr('disabled', 'disabled');

        // AJAX request
        $.ajax({
            url: ajaxurl, // WordPress AJAX URL
            type: 'POST',
            data: {
                action: 'get_instagram_userdata_ajax', // AJAX action hook
                access_token: access_token, // Access token data
                account_type: account_type, // Access token data
                _nonce: embedpressObj.nonce
            },
            success: function (response) {
                // Handle the response
                if (response.error) {
                    $('#instagram-form button').text('Connect');
                    $('#instagram-access-token').after(`<p>${response.error}</p>`);
                    $('#instagram-form button').removeAttr('disabled');
                    setTimeout(() => {
                        $('#instagram-form p').remove();
                    }, 10000);
                } else {
                    $('#instagram-form button').text('Connected');
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            },
            error: function (xhr, status, error) {
                // Handle errors
                console.error(error);
            }
        });
    });


    $('.instagram-sync-data').on('click', function (e) {
        e.preventDefault(); // Prevent default form submission
        $that = $(this);

        var access_token = $that.data('acceess-token');
        var account_type = $that.data('account-type');
        var user_id = $that.data('userid');

        // Add or remove the spinner class to start or stop the spinning animation
        $that.find('i').addClass('sync-spin'); // Start spinning
        $that.attr('disabled', 'disabled');


        // AJAX request
        $.ajax({
            url: ajaxurl, // WordPress AJAX URL
            type: 'POST',
            data: {
                action: 'sync_instagram_data_ajax', // AJAX action hook
                access_token: access_token, // Access token data
                account_type: account_type, // Account type data
                user_id: user_id, // User ID data
                _nonce: embedpressObj.nonce
            },
            success: function (response) {
                // Handle the response
                if (response.error) {
                    $that.removeAttr('disabled');
                } else {
                    $that.removeClass('sync-spin'); // Stop spinning

                    $that.text('Synced.');
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            },
            error: function (xhr, status, error) {
                // Handle errors
                console.error(error);
            }
        });
    });



    $('.calendly-event-copy-link').click(function () {
        var eventLink = $(this).data('event-link');
        var tempInput = $('<input>');
        $('body').append(tempInput);
        tempInput.val(eventLink).select();
        document.execCommand('copy');
        tempInput.remove();

        var button = $(this);
        button.find('span').text('Copied!');

        setTimeout(function () {
            button.find('span').text('Copy link');
        }, 1500);
    });

    $('#open-modal-btn').click(function () {
        $('.modal-overlay').css('display', 'block');
    });

    $('.modal-overlay .close-btn').click(function () {
        $('.modal-overlay').css('display', 'none');
    });

    $(document).on('click', function (e) {
        if (e.target.classList.contains('modal-overlay')) {
            $('.modal-overlay').css('display', 'none');
        }
    });

    $('.user-profile-link').click(function () {
        var linkToCopy = $(this).attr('title');
        copyToClipboard(linkToCopy);
        alert('Link copied to clipboard: ' + linkToCopy);
    });

    // Global Brand Image Upload Functionality
    function initGlobalBrandUpload(uploadBtnId, removeBtnId, previewAreaId, urlInputId, idInputId) {
        $(document).on('click', uploadBtnId, function (e) {
            e.preventDefault();

            let globalBrandUploader = wp.media({
                title: 'Select Global Brand Logo',
                library: {
                    type: 'image'
                },
                button: {
                    text: 'Use this image'
                },
                multiple: false
            }).on('select', function () {
                let attachment = globalBrandUploader.state().get('selection').first().toJSON();
                if (attachment && attachment.id && attachment.url) {
                    // Update preview
                    $(previewAreaId).html('<img src="' + attachment.url + '" alt="Global Brand Logo" class="embedpress-global-brand-preview-img">');

                    // Update hidden inputs
                    $(urlInputId).val(attachment.url);
                    $(idInputId).val(attachment.id);

                    // Update button text and show remove button
                    $(uploadBtnId).text('Replace');
                    if ($(removeBtnId).length === 0) {
                        $(uploadBtnId).after('<button type="button" id="' + removeBtnId.substring(1) + '" class="embedpress-font-sm embedpress-font-family-dmsans embedpress-upload-btn remove-btn">Remove</button>');
                    } else {
                        $(removeBtnId).show();
                    }

                    // Save to database via AJAX
                    saveGlobalBrandImage(attachment.url, attachment.id);
                } else {
                    console.log('Error selecting image for global brand');
                }
            }).open();
        });

        $(document).on('click', removeBtnId, function (e) {
            e.preventDefault();

            // Clear preview
            $(previewAreaId).empty();

            // Clear hidden inputs
            $(urlInputId).val('');
            $(idInputId).val('');

            // Update button text and hide remove button
            $(uploadBtnId).text('Upload');
            $(removeBtnId).hide();

            // Save empty values to database
            saveGlobalBrandImage('', '');
        });
    }

    // Initialize for all three sections
    initGlobalBrandUpload('#globalBrandUploadBtn', '#globalBrandRemoveBtn', '#globalBrandPreview', '#globalBrandLogoUrl', '#globalBrandLogoId');
    
    // Banner dismiss functionality
    $(document).on('click', '.embedpress-cancel-button', function(e) {
        e.preventDefault();

        // Check if this is the main banner dismiss button
        if ($(this).closest('.embedPress-introduction-panel-wrapper').length > 0) {
            // Hide the entire right panel
            $(this).closest('.embedPress-introduction-panel-wrapper').addClass('dismissed');

            // Save dismiss state via AJAX
            dismissElement('main_banner');
        }

        // Check if this is the popup dismiss button
        if ($(this).closest('.pop-up-right-content').length > 0) {
            // Hide the popup
            hidePopup();

            // Save dismiss state to localStorage
            localStorage.setItem('embedpress_hub_popup_dismissed', 'true');

            // Also save to backend for cross-device persistence
            dismissElement('hub_popup');
        }
    });

    // ===== DISMISS FUNCTIONALITY =====

    // Generic function to dismiss any element
    function dismissElement(elementType) {
        $.ajax({
            url: embedpressObj.ajaxurl,
            type: 'POST',
            data: {
                action: 'embedpress_dismiss_element',
                nonce: embedpressObj.ajax_nonce,
                element_type: elementType
            },
            success: function(response) {
                if (response.success) {
                } else {
                    console.log('EmbedPress: Error dismissing element - ' + response.data.message);
                }
            },
            error: function() {
                console.log('EmbedPress: AJAX error while dismissing element');
            }
        });
    }

    // ===== POPUP FUNCTIONALITY =====

    // Auto-show popup functionality for hub page
    function initHubPopup() {
        // Check if we're on the hub page specifically (no page_type parameter means hub page)
        var urlParams = new URLSearchParams(window.location.search);
        var isHubPage = urlParams.get('page') === 'embedpress' && !urlParams.get('page_type');

        // Check if popup exists and we're on hub page
        if ($('.embedpress-pop-up').length > 0 && isHubPage) {
            // Check if popup was previously dismissed (both localStorage and backend)
            var localDismissed = localStorage.getItem('embedpress_hub_popup_dismissed');
            var backendDismissed = embedpressObj.hub_popup_dismissed;
            var proFeaturesEnabled = embedpressObj.is_pro_features_enabled;

            // Only show if not dismissed and pro features are not enabled
            if (!localDismissed && !backendDismissed && !proFeaturesEnabled) {
                setTimeout(function() {
                    showPopup();
                }, 3000); // Show after 3 seconds
            } else {
                console.log('EmbedPress: Popup not shown due to conditions');
            }
        } else {
            console.log('EmbedPress: Not on hub page or popup element not found');
        }
    }

    // Function to show popup
    function showPopup() {
        var popup = $('.embedpress-pop-up');

        if (popup.length > 0) {
            popup.addClass('show');

            // Add overlay click to close
            popup.off('click.popup').on('click.popup', function(e) {
                if (e.target === this) {
                    hidePopup();
                }
            });
        } else {
            console.log('EmbedPress: Popup element not found');
        }
    }

    // Function to hide popup
    function hidePopup() {
        $('.embedpress-pop-up').removeClass('show');
    }


    // Close popup with Escape key
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape' || e.keyCode === 27) {
            hidePopup();
        }
    });

    // Prevent popup content clicks from closing the popup
    $(document).on('click', '.embedpress-pop-up-content', function(e) {
        e.stopPropagation();
    });

    // Initialize hub popup on page load
    initHubPopup();

    // Note: Popup functionality is now handled in the organized section above

    // Function to save global brand image via AJAX
    function saveGlobalBrandImage(logoUrl, logoId) {
        $.ajax({
            url: embedpressObj.ajaxurl,
            type: 'POST',
            data: {
                action: 'save_global_brand_image',
                logo_url: logoUrl,
                logo_id: logoId,
                nonce: embedpressObj.ajax_nonce
            },
            success: function(response) {
                if (response.success) {
                    // Update all preview areas with the new image
                    updateAllPreviewAreas(logoUrl);
                } else {
                    console.log('Error saving global brand image:', response.data);
                }
            },
            error: function() {
                console.log('AJAX error while saving global brand image');
            }
        });
    }

    // Function to update all preview areas
    function updateAllPreviewAreas(logoUrl) {
        const previewAreas = ['#globalBrandPreview', '#globalBrandPreviewExpired', '#globalBrandPreviewValid'];
        const urlInputs = ['#globalBrandLogoUrl', '#globalBrandLogoUrlExpired', '#globalBrandLogoUrlValid'];
        const uploadBtns = ['#globalBrandUploadBtn', '#globalBrandUploadBtnExpired', '#globalBrandUploadBtnValid'];
        const removeBtns = ['#globalBrandRemoveBtn', '#globalBrandRemoveBtnExpired', '#globalBrandRemoveBtnValid'];

        previewAreas.forEach((previewId, index) => {
            if (logoUrl) {
                $(previewId).html('<img src="' + logoUrl + '" alt="Global Brand Logo" class="embedpress-global-brand-preview-img">');
                $(uploadBtns[index]).text('Replace');
                $(removeBtns[index]).show();
            } else {
                $(previewId).empty();
                $(uploadBtns[index]).text('Upload');
                $(removeBtns[index]).hide();
            }
            $(urlInputs[index]).val(logoUrl);
        });
    }


    $(document).on('click', '.popup-video-wrap, .close-video_btn', function (e) {
        e.preventDefault();

        // Remove the popup-video element
        $('.popup-video').remove();
        $('.popup-video-wrap').removeClass('popup-active');

    });

    $('.video-play_btn').click(function (e) {
        $('.popup-video-wrap').append(`
                <div class="popup-video">
                    <button class="close-video_btn">
                        <a href="#" class="close-btn"></a>
                    </button>
                   <iframe src="https://www.youtube.com/embed/fvYKLkEnJbI?autoplay=1" 
                        title="YouTube video player" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>

                </div>
            `);
    });

});

