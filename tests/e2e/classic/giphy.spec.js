const { test, expect } = require('@playwright/test');

const slug = 'playwright-classic-editor/classic-giphy/';

test('Classic Giphy', async ({ page }) => {
    await page.goto(slug);
    await expect(page.getByRole('heading', { name: 'Classic Giphy' })).toBeVisible();

    await expect(page.locator('.ose-giphy')).toBeVisible();
});