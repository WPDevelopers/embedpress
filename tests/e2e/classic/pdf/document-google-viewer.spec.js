const { test, expect } = require('@playwright/test');

test('Embed Classic Google Viewer source - Office', async ({ page }) => {
    await page.goto('playwright-classic-editor/document-google-viewer/');
    await expect(page.getByText('Powered By EP - Yes, Google Viewer')).toBeVisible();
    await expect(page.locator('iframe').contentFrame().locator('.ndfHFb-c4YZDc-cYSp0e-DARUcf-PLDbbf')).toBeVisible();
    await expect(page.getByText('Powered By EmbedPress')).toBeVisible();
});

// As now we only have embed support 