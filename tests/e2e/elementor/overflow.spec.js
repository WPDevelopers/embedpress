const { test, expect } = require('@playwright/test');

test('Embed Elementor Overflow source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/el-overflow/')

    // overflow update their system so we can't check other element for now.

    // await expect(page.locator('iframe').contentFrame().getByText('Eid Ul Azha GOAT CAMELCOW')).toBeVisible();
    // await expect(page.locator('iframe').contentFrame().getByRole('heading', { name: 'Publication preview' })).toBeVisible();
});
// As now we only have embed support for Overflow

