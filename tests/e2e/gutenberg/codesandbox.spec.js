const { test, expect } = require('@playwright/test');

test('Embed Gutenberg Canva source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/gu-codesandbox/');
    await expect(page.locator('iframe')).toBeVisible();
});

// As now we only have embed support 