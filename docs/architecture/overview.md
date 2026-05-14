# Architecture Overview

This document is the 30,000-ft view. Read it first.

## What EmbedPress is, in one paragraph

EmbedPress is a **provider-driven embed engine** for WordPress. Users paste a URL (or pick a block / widget / shortcode), and EmbedPress figures out which "provider" the URL belongs to, asks that provider for the embed HTML (via the bundled Embera oEmbed library or WP's native `WP_oEmbed::fetch`), decorates it with optional UI (custom player, social share, lazy-load, branding…), and returns the result. The same `Shortcode::parseContent` pipeline answers all four surfaces (Gutenberg, Elementor, classic shortcode, auto-embed), so a YouTube embed renders identically regardless of how you placed it.

## Core goals

1. **One source of truth per provider.** The logic that turns a YouTube URL into an iframe lives in **one** place — `EmbedPress/Providers/Youtube.php`. Every editor surface delegates to it through `Shortcode::parseContent`.
2. **Editor-agnostic rendering.** A block, widget, and shortcode all produce the same final HTML.
3. **Safe extensibility for Pro.** Pro doesn't fork free providers — it ships matching extender classes (in `embedpress-pro/includes/Providers/*.php`) that hook the free filter pipeline (`embedpress:onAfterEmbed`, etc.).
4. **WordPress.org-friendly distribution.** `vendor/`, `assets/`, and built `Gutenberg/dist/` are committed.

## The four entry points

A user can produce an embed in four ways. They all funnel into the same pipeline.

```
                ┌─────────────────────────────────────┐
  Editor →      │  Gutenberg blocks                   │
                │  (7 server-rendered + 7 client-only,│ ──┐
                │   see Gutenberg docs)               │   │
                └─────────────────────────────────────┘   │
                ┌─────────────────────────────────────┐   │
  Editor →      │  Elementor widgets (5)              │   │
                │  embedpres_elementor / pdf / doc /  │ ──┤
                │  pdf_gallery / calendar             │   │
                └─────────────────────────────────────┘   │
                ┌─────────────────────────────────────┐   │
  Content →     │  Shortcodes:                        │   ├──→  EmbedPress\Shortcode::parseContent
                │  [embed]  [embedpress]              │ ──┤      ├─ extract URL + atts
                │  [embedpress_pdf]  [embedpress_doc] │   │      ├─ embedpress:isEmbra dispatch
                │  [embedpress_pdf_gallery]           │   │      ├─ Embera or WP_oEmbed
                └─────────────────────────────────────┘   │      ├─ embedpress:onBeforeEmbed
                ┌─────────────────────────────────────┐   │      ├─ provider builds HTML
  Content →     │  REST /embedpress/v1/oembed/{prov.} │   │      ├─ embedpress:onAfterEmbed
                │  (called by WP auto-embed)          │ ──┘      └─ wrapped HTML returned
                └─────────────────────────────────────┘                    ↓
                                                              ┌────────────────────────┐
                                                              │  EmbedPress\Providers  │
                                                              │  selected via Embera   │
                                                              │  + isEmbra filter      │
                                                              └────────────────────────┘
                                                                          ↓
                                                              Frontend JS (Plyr, PDF.js,
                                                              flipbook, analytics, etc.)
```

## Layers

| Layer | Lives in | Responsibility |
|---|---|---|
| **Editor surfaces** | `src/Blocks/`, `EmbedPress/Elementor/`, `EmbedPress/Shortcode.php` | Capture user intent, attributes, and URL |
| **URL→HTML pipeline** | `EmbedPress/Shortcode.php::parseContent` | Resolve URL → provider, run filters, return HTML |
| **Provider classes** | `EmbedPress/Providers/*` | Provider-specific URL parsing + embed generation (called via Embera) |
| **Decoration pipeline** | `EmbedPress/Includes/Classes/Feature_Enhancer.php` (+ Pro extenders) | Decorate provider output via `embedpress:onAfterEmbed` |
| **Frontend runtime** | `assets/js/*` (built from `src/Frontend/` and `src/Blocks/`) | Player init, analytics ping, lightboxes, lazy load |

Editor surfaces never call Provider classes directly — they call `Shortcode::parseContent`. Provider classes don't know which editor surface called them — they just take a URL and return HTML.

## Why two `Core` classes?

`EmbedPress/Core.php` is the **modern (WP 5+ block editor)** path. `EmbedPress/CoreLegacy.php` is the **WP < 5.0 (TinyMCE)** path. The bootstrap (`embedpress.php` ~line 115) detects the WP version and the active editor and instantiates one or the other. CoreLegacy adds a `configureTinyMCE` action and disables some default rewrite rules; it does not exist for "old shortcodes" — both Cores delegate the actual URL→HTML work to `Shortcode::parseContent`.

## Free vs. Pro

Pro is a separate plugin (`embedpress-pro`) that **requires the free plugin to be active**. Pro:

- Boots via `Embedpress\Pro\Classes\Bootstrap::instance()` (singleton).
- Ships its own Provider classes in `includes/Providers/` (Youtube, Vimeo, Wistia, Twitch, Dailymotion, Soundcloud, Document, Meetup) that **extend free providers' behavior** by registering callbacks on `embedpress:onAfterEmbed` / `embedpress:onBeforeEmbed` via a `featureExtend()` static.
- Registers cross-cutting filters in `includes/Filters/*` (`Feature_Enhancer_Pro`, `Utility`, `Calendar`, `Calendly`, `GooglePhotos`, `Elementor_Enhancer_Pro`, `Youtube`).
- Does **not** add a custom REST namespace — only the bundled `WPDeveloper\Licensing\RESTApi` for license operations.
- Does **not** create custom DB tables — Pro state lives in `wp_options` under the `embedpress_pro_*` prefix.

See [Free + Pro Coupling](free-pro-coupling.md) for the contract.

## Frontend asset philosophy

Source code lives in `src/`, built with **Vite** to `assets/`. Both source and build outputs are committed because WP.org users install the zip and never run `npm`. `Core/AssetManager.php` enqueues conditionally based on the embed types detected on the page.

## What you should never do

- **Never call a Provider class from a block or widget directly.** Go through `Shortcode::parseContent`.
- **Never copy free Provider logic into Pro.** Use `featureExtend()` + the `embedpress:onAfterEmbed` filter (this is what Pro's existing extenders already do).
- **Never change a Gutenberg block's `save()` output without a `deprecated[]` entry.** Old posts will refuse to render. See [Gutenberg](../gutenberg/README.md#deprecation-discipline).
- **Never widen a provider URL regex without testing other providers.** Greedy regexes silently steal embeds from neighbors.

## Continue reading

- [Data Flow](data-flow.md) — trace one URL from paste to render
- [Folder Reference](folders.md) — what each directory holds
- [Provider System](../providers/README.md) — the layer most contributions touch
