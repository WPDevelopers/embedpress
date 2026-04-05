const { test, expect } = require('@playwright/test');

const slug = 'playwright-elementor/elementor-google-map';

test.describe("Elementor Google Map", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(slug);
        // await page.waitForLoadState('networkidle');
    });

    test('Default Google Map', async ({ page }) => {
        // Check iframe visibility        
        await expect(page.getByRole('heading', { name: 'Google Map - Full Height -' })).toBeVisible();

        // Check iframe visibility
        const iframe = page.locator('#ep-elements-id-1aadbae iframe');
        await expect(iframe).toBeVisible();

        // Check dimensions height & width
        const { height, width } = await iframe.evaluate(iframe => iframe.getBoundingClientRect());
        expect(height).toBeCloseTo(630, 1);
        expect(width).toBeCloseTo(760, 1);
    });

    test('Full Width Google Map', async ({ page }) => {
        // Check iframe visibility
        await expect(page.getByRole('heading', { name: 'Full Height Width' })).toBeVisible();

        // Check iframe visibility
        const iframe = page.locator('#ep-elements-id-7084de3 iframe');
        await expect(iframe).toBeVisible();

        // Check dimensions height & width
        const { height, width } = await iframe.evaluate(iframe => iframe.getBoundingClientRect());
        expect(height).toBeCloseTo(880, 1);
        expect(width).toBeCloseTo(1140, 1);
    });
});
