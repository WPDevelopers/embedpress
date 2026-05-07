---
order: 4
---

# Document Block

Block name `embedpress/document`. Embeds DOC / DOCX / PPT / PPTX / XLS / XLSX / PDF using one of three viewers depending on format and license.

## Viewer routing

`docViewer` modes:

| Mode | Renderer | When |
|---|---|---|
| `'custom'` | EmbedPress PDF.js | PDFs only |
| `'office'` | **Office Online** (Pro) | Office formats (DOC, DOCX, PPT, PPTX, XLS, XLSX) |
| `'google'` | Google Viewer | Fallback for non-PDF without Pro |

The routing logic lives in `Shortcode.php::do_shortcode_doc` (~L1496+):

1. Detect MIME type / extension from `href`.
2. If PDF → defer to PDF block render path.
3. Else if `docViewer='office'` and Pro active → Office Online URL: `https://view.officeapps.live.com/op/embed.aspx?src=<url>`.
4. Else → Google Viewer URL: `https://docs.google.com/gview?url=<url>&embedded=true`.

> **Google Viewer is officially deprecated** by Google for new sources. Treat it as best-effort fallback only — don't rely on it for SLA-critical embeds.

## Free vs Pro

| Capability | Free | Pro |
|---|---|---|
| PDF via PDF.js or flipbook | ✓ | ✓ |
| Office Online viewer (clean Office rendering) | – | ✓ |
| Google Viewer fallback | ✓ | ✓ |
| Custom logo overlay | – | ✓ |
| Content protection | – | ✓ |

## Code paths

| File | Role |
|---|---|
| `src/Blocks/document/block.json` | Block manifest — "Embed documents like PDF, DOC, PPT, XLS" |
| `src/Blocks/document/src/components/attributes.js` | Unified attributes |
| `src/Blocks/document/src/components/PDFViewer.js` | Editor preview |
| `EmbedPress/Elementor/Widgets/Embedpress_Pdf.php` | Elementor widget for PDFs (free) |
| `EmbedPress/Elementor/Widgets/Embedpress_Document.php` | Elementor widget for non-PDF docs (Pro) |
| `EmbedPress/Gutenberg/EmbedPressBlockRenderer.php::render_document` (~L443) | Server render |
| `EmbedPress/Shortcode.php::do_shortcode_doc` (~L1496+) | MIME detection + viewer routing |

## Block attributes

| Attribute | Type | Purpose |
|---|---|---|
| `href` | string | File URL |
| `docViewer` | `'custom' \| 'google' \| 'office'` | Viewer selector |
| `presentation` | bool | Enables 3D flipbook for PDFs |
| `themeMode`, `customColor`, `toolbar`, `position`, `download`, `copy_text`, `draw`, `doc_rotation` | mixed | Shared with PDF block |
| **Pro:** `customlogo`, `logoX`, `logoY`, `customlogoUrl`, `logoOpacity` | mixed | Custom logo overlay |

## Common pitfalls

- **Google Viewer is officially deprecated.** Customer-facing SLA-critical embeds should use Pro + Office Online.
- **Office Online URL must be public.** Office Online fetches the file server-side, so behind-auth URLs return blank. For private docs, use Pro + a public asset URL.
- **PPTX in Office Online doesn't always honour `allowfullscreen`** — common cases work after the 4.4.10 fix, but not all. If a customer reports fullscreen failing, check the host's CSP / Permissions-Policy first.
- **`docViewer='custom'` + non-PDF** is invalid but not validated. The block lets you save it, then renders blank. Validate at attribute set time.
- **Office Online has a 10 MB limit** for direct embed. Larger files won't render; fall back to download link.
- **PDF path is shared** with the [PDF feature](pdf.md) — don't duplicate fixes.
- **Cross-origin restrictions**. If the document URL is on a host with `X-Frame-Options: DENY`, none of the three viewers will work — that's outside EmbedPress's control.

## Testing

- **PDF**: embed a PDF URL → routes to PDF.js viewer.
- **PPTX (Pro)**: embed a public `.pptx` URL with `docViewer='office'` → Office Online iframe.
- **PPTX (free)**: same URL with `docViewer='google'` → Google Viewer iframe (may flake).
- **Fullscreen**: PPTX in Office Online → click fullscreen, verify it works.
- **Custom logo**: with Pro, set logo → overlay appears bottom-right of the iframe.
