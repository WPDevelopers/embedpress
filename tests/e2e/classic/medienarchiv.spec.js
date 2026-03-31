const { test, expect } = require('@playwright/test');

test.skip('Embed Classic Medienarchiv source', async ({ page }) => {
    await page.goto('playwright-classic-editor/cl-medienarchive/');
    await expect(page.locator('iframe[title="DAS UNBEGREIFLICHE SCHWEIGEN DER WELT"]').contentFrame().getByRole('link', { name: 'Bild: DAS UNBEGREIFLICHE' })).toBeVisible();
    await expect(page.locator('#post-10971 div').first()).toBeVisible();
});

// As now we only have embed support