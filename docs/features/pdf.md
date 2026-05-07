---
order: 2
---

# PDF Embedder + 3D Flipbook

Renders PDFs via the bundled Mozilla PDF.js viewer or, optionally, a 3D flipbook (Three.js + html2canvas). Both modes share the same Gutenberg block (`embedpress/embedpress-pdf`) and Elementor widget.

## Two render modes inside one block

- **PDF.js modern viewer** — `viewerStyle='modern'`. EmbedPress's themed wrapper around Mozilla's PDF.js. Color picker, toolbar config (download / copy / draw / etc.), open-at-page support.
- **3D flipbook** — `viewerStyle='flip-book'` + `presentation=true`. Uses `3dflipbook.min.js` + Three.js + html2canvas + a separate PDF.js for page rasterization. Iframe-rendered through an admin-ajax endpoint.

## Free vs Pro

| Capability | Free | Pro |
|---|---|---|
| PDF.js viewer + theme + color picker | ✓ | ✓ |
| 3D flipbook presentation mode (basic) | ✓ | ✓ |
| Toolbar config + open-at-page | ✓ | ✓ |
| Basic watermark text | ✓ | ✓ |
| Watermark with full options (font size, opacity, color) | – | ✓ |
| Custom branding logo overlay | – | ✓ |
| Content protection (password + role) | – | ✓ |
| Advanced flipbook sound effects | – | ✓ |

## Architecture

```
   Block save/Editor → block.json + components/edit.js + save.js
                           │
                           ▼
   Frontend render — render_embedpress_pdf()
                     EmbedPressBlockRenderer.php:410
                           │
        ┌──────────────────┼──────────────────────┐
        ▼                  ▼                      ▼
   viewerStyle='modern' viewerStyle='flip-book'   Pro filters:
   <iframe src=         + presentation=true:      - watermark
   static/pdf/web/      admin-ajax.php?action=    - custom logo overlay
   viewer.html?file=…&  get_flipbook_viewer&     - content protection gate
   pageNumber=…>        key=<base64-params>
                           │
                           ▼
                   static/pdf-flip-book/
                   js/3dflipbook.min.js
                   + js/three.min.js
                   + js/html2canvas.min.js
                   + js/pdf.min.js
```

## Code paths

### Block + widget

| File | Role |
|---|---|
| `src/Blocks/embedpress-pdf/block.json` | Block manifest |
| `src/Blocks/embedpress-pdf/src/index.js` | Block registration |
| `src/Blocks/embedpress-pdf/src/components/attributes.js` | Full attribute schema |
| `src/Blocks/embedpress-pdf/src/components/edit.js` | Live editor |
| `src/Blocks/embedpress-pdf/src/components/save.js` | Block save HTML |
| `src/Blocks/embedpress-pdf/src/inspector.js` | Inspector panel |
| `EmbedPress/Elementor/Widgets/Embedpress_Pdf.php` | Elementor widget |
| `EmbedPress/Gutenberg/EmbedPressBlockRenderer.php::render_embedpress_pdf` (~L410) | Server render |
| `EmbedPress/Gutenberg/EmbedPressBlockRenderer.php` (~L541-548) | Iframe `title` derived from filename (a11y) |
| `EmbedPress/Shortcode.php` (~L1462-1466) | Flipbook URL assembly |
| `EmbedPress/Shortcode.php::getParamData` (~L1257) | Base64-encoded `&key=` for flipbook params |
| `EmbedPress/Includes/Classes/Helper.php::get_flipbook_renderer` | Returns `admin-ajax.php?action=get_flipbook_viewer` |

### Frontend assets

| Path | Role |
|---|---|
| `static/pdf/web/` | Bundled Mozilla PDF.js viewer (minified) |
| `static/pdf/web/ep-scripts.js` (~L22, L48) | Reads `hashParams.get('key')` (flipbook params) and `pageNumber`; sets theme + watermark color |
| `static/pdf/build/pdf.worker.js` | PDF.js worker |
| `assets/js/vendor/pdfobject.js` | PDFObject fallback for browsers without iframe PDF support |
| `static/pdf-flip-book/js/3dflipbook.min.js` | 3D flipbook renderer (minified — no source) |
| `static/pdf-flip-book/js/three.min.js` | Three.js |
| `static/pdf-flip-book/js/html2canvas.min.js` | Page → canvas |
| `static/pdf-flip-book/js/pdf.min.js + pdf.worker.js` | Separate PDF.js for flipbook |
| `static/pdf-flip-book/js/default-book-view.js` | jQuery init for flipbook UI controls |

