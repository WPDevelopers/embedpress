const { test, expect } = require('@playwright/test');

const slug = 'playwright-classic-editor/classic-google-forms';

test.describe("Classic Google Forms", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(slug);
        await page.waitForLoadState('networkidle');
    });

    test('Classic Google Forms', async ({ page }) => {
        test.skip(process.env.CI, 'Skipping this test in CI');
        // Check iframe visibility        
        await expect(page.getByRole('heading', { name: 'Classic Google Forms' })).toBeVisible();

        // Check iframe visibility
        const iframe = page.locator('iframe').contentFrame().locator('div').filter({ hasText: 'Contact information* প্রয়োজনীয় প্রশ্ন নির্দেশ করেName *আপনার উত্তরEmail' }).first()
        await expect(iframe).toBeVisible();
    });
});
