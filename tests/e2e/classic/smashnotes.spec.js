const { test, expect } = require('@playwright/test');

test('Embed Classic smash notes source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/playwright-classic-editor/cl-smash-notes/');
    await expect(page.locator('iframe[title="The Good Whale - Ep\\. 6 - Serial"]').contentFrame().getByRole('button', { name: 'Show episode notes' })).toBeVisible();
});

// As now we only have embed support for this Source

