const { test, expect } = require('@playwright/test');

test('Embed Elementor Coubs source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/playwright-elementor/el-coub/');
    await expect(page.locator('iframe[title="je suis mosiychuk"]').contentFrame().locator('.viewer__controls__container > .viewer__hand')).toBeVisible();
});

// As now we only have embed support

