---
order: 1
---

# Custom Video Player

Plyr-based branded player layered over YouTube, Vimeo, Wistia, Twitch, Dailymotion, and self-hosted MP4/MP3 sources. Free + Pro split: control toggles, presets, theming, autoplay, volume, playback speed, loop, restart/rewind/fast-forward live in **free**. Pro layers on advanced theming and 12 engagement / delivery sub-features.

## Independent of Cinematic Preview

The Custom Player and the [Cinematic Preview](../../../embedpress-pro/docs/features/cinematic-preview.md) overlay share the same `.ep-embed-content-wraper` element and the same `data-options` JSON envelope, but they are independent. A wrapper can have:

- only Cinematic Preview (overlay → bare iframe)
- only Custom Player (Plyr controls, no overlay)
- both (overlay → Plyr)
- neither (raw embed)

## Supported sources

| Source | Player |
|---|---|
| YouTube | Plyr (YouTube provider) |
| Vimeo | Plyr (Vimeo provider) |
| Wistia | Plyr (HTML5 + Wistia API) |
| Twitch | Plyr |
| Dailymotion | Plyr |
| Self-hosted MP4 / WebM | Plyr (HTML5) |
| Self-hosted MP3 / OGG | Plyr (HTML5 audio) |
| HLS (`.m3u8`) | Plyr + hls.js |
| DASH (`.mpd`) | Plyr + dash.js |

The "is this self-hosted video?" decision is made by **five regex copies** in PHP and JS — when extending self-hosted format support (e.g., adding `.av1`), all five must be updated. Plyr is vendored at `assets/js/vendor/plyr.js`.

## Architecture

```
            Editor settings surfaces
            ┌──────────────────────────────────────┐
            │  Gutenberg InspectorControls         │
            │  Elementor panel                     │
            │  Shortcode attributes                │
            └────────────────┬─────────────────────┘
                             │ block attributes / widget settings
                             ▼
              ┌──────────────────────────────────┐
              │  Renderer emits                  │
              │  .ep-embed-content-wraper        │
              │  carrying data-options="{JSON}"  │
              │  + data-playerid                 │
              └──────────────────┬───────────────┘
                                 ▼
              ┌──────────────────────────────────┐
              │  Frontend initplyr.js            │
              │  - DOMContentLoaded scan         │
              │  - MutationObserver pickup       │
              │  - Builds controls[] array       │
              │  - new Plyr(selector, opts)      │
              │  - epSafeInit() per Pro feature  │
              │  - PiP icon injection            │
              │  - iOS YT fullscreen fallback    │
              │  - Poster fade-in                │
              └──────────────────────────────────┘
                                 ▼
                     Pro REST endpoints +
                     per-feature classes (Pro)
```

The single contract: every renderer must produce a `.ep-embed-content-wraper` carrying a unique `data-playerid` and a JSON `data-options`. `initplyr.js` is the only consumer — it does not care which renderer produced the markup.

## Data contract — `data-options` JSON

Built by `EmbedPressBlockRenderer::build_player_options` (~line 919) and by the Elementor / shortcode equivalents. The free fields:

```js
{
    customPlayer: bool,           // master enable
    autoplay: bool,
    volume: number,               // 0–1
    playbackSpeed: number,        // 0.5–2
    posterThumbnail: string,      // URL
    playerColor: string,          // → --plyr-color-main
    playerPreset: string,         // 'default' | 'preset-1' | 'preset-3'
    playerTooltip: bool,
    playerHideControls: bool,
    playerLoop: bool,
    playerRestart: bool,
    playerRewind: bool,
    playerFastForward: bool,
    playerPip: bool,              // non-YouTube
    playerDownload: bool,
    fullscreen: bool|value,
    start: timestamp,
    end: timestamp,
    rel: bool,                    // YouTube related-videos
    mute: bool,
    t: timestamp,                 // Vimeo
    vautoplay: bool,
    autopause: bool,
    dnt: bool,                    // Vimeo do-not-track
    self_hosted: bool,
    hosted_format: string,        // mp4 | webm | audio | hls | dash
    show: {                       // per-control visibility
        progress, current_time, duration, mute, volume, captions,
        fullscreen, pip, settings, playback_speed, restart, seek, loop
    }
}
```

Pro extends the contract with top-level keys per sub-feature (only emitted when enabled):

