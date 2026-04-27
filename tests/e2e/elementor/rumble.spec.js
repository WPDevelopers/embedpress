const { test, expect } = require('@playwright/test');

test.skip('Embed Elementor Rumble source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/playwright-elementor/rumble-elementor/');
    await expect(page.locator('iframe[title="Private Tour of the World\\&apos\\;s Largest Pond Facility"]').contentFrame().getByRole('link', { name: 'Private Tour of the World\'s' })).toBeVisible();
});
// As now we only have embed support for Rumble