## Block attributes

| Attribute | Type | Purpose |
|---|---|---|
| `href` | string | PDF URL |
| `mime` | string | File MIME type |
| `viewerStyle` | `'modern' \| 'flip-book'` | Render branch |
| `presentation` | bool (default true) | When `viewerStyle='flip-book'`, enables 3D presentation |
| `pageNumber` | number (default 1) | **Open-at-page** (added 4.5.0). Passed via URL param to PDF.js viewer |
| `themeMode` | `'default' \| 'custom'` | Toolbar theme |
| `customColor` | hex | Toolbar color |
| `toolbar` | bool | Toolbar visibility |
| `position` | `'top' \| 'bottom'` | PDF.js toolbar position |
| `flipbook_toolbar_position` | `'top' \| 'bottom'` | Flipbook-specific toolbar position |
| `download`, `copy_text`, `add_text`, `draw`, `add_image` | bool | Toolbar action toggles |
| `zoomIn`, `zoomOut`, `fitView`, `bookmark`, `doc_rotation` | bool | Nav/zoom toggles |
| `sound` | string | Flipbook page-flip sound |
| **Pro:** `watermarkText`, `watermarkFontSize`, `watermarkColor`, `watermarkOpacity` | mixed | Watermark |
| **Pro:** `customlogo`, `customlogoUrl`, `logoX`, `logoY`, `logoOpacity` | mixed | Custom branding overlay |
| **Pro:** `lockContent`, `protectionType`, `contentPassword`, … | mixed | Content protection |

## Open-at-page

`pageNumber` block attribute → URL hash on the viewer iframe → `static/pdf/web/ep-scripts.js`:

```js
pageNumber: hashParams.get('pageNumber')
```

PDF.js reads this and jumps the document on initial render. In flipbook mode, the value is included in the base64-encoded `key` payload and decoded by the flipbook renderer.

## Common pitfalls

- **Flipbook minified library is opaque.** `3dflipbook.min.js` ships without a source map. Bug-hunting requires reading the minified source or reproducing on `3dflipbook.net` demo.
- **Two separate PDF.js bundles.** PDF.js modern viewer at `static/pdf/web/` and a separate PDF.js for flipbook at `static/pdf-flip-book/js/`. Don't unify without testing both modes — different versions / configs.
- **Flipbook params are base64-encoded.** Don't dump the `key=` URL param to logs raw.
- **Flipbook routed through `admin-ajax.php`** with action `get_flipbook_viewer`. If admin-ajax is blocked / aggressively cached, the flipbook iframe won't load.
- **`viewerStyle='flip-book'` + `presentation=false`** is valid but odd — falls back to PDF.js with flipbook-toolbar styles. Prefer `presentation=true` for actual 3D mode.
- **PDFObject fallback** is used by some legacy edge cases. Don't remove `assets/js/vendor/pdfobject.js` even if it looks unused.
- **Iframe sandbox** for the PDF iframe inherits Shortcode.php's wrapper sandbox — tightening that sandbox can break PDF.js's drawing/text-selection (`allow-scripts` is required).
- **Watermark + flipbook together** — watermark text is decoded from `key` in `ep-scripts.js` and overlaid via CSS. If your custom watermark isn't appearing, check `key` was generated with watermark fields populated.
- **Block save() changes break old posts** — see [Gutenberg deprecation discipline](../gutenberg/README.md#deprecation-discipline). Add a `deprecated[]` entry before changing PDF block save().

## Testing

- **Smoke (modern)**: embed PDF, set `viewerStyle='modern'` → PDF.js viewer renders, toolbar shows configured items.
- **Open-at-page**: set `pageNumber=5` → PDF opens at page 5.
- **Smoke (flipbook)**: set `viewerStyle='flip-book'` + `presentation=true` → 3D book renders.
- **A11y**: inspect iframe → `title` attribute present.
- **Pro watermark**: with Pro active, set watermark text + color → renders over both modes.
- **Toolbar position**: switch `position` between top/bottom.
