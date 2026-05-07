# Universal Wrapper

The fallback provider. Lets users embed any URL when no specific provider matches. Implemented as `EmbedPress\Providers\Wrapper` with a permissive URL regex; rendered as a sandboxed iframe.

## Why we ship it

Customers paste arbitrary URLs constantly. Without a fallback, EmbedPress would say "we don't support that source" and the user would leave. Wrapper catches everything and tries to render *something* useful — usually a sandboxed iframe pointing at the URL.

## Architecture

```
   User pastes URL → oEmbed pipeline
                         │
                         ▼
   add_filter('oembed_providers', addOEmbedProviders)
   (Core.php:137 — registers Wrapper LAST)
                         │
                         ▼
   ProviderAdapter::match(url) iterates registered providers
                         │
                         ▼
   No specific provider matches
                         │
                         ▼
   Wrapper.php:43-46 regex matches:
   /^(https?:\/\/)?(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i
                         │
                         ▼
   modifyResponse() returns fake oEmbed payload (Wrapper.php:68-71)
   with empty html — Shortcode.php replaces with sandboxed iframe
                         │
                         ▼
   <div class="embedpress-wrapper ose-embedpress-responsive">
     <iframe src="<url>" sandbox="…" allowFullScreen></iframe>
   </div>
```

## Code paths

| File | Role |
|---|---|
| `EmbedPress/Providers/Wrapper.php` | Provider class. Match regex (~L43-46). Fake oEmbed response (~L68-71). |
| `EmbedPress/Core.php` (~L137) | `add_filter('oembed_providers', [$this, 'addOEmbedProviders'])` — registers Wrapper at the end |
| `EmbedPress/Shortcode.php` (~L300-400) | Renders the iframe with sandbox attributes |
| `assets/css/embedpress.css` (~L1360+) | `.embedpress-wrapper` + `.ose-embedpress-responsive` responsive container |

## Output

Default sandbox: `allow-modals allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox`. Plus `allowFullScreen="true"` and a configurable width/height wrapper.

```html
<div class="embedpress-wrapper ose-embedpress-responsive">
    <iframe src="<URL>"
            width="600" height="400"
            sandbox="allow-modals allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            allowfullscreen></iframe>
</div>
```

The wrapper **does not** strip `X-Frame-Options` headers (it can't — that's a browser-enforced rule). If the target host responds `DENY` or `SAMEORIGIN`, the iframe renders blank with no useful error.

## Common pitfalls

- **`X-Frame-Options: DENY` / `SAMEORIGIN` headers** are common on news sites, banking, social media. Wrapper can't bypass them. When customers report "the embed is blank", check the target's response headers before diagnosing further.
- **CSP `frame-ancestors`** is the modern equivalent and is just as binding.
- **The match regex is permissive** (any `http(s)://host/.../...`). Deliberate — it's the fallback. But malformed URLs sometimes match and produce broken iframes. Don't tighten without checking the test suite.
- **Wrapper is registered LAST.** If you accidentally register a new specific provider AFTER Wrapper in `Core.php:137`, that provider will never match. Always insert above the Wrapper line.
- **`modifyResponse()` returns empty HTML** — the actual iframe is built by `Shortcode.php`. Don't try to inject markup into the oEmbed payload.
- **No proxy / no SSR.** EmbedPress doesn't fetch and re-serve the URL — it's pure client-side iframing. Don't recommend Wrapper for sites that require auth.
- **Sandbox is wrapper-wide.** The same sandbox is used for every Wrapper embed. Tightening it (removing `allow-scripts`) breaks most pages; loosening it (`allow-top-navigation`) is risky. Leave it alone unless responding to a specific report.

## When to graduate to a real provider

If you find yourself supporting many URLs from one host through Wrapper, that host deserves a real provider. The signs:

- Customers report the iframe doesn't load → upstream blocks framing → you need a real provider that uses their official embed endpoint.
- Customers want platform-specific controls (autoplay, color, …).

## Testing

- **Frame-friendly site**: paste e.g. `https://example.com/` → renders inside wrapper.
- **Frame-blocked site**: paste `https://www.google.com/` → iframe blank (Google sets `X-Frame-Options`). Expected, not a bug.
- **Custom dimensions**: set wrapper width/height → iframe respects them.
- **Sandbox**: inspect rendered iframe → expected sandbox tokens present.
