const { test, expect } = require('@playwright/test');

test('Embed Elementor TVCF source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/elementor-tvcf/');
    await expect(page.locator('iframe').contentFrame().getByText('No compatible source was')).toBeVisible();
});
// As now we only have embed support 

