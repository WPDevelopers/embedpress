const { test, expect } = require('@playwright/test');


test('Visibility of Google Photos justify Layout in Gutenberg', async ({ page }) => {
    await page.goto('gu-google-photos-justify-layout/');
    await expect(page.getByRole('heading', { name: 'GU Google Photos Justify' })).toBeVisible();


    // justify layout visibility 
    const justify = page.locator('.google-photos-gallery-justify-widget');
    await expect(justify).toBeVisible();

    await expect(page.getByRole('heading', { name: 'Startise · Jan 21 – 25, 2024' })).toBeVisible();
    await page.getByRole('img', { name: 'Photo' }).first().click();
    await expect(page.locator('#ep-popup-overlay div').first()).toBeVisible();
    await page.locator('#next-btn').click();
    await page.locator('#close-btn').getByRole('img').click();
});