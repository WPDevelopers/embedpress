const { test, expect } = require('@playwright/test');

test('Embed Elementor Instagram Reels Support', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/playwright-elementor/elementor-instagram-reels-support/');
    await expect(page.locator('#ep-elements-id-9ad99e8 iframe').contentFrame().getByRole('button', { name: 'Control' })).toBeVisible();
    await page.locator('#ep-elements-id-9ad99e8 iframe').contentFrame().getByRole('button', { name: 'Control' }).click();
});
// As now we only have embed support for Instagram reels