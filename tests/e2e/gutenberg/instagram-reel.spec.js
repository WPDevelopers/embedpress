const { test, expect } = require('@playwright/test');

test('Embed Gutenberg Instagram Reels Support', async ({ page }) => {
    await page.goto('gutenberg-instagram-reels-support/');
    await expect(page.locator('#ep-gutenberg-content-20580ddef83da1380a019afa2f55ae08').getByText('Fetching content').contentFrame().getByRole('link', { name: 'Instagram post shared by @' })).toBeVisible();
});
// As now we only have embed support for Instagram reels