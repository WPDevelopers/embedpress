const { test, expect } = require('@playwright/test');

test('Embed Gutenberg mixcloud source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/gu-mixcloud/');
    await expect(page.locator('iframe[title="Villain Iv \\(Halloween\\)"]').contentFrame().getByTestId('widget-cloudcast-image')).toBeVisible();
});

// As now we only have embed support

