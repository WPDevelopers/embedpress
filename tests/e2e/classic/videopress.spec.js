const { test, expect, chromium } = require('@playwright/test');

test('Embed Classic VideoPress source', async ({ page }) => {
    await page.goto('playwright-classic-editor/cl-videopress/');
    // We Have Problem with chromium browser we will fix it later
});

// As now we only have embed support for this Source

