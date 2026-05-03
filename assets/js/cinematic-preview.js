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

    function buildOverlay(cp, posterUrl) {
        var style = cp.style || 'netflix-hero';
        var overlay = document.createElement('div');
        overlay.className = 'ep-cinematic-preview';
        overlay.setAttribute('data-style', style);
        if (posterUrl) {
            overlay.style.backgroundImage = 'url(' + JSON.stringify(posterUrl).slice(1, -1) + ')';
        }

        var badgesHtml = '';
        if (cp.badge) {
            // support comma-separated badges
            var parts = String(cp.badge).split(',').map(function (s) { return s.trim(); }).filter(Boolean);
            badgesHtml = '<div class="ep-cp-badges">' +
                parts.map(function (p) { return '<span>' + escapeHtml(p) + '</span>'; }).join('') +
                '</div>';
        }

        var titleBlock = '';
        if (style === 'logo-as-title' && cp.logo) {
            titleBlock = '<img class="ep-cp-logo" src="' + escapeHtml(cp.logo) + '" alt="' + escapeHtml(cp.title || '') + '" />';
        } else {
            if (cp.logo) {
                titleBlock += '<img class="ep-cp-logo" src="' + escapeHtml(cp.logo) + '" alt="" />';
            }
            if (cp.title) {
                titleBlock += '<h2 class="ep-cp-title">' + escapeHtml(cp.title) + '</h2>';
            }
        }

        var meta = cp.meta ? '<div class="ep-cp-meta"><span>' + escapeHtml(cp.meta) + '</span></div>' : '';
        var synopsis = cp.synopsis ? '<p class="ep-cp-synopsis">' + escapeHtml(cp.synopsis) + '</p>' : '';

        var actions = '<div class="ep-cp-actions">' +
            '<button type="button" class="ep-cp-btn ep-cp-btn-play">' + SVG_PLAY + '<span>Play</span></button>' +
            (cp.synopsis ? '<button type="button" class="ep-cp-btn ep-cp-btn-info">' + SVG_INFO + '<span>More Info</span></button>' : '') +
            '</div>';

        overlay.innerHTML =
            '<div class="ep-cp-overlay"></div>' +
            '<div class="ep-cp-content">' +
            badgesHtml +
            titleBlock +
            meta +
            synopsis +
            actions +
            '</div>';

        return overlay;
    }

    function attachOverlay(wrapper, options) {
        if (!options || !options.cinematic_preview) return;
        if (wrapper.querySelector(':scope > .ep-cinematic-preview')) return; // already attached

        var cp = options.cinematic_preview;
        var poster = options.poster_thumbnail || '';
        var overlay = buildOverlay(cp, poster);

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

        var dismiss = function () {
            overlay.classList.add('ep-cp-hidden');
            wrapper.classList.remove('ep-cp-active');
            var playerId = wrapper.getAttribute('data-playerid');
            var player = playerId && window.playerInit ? window.playerInit[playerId] : null;
            if (player && typeof player.play === 'function') {
                try { player.play(); } catch (e) { /* user-gesture failed; user can still click native control */ }
            }
            // Remove from DOM after the fade so it's truly gone.
            setTimeout(function () {
                if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
            }, 400);
        };

        if (playBtn) playBtn.addEventListener('click', dismiss);

        if (infoBtn) {
            infoBtn.addEventListener('click', function () {
                // Toggle a class that CSS uses to expand synopsis / show details.
                overlay.classList.toggle('ep-cp-info-open');
            });
        }
    }

    // Public API consumed by initplyr.js
    window.EPCinematicPreview = {
        attach: attachOverlay
    };
})();
