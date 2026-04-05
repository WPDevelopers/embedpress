const { test, expect } = require('@playwright/test');

test.skip('Embed Elementor deviantart source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/playwright-elementor/elementor-deviantart/');
    await expect(page.getByRole('link').filter({ hasText: /^$/ })).toBeVisible();
});
// As now we only have embed support for deviantart

