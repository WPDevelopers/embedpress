const { test, expect } = require('@playwright/test');

let slug = 'playwright-elementor/elementor-google-photos';


test.describe("Google Photos", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(slug);
        await page.waitForLoadState('networkidle');
    });

    test('Google Photos Carousel', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Google Photos Carousel' })).toBeVisible();
        await expect(page.locator('#ep-elements-id-f3716c7 iframe').contentFrame().getByTitle('Open in new window.').getByRole('img')).toBeVisible();
    });

    test('Pro - Google Photos Gallery Player', async ({ page }) => {
        await page.getByRole('heading', { name: 'Pro - Google Photos Gallery Player', exact: true }).click();
        await expect(page.locator('#ep-elements-id-dba371e iframe').contentFrame().locator('.jx-imageset').first()).toBeVisible();
        await expect(page.locator('#ep-elements-id-dba371e iframe').contentFrame().locator('div:nth-child(3) > div > div:nth-child(2) > svg')).toBeVisible();
        await expect(page.locator('#ep-elements-id-dba371e iframe').contentFrame().locator('div:nth-child(5) > div:nth-child(2) > div > div:nth-child(2) > svg')).toBeVisible();
        await page.locator('#ep-elements-id-dba371e iframe').contentFrame().locator('div:nth-child(7) > .jx-svg-image > svg').click();
        await page.locator('#ep-elements-id-dba371e iframe').contentFrame().locator('.jx-carousel-arrow > .jx-svg-image > svg').first().click();
        await page.locator('#ep-elements-id-dba371e iframe').contentFrame().locator('div:nth-child(2) > svg').first().click();
    });

    test('Pro - Google Photos Gallery Player - Auto Play & Repeat On', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Pro - Google Photos Gallery Player - Auto Play & Repeat On' })).toBeVisible();
        await expect(page.locator('#ep-elements-id-117fe6c iframe').contentFrame().locator('.jx-imageset').first()).toBeVisible();
        await expect(page.locator('#ep-elements-id-117fe6c iframe').contentFrame().locator('div:nth-child(8) > .jx-svg-image > svg')).toBeVisible();
        await expect(page.locator('#ep-elements-id-117fe6c iframe').contentFrame().locator('img:nth-child(2)').first()).toBeVisible();
    });

    test('Single Photo - With Color', async ({ page }) => {
        // test.skip(process.env.CI, 'Skipping this test in CI');
        await expect(page.getByRole('heading', {
            name: 'Single Photo - With Color'
        })).toBeVisible();
        await expect(page.locator('#ep-elements-id-f0593d4 iframe').contentFrame().locator('.jx-imageset')).toBeVisible();
    });
});