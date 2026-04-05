const { test, expect } = require('@playwright/test');

test('Embed Classic mixcloud source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/playwright-classic-editor/classic-mixcloud/');
    await expect(page.locator('#post-10680 div').nth(1)).toBeVisible();
});

// As now we only have embed support

