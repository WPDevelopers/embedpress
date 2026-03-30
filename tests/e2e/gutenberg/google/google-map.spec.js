const { test, expect } = require('@playwright/test');

const slug = 'playwright-gutenberg/gutenberg-google-map';

test.describe("Elementor Google Map", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(slug);
        await page.waitForLoadState('networkidle');
    });

    test('Default Google Map', async ({ page }) => {
        // Check iframe visibility        
        await expect(page.getByRole('heading', { name: 'Default Google Map 800×500' })).toBeVisible();
        
        // Check iframe visibility
        await expect(page.locator('iframe').first().contentFrame().locator('.gm-style > div > div:nth-child(2)').first()).toBeVisible();
        const iframe = page.locator('iframe').first().contentFrame().locator('.gm-style > div > div:nth-child(2)').first();
        await expect(iframe).toBeVisible();

      
    });

    test('Full Width Google Map', async ({ page }) => {
        // Check iframe visibility
        await expect(page.getByRole('heading', { name: 'Google Map Full Width 1178×768' })).toBeVisible();

        // Check iframe visibility
        const iframe = page.locator('iframe').nth(1);
        await expect(iframe).toBeVisible();

    
    });
});
