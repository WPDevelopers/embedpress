const { test, expect } = require('@playwright/test');

test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('Dashboard Shortcode Tab', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://ep-automation.mdnahidhasan.com/wp-admin/admin.php?page=embedpress&page_type=shortcode');
    });

    test('Should display EmbedPress Shortcode content and functionility Options', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Shortcode' })).toBeVisible();
        await expect(page.getByText('EmbedPress has direct')).toBeVisible();
        await expect(page.locator('.shortcode__form').first()).toBeVisible();
        await expect(page.getByRole('button', { name: 'Generate' })).toBeVisible();
        await expect(page.locator('.embedpress__shortcode > div:nth-child(3)')).toBeVisible();
        await expect(page.getByRole('button', { name: ' Copy Link' })).toBeVisible();
        await page.getByPlaceholder('Place your link here to').click();
        await page.getByRole('button', { name: 'Generate' }).click();
        await page.getByPlaceholder('Place your link here to').click();
        await page.getByPlaceholder('Place your link here to').fill('https://www.prothomalo.com/');
        await page.getByRole('button', { name: 'Generate' }).click();
        await expect(page.locator('#ep-shortcode')).toBeVisible();
        await page.getByRole('button', { name: ' Copy Link' }).click();
        await expect(page.getByText('Copied to your clipboard')).toBeVisible();
    });
});