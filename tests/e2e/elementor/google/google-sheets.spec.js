const { test, expect } = require('@playwright/test');

const slug = 'playwright-elementor/elementor-google-sheets';

test.describe("Elementor Google Sheets", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(slug);
        // await page.waitForLoadState('networkidle');
    });

    test('Elementor Google Sheets', async ({ page }) => {
        // Check iframe visibility        
        await expect(page.getByRole('heading', { name: 'Google Sheets 1140x800' })).toBeVisible();

        // Check iframe visibility
        const iframe = page.locator('iframe');
        await expect(iframe).toBeVisible();

        // Check dimensions height & width
        const { height, width } = await iframe.evaluate(iframe => iframe.getBoundingClientRect());
        expect(height).toBeCloseTo(800, 1);
        expect(width).toBeCloseTo(1140, 1);
    });
});
