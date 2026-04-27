const { test, expect } = require('@playwright/test');

test('Embed Gutenberg gettyimages source', async ({ page }) => {
    await page.goto('playwright-gutenberg/gutenberg-getty-images/');
    await expect(page.locator('iframe').contentFrame().getByRole('complementary')).toBeVisible();
});
// As now we only have embed support

