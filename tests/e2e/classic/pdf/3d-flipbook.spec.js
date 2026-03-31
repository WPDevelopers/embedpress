const { test, expect } = require('@playwright/test');

let slug = 'playwright-classic-editor/classic-3d-flipbook-pdf/';


test.describe('3D Flipbook PDF Classic Editor', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(slug);
        await expect(page.getByRole('heading', { name: 'Classic 3D Flipbook PDF' })).toBeVisible();
    });

    test('3d Flipbook All Control', async ({ page }) => {

        let pdfLocator = page.locator('iframe[title="sample_pdf"]').first().contentFrame().locator('iframe[title="View"]').contentFrame()

        await expect(page.getByRole('heading', { name: '3d Flipbook All Control' })).toBeVisible();
        await expect(pdfLocator.locator('div:nth-child(5) > div')).toBeVisible();
        await expect(pdfLocator.getByRole('link', { name: 'Next page' }).first()).toBeVisible();
        await expect(pdfLocator.getByRole('link', { name: 'Previous page' })).toBeVisible();
        await expect(pdfLocator.locator('li').filter({ hasText: 'Smart pan Single page Sounds' }).getByRole('link')).toBeVisible();
        await expect(pdfLocator.getByRole('link', { name: 'Full screen' })).toBeVisible();
        await expect(pdfLocator.getByRole('link', { name: 'Print' })).toBeVisible();
        await expect(pdfLocator.getByRole('link', { name: 'Download' })).toBeVisible();
        await expect(pdfLocator.getByRole('list').getByRole('link', { name: 'Next page' })).toBeVisible();
        await expect(pdfLocator.locator('li:nth-child(5) > a')).toBeVisible();
        await expect(pdfLocator.getByRole('link', { name: 'Table of contents' })).toBeVisible();
        await expect(pdfLocator.getByRole('link', { name: 'Fit view' })).toBeVisible();
        await expect(pdfLocator.getByRole('link', { name: 'Zoom out' })).toBeVisible();
        await expect(pdfLocator.getByRole('link', { name: 'Zoom in' })).toBeVisible();
    });

    test('3d Flipbook Pro Control Enable', async ({ page }) => {

        let pdfLocator = page.locator('iframe[title="sample_pdf"]').nth(1).contentFrame().locator('iframe[title="View"]').contentFrame();
        
        await expect(page.getByRole('heading', { name: '3d Flipbook Pro Control Enable' })).toBeVisible();
        await expect(page.getByText('Disable Download, Disable')).toBeVisible();
        await expect(pdfLocator.getByRole('link', { name: 'Next page' }).first()).toBeVisible();
        await expect(pdfLocator.getByRole('link', { name: 'Previous page' })).toBeVisible();
        await expect(pdfLocator.locator('li').filter({ hasText: 'Smart pan Single page Sounds' }).getByRole('link')).toBeHidden();
        await expect(pdfLocator.getByRole('link', { name: 'Full screen' })).toBeHidden();
        await expect(pdfLocator.getByRole('list').getByRole('link', { name: 'Next page' })).toBeHidden();
        await expect(pdfLocator.locator('li:nth-child(5) > a')).toBeHidden();
        await expect(pdfLocator.getByRole('link', { name: 'Table of contents' })).toBeHidden();
        await expect(pdfLocator.getByRole('link', { name: 'Fit view' })).toBeHidden();
        await expect(pdfLocator.getByRole('link', { name: 'Zoom out' })).toBeHidden();
        await expect(pdfLocator.getByRole('link', { name: 'Zoom in' })).toBeHidden();
        await expect(pdfLocator.getByRole('link', { name: 'Download' })).toBeHidden();
        await expect(pdfLocator.getByRole('link', { name: 'Print' })).toBeHidden();
    });

    test('3d Flipbook Enable & Disable Control', async ({ page }) => {

        let pdfLocator = page.locator('iframe[title="sample_pdf"]').nth(2).contentFrame().locator('iframe[title="View"]').contentFrame();

        await expect(page.getByRole('heading', { name: '3d Flipbook Enable & Disable Control' })).toBeVisible();
        await expect(page.getByText('Disable Download, Disable')).toBeVisible();
        await expect(pdfLocator.getByRole('link', { name: 'Next page' }).first()).toBeVisible();
        await expect(pdfLocator.getByRole('link', { name: 'Previous page' })).toBeVisible();
        await expect(pdfLocator.locator('li').filter({ hasText: 'Smart pan Single page Sounds' }).getByRole('link')).toBeVisible();
        await expect(pdfLocator.getByRole('link', { name: 'Full screen' })).toBeVisible();
        await expect(pdfLocator.getByRole('list').getByRole('link', { name: 'Next page' })).toBeVisible();
        await expect(pdfLocator.locator('li:nth-child(5) > a')).toBeVisible();
        await expect(pdfLocator.getByRole('link', { name: 'Fit view' })).toBeVisible();
        await expect(pdfLocator.getByRole('link', { name: 'Zoom out' })).toBeHidden();
        await expect(pdfLocator.getByRole('link', { name: 'Zoom in' })).toBeVisible();
        await expect(pdfLocator.getByRole('link', { name: 'Download' })).toBeHidden();
        await expect(pdfLocator.getByRole('link', { name: 'Print' })).toBeHidden();
    });
});