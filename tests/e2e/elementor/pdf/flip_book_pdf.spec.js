const { test, expect } = require('@playwright/test');

const slug = 'flip-book-pdf-elementor';

async function getViewFrame(page, frameSelector) {
    await page.waitForSelector(frameSelector);
    return page
        .frameLocator(frameSelector)
        .frameLocator('iframe[title="View"]');
}

test.describe('Elementor Flip Book PDF', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto(slug);
    });

    test('Enable All Controls', async ({ page }) => {

        const frameSelector = '#ep-elementor-content-9a442da iframe[title="sample_pdf"]';
        const viewFrame = await getViewFrame(page, frameSelector);

        await expect(page.getByRole('heading', { name: 'Enable all Controls' })).toBeVisible();

        await expect(viewFrame.getByRole('link', { name: 'Fit view' })).toBeVisible();
        await expect(viewFrame.getByRole('link', { name: 'Table of contents' })).toBeVisible();

        await expect(viewFrame.locator('li:nth-child(5) > a')).toBeVisible();
        await expect(viewFrame.getByRole('textbox', { name: '1' }).first()).toBeVisible();

        await expect(
            viewFrame.getByRole('list').getByRole('link', { name: 'Next page' })
        ).toBeVisible();

        await expect(viewFrame.getByRole('link', { name: 'Download' })).toBeVisible();
        await expect(viewFrame.getByRole('link', { name: 'Print' })).toBeVisible();
        await expect(viewFrame.getByRole('link', { name: 'Full screen' })).toBeVisible();

        await expect(
            viewFrame
                .getByRole('listitem')
                .filter({ hasText: 'Smart pan Single page Sounds' })
                .getByRole('link')
        ).toBeVisible();

    });


    test('Enable Few Controls', async ({ page }) => {

        const frameSelector = '#ep-elementor-content-3393d31 iframe[title="sample_pdf"]';
        const viewFrame = await getViewFrame(page, frameSelector);

        await expect(page.getByRole('heading', { name: 'Few Controls Enable' })).toBeVisible();

        await expect(viewFrame.getByRole('link', { name: 'Download' })).toBeHidden();
        await expect(viewFrame.getByRole('link', { name: 'Print' })).toBeHidden();

        await expect(viewFrame.getByRole('link', { name: 'Fit view' })).toBeVisible();
        await expect(viewFrame.getByRole('link', { name: 'Table of contents' })).toBeVisible();

        await expect(viewFrame.locator('li:nth-child(5) > a')).toBeVisible();
        await expect(viewFrame.getByRole('textbox', { name: '1' }).first()).toBeVisible();

        await expect(
            viewFrame.getByRole('list').getByRole('link', { name: 'Next page' })
        ).toBeVisible();

        await expect(viewFrame.getByRole('link', { name: 'Full screen' })).toBeVisible();

        await expect(
            viewFrame
                .getByRole('listitem')
                .filter({ hasText: 'Smart pan Single page Sounds' })
                .getByRole('link')
        ).toBeVisible();

        await expect(viewFrame.getByRole('link', { name: 'Next page' }).first()).toBeVisible();
        await expect(viewFrame.getByRole('link', { name: 'Previous page' })).toBeVisible();

        await viewFrame.getByRole('link', { name: 'Next page' }).first().click();
        await viewFrame.getByRole('link', { name: 'Previous page' }).click();

    });
});