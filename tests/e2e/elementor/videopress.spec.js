const { test, expect, chromium } = require('@playwright/test');

test('Embed Elementor VideoPress source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/el-videopress/');
    // We have problem on chromium browser we will fix it later
});

// As now we only have embed support 