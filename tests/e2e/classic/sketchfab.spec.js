const { test, expect } = require('@playwright/test');

test('Embed Classic sketchfab source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/playwright-classic-editor/cl-sketchfab/')
    await expect(page.locator('iframe[title="Short-beaked Common Dolphin"]').contentFrame().locator('img').nth(1)).toBeVisible();
    await expect(page.locator('iframe[title="Short-beaked Common Dolphin"]').contentFrame().getByRole('link', { name: 'View on Sketchfab' }).first()).toBeVisible();
});

// As of now we only have embed support for sketchfab 