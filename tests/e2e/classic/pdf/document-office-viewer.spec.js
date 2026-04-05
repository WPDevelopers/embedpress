const { test, expect } = require('@playwright/test');

test('Embed Classic Document Viewer source - Office', async ({ page }) => {
    await page.goto('playwright-classic-editor/document-office-viewer/');
    await expect(page.getByText('Powered By EP - No, Office')).toBeVisible();
    await expect(page.locator('iframe').contentFrame().locator('iframe[name="wacframe"]').contentFrame().getByRole('img', { name: 'Page' })).toBeVisible();
    await expect(page.getByText('Powered By EmbedPress')).toBeHidden();
});

// As now we only have embed support 