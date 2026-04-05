const { test, expect } = require('@playwright/test');

test('Embed Classic Sudomemo source', async ({ page }) => {
    await page.goto('playwright-classic-editor/classic-sudomemo/');
    await expect(page.locator('iframe[title="The June Archive \\#19 Part 1"]').contentFrame().locator('video')).toBeVisible();
});

// As now we only have embed support 