const { test, expect } = require('@playwright/test');

test('Embed Gutenberg Ted source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/gu-ted/');
    await expect(page.locator('iframe[title="Carole Cadwalladr\\: This is what a digital coup looks like"]').contentFrame().locator('#video')).toBeVisible();
});

// As now we only have embed support 