const { test, expect } = require('@playwright/test');

const slug = 'playwright-classic-editor/classic-github/';

test('Classic GitHub Gist', async ({ page }) => {
    await page.goto(slug);
    await expect(page.getByRole('heading', { name: 'Classic GitHub Gist' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'const { test, expect } =' })).toBeVisible();
});