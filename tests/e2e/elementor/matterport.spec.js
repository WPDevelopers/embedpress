const { test, expect } = require('@playwright/test');

test('Embed Elementor Matterport source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/playwright-elementor/elementor-matterport/');
    // Matterport update there preview system so we can't check other element for now.
   
    // await expect(page.locator('iframe[title="Shoppable Home Office"]').contentFrame().locator('#tint')).toBeVisible();
    // await expect(page.locator('iframe[title="Shoppable Home Office"]').contentFrame().getByRole('heading', { name: 'Shoppable Home Office' })).toBeVisible();
    // await expect(page.locator('iframe[title="Shoppable Home Office"]').contentFrame().getByRole('button', { name: 'Play' })).toBeVisible();
});

// As now we only have embed support

