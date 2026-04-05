const { test, expect } = require('@playwright/test');

test('Embed Gutenberg Codpoints source', async ({ page }) => {
    await page.goto('gu-codepoints/');
    await expect(page.locator('iframe[title="U\\+0001 START OF HEADING\\*"]').contentFrame().getByRole('img', { name: 'Glyph for U+' })).toBeVisible();
});

// As now we only have embed support 