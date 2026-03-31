const { test, expect } = require('@playwright/test');

test('Embed Gutenberg Sway source', async ({ page }) => {
    await page.goto('playwright-gutenberg/gu-sway/');
    await page.locator('iframe[title="The Universe"]').contentFrame().getByRole('heading', { name: 'The Universe', exact: true }).click();
});

// As now we only have embed support 