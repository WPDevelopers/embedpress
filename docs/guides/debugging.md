# Debugging & Troubleshooting

Practical tactics for hunting EmbedPress bugs.

## Turn on the right knobs

```php
// wp-config.php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
define('SCRIPT_DEBUG', true);            // load unminified JS

// Force fresh asset URLs every page load (skip browser cache)
define('EMBEDPRESS_DEV_MODE', true);
```

`SCRIPT_DEBUG` makes WP load unminified bundles — much easier to set breakpoints. `EMBEDPRESS_DEV_MODE` swaps `EMBEDPRESS_PLUGIN_VERSION` for `time()` so the version query string changes on every request.

## Tail the debug log

```bash
make wp-debug-log
# or
tail -f wp-content/debug.log
```

## Common symptoms → first place to look

### "Embed shows up as a plain link, not the expected widget"

1. Did the URL match a provider? Look at `Core::parseContent` flow — did it fall through to `Wrapper`?
2. Is the provider's `validateUrl` regex too strict? Test it with `preg_match` in `wp shell`.
3. Is the URL on its own line (auto-embed requirement) or wrapped in something else?

### "Block renders fine in editor but blank on frontend"

1. Check `render_callback` — is it returning a string? An empty return = blank output.
2. Open browser console — JS error in the player runtime?
3. Does the marker class exist in DOM? If yes but no JS runs, AssetManager didn't enqueue.
4. Look in the network tab — is `embedpress.build.js` 200ing?

### "Block contains unexpected or invalid content"

You changed `save()` output without a `deprecated[]` entry. See [Gutenberg deprecation](../gutenberg/README.md#deprecation-discipline).

### "Pro feature doesn't activate"

1. Is Pro plugin active? `wp plugin list`.
2. Did Pro hook the filter slot? Add a `error_log` to confirm Pro's callback fires.
3. Is the free filter slot still present? `grep apply_filters EmbedPress/...`.

### "Custom Player UI doesn't appear for self-hosted format X"

You forgot one of the **five `isSelfHostedVideo` regex copies**. See [Custom Player](../features/custom-player.md). Update all five.

### "Analytics counts wrong"

1. Is the marker class on the embed wrapper?
2. Is the tracker bundle enqueued? Check network tab.
3. Is the REST endpoint returning 200? Look in `wp-content/debug.log` for write failures.
4. Is there an ad-blocker hitting `/wp-json/embedpress/`? Surprisingly common — some blocklists target `analytics` paths.

### "Broken Embeds Detector flags working URLs"

1. Is the URL same-origin? It shouldn't reach the network probe — verify `home_url()` / `site_url()` host match logic.
2. Does the host return non-404 codes (403/429/5xx)? Those should map to `STATUS_UNKNOWN`, not `STATUS_BROKEN`.
3. Is the User-Agent reaching the host? Some CDNs strip non-Mozilla UAs.

See the skill notes for the detector's full false-positive history.

## Tracing a render

Add a temporary `error_log` chain:

```php
// EmbedPress/Core.php, in parseContent
error_log('[EP] parseContent url=' . $url);
error_log('[EP] matched provider=' . $providerClass);
error_log('[EP] final HTML length=' . strlen($html));
```

Remove before committing.

## Debugging from `wp shell`

```bash
make wp ARG="shell"
```

```php
$core = \EmbedPress\Core::getInstance();
$html = $core->parseContent('https://www.youtube.com/watch?v=abc123');
echo $html;
```

This is the fastest way to confirm a URL routes correctly without the editor or frontend in the loop.

## Provider regex testing

```bash
make wp ARG="shell"
```

```php
$url = 'https://acme.example.com/watch/abc';
$provider = new \EmbedPress\Providers\AcmeVideo($url);
var_dump($provider->validateUrl(new \Embera\Url($url)));
```

## Frontend JS debugging

- Use the browser's source map navigation — built bundles include source maps.
- `window.embedpressDebug = true` enables a verbose log in the player runtime (recent versions).

## When to escalate

If a bug reproduces on a clean WP install with only EmbedPress free + Pro active, it's an EmbedPress bug. If it only reproduces with a specific theme or plugin combo, suspect a CSS / JS conflict and start with `Twenty Twenty-Four` + minimal plugin set to isolate.
