const { test, expect } = require('@playwright/test');

test.skip('Embed Classic gettyimages source', async ({ page }) => {
    await page.goto('playwright-classic-editor/classic-getty-images/');
    await expect(page.locator('iframe[title="Aircraft mechanic probing an opened jet engine of an airplane with a portable camera and looking at the monitor in the maintenance hangar"]').contentFrame().getByRole('complementary')).toBeVisible();
});
// As now we only have embed support

