const { test, expect } = require('@playwright/test');

let slug = 'modern-pdf-classic';


test.describe("Classic Modern PDF", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(slug);
    });

    test('Default PDF Embed', async ({ page }) => {
        const frameSelector = 'iframe[title="sample_pdf"]';
        await page.waitForSelector(frameSelector, { state: 'visible' });
        const mainFrame = page.frameLocator(frameSelector);

        // await expect(page.frameLocator('iframe[title="sample_pdf"]').getByRole('button', { name: 'Presentation Mode' })).toBeVisible();

        const controls = [
            { role: 'button', name: 'Zoom In' },
            { role: 'button', name: 'Zoom Out' },
            { role: 'button', name: 'Presentation Mode' },
            { role: 'button', name: 'Print' },
            { role: 'button', name: 'Save' },
            { role: 'button', name: 'Toggle Sidebar' },
            { role: 'button', name: 'Find' },
            { role: 'spinbutton', name: 'Page' },
        ];

        // Check visibility of all controls
        for (const control of controls) {
            await expect(mainFrame.getByRole(control.role, { name: control.name })).toBeVisible();
        }

        // Perform additional actions
        await mainFrame.getByRole('button', { name: 'Tools' }).click();

        const toolsControls = [
            { role: 'button', name: 'Tools' },
            { role: 'link', name: 'Current Page' },
            { role: 'button', name: 'Go to Last Page' },
            { role: 'button', name: 'Rotate Clockwise' },
            { role: 'button', name: 'Rotate Counterclockwise' },
            { role: 'radio', name: 'Text Selection Tool' },
            { role: 'radio', name: 'Hand Tool' },
            { role: 'radio', name: 'Page Scrolling' },
            { role: 'radio', name: 'Vertical Scrolling' },
            { role: 'radio', name: 'Horizontal Scrolling' },
            { role: 'radio', name: 'Wrapped Scrolling' },
            { role: 'radio', name: 'No Spreads' },
            { role: 'radio', name: 'Odd Spreads' },
            { role: 'radio', name: 'Even Spreads' },
            { role: 'button', name: 'Document Properties…' },
        ];
        // Check visibility of all controls
        for (const toolsTontrol of toolsControls) {
            await expect(mainFrame.getByRole(toolsTontrol.role, { name: toolsTontrol.name })).toBeVisible();
        }

        await mainFrame.getByRole('button', { name: 'Document Properties…' }).click();
        await expect(page.frameLocator('iframe[title="sample_pdf"]').nth(0).getByText('File name: sample_pdf.pdf File size: ⁨86.2⁩ KB (⁨88,226⁩ bytes) Title: PDF')).toBeVisible();
    });
});