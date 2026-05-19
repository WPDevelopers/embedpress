# EmbedPress Developer Documentation

Welcome to the EmbedPress developer documentation. This is the **free** plugin — for the Pro extension, see the corresponding `docs/` folder in the `embedpress-pro` repo.

EmbedPress is a WordPress plugin that turns 250+ external sources (videos, audio, PDFs, calendars, social feeds, maps, documents…) into clean, configurable embeds available as **Gutenberg blocks**, **Elementor widgets**, and the classic **`[embed]` / `[embedpress]` shortcode**.

This documentation explains **how the plugin is built**, **why it's designed the way it is**, and **how to extend it safely**.

---

## Table of contents

### Architecture
- [Architecture Overview](architecture/overview.md) — the 30,000-ft view of the codebase
- [Data Flow](architecture/data-flow.md) — how a URL becomes a rendered embed
- [WordPress Integration](architecture/wordpress-integration.md) — hooks, lifecycle, autoloading
- [Free + Pro Coupling](architecture/free-pro-coupling.md) — how Pro extends the free plugin

### Folder Structure
- [Folder Reference](architecture/folders.md) — what every top-level folder does

### Editors
- [Gutenberg Architecture](gutenberg/README.md)
- [Elementor Architecture](elementor/README.md)
- [Classic Shortcode](architecture/shortcode.md)

### Providers
- [Provider System](providers/README.md) — adapter pattern, URL routing, embed generation
- [Adding a New Provider](providers/adding-a-provider.md) — step-by-step
- [Provider Catalog](providers/catalog.md) — every shipped provider, what it does

### Features

**The core feature is the embed itself.** EmbedPress ships **250+ sources** — YouTube, Vimeo, Wistia, Twitch, Spotify, SoundCloud, PDFs, Google Docs/Sheets/Slides/Maps/Forms/Calendar, Instagram, X (Twitter), LinkedIn, GitHub, Calendly, Canva, AirTable, OpenSea, Gumroad, and many more — usable as **Gutenberg blocks**, **Elementor widgets**, the classic **`[embedpress]` shortcode**, or **auto-embed** (URL on a line). Anything not in the catalog falls back to the [Universal Wrapper](features/wrapper.md). See:

- [Provider System](providers/README.md) — how URL → embed routing works
- [Provider Catalog](providers/catalog.md) — every shipped provider
- [Adding a New Provider](providers/adding-a-provider.md)

Layered on top of the embed, these features decorate or extend it:

**Content blocks**
- [PDF Embedder + 3D Flipbook](features/pdf.md)
- [PDF Gallery](features/pdf-gallery.md)
- [Document Block (DOC/PPT/XLS)](features/document.md)
- [Custom Video Player](features/custom-player.md) — Plyr-based branded player (free + Pro tiers)

**Engagement & tracking**
- [Social Share](features/social-share.md) — Facebook / X / Pinterest / LinkedIn buttons around any embed
- [Analytics](features/analytics.md) — view / click / impression tracking + dashboard

**Infrastructure & admin**
- [Universal Wrapper / Auto-embed](features/wrapper.md) — the catch-all fallback for unknown URLs
- [Onboarding Wizard](features/onboarding.md) — first-run admin setup
- [Feature Enhancer](features/feature-enhancer.md) — the cross-provider decoration pipeline (`embedpress:onAfterEmbed`)

### Pro features

Many have free-side scaffolding (filter slots, upsell UI, Elementor traits) covered in the feature pages above. Full Pro implementation is in the **`embedpress-pro` repo**'s [`docs/features/`](../../embedpress-pro/docs/features/) tree.

