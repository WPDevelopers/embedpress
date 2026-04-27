const { test, expect } = require('@playwright/test');

test('Embed Classic TVCF source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/playwright-classic-editor/classic-tvcf/');
    await expect(page.locator('iframe').contentFrame().locator('#my-player_html5_api')).toBeVisible();
});
// As now we only have embed support 

