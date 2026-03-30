const { test, expect } = require('@playwright/test');

test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('Dashboard Branding Tab', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://ep-automation.mdnahidhasan.com/wp-admin/admin.php?page=embedpress&page_type=custom-logo');
    });

    test('Should display EmbedPress Branding content', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Global Branding Settings' })).toBeVisible();
        await expect(page.getByText('Powered by EmbedPress')).toBeVisible();
        await expect(page.locator('form div').filter({ hasText: 'Powered by EmbedPress' }).locator('label')).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Custom Logo' })).toBeVisible();
        await expect(page.getByText('YouTube Custom Branding')).toBeVisible();
        await expect(page.locator('form div').filter({ hasText: 'YouTube Custom Branding' }).locator('label').first()).toBeVisible();
        await expect(page.getByText('Vimeo Custom Branding')).toBeVisible();
        await expect(page.locator('form div').filter({ hasText: 'Vimeo Custom Branding' }).locator('label').first()).toBeVisible();
        await expect(page.getByText('Wistia Custom Branding')).toBeVisible();
        await expect(page.locator('form div').filter({ hasText: 'Wistia Custom Branding' }).locator('label').first()).toBeVisible();
        await expect(page.getByText('Twitch Custom Branding')).toBeVisible();
        await expect(page.locator('form div').filter({ hasText: 'Twitch Custom Branding' }).locator('label').first()).toBeVisible();
        await expect(page.getByText('Dailymotion Custom Branding')).toBeVisible();
        await expect(page.locator('form div').filter({ hasText: 'Dailymotion Custom Branding' }).locator('label').first()).toBeVisible();
        await expect(page.getByText('Document Custom Branding')).toBeVisible();
        await expect(page.locator('form div').filter({ hasText: 'Document Custom Branding' }).locator('label').first()).toBeVisible();
        await expect(page.getByRole('button', { name: 'Save Changes' })).toBeVisible();
        await page.locator('form div').filter({ hasText: 'Powered by EmbedPress' }).locator('span').click();
        await page.locator('form div').filter({ hasText: 'Powered by EmbedPress' }).locator('span').click();

        await page.locator('div:nth-child(5) > .form__control__wrap > .input__switch > span').click();
        await expect(page.getByRole('link', { name: 'Settings ' })).toBeVisible();

        await page.getByRole('link', { name: 'Settings ' }).click();
        await page.getByRole('button', { name: 'Save Changes' }).click();
    });

    test('Should functionility Options Working Properly', async ({ page }) => {
        // YouTube Custom Branding Enable       
        await page.locator('div:nth-child(5) > .form__control__wrap > .input__switch > span').click();
        await page.getByRole('button', { name: 'Save Changes' }).click();

        // YouTube Custom Branding on youtube video visibility test       
        await page.goto('https://ep-automation.mdnahidhasan.com/global-branding/');
        await page.locator('iframe[title="যেভাবে প্লাস্টিকের কারণে ক্ষতিগ্রস্ত হচ্ছে মানুষ \\| People are Being Harmed by Plastic \\| Gtv News"]').contentFrame().getByLabel('Play', { exact: true }).click();

        // YouTube Custom Branding Disable      
        await page.goto('https://ep-automation.mdnahidhasan.com/wp-admin/admin.php?page=embedpress&page_type=custom-logo');
        await page.locator('div:nth-child(5) > .form__control__wrap > .input__switch > span').click();
        await page.getByRole('button', { name: 'Save Changes' }).click();
    });
});