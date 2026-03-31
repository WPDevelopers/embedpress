const { test, expect } = require('@playwright/test');

test('Embed Elementor datawrapper source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/playwright-elementor/el-datawrapper/');
    await page.locator('.elementor-element').first().click();
});
// As now we only have embed support for datawrapper

