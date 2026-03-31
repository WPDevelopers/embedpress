const { test, expect } = require('@playwright/test');

const slug = 'playwright-gutenberg/gutenebrg-google-sheets';

test.describe("Gutenberg Google Sheets", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(slug);
        // await page.waitForLoadState('networkidle');
    });

    test('Gutenberg Google Sheets', async ({ page }) => {
        // Check iframe visibility        
        await expect(page.getByRole('heading', { name: 'Google Sheets 1140×' })).toBeVisible();

        // Check iframe visibility
        const iframe = page.locator('iframe');
        await expect(iframe).toBeVisible();

        // Check dimensions height & width
        const { height, width } = await iframe.evaluate(iframe => iframe.getBoundingClientRect());
        expect(height).toBeCloseTo(800, 1);
        expect(width).toBeCloseTo(1140, 1);
    });
});
