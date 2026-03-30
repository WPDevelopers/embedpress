const { test, expect } = require('@playwright/test');

const slug = 'playwright-gutenberg/gutenberg-giphy/';

test('Gutenberg Giphy', async ({ page }) => {
    await page.goto(slug);
    await expect(page.getByRole('heading', { name: 'Gutenberg Giphy' })).toBeVisible();

    await expect(page.locator('.ose-giphy')).toBeVisible();
});

// As Of now only one test case is available for giphy.