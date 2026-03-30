const { test, expect } = require('@playwright/test');


test('Visibility of Google Photos Grid Layout in Elementor', async ({ page }) => {

    await page.goto('https://ep-automation.mdnahidhasan.com/playwright-elementor/el-google-photos-grid-layout/');

    // Grid layout visibility 
    const grid = page.locator('.google-photos-gallery-grid-widget');
    await expect(grid).toBeVisible();

    await expect(page.getByRole('heading', { name: 'Startise Pitha Utshob 5.0 -' })).toBeVisible();
    await expect(page.locator('img').first()).toBeVisible();
});