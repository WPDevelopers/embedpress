const { test, expect } = require('@playwright/test');

let slug = 'playwright-classic/classic-linkedin/';


test.describe('Classic LinkedIn', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(slug);
    });

    test('Default LinkedIn', async ({ page }) => {
        const heading = page.getByRole('heading', { name: 'Classic LinkedIn' });
        await heading.scrollIntoViewIfNeeded();
        await expect(heading).toBeVisible();

        await page.waitForTimeout(1000);

        const iframeLocator = page.locator('iframe');
        
        await expect(iframeLocator.first()).toBeVisible();
    });

});