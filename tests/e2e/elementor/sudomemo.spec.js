const { test, expect } = require('@playwright/test');

test('Embed Elementor Sudomemo source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/elementor-sudomemo/');
    await expect(page.locator('iframe[title="The June Archive \\#19 Part 1"]').contentFrame().locator('video')).toBeVisible();
});

// As now we only have embed support 