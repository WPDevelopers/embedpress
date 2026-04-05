const { test, expect } = require('@playwright/test');

test('Embed Gutenberg Songlink source', async ({ page }) => {
    await page.goto('playwright-gutenberg/gu-songlink/');
    await expect(page.locator('iframe').contentFrame().getByRole('img', { name: 'Album artwork' })).toBeVisible();
});

// As now we only have embed support for this Source
