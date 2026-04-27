const { test, expect } = require('@playwright/test');

test('Embed Elementor WordPress.Tv source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/playwright-elementor/elementor-wordpress-tv/');
    await page.locator('iframe[title="VideoPress Video Player"]').contentFrame().getByText('There’s been an error Something went wrong and we\'re unable to play the video.').click();
});
// As now we only have embed support for WordPress.Tv

// Note: Some how now wordpress tv player not support on chromium browser 