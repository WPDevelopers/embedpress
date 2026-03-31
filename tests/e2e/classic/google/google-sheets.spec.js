const { test, expect } = require('@playwright/test');

const slug = 'playwright-classic-editor/classic-google-sheets';

test.describe("Classic Google Sheets", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(slug);
        // await page.waitForLoadState('networkidle');
    });

    test('Classic Google Sheets', async ({ page }) => {
        // Check iframe visibility        
        await expect(page.getByRole('heading', { name: 'Classic Google Sheets' })).toBeVisible();

        // Check iframe visibility
        const iframe = page.locator('#post-9196 div').first();
        await expect(iframe).toBeVisible();

        // Check dimensions height & width
        const { height, width } = await iframe.evaluate(iframe => iframe.getBoundingClientRect());
    });
});
