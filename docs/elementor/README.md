# Elementor Architecture

How EmbedPress integrates with the Elementor page builder.

## What ships

Five Elementor widgets, all registered via `Embedpress_Elementor_Integration::register_widget()` (in `EmbedPress/Elementor/Embedpress_Elementor_Integration.php`). All extend `\Elementor\Widget_Base` directly — there is **no inheritance** between them.

| Widget file | `get_name()` | Role |
|---|---|---|
| `Widgets/Embedpress_Elementor.php` (~4900 lines) | `embedpres_elementor` | Multi-provider main widget (16+ providers) |
| `Widgets/Embedpress_Document.php` | `embedpres_document` | DOC / PPT / XLS via Google Docs Viewer |
| `Widgets/Embedpress_Pdf.php` | `embedpress_pdf` | Dedicated PDF (PDF.js / flipbook) |
| `Widgets/Embedpress_Pdf_Gallery.php` | `embedpress_pdf_gallery` | PDF gallery with thumbnail generation |
| `Widgets/Embedpress_Calendar.php` | `embedpress_calendar` | Google Calendar via FullCalendar |

> Note the `embedpres_elementor` and `embedpres_document` typos (missing 's'). Preserved for back-compat — do not "fix."

Registration is gated per-widget by the `embedpress:elements[elementor]` option, so users can disable individual widgets from settings.

## Anatomy of the main widget

`Embedpress_Elementor.php` is the largest file in the plugin (~4900 lines) because **every supported provider's controls live in it**. It does not delegate per-provider widgets; it has one big `register_controls()` with **provider-centric sections** organized roughly:

```
register_controls()
    embedpress_elementor_content_settings        (general — source dropdown, URL)
    embedpress_yt_channel_section                (YouTube)
    embedpress_yt_subscription_section           (YouTube subscriber button)
    embedpress_yt_livechat_section               (YouTube live chat — Pro)
    embedpress_opensea_control_section           (OpenSea)
    (Vimeo / SoundCloud / Instagram / Twitch / Dailymotion / Wistia / Meetup
     / Calendly / Spreaker / Google Photos / self-hosted / Spotify / Apple Podcasts)
    embedpress_protect_content_section           (Content Protection)
    embedpress_share_content_section             (Social Share)
    embedpress_custom_player_settings            (Plyr Custom Player)
    embedpress_gallery_setting_section           (Gallery / grid)
    embedpress_responsive_design_section         (Mobile / tablet sizing)
    embedpress_advanced_setting_section
    (style sections — borders, shadows, etc.)
```

Most provider sections show only when the user-pasted URL matches that provider. Elementor renders this with `condition` arrays per control.

### Render

`Embedpress_Elementor::render()` (around line 4414) is a thin presentation layer over `Shortcode::parseContent`:

```php
$_settings    = $this->convert_settings($settings);
$source_data  = Helper::get_source_data(/* … */);
$embed_content = Shortcode::parseContent($settings['embedpress_embeded_link'], true, $_settings);
$embed_content = $this->onAfterEmbedSpotify($embed_content, $settings);
$embed         = apply_filters('embedpress_elementor_embed', $embed_content, $settings);
```

The widget converts Elementor controls to shortcode-style attributes via `convert_settings`, then hands off to the same `parseContent` pipeline that powers blocks and shortcodes.

### Pro upsell wrapping

Pro-only controls are rendered with a CSS class derived from `apply_filters('embedpress/pro_class', 'pro_class')`. Free's filter returns `'pro_class'`; Pro's returns `''`. Same control source, different visual state based on whether Pro is active.

## Specialized widgets

The four specialized widgets are independent — they don't share code with the main widget:

- **`Embedpress_Document`** — multi-format docs via iframe (Google Docs Viewer or Office Online when Pro is active).
- **`Embedpress_Pdf`** — PDF.js + 3D flipbook mode; supports media library upload + external URL.
- **`Embedpress_Pdf_Gallery`** — multi-PDF gallery with thumbnail generation (Imagick / WP preview) and grid/carousel layout.
- **`Embedpress_Calendar`** — FullCalendar4 + Google Calendar ICS parsing.

Each defines its own `register_controls()` and `render()` — they don't go through `Shortcode::parseContent` because they don't need provider routing.

## Pro extension

Pro's Elementor extension lives in `embedpress-pro/includes/Elementor/` and `embedpress-pro/includes/Filters/Elementor_Enhancer_Pro.php`. Pro hooks per-widget Elementor extension points (`elementor/element/embedpres_elementor/section_*/before_section_end`) plus `embedpress/elementor_enhancer_<provider>` to inject Pro controls — it never edits the free widget files.

## Elementor_Upsale

`EmbedPress/Elementor/Elementor_Upsale.php` injects an upsell sidebar in the Elementor editor: 5-star rating, mini analytics pie-chart, "Upgrade to Pro" CTA, "Let's Chat" support button. Loaded on `elementor/editor/after_enqueue_scripts`.

## Adding a new control

1. Decide which `register_*_section` it belongs to in `Embedpress_Elementor.php`.
2. Add `$this->add_control(...)` with conditions for when it should show.
3. Map it in `convert_settings()` so it ends up in the shortcode-style attribute array.
4. Implement the actual behavior in `Feature_Enhancer` (free) or as a Pro filter callback.
5. If it's Pro-only, set `'classes' => apply_filters('embedpress/pro_class', 'pro_class')` and ship the live implementation in Pro.

## Common gotchas

- **Widget names use the typo'd `embedpres_*` form.** Don't silently rename — existing customer pages reference the typo'd names.
- **Elementor control key `custom_payer_preset`** is also misspelled (in the YouTube preset section, ~line 378). Same back-compat reason.
- **OpenSea `ep-preset-1` / `-2` classes** at ~line 1915 are unrelated to the Custom Player presets. Don't conflate.
- **Specialized widgets don't extend the main one.** If you're tempted to share code, factor into a trait under `EmbedPress/Elementor/Traits/`.
