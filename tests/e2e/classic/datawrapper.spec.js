const { test, expect } = require('@playwright/test');

test('Embed Classic datawrapper source', async ({ page }) => {
    await page.goto('https://ep-automation.mdnahidhasan.com/cl-datawrapper/');
    await expect(page.locator('#post-10714 div').first()).toBeVisible();
});
// As now we only have embed support for datawrapper 

