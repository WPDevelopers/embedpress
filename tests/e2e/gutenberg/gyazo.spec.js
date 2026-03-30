const { test, expect } = require('@playwright/test');

test('Embed Gutenberg Gyazo source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/gu-gyazo/');
    await expect(page.locator('#post-10603 img')).toBeVisible();
});

// As now we only have embed support 