| Key | Sub-feature |
|---|---|
| `email_capture` | Pause at time → modal email form → submit/skip → resume |
| `action_lock` | Full-cover overlay (share / form / link / login required) |
| `timed_cta` | `[{time, headline, button_text, button_url, dismissible}]` |
| `chapters` | `{items: [{start_time, title}], source: 'manual' \| 'youtube'}` |
| `auto_resume` | localStorage seek persistence + Resume prompt |
| `end_screen` | Replay / next / countdown-redirect overlay on `ended` |
| `heatmap` | 5s sample → REST → per-video bucket array |
| `adaptive_streaming` | Lazy-loads hls.js / dash.js |
| `country_restriction` | Server-side GeoIP gate (replaces markup, not JSON) |
| `privacy_mode` | Static thumb + click-to-load; `youtube-nocookie.com` |
| `lms_tracking` | Threshold-cross fires `embedpress:video-completed` (LearnDash / TutorLMS / LifterLMS) |
| `cdn_offloading` | BunnyCDN / Cloudflare Stream URL rewrite at save |

## Presets

Visual styles applied via CSS class:

| UI label | CSS class | Status |
|---|---|---|
| Default | (no class) | Free + Pro |
| Preset 1 | `custom-player-preset-1` | Pro |
| Preset 2 | `custom-player-preset-3` ⚠ | Pro |

> The "Preset 2" UI label maps to CSS class `custom-player-preset-3`, **not** `-2`. Classes `-2` and `-4` exist in `static/css/embedpress.css` but no UI exposes them. Don't introduce them without product direction.

CSS lives in `static/css/embedpress.css` lines ~1859–2019.

## Code paths — exhaustive map

### Free plugin

**Block attribute schema (must keep both in sync):**

| Where | Why |
|---|---|
| `src/Blocks/EmbedPress/src/components/attributes.js` | JS-side definitions used by `registerBlockType` |
| `EmbedPress/Gutenberg/BlockManager.php::get_embedpress_block_attributes()` | **Server-side mirror** — any attribute missing here is stripped before `render_callback` runs. Both Free and Pro Custom Player attrs must be registered. |

**Inspector UI:**
- `src/Blocks/EmbedPress/src/components/InspectorControl/customplayer.js` — base toggles (free)
- Pro panels filter in via `applyFilters('embedpress.customPlayerControls', ...)`

**Render path:**
- Editor: `src/Blocks/EmbedPress/src/components/edit.js` — wrapper renders `data-options={getPlayerOptions({attributes})}` whenever `customPlayer || cinematicPreview`
- Save: `src/Blocks/EmbedPress/src/components/save.js` — same condition
- Helper: `src/Blocks/EmbedPress/src/components/helper.js::getPlayerOptions` — single source of truth for the JSON shape

**Elementor:**
- `EmbedPress/Elementor/Widgets/Embedpress_Elementor.php` — fires `extend_customplayer_controls` action (Pro hooks here)
- `Embedpress_Elementor::render()` builds the wrapper, injects `data-options` JSON

**Shortcode:**
- `EmbedPress/Includes/Classes/Extend_CustomPlayer_Controls.php` — registers Custom Player on the shortcode pipeline (`emberpress_custom_player => 'yes'` is the legacy enable key — note the typo `emberpress`, kept for back-compat)

**Frontend init — `static/js/initplyr.js` (~1466 lines):**

| Section | Role |
|---|---|
| L1–L139 | `init()`: scan `[data-playerid]`, parse `data-options`, apply poster |
| L147–L166 | controls array builder |
| L181–L219 | `new Plyr(selector, {...})` — `seekTime: 10` hardcoded |
| L226–L235 | Privacy Mode auto-resume after consent |
| L240–L247 | `epSafeInit(name, fn)` — failure isolation per Pro feature |
| L249–L272 | Per-feature dispatch: auto_resume → end_screen → timed_cta → chapters → email_capture → action_lock → lms_tracking → heatmap |
| L276–L307 | iOS YouTube fullscreen workaround |
| L314–L333 | Poster fade-in (5s safety timeout) |
| L338+ | PiP icon injection (MutationObserver — Plyr renders PiP late) |
| L410+ | Auto-Resume |
| L525+ | Heatmap |
| L565+ | LMS tracking |
| L645+ | Adaptive streaming (lazy-loads hls.js / dash.js) |
| L705+ | Action Lock |
| L836+ | Email Capture (localStorage dedupe per video URL) |
| L984+ | Chapters |
| L1198+ | Timed CTA |
| L1287+ | Privacy Mode |
| L1346+ | End Screen |

