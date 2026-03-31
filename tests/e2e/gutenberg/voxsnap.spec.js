const { test, expect } = require('@playwright/test');

test('Embed Gutenberg Voxsnap source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/gu-voxsnap/');
    await expect(page.locator('iframe').contentFrame().locator('.player_controls')).toBeVisible();
});
// As now we only have embed support for Voxsnap 