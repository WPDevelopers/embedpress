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

    // Logo Upload
    $('.preview__logo__input').change(function(){
        var curElement = $('.preview__logo');
        var reader = new FileReader();
        reader.onload = function (e) {
            curElement.attr('src', e.target.result);
        };
        reader.readAsDataURL(this.files[0]);
    });

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

});
