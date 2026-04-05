const { test, expect } = require('@playwright/test');

test.skip('Embed Elementor MeetUp source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/playwright-elementor/elementor-meetup/');
    await expect(page.getByRole('heading', { name: 'Details' })).toBeVisible();
});

// As now we only have embed support for MeetUp

