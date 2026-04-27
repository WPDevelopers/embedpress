const { test, expect } = require('@playwright/test');

test.skip('Embed Elementor Smash Notes source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/playwright-elementor/el-smash-notes/');
    await expect(page.locator('iframe').nth(1).contentFrame().getByRole('button', { name: 'Podcasts' })).toBeVisible();
});

// As now we only have embed support for this Source

