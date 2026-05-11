---
order: 2
---

# PDF Gallery

Multi-PDF gallery with four layouts (grid, masonry, carousel, bookshelf) and per-item custom thumbnails. Free, shipped 4.5.0. Block name `embedpress/pdf-gallery`.

The gallery is essentially a **chooser around the existing PDF viewer** — clicking a card opens the PDF in a lightbox modal that uses the same PDF.js / 3D flipbook pipeline as the standalone [PDF block](pdf.md).

## Architecture

```
   Block: embedpress/pdf-gallery
   pdfItems: [ { id, url, fileName, customThumbnailId, customThumbnailUrl } ]
                    │
                    ▼
   Server render: render_pdf_gallery()
                  EmbedPressBlockRenderer.php:74
                    │
                    ▼
   For each item:
     - Generate or reuse thumbnail (Pdf_Thumbnail_Handler.php)
        ├── WP-managed preview (if attachment exists)
        └── Imagick fallback (server-side render of page 1)
                    │
                    ▼
   Layout shell (grid / masonry / carousel / bookshelf) wraps cards
                    │
                    ▼
   Frontend: static/js/pdf-gallery.js
   Click → static/js/ep-pdf-lightbox.js
                    │
                    ▼
   Lightbox modal opens chosen PDF using PDF.js or 3D flipbook
   (viewer settings inherited from gallery block attrs)
```

## Code paths

| File | Role |
|---|---|
| `src/Blocks/pdf-gallery/block.json` | Block manifest |
| `src/Blocks/pdf-gallery/src/index.js` | Block registration |
| `src/Blocks/pdf-gallery/src/components/attributes.js` | Full schema |
| `src/Blocks/pdf-gallery/src/components/edit.js` | Gallery builder UI |
| `src/Blocks/pdf-gallery/src/components/save.js` | Save HTML |
| `src/Blocks/pdf-gallery/src/inspector.js` | Inspector |
| `EmbedPress/Elementor/Widgets/Embedpress_Pdf_Gallery.php` | Elementor widget |
| `EmbedPress/Gutenberg/EmbedPressBlockRenderer.php::render_pdf_gallery` (~L74) | Server render |
| `EmbedPress/Includes/Classes/Pdf_Thumbnail_Handler.php` | AJAX thumbnail generator + Imagick fallback |
| `EmbedPress/Gutenberg/BlockManager.php` (~L115-116) | Registers AJAX actions: `ep_generate_pdf_thumbnail`, `ep_upload_pdf_thumbnail` |
| `static/js/pdf-gallery.js` | Frontend gallery init |
| `static/js/pdf-gallery-elementor-editor.js` | Elementor editor multiselect handler |
| `static/js/ep-pdf-lightbox.js` | Lightbox modal — opens picked PDF |

## Block attributes

| Attribute | Type | Purpose |
|---|---|---|
| `pdfItems` | `[{id, url, fileName, customThumbnailId, customThumbnailUrl}]` | The PDFs |
| `layout` | `'grid' \| 'masonry' \| 'carousel' \| 'bookshelf'` | Layout |
| `columns`, `columnsTablet`, `columnsMobile` | number | Responsive grid |
| `gap` | number | Spacing |
| `thumbnailAspectRatio` | string | E.g. `'4:3'` |
| `playButtonIcon` | `'play' \| 'eye' \| 'document' \| 'none'` | Hover icon |
| `playButtonColor`, `playButtonSize`, `playButtonBg`, `playButtonShape` | mixed | Play button styling |
| `hoverOverlayColor` | hex | Hover overlay |
| `playButtonAlwaysShow` | bool | Don't require hover |
| `carouselAutoplay`, `carouselAutoplaySpeed`, `carouselLoop`, `carouselArrows`, `carouselDots`, `slidesPerView` | mixed | Carousel options (Glider) |
| Viewer settings (`viewerStyle`, `themeMode`, `customColor`, `toolbar`, `position`, `presentation`, `download`, `copy_text`, …) | mixed | Same as PDF block — applied to lightbox |
| **Pro:** `watermarkText`, `watermarkFontSize`, `watermarkColor`, `watermarkOpacity` | mixed | Watermark in lightbox |
| `powered_by` | bool | Show "Powered by EmbedPress" credit |

## Thumbnail pipeline

`Pdf_Thumbnail_Handler.php` exposes two AJAX actions registered in `BlockManager.php`:

- `ep_generate_pdf_thumbnail` — server-side PDF page 1 → image:
  1. Look up WP-managed attachment preview if attachment exists.
  2. Imagick fallback (`Imagick->setImageFormat('jpeg')`).
- `ep_upload_pdf_thumbnail` — accept user-uploaded custom thumbnail → store as attachment, return URL/id.

If both fail, the card falls back to the play button icon over the layout's default background.

## Lightbox modal

`static/js/ep-pdf-lightbox.js` listens for clicks on `.ep-pdf-gallery-item`, reads the gallery block's viewer attrs from `data-` attributes, and renders the same iframe the standalone PDF block would. All viewer-side features (watermark, branding, content protection — Pro) work the same way.

## Free vs Pro

| Capability | Free | Pro |
|---|---|---|
| All four layouts | ✓ | ✓ |
| Custom thumbnails | ✓ | ✓ |
| Carousel autoplay/arrows/dots | ✓ | ✓ |
| Watermark (text only) | ✓ | – |
| Watermark (full options) | – | ✓ |
| Custom logo overlay | – | ✓ |
| Content protection | – | ✓ |

## Common pitfalls

- **Imagick may not be installed.** Without Imagick, server-side thumbnail fallback fails — cards show icon-only fallback. Don't add a hard error; degrade silently.
- **`pdfItems` is an array of objects, not just URLs.** When migrating attributes, preserve `customThumbnailId`/`customThumbnailUrl` to avoid regenerating thumbnails.
- **Carousel uses Glider.** Glider has known limitations on touch — test on real mobile, not just dev tools.
- **Lightbox inherits viewer attrs from the gallery block, not from the picked PDF.** Setting toolbar position on the gallery affects every PDF opened via lightbox uniformly. There's no per-item viewer override.
- **Open-at-page in the lightbox is fixed at 1** — `pageNumber` from the gallery block is not passed through.
- **Bookshelf layout is purely CSS-based** — no special JS. If books look squished, check `thumbnailAspectRatio`.
- **Per-item `playButtonIcon='none'`** doesn't exist — that toggle is gallery-wide. Hide via custom CSS scoped by item id.

## Testing

- **Smoke**: insert PDF Gallery block, add 3 PDFs, layout=grid → 3 cards with thumbnails.
- **Custom thumbnail**: upload custom image to one item → that card uses the custom image.
- **Lightbox**: click any card → modal opens with PDF.js viewer.
- **Carousel**: switch layout to carousel → arrows + dots work; autoplay rotates.
- **Imagick missing**: simulate by removing imagick extension → server thumbnails fall back to icon view, no JS error.
- **Pro lightbox watermark**: with Pro, set watermark → appears in opened PDF.
