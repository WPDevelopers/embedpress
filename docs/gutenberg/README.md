# Gutenberg Architecture

How EmbedPress integrates with the WordPress block editor.

## What ships

EmbedPress contributes a family of blocks under the `embedpress/` namespace, registered via `EmbedPress\Gutenberg\BlockManager` (in `EmbedPress/Gutenberg/BlockManager.php`).

### Server-rendered blocks (have a PHP `render_callback`)

| Block name | Render callback (in `EmbedPressBlockRenderer`) | Role |
|---|---|---|
| `embedpress/embedpress` | `render` | **Generic / catch-all** for 250+ providers. The main block. |
| `embedpress/embedpress-pdf` | `render_embedpress_pdf` | PDF.js or 3D flipbook viewer for PDFs |
| `embedpress/document` | `render_document` | DOC / DOCX / PPT / PPTX / XLS / XLSX viewer |
| `embedpress/embedpress-calendar` | `render_embedpress_calendar` | Google Calendar |
| `embedpress/youtube-block` | `render_youtube_block` | Minimal legacy YouTube block |
| `embedpress/wistia-block` | `render_wistia_block` | Minimal legacy Wistia block |
| `embedpress/pdf-gallery` | `render_pdf_gallery` | Multi-PDF grid / carousel / bookshelf |

### Client-rendered blocks (no server `render_callback`)

These have a `block.json` and an `edit.js` but rely on save() output / client iframes:

- `embedpress/google-docs-block`
- `embedpress/google-sheets-block`
- `embedpress/google-slides-block`
- `embedpress/google-forms-block`
- `embedpress/google-drawings-block`
- `embedpress/google-maps-block`
- `embedpress/twitch-block`

The 250+ providers are not "one block per provider." Most providers are reached through the **generic `embedpress/embedpress` block**. Specialized blocks exist only when the UX needs more than a URL field — PDFs need viewer toggles + lightbox, documents need format-specific routing, gallery needs multi-item management, calendar needs event display, etc.

## Lifecycle

```
WordPress init
    └─ EmbedPress\Gutenberg\InitBlocks (boot)
        └─ BlockManager
            ├─ register every block from src/Blocks/<name>/block.json
            ├─ wire each block.json's render_callback to EmbedPressBlockRenderer::<method>
            └─ enqueue editor JS bundles
```

Editor-side, `edit.js` provides the React UI. On render, WordPress invokes the matching `render_*` callback.

## Block folder layout

```
src/Blocks/<block-name>/
├── block.json           ← name, attributes schema, supports
├── index.js             ← registerBlockType()
├── edit.js              ← editor component
├── save.js              ← static save (or null for fully dynamic)
├── inspector.js         ← <InspectorControls>
├── style.scss           ← frontend styles
└── editor.scss          ← editor-only styles
```

`src/Blocks/EmbedPress/` is the source folder for the generic `embedpress/embedpress` block (note: capital "EmbedPress" — it's not a provider, just the folder name for the catch-all). `src/Blocks/GlobalCoponents/` (misspelled, kept for compat) holds the shared React components reused across blocks: `custom-player-controls.js`, `social-share-control.js`, `lock-control.js`, `custombranding.js`, `ads-template.js`, `ads-control.js`, `embed-wrap.js`, `embed-placeholder.js`, etc.

## Server-side rendering

`EmbedPressBlockRenderer.php` (~28k lines) defines one static method per server-rendered block.

For the generic block (`render`):

1. Read attributes (URL, client ID, options).
2. Run protection: `extract_protection_data` + `should_display_content`.
3. Either render cached `embedHTML` via `render_embed_html`, or:
4. Fall through to dynamic rendering, which calls **`Shortcode::parseContent($url, true, $atts)`** — the same pipeline shortcodes and Elementor use.

For specialized blocks (`render_embedpress_pdf`, `render_document`, etc.), the method builds the iframe directly (PDF.js viewer URL, Google Docs Viewer URL, etc.) without going through `parseContent`, since these don't need provider routing.

All blocks ultimately converge on `generate_final_html()`, which emits the universal wrapper:

```html
<div class="ep-embed-content-wraper …" data-options='{…JSON…}'>
    {provider HTML / iframe}
</div>
```

## The `data-options` data contract

`build_player_options()` (around line 919 of `EmbedPressBlockRenderer.php`) constructs the JSON consumed by the frontend Custom Player runtime. Real fields include:

```
rewind, restart, pip, poster_thumbnail, player_color, player_preset,
fast_forward, player_tooltip, hide_controls, download, fullscreen,
start, end, rel, mute, t, vautoplay, autopause, dnt,
self_hosted, hosted_format
```

Pro extends this contract with engagement / delivery sub-feature fields (chapters, CTA, end screen, country restriction, etc.).

## Frontend rendering

Frontend JS scans for marker classes:

- `.ep-embed-content-wraper[data-options]` — Custom Player container
- `.embedpress-pdf` — PDF viewer
- `.ep-pdf-gallery` — Gallery
- (analytics tracker selectors)

Bundles are enqueued conditionally via `Core/AssetManager.php`.

## Inspector hooks (JS)

Free emits placeholder controls via `wp.hooks` so Pro can fill them:

```js
applyFilters('embedpress.selectPlaceholder', defaultControl, controlName, attributes)
applyFilters('embedpress.youtubeControls', controls, attributes)
applyFilters('embedpress.wistiaControls', controls, attributes)
// ... per provider
```

Without Pro, the placeholder is a disabled / upsell control. With Pro, the real control is injected.

## Deprecation discipline

> The single most important rule.

Changing a block's `save()` output requires a `deprecated[]` entry that matches the old output. Otherwise WordPress shows old posts as "Block contains unexpected or invalid content."

Prefer **conditional attribute emission** when possible — emit a new attribute only when the user explicitly toggles it, so old posts still match the original signature without needing a deprecation.

## Adding a new block

1. `scripts/new-block.sh <block-name>` (from docker repo) scaffolds the folder.
2. Edit `block.json`.
3. Implement `edit.js`, `inspector.js`.
4. Decide: server-rendered (add a `render_*` method to `EmbedPressBlockRenderer` and register in `BlockManager`) or client-rendered (no PHP method needed).
5. `npm run build`.
6. E2E test in `tests/playwright/gutenberg/<block>.spec.ts`.

## Common debugging tactics

- **Block won't register**: check `block.json` syntax; check `npm run build` ran. Browser console shows `Invalid block` errors.
- **Editor preview blank**: render callback returns an empty string. `error_log` inside the callback.
- **Frontend missing player JS**: marker class not present, or `AssetManager` decided not to enqueue.
- **"Block contains unexpected content"**: missing `deprecated[]` entry.
