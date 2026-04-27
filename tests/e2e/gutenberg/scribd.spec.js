const { test, expect } = require('@playwright/test');

test('Embed Gutenberg Scribd source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/gutenberg-scribd//');
    await expect(page.locator('iframe[title="LETTER ASKING FOR FINANCIAL ASSISTANCE IN PAYING HOSPITAL BILLS \\(for Scribd\\)"]').contentFrame().getByRole('link', { name: 'View on Scribd.com' })).toBeVisible();
});
// As now we only have embed support for Scribd

