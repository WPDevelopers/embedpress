const { test, expect } = require('@playwright/test');

const slug = 'playwright-classic-editor/classic-editor-google-map';

test.describe("Classic Google Map", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(slug);
        await page.waitForLoadState('networkidle');
    });

    test('Default Google Map', async ({ page }) => {
        // Check iframe visibility        
        await expect(page.getByRole('heading', { name: 'Classic Editor – Google Map' })).toBeVisible();

        // Check iframe visibility
        const iframe = page.locator('iframe').first().contentFrame().locator('.gm-style > div > div:nth-child(2)').first();
        await expect(iframe).toBeVisible();

        // Check dimensions height & width
        const { height, width } = await iframe.evaluate(iframe => iframe.getBoundingClientRect());
        expect.soft(height).toBeCloseTo(498, 1);
        expect.soft(width).toBeCloseTo(1138, 1);
    });
});
