jQuery(document).ready(function($){
    // Sidebar Menu Toggle
    $('.sidebar__dropdown .sidebar__link--toggler').on('click', function(e) {
        e.preventDefault();
        let $this = $(this);
        if($this.siblings('.dropdown__menu').hasClass('show')){
            $this.siblings('.dropdown__menu').removeClass('show');
            $this.siblings('.dropdown__menu').slideToggle();
        }else{
            $('.dropdown__menu.show').removeClass('show').slideToggle();
            $this.siblings('.dropdown__menu').addClass('show');
            $('.sidebar__menu .dropdown__menu.show').slideUp();
            $this.siblings('.dropdown__menu').slideToggle();
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
                var $this = $(this);
                $this.html($this.prev().attr('value'));
            });

            opRange.on('input', function(){
                $(this).next(value).val(this.value);
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

});
