const { test, expect } = require('@playwright/test');

test('Embed Elementor Tumblr source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/playwright-elementor/elementor-tumblr/');
    await expect(page.locator('iframe[title="Tumblr post"]').contentFrame().getByRole('link', { name: 'nahidwpd', exact: true })).toBeVisible();
});
// As now we only have embed support for Tumblr