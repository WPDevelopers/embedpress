const { test, expect } = require('@playwright/test');

test('Embed Gutenberg Cloudup source', async ({ page }) => {
    await page.goto('gutenberg-cloudup/');
    await expect(page.locator('iframe[title="Cloudup Video"]').contentFrame().getByText('The media could not be loaded')).toBeVisible();
});

// As now we only have embed support 