const { test, expect } = require('@playwright/test');

test.skip('Embed Classic smugmug source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/playwright-classic-editor/smugmug-classic-editor/');
    await expect(page.getByRole('link').filter({ hasText: /^$/ })).toBeVisible();
});

// As now we only have embed support for this Source

