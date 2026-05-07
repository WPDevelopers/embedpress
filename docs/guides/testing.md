# Testing

Three layers: PHP unit / integration, JS unit, browser E2E.

## PHP

- **Unit**: `make test-php-unit` (PHPUnit, isolated)
- **Integration**: `make test-php-integration` (boots WP, hits DB)

Config: `phpunit.xml` at the repo root.

## JS

- **Unit**: `npm run test` (Vitest)
- **Type-check**: `npm run type-check`
- **Lint**: `npm run lint`

## Browser E2E (Playwright)

The big one.

```bash
npm run test:e2e               # everything
npm run test:e2e:gutenberg     # block tests
npm run test:e2e:elementor     # widget tests
npm run test:e2e:classic       # shortcode + auto-embed tests
npm run test:e2e:dashboard     # admin / analytics
npm run test:e2e:ui            # general UI smoke
npm run test:e2e:headed        # show the browser
```

Suites are organized under `tests/playwright/<surface>/`. Each provider typically has a `<provider>.spec.ts` per surface.

There's also a separate repo, `embedpress-playwright-automation`, that mirrors customer-facing scenarios. The inline suite is for daily dev; the standalone repo is for QA / regression sweeps.

## What to test before merging

| Change | Required tests |
|---|---|
| New provider | E2E paste in editor + frontend render in **all four** surfaces (block, widget, shortcode, auto-embed) |
| Block save() change | Gutenberg E2E, including loading a post written before the change to confirm the deprecation entry works |
| Elementor control | Elementor E2E for that widget |
| Custom Player change | All Custom Player formats (YT, Vimeo, Wistia, MP4, HLS) |
| Analytics tweak | Dashboard E2E + at least one tracker write test |
| Pro feature | Both Pro-active and Pro-inactive states |

## Writing a Playwright test

```ts
import { test, expect } from '@playwright/test';
import { loginAsAdmin, openNewPost } from '../helpers';

test('YouTube block renders iframe on frontend', async ({ page }) => {
    await loginAsAdmin(page);
    await openNewPost(page);

    // Insert block, set URL
    await page.click('button[aria-label="Add block"]');
    await page.fill('input[placeholder="Search blocks"]', 'YouTube');
    await page.click('button:has-text("YouTube")');
    await page.fill('.ep-url-input', 'https://www.youtube.com/watch?v=abc123');

    // Publish + view
    await page.click('button:has-text("Publish")');
    await page.click('button:has-text("View Post")');

    // Assert iframe exists
    await expect(page.locator('iframe[src*="youtube.com/embed/abc123"]')).toBeVisible();
});
```

## Local-only tests

For things that need a live external endpoint (Wistia, real YouTube), prefer to skip in CI and mock the HTTP layer. Tests that hit live external services are flaky and slow.

## Regression sweep before release

```bash
npm run type-check
npm run lint
npm run test
npm run test:e2e
make test-php
```

If any of these fail, the release is not ready.
