const { test, expect } = require('@playwright/test');

const slug = 'playwright-elementor/elementor-google-slides/';

test.describe("Elementor Google Slides", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(slug);
        await page.waitForLoadState('networkidle');
    });

    test('Elementor Google Slides', async ({ page }) => {
        // Check iframe visibility        
        await expect(page.getByRole('heading', { name: 'Default Google Slides 1140x800' })).toBeVisible();

        // Check iframe visibility
        const iframe = page.locator('iframe').contentFrame().locator('.sketchyViewerContainer');
        await expect(iframe).toBeVisible();

        // Check dimensions height & width
        const { height, width } = await iframe.evaluate(iframe => iframe.getBoundingClientRect());
        expect(height).toBeCloseTo(800, 1);
        expect(width).toBeCloseTo(1140, 1);
    });
});
