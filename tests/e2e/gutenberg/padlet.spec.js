const { test, expect } = require('@playwright/test');

test('Embed Gutenberg Padlet source', async ({ page }) => {
    await page.goto('playwright-gutenberg/gutenberg-padlet/');
    await expect(page.locator('iframe').contentFrame().getByRole('heading', { name: 'Canvas' })).toBeVisible();
    await expect(page.locator('iframe').contentFrame().getByText('Hello World !How are you all ?')).toBeVisible();
});

// As now we only have embed support

