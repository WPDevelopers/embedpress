---
order: 3
---

# Hooks & Filters Reference

The actions and filters EmbedPress fires that you (or Pro) can hook.

> The hook names below were verified against `EmbedPress/Includes/Classes/Feature_Enhancer.php`, `EmbedPress/Shortcode.php`, `EmbedPress/Core.php`, and `embedpress-pro/includes/Filters/*.php`. Note the inconsistent naming style — historical reasons; do not "normalize" without coordinating with Pro.

## Naming style

Three styles coexist:

- **Colon-separated** (oldest): `embedpress:onAfterEmbed`, `embedpress:onBeforeEmbed`, `embedpress:isEmbra`
- **Slash-separated** (Pro extension hooks): `embedpress/pro_class`, `embedpress/pro_text`, `embedpress/is_allow_rander`, `embedpress/generate_ad_template`, `embedpress/display_password_form`, `embedpress/content_protection_content`, `embedpress/instafeed_reaction_count`, `embedpress/calendly_event_data`, `embedpress/elementor_enhancer_<provider>`
- **Underscore-separated** (newer feature hooks): `embedpress_excluded_height_sources`, `embedpress_should_modify_spotify`, `embedpress_additional_service_providers`, `embedpress_gutenberg_youtube_params`, `embedpress_elementor_embed`

Use the existing style of the area you're hooking — don't introduce a fourth.

## Filters — embed pipeline

### `embedpress:isEmbra`
**Where:** `Shortcode::parseContent`, line 304.
**Signature:** `apply_filters('embedpress:isEmbra', $isEmbra, $url, $atts)`
**Purpose:** Decide whether the URL should be routed to a custom Provider class (returns true) or to WordPress's native `WP_oEmbed::fetch` (returns false).
**Hooked by:** `Feature_Enhancer::isEmbra()` returns true for YouTube, TikTok, Spreaker, GooglePhotos, and the Wrapper fallback.

### `embedpress:onBeforeEmbed`
**Where:** `Shortcode::parseContent`, line 336.
**Purpose:** Pre-embed processing — mutate the request before the provider builds its HTML.

### `embedpress:onAfterEmbed`
**Where:** `Shortcode::parseContent`, line 540.
**Priority:** Feature_Enhancer hooks at priority 90.
**Purpose:** Decorate the rendered HTML — the central extension point.
**Hooked by:** `Feature_Enhancer::enhance_youtube`, `enhance_vimeo`, `enhance_twitch`, `enhance_dailymotion`, `enhance_soundcloud`, `enhance_missing_title`. Pro also hooks here via `Feature_Enhancer_Pro` and per-provider extenders.

```php
add_filter('embedpress:onAfterEmbed', function ($html, $url, $atts) {
    return '<div class="my-wrap">' . $html . '</div>';
}, 100, 3);
```

## Filters — provider registry

### `embedpress_additional_service_providers`
**Where:** `Core::getAdditionalServiceProviders`, line 763.
**Purpose:** Add or modify the URL→Provider class registry.

```php
add_filter('embedpress_additional_service_providers', function ($providers) {
    $providers[\EmbedPress\Providers\My_Provider::class] = ['myhost.com', '*.myhost.com'];
    return $providers;
});
```

## Filters — Pro UI gating

These return strings that Pro flips to empty when active.

### `embedpress/pro_class`
**Default (free):** returns `'pro_class'` so the wrapping element gets locked styling.
**Pro callback:** `Embedpress\Pro\Filters\Utility` returns `''`.

### `embedpress/pro_text`
**Default:** returns `'Pro'` (the badge text).
**Pro callback:** returns `''`.

### `embedpress/pro_label`
Similar — Pro replaces with empty.

### `embedpress/is_allow_rander`
**Purpose:** Should this embed render at all? Used by content protection / license gating to suppress rendering.

## Filters — Pro feature slots

These are real hooks Pro implements. Free defines the slot via `apply_filters` so Pro can fill it; without Pro, the default is a no-op or upsell stub.

| Filter | Where applied (free) | Pro callback |
|---|---|---|
| `embedpress/generate_ad_template` | Showcase Ads template emission | `Filters\Utility::generate_ad_template` |
| `embedpress/display_password_form` | Content Protection password gate | `Filters\Utility::display_password_form` |
| `embedpress/content_protection_content` | Content Protection content swap | `Filters\Utility::content_protection_content` |
| `embedpress/instafeed_reaction_count` | Instagram feed reactions | `Filters\Utility` |
| `embedpress/instafeed_tab_option` | Instagram feed tab option | `Filters\Utility` |
| `embedpress/calendly_event_data` | Calendly event sync | `Filters\Calendly` |
| `embedpress/calendly_sync_button` | Calendly sync UI | `Filters\Calendly` |
| `embedpress/calendly_connect_text_label` | Calendly connect label | `Filters\Calendly` |
| `embedpress/connected_text_label` | Calendly connected state | `Filters\Calendly` |
| `embedpress_google_photos_attributes` | Google Photos attribute map | `Filters\GooglePhotos` |
| `embedpress_google_helper_shortcode` | Google Calendar shortcode | `Filters\Calendar` |
| `embedpress/elementor_enhancer_youtube` | Elementor YT enhancements | `Filters\Elementor_Enhancer_Pro` |
| `embedpress/elementor_enhancer_vimeo` | Elementor Vimeo | same |
| `embedpress/elementor_enhancer_wistia` | Elementor Wistia | same |
| `embedpress/elementor_enhancer_soundcloud` | Elementor SoundCloud | same |
| `embedpress/elementor_enhancer_dailymotion` | Elementor Dailymotion | same |
| `embedpress/elementor_enhancer_twitch` | Elementor Twitch | same |
| `embedpress_enhance_soundcloud` | SoundCloud enhancement | `Filters\Feature_Enhancer_Pro` |
| `embedpress_enhance_dailymotion` | Dailymotion enhancement | `Filters\Feature_Enhancer_Pro` |
| `embedpress_wistia_block_attributes` | Wistia block attribute extension | `Filters\Feature_Enhancer_Pro` |

## Filters — block / shortcode tweaks

### `embedpress_gutenberg_youtube_params`
**Purpose:** Mutate YouTube URL params for Gutenberg renders.

### `embedpress_elementor_embed`
**Where:** `Embedpress_Elementor::render`, around line 4535.
**Purpose:** Decorate the rendered embed object during Elementor render.

### `embedpress_excluded_height_sources`
**Where:** `embedpress.php`.
**Purpose:** List of provider aliases for which we should *not* force a height — defaults include `opensea` and `google-photos`.

### `embedpress_should_modify_spotify`
**Where:** `Shortcode::parseContent`.
**Purpose:** Conditionally wrap Spotify embeds with our own theming.

### `embed_apple_podcast`
**Where:** Shortcode pipeline.
**Hooked by:** `Embedpress\Pro\Filters\Utility`.

## Actions

### `embedpress_before_init`
**Where:** Plugin bootstrap.
**Purpose:** Fires early, before Core/CoreLegacy initialize. Use for very-early registrations.

### `embedpress_cache_cleanup_action`
**Where:** Scheduled cron event (daily).
**Purpose:** Trigger cache cleanup of `/wp-content/uploads/embedpress/`.

### `embedpress_gutenberg_embed`
**Hooked by:** Feature_Enhancer for Gutenberg-specific embed tweaks.

### `embedpress_gutenberg_wistia_block_after_embed`
**Hooked by:** Feature_Enhancer for Wistia block post-processing.

## REST endpoint (free)

Only one routes-level hook surface here:

`POST/GET /embedpress/v1/oembed/{provider}` — `RestAPI::oembed` callback. Internally re-dispatches to `Shortcode::parseContent`.

## How to discover internal hooks

```bash
grep -rn "do_action\|apply_filters" EmbedPress/ | grep -v "^vendor\|node_modules"
```

Many hooks beyond this list exist for narrow purposes; they're not part of the public contract. If you find one you'd like to depend on, file an issue to formalize it.

## Versioning policy

- **Adding a new hook**: never breaks anything.
- **Adding parameters to an existing hook**: backwards-compatible.
- **Removing a hook or removing parameters**: breaking change — only across major versions, and only after Pro and known integrations have migrated.
