const { test, expect } = require('@playwright/test');

test('Embed Classic Speaker Deck source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/playwright-classic-editor/classic-speaker-deck/');
    await expect(page.locator('iframe[title="The Invisible Side of Design"]').contentFrame().getByRole('button', { name: 'Next slide' })).toBeVisible();
});

// As now we only have embed support for this Source

