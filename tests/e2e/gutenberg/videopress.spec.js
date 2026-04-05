const { test, expect } = require('@playwright/test');

test('Embed Gutenberg VideoPress source', async ({ page }) => {
    await page.goto('playwright-gutenberg/gu-videopress/');
    // We have problem on chromium browser we will fix it later
});

// As now we only have embed support for this Source

