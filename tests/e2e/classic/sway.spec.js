const { test, expect } = require('@playwright/test');

test('Embed Classic Sway source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/playwright-classic-editor/cl-sway/');
    await expect(page.locator('#post-10830 div').first()).toBeVisible();
});

// As now we only have embed support 