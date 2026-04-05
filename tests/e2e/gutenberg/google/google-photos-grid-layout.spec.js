const { test, expect } = require('@playwright/test');


test('Visibility of Google Photos Grid Layout in Gutenberg', async ({ page }) => {

    await page.goto('https://ep-automation.mdnahidhasan.com/gu-google-photos-grid-layout/');

    await expect(page.getByRole('heading', { name: 'Gu Google Photos – Grid Layout' })).toBeVisible();

    // Grid layout visibility 
    const grid = page.locator('.google-photos-gallery-grid-widget');
    await expect(grid).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Startise · Jan 21 – 25, 2024' })).toBeVisible();
    await page.getByRole('img', { name: 'Photo' }).first().click();
    await expect(page.locator('#popup-image')).toBeVisible();
    await page.locator('#next-btn').click();
    await expect(page.locator('#popup-image')).toBeVisible();
    await page.locator('#close-btn').getByRole('img').click();
    await expect(page.getByRole('img', { name: 'Photo' }).nth(2)).toBeVisible();
});