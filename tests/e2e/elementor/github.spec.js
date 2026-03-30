const { test, expect } = require('@playwright/test');

const slug = 'elementor-github-gist';

test('Elementor GitHub Gist', async ({ page }) => {
    await page.goto(slug);
    await expect(page.locator('h2')).toBeVisible();
    await page.getByRole('cell', { name: 'const { test, expect } =' }).click();
});