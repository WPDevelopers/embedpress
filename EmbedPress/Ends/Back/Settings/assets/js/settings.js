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
jQuery(document).ready( function($){
    $('.ep-color-picker').wpColorPicker();
    let formDataChanged = false;
    let $settingsForm = $('.embedpress-settings-form');
    let _$Forminputs = $('.embedpress-settings-form :input:not([type=submit], [disabled], button, [readonly])');
    _$Forminputs.on('change', function(e) {
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
            if (!fields_to_avoids.includes(input_name) && !types_to_avoid.includes(input_type)){
                let $e_input = $(ip);
                if ('radio' === input_type){
                    if ( !radio_names.includes(input_name)){

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
                    if ($e_input.is(":checked")){
                        $e_input.data('value', $e_input.val());
                    }else{
                        if (yes_no_type_checkbox_radios.includes(input_name)){
                            $e_input.data('value', 'no');
                        }else{
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

    window.onbeforeunload = function() {
        if (formDataChanged === true) {
            return "You have unsaved data. Are you sure to leave without saving them?";
        } else {
            return;
        }
    };

    // Sidebar Menu Toggle
    $('.sidebar__dropdown .sidebar__link--toggler').on('click', function(e) {
        e.preventDefault();
        let $this = $(this);
        let $sidebarItem =  $('.sidebar__item');
        $sidebarItem.removeClass('show');
        $this.parent().addClass('show');
        if($this.siblings('.dropdown__menu').hasClass('show')){
            $this.siblings('.dropdown__menu').removeClass('show');
            $this.siblings('.dropdown__menu').slideUp();
            $sidebarItem.removeClass('show');
        }else{
            $('.dropdown__menu.show').slideUp().removeClass('show');
            $this.siblings('.dropdown__menu').addClass('show');
            // $('.sidebar__menu .dropdown__menu.show').slideUp();
            $this.siblings('.dropdown__menu').slideDown();
        }
    })

    // Sidebar Toggle
    $('.sidebar__toggler').on('click', function(e) {
        e.preventDefault();
        $(this).siblings('.sidebar__menu').slideToggle();
    })

    // Logo Remove
    $('#yt_preview__remove').on('click', function(e) {
        e.preventDefault();
        $('.preview__logo__input').val('');
        $('#yt_logo_url').val('');
        $('#yt_logo_id').val('');
        $("#yt_logo_preview").attr('src', '');
        $('.preview__box img').attr('src', '');
        $("#yt_logo__upload__preview").hide();
        $("#yt_logo_upload_wrap").show();
        $settingsForm.find('.embedpress-submit-btn').addClass('ep-settings-form-changed');
        formDataChanged = true;
    })

    // Logo Controller
    let rangeSlider = function(){
        let slider = $('.logo__adjust__controller__inputs'),
            previewImg = $('.preview__logo'),
            opRange = $('.opacity__range'),
            xRange = $('.x__range'),
            yRange = $('.y__range'),
            value = $('.range__value');

        slider.each(function(){

            value.each(function(){
                var value = $(this).prev().attr('value');
                $(this).html(value);
            });

            opRange.on('input', function(){
                $(this).next(value).val(this.value);
                console.log(this.value / 100);
                previewImg.css('opacity', this.value / 100);
            });
            xRange.on('input', function(){
                $(this).next(value).val(this.value);
                previewImg.css('right', this.value + "%");
            });
            yRange.on('input', function(){
                $(this).next(value).val(this.value);
                previewImg.css('bottom', this.value + "%");
            });
        });
    };

    rangeSlider();

    $('.template__wrapper .input__switch input').on('click', function() {
        $(this).parents('.form__control__wrap').children('.logo__adjust__wrap').slideToggle();
    })

    let proFeatureAlert = function() {

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
    $(document).on('click', '#yt_logo_upload_wrap', function(e){
        e.preventDefault();
        let curElement = $('.preview__logo');
        let $yt_logo_upload_wrap =  $("#yt_logo_upload_wrap");
        let $yt_logo__upload__preview = $("#yt_logo__upload__preview");
        let $yt_logo_preview = $("#yt_logo_preview");
        let $yt_logo_url = $('#yt_logo_url');
        let $yt_logo_id = $('#yt_logo_id');
        let button = $(this),
            yt_logo_uploader = wp.media({
                title: 'Custom Logo',
                library : {
                    uploadedTo : wp.media.view.settings.post.id,
                    type : 'image'
                },
                button: {
                    text: 'Use this image'
                },
                multiple: false
            }).on('select', function() {
                let attachment = yt_logo_uploader.state().get('selection').first().toJSON();
                if (attachment && attachment.id && attachment.url){
                    $yt_logo_upload_wrap.hide();
                    $yt_logo_url.val(attachment.url);
                    $yt_logo_id.val(attachment.id);
                    $yt_logo_preview.attr('src', attachment.url);
                    $yt_logo__upload__preview.show();
                    curElement.attr('src', attachment.url);
                    $settingsForm.find('.embedpress-submit-btn').addClass('ep-settings-form-changed');
                    formDataChanged = true;
                }else{
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
            success: function(response) {
                if (response && response.success){
                    showSuccessMessage();
                }else{
                    showErrorMessage();
                }
            },
            error: function(error) {
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
            success: function(response) {
                $submit_btn.removeClass('ep-settings-form-changed');
                if (response && response.success){
                    showSuccessMessage();
                    $submit_btn.text(submit_text);
                    formDataChanged = false;
                }else{
                    $submit_btn.text(submit_text);
                    showErrorMessage();
                }
            },
            error: function(error) {
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
        setTimeout(function (){
            $success_message_node.removeClass('show');
        }, 3000);
    }
    /**
    * It shows error message in a toast alert
    * */
    function showErrorMessage(){
        let $error_message_node = $('.toast__message--error');
        $error_message_node.addClass('show');
        setTimeout(function (){
            $error_message_node.removeClass('show');
        }, 3000);
    }


    // license
    $(document).on('click', '.embedpress-license-deactivation-btn', function (e) {
        let $this = $(this);
        setTimeout(function (){
            $this.attr('disabled', 'disabled');
        }, 2000);
        $this.html('Deactivating.....');
    });
    $(document).on('click', '.embedpress-license-activation-btn', function (e) {
        let $this = $(this);
        let val = $('#embedpress-pro-license-key').val();
        if (val){
            setTimeout(function (){
                $this.attr('disabled', 'disabled');
            }, 2000);
            $this.html('Activating.....');
        }
    });
});
