const { test, expect } = require('@playwright/test');

let slug = 'google-docs-classic';


test.describe("Google Docs Gutenberg", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(slug);
    });

    test('Google Docs Gutenberg', async ({ page }) => {
        await expect(page.frameLocator('iframe').locator('body')).toBeVisible();
        await expect(page.frameLocator('iframe').getByText('Regression testing')).toBeVisible();
    });
});