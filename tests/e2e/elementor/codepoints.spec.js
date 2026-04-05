const { test, expect } = require('@playwright/test');

test('Embed Elementor Codepoints source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/el-codepoints/')
    await expect(page.locator('iframe[title="U\\+0001 START OF HEADING\\*"]').contentFrame().getByText('Glyph for U+0001copy Source: Noto Sans Symbols 2 U+0001 Start of Heading * Nº 1')).toBeVisible()

});

// As now we only have embed support for codepoints 