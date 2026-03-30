const { test, expect } = require('@playwright/test');

let slug = 'modern-pdf';
let heading = 'Gutenberg Modern pdf';


test.describe("Gutenberg Modern PDF", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto(slug);
    });
    
    // PDF Blocks Embed
    test('PDF Blocks Embed', async ({ page }) => {
        await expect(page.getByRole('heading', { name: heading })).toBeVisible();

        const iframe = page.locator('#embedpress-pdf-1721988006079 iframe[title="sample_pdf"]');
        const frame = iframe.contentFrame();

        await expect(page.getByRole('heading', { name: 'PDF Blocks Embed' })).toBeVisible();
        await expect(frame.getByRole('button', { name: 'Presentation Mode' })).toBeVisible();
        await expect(frame.getByRole('button', { name: 'Save' })).toBeVisible();
        await expect(frame.getByRole('button', { name: 'Print' })).toBeVisible();
    });


    // Enable Pro Controls PDF Blocks
    test('Enable Pro Controls PDF Blocks', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Enable Pro Controls PDF Blocks' })).toBeVisible();

        const iframe = page.locator('#embedpress-pdf-1721994414562 iframe[title="sample_pdf"]');
        const frame = iframe.contentFrame();

        // Check Pro Feature Download/Print Should not visibile 
        await expect(frame.getByRole('button', { name: 'Presentation Mode' })).toBeVisible();
        await expect(frame.getByRole('button', { name: 'Save' })).toBeHidden();
        await expect(frame.getByRole('button', { name: 'Print' })).toBeHidden();
    });

});