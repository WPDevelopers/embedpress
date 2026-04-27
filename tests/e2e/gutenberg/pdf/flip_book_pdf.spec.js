const { test, expect } = require('@playwright/test');

let slug = 'flip-book-pdf';


test.describe("Gutenberg Flip Book PDF", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(slug);
        await expect(page.getByRole('heading', { name: 'Flip Book Pdf' })).toBeVisible();
    });

    test('To Enable All Controls', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Enable All Controls – Toolbar' })).toBeVisible();
        await page.locator('iframe[title="sample_pdf"]').first().contentFrame().locator('iframe[title="View"]').contentFrame().getByRole('link', { name: 'Next page' }).first().click();
        await expect(page.locator('iframe[title="sample_pdf"]').first().contentFrame().locator('iframe[title="View"]').contentFrame().getByRole('textbox', { name: '1' }).first()).toBeVisible();
        await expect(page.locator('iframe[title="sample_pdf"]').first().contentFrame().locator('iframe[title="View"]').contentFrame().getByRole('list').getByRole('link', { name: 'Next page' })).toBeVisible();
        await expect(page.locator('iframe[title="sample_pdf"]').first().contentFrame().locator('iframe[title="View"]').contentFrame().getByRole('link', { name: 'Full screen' })).toBeVisible();
        await expect(page.locator('iframe[title="sample_pdf"]').first().contentFrame().locator('iframe[title="View"]').contentFrame().getByRole('listitem').filter({ hasText: 'Smart pan Single page Stats' }).getByRole('link')).toBeVisible();
        await expect(page.locator('iframe[title="sample_pdf"]').first().contentFrame().locator('iframe[title="View"]').contentFrame().locator('li:nth-child(5) > a')).toBeVisible();
        await expect(page.locator('iframe[title="sample_pdf"]').first().contentFrame().locator('iframe[title="View"]').contentFrame().getByRole('link', { name: 'Table of contents' })).toBeVisible();
        await expect(page.locator('iframe[title="sample_pdf"]').nth(1).contentFrame().locator('iframe[title="View"]').contentFrame().getByRole('link', { name: 'Download' })).toBeHidden()
        await expect(page.locator('iframe[title="sample_pdf"]').first().contentFrame().locator('iframe[title="View"]').contentFrame().getByRole('link', { name: 'Fit view' })).toBeVisible();
        await expect(page.locator('iframe[title="sample_pdf"]').first().contentFrame().locator('iframe[title="View"]').contentFrame().getByRole('link', { name: 'Zoom out' })).toBeVisible();
        await expect(page.locator('iframe[title="sample_pdf"]').first().contentFrame().locator('iframe[title="View"]').contentFrame().getByRole('link', { name: 'Zoom in' })).toBeVisible();
        await expect(page.locator('iframe[title="sample_pdf"]').first().contentFrame().locator('iframe[title="View"]').contentFrame().getByRole('link', { name: 'Next page' }).first()).toBeVisible();
        await expect(page.locator('iframe[title="sample_pdf"]').first().contentFrame().locator('iframe[title="View"]').contentFrame().getByRole('link', { name: 'Previous page' })).toBeVisible();
        await page.locator('iframe[title="sample_pdf"]').first().contentFrame().locator('iframe[title="View"]').contentFrame().getByRole('link', { name: 'Next page' }).first().click();
        await page.locator('iframe[title="sample_pdf"]').first().contentFrame().locator('iframe[title="View"]').contentFrame().getByRole('link', { name: 'Full screen' }).click();
    });

    test('To Enable Few Controls', async ({ page }) => {
        await page.waitForTimeout(1000);
        await expect(page.getByRole('heading', { name: 'Enable Few Controls Toolbar' })).toBeVisible();
        await expect(page.locator('iframe[title="sample_pdf"]').nth(1).contentFrame().locator('iframe[title="View"]').contentFrame().getByRole('link', { name: 'Fit view' })).toBeVisible();
        await expect(page.locator('iframe[title="sample_pdf"]').nth(1).contentFrame().locator('iframe[title="View"]').contentFrame().getByRole('link', { name: 'Table of contents' })).toBeVisible();
        await expect(page.locator('iframe[title="sample_pdf"]').nth(1).contentFrame().locator('iframe[title="View"]').contentFrame().locator('li:nth-child(4) > a')).toBeVisible();
        await expect(page.locator('iframe[title="sample_pdf"]').nth(1).contentFrame().locator('iframe[title="View"]').contentFrame().getByRole('textbox', { name: '1' }).first()).toBeVisible();
        await expect(page.locator('iframe[title="sample_pdf"]').nth(1).contentFrame().locator('iframe[title="View"]').contentFrame().getByRole('list').getByRole('link', { name: 'Next page' })).toBeVisible();
        await expect(page.locator('iframe[title="sample_pdf"]').nth(1).contentFrame().locator('iframe[title="View"]').contentFrame().getByRole('link', { name: 'Download' })).toBeVisible();
        await expect(page.locator('iframe[title="sample_pdf"]').nth(1).contentFrame().locator('iframe[title="View"]').contentFrame().getByRole('link', { name: 'Print' })).toBeVisible();
        await expect(page.locator('iframe[title="sample_pdf"]').nth(1).contentFrame().locator('iframe[title="View"]').contentFrame().getByRole('listitem').filter({ hasText: 'Smart pan Single page Stats' }).getByRole('link')).toBeVisible();
        await expect(page.locator('iframe[title="sample_pdf"]').nth(1).contentFrame().locator('iframe[title="View"]').contentFrame().getByRole('link', { name: 'Next page' }).first()).toBeVisible();
        await expect(page.locator('iframe[title="sample_pdf"]').nth(1).contentFrame().locator('iframe[title="View"]').contentFrame().getByRole('link', { name: 'Previous page' })).toBeVisible();
        await expect(page.locator('iframe[title="sample_pdf"]').nth(1).contentFrame().locator('iframe[title="View"]').contentFrame().locator('div:nth-child(5) > div')).toBeVisible();
        await page.locator('iframe[title="sample_pdf"]').nth(1).contentFrame().locator('iframe[title="View"]').contentFrame().getByRole('link', { name: 'Next page' }).first().click();
        await page.locator('iframe[title="sample_pdf"]').nth(1).contentFrame().locator('iframe[title="View"]').contentFrame().getByRole('link', { name: 'Previous page' }).click();
        const downloadPromise = page.waitForEvent('download');
        await page.locator('iframe[title="sample_pdf"]').nth(1).contentFrame().locator('iframe[title="View"]').contentFrame().getByRole('link', { name: 'Download' }).click();
        const download = await downloadPromise;
        await page.locator('iframe[title="sample_pdf"]').nth(1).contentFrame().locator('iframe[title="View"]').contentFrame().getByRole('listitem').filter({ hasText: 'Smart pan Single page Stats' }).getByRole('link').click();
    });
});