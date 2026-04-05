const { test, expect } = require('@playwright/test');

test('Embed Gutenberg Smash Notes source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/gu-smash-notes/');
    await expect(page.locator('#ep-gutenberg-content-bc584662347acbead11f4f0053d97312 iframe').contentFrame().getByText('Pocket Casts PlusGet the')).toBeVisible();
});

// As now we only have embed support for this Source
