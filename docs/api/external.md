# External Service Calls

Most providers don't make network calls — they construct an iframe URL from the user-supplied URL and let the browser do the loading. A few do need server-side fetches.

## Providers that fetch

| Provider | Why it fetches |
|---|---|
| **GooglePhotos** | Albums require scraping the share URL to derive the embeddable HTML. |
| **OpenSea** | Server-side resolves NFT metadata for the widget. |
| **GettyImages** | Resolves image metadata. |
| **Wrapper (rare)** | Some Wrapper variants probe the URL to determine content type. |

## Pro-only fetches

| Module | Why |
|---|---|
| **Broken Embeds Detector** | HEAD / oEmbed probe to determine if an embedded URL is dead. |
| **Country Restriction (Custom Player)** | GeoIP lookup for visitor (or via JS) |

## How we make HTTP calls

Always via `wp_remote_get` / `wp_remote_post` — never `curl_init` directly. This:

- Respects WP's HTTP API filters.
- Honors site proxy settings.
- Lets test suites mock cleanly.

```php
$response = wp_remote_get($url, [
    'timeout'    => 5,
    'redirection'=> 3,
    'user-agent' => 'Mozilla/5.0 (compatible; EmbedPress/' . EMBEDPRESS_PLUGIN_VERSION . ')',
]);

if (is_wp_error($response)) {
    return /* fallback */;
}

$code = wp_remote_retrieve_response_code($response);
$body = wp_remote_retrieve_body($response);
```

## User-Agent string

We lead with `Mozilla/5.0 (compatible; …)` because some hosts (Cloudflare-fronted, Google) actively block obvious bot UAs. Without the Mozilla prefix you get spurious 403s on URLs that work fine in a browser.

## Error handling

Treat anything except a clean 200 as inconclusive, not broken. The Broken Embeds Detector explicitly maps 401/403/405/406/429/5xx to `STATUS_UNKNOWN` — only 404 and 410 are confidently "broken." See the [feature notes](../features/) for the rationale.

## Same-origin special-case

Self-hosted URLs (host matches `home_url()` or `site_url()`) should never be probed. PHP can't reliably reach `localhost:8080` from inside a Docker container, and many production setups have no hairpin NAT. The detector short-circuits same-origin URLs to "OK / self-hosted-skipped."

## Caching

Provider fetches that are deterministic (e.g., Google Photos album HTML) are cached with WP transients. Cache TTL defaults to 12 hours; configurable per provider.
