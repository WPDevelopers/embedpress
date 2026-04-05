const { test, expect } = require('@playwright/test');

const slug = 'playwright-gutenberg/gutenberg-github-gist/';

test('Gutenberg GitHub Gist', async ({ page }) => {
    await page.goto(slug);
    await expect(page.locator('.ep-embed-content-wraper')).toBeVisible();
    await expect(page.getByRole('cell', { name: 'const { test, expect } =' })).toBeVisible();
});