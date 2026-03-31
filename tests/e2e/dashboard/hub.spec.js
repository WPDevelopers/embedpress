const { test, expect } = require('@playwright/test');

test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('Dashboard Hub Tab', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('wp-admin/admin.php?page=embedpress');
    });

    test('Should display EmbedPress Hub content', async ({ page }) => {
       await expect(page.getByText('Embed content instantly. No')).toBeVisible();
       await expect(page.getByRole('link', { name: 'Join Our Community' })).toBeVisible();
       await expect(page.getByRole('heading', { name: 'License Key' })).toBeVisible();
       await expect(page.getByRole('img', { name: 'License Inactive Icon' })).toBeVisible();
       await expect(page.getByRole('button', { name: 'Active' })).toBeVisible();
       await expect(page.getByRole('link', { name: 'License Key Icon Manage' })).toBeVisible();
       await expect(page.getByRole('img', { name: 'Brand Icon' })).toBeVisible();
       await expect(page.getByRole('heading', { name: 'Brand Your Work' })).toBeVisible();
       await expect(page.getByText('Upload your custom logo to')).toBeVisible();
       await expect(page.getByRole('link', { name: 'Branding Options' })).toBeVisible();
       await expect(page.getByRole('button', { name: 'Upload' })).toBeVisible();
       await expect(page.getByRole('img', { name: 'Source Control Icon' })).toBeVisible();
       await expect(page.getByRole('heading', { name: 'Most Popular Content Types' })).toBeVisible();
       await expect(page.getByRole('link', { name: 'Discover all sources' })).toBeVisible();
       await expect(page.getByText('PDF', { exact: true })).toBeVisible();
       await expect(page.getByText('YouTube', { exact: true })).toBeVisible();
       await expect(page.getByText('Facebook', { exact: true })).toBeVisible();
       await expect(page.getByRole('heading', { name: 'Others' })).toBeVisible();
       await expect(page.getByText('Google Photos')).toBeVisible();
    });
});