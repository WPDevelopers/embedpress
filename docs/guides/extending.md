# Extending EmbedPress

Common extension scenarios with concrete recipes.

## "I want to add a new embed source"

→ See [Adding a Provider](../providers/adding-a-provider.md).

## "I want to add an option to the YouTube block"

The shortest path:

1. Add the attribute to `src/Blocks/youtube/block.json`.
2. Add a control in `src/Blocks/youtube/inspector.js`.
3. Read it in the YouTube block's render callback in `EmbedPressBlockRenderer.php`.
4. Forward to `Core::parseContent` as part of `$attrs`.
5. In `Feature_Enhancer`, hook `embedpress_youtube_params` to translate the attribute into a URL param.

## "I want a feature to apply to all providers"

Hook `embedpress_render` in `Feature_Enhancer::init()`:

```php
add_filter('embedpress_render', function ($html, $url, $atts) {
    if (!empty($atts['my_feature_enabled'])) {
        $html = '<div class="my-feature">' . $html . '</div>';
    }
    return $html;
}, 10, 3);
```

Then add the `my_feature_enabled` toggle to whichever surfaces you want it on (block + Elementor + shortcode att).

## "I want a Pro-only feature"

1. Add the UI to free wrapped in `pro_class` so it shows as a locked upsell.
2. Add the **filter slot** in free where the feature would attach.
3. In Pro, hook the filter and implement the feature.
4. Pro returns `''` for `embedpress_pro_class` so the lock styling drops on its UI when Pro is active.

This way, the UI source is single-sourced in free, and the implementation is single-sourced in Pro.

## "I want to register an additional provider from a custom plugin"

```php
add_action('embedpress_after_register_providers', function ($embera) {
    $embera->addProvider('myservice.com', \My\Plugin\Providers\MyService::class);
});
```

Your provider class must follow the same shape as built-in providers (extend `Embera\Adapters\Service`, implement `validateUrl` + `modifyResponse`).

## "I want to track custom analytics events"

Use the analytics REST endpoint:

```js
fetch('/wp-json/embedpress/v1/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': window.wpApiSettings.nonce },
    body: JSON.stringify({ event: 'my_event', embed_id: 123, meta: { … } }),
});
```

For deeper integration, hook the PHP-side Analytics service.

## "I want to override how a specific block renders"

Don't fork the block. Instead:

- Hook `embedpress_render` and short-circuit if `$atts['provider'] === 'youtube'` (or whatever).
- Return your custom HTML.

This survives plugin updates.

## What you should not do

- Don't `require` files from the EmbedPress folder structure directly. Paths can change.
- Don't extend EmbedPress's classes from your plugin. Use filters/actions instead — extension breaks on internal refactors.
- Don't write to EmbedPress's option keys. Use a prefix of your own.
