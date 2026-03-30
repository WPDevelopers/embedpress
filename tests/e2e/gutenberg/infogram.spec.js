const { test, expect } = require('@playwright/test');

test('Embed Gutenberg Infogram source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/gutenberg-infogram/');
    await expect(page.locator('iframe[title="EmbedPress test"]').contentFrame().locator('div').filter({ hasText: /^Sharemade with$/ }).nth(1)).toBeVisible();
});

// As now we only have embed support 