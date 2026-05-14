# Adding a New Provider

Step-by-step: ship a new embed source.

## Before you start

1. Confirm the upstream service exposes a public embed URL or oEmbed endpoint. If they require an API key with per-request server calls, you're building a more complex integration — most providers are pure iframe wrappers.
2. Check that no existing provider already matches the URLs you'll target. Run `grep -r "<host>" EmbedPress/Providers providers.php`.
3. Decide which **editor surfaces** the new provider needs to appear in — sometimes you only need shortcode/auto-embed (cheap), sometimes you need a dedicated block (more work).

## The fast path (auto-embed + shortcode only)

Use this when you just want pasted URLs to "just work" without a dedicated block or widget.

### Step 1 — Scaffold

From the docker repo:

```bash
make shell
scripts/new-provider.sh AcmeVideo
```

This creates `EmbedPress/Providers/AcmeVideo.php` from a template.

(If you don't use the script, copy an existing simple provider like `Calendly.php` or `Boomplay.php` and rename.)

### Step 2 — Fill in the methods

```php
namespace EmbedPress\Providers;

use Embera\Adapters\Service as EmberaService;

class AcmeVideo extends EmberaService
{
    public function validateUrl(\Embera\Url $url)
    {
        // Be tight. Reject anything that's not /watch/<id>.
        return preg_match(
            '~^https?://(www\.)?acmevideo\.com/watch/(?P<id>[A-Za-z0-9_-]+)~i',
            (string) $url,
            $m
        );
    }

    protected function modifyResponse(array $response = [])
    {
        preg_match(
            '~/watch/(?P<id>[A-Za-z0-9_-]+)~',
            (string) $this->url,
            $m
        );
        $id = $m['id'] ?? '';

        $embedUrl = sprintf('https://acmevideo.com/embed/%s', $id);

        $response['html'] = sprintf(
            '<iframe src="%s" width="%d" height="%d" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>',
            esc_url($embedUrl),
            $this->getWidth(),
            $this->getHeight()
        );
        $response['type'] = 'video';
        $response['provider_name'] = 'AcmeVideo';
        return $response;
    }
}
```

### Step 3 — Register in `providers.php`

```php
EMBEDPRESS_NAMESPACE . "\\Providers\\AcmeVideo"
    => ["acmevideo.com", "*.acmevideo.com"],
```

### Step 4 — Smoke test

```bash
make wp ARG="post create --post_type=post --post_title='Acme test' --post_content='https://acmevideo.com/watch/abc123' --post_status=publish"
```

Open the post in the browser. You should see the iframe.

### Step 5 — E2E

Add a test in `tests/playwright/<surface>/providers/acme.spec.ts` covering: paste in editor, verify iframe `src`, verify it loads in frontend.

### Step 6 — Update docs

- Add an entry to [Provider Catalog](catalog.md).
- If the provider has unusual quirks, add a section to its catalog entry.

That's it for the fast path.

## The full path (with a dedicated block)

If you need a custom block (because the provider needs special controls — e.g., date pickers for a calendar), additionally:

1. **Scaffold the block**: `scripts/new-block.sh acme-video`
2. **Implement the block** in `src/Blocks/acme-video/`:
   - `index.js` — register the block
   - `edit.js` — editor UI (URL input + provider-specific controls)
   - `save.js` — output the URL + attributes (use `useBlockProps.save()`)
   - `block.json` — metadata
3. **Wire server-side render** in `EmbedPress/Gutenberg/EmbedPressBlockRenderer.php` (add a `case` for the block name; it should call `Core::parseContent` with the block attributes).
4. **Build**: `npm run build`
5. **Add an Elementor widget** *only if* customers will use Elementor with this provider. Often the existing `Embedpress_Elementor` widget is enough — it accepts any URL.

## Pro-only providers

Pro providers live in `embedpress-pro/includes/Providers/` and register on `embedpress_pro_register_providers`. Same shape as free, but loaded by Pro's bootstrap.

## Common pitfalls

- **URL regex too greedy.** Use `^https?://` and anchor to the host. Without `^`, your regex will match `https://example.com/?ref=acmevideo.com/watch/x` and steal that URL.
- **Iframe missing `allowfullscreen`.** Customers will report "fullscreen doesn't work."
- **Unescaped HTML.** Always wrap user-derived values in `esc_url`, `esc_attr`, `esc_html`. Even if upstream is "trusted," a paste from a phishing URL is not.
- **Forgetting `provider_name` and `type`** in the response array. Some downstream filters branch on these.
- **Hardcoded width/height.** Use `$this->getWidth()` / `$this->getHeight()` — they respect block / widget overrides.

## How to test for greediness

Before merging, run the full E2E provider suite:

```bash
npm run test:e2e -- --grep="provider"
```

Specifically watch for failures in YouTube, Vimeo, and Wrapper tests — those are the most likely victims of an over-broad new regex.
