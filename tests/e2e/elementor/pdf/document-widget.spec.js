const { test, expect } = require('@playwright/test');

let slug = 'https://ep-automation.mdnahidhasan.com/elementor-document-widget/';


test.describe("Elementor Document Widget", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(slug);
    });

    test('Document File Upload > Docs > Custom Viewer', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Document File Upload > Docs' })).toBeVisible();
        await page.waitForTimeout(2000)
        await expect(page.locator('[id="\\31 087299"] iframe[title="Report"]').contentFrame().locator('iframe[name="wacframe"]').contentFrame().getByText('Loading...Loading...Loading...')).toBeVisible();
    });

    test('Document File Upload > PPTX > Google Viewer', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Document File Upload > PPTX > Google Viewer' })).toBeVisible();
        await page.waitForTimeout(2000);
        await expect(page.locator('iframe[title="Who_was_TW_THOMPSON_-_v\\.2xxxxx-2"]').contentFrame().locator('.ndfHFb-c4YZDc-cYSp0e-DARUcf-PLDbbf').first()).toBeVisible();
    });

    test('Document File Upload > PPTX > Microsoft Viewer', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Document File Upload > PPTX > Microsoft Viewer' })).toBeVisible();
        await page.waitForTimeout(2000);
        await page.locator('[id="\\39 76293a"] iframe[title="Report"]').contentFrame().locator('iframe[name="wacframe"]').contentFrame().getByRole('img', { name: 'Page 1' }).click();
    });
});
