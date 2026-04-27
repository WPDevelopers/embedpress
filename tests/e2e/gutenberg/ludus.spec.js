const { test, expect } = require('@playwright/test');

test('Embed Gutenberg Ludus source', async ({ page }) => {
    await page.goto('gutenberg-ludus/');
    await page.waitForTimeout(6000);
    await expect(page.locator('iframe[title="User guide"]').contentFrame().getByText('User guide01/39CloneDownload')).toBeVisible();
});
// As now we only have embed support