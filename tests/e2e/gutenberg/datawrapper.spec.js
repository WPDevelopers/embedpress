const { test, expect } = require('@playwright/test');

test('Embed Gutenberg datawrapper source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/playwright-gutenberg/gu-datawrapper/');
    await page.locator('iframe[title="\\35 6\\% of Icelanders live in their capital Reykjavík "]').contentFrame().getByRole('heading', { name: '56% of Icelanders live in' }).click()
});
// As now we only have embed support for datawrapper

