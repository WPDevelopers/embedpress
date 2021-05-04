jQuery(document).ready(function($){

    // Sidebar Menu Toggle
    $('.sidebar__dropdown .sidebar__link--toggler').on('click', function(e) {
        e.preventDefault();
        var $this = $(this);
        $('.sidebar__item').removeClass('show');
        $this.parent().addClass('show');
        if($this.siblings('.dropdown__menu').hasClass('show')){
            $this.siblings('.dropdown__menu').removeClass('show');
            $this.siblings('.dropdown__menu').slideUp();
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
    })

    // Logo Controller
    var rangeSlider = function(){
        var slider = $('.logo__adjust__controller__inputs'),
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
                $(previewImg).css('opacity', this.value / 100);
            });
            xRange.on('input', function(){
                $(this).next(value).val(this.value);
                $(previewImg).css('right', this.value + "%");
            });
            yRange.on('input', function(){
                $(this).next(value).val(this.value);
                $(previewImg).css('bottom', this.value + "%");
            });
        });
    };

    rangeSlider();

    $('.template__wrapper .input__switch input').on('click', function() {
        $(this).parents('.form__control__wrap').children('.logo__adjust__wrap').slideToggle();
    })

    var proFeatureAlert = function() {

        var formWrap = $('.form__control__wrap');

        formWrap.each(function() {
            $('.input__switch').on('click', function(e) {
                if($(this).hasClass('isPro')) {
                    e.preventDefault();
                    $(this).siblings('.pro__alert__wrap').fadeIn();
                }
            })

            $('.pro__alert__card .button').on('click', function(e) {
                e.preventDefault();
                $(this).parents('.pro__alert__wrap').fadeOut();
            })
        })

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
                    alert('Settings Updated');
                }else{
                    alert('Something went wrong.');
                }
            },
            error: function(error) {
                alert('Something went wrong.');
            },
        });
    });

    $('.ep-color-picker').wpColorPicker();


});
