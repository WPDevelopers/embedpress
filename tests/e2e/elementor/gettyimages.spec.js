const { test, expect } = require('@playwright/test');

test('Embed Elementor gettyimages source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/playwright-elementor/elementor-getty-images/');
    await expect(page.locator('iframe').contentFrame().getByRole('complementary')).toBeVisible();
});
// As now we only have embed support

