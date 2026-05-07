# Classic Shortcodes

Shortcodes are the original entry point. Five are registered.

## Registered shortcodes

In `EmbedPress\Shortcode::register()` (around line 79):

| Shortcode | Handler | Purpose |
|---|---|---|
| `[embed]` | `Shortcode::do_shortcode` | WP-core compatibility — overrides core's `[embed]` so EmbedPress's pipeline runs |
| `[embed_oembed_html]` | `Shortcode::do_shortcode` | Internal alias used during oEmbed result processing |
| `[embedpress]` | `Shortcode::do_shortcode` | Primary shortcode — generic for any provider |
| `[embedpress_pdf]` | `Shortcode::do_shortcode_pdf` | Dedicated PDF viewer (PDF.js or 3D flipbook) |
| `[embedpress_doc]` | `Shortcode::do_shortcode_doc` | DOC / DOCX / PPT / PPTX / XLS / XLSX viewer |
| `[embedpress_pdf_gallery]` | `Shortcode::do_shortcode_pdf_gallery` | Multi-PDF gallery with carousel/grid layout |

## Forms

```
[embedpress]https://www.youtube.com/watch?v=abc123[/embedpress]

[embedpress width="640" height="360"]https://vimeo.com/123[/embedpress]

[embed]https://youtu.be/abc123[/embed]

[embedpress_pdf src="https://example.com/file.pdf" width="600" height="700"]

[embedpress_doc src="https://example.com/file.pptx"]

[embedpress_pdf_gallery ...]
```

## Generic dispatch flow

`do_shortcode($atts, $subject)` (around line 172):

1. Parse ACF dynamic fields if any (lines 193–206).
2. Call `parseContent($subject, $stripNewLine, $atts)`.
3. If content protection is on, short-circuit early (lines 231–242).
4. Return wrapped HTML.

`parseContent` is the central pipeline — see [Data Flow](data-flow.md).

## Specialized shortcode flows

`do_shortcode_pdf` (lines 1312–1494) and `do_shortcode_doc` (lines 1496–1606) bypass `parseContent` and emit dedicated viewer iframes directly (PDF.js viewer URL, Google Docs Viewer URL, Office Online when Pro is active). They handle their own attribute set (toolbar position, theme color, watermark, draw, copy, download toggles…).

`do_shortcode_pdf_gallery` (lines 1608–1812) renders a list of PDFs in a carousel/grid wrapper with a lightbox modal — same approach.

## Why we still ship classic shortcodes

Customer posts written in 2017 still embed via shortcode. Removing the handler would silently break those posts. The maintenance cost is low because the generic path (`[embedpress]` / `[embed]`) reuses the same `parseContent` that blocks and Elementor use.
