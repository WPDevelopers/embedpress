const { test, expect } = require('@playwright/test');

let slug = 'gutenberg-document-blocks/';


test.describe("Gutenberg Document Blocks", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(slug);
    });

    test('Gu Document Custom Viewer', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Document Custom Viewer' })).toBeVisible();
        await page.waitForTimeout(2000);
        await page.locator('iframe').first().contentFrame().locator('iframe[name="wacframe"]').contentFrame().getByRole('img', { name: 'Page 1' }).click();
    });

    test('Gu PPTX Google Viewer', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'PPTX Google Viewer' })).toBeVisible();
        await page.waitForTimeout(2000);
        await expect(page.locator('iframe').nth(1).contentFrame().locator('.ndfHFb-c4YZDc-cYSp0e-DARUcf-PLDbbf').first()).toBeVisible();
    });

    test('Gu Document Ms Office Viewer', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Document Ms Office Viewer' })).toBeVisible();
        await page.waitForTimeout(2000);
        await expect(page.locator('iframe').nth(2).contentFrame().locator('iframe[name="wacframe"]').contentFrame().getByRole('img', { name: 'Page 1' })).toBeVisible();
    });
});
