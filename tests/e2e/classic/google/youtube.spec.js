const { test, expect } = require('@playwright/test');

let slug = 'playwright-classic-editor/classic-youtube/';
test.use({ storageState: 'playwright/.auth/user.json' });


test.describe("Classic YouTube", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(slug);
    });

    test('Default YouTube', async ({ page }) => {
        await expect(page.getByText('Default YouTube')).toBeVisible();
        await expect(page.frameLocator('iframe[title="Full Restoration 40 Years Old ruined Classic Motorcycle"] >> nth=0').locator('.ytp-cued-thumbnail-overlay-image')).toBeVisible();
        await expect(page.frameLocator('iframe[title="Full Restoration 40 Years Old ruined Classic Motorcycle"] >> nth=0').getByLabel('Play', { exact: true })).toBeVisible();
        await expect(page.frameLocator('iframe[title="Full Restoration 40 Years Old ruined Classic Motorcycle"] >> nth=0').getByRole('button', { name: 'Share' })).toBeVisible();
    });

    test('Copy URL Form URL Box On Top', async ({ page }) => {
        await expect(page.getByText('Copy URL Form URL Box On Top')).toBeVisible();
        await expect(page.frameLocator('iframe[title="Full Restoration 40 Years Old ruined Classic Motorcycle"] >> nth=1').locator('.ytp-cued-thumbnail-overlay-image')).toBeVisible();
        await expect(page.frameLocator('iframe[title="Full Restoration 40 Years Old ruined Classic Motorcycle"] >> nth=1').getByLabel('Play', { exact: true })).toBeVisible();
        await expect(page.frameLocator('iframe[title="Full Restoration 40 Years Old ruined Classic Motorcycle"] >> nth=1').getByRole('button', { name: 'Share' })).toBeVisible();

    });

    test('Copy URL Form Share Icon', async ({ page }) => {
        await expect(page.getByText('Copy URL Form Share Icon')).toBeVisible();
        await expect(page.frameLocator('iframe[title="Full Restoration 40 Years Old ruined Classic Motorcycle"] >> nth=2').locator('.ytp-cued-thumbnail-overlay-image')).toBeVisible();
        await expect(page.frameLocator('iframe[title="Full Restoration 40 Years Old ruined Classic Motorcycle"] >> nth=2').getByLabel('Play', { exact: true })).toBeVisible();
        await expect(page.frameLocator('iframe[title="Full Restoration 40 Years Old ruined Classic Motorcycle"] >> nth=2').getByRole('button', { name: 'Share' })).toBeVisible();

    });

    test('Copy URL Form Embed Code', async ({ page }) => {
        // test.skip(process.env.CI, 'Skipping this test in CI');
        // // Navigate to the WordPress plugins page
        // await page.goto('https://ep-automation.mdnahidhasan.com/wp-admin/plugins.php?plugin_status=all&paged=1&s');

        // // Locator for the Classic Editor plugin row
        // const pluginRow = page.locator('tr[data-slug="classic-editor"]');

        // // Check if the "Deactivate" button is visible (meaning the plugin is already active)
        // const isActive = await pluginRow.locator('a', { hasText: 'Deactivate' }).isVisible();

        // if (!isActive) {
        //     // If inactive, activate the Classic Editor plugin
        //     const activateButton = pluginRow.locator('a', { hasText: 'Activate' });
        //     await activateButton.click();

        //     // Ensure the plugin is activated
        //     await expect(pluginRow.locator('a', { hasText: 'Deactivate' })).toBeVisible();
        // }

        await page.goto('playwright-classic-editor/classic-youtube/');
        await expect(page.getByText('Copy URL Form Embed Code')).toBeVisible();
        await expect(page.frameLocator('iframe[title="Full Restoration 40 Years Old ruined Classic Motorcycle"] >> nth=3').locator('.ytp-cued-thumbnail-overlay-image')).toBeVisible();
        await expect(page.frameLocator('iframe[title="Full Restoration 40 Years Old ruined Classic Motorcycle"] >> nth=3').getByLabel('Play', { exact: true })).toBeVisible();
        await expect(page.frameLocator('iframe[title="Full Restoration 40 Years Old ruined Classic Motorcycle"] >> nth=3').getByRole('button', { name: 'Share' })).toBeVisible();
    });
});