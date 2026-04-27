const { test, expect } = require('@playwright/test');

let slug = 'playwright-elementor/elementor-twitter//';


test.describe('Elementor Twitter', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(slug);
    });

    test('Default Twitter Visibility Test', async ({ page }) => {
        await page.waitForTimeout(1000);
        await expect(page.locator('iframe[title="X Post"]')).toBeVisible();
    });

});