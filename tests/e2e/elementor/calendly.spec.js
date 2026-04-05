const { test, expect } = require('@playwright/test');

let slug = 'playwright-gutenberg/elementor-calendly';


test.describe("Gutenberg Calendly", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(slug);
    });

    test('Default Gutenberg Calendly', async ({ page }) => {

        let defaultLocator = page.locator('iframe[title="Select a Date \\& Time - Calendly"]')

        await expect(page.locator('h2')).toBeVisible();

        await expect(defaultLocator.contentFrame().getByLabel('Cookie banner')).toBeVisible();
        await expect(defaultLocator.contentFrame().getByText('Md. Nahid Hasan')).toBeVisible();
        await expect(defaultLocator.contentFrame().getByRole('heading', { name: 'Custom Event' })).toBeVisible();
        await expect(defaultLocator.contentFrame().getByText('Web conferencing details')).toBeVisible();
        await expect(defaultLocator.contentFrame().getByText('Md. Nahid HasanCustom Event1')).toBeVisible();
        await expect(defaultLocator.contentFrame().getByRole('link', { name: 'powered by Calendly' })).toBeVisible();
        await expect(defaultLocator.contentFrame().locator('div').filter({ hasText: /^Cookie settings$/ }).nth(1)).toBeVisible();
    });

    // More TestCases will added later as found error on this feature card link - https://projects.startise.com/fbs-73072

});