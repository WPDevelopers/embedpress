const { test, expect } = require('@playwright/test');

let slug = 'playwright-classic-editor/classic-twitter/';


test.describe('Classic Twitter', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(slug);
    });

    test('Default Twitter', async ({ page }) => {
        const heading = page.getByRole('heading', { name: 'Classic Twitter' });
        await heading.scrollIntoViewIfNeeded();
        await expect(heading).toBeVisible();

        await page.waitForTimeout(1000);

        const iframeLocator = page.locator('#post-9250 div');
        await expect(iframeLocator.first()).toBeVisible();
    });

});