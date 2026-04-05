const { test, expect } = require('@playwright/test');

test('Embed Gutenberg Animoto source', async ({ page }) => {
    await page.goto('gutenberg-animoto/');
    await expect(page.locator('iframe').contentFrame().locator('.vjs-poster')).toBeVisible();
});

// As now we only have embed support 