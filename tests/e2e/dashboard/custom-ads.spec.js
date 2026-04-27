const { test, expect } = require('@playwright/test');

test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('Dashboard Custom Ads Tab', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('wp-admin/admin.php?page=embedpress&page_type=ads');
    });

    test('Should display EmbedPress Custom Ads', async ({ page }) => {
        await expect(page.locator('.sponsored-settings-top')).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Advertise Across 250+' })).toBeVisible();
        await expect(page.getByText('Now, you can showcase your')).toBeVisible();
        await expect(page.locator('.btn-video')).toBeVisible();
        await expect(page.getByText('Live Preview for Video')).toBeVisible();
        await expect(page.getByText('Experience EmbedPress Ad feature with YouTube video, but it will work with all')).toBeVisible();
        await expect(page.locator('iframe[title="Templately - Ultimate WordPress Templates Cloud for Elementor \\& Gutenberg"]').contentFrame().locator('.ytp-cued-thumbnail-overlay-image')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Start Preview' })).toBeVisible();
        await expect(page.locator('.range_positive').first()).toBeVisible();
        await expect(page.locator('.range_negative').first()).toBeVisible();
        await expect(page.locator('#ad-preview-0 input[name="adStart"]')).toBeVisible();
        await expect(page.locator('#ad-preview-0').getByText('Ad Redirection URL')).toBeVisible();
        await expect(page.getByRole('textbox')).toBeVisible();
        await expect(page.locator('#ad-preview-0').getByText('Skip Button', { exact: true })).toBeVisible();
        await expect(page.locator('#ad-preview-0').getByText('Skip Button After (Sec)')).toBeVisible();
        await expect(page.locator('#ad-preview-0 label')).toBeVisible();
        await page.locator('.btn-img').click();
        await expect(page.getByRole('button', { name: ' Upload' })).toBeVisible();
        await expect(page.getByText('demo-ad.gif')).toBeVisible();
        await expect(page.locator('#ad-preview-1').getByText('Ad Redirection URL')).toBeVisible();
        await expect(page.locator('#ad-preview-1').getByText('Ad Redirection URL')).toBeVisible();
        await expect(page.getByRole('textbox')).toBeVisible();
        await expect(page.locator('#ad-preview-1').getByText('Ad Start After (Sec)')).toBeVisible();
        await expect(page.locator('#ad-preview-1 > .form-input-wrapper > div:nth-child(3) > .ad__adjust__controller__inputs > .range-control > .range_negative')).toBeVisible();
        // await expect(page.getByRole('spinbutton')).toBeVisible();
        await expect(page.locator('#ad-preview-1 > .form-input-wrapper > div:nth-child(3) > .ad__adjust__controller__inputs > .range-control > .range_positive')).toBeVisible();
        await expect(page.getByText('Live Preview for Documents')).toBeVisible();
        await expect(page.getByText('Experience EmbedPress Ad feature with with a PDF, but it will work with all')).toBeVisible();
        await expect(page.locator('iframe[title="sample"]').contentFrame().locator('#viewer')).toBeVisible();
        await expect(page.getByText('Live Preview for Documents Experience EmbedPress Ad feature with with a PDF,')).toBeVisible();
    });
});