- **Cinematic Preview** — Netflix / Prime Video / Disney+ / Apple TV+ style hero overlay with 6 presets
- **Custom Branding** — per-provider logo + clickable CTA overlay on YouTube, Vimeo, Wistia, Twitch, Dailymotion, PDF, and Document embeds
- **Lazy Load** — native `loading="lazy"` on every iframe / image, per-block or global
- **Content Protection** — password gate (AES-128-CBC, 1-hour cookie unlock) or user-role gate, per embed
- **Showcase Ads** — image / video pre-roll overlay on top of any embed, with skip timing
- **Broken Embeds Detector** — daily scanner flags dead embed URLs (404 / 410 only — bot-hostile statuses → "inconclusive")
- **Analytics Pro tier** — per-embed breakdown, geo / device / browser / referrer + UTM, advanced charts, email reports (weekly / monthly), PDF + Excel export, unlimited retention
- **Custom Player engagement sub-features** — 12 modules layered over the free Plyr player:
  - **Email Capture** — pause at time → modal email form → resume
  - **Action Lock** — full-cover overlay (share / form / link / login) before unlock
  - **Timed CTA** — call-to-action overlays at chosen seconds, multi-stack
  - **Chapters** — clickable timeline segments (manual or YouTube auto-detect)
  - **Auto Resume** — localStorage seek persistence + Resume prompt
  - **End Screen** — replay / next / countdown-redirect on `ended`
  - **Drop-Off Heatmap** — anonymous 5s-bucket retention chart per video
  - **Adaptive Streaming** — auto-loads hls.js / dash.js for `.m3u8` / `.mpd`
  - **Country Restriction** — server-side GeoIP gate (with IP-API fallback)
  - **Privacy Mode** — static thumb + click-to-load; `youtube-nocookie.com`
  - **LMS Completion** — fires on threshold-cross to LearnDash / TutorLMS / LifterLMS, with anti-skip guard
  - **CDN Offloading** — BunnyCDN / Cloudflare Stream URL rewrite at upload

### APIs & External Integrations
- [REST API](api/rest.md)
- [oEmbed Integration](api/oembed.md)
- [Provider HTTP calls](api/external.md)

### Developer Guides
- [Coding Standards](guides/coding-standards.md)
- [Hooks & Filters Reference](guides/hooks-and-filters.md)
- [Extending EmbedPress](guides/extending.md)
- [Debugging & Troubleshooting](guides/debugging.md)
- [Build & Asset Pipeline](guides/build-pipeline.md)
- [Testing](guides/testing.md)

### Contributing
- [Local Development Setup](contributing/setup.md)
- [Pull Request Guidelines](contributing/pull-requests.md)
- [Release Process](contributing/release.md)

---

## Quick orientation

If you have **15 minutes** and want to grok the plugin:

1. Read [Architecture Overview](architecture/overview.md) — explains the four entry points (shortcode, block, widget, auto-embed) and how they all funnel into the same renderer.
2. Skim [Data Flow](architecture/data-flow.md) — follow a YouTube URL from paste to rendered iframe.
3. Open [Provider System](providers/README.md) — the heart of the plugin. Almost every customer-facing feature lives in or hooks into a Provider.

If you're **adding a feature**, start with [Extending EmbedPress](guides/extending.md). If you're **fixing a bug**, start with [Debugging](guides/debugging.md).

---

## Conventions used in these docs

- **File paths** are relative to the plugin root (`/Applications/Workspace/GitHub/embedpress/`).
- **Code snippets** are illustrative — always cross-check against the actual file before relying on signatures.
- **"Pro"** in italics or in a callout means the behavior described requires the Pro plugin to be active.
- **PHP namespaces** are written `EmbedPress\Foo\Bar` (the leading `\` from `EMBEDPRESS_NAMESPACE` is omitted in prose for readability).

## Where this documentation lives in the codebase

```
docs/
├── README.md              ← you are here
├── architecture/          ← high-level design
├── providers/             ← provider system
├── elementor/             ← Elementor widget internals
├── gutenberg/             ← Gutenberg block internals
├── features/              ← per-feature deep dives
├── api/                   ← REST + external HTTP
├── guides/                ← cross-cutting how-tos
└── contributing/          ← local dev, PRs, release
```

When you ship a feature, **update the matching doc in the same PR**. Documentation that drifts is worse than no documentation.
