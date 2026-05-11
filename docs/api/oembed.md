---
order: 2
---

# oEmbed Integration

EmbedPress hooks WordPress's native oEmbed system so that pasted URLs auto-embed in post content **and** so that the editor's oEmbed preview agrees with what the frontend will render.

## How WP's oEmbed works (recap)

1. A URL on its own line in post content triggers WP's auto-embed pass.
2. WP's `WP_oEmbed` checks the URL against its registered providers list.
3. If a match exists, WP fetches the oEmbed JSON from that provider and uses the returned HTML.

## How EmbedPress changes that

EmbedPress filters `oembed_providers` (and related filters) to:

- Register every host in `providers.php` as known to WP's oEmbed.
- Short-circuit the upstream HTTP fetch — instead, route the URL through our own provider chain (`Core::parseContent`) and return the HTML directly.

This gives us:

- **Consistency**: a YouTube URL renders the same via auto-embed, shortcode, block, and widget.
- **No extra HTTP**: we don't double-fetch when our provider already builds the embed locally.
- **Custom controls applied**: the auto-embedded URL still goes through `Feature_Enhancer`, so site-wide settings (lazy load, share strip, etc.) apply.

## Filters used

| Filter | What we do |
|---|---|
| `oembed_providers` | Add EmbedPress-known hosts |
| `pre_oembed_result` | Short-circuit fetch, return our HTML |
| `embed_oembed_html` | Final HTML decoration |

## When upstream oEmbed actually runs

For URLs that don't match any EmbedPress provider, we fall through to WP's normal oEmbed behavior. The Wrapper provider also doesn't go through oEmbed — it just builds an iframe directly.
