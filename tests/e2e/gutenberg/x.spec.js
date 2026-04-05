const { test, expect } = require('@playwright/test');

let slug = 'playwright-gutenberg/gutenberg-twitter/';

test.describe('Gutenberg Twitter', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(slug);
    });

    test('Default Twitter Visibility Test', async ({ page }) => {
        const heading = page.getByRole('heading', { name: 'Gutenberg Twitter' });
        await heading.scrollIntoViewIfNeeded();
        await expect(heading).toBeVisible();

        await page.waitForTimeout(1000);

        // Select the first iframe with title "X Post" and validate its visibility
        const iframe = page.locator('iframe[title="X Post"]').first();
        await expect(iframe).toBeVisible();
    });
});