### Self-hosted video detection — five regex copies

The five places that decide "this URL is a self-hosted `<video>`":

1. `EmbedPress/Providers/SelfHosted.php::validateSelfHostedVideo` — classic shortcode
2. `EmbedPress/Includes/Classes/Helper.php::check_media_format` — server-side, sets `self_hosted` / `hosted_format`
3. `src/Blocks/EmbedPress/src/components/helper.js` — TWO copies: `isSelfHostedVideo()` and `checkMediaFormat()`
4. `src/utils/functions.js::isSelfHostedVideo` — **gates whether the Custom Player panel appears** in the inspector. Missing this is the easiest way to "add HLS support" but still see no player UI.
5. `src/utils/helper.js::isSelfHostedVideo`

All five strip `?…` and `#…` before extension match so signed-URL streaming sources (Mux, CloudFront tokens) work.

## Pro sub-feature playbook

For each new Pro sub-feature:

1. Add attribute(s) to `attributes.js` AND `BlockManager.php::get_embedpress_block_attributes()` (server-side mirror is mandatory).
2. Surface in inspector via `applyFilters('embedpress.customPlayerControls', ...)` (Pro panel).
3. Mirror in Elementor — Pro section in the Elementor widget hook.
4. Mirror in shortcode — extend `Extend_CustomPlayer_Controls.php` defaults.
5. Emit JSON — extend `helper.js::getPlayerOptions` with the new top-level key. Only emit when feature is enabled.
6. Server-side render — if feature gates rendering (e.g. Country Restriction), short-circuit the markup; otherwise the wrapper is unchanged.
7. Frontend init — add `epInitXxxx` function to `initplyr.js` and dispatch via `epSafeInit('xxxx', ...)` so a failure in one sub-feature doesn't break the next.
8. Pro back-end class (if needed) — REST endpoint + DB writes.

## Editor live-preview architecture (must preserve)

These invariants are easy to break and the symptoms (stale preview, double oEmbed, Pro features dropped) only appear when toggles happen in a specific order.

- **`Core/AssetManager.php::is_custom_player_enabled()`** must return true unconditionally inside the Gutenberg iframed canvas (`is_admin() && get_current_screen()->is_block_editor()`). Without this short-circuit, `plyr.js` never enqueues and `Plyr` is undefined.
- **`opacity: 0` belongs inline in `save.js`, NEVER as a global CSS rule.** `save.js` emits `style="opacity:0"` only when `customPlayer` is on; init code flips `.plyr-initialized` after init, and the only CSS rule is `[data-playerid].plyr-initialized { opacity: 1 }`.
- **`<EmbedWrap key={…}>` is the live-preview backbone.** Its key composes three independent triggers:
  1. `customPlayer ? 'cp' : 'raw'` — flips on the master toggle
  2. `(embedHTML || '').length` — flips when iframe URL changes
  3. `JSON.stringify(customPlayerParams || {})` — flips on any Custom Player option change

  Any change unmounts and remounts the wrapper; `dangerouslySetInnerHTML` re-emits the embed; `initplyr.js`'s MutationObserver in the canvas iframe fires `initPlayer` on the fresh node. **Never** drop one of these from the key.

- **`customPlayerParams` must NOT live in the `embed` useEffect's dependency list.** Custom Player options never change the iframe URL. Including it there causes a single toggle to bump *both* `youtubeParams` AND `customPlayerParams` ref-equality across separate render passes, scheduling the embed-fetch debounce twice; the second response runs `getCustomPlayerParams` against stale attributes and drops the freshly enabled Pro flag.
- **`helper.js::initCustomPlayer` bails when the wrapper has `.plyr-initialized` already.** In the editor's iframed canvas, `initplyr.js`'s MutationObserver beats the 300ms `setTimeout` from `edit.js`'s `useEffect` to the punch. Without the bail, `helper.js` runs `new Plyr(element, ...)` *again*, creating a second instance that orphans the first one's Pro-feature listeners.
- **Color-migration `setAttributes(...)` calls must live inside a `useEffect`, never in the render body** — otherwise React's "Cannot update a component while rendering" warning fires whenever the user pastes a URL.

## Files cheatsheet

| Concern | File |
|---|---|
| Frontend init (single source of runtime truth) | `static/js/initplyr.js` |
| Block JS attributes | `src/Blocks/EmbedPress/src/components/attributes.js` |
| Block PHP attribute mirror | `EmbedPress/Gutenberg/BlockManager.php` |
| Inspector (free toggles) | `src/Blocks/EmbedPress/src/components/InspectorControl/customplayer.js` |
| Render helpers (JSON shape) | `src/Blocks/EmbedPress/src/components/helper.js` (`getPlayerOptions`) |
| Block edit / save | `src/Blocks/EmbedPress/src/components/{edit.js,save.js}` |
| Shortcode + base controls | `EmbedPress/Includes/Classes/Extend_CustomPlayer_Controls.php` |
| Elementor widget | `EmbedPress/Elementor/Widgets/Embedpress_Elementor.php` |
| Presets CSS | `static/css/embedpress.css` (~L1859–2019) |
| Plyr vendor | `assets/js/vendor/plyr.js` |

## Common pitfalls

- **`data-options` JSON malformed** — frontend logs a parse error and falls back to a plain iframe. Use `htmlspecialchars($json, ENT_QUOTES, 'UTF-8')` server-side.
- **Player UI doesn't appear for a new self-hosted format** — usually means one of the five `isSelfHostedVideo` copies wasn't updated.
- **YouTube `videoId` extraction** — supports `youtube.com/watch?v=ID`, `youtu.be/ID`, `/embed/ID`, `/shorts/ID`, channel/playlist URLs (Pro). Test all forms when changing the regex.
- **Misspelled `custom_payer_preset` Elementor key** — preserve the typo for back-compat.
- **`emberpress_custom_player`** (sic) — legacy shortcode key has a typo. Don't fix — load-bearing for old posts.
- **iOS YouTube fullscreen** modifies `<meta name="viewport">` directly. Make sure both `enter` and `exit` handlers fire.
- **PiP icon via MutationObserver** because Plyr renders PiP late on some sources. Don't replace with a one-shot — it'll race.
- **Privacy Mode + autoplay**: autoplay is force-disabled (the click IS the autoplay). After consent, the wrapper carries `data-ep-autoplay-after-init="1"` and `initplyr.js` calls `player.play()` once on `ready` / `canplay`.
- **Email Capture localStorage key**: per video URL. Strip query for the key — otherwise adding `?t=10` re-prompts.
- **Heatmap batching**: ≤1 request per 30s per viewer (acceptance criterion). Buffer; don't sample-and-send on every interval.
- **Anti-skip on LMS completion**: requires `watched_seconds ≥ min(0.85, threshold × 0.9) × total_seconds`. Without the 0.9 multiplier, a 50% threshold was unsatisfiable because `watched/dur` lagged `currentTime/dur`.
- **Completion is server-idempotent**, NOT sessionStorage-gated. Per-(user, video_url) state lives in user meta `embedpress_video_progress` keyed by `md5(video_url)`.
- **Two distinct POSTs hit `/completion`**: (1) threshold-cross (full payload, fires `embedpress_video_completed` once), (2) progress beacons with `progress_only=1` (sent on `pause` / `ended` / `beforeunload` / `pagehide` via `navigator.sendBeacon`, throttled to ≥1s of new watched time). Beacons let the dashboard surface real watch depth for non-completers. `sendBeacon` survives unload but can't set `X-WP-Nonce` — `_wpnonce` is appended to the FormData body instead.
- **Cinematic Preview coexistence**: when both skins are on, Cinematic Preview's overlay handles the first click and starts Plyr. Email Capture's pause-at-time fires AFTER overlay dismissal — confirm timer starts from `play`, not page load.

## Testing

Master test plan: `embedpress-docker/test-plan-custom-player-4.5.2.txt`.

Pre-flight:
- Hard-refresh editor (asset cache key needs a version bump).
- DevTools Console open — any red error = Fail.
- Test BOTH (a) YouTube `https://www.youtube.com/watch?v=dQw4w9WgXcQ` and (b) self-hosted `.mp4`. Pass only if BOTH work (unless feature is provider-specific).
- Re-test in BOTH Gutenberg AND Elementor — historical JSON-quoting bugs only manifested in one of them.
- Incognito for any feature involving `localStorage` (auto-resume, email capture dedupe, action-lock unlock state).

Playwright automation: `/Applications/Workspace/GitHub/embedpress-playwright-automation`.
