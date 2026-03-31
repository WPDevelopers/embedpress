const { test, expect } = require('@playwright/test');

test('Embed Classic Infogram source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/playwright-classic-editor/classic-infogram/');
    await expect(page.locator('iframe[title="EmbedPress test"]').contentFrame().locator('div').filter({ hasText: /^Sharemade with$/ }).nth(1)).toBeVisible();
});

// As now we only have embed support 