const { test, expect } = require('@playwright/test');

test.skip('Embed Classic deviantart source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/classic-deviantart/');
    await expect(page.getByRole('link').filter({ hasText: /^$/ })).toBeVisible();
});
// As now we only have embed support for deviantart

