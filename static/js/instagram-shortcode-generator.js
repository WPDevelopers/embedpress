(function() {
    var overlay = document.querySelector('.ep-ig-sc-modal-overlay');
    if (!overlay) return;

    var $ = function(id) {
        return document.getElementById(id);
    };

    var accountEl = $('ep-ig-sc-account');
    var feedEl = $('ep-ig-sc-feedtype');
    var hashtagRow = overlay.querySelector('.ep-ig-sc-hashtag-row');
    var hashtagEl = $('ep-ig-sc-hashtag');
    var layoutEl = $('ep-ig-sc-layout');
    var colsEl = $('ep-ig-sc-cols');
    var gapEl = $('ep-ig-sc-gap');
    var pcountEl = $('ep-ig-sc-pcount');
    var widthEl = $('ep-ig-sc-width');
    var slidesShowEl = $('ep-ig-sc-slides-show');
    var carouselSpacingEl = $('ep-ig-sc-carousel-spacing');
    var carouselArrowsEl = $('ep-ig-sc-carousel-arrows');
    var carouselAutoplayEl = $('ep-ig-sc-carousel-autoplay');
    var carouselLoopEl = $('ep-ig-sc-carousel-loop');
    var carouselRows = overlay.querySelectorAll('.ep-ig-sc-carousel-row');
    var output = $('ep-ig-sc-output');
    var copyBtn = $('ep-ig-sc-copy');
    var copyMsg = $('ep-ig-sc-copy-msg');
    var closeBtn = overlay.querySelector('.ep-ig-sc-close');

    var bools = {
        'ep-ig-sc-profile': 'instafeedProfileImage',
        'ep-ig-sc-accname': 'instafeedAccName',
        'ep-ig-sc-followbtn': 'instafeedFollowBtn',
        'ep-ig-sc-followers': 'instafeedFollowersCount',
        'ep-ig-sc-posts-count': 'instafeedPostsCount',
        'ep-ig-sc-loadmore': 'instafeedLoadmore',
        'ep-ig-sc-likes': 'instafeedLikesCount',
        'ep-ig-sc-comments': 'instafeedCommentsCount',
        'ep-ig-sc-popup': 'instafeedPopup',
        'ep-ig-sc-popup-followbtn': 'instafeedPopupFollowBtn'
    };
    var texts = {
        'ep-ig-sc-followbtn-label': {
            attr: 'instafeedFollowBtnLabel',
            def: 'Follow'
        },
        'ep-ig-sc-followers-text': {
            attr: 'instafeedFollowersCountText',
            def: '{count} Followers'
        },
        'ep-ig-sc-posts-text': {
            attr: 'instafeedPostsCountText',
            def: '{count} Posts'
        },
        'ep-ig-sc-loadmore-label': {
            attr: 'instafeedLoadmoreLabel',
            def: 'Load More'
        },
        'ep-ig-sc-popup-followbtn-label': {
            attr: 'instafeedPopupFollowBtnLabel',
            def: 'Follow'
        }
    };

    // WordPress' shortcode parser breaks on `[` `]` inside attr values. We use
    // `{count}` as the placeholder in shortcodes; the InstagramFeed template
    // accepts both `[count]` and `{count}`.
    function safeAttrValue(v) {
        return v.replace(/\[/g, '{').replace(/\]/g, '}').replace(/"/g, '&quot;');
    }

    function gen() {
        if (!accountEl || !accountEl.value) {
            output.value = '';
            return;
        }
        var username = accountEl.value;
        var feedType = feedEl.value;
        var url, attrs = [];

        if (feedType === 'hashtag_type') {
            hashtagRow.style.display = '';
            var tag = (hashtagEl.value || '').trim().replace(/^#/, '');
            url = tag ? ('https://instagram.com/explore/tags/' + encodeURIComponent(tag)) : ('https://instagram.com/' + username);
            attrs.push('instafeedFeedType="hashtag_type"');
            if (tag) attrs.push('instafeedHashtag="' + tag + '"');
        } else {
            hashtagRow.style.display = 'none';
            url = 'https://instagram.com/' + username;
            attrs.push('instafeedFeedType="user_account_type"');
        }

        var layout = layoutEl.value;
        attrs.push('instaLayout="' + layout + '"');
        attrs.push('instafeedColumns="' + (parseInt(colsEl.value, 10) || 3) + '"');
        attrs.push('instafeedColumnsGap="' + (parseInt(gapEl.value, 10) || 0) + '"');
        attrs.push('instafeedPostsPerPage="' + (parseInt(pcountEl.value, 10) || 6) + '"');

        if (carouselRows && carouselRows.length) {
            carouselRows.forEach(function(r) { r.style.display = (layout === 'insta-carousel') ? '' : 'none'; });
        }
        if (layout === 'insta-carousel') {
            if (slidesShowEl) attrs.push('slidesShow="' + (parseInt(slidesShowEl.value, 10) || 3) + '"');
            if (carouselSpacingEl) attrs.push('carouselSpacing="' + (parseInt(carouselSpacingEl.value, 10) || 0) + '"');
            if (carouselArrowsEl) attrs.push('carouselArrows="' + (carouselArrowsEl.checked ? 'true' : 'false') + '"');
            if (carouselAutoplayEl) attrs.push('carouselAutoplay="' + (carouselAutoplayEl.checked ? 'true' : 'false') + '"');
            if (carouselLoopEl) attrs.push('carouselLoop="' + (carouselLoopEl.checked ? 'true' : 'false') + '"');
        }

        Object.keys(bools).forEach(function(id) {
            var el = $(id);
            if (el) attrs.push(bools[id] + '="' + (el.checked ? 'true' : 'false') + '"');
        });

        Object.keys(texts).forEach(function(id) {
            var el = $(id);
            var cfg = texts[id];
            var val = (el && el.value && el.value.trim() !== '') ? el.value : cfg.def;
            attrs.push(cfg.attr + '="' + safeAttrValue(val) + '"');
        });

        if (widthEl.value) attrs.push('width="' + (parseInt(widthEl.value, 10) || '') + '"');

        output.value = '[embedpress ' + attrs.join(' ') + ']' + url + '[/embedpress]';
    }

    overlay.querySelectorAll('input, select').forEach(function(el) {
        el.addEventListener('input', gen);
        el.addEventListener('change', gen);
    });

    function openModal(prefillUsername) {
        if (prefillUsername && accountEl) {
            for (var i = 0; i < accountEl.options.length; i++) {
                if (accountEl.options[i].value === prefillUsername) {
                    accountEl.selectedIndex = i;
                    break;
                }
            }
        }
        gen();
        overlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        overlay.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    document.addEventListener('click', function(e) {
        var trigger = e.target.closest('.ep-ig-sc-trigger');
        if (trigger) {
            e.preventDefault();
            openModal(trigger.getAttribute('data-username') || '');
        }
    });

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeModal();
    });

    copyBtn.addEventListener('click', function(e) {
        e.preventDefault();
        output.select();
        var done = function() {
            copyMsg.classList.add('is-visible');
            setTimeout(function() {
                copyMsg.classList.remove('is-visible');
            }, 1500);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(output.value).then(done, function() {
                try {
                    document.execCommand('copy');
                    done();
                } catch (err) {}
            });
        } else {
            try {
                document.execCommand('copy');
                done();
            } catch (err) {}
        }
    });
})();
