const { test, expect } = require('@playwright/test');

const slug = 'playwright-classic-editor/classic-google-slides';

test.describe("Classic Google Slides", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(slug);
        await page.waitForLoadState('networkidle');
    });

    test('Classic Google Slides', async ({ page }) => {
        // Check iframe visibility        
        await expect(page.getByRole('heading', { name: 'Classic Google Slides' })).toBeVisible();

        // Check iframe visibility
        const iframe = page.locator('iframe').contentFrame().locator('.sketchyViewerContainer');
        await expect(iframe).toBeVisible();

        // Check dimensions height & width
        const { height, width } = await iframe.evaluate(iframe => iframe.getBoundingClientRect());
    });
});
