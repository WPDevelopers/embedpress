const { test, expect } = require('@playwright/test');

test('Embed Classic WordPress.Tv source', async ({ page }) => {
    await page.goto('playwright-classic-editor/classic-wordpress-tv/');
    await page.locator('iframe[title="VideoPress Video Player"]').contentFrame().getByText('There’s been an error Something went wrong and we\'re unable to play the video.').click();
});
// As now we only have embed support for WordPress.Tv

// Note: Some how now wordpress tv player not support on chromium browser 