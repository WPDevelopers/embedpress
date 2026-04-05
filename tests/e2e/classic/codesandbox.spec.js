const { test, expect } = require('@playwright/test');

test('Embed Classic Canva source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/classic-codesandbox/');
    await expect(page.locator('iframe').contentFrame().locator('iframe[title="blissful-night"]').contentFrame().getByRole('heading', { name: 'This is a simple HTML + CSS' })).toBeVisible();
});

// As now we only have embed support 