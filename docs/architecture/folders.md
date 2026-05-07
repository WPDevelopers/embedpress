---
order: 3
---

# Folder Reference

What every top-level directory contains, why it exists, and where new code belongs.

```
embedpress/
├── embedpress.php             ← plugin header + bootstrap
├── includes.php               ← constants
├── autoloader.php             ← PSR-style autoload glue
├── providers.php              ← URL host → Provider class registry
│
├── EmbedPress/                ← all plugin PHP (root namespace)
│   ├── Core.php               ← modern dispatch
│   ├── CoreLegacy.php         ← legacy dispatch (don't add here)
│   ├── Shortcode.php          ← [embedpress] / [embed] handler
│   ├── RestAPI.php            ← REST endpoints
│   ├── Compatibility.php      ← misc compat layer
│   ├── Providers/             ← one file per upstream source (YouTube, Vimeo…)
│   ├── Gutenberg/             ← block server-side render
│   ├── Elementor/             ← Elementor integration + widgets
│   ├── Ends/                  ← Front + Back loaders
│   ├── Analytics/             ← analytics module
│   ├── AMP/                   ← AMP plugin compat
│   ├── Plugins/               ← compat with other plugins
│   ├── ThirdParty/            ← compat shims for popular tools
│   └── Includes/Classes/      ← shared helpers + Feature_Enhancer
│
├── Core/                      ← legacy "core" (pre-EmbedPress namespace era)
│   ├── AutoLoader.php         ← used by autoloader.php
│   ├── AssetManager.php       ← enqueue manager
│   ├── LocalizationManager.php
│   └── init.php
│
├── src/                       ← all JS/TS source (Vite)
│   ├── Blocks/                ← Gutenberg block sources (one folder per block)
│   ├── AdminUI/               ← React admin / settings UI
│   ├── Frontend/              ← public frontend runtime
│   ├── Analytics/             ← analytics tracking JS
│   ├── Shared/                ← shared React components
│   └── utils/                 ← cross-cutting JS helpers
│
├── assets/                    ← built bundles (Vite output, COMMITTED)
├── static/                    ← static assets (CSS, vendored libs like PDF.js, Plyr)
├── languages/                 ← .pot + translations
├── vendor/                    ← Composer (COMMITTED for WP.org)
├── node_modules/              ← (NOT committed)
├── tests/                     ← Playwright E2E + PHPUnit
└── docs/                      ← this documentation
```

## Major folders, expanded

### `EmbedPress/Providers/`
Each file is one upstream service. Files extend `\EmbedPress\Providers\Wrapper` (the abstract base) or `Embera\Adapters\Service` directly. **Add a new provider here**, then register its host patterns in `providers.php`.

See [Provider System](../providers/README.md).

### `EmbedPress/Gutenberg/`
| File | Role |
|---|---|
| `BlockManager.php` | Registers blocks with WP |
| `EmbedPressBlockRenderer.php` | Server-side render callbacks |
| `FallbackHandler.php` | Renders unknown URLs via Wrapper |
| `InitBlocks.php` | Boot entry point |

### `EmbedPress/Elementor/`
| File | Role |
|---|---|
| `Embedpress_Elementor_Integration.php` | Registers widgets with Elementor |
| `Elementor_Upsale.php` | Pro upsell helpers for inactive Pro |
| `Widgets/Embedpress_Elementor.php` | The main widget (handles every provider) |

### `EmbedPress/Includes/Classes/`
Shared helpers used everywhere. Most important:
- **`Feature_Enhancer.php`** — the filter pipeline that decorates provider output. New cross-provider features hook in here.
- **`Helper.php`** — utility functions (URL parsing, format detection, escaping helpers).

### `src/Blocks/`
One folder per block. Each block folder typically contains:
```
<block-name>/
├── index.js          ← register block
├── edit.js           ← editor UI
├── save.js           ← save() — change with care, see Gutenberg deprecation
├── inspector.js      ← <InspectorControls>
├── block.json        ← block metadata
└── style.scss
```

### `src/Frontend/`
The bundle that runs on visitor pages: player initialization, analytics tracker, lightboxes, etc. Each entry point is built into a separate `assets/*.build.js`.

### `Core/`
Older bootstrap helpers. Kept because they're loaded before `EmbedPress\` autoloading is fully wired (chicken-and-egg: `AutoLoader` itself can't autoload). Don't add new code here unless it absolutely must run before the autoloader registers.

### `static/`
Vendored third-party assets shipped as-is: PDF.js viewer, 3D flipbook, Plyr, polyfills. Updates to these come from upstream — don't hand-edit.

### `tests/`
- `tests/playwright/` — E2E suite split by surface (gutenberg, elementor, classic, dashboard, ui)
- `tests/phpunit/` — PHP unit + integration

The standalone repo `embedpress-playwright-automation` mirrors customer-facing scenarios; the inline suite is for daily dev.

## Where do I put a new feature?

| Feature touches… | Add code in… |
|---|---|
| One specific provider's URL/embed logic | `EmbedPress/Providers/<Name>.php` |
| All providers (player, share, lazy load) | `EmbedPress/Includes/Classes/Feature_Enhancer.php` + filter |
| New Gutenberg block | `src/Blocks/<name>/` + `EmbedPress/Gutenberg/EmbedPressBlockRenderer.php` |
| New Elementor widget | `EmbedPress/Elementor/Widgets/<Name>.php` (most cases extend the main widget instead) |
| New REST endpoint | `EmbedPress/RestAPI.php` (or per-feature module) |
| Frontend behavior on visitor pages | `src/Frontend/` + enqueue in `Core/AssetManager.php` |
| Admin settings UI | `src/AdminUI/` |
| Analytics tracking | `src/Analytics/` (JS) + `EmbedPress/Analytics/` (PHP) |

## Build outputs

`npm run build` writes to `assets/`. The mapping from `src/` entry to `assets/` output is defined in `vite.config.js` at the repo root. **Both `src/` and `assets/` are committed** so end users (and WP.org) can install without running Node.

## What's not committed

- `node_modules/`
- `.env`, `.env.local`
- `.DS_Store`, IDE folders
- Vite cache (`.vite/`)

Composer's `vendor/` *is* committed — required by WP.org because the directory is published as-is.
