const { test, expect } = require('@playwright/test');

test.describe('Pro Checker Tests', () => {
    test('should pass a basic test', async ({ page }) => {
        await page.goto('https://example.com');
        const title = await page.title();
        expect(title).toBe('Example Domain');
    });
});