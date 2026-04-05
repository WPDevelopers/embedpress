const { test, expect } = require('@playwright/test');

test('Embed Classic Animoto source', async ({ page }) => {
    await page.goto('classic-animoto/');
    await expect(page.locator('iframe').contentFrame().locator('.vjs-poster')).toBeVisible();
});

// As now we only have embed support 