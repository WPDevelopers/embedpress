const { test, expect } = require('@playwright/test');

test('Embed Classic Voxsnap', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/playwright-classic-editor/cl-voxsnap/')
    await expect(page.locator('iframe').contentFrame().locator('.player_controls')).toBeVisible();
});
// As now we only have embed support for this source 