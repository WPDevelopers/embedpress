const { test, expect } = require('@playwright/test');

let slug = 'playwright-elementor/elementor-youtube-2';


test.describe("Elementor YouTube Channel", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(slug);
        // await page.waitForLoadState('networkidle');
    });

    test('YouTube Chanel Gallery', async ({ page }) => {
        const heading = page.getByRole('heading', { name: 'YouTube Chanel Gallery' });
        await heading.scrollIntoViewIfNeeded();
        await expect(heading).toBeVisible();
        await expect(page.frameLocator('iframe[title="Baseera"]').locator('.ytp-cued-thumbnail-overlay-image')).toBeVisible();
        await expect(page.locator('.channel-header').first()).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Baseera' })).toBeVisible();
        await expect(page.getByRole('img', { name: 'Baseera' })).toBeVisible();
        await expect(page.locator('#ep-elements-id-7cb3671').getByRole('link', { name: 'Subscribe' })).toBeVisible();
        await expect(page.locator('.thumb').first()).toBeVisible();
        await expect(page.locator('.description-container').first()).toBeVisible();
        await expect(page.locator('div:nth-child(2) > .thumb').first()).toBeVisible();
        await expect(page.locator('div:nth-child(2) > .body > .description-container').first()).toBeVisible();
        await expect(page.locator('#ep-elements-id-7cb3671').getByText('1', { exact: true }).first()).toBeVisible();
        await expect(page.locator('.ep-next').first()).toBeVisible();
        await page.locator('#ep-elements-id-7cb3671').getByText('Next').click();
        await page.waitForTimeout(1000)
        await expect(page.locator('.ep-prev').first()).toBeVisible();
        await page.locator('.ep-prev').first().click();
    });

    test('YouTube Chanel List', async ({ page }) => {
        const heading = page.getByRole('heading', { name: 'YouTube Chanel List' });
        await heading.scrollIntoViewIfNeeded();
        await expect(heading).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Ahmadullah' })).toBeVisible();
        await page.getByRole('img', { name: 'Ahmadullah' }).click();
        await expect(page.locator('div:nth-child(2) > .youtube__content__body > .content__wrap > div:nth-child(2)').first()).toBeVisible();
        await page.locator('div:nth-child(2) > .youtube__content__body > .content__wrap > div > .thumb > .play-icon > img').first().click();
    });

    test('YouTube Chanel Grid', async ({ page }) => {
        // test.skip(process.env.CI, 'Skipping this test in CI');
        const heading = page.getByRole('heading', { name: 'YouTube Chanel List' });
        await heading.scrollIntoViewIfNeeded();
        await expect(heading).toBeVisible();
        await expect(page.locator('[id="\\31 d37408"] > .ose-youtube > .ep-player-wrap > .channel-header')).toBeVisible();
        await expect(page.getByRole('img', { name: 'UFC' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'UFC' })).toBeVisible();
        await expect(page.locator('#ep-elements-id-1d37408').getByRole('link', { name: 'Subscribe' })).toBeVisible();
        await expect(page.locator('[id="\\31 d37408"] > .ose-youtube > .ep-player-wrap > .ep-youtube__content__block > .youtube__content__body > .content__wrap > div > .thumb').first()).toBeVisible();
        await expect(page.locator('[id="\\31 d37408"] > .ose-youtube > .ep-player-wrap > .ep-youtube__content__block > .youtube__content__body > .content__wrap > div:nth-child(2) > .thumb')).toBeVisible();
        await expect(page.locator('[id="\\31 d37408"] > .ose-youtube > .ep-player-wrap > .ep-youtube__content__block > .youtube__content__body > .content__wrap > div > .body > .description-container').first()).toBeVisible();
        // await expect(page.locator('[id="\\31 d37408"] > .ose-youtube > .ep-player-wrap > .ep-youtube__content__block > .youtube__content__body > .content__wrap > div:nth-child(2) > .body > .description-container')).toBeVisible();
        // await page.locator('[id="\\31 d37408"] > .ose-youtube > .ep-player-wrap > .ep-youtube__content__block > .youtube__content__body > .content__wrap > div:nth-child(2) > .thumb > .play-icon > img').click();
        // await page.waitForTimeout(1100)
        // await expect(page.frameLocator('#videoIframe').locator('video')).toBeVisible();
        // await expect(page.getByText('×', { exact: true })).toBeVisible();
        // await page.getByText('×', { exact: true }).click();

    });

    test('YouTube Chanel Carousel', async ({ page }) => {
        const heading = page.getByRole('heading', { name: 'YouTube Chanel List' });
        await heading.scrollIntoViewIfNeeded();
        await expect(heading).toBeVisible();
        await expect(page.locator('#bb8a111 > .ose-youtube > .ep-player-wrap > .channel-header')).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Dhruv Rathee' })).toBeVisible();
        await expect(page.getByRole('img', { name: 'Dhruv Rathee' })).toBeVisible();
        await expect(page.locator('#ep-elements-id-bb8a111').getByRole('link', { name: 'Subscribe' })).toBeVisible();
        await expect(page.locator('#bb8a111 > .ose-youtube > .ep-player-wrap > .ep-youtube__content__block > .youtube__content__body > .content__wrap > div > .thumb').first()).toBeVisible();
        await expect(page.locator('#bb8a111 > .ose-youtube > .ep-player-wrap > .ep-youtube__content__block > .youtube__content__body > .content__wrap > div > .body > .description-container').first()).toBeVisible();
        await page.locator('#bb8a111 > .ose-youtube > .ep-player-wrap > .ep-youtube__content__block > .youtube__content__body > .content__wrap > div:nth-child(2) > .thumb > .play-icon > img').click();
        await page.waitForTimeout(1000)
        await expect(page.getByText('×', { exact: true })).toBeVisible();
        await page.getByText('×', { exact: true }).click();

    });
});