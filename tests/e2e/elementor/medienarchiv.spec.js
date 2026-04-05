const { test, expect } = require('@playwright/test');

test.skip('Embed Elementor Medienarchiv source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/playwright-gutenberg/el-medianarchive/')
    await expect(page.locator('iframe[title="DAS UNBEGREIFLICHE SCHWEIGEN DER WELT"]').contentFrame().getByRole('link', { name: 'Bild: DAS UNBEGREIFLICHE' })).toBeVisible();
});
// As now we only have embed support

