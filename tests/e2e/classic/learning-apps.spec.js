const { test, expect } = require('@playwright/test');

test('Embed Classic Learning Apps source', async ({ page }) => {
    await page.goto('playwright-classic-editor/classic-learningapps/');
    await expect(page.locator('iframe[title="Periodic classification"]').contentFrame().locator('#frame').contentFrame().getByRole('link', { name: 'Show app in fullscreen' })).toBeVisible();
});

// As now we only have embed support for this Source

