# Free + Pro Coupling

Pro is a *separate plugin* that requires the free plugin to be active. This document explains the contract that keeps them in sync.

## The rule

> Pro extends free behavior **through filters**. It can ship Provider classes with the same names as free (`Youtube`, `Vimeo`, `Wistia`, …) — they're not forks; they're extenders that register on `embedpress:onAfterEmbed` and friends via a `featureExtend()` static.

## How Pro discovers free

`embedpress-pro.php` checks for free's classes / constants before booting. Without free, Pro's bootstrap shows an admin notice and bails.

## Boot order

```
WordPress loads embedpress.php   (free; alphabetical activation order)
  └─ Core, providers registered, blocks/widgets registered, Feature_Enhancer instantiated
WordPress loads embedpress-pro.php
  └─ Embedpress\Pro\Classes\Bootstrap::instance()
      ├─ load_provider() — instantiates Pro provider extenders, each calling featureExtend()
      │     which add_filter('embedpress:onAfterEmbed', …)
      ├─ instantiates Pro Filters (Feature_Enhancer_Pro, Utility, Calendar, Calendly,
      │     GooglePhotos, Elementor_Enhancer_Pro, Youtube)
      ├─ embedpress_plugin_licensing() — instantiates LicenseManager
      ├─ Pro Elementor extension classes register
      └─ Pro Gutenberg dist bundles enqueue
```

## Standard hook slots free exposes

Free defines these so Pro can extend without forking. **Do not remove them** — Pro silently breaks.

| Hook | Style | Pro callback |
|---|---|---|
| `embedpress:isEmbra` | colon | Free's Feature_Enhancer hook returns true for custom-provider URLs |
| `embedpress:onBeforeEmbed` | colon | Pro pre-processes payloads |
| `embedpress:onAfterEmbed` | colon | Pro provider extenders + Feature_Enhancer_Pro decorate HTML |
| `embedpress/pro_class` | slash | Free returns `'pro_class'`, Pro returns `''` |
| `embedpress/pro_text` | slash | Free returns `'Pro'`, Pro returns `''` |
| `embedpress/pro_label` | slash | Pro returns `''` |
| `embedpress/is_allow_rander` | slash | Pro evaluates content-protection / license gates |
| `embedpress/generate_ad_template` | slash | Pro emits Showcase Ads template |
| `embedpress/display_password_form` | slash | Pro emits Content Protection form |
| `embedpress/content_protection_content` | slash | Pro AES-decrypts protected payload |
| `embedpress/instafeed_*` | slash | Pro Instagram feed fields |
| `embedpress/calendly_*` | slash | Pro Calendly integration |
| `embedpress_google_photos_attributes` | underscore | Pro Google Photos attribute mapping |
| `embedpress_google_helper_shortcode` | underscore | Pro Google Calendar shortcode |
| `embedpress/elementor_enhancer_<provider>` | slash | Pro Elementor controls per provider |
| `embedpress_enhance_<provider>` | underscore | Pro provider-specific decoration |

JS-side hooks (`@wordpress/hooks`) follow similar split styles. Free emits placeholder controls via `applyFilters('embedpress.selectPlaceholder', …)` and Pro substitutes real options. Without Pro, the placeholder shows upsell copy.

## Upsell pattern

Free ships UI for many Pro features rendered with a `pro_class` wrapper:

1. Free renders the control inside an element whose class comes from `apply_filters('embedpress/pro_class', 'pro_class')`.
2. CSS tints the locked control and overlays a "Pro" badge.
3. Free's filter callback returns `'pro_class'`. Pro's filter callback returns `''`.
4. With Pro active, the wrapper class is empty; styling drops; the control becomes interactive.

Same UI source code powers both the locked and unlocked states.

## What Pro is allowed to do that may surprise you

- **Ship Provider classes named like free's.** `embedpress-pro/includes/Providers/Youtube.php` exists; it doesn't conflict with free's `EmbedPress/Providers/Youtube.php` because the namespaces differ (`Embedpress\Pro\Providers\Youtube` vs `EmbedPress\Providers\Youtube`) and the Pro one only registers filter callbacks — it never gets routed to by Embera.
- **Hook the same filter from multiple Pro callbacks.** Pro's per-provider extenders + Feature_Enhancer_Pro can both hook `embedpress:onAfterEmbed`. Priorities determine order.

## Anti-patterns

- **Don't `require` a free file from Pro.** Use class lookups + filter hooks.
- **Don't redefine free constants in Pro.** Free is loaded first and owns them.
- **Don't write to free option keys from Pro.** All Pro state goes under `embedpress_pro_*`.
- **Don't add a Pro REST namespace for features.** Pro currently only ships license routes via the bundled `WPDeveloper\Licensing\RESTApi`. New routes should be discussed before adding a separate namespace.

## When you change a free hook signature

Adding parameters is safe. Removing or reordering breaks Pro silently. If you must change a signature:

1. Keep the old hook firing with the old signature.
2. Add a new hook with the new signature.
3. Open a tracking ticket to migrate Pro to the new hook.
4. After Pro ships the migration, remove the old hook in a major version.
