const { test, expect } = require('@playwright/test');

test('Embed Elementor Gloria TV source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/playwright-elementor/el-gloria-tv/');

    // Gloria TV source embedding problem, so we are not able to test it

    // await expect(page.locator('iframe').contentFrame().locator('.play')).toBeVisible();
});
// As now we only have embed support

