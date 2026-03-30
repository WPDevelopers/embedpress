const { test, expect } = require('@playwright/test');

test('Embed Elementor Polldaddy source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/el-polldaddy/');
    await expect(page.getByRole('button', { name: 'Vote' })).toBeVisible();

});
// As now we only have embed support for Polldaddy

