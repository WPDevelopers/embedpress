const { test, expect } = require('@playwright/test');

let slug = 'playwright-elementor/elementor-linkedin/';


test.describe('Elementor LinkedIn', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(slug);
    });

    test('Default LinkedIn', async ({ page }) => {
        const heading = page.getByRole('heading', { name: 'Default linkedIn Embed Test' });
        await heading.scrollIntoViewIfNeeded();
        await expect(heading).toBeVisible();

        const iframeLocator = page.locator('iframe');

        await expect(iframeLocator.first()).toBeVisible();
        await expect(page.locator('iframe').contentFrame().getByLabel('View profile for Md. Nahid')).toBeVisible();
    });

});