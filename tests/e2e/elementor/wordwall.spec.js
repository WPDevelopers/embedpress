const { test, expect } = require('@playwright/test');

test('Embed Elementor WordWall source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/playwright-elementor/elementor-wordwall/');
    await expect(page.locator('iframe[title="K3 match the words wk36"]').contentFrame().locator('canvas')).toBeVisible();
});

// As now we only have embed support for this Source

