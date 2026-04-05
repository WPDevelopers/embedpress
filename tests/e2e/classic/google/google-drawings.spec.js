const { test, expect } = require('@playwright/test');

const slug = 'playwright-classic-editor/classic-google-drawings/';

test.describe("Classic Google drawings", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(slug);
        await page.waitForLoadState('networkidle');
    });

    test('Classic Google drawings', async ({ page }) => {
        // Check iframe visibility        
        await expect(page.getByRole('heading', { name: 'Classic Google Drawings' })).toBeVisible();

        // Check iframe visibility
        const iframe = page.locator('#post-9213').getByRole('img');
        await expect(iframe).toBeVisible();
        
        // Check dimensions height & width
        const { height, width } = await iframe.evaluate(iframe => iframe.getBoundingClientRect());
        expect(height).toBeCloseTo(375, 1);
        expect(width).toBeCloseTo(500, 1);
    });
});
