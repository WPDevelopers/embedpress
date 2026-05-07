# Onboarding Setup Wizard

3-step React wizard at `?page=embedpress-onboarding` that walks new users through enabling features and editor surfaces. Free, added in 4.5.1.

## Trigger

Auto-redirect fires when:

- Plugin freshly activated, AND
- `!get_option('embedpress_onboarding_complete')`, AND
- not already on the wizard page.

After completion, `embedpress_onboarding_complete=1` and the wizard never auto-redirects again. Manually accessible any time via wp-admin submenu **"Setup Wizard"**.

## Steps

1. **Get Started** — welcome with 250+ source icons, consent modal, "Personalize" / "Skip" buttons.
2. **Customize Setup** — 9 toggle cards: Gutenberg Block, Elementor Widget, Powered By, Analytics, Social Share (free) + Lazy Load, Custom Branding, Custom Ads, Content Protection (Pro, crown-badged).
3. **Ready to Embed** — feature summary + upsell checklist + Pro feature links.

Pro features show a crown icon + ProPopup upsell modal on click → upgrade link from `embedpressOnboardingData.upgradeUrl`.

## Architecture

```
   Plugin activation
            │
            ▼
   EmbedpressSettings.php (~L215) checks:
     !$pro_active && !get_option('embedpress_onboarding_complete')
            │
            ▼
   Auto-redirect to wp-admin?page=embedpress-onboarding
            │
            ▼
   Wizard page renders <div id="embedpress-onboarding-root"></div>
            │
            ▼
   src/AdminUI/onboarding-entry.js mounts <Onboarding/>
   (compiled to assets/js/onboarding.build.js + .css)
            │
            ▼
   3-step React UI; toggles bound to step-2 state
            │
            ▼
   On finish → AJAX `embedpress_save_onboarding`
   → update_option(EMBEDPRESS_PLG_NAME) with toggle values
   → update_option(EMBEDPRESS_PLG_NAME . ':elements') for editor enablements
   → update_option('embedpress_onboarding_complete', 1)
            │
            ▼
   Redirect to dashboard
```

## Code paths

| File | Role |
|---|---|
| `src/AdminUI/Onboarding.js` (~652 LOC, single component) | The whole wizard |
| Inside Onboarding.js (~L362-408) | Step 1 (Get Started + consent) |
| Inside Onboarding.js (~L412-479) | Step 2 (toggle cards) |
| Inside Onboarding.js (~L482-576) | Step 3 (summary + upsell) |
| Inside Onboarding.js (~L256-260) | `PRO_KEYS = ['g_lazyload', 'custom_branding', 'custom_ads', 'content_protection']` |
| Inside Onboarding.js (~L100-126) | `ProPopup` modal — shown when locked toggle clicked |
| Inside Onboarding.js (~L313) | Reads `data?.proActive` |
| `src/AdminUI/onboarding-entry.js` | React mount point — `#embedpress-onboarding-root` |
| `assets/js/onboarding.build.js` | Compiled bundle |
| `assets/css/onboarding.build.css` | Styles |
| `EmbedPress/Ends/Back/Settings/EmbedpressSettings.php` (~L215) | Auto-redirect trigger |
| Same file (~L338-351) | `wp_localize_script('embedpress-onboarding', 'embedpressOnboardingData', {...})` |
| Same file (~L500-600) | AJAX handler `embedpress_save_onboarding` — writes options |

## Persisted options

| Option key | Shape | Set by |
|---|---|---|
| `EMBEDPRESS_PLG_NAME` (the global settings array) | `{gutenberg_block, elementor_widget, embedpress_document_powered_by, analytics_tracking, social_share, g_lazyload, custom_branding, custom_ads, content_protection}` | Step 2 toggles |
| `EMBEDPRESS_PLG_NAME . ':elements'` | per-element enablement (Gutenberg block keys, Elementor widget keys) | Step 2 editor toggles |
| `embedpress_onboarding_complete` | `1` | Set on finish; suppresses re-run |

## Localization (`embedpressOnboardingData`)

Passed via `wp_localize_script`:

- `ajaxUrl`, `nonce` — for the save AJAX
- `dashboardUrl` — where to redirect after finish
- `proActive` — license check result
- `upgradeUrl` — `wpdeveloper.com/in/upgrade-embedpress`
- `assetsUrl` — for icon assets
- `analyticsTracking` — current state of the analytics toggle (so re-running preserves the user's earlier choice)

## Common pitfalls

- **`PRO_KEYS` is hardcoded.** Adding a 5th Pro feature toggle requires editing this array AND adding the toggle card AND the option write.
- **Auto-redirect only fires once per install.** To re-trigger for testing: `wp option delete embedpress_onboarding_complete`.
- **Pro detection happens server-side** (`proActive` localized once). If the user activates Pro mid-wizard, they need to refresh — the React state won't update.
- **Step 2 writes a unified array** to `EMBEDPRESS_PLG_NAME` — be careful if other code paths also write that option, you can race-overwrite. The wizard merges, but if you skip the merge code path you lose other settings.
- **Element enablement (`:elements`)** is a separate option key. Don't put block/widget enablement in the main settings array.
- **Skipping the wizard** still sets `embedpress_onboarding_complete=1` — by design (so it doesn't keep nagging). But it means skipped users never wrote default option values — relying code should fall back gracefully.
- **Localization data is only passed when the user is on the onboarding page.** Don't reference `embedpressOnboardingData` from other admin pages.
- **`embedpress-onboarding-root` div is the only mount point** — if the page template doesn't render it, the React app silently fails.

## Testing

- **Fresh install**: `make destroy && make setup` → activate plugin → should auto-redirect to wizard.
- **Skip path**: click Skip → `embedpress_onboarding_complete=1`, redirect to dashboard.
- **Toggle path**: enable some toggles → finish → verify options written via `wp option get embedpress`.
- **Pro toggle without license**: click Custom Branding (no Pro) → ProPopup opens with upgrade link.
- **Re-trigger**: `wp option delete embedpress_onboarding_complete` → reload admin → wizard re-shows.
- **With Pro active**: all 9 toggles unlocked, no crown badges.
