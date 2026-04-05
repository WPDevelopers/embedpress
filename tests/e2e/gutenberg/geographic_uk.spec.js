const { test, expect } = require('@playwright/test');

test.skip('Embed Gutenberg Geographic UK source', async ({ page }) => {
    await page.goto('playwright-classic-editor/cl-geographic-uk/');
    await expect(page.getByRole('link', { name: 'The Ferry to Shepperton' })).toBeVisible();
});
// As now we only have embed support

