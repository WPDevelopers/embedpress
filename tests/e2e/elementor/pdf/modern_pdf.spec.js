const { test, expect } = require('@playwright/test');

const slug = 'modern-pdf-elementor';

async function getFrame(page, frameSelector) {
    await page.waitForSelector(frameSelector);
    return page.frameLocator(frameSelector);
}

test.describe('Elementor Modern PDF', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto(slug);
    });

    test('Enable All Controls', async ({ page }) => {

        const frameSelector = '#ep-elementor-content-60c5872 iframe[title="sample_pdf"]';
        const frame = await getFrame(page, frameSelector);

        await expect(page.getByRole('heading', { name: 'Enable All Control' })).toBeVisible();

        await expect(frame.getByRole('button', { name: 'Toggle Sidebar' })).toBeVisible();
        await expect(frame.getByRole('button', { name: 'Find' })).toBeVisible();
        await expect(frame.getByRole('button', { name: 'Next' }).first()).toBeVisible();
        await expect(frame.getByRole('spinbutton', { name: 'Page' })).toBeVisible();
        await expect(frame.getByText('of ⁨4⁩').first()).toBeVisible();

        await expect(frame.getByRole('button', { name: 'Zoom Out' })).toBeVisible();
        await expect(frame.getByRole('button', { name: 'Zoom In' })).toBeVisible();
        await expect(frame.locator('#scaleSelect')).toBeVisible();

        await expect(frame.getByRole('radio', { name: 'Text' })).toBeVisible();
        await expect(frame.getByRole('radio', { name: 'Draw' })).toBeVisible();
        await expect(frame.getByRole('radio', { name: 'Add or edit images' })).toBeVisible();

        await expect(frame.getByRole('button', { name: 'Presentation Mode' })).toBeVisible();
        await expect(frame.getByRole('button', { name: 'Print' })).toBeVisible();
        await expect(frame.getByRole('button', { name: 'Save' })).toBeVisible();

        await expect(frame.getByRole('button', { name: 'Tools' })).toBeVisible();
        await expect(frame.getByText('PDF Bookmark Sample Page 1 of')).toBeVisible();

        await frame.getByRole('button', { name: 'Tools' }).click();

        await expect(frame.locator('#secondaryPrint')).toBeVisible();
        await expect(frame.locator('#secondaryDownload')).toBeVisible();
        await expect(frame.getByRole('link', { name: 'Current Page' })).toBeVisible();
        await expect(frame.getByRole('button', { name: 'Go to Last Page' })).toBeVisible();
        await expect(frame.getByRole('button', { name: 'Rotate Clockwise' })).toBeVisible();
        await expect(frame.getByRole('button', { name: 'Rotate Counterclockwise' })).toBeVisible();

        await expect(frame.getByRole('radio', { name: 'Text Selection Tool' })).toBeVisible();
        await expect(frame.getByRole('radio', { name: 'Hand Tool' })).toBeVisible();
        await expect(frame.getByRole('radio', { name: 'Page Scrolling' })).toBeVisible();
        await expect(frame.getByRole('radio', { name: 'Vertical Scrolling' })).toBeVisible();
        await expect(frame.getByRole('radio', { name: 'Horizontal Scrolling' })).toBeVisible();
        await expect(frame.getByRole('radio', { name: 'Wrapped Scrolling' })).toBeVisible();
        await expect(frame.getByRole('radio', { name: 'Odd Spreads' })).toBeVisible();
        await expect(frame.getByRole('radio', { name: 'Even Spreads' })).toBeVisible();

        await expect(frame.getByRole('button', { name: 'Document Properties…' })).toBeVisible();

        await frame.getByRole('button', { name: 'Tools' }).click();

        await expect(page.getByText('Powered By EmbedPress')).toBeVisible();

    });


    test('Enable Few Controls', async ({ page }) => {

        const frameSelector = '#ep-elementor-content-9a5be7a iframe[title="sample_pdf"]';
        const frame = await getFrame(page, frameSelector);

        await expect(page.getByRole('heading', { name: 'Enable Few Controls' })).toBeVisible();


        await expect(frame.getByRole('button', { name: 'Presentation Mode' })).toBeHidden();
        await expect(frame.getByRole('button', { name: 'Print' })).toBeHidden();
        await expect(frame.getByRole('button', { name: 'Save' })).toBeHidden();

        await expect(frame.getByRole('button', { name: 'Toggle Sidebar' })).toBeVisible();
        await expect(frame.getByRole('button', { name: 'Find' })).toBeVisible();
        await expect(frame.getByRole('button', { name: 'Next' })).toBeVisible();

        await expect(frame.getByRole('spinbutton', { name: 'Page' })).toBeVisible();
        await expect(frame.getByText('of ⁨4⁩')).toBeVisible();

        await expect(frame.getByRole('button', { name: 'Zoom Out' })).toBeVisible();
        await expect(frame.getByRole('button', { name: 'Zoom In' })).toBeVisible();
        await expect(frame.locator('#scaleSelect')).toBeVisible();

        await expect(frame.getByRole('radio', { name: 'Text' })).toBeVisible();
        await expect(frame.getByRole('radio', { name: 'Draw' })).toBeVisible();
        await expect(frame.getByRole('radio', { name: 'Add or edit images' })).toBeVisible();

        await expect(frame.getByRole('button', { name: 'Tools' })).toBeVisible();
        await expect(frame.getByText('PDF Bookmark Sample Page 1 of')).toBeVisible();

        await frame.getByRole('button', { name: 'Tools' }).click();

        await expect(frame.getByRole('link', { name: 'Current Page' })).toBeVisible();
        await expect(frame.getByRole('button', { name: 'Go to Last Page' })).toBeVisible();
        await expect(frame.getByRole('button', { name: 'Rotate Counterclockwise' })).toBeVisible();

        await expect(frame.getByRole('radio', { name: 'Hand Tool' })).toBeVisible();
        await expect(frame.getByRole('radio', { name: 'Page Scrolling' })).toBeVisible();
        await expect(frame.getByRole('radio', { name: 'Horizontal Scrolling' })).toBeVisible();
        await expect(frame.getByRole('radio', { name: 'No Spreads' })).toBeVisible();

        await frame.getByRole('button', { name: 'Tools' }).click();
    });

});