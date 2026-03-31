const { test, expect } = require('@playwright/test');

test('Embed Classic Codepoints source', async ({ page }) => {
    await page.goto('playwright-classic-editor/cl-codepoints/');
    await expect(page.locator('iframe').contentFrame().getByText('Start of Heading *')).toBeVisible();
});

// As now we only have embed support 