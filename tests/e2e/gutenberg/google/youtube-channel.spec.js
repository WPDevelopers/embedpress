const { test, expect } = require('@playwright/test');

let slug = 'playwright-gutenberg/gutenberg-youtube';

test.describe("Gutenberg YouTube Channel", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(slug);
        // await page.waitForLoadState('networkidle');
    });

    test('YouTube Channel Gallery Layout', async ({ page }) => {
        const expectations = [
            { element: page.getByRole('heading', { name: 'YouTube Chanel Gallery' }) },
            { element: page.frameLocator('iframe[title="MrBeast"]').locator('.ytp-cued-thumbnail-overlay-image') },
            { element: page.locator('.channel-header').first() },
            { element: page.getByRole('heading', { name: 'MrBeast' }) },
            { element: page.getByRole('img', { name: 'MrBeast' }) },
            { element: page.frameLocator('iframe[title="MrBeast"]').getByLabel('Watch on www.youtube.com') },
            { element: page.locator('.thumb').first() },
            { element: page.locator('div:nth-child(2) > .thumb').first() },
            { element: page.locator('.description-container').first() },
            { element: page.locator('.page-number').first() },
            { element: page.locator('.ep-next').first() }
        ];

        for (const { element } of expectations) {
            await expect(element).toBeVisible();
        }

        const nextEpisodeButton = page.locator('.ep-next').first();
        await nextEpisodeButton.click();
        await expect(page.locator('.ep-prev').first()).toBeVisible();
    });

    test('YouTube Channel List Layout', async ({ page }) => {
        test.skip(process.env.CI, 'Skipping this test in CI');
        const heading = page.getByRole('heading', { name: 'YouTube Chanel List' });
        await heading.scrollIntoViewIfNeeded();
        await expect(heading).toBeVisible();
        await expect(page.locator('div:nth-child(2) > .youtube__content__body > .content__wrap > div').first()).toBeVisible();
        await expect(page.locator('div:nth-child(2) > .youtube__content__body > .content__wrap > div > .body > .description-container > .details > .channel').first()).toBeVisible();
        await expect(page.locator('div:nth-child(2) > .youtube__content__body > .content__wrap > div > .body > .description-container > .thumbnail').first()).toBeVisible();
        await expect(page.locator('div:nth-child(2) > .youtube__content__body > .content__wrap > div:nth-child(2)').first()).toBeVisible();
        await page.locator('div:nth-child(2) > .youtube__content__body > .content__wrap > div > .thumb > .play-icon > img').first().click();
        await page.waitForTimeout(2000)
    });

    test('YouTube Channel Grid Layout', async ({ page }) => {

        const expectations = [
            { element: page.getByRole('heading', { name: 'YouTube Chanel Grid' }) },
            { element: page.locator('.channel-header').first() },
            { element: page.getByRole('heading', { name: 'SATV' }) },
            { element: page.getByRole('img', { name: 'SATV' }) },
            { element: page.locator('.thumb').first() },
            { element: page.locator('div:nth-child(2) > .thumb').first() },
            { element: page.locator('.description-container').first() },
            { element: page.locator('.page-number').first() },
            { element: page.locator('.ep-next').first() }
        ];

        for (const { element } of expectations) {
            await expect(element).toBeVisible();
        }

        const nextEpisodeButton = page.locator('.ep-next').first();
        await nextEpisodeButton.click();
        await expect(page.locator('.ep-prev').first()).toBeVisible();
    });

    test('YouTube Chanel Carousel Layout', async ({ page }) => {
        const heading = page.getByRole('heading', { name: 'YouTube Chanel Carousel' });
        await heading.scrollIntoViewIfNeeded();
        await expect(heading).toBeVisible();
        await expect(page.getByRole('heading', { name: 'গল্পকথন by কল্লোল' })).toBeVisible();
        await expect(page.getByRole('img', { name: 'গল্পকথন by কল্লোল' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Subscribe' }).nth(3)).toBeVisible();
        await expect(page.getByRole('button', { name: '❮' })).toBeVisible();
        await expect(page.getByRole('button', { name: '❯' })).toBeVisible();
    });

});