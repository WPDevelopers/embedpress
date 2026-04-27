const { test, expect } = require('@playwright/test');

test('Embed Gutenberg Flourish source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/gutenberg-flourish/');
    // await expect(page.locator('iframe[title="Interactive or visual content"]').contentFrame().locator('iframe').contentFrame().getByRole('region', { name: 'primary visualisation' }).locator('rect')).toBeVisible();
});
// As now we only have embed support for Flourish


// Note : Gutenberg Support not working on 

