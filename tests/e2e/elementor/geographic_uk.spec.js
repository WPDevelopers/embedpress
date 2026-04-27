const { test, expect } = require('@playwright/test');

test('Embed Elementor Geographic UK source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/el-geographic-uk/')
    await expect(page.getByRole('link', { name: 'The Ferry to Shepperton' })).toBeVisible();
});
// As now we only have embed support

