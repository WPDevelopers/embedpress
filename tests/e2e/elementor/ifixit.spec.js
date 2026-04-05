const { test, expect } = require('@playwright/test');

test('Embed Elementor IfixIt source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/playwright-elementor/el-ifixit/');
    await expect(page.locator('iframe').contentFrame().getByText('iPad Pro 10.5" Screen Replacement Author: Dominik Schnabelrauch')).toBeVisible();
});

// As now we only have embed support

