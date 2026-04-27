const { test, expect } = require('@playwright/test');

let slug = 'playwright-gutenberg/gutenberg-youtube';

test.describe("Gutenberg YouTube Others", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(slug);
        // await page.waitForLoadState('networkidle');
    });

    test('Default YouTube', async ({ page }) => {
        const framelocator = page.frameLocator('iframe[title="শ্রেষ্ঠ মানুষেরা - \\[পর্ব ৮\\] - ইবরাহিম \\(আঃ\\)"]')
        const heading = page.getByRole('heading', { name: 'Default YouTube' });
        await heading.scrollIntoViewIfNeeded();
        await expect(heading).toBeVisible();
        await expect(page.getByText('Copy URL Form Right-click on')).toBeVisible();
        await expect(page.locator('.ep-embed-content-wraper').first()).toBeVisible();
        await expect(framelocator.getByLabel('Play', { exact: true })).toBeVisible();
        await expect(framelocator.getByRole('button', { name: 'Share' })).toBeVisible();
        await expect(framelocator.locator('div').filter({ hasText: 'শ্রেষ্ঠ মানুষেরা - [পর্ব ৮] - ইবরাহিম (আঃ)' }).nth(4)).toBeVisible();
        await expect(framelocator.getByRole('link', { name: 'Watch on YouTube' })).toBeVisible();
    });

    test('Custom Player Preset 1', async ({ page }) => {
        const heading = page.getByRole('heading', { name: 'Custom Player Preset 1' });
        await heading.scrollIntoViewIfNeeded();
        await expect(heading).toBeVisible();
        await expect(page.getByText('Copy URL Form URL Box On Top')).toBeVisible();
        await expect(page.locator('.plyr__poster').first()).toBeVisible();
        await expect(page.locator('button').filter({ hasText: /^Play$/ }).first()).toBeVisible();
        await expect(page.getByText('PausePlay').first()).toBeVisible();
        // await expect(page.getByRole('button', { name: 'Forward 10s' }).first()).toBeVisible();
        await expect(page.getByRole('button', { name: 'Settings' }).first()).toBeVisible();
    });

    test('Custom Player Preset 2 Disable Few Controls', async ({ page }) => {
        const heading = page.getByRole('heading', { name: 'Custom Player Preset 2' });
        await heading.scrollIntoViewIfNeeded();
        await expect(heading).toBeVisible();
        await expect(page.getByText('Copy URL Form Share Icon')).toBeVisible();
        await expect(page.locator('button').filter({ hasText: /^Play$/ }).nth(1)).toBeVisible();
        await expect(page.getByRole('button', { name: 'Restart' }).nth(1)).toBeVisible();
        await expect(page.getByText('PausePlay').nth(1)).toBeVisible();
        await expect(page.getByRole('button', { name: 'Settings' }).nth(1)).toBeVisible();
    });

    test('Enable Custom Player and Thumbnail', async ({ page }) => {
        const heading = page.getByRole('heading', { name: 'Enable Custom Player and' });
        await heading.scrollIntoViewIfNeeded();
        await expect(heading).toBeVisible();
        await expect(page.getByText('Copy URL Form Embed Code')).toBeVisible();
        await expect(page.locator('button').filter({ hasText: /^Play$/ }).nth(2)).toBeVisible();
        // await expect(page.getByRole('button', { name: 'Forward 10s' }).nth(2)).toBeVisible();
        await expect(page.getByRole('button', { name: 'Settings' }).nth(2)).toBeVisible();
    });
});