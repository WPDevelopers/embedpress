---
order: 1
---

# Data Flow

How does a URL become a rendered embed? Let's follow one.

> The dispatch entry point you'll see referenced everywhere is **`Shortcode::parseContent`** (in `EmbedPress/Shortcode.php`, ~line 265). Despite the file name, it's not just for shortcodes — blocks and Elementor widgets call it too.

## Example: a YouTube URL pasted into the EmbedPress block

```
User pastes  https://www.youtube.com/watch?v=abc123  into the EmbedPress block.
```

### 1. Block captures intent (browser)

The user adds the generic `embedpress/embedpress` block (handles 250+ providers) and types/pastes the URL. Block attributes (autoplay, controls, custom player options, etc.) are stored in post content.

### 2. Server-side render (PHP)

When the post renders, WordPress invokes the block's `render_callback`, which is `EmbedPressBlockRenderer::render` for the generic block (per-block callbacks exist for the specialized blocks — see [Gutenberg](../gutenberg/README.md)).

Inside `render`:

1. Read attributes (URL, client ID, options).
2. Run content-protection gate (`extract_protection_data` + `should_display_content`).
3. Either render the cached `embedHTML` attribute via `render_embed_html`, or fall through to dynamic rendering.
4. Dynamic rendering ultimately calls `Shortcode::parseContent($url, true, $atts)`.

### 3. The `parseContent` pipeline

`EmbedPress\Shortcode::parseContent` is the central URL→HTML transformer.

```
parseContent($subject, $stripNewLine, $customAttributes)
    │
    ├─ extract URL from $subject (preg_replace)
    ├─ parseContentAttributes()  — normalize $atts
    ├─ set_embera_settings()      — configure the Embera oEmbed lib
    │
    ├─ apply_filters('embedpress:isEmbra', false, $url, $atts)
    │       └─ Feature_Enhancer::isEmbra returns true if YouTube/TikTok/Spreaker/GooglePhotos/Wrapper match
    │
    ├─ if isEmbra:
    │     route to Embera → an EmbedPress\Providers\* class builds the iframe
    │   else:
    │     route to WP_oEmbed::fetch → upstream oEmbed endpoint
    │
    ├─ apply_filters('embedpress:onBeforeEmbed', …)   — pre-process
    ├─ get_url_data() / get_content_from_template()    — produce HTML, wrap in
    │       <div class="ose-{provider} ose-embedpress-responsive" …>{html}</div>
    │
    ├─ apply_filters('pp_embed_parsed_content', …)     — AMP compat
    ├─ apply_filters('embedpress:onAfterEmbed', …)     — Feature_Enhancer + Pro decorate
    │
    └─ return wrapper + decorated HTML
```

### 4. Frontend runtime (browser)

`Core/AssetManager.php` enqueues bundles only when an embed marker is present in the page. The `data-options` attribute on `.ep-embed-content-wraper` carries Custom Player JSON that the Plyr runtime parses on `DOMContentLoaded`.

## The other entry points, condensed

### Elementor widget

The main Elementor widget (`Embedpress_Elementor`, in `EmbedPress/Elementor/Widgets/Embedpress_Elementor.php`, ~4900 lines) collects controls into shortcode-style attributes via `convert_settings`, then in `render` (around line 4533) calls:

```php
$embed_content = Shortcode::parseContent($settings['embedpress_embeded_link'], true, $_settings);
```

So Elementor and Gutenberg both funnel through the same `parseContent`.

### Classic shortcode

`[embedpress]` / `[embed]` are registered to `Shortcode::do_shortcode`, which calls `parseContent` directly.

### Auto-embed

Filtered through WP's oEmbed — EmbedPress registers itself as the oEmbed provider for every host in `providers.php` and routes the response back through `parseContent` via the REST endpoint `/embedpress/v1/oembed/{provider}` (handled by `RestAPI::oembed`).

## Where Pro hooks in

Pro never reaches into Core. It registers filter callbacks during `Bootstrap::__construct()` and lets the free pipeline call them. The most important hook points:

| Hook | Style | Pro use |
|---|---|---|
| `embedpress:onAfterEmbed` | colon | Per-provider extenders (`Providers\Youtube::onAfterEmbed`, etc.) |
| `embedpress/pro_class`, `embedpress/pro_text` | slash | Drop locked-state styling |
| `embedpress/is_allow_rander` | slash | License / protection gating |
| `embedpress/generate_ad_template` | slash | Showcase Ads injection |
| `embedpress/display_password_form` | slash | Content Protection form |
| `embedpress/elementor_enhancer_<provider>` | slash | Elementor widget extra controls |
| `embedpress_enhance_<provider>` | underscore | Provider-specific Pro params |

See [Free + Pro Coupling](free-pro-coupling.md) and [Hooks Reference](../guides/hooks-and-filters.md) for the full list.

## Mental model: layers, not files

Don't think *"where does this live?"* — think *"which layer is this?"* Then the file location follows:

- **User intent** → editor source (`src/Blocks/...`, `EmbedPress/Elementor/...`)
- **URL → provider routing** → `providers.php` + `Core::getAdditionalServiceProviders` + `Feature_Enhancer::isEmbra`
- **The actual URL→HTML pipeline** → **`Shortcode::parseContent`** (regardless of caller)
- **Provider-specific embed HTML** → `EmbedPress/Providers/<Name>.php`
- **Cross-provider decoration** → `Feature_Enhancer` (free) and `Filters/Feature_Enhancer_Pro` + per-provider Pro extenders
- **Browser-side behavior** → `src/Frontend/...` → `assets/js/...` (enqueued by `Core/AssetManager.php`)

When you can't find something, identify the layer first.
