const { test, expect } = require('@playwright/test');

test('Embed Elementor Padlet source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/playwright-elementor/elementor-padlet/');
    await expect(page.locator('iframe').contentFrame().getByRole('heading', { name: 'Canvas' })).toBeVisible();
    await expect(page.locator('iframe').contentFrame().getByText('Hello World !How are you all ?')).toBeVisible();
});

// As now we only have embed support

