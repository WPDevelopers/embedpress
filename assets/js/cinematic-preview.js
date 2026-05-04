/**
 * EmbedPress — Cinematic Preview Overlay
 *
 * Reads `cinematic_preview` from a wrapper's data-options and renders a
 * Netflix/Prime/Disney+/Apple TV+ style hero over the player. On Play
 * click the overlay fades out and Plyr.play() is called on the
 * already-initialized player instance (looked up from window.playerInit).
 *
 * Initialized after Plyr by initplyr.js — see initPlayer() at the end of
 * that file.
 */
(function () {
    'use strict';

    var SVG_PLAY = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
    var SVG_INFO = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 15h-2v-6h2zm0-8h-2V7h2z"/></svg>';

    function escapeHtml(str) {
        if (str == null) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // Pull a YouTube video ID from any of the URL shapes EmbedPress emits.
    function extractYouTubeId(src) {
        if (!src) return null;
        var m = src.match(/youtube(?:-nocookie)?\.com\/embed\/([a-zA-Z0-9_-]{11})/)
            || src.match(/youtube\.com\/watch\?[^"]*v=([a-zA-Z0-9_-]{11})/)
            || src.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
        return m ? m[1] : null;
    }

    // Resolve the cinematic preview's hero background poster, in priority:
    //   1. cinematic_preview.poster — dedicated Cinematic Thumbnail
    //   2. options.poster_thumbnail — Custom Player Thumbnail (Plyr poster)
    //   3. iframe data-poster — Plyr-set poster
    //   4. .plyr__poster computed background-image
    //   5. YouTube auto-thumbnail derived from iframe src (no Plyr / decoupled)
    function resolvePoster(wrapper, options) {
        var cp = options && options.cinematic_preview;
        if (cp && cp.poster) return cp.poster;
        if (options && options.poster_thumbnail) return options.poster_thumbnail;
        var el = wrapper.querySelector('iframe[data-poster], video[poster], video[data-poster]');
        if (el) {
            var p = el.getAttribute('data-poster') || el.getAttribute('poster');
            if (p) return p;
        }
        var plyrPoster = wrapper.querySelector('.plyr__poster');
        if (plyrPoster) {
            var bg = plyrPoster.style.backgroundImage || window.getComputedStyle(plyrPoster).backgroundImage;
            if (bg && bg !== 'none') {
                var m = bg.match(/url\(["']?([^"')]+)["']?\)/);
                if (m && m[1]) return m[1];
            }
        }
        // Final fallback: when there's no Plyr (decoupled cinematic preview),
        // build the YouTube thumbnail URL straight from the iframe src.
        var iframe = wrapper.querySelector('iframe');
        if (iframe && iframe.src) {
            var ytId = extractYouTubeId(iframe.src);
            if (ytId) return 'https://i.ytimg.com/vi/' + ytId + '/maxresdefault.jpg';
        }
        return '';
    }

    // Pull the video's actual title from the rendered iframe / video element.
    // YouTube + Vimeo set `iframe.title` to the real video title; <video>
    // exposes title/aria-label or we fall back to the filename.
    function resolveVideoTitle(wrapper) {
        var iframe = wrapper.querySelector('iframe');
        if (iframe && iframe.title && !/^(youtube|vimeo|video player|embedded video)$/i.test(iframe.title.trim())) {
            return iframe.title.trim();
        }
        var video = wrapper.querySelector('video');
        if (video) {
            var t = video.getAttribute('aria-label') || video.getAttribute('title');
            if (t) return t.trim();
            var src = video.currentSrc || video.getAttribute('src') || '';
            if (src) {
                var name = src.split('/').pop().split('?')[0].replace(/\.[a-z0-9]+$/i, '').replace(/[-_]+/g, ' ');
                if (name) {
                    try { return decodeURIComponent(name); } catch (e) { return name; }
                }
            }
        }
        return '';
    }

    function applyStyleOverrides(overlay, so) {
        if (!so) return;
        // Overlay tint: apply directly on .ep-cp-overlay so it stacks over the
        // preset's gradient instead of replacing it.
        if (so.overlay_color || so.overlay_opacity) {
            // We need to wait until the overlay element exists; called again
            // post-innerHTML below. Stash on the wrapper for that.
            overlay._epOverlayTint = {
                color: so.overlay_color || '',
                opacity: (so.overlay_opacity > 0) ? (so.overlay_opacity / 100) : null
            };
        }
        // Map override → CSS custom property. CSS reads --ep-cp-* with sensible
        // fallbacks so any unset value keeps the preset's defaults.
        var pairs = [
            ['--ep-cp-title-color', so.title_color],
            ['--ep-cp-title-font-size', so.title_font_size ? so.title_font_size + 'px' : ''],
            ['--ep-cp-title-font-weight', so.title_font_weight],
            ['--ep-cp-title-font-family', so.title_font_family],
            ['--ep-cp-synopsis-color', so.synopsis_color],
            ['--ep-cp-synopsis-font-size', so.synopsis_font_size ? so.synopsis_font_size + 'px' : ''],
            ['--ep-cp-badge-bg', so.badge_bg],
            ['--ep-cp-badge-color', so.badge_color],
            ['--ep-cp-play-bg', so.play_bg],
            ['--ep-cp-play-color', so.play_color],
            ['--ep-cp-info-bg', so.info_bg],
            ['--ep-cp-info-color', so.info_color],
            ['--ep-cp-overlay-color', so.overlay_color],
            ['--ep-cp-overlay-opacity', (so.overlay_opacity > 0) ? (so.overlay_opacity / 100) : '']
        ];
        pairs.forEach(function (p) {
            if (p[1] !== '' && p[1] != null) {
                overlay.style.setProperty(p[0], String(p[1]));
            }
        });
    }

    function buildOverlay(cp, posterUrl, wrapper) {
        var style = cp.style || 'netflix-hero';
        var overlay = document.createElement('div');
        overlay.className = 'ep-cinematic-preview' + (cp.logo ? ' ep-cp-has-logo' : '');
        overlay.setAttribute('data-style', style);
        if (posterUrl) {
            overlay.style.backgroundImage = 'url(' + JSON.stringify(posterUrl).slice(1, -1) + ')';
        }
        applyStyleOverrides(overlay, cp.style_overrides);

        // Authored values win; otherwise auto-fill the title from the actual
        // video and leave optional fields empty (no fake placeholders).
        var title = cp.title || resolveVideoTitle(wrapper) || '';
        var synopsis = cp.synopsis || '';
        var badgeRaw = cp.badge || '';
        var meta = cp.meta || '';

        var badgesHtml = '';
        var parts = String(badgeRaw).split(',').map(function (s) { return s.trim(); }).filter(Boolean);
        if (parts.length) {
            badgesHtml = '<div class="ep-cp-badges">' +
                parts.map(function (p) { return '<span>' + escapeHtml(p) + '</span>'; }).join('') +
                '</div>';
        }

        var titleBlock = '';
        if (style === 'logo-as-title' && cp.logo) {
            titleBlock = '<img class="ep-cp-logo" src="' + escapeHtml(cp.logo) + '" alt="' + escapeHtml(title) + '" />';
        } else {
            if (cp.logo) {
                titleBlock += '<img class="ep-cp-logo" src="' + escapeHtml(cp.logo) + '" alt="" />';
            }
            if (title) {
                titleBlock += '<h2 class="ep-cp-title">' + escapeHtml(title) + '</h2>';
            }
        }

        var metaHtml = meta ? '<div class="ep-cp-meta"><span>' + escapeHtml(meta) + '</span></div>' : '';
        var synopsisHtml = synopsis ? '<p class="ep-cp-synopsis">' + escapeHtml(synopsis) + '</p>' : '';

        var actions = '<div class="ep-cp-actions">' +
            '<button type="button" class="ep-cp-btn ep-cp-btn-play">' + SVG_PLAY + '<span>Play</span></button>' +
            (synopsis ? '<button type="button" class="ep-cp-btn ep-cp-btn-info">' + SVG_INFO + '<span>More Info</span></button>' : '') +
            '</div>';

        overlay.innerHTML =
            '<div class="ep-cp-overlay"></div>' +
            '<div class="ep-cp-content">' +
            badgesHtml +
            titleBlock +
            metaHtml +
            synopsisHtml +
            actions +
            '</div>';

        // Now that the .ep-cp-overlay node exists, apply the stashed tint.
        if (overlay._epOverlayTint) {
            var tint = overlay._epOverlayTint;
            var overlayEl = overlay.querySelector('.ep-cp-overlay');
            if (overlayEl) {
                if (tint.color) overlayEl.style.backgroundColor = tint.color;
                if (tint.opacity != null) overlayEl.style.opacity = String(tint.opacity);
            }
            delete overlay._epOverlayTint;
        }

        return overlay;
    }

    function attachOverlay(wrapper, options) {
        if (!options || !options.cinematic_preview) return;
        if (wrapper.querySelector(':scope > .ep-cinematic-preview')) return; // already attached

        var cp = options.cinematic_preview;
        var poster = resolvePoster(wrapper, options);
        var overlay = buildOverlay(cp, poster, wrapper);

        // Title may not be available yet (e.g. YouTube iframe `title` is set
        // after the iframe loads). Poll briefly and update the title node.
        if (!cp.title) {
            var titleEl = overlay.querySelector('.ep-cp-title');
            var tTries = 0;
            var titleIv = setInterval(function () {
                tTries++;
                var t = resolveVideoTitle(wrapper);
                if (t) {
                    if (!titleEl) {
                        // Title block didn't render originally — inject now.
                        var content = overlay.querySelector('.ep-cp-content');
                        if (content) {
                            var h = document.createElement('h2');
                            h.className = 'ep-cp-title';
                            h.textContent = t;
                            // Insert after badges (or at top if no badges)
                            var badges = content.querySelector('.ep-cp-badges');
                            if (badges && badges.nextSibling) {
                                content.insertBefore(h, badges.nextSibling);
                            } else if (badges) {
                                content.appendChild(h);
                            } else {
                                content.insertBefore(h, content.firstChild);
                            }
                        }
                    } else {
                        titleEl.textContent = t;
                    }
                    clearInterval(titleIv);
                } else if (tTries > 30) {
                    clearInterval(titleIv);
                }
            }, 200);
        }

        // If we couldn't resolve a poster yet (e.g. YouTube provider thumbnail
        // hasn't been fetched by Plyr), poll briefly and update the
        // background once it lands.
        if (!poster) {
            var tries = 0;
            var iv = setInterval(function () {
                tries++;
                var p = resolvePoster(wrapper, options);
                if (p) {
                    overlay.style.backgroundImage = 'url(' + JSON.stringify(p).slice(1, -1) + ')';
                    clearInterval(iv);
                } else if (tries > 30) {
                    clearInterval(iv);
                }
            }, 200);
        }

        // Wrapper must establish positioning context. .ep-embed-content-wraper
        // already has `position: relative` from save.js inline style; if not,
        // force it.
        var computed = window.getComputedStyle(wrapper);
        if (computed.position === 'static') {
            wrapper.style.position = 'relative';
        }

        wrapper.classList.add('ep-cp-active');
        wrapper.appendChild(overlay);

        var playBtn = overlay.querySelector('.ep-cp-btn-play');
        var infoBtn = overlay.querySelector('.ep-cp-btn-info');

        var startPlayback = function () {
            // Path A: Plyr is running — ask it to play.
            var playerId = wrapper.getAttribute('data-playerid');
            var player = playerId && window.playerInit ? window.playerInit[playerId] : null;
            if (player && typeof player.play === 'function') {
                try {
                    var ret = player.play();
                    if (ret && typeof ret.catch === 'function') {
                        ret.catch(function () { clickNativePlay(wrapper); });
                    }
                    return;
                } catch (e) { /* fall through */ }
            }
            // Path B: no Plyr instance — try clicking native overlaid control.
            var nativeBtn = wrapper.querySelector('.plyr__control--overlaid')
                || wrapper.querySelector('.plyr__control[data-plyr="play"]');
            if (nativeBtn) { nativeBtn.click(); return; }
            // Path C: bare provider iframe — swap its src to autoplay=1.
            var iframe = wrapper.querySelector('iframe');
            if (iframe && iframe.src) {
                iframe.src = buildAutoplaySrc(iframe.src);
                return;
            }
            // Path D: self-hosted <video> — call .play() directly.
            var video = wrapper.querySelector('video');
            if (video && video.paused) {
                try { video.play(); } catch (e) { /* ignore */ }
            }
        };

        var hideOverlay = function () {
            wrapper.classList.remove('ep-cp-active');
            overlay.classList.add('ep-cp-hidden');
        };

        var showOverlay = function () {
            // Re-show the overlay (e.g. on pause). Keep the overlay element
            // attached to the DOM so we can flip its visibility cheaply.
            wrapper.classList.add('ep-cp-active');
            overlay.classList.remove('ep-cp-hidden');
        };

        var dismiss = function () {
            // Inline mode: hide overlay, hand control to the underlying
            // player. The Plyr `pause` listener will bring the overlay back.
            hideOverlay();
            startPlayback();
        };

        var buildAutoplaySrc = function (rawSrc) {
            if (!rawSrc) return '';
            // Force autoplay=1 + mute=1, overwriting existing values that
            // Plyr/EmbedPress may have set to 0 for the inline player.
            // Strip `controls=0` (Plyr's hidden-controls flag) and ensure
            // enablejsapi=1 so postMessage state listeners can attach.
            var s = rawSrc
                .replace(/([?&])autoplay=[^&]*/i, '$1autoplay=1')
                .replace(/([?&])(?:mute|muted)=[^&]*/i, '$1mute=1')
                .replace(/([?&])controls=[^&]*/i, '$1controls=1');
            if (!/[?&]autoplay=/i.test(s)) s += (s.indexOf('?') > -1 ? '&' : '?') + 'autoplay=1';
            if (!/[?&](?:mute|muted)=/i.test(s)) s += '&mute=1';
            if (!/[?&]controls=/i.test(s)) s += '&controls=1';
            if (!/[?&]enablejsapi=/i.test(s)) s += '&enablejsapi=1';
            return s;
        };

        var buildLightboxPlayer = function () {
            // Build a fresh player element for the lightbox. We deliberately
            // don't move the original wrapper — moving an iframe DOM node
            // unloads its content (YouTube/Vimeo player state is lost).
            var iframe = wrapper.querySelector('iframe');
            var video = wrapper.querySelector('video');
            if (iframe && iframe.src) {
                var fresh = document.createElement('iframe');
                fresh.src = buildAutoplaySrc(iframe.src);
                fresh.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
                fresh.allowFullscreen = true;
                fresh.frameBorder = '0';
                fresh.style.cssText = 'width:100%;height:100%;border:0;';
                return fresh;
            }
            if (video) {
                var src = video.currentSrc || video.getAttribute('src');
                if (!src) {
                    var srcEl = video.querySelector('source');
                    if (srcEl) src = srcEl.getAttribute('src');
                }
                var freshVid = document.createElement('video');
                freshVid.src = src || '';
                freshVid.controls = true;
                freshVid.autoplay = true;
                freshVid.style.cssText = 'width:100%;height:100%;background:#000;';
                return freshVid;
            }
            return null;
        };

        var openLightbox = function () {
            if (document.querySelector('.ep-cp-lightbox')) return;
            var fresh = buildLightboxPlayer();
            if (!fresh) {
                // No iframe/video found — fall back to inline play.
                dismiss();
                return;
            }

            var lightbox = document.createElement('div');
            lightbox.className = 'ep-cp-lightbox';
            lightbox.innerHTML =
                '<button type="button" class="ep-cp-lightbox-close" aria-label="Close">' +
                '<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M19 6.4 17.6 5 12 10.6 6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12z"/></svg>' +
                '</button>' +
                '<div class="ep-cp-lightbox-content"><div class="ep-cp-lightbox-frame"></div></div>';
            lightbox.querySelector('.ep-cp-lightbox-frame').appendChild(fresh);
            document.body.appendChild(lightbox);
            document.body.classList.add('ep-cp-lightbox-open');

            var close = function () {
                document.body.classList.remove('ep-cp-lightbox-open');
                if (lightbox.parentNode) lightbox.parentNode.removeChild(lightbox);
                document.removeEventListener('keydown', escHandler);
                // The original wrapper never moved — the overlay is still
                // sitting on top of the (untouched) inline player.
            };
            var escHandler = function (e) { if (e.key === 'Escape') close(); };

            lightbox.querySelector('.ep-cp-lightbox-close').addEventListener('click', close);
            lightbox.addEventListener('click', function (e) { if (e.target === lightbox) close(); });
            document.addEventListener('keydown', escHandler);
        };

        if (playBtn) {
            playBtn.addEventListener('click', function () {
                if (cp.play_mode === 'lightbox') openLightbox();
                else dismiss();
            });
        }

        if (infoBtn) {
            infoBtn.addEventListener('click', function () {
                overlay.classList.toggle('ep-cp-info-open');
            });
        }

        var inLightbox = function () {
            return document.body.classList.contains('ep-cp-lightbox-open');
        };

        // Re-show the preview when the user pauses playback. Two paths:
        //   A. Plyr instance available — bind to its `pause` / `ended` events.
        //   B. No Plyr (decoupled cinematic preview) — bind to the iframe
        //      (YT IFrame API postMessage) or <video> native pause.
        // Short-circuit when the wrapper has no `data-playerid` at all —
        // Plyr will never be running for this embed, so go straight to
        // the non-Plyr listeners instead of polling for 5 seconds.
        if (!wrapper.getAttribute('data-playerid')) {
            bindNonPlyrListeners();
        }
        var bindTries = 0;
        var bindIv = setInterval(function () {
            bindTries++;
            var playerId = wrapper.getAttribute('data-playerid');
            var player = playerId && window.playerInit ? window.playerInit[playerId] : null;
            if (player && typeof player.on === 'function') {
                player.on('pause', function () {
                    if (inLightbox()) return;
                    if (overlay.parentNode) showOverlay();
                });
                player.on('ended', function () {
                    if (inLightbox()) return;
                    if (overlay.parentNode) showOverlay();
                });
                player.on('playing', function () {
                    if (inLightbox()) return;
                    hideOverlay();
                });
                clearInterval(bindIv);
            } else if (bindTries > 20) {
                // Plyr never showed up — wire decoupled-mode listeners.
                clearInterval(bindIv);
                bindNonPlyrListeners();
            }
        }, 100);

        function bindNonPlyrListeners() {
            // Self-hosted <video>: native pause/ended events.
            var video = wrapper.querySelector('video');
            if (video) {
                video.addEventListener('pause', function () {
                    if (inLightbox()) return;
                    if (!video.ended && video.currentTime > 0 && overlay.parentNode) showOverlay();
                });
                video.addEventListener('ended', function () {
                    if (inLightbox()) return;
                    if (overlay.parentNode) showOverlay();
                });
                video.addEventListener('playing', function () {
                    if (inLightbox()) return;
                    hideOverlay();
                });
                return;
            }
            // YouTube iframe: register for state-change messages over postMessage.
            var iframe = wrapper.querySelector('iframe');
            if (!iframe) return;
            // Subscribe once a brief delay after Play is clicked. The
            // Play handler is what swaps src to autoplay; we reach this
            // once on attach AND on subsequent plays.
            var subscribeYT = function () {
                if (!iframe.contentWindow) return;
                try {
                    iframe.contentWindow.postMessage(JSON.stringify({
                        event: 'listening',
                        id: 1
                    }), '*');
                    iframe.contentWindow.postMessage(JSON.stringify({
                        event: 'command',
                        func: 'addEventListener',
                        args: ['onStateChange']
                    }), '*');
                } catch (e) { /* origin or iframe not loaded yet */ }
            };
            // Re-subscribe whenever iframe src changes (Play swaps it).
            new MutationObserver(function () {
                setTimeout(subscribeYT, 800);
            }).observe(iframe, { attributes: true, attributeFilter: ['src'] });
            // Initial subscribe (in case it was already set).
            setTimeout(subscribeYT, 800);

            window.addEventListener('message', function (e) {
                if (e.source !== iframe.contentWindow) return;
                if (typeof e.data !== 'string') return;
                var msg;
                try { msg = JSON.parse(e.data); } catch (err) { return; }
                if (!msg) return;
                // YT API: {event: 'onStateChange', info: <state>}
                // states — -1 unstarted, 0 ended, 1 playing, 2 paused,
                // 3 buffering, 5 cued
                var state = null;
                if (msg.event === 'onStateChange') state = msg.info;
                else if (msg.event === 'infoDelivery' && msg.info && typeof msg.info.playerState === 'number') state = msg.info.playerState;
                if (state === null) return;
                if (state === 1) { // playing
                    if (!inLightbox()) hideOverlay();
                } else if (state === 2 || state === 0) { // paused / ended
                    if (!inLightbox() && overlay.parentNode) showOverlay();
                }
            });
        }
    }

    function clickNativePlay(wrapper) {
        var btn = wrapper.querySelector('.plyr__control--overlaid')
            || wrapper.querySelector('.plyr__control[data-plyr="play"]');
        if (btn) { btn.click(); return; }
        var video = wrapper.querySelector('video');
        if (video && video.paused) {
            try { video.play(); } catch (e) { /* ignore */ }
        }
    }

    // Self-bootstrap: scan for wrappers with cinematic_preview in data-options
    // and attach overlays. Runs whether or not initplyr.js calls us, so this
    // works regardless of script load order.
    function scanAndAttach(root) {
        var scope = root && root.querySelectorAll ? root : document;
        var wrappers = scope.querySelectorAll ? scope.querySelectorAll('.ep-embed-content-wraper') : [];
        wrappers.forEach(function (wrapper) {
            if (wrapper.dataset.cpInit === '1') return;
            var raw = wrapper.getAttribute('data-options');
            if (!raw) return;
            var opts;
            try { opts = JSON.parse(raw); } catch (e) { return; }
            if (!opts || !opts.cinematic_preview) return;
            wrapper.dataset.cpInit = '1';
            attachOverlay(wrapper, opts);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { scanAndAttach(); });
    } else {
        scanAndAttach();
    }

    // MutationObserver so blocks rendered late (Elementor edit preview,
    // dynamic loaders) still pick up the overlay.
    if (typeof MutationObserver !== 'undefined') {
        new MutationObserver(function (mutations) {
            mutations.forEach(function (m) {
                m.addedNodes && m.addedNodes.forEach(function (n) {
                    if (n.nodeType === 1) scanAndAttach(n);
                });
            });
        }).observe(document.documentElement, { childList: true, subtree: true });
    }

    // Public API still exposed so initplyr.js can call attach if it wants
    // (now redundant but harmless — attachOverlay is idempotent via cpInit).
    window.EPCinematicPreview = {
        attach: function (wrapper, options) {
            if (wrapper.dataset.cpInit === '1') return;
            wrapper.dataset.cpInit = '1';
            attachOverlay(wrapper, options);
        }
    };
})();
