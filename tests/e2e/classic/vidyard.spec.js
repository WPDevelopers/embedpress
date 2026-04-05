const { test, expect } = require('@playwright/test');

test('Embed Classic vidyard source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/playwright-classic-editor/classic-vidyard/');
    await expect(page.locator('iframe[title="Vidyard Recording"]').contentFrame().getByTestId('splashScreen')).toBeVisible();
});

// As now we only have embed support for this Source

