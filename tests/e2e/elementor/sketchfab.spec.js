const { test, expect } = require('@playwright/test');

test('Embed Elementor sketchfab source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/el-sketchfab/');
    await expect(page.locator('iframe[title="Short-beaked Common Dolphin"]').contentFrame().locator('img').nth(1)).toBeVisible();
});

// As now we only have embed support for this Source

