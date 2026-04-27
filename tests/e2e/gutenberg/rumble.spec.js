const { test, expect } = require('@playwright/test');

test('Embed Gutenberg Rumble source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/rumble-gutenberg/');
    await expect(page.locator('iframe[title="Private Tour of the World\\&apos\\;s Largest Pond Facility"]').contentFrame().getByRole('link', { name: 'Private Tour of the World\'s' })).toBeVisible();
});
// As now we only have embed support for Rumble

