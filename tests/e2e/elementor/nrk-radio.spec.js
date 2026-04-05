const { test, expect } = require('@playwright/test');

test('Embed Elementor NRK Radio source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/playwright-elementor/elementor-nrk/');
    await expect(page.locator('iframe')).toBeVisible();
});

// As now we only have embed support for NRK Radio

