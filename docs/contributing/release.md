# Release Process

How a free EmbedPress release ships to WP.org.

## When

We cut **patch releases (4.x.y)** as needed for bug fixes, **minor (4.x.0)** for new features. Pro versions independently.

## Release plan source

There's an `embedpress-release-plan.txt` at the docker repo root capturing the current scope. Read it before doing anything.

## Steps (free)

There's a guided skill for this — invoke `/embedpress-release` and it'll walk through:

1. Bump version in:
   - `embedpress.php` (the `Version:` header)
   - `includes.php` (the `EMBEDPRESS_PLUGIN_VERSION` constant)
   - `package.json`
   - `readme.txt` (`Stable tag:`)
2. Generate the changelog from git history (commits + merges + FluentBoards card titles).
3. Regenerate `languages/embedpress.pot` (`npm run pot`).
4. Run the full test suite.

The skill **stops before** any shared / destructive action (commit, tag, push, SVN). Those are humans-only.

## Manual checklist after the skill stops

- [ ] Eyeball the changelog — does it read right for customers?
- [ ] Smoke-test on a fresh WP install: `make destroy && make setup`.
- [ ] Verify `vendor/` is production (`composer install --no-dev`).
- [ ] Verify `assets/` is freshly built (`npm run build`).
- [ ] Tag the release: `git tag v4.x.y && git push origin v4.x.y`.
- [ ] Push to SVN (WP.org) — manual, by the release manager.

## Pro release

`/embedpress-pro-release` is the equivalent skill. Pro versions independently and ships via EDD, not WP.org.

## Why we have so many version locations

WP.org reads:
- `Stable tag` from `readme.txt` to decide which folder to publish.
- `Version:` from `embedpress.php` for the plugin header.
- The internal `EMBEDPRESS_PLUGIN_VERSION` constant is what we use for asset cache-busting and version checks.
- `package.json` is the JS world's source of truth.

If any one of these drifts, customers see weird behavior — old bundles, mismatched displayed version, or WP.org refusing to publish. Always bump them together.

## Asset cache gotcha

If `EMBEDPRESS_PLUGIN_VERSION` doesn't bump, browsers cache the previous bundle and Pro features may silently break for users who already loaded the prior version. Bump diligently.
