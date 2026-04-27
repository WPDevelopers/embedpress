const { test, expect } = require('@playwright/test');

test('Embed Classic Geographic UK source', async ({ page }) => {
    await page.goto('playwright-gutenberg/gu-geographic-uk/');
    await expect(page.getByRole('link', { name: 'The Ferry to Shepperton' })).toBeVisible();
});
// As now we only have embed support

