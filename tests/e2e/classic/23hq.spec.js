const { test, expect } = require('@playwright/test');

test('Embed Classic 23HQ source', async ({ page }) => {
    await page.goto('playwright-classic-editor/cl-23-hq/');
    await expect(page.getByRole('img').filter({ hasText: /^$/ })).toBeVisible();
});
// As now we only have embed support