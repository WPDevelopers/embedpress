# EmbedPress

Free WordPress plugin that embeds content from 250+ providers (YouTube, Vimeo, Google Docs/Drive/Maps, PDFs, Twitch, Wistia, etc.) via Gutenberg blocks, an Elementor widget, and a classic shortcode. Sister repo `embedpress-pro` adds Pro features on top of this codebase.

- **Plugin entry:** `embedpress.php` (current version in header — bump on release)
- **PHP namespace root:** `EmbedPress\` (`EmbedPress/` directory) + bootstrap helpers in `Core/`
- **Source roots (two parallel ones):**
  - `static/` — hand-written admin & frontend JS/CSS (admin.js, front.js, `initplyr.js`, ep-player-ui.js, settings.js, plyr.css, lightbox, lazy-load, carousel, etc.). **This is the main source folder for runtime scripts/styles.** Vite copies it verbatim into `assets/` during build.
  - `src/` — React/Vite-compiled sources for Gutenberg blocks and the AdminUI app (Dashboard, Settings, Onboarding, CustomPlayer, MilestoneNotification).
- **Build output:** `assets/` (everything from `static/` plus the compiled `src/` bundles)
- **Min runtime:** PHP per `composer.json`, Node ≥ 20, npm ≥ 10

## Project Management — FluentBoards

Tasks live on **FluentBoards** at https://projects.startise.com (NOT Zoobbe — that's deprecated for this project as of 2026-04-28).

- **Board:** `Development - EmbedPress` (board ID `17`)
- **Daily-work stage:** `My Day (Akash)` — Akash drags cards in each morning; standup/report scripts pull only from this stage
- **Akash's user ID:** `35`
- **Tooling:** use the `fluentboards` skill (REST API via WP App Password). Do NOT call `zb` / `zoobbe` for this project.
- **Work week:** Sun–Thu (Fri/Sat are public off-days in BD)

When asked to create a card, do it autonomously — infer priority, label, stage, description from the request. Default stage `To-Do`; default priority `Medium`. Always assign to the logged-in user.

When asked to "fix it":
1. Implement the fix in code, run tests where possible
2. Branch `fix/<short-description>`, commit, note hash
3. Move card to the done stage and mark complete
4. **Mandatory:** comment on the card with branch name, files changed, commit hash

The fluentboards skill forbids creating stages via API — if a stage is missing, ask the user to create it in the UI.

## Repository layout

```
embedpress.php              Plugin bootstrap, hooks, version header
providers.php               Map of provider classes → URL patterns (250+ providers)
includes.php                Wires constants and autoload
autoloader.php              PSR-4-ish autoloader for EmbedPress\
composer.json / package.json

Core/                       Plugin lifecycle: AssetManager, LocalizationManager, init.php
EmbedPress/                 Main PHP namespace
  AMP/                      AMP compatibility
  Analytics/                View tracking
  Elementor/                Widget integration (Embedpress_Elementor_Integration)
  Ends/                     Front/Back ends
  Gutenberg/                Block registration & server-side rendering
    BlockManager.php
    EmbedPressBlockRenderer.php   ← build_player_options() — must mirror JS getPlayerOptions()
    FallbackHandler.php
    InitBlocks.php
  Includes/Classes/         Helper, Feature_Enhancer, PlayerPresets, Notices, etc.
  Plugins/                  Per-provider integrations
  Providers/                Provider classes referenced in providers.php
  RestAPI.php
  Shortcode.php             Classic [embed]/[embedpress] shortcode

static/                     PRIMARY source folder — hand-written runtime JS/CSS (copied as-is to assets/)
  js/                       admin.js, front.js, initplyr.js, ep-player-ui.js, settings.js,
                            ep-pdf-lightbox.js, lazy-load.js, gallery-justify.js, instafeed.js,
                            carousel.js, gutneberg-script.js, analytics-tracker.js, feature-notices.js,
                            license.js, meetup-timezone.js, pdf-gallery*.js, preview.js, sponsored.js
  css/                      admin.css, embedpress.css, ep-player.css, plyr.css, modal.css,
                            settings.css, pdf-gallery.css, lazy-load.css, carousel.min.css, etc.
  fonts/, images/, pdf/, pdf-flip-book/, embedpress.pdf

src/                        Compiled sources (Vite + React) — blocks and admin SPAs
  AdminUI/                  Dashboard, Settings, Onboarding, CustomPlayer, MilestoneNotification
  Analytics/
  Blocks/                   All Gutenberg blocks (see "Blocks" below)
  Frontend/                 Frontend React/runtime modules
  Shared/                   Cross-block components/helpers
  utils/

tests/
  bootstrap.php, stubs.php  PHPUnit setup
  unit/                     PHPUnit
  e2e/                      Playwright (classic, gutenberg, elementor, dashboard projects)

assets/                     Build output (gitignored / committed per repo policy)
languages/                  i18n (.pot via `npm run pot`)
docs/, scripts/, static/
```

### Blocks (`src/Blocks/`)

`EmbedPress`, `document`, `embedpress-calendar`, `embedpress-pdf`, `google-docs`, `google-drawings`, `google-forms`, `google-maps`, `google-sheets`, `google-slides`, `pdf-gallery`, `twitch`, `wistia`, `youtube`, plus shared `GlobalCoponents/`, `placeholders/`, `assets/`, `styles.js`.

Each block typically has `src/components/{index.js, save.js, edit.js, deprecated.js, helper.js}`. The main `EmbedPress` block's `helper.js` `getPlayerOptions()` is the canonical example — its shape must match `EmbedPressBlockRenderer::build_player_options()` on the PHP side.

## Build / dev / test

```bash
npm run start              # Vite watch (development build)
npm run build              # production build → assets/
npm run lint               # ESLint over src/
npm run lint:fix
npm run type-check         # tsc --noEmit
npm run format             # Prettier write
npm run pot                # regenerate languages/embedpress.pot

npm test                   # Vitest unit
npm run test:e2e           # Playwright (all projects)
npm run test:e2e:gutenberg # narrow to one project: classic|gutenberg|elementor|dashboard
npm run test:e2e:headed    # headed mode for debugging
npm run test:e2e:ui        # Playwright UI runner

composer install           # PHP deps
vendor/bin/phpunit         # PHP unit tests (phpunit.xml)
vendor/bin/phpcs           # phpcs.xml ruleset
```

E2E auth flow runs through `tests/e2e/auth.setup.js` and `global-setup.ts` — point the test runner at the WordPress site provisioned by `embedpress-docker`.

### Release build
`bash build.sh` (or `build.xml` Phing target) packages a distributable zip. WP-CLI alternative from a WordPress root: `wp dist-archive wp-content/plugins/embedpress embedpress`.

## Conventions

### Gutenberg blocks — backwards compatibility (applies to ALL blocks under `src/Blocks/`)

Changing a block's `save()` output — markup, attributes, `data-options` shape, wrapper classes — breaks old posts: Gutenberg validates current `save()` against saved HTML and shows the *"Block contains unexpected or invalid content. Attempt recovery"* prompt on every mismatch, wiping the user's configuration.

**Order of preference:**

1. **Conditional emission.** If the change is additive (new attributes off-by-default), emit the new keys/markup only when their toggle is `true`. Old posts (where new attrs read as defaults) regenerate the original markup byte-for-byte.
   - Pattern: `...(playerEmailCapture && { email_capture: build() })` — not `email_capture: build() || false`.
   - This was the working fix for #81243 in `src/Blocks/EmbedPress/src/components/helper.js` `getPlayerOptions()`.

2. **`deprecated[]` entry** in the block's `deprecated.js` (e.g. `src/Blocks/EmbedPress/src/components/deprecated.js`) when the markup change is unconditional. Provide a `save()` reproducing the previous markup and an identity `migrate`. New entries go at the **front** of the array. Wire `deprecated` into `registerBlockType` in the block's `index.js`.

3. **`isEligible: () => true`** as a safety-net catch-all forces WP to apply a deprecation even when its `save()` doesn't byte-match — useful when shared rendering (e.g. `DynamicStyles`) varies across revisions.

**Mirror PHP and JS:** when a JS save shape changes, also update the matching PHP renderer (e.g. `EmbedPress/Gutenberg/EmbedPressBlockRenderer.php` `build_player_options()`). Both feed the same `data-options` JSON that frontend scripts in `static/js/` (`initplyr.js`, `ep-player-ui.js`, etc.) parse — drift between them ships broken embeds.

### Editing runtime scripts/styles
Most user-visible runtime behavior (player UI, lightbox, lazy-load, carousels, PDF gallery, settings page) lives in `static/js/` and `static/css/` as **hand-written, non-compiled** files. Edit them directly — Vite copies them to `assets/` on build. Don't add a build step for these unless converting them deliberately.

### Adding a provider
1. Add a class under `EmbedPress/Providers/<Name>.php`
2. Register it in `providers.php` with the URL patterns it should claim
3. If it needs a dedicated block, scaffold under `src/Blocks/<name>/`
4. If it needs server-rendered options, extend `EmbedPressBlockRenderer` accordingly

### Pro features
Pro lives in the sibling `embedpress-pro` repo and hooks into this codebase via filters/actions registered in `EmbedPress/`. When adding a Pro-gated key to block output, **always** make it conditional (see rule #1 above) so free-version users with the same posts don't get the recovery prompt.

## Related repos
- `embedpress-pro` — Pro extension (shares the FluentBoards board)
- `embedpress-docker` — local WP dev environment, also hosts the standup/report scripts and Playwright runners
- `embedpress-playwright-automation` — extra E2E suites
