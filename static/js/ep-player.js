/**
 * ep-player — custom control bar for the new preset family (`ep-*`).
 *
 * Architecture
 * ────────────
 * • initplyr.js detects `options.player_preset.startsWith('ep-')`, mounts
 *   Plyr with `controls: false`, then calls window.epPlayer.mount(...).
 * • This module renders our own DOM control bar inside the wrapper and
 *   binds it to the existing Plyr instance via Plyr's API. Plyr stays the
 *   playback engine; only the UI is ours.
 * • plyr.css is NOT loaded for these wrappers — all visuals come from
 *   static/css/ep-player.css and per-preset overrides keyed off the
 *   wrapper class `ep-preset--<slug>`.
 *
 * Phase 1 scope: selfhosted video only. YouTube/Vimeo adapters wire up
 * here in later phases by translating SDK events to the same controller
 * surface this file already exposes.
 */

(function () {
    'use strict';

    if (typeof window === 'undefined') return;

    const ICONS = {
        play:       '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
        pause:      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>',
        volumeUp:   '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z"/></svg>',
        volumeMute: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.5 12A4.5 4.5 0 0 0 14 8v2.18l2.45 2.45c.03-.21.05-.42.05-.63zM3 9v6h4l5 5V4L7 9H3zm16.73 12L4 5.27 5.27 4 21 19.73z"/></svg>',
        fullscreen: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 14H5v5h5v-2H7zm-2-4h2V7h3V5H5zm12 7h-3v2h5v-5h-2zM14 5v2h3v3h2V5z"/></svg>',
        exitFs:     '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 16h3v3h2v-5H5zm3-8H5v2h5V5H8zm6 11h2v-3h3v-2h-5zm2-11V5h-2v5h5V8z"/></svg>',
    };

    function el(tag, cls, html) {
        const node = document.createElement(tag);
        if (cls) node.className = cls;
        if (html != null) node.innerHTML = html;
        return node;
    }

    function fmtTime(sec) {
        if (!Number.isFinite(sec) || sec < 0) sec = 0;
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const s = Math.floor(sec % 60);
        const mm = (h ? String(m).padStart(2, '0') : String(m));
        const ss = String(s).padStart(2, '0');
        return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
    }

    /**
     * Mount the ep-player UI on a wrapper that already has a Plyr instance.
     * Idempotent — calling twice on the same wrapper is a no-op.
     *
     * @param {HTMLElement} wrapper      The .ep-embed-content-wraper element.
     * @param {Plyr}        plyr         The Plyr instance bound to the inner media.
     * @param {Object}      options      data-options payload from the wrapper.
     */
    function mount(wrapper, plyr, options) {
        if (!wrapper || !plyr || wrapper._epPlayerMounted) return;
        wrapper._epPlayerMounted = true;
        wrapper.classList.add('ep-player');

        // The wrapper class already includes the preset slug (e.g. `ep-halo`)
        // because PHP renderers emit it directly. Add the namespaced class so
        // CSS can target `.ep-preset--ep-halo` without colliding with
        // unrelated `.ep-halo` classes elsewhere on the page.
        const slug = options && options.player_preset ? String(options.player_preset) : '';
        if (slug) wrapper.classList.add('ep-preset--' + slug);

        // Big centered play overlay — visible only while not playing.
        // Adds the cinematic "click anywhere to play" feel that legacy
        // Plyr controls don't quite get to. Hidden by CSS when
        // `.ep-player.is-playing` is set on the wrapper.
        const bigPlay = el('button', 'ep-player__big-play',
            '<span class="ep-player__big-play-ring" aria-hidden="true"></span>' +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>');
        bigPlay.type = 'button';
        bigPlay.setAttribute('aria-label', 'Play video');
        bigPlay.addEventListener('click', () => {
            if (plyr.paused) plyr.play();
        });
        wrapper.appendChild(bigPlay);

        const bar = el('div', 'ep-player__bar');
        const playBtn   = el('button', 'ep-player__btn ep-player__btn--play', ICONS.play);
        playBtn.type = 'button';
        playBtn.setAttribute('aria-label', 'Play');

        const time      = el('span', 'ep-player__time', '<span class="ep-player__cur">0:00</span> / <span class="ep-player__dur">0:00</span>');
        const seek      = el('input', 'ep-player__seek');
        seek.type = 'range'; seek.min = 0; seek.max = 1000; seek.value = 0; seek.step = 1;
        seek.setAttribute('aria-label', 'Seek');

        const muteBtn   = el('button', 'ep-player__btn ep-player__btn--mute', ICONS.volumeUp);
        muteBtn.type = 'button';
        muteBtn.setAttribute('aria-label', 'Mute');

        const vol       = el('input', 'ep-player__vol');
        vol.type = 'range'; vol.min = 0; vol.max = 100; vol.value = 100; vol.step = 1;
        vol.setAttribute('aria-label', 'Volume');

        const fsBtn     = el('button', 'ep-player__btn ep-player__btn--fs', ICONS.fullscreen);
        fsBtn.type = 'button';
        fsBtn.setAttribute('aria-label', 'Fullscreen');

        bar.appendChild(playBtn);
        bar.appendChild(seek);
        bar.appendChild(time);
        bar.appendChild(muteBtn);
        bar.appendChild(vol);
        if (options && options.fullscreen !== false) bar.appendChild(fsBtn);
        wrapper.appendChild(bar);

        // ── Plyr → UI ──────────────────────────────────────────────
        const cur = bar.querySelector('.ep-player__cur');
        const dur = bar.querySelector('.ep-player__dur');

        function paintPlay() {
            const playing = !plyr.paused && !plyr.ended;
            playBtn.innerHTML = playing ? ICONS.pause : ICONS.play;
            playBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
            wrapper.classList.toggle('is-playing', playing);
        }
        function paintTime() {
            const c = plyr.currentTime || 0;
            const d = plyr.duration || 0;
            cur.textContent = fmtTime(c);
            dur.textContent = fmtTime(d);
            if (d > 0 && !seek._dragging) {
                seek.value = String(Math.round((c / d) * 1000));
            }
        }
        function paintVolume() {
            const muted = plyr.muted || plyr.volume === 0;
            muteBtn.innerHTML = muted ? ICONS.volumeMute : ICONS.volumeUp;
            muteBtn.setAttribute('aria-label', muted ? 'Unmute' : 'Mute');
            if (!vol._dragging) vol.value = String(Math.round((plyr.volume || 0) * 100));
        }
        function paintFs() {
            const fs = plyr.fullscreen && plyr.fullscreen.active;
            fsBtn.innerHTML = fs ? ICONS.exitFs : ICONS.fullscreen;
        }

        plyr.on('ready',         () => { paintPlay(); paintTime(); paintVolume(); });
        plyr.on('play',          paintPlay);
        plyr.on('pause',         paintPlay);
        plyr.on('ended',         paintPlay);
        plyr.on('timeupdate',    paintTime);
        plyr.on('loadedmetadata', paintTime);
        plyr.on('volumechange',  paintVolume);
        plyr.on('enterfullscreen', paintFs);
        plyr.on('exitfullscreen',  paintFs);

        // ── UI → Plyr ──────────────────────────────────────────────
        playBtn.addEventListener('click', () => {
            if (plyr.paused) plyr.play(); else plyr.pause();
        });
        muteBtn.addEventListener('click', () => { plyr.muted = !plyr.muted; });
        fsBtn.addEventListener('click',   () => { plyr.fullscreen.toggle(); });

        seek.addEventListener('input',   () => {
            seek._dragging = true;
            const d = plyr.duration || 0;
            if (d > 0) plyr.currentTime = (parseInt(seek.value, 10) / 1000) * d;
        });
        seek.addEventListener('change',  () => { seek._dragging = false; });
        vol.addEventListener('input',    () => {
            vol._dragging = true;
            plyr.volume = parseInt(vol.value, 10) / 100;
            if (plyr.muted && plyr.volume > 0) plyr.muted = false;
        });
        vol.addEventListener('change',   () => { vol._dragging = false; });

        // First paint in case the player is already past `ready`.
        paintPlay(); paintTime(); paintVolume(); paintFs();
    }

    window.epPlayer = { mount: mount };
})();
