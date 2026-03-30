const { test, expect } = require('@playwright/test');

test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('Dashboard Elements Tab', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('wp-admin/admin.php?page=embedpress&page_type=elements');
    });

    test('Should display EmbedPress Elements content and functionility Options', async ({ page }) => {
        // Gutenberg Editor
        await expect(page.getByRole('heading', { name: 'Gutenberg' })).toBeVisible();
        await expect(page.getByText('EmbedPress It supports 250+')).toBeVisible();
        await expect(page.getByText('Document Documentation', { exact: true })).toBeVisible();
        await expect(page.getByText('EmbedPress PDF Documentation').first()).toBeVisible();
        await expect(page.getByText('EmbedPress Calendar Documentation').first()).toBeVisible();
        await expect(page.getByText('YouTube Documentation')).toBeVisible();
        await expect(page.getByText('Google Docs Documentation')).toBeVisible();
        await expect(page.getByText('Google Slides Documentation')).toBeVisible();
        await expect(page.getByText('Google Sheets Documentation')).toBeVisible();
        await expect(page.getByText('Google Forms Documentation')).toBeVisible();
        await expect(page.getByText('Google Drawings Documentation')).toBeVisible();
        await expect(page.getByText('Google Maps Documentation')).toBeVisible();
        await expect(page.getByText('Twitch Documentation')).toBeVisible();
        await expect(page.getByText('Wistia Documentation')).toBeVisible();
        await expect(page.getByText('Vimeo Documentation')).toBeVisible();

        // Functionility Check Switch On Off 
        await page.locator('.input__switch > span').first().click();
        await expect(page.locator('#wpbody-content div').filter({ hasText: 'Settings Updated' }).nth(4)).toBeVisible();
        await page.locator('.input__switch > span').first().click();

        // Elementor 
        await expect(page.getByRole('heading', { name: 'Elementor' })).toBeVisible();
        await expect(page.getByText('EmbedPress Documentation')).toBeVisible();
        await expect(page.getByText('EmbedPress Document Documentation')).toBeVisible();
        await expect(page.getByText('EmbedPress PDF Documentation').nth(1)).toBeVisible();
        await expect(page.getByText('EmbedPress Calendar Documentation').nth(1)).toBeVisible();

        // Classic Editor 
        await expect(page.getByRole('heading', { name: 'Classic Editor' })).toBeVisible();
        await expect(page.locator('div:nth-child(3) > .embedpress--elements__wrap > .embedpress__row > div').first()).toBeVisible();
        await expect(page.locator('div:nth-child(3) > .embedpress--elements__wrap > .embedpress__row > div:nth-child(2)')).toBeVisible();
    });
});