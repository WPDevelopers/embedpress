const { test, expect } = require('@playwright/test');

const slug = 'playwright-classic-editor/classic-google-photos/';

test.describe("Classic Google Photos", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(slug);
        await page.waitForLoadState('networkidle');
    });

    test('Classic Google Photos', async ({ page }) => {
        // Check iframe visibility        
        await expect(page.getByRole('heading', { name: 'Classic Google Photos' })).toBeVisible();

        // Check iframe visibility
        const iframe = page.locator('iframe').first()
        await expect(iframe).toBeVisible();

        // Check dimensions height & width
        const { height, width } = await iframe.evaluate(iframe => iframe.getBoundingClientRect());
        expect(height).toBeCloseTo(900, 1);
        expect(width).toBeCloseTo(1200, 1);
    });
});
