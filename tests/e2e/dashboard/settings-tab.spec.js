const { test, expect } = require('@playwright/test');

test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('Dashboard General Tab', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('wp-admin/admin.php?page=embedpress');
    });

    test('Should display EmbedPress Dashboard content', async ({ page }) => {
        await expect(page.locator('header').getByRole('link').first()).toBeVisible();
        await expect(page.getByText('Embed content instantly. No code needed. Trusted by 100,000+ sites.')).toBeVisible();
        // await expect(page.getByText(/Core Version: v\d+\.\d+\.\d+/)).toBeVisible();
        // await expect(page.getByText(/Pro Version: v\d+\.\d+\.\d+/)).toBeVisible();
        await expect(page.locator('.img-box > img')).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Get Started with EmbedPress' })).toBeVisible();
        await expect(page.getByText('All-in-one WordPress')).toBeVisible();
        await expect(page.locator('#wpbody-content a').filter({ hasText: /^Documentation$/ })).toBeVisible();
        await expect(page.locator('.icon').first()).toBeVisible();
        await expect(page.locator('div:nth-child(2) > .icon')).toBeVisible();
        await expect(page.locator('div:nth-child(3) > .icon')).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Show Your Love' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Documentation' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Need Help?' })).toBeVisible();
        await expect(page.getByText('We love to have you in the')).toBeVisible();
        await expect(page.getByText('Get started by spending some')).toBeVisible();
        await expect(page.getByText('Stuck with something? Get')).toBeVisible();
        await expect(page.getByRole('link', { name: 'Leave A Review' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Documentation' }).nth(1)).toBeVisible();
        await expect(page.getByRole('link', { name: 'Get Support' })).toBeVisible();
        await expect(page.locator('.sponsored-link_bg')).toBeVisible();
        await page.locator('.sponsored-link_bg').click();
        await expect(page.getByRole('link', { name: 'Unlock pro Features' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Get Support' }).nth(1)).toBeVisible();
        await expect(page.getByRole('link', { name: 'Suggest a Feature' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Join Our Community' }).first()).toBeVisible();
        await page.locator('.sponsored-link_bg').click();
    });

    test('Should display and functional Settings tab', async ({ page }) => {
        await page.locator('#wpbody-content').getByText('Settings', { exact: true }).click();
        await expect(page.getByRole('heading', { name: 'Global Embed iFrame' })).toBeVisible();
        await expect(page.getByText('Embed iFrame Width')).toBeVisible();
        await page.locator('input[name="enableEmbedResizeWidth"]').click();
        await page.locator('input[name="enableEmbedResizeWidth"]').fill('800');
        await expect(page.getByText('px').first()).toBeVisible();
        await expect(page.getByText('Embed iFrame Height')).toBeVisible();
        await page.locator('input[name="enableEmbedResizeHeight"]').click();
        await page.locator('input[name="enableEmbedResizeHeight"]').fill('500');
        await expect(page.getByText('px').nth(1)).toBeVisible();
        await page.getByRole('button', { name: 'Save Changes' }).click();
        await expect(page.locator('#wpbody-content div').filter({ hasText: 'Settings Updated' }).nth(4)).toBeVisible();
        await expect(page.locator('input[name="enableEmbedResizeWidth"]')).toBeVisible();
        await expect(page.getByText('Lazy Load')).toBeVisible();
        await page.locator('.input__switch > span').first().click();
        await page.locator('.input__switch > span').first().click();
        await expect(page.getByText('PDF Custom Color')).toBeVisible();
        await page.locator('label').filter({ hasText: 'Settings' }).locator('span').click();
        await expect(page.getByRole('link', { name: 'Settings ' })).toBeHidden();
        await expect(page.locator('#embedpress_pdf_global_custom_color')).toBeHidden();
        await page.locator('label').filter({ hasText: 'Settings' }).locator('span').click();
        await page.getByRole('link', { name: 'Settings ' }).click();
        await expect(page.locator('#embedpress_pdf_global_custom_color')).toBeVisible();
        await expect(page.getByText('Loading Animation (Coming')).toBeVisible();
        await expect(page.getByText('Help', { exact: true })).toBeVisible();
        await page.getByRole('button', { name: 'Save Changes' }).click();
    });
});