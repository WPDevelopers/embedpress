const { test, expect } = require('@playwright/test');

test('Embed Elementor BoomPlay source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/playwright-elementor/el-boomplay/');
    await expect(page.locator('iframe').contentFrame().locator('.header_bg > div')).toBeVisible();
    await expect(page.locator('iframe').contentFrame().getByRole('link', { name: 'Bolte Bolte Cholte Cholte' })).toBeVisible();
});

// As now we only have embed support

