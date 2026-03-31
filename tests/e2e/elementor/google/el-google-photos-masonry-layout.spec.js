const { test, expect } = require('@playwright/test');


test('Visibility of Google Photos Masonry Layout in Elementor', async ({ page }) => {

    await page.goto('https://ep-automation.mdnahidhasan.com/playwright-elementor/el-google-photos-masonry-layout/');

    // masonry layout visibility 
    const masonry = page.locator('.google-photos-gallery-masonary-widget');
    await expect(masonry).toBeVisible();

    await expect(page.getByRole('heading', { name: 'Startise Pitha Utshob 5.0 -' })).toBeVisible();
    await expect(page.locator('img').first()).toBeVisible();
});