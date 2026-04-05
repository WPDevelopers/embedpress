const { test, expect } = require('@playwright/test');

const slug = 'playwright-elementor/elementor-giphy/';

test('Elementor Giphy', async ({ page }) => {
    await page.goto(slug);
    await expect(page.getByRole('heading', { name: 'Elementor Giphy' })).toBeVisible();

    await expect(page.locator('.ose-giphy')).toBeVisible();
});