const { test, expect } = require('@playwright/test');

const slug = 'playwright-elementor/elementor-google-drawings/';

test.describe("Elementor Google Drawings", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(slug);
        await page.waitForLoadState('networkidle');
    });

    test('Default Elementor Google Drawings', async ({ page }) => {
        // Check iframe visibility        
        await expect(page.getByRole('heading', { name: 'Elementor Google Drawings 1140x800' })).toBeVisible();

        // Check iframe visibility
        const iframe = page.locator('#ep-elements-id-d506231').getByRole('img');

        await expect(iframe).toBeVisible();

        // Check dimensions height & width
        const { height, width } = await iframe.evaluate(iframe => iframe.getBoundingClientRect());
        expect(height).toBeCloseTo(855, 1);
        expect(width).toBeCloseTo(1140, 1);
    });
});
