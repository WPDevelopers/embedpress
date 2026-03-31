const { test, expect } = require('@playwright/test');


test('Visibility of Google Photos justify Layout in Elementor', async ({ page }) => {

    await page.goto('playwright-elementor/el-google-photos-justify-layout/');

    // justify layout visibility 
    const justify = page.locator('.google-photos-gallery-justify-widget');
    await expect(justify).toBeVisible();


    await expect(page.getByRole('heading', { name: 'Startise Pitha Utshob 5.0 -' })).toBeVisible();
    await expect(page.locator('img').first()).toBeVisible();
});