const { test, expect } = require('@playwright/test');


test('Visibility of Google Photos Masonry Layout in Gutenberg', async ({ page }) => {

    await page.goto('https://ep-automation.mdnahidhasan.com/playwright-gutenberg/gu-google-photos-masonry-layout/');

    await expect(page.getByRole('heading', { name: 'GU Google Photos Masonry' })).toBeVisible();

    // masonry layout visibility 
    const masonry = page.locator('.google-photos-gallery-masonary-widget');
    await expect(masonry).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Startise · Jan 21 – 25, 2024' })).toBeVisible();
    await page.getByRole('img', { name: 'Photo' }).first().click();
    await expect(page.locator('#popup-image')).toBeVisible();
    await page.locator('#next-btn').click();
    await expect(page.locator('#popup-image')).toBeVisible();
    await page.locator('#close-btn').getByRole('img').click();
    await expect(page.getByRole('img', { name: 'Photo' }).nth(2)).toBeVisible();
});