const { test, expect } = require('@playwright/test');

test('Embed Classic Flickr source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/playwright-classic-editor/classic-flickr/');
    await expect(page.getByRole('link', { name: 'The Sledge' })).toBeVisible();
});
// As now we only have embed support for Flickr

