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
    $(document).on('click', '.embedpress-plugin-notice-dismissible.is-dismissible', function () {
        var data = {
            action: 'embedpress_notice_dismiss',
            security: EMBEDPRESS_ADMIN_PARAMS.nonce,
        };

        $.post(EMBEDPRESS_ADMIN_PARAMS.ajaxurl, data, function () {

        });
    });


})(jQuery);




// leon js 

const rengeControls = document.querySelectorAll('.range-control');
const adToggleSwitch = document.querySelector('.sponsored-active_btn');
const videoBtn = document.querySelector('.btn-video');
const imgBtn = document.querySelector('.btn-img');
const videoBtnBody = document.querySelector('.video-body');
const imgBtnBody = document.querySelector('.img-body');
const videoPlayBtn = document.querySelector('.video-play_btn');
const videoPopPup = document.querySelector('.popup-video-wrap');
const closePopPup = document.querySelector('.close-video_btn');
const slideLink = document.querySelector('.sponsored-floating_quick-links_wrapper');
const floatingQuckLinks = document.querySelector('.sponsored-floating_quick-links');
const activeIcon = document.querySelector('.active-icon');
const closeIcon = document.querySelector('.close-icon');

rengeControls?.forEach((rangeControl) => {
    const minus = rangeControl.querySelector('.range_negative');
    const plus = rangeControl.querySelector('.range_positive');
    const input = rangeControl.querySelector('.range__value');


    minus.addEventListener('click', function () {
        let v = parseInt(input.value);

        if (v > 0) {
            input.value = v - 1;
        }
    })

    plus.addEventListener('click', function () {
        input.value = parseInt(input.value) + 1;
    })
})

videoBtn?.addEventListener('click', function () {

    if (adToggleSwitch) {
        this.classList.add('sponsored-active_btn');
        imgBtn.classList.remove('sponsored-active_btn');
        videoBtnBody.classList.add('toggle-active');
        imgBtnBody.classList.remove('toggle-active');
    }
});

imgBtn?.addEventListener('click', function () {
    if (adToggleSwitch) {
        this.classList.add('sponsored-active_btn');
        videoBtn.classList.remove('sponsored-active_btn');
        imgBtnBody.classList.add('toggle-active');
        videoBtnBody.classList.remove('toggle-active');

    }
});

videoPlayBtn?.addEventListener('click', function () {
    videoPopPup.classList.add('popup-active');
})

closePopPup?.addEventListener('click', function () {
    videoPopPup.classList.remove('popup-active');
})

activeIcon?.addEventListener('click', function(){
    slideLink.classList.add('sponsored-link_active');
    this.classList.remove('sponsored-link_active');
    closeIcon.classList.add('sponsored-link_active')
})
closeIcon?.addEventListener('click', function(){
    slideLink.classList.remove('sponsored-link_active');
    this.classList.remove('sponsored-link_active');
    activeIcon.classList.add('sponsored-link_active')
})
floatingQuckLinks?.addEventListener('click', function(){
    slideLink.classList.remove('sponsored-link_active');
    activeIcon.classList.add('sponsored-link_active');
    closeIcon.classList.remove('sponsored-link_active')
})




