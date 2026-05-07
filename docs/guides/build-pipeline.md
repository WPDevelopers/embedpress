# Build & Asset Pipeline

How `src/` becomes `assets/`.

## Tools

- **Vite** for JS/TS/SCSS bundling.
- **Composer** for PHP autoload + vendor libs.
- **WordPress build hooks** are NOT used — we use Vite, not `@wordpress/scripts`, because we have non-block bundles (admin UI, frontend tracker).

## Commands

```bash
npm install               # install deps (Node ≥ 20, npm ≥ 10)
npm run start             # vite build --watch
npm run build             # production build → assets/
npm run type-check        # tsc --noEmit
npm run lint              # eslint src/
npm run pot               # regenerate languages/embedpress.pot
```

## What's committed

| Path | Committed? | Why |
|---|---|---|
| `src/` | ✓ | Source of truth |
| `assets/` | ✓ | WP.org users don't run `npm` |
| `static/` | ✓ | Vendored libs (PDF.js, flipbook, Plyr) |
| `vendor/` | ✓ | Composer for WP.org |
| `node_modules/` | ✗ | Reproducible from `package-lock.json` |

## Vite entry points

`vite.config.js` defines multiple entry points:

```
src/Blocks/index.js          → assets/blocks.build.js
src/Frontend/index.js        → assets/embedpress.build.js
src/Analytics/tracker.js     → assets/analytics.build.js
src/Analytics/dashboard.js   → assets/analytics-dashboard.build.js
src/AdminUI/index.js         → assets/admin.build.js
…
```

Each block's individual editor JS is built into a per-block bundle (`assets/<block-name>.build.js`).

## Asset enqueuing

`Core/AssetManager.php` is the central enqueue point. Most bundles are enqueued **conditionally**:

- Block editor JS — only on the post edit screen
- Frontend player runtime — only when an embed marker class is in the page
- Analytics tracker — only when analytics is enabled and embeds exist
- Admin UI — only on EmbedPress admin pages

This keeps page weight low for sites that don't use a particular feature.

## Versioning

Bundle URLs include `?ver=EMBEDPRESS_PLUGIN_VERSION` for cache busting. **The version constant must be bumped on release** or browsers will serve cached old bundles.

For development, `define('EMBEDPRESS_DEV_MODE', true)` in `wp-config.php` swaps the version for `time()`, defeating the cache.

## i18n

`npm run pot` runs `wp i18n make-pot` (or equivalent) to extract translatable strings from PHP and JS. Output: `languages/embedpress.pot`. Translation files (`embedpress-<locale>.po`/`mo`) come from WP.org's translation platform.

## Bundle size

Watch the build output. Bundles over ~200KB raw should be reviewed — PDF.js and 3D flipbook are bigger because we vendor them. New runtime code should aim small. If a bundle grows substantially, profile imports for tree-shaking opportunities.
