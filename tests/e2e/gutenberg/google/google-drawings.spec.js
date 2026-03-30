const { test, expect } = require('@playwright/test');

const slug = 'playwright-gutenberg/gutenberg-google-drawings/';

test.describe("Gutenberg Google Drawings", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(slug);
        await page.waitForLoadState('networkidle');
    });

    test('Default Gutenberg Google Drawings', async ({ page }) => {
        // Check iframe visibility        
        await expect(page.getByRole('heading', { name: 'Gutenberg Google Drawings 1140×' })).toBeVisible();

        // Check iframe visibility
        const iframe = page.locator('#post-9010').getByRole('img')

        await expect(iframe).toBeVisible();

        // Check dimensions height & width
        const { height, width } = await iframe.evaluate(iframe => iframe.getBoundingClientRect());
        expect(height).toBeCloseTo(855, 1);
        expect(width).toBeCloseTo(1140, 1);
    });
});
