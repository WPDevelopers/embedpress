const { test, expect } = require('@playwright/test');

test('Embed Gutenberg Gyazo source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/el-gyazo/');
    await expect(page.locator('#ep-elements-id-4f2dec2 img')).toBeVisible();
});

// As now we only have embed support 