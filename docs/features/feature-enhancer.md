---
order: 9
---

# Feature_Enhancer — the cross-provider decoration pipeline

`EmbedPress/Includes/Classes/Feature_Enhancer.php` is the layer that decorates **all** provider output. It's where most cross-cutting logic (custom player, social share, provider routing, AJAX handlers for PDF / video popup) is wired up.

## Why a pipeline

Providers do one job: turn a URL into base HTML. But customers want all sorts of decoration on top — autoplay flags, share buttons, branding, lazy loading. Putting that into each provider would mean N copies. Instead, providers stay simple and `Feature_Enhancer` runs over their output via the `embedpress:onAfterEmbed` filter.

## How it runs

`Feature_Enhancer` is instantiated in `embedpress.php` (around line 133). Its constructor adds these hooks:

| Hook | Type | Callback |
|---|---|---|
| `embedpress:isEmbra` | filter | `isEmbra()` — decides whether YouTube/TikTok/Spreaker/GooglePhotos/Wrapper should handle the URL |
| `embedpress:onAfterEmbed` | filter (priority 90) | `enhance_youtube`, `enhance_vimeo`, `enhance_twitch`, `enhance_dailymotion`, `enhance_soundcloud`, `enhance_missing_title` |
| `embedpress_gutenberg_youtube_params` | filter | YouTube param injection for blocks |
| `init` | action | Registers the Vimeo Gutenberg block |
| `embedpress_gutenberg_wistia_block_after_embed` | action | Wistia block post-render |
| `elementor/widget/embedpres_elementor/skins_init` | action | `elementor_setting_init` |
| `wp_ajax_youtube_rest_api`, `wp_ajax_nopriv_youtube_rest_api` | action | AJAX handler for YouTube data |
| `embedpress_gutenberg_embed` | action | `gutenberg_embed` |
| `wp_ajax_save_source_data` | action | Caches per-embed metadata to post meta |
| `save_post`, `load-post.php` | action | Source data lifecycle |
| `elementor/editor/after_save` | action | Source data caching for Elementor |
| `wp_head` | action | `embedpress_generate_social_share_meta` |
| (additional `wp_ajax_*` for PDF / flipbook viewers) | action | various |

## isEmbra — the routing decision

`Feature_Enhancer::isEmbra($isEmbra, $url, $atts)` (around line 132) instantiates `Youtube`, `TikTok`, `Spreaker`, `Wrapper`, and `GooglePhotos` provider classes and calls `validateUrl()` on each. If any returns truthy, `isEmbra` returns true and `Shortcode::parseContent` routes through Embera + a custom Provider class. Otherwise, the URL goes through `WP_oEmbed::fetch`.

This means **Feature_Enhancer is the gatekeeper** between "use our Provider" and "use WP's native oEmbed."

## Adding a new cross-provider feature

1. Decide which stage it touches: pre-embed (`embedpress:onBeforeEmbed`), post-embed (`embedpress:onAfterEmbed`), or block-attribute (`embedpress_gutenberg_*`).
2. Add a callback in `Feature_Enhancer` (or as a separate class registered from the same place).
3. Inside the callback, read the relevant attributes; mutate appropriately.
4. Add the corresponding control in the block / widget so users can opt in.
5. If Pro-only: ship the actual mutation in `embedpress-pro/includes/Filters/*` (typically `Feature_Enhancer_Pro` or one of the per-provider extenders); in free, ship a no-op + the upsell UI.

## Pattern: provider-aware vs provider-agnostic

- **Provider-aware** (e.g., YouTube subscriber button): the per-provider `enhance_youtube` method, conditional on URL host or the Embera-resolved provider name.
- **Provider-agnostic** (e.g., share buttons, lazy load): hook `embedpress:onAfterEmbed` and run unconditionally; mutate the wrapper, not the provider HTML.

## Pro counterpart

Pro ships `Embedpress\Pro\Filters\Feature_Enhancer_Pro` (in `embedpress-pro/includes/Filters/Feature_Enhancer_Pro.php`) which hooks complementary actions:

- `embedpress_enhance_soundcloud`
- `embedpress_enhance_dailymotion`
- `embedpress_wistia_block_attributes`

Pro's per-provider extenders (`includes/Providers/Youtube.php`, `Vimeo.php`, etc.) each implement `featureExtend()` that hooks `embedpress:onAfterEmbed` / `:onBeforeEmbed` for their respective providers.
