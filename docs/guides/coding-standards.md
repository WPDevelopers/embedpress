---
order: 1
---

# Coding Standards

The conventions we hold ourselves to.

## PHP

- **PSR-style autoload** (`AutoLoader.php`). One class per file, file name matches class name.
- **Namespace**: `EmbedPress\…` for the plugin, `Embedpress\Pro\…` for Pro.
- **WPCS** (WordPress Coding Standards) checked via `phpcs.xml`. Run `composer run-script phpcs` (or via `make lint-php`).
- **No raw `print_r` / `var_dump`** in committed code. Use `error_log` for one-off debugging and remove before merging.
- **Always escape on output**: `esc_html`, `esc_attr`, `esc_url`, `wp_kses`. Even data you "trust."
- **Always sanitize on input**: `sanitize_text_field`, `absint`, `esc_url_raw` (for storage).
- **Translate all user-facing strings**: `__('Text', 'embedpress')`. Don't concatenate translated strings — use placeholders.

## JavaScript / TypeScript

- **ESLint** config at repo root. Run `npm run lint`.
- **TypeScript** for new code in `src/`. JS-only files exist for legacy reasons.
- **React functional components** with hooks. No class components.
- **No `any`** without an explanatory comment.
- **Prefer pure functions** over class state for utilities.

## File naming

| What | Convention | Example |
|---|---|---|
| PHP class file | PascalCase, matches class | `Feature_Enhancer.php`, `Youtube.php` |
| JS source | kebab-case | `custom-player-controls.js` |
| Block folder | kebab-case | `embedpress-pdf/`, `pdf-gallery/` |
| CSS | kebab-case | `embedpress.css` |
| Test files | `*.spec.ts` (Playwright) / `*Test.php` (PHPUnit) | `youtube.spec.ts` |

## Class naming

- **Providers**: `EmbedPress\Providers\<ProperName>` — `Youtube`, `GoogleMaps`, `SelfHosted`.
- **Services**: `EmbedPress\<Domain>\<Service>` — `Analytics\Analytics`, `Gutenberg\BlockManager`.
- **Helpers**: kept under `EmbedPress\Includes\Classes\` with a descriptive suffix — `Feature_Enhancer`, `Helper`.

## Security checklist (every PR)

- [ ] All user input sanitized at the boundary.
- [ ] All output escaped at the print site.
- [ ] All AJAX / REST calls have a nonce check via `permission_callback`.
- [ ] No raw SQL — use `$wpdb->prepare` for everything.
- [ ] No `eval`, no dynamic `include`/`require` of user-controlled paths.
- [ ] No bundled libs without verified provenance.

## Performance

- **Don't enqueue scripts globally.** Use marker class detection in `AssetManager` so each runtime only loads when needed.
- **Cache external HTTP calls.** Transients with 12-hour TTL by default.
- **No N+1 in admin lists.** When iterating embeds for analytics dashboards, use a single aggregated query.
- **No synchronous network in the request path.** Provider fetches that can be slow should be cached or queued.
