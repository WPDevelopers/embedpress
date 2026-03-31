const { test, expect } = require('@playwright/test');

test.skip('Embed Gutenberg Fader source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/gutenberg-fader/');
    await expect(page.locator('iframe').contentFrame().locator('footer > div > div > div')).toBeVisible();
});
// As now we only have embed support 

