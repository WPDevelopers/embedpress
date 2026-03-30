const { test, expect } = require('@playwright/test');

let slug = 'playwright-classic-editor/classic-spotify';


test.describe('Classic Spotify', () => {
    // if (process.env.CI) {
    //     test.skip('Skipping all tests in this describe block in CI');
    // }
    test.beforeEach(async ({ page }) => {
        await page.goto(slug);
    });

    test('Classic Spotify Playlist', async ({ page }) => {
        const heading = page.getByRole('heading', { name: 'Classic Spotify' });
        await heading.scrollIntoViewIfNeeded();
        await expect(heading).toBeVisible();

        const pageLocator = page.locator('iframe[title="Spotify Embed\\: Kids Quran playlist"]');

        await expect(pageLocator).toBeVisible();
        await expect(pageLocator.contentFrame().locator('.CoverArtBase_coverArt__ne0XI')).toBeVisible();
        await expect(pageLocator.contentFrame().getByRole('link', { name: 'Kids Quran playlist' })).toBeVisible();
        await expect(pageLocator.contentFrame().getByTestId('spotify-logo')).toBeVisible();
        await pageLocator.contentFrame().getByTestId('play-pause-button').click();
        await page.waitForTimeout(300)
        await pageLocator.contentFrame().getByTestId('play-pause-button').click();
    });

    test('Classic Spotify Single', async ({ page }) => {
        const heading = page.getByText('Spotify Single');
        await heading.scrollIntoViewIfNeeded();
        await expect(heading).toBeVisible();

        const pageLocator = page.locator('iframe[title="Spotify Embed\\: Surah Ar-Rahman \\(Be Heaven\\)"]');

        await expect(pageLocator.contentFrame().locator('.BackgroundColorContainer_backgroundColorContainer__YZSQ7')).toBeVisible();
        await expect(pageLocator.contentFrame().getByRole('link', { name: 'Surah Ar-Rahman (Be Heaven)' })).toBeVisible();
        await expect(pageLocator.contentFrame().locator('.CoverArtBase_coverArt__ne0XI')).toBeVisible();
        await pageLocator.contentFrame().getByTestId('play-pause-button').click();
        await page.waitForTimeout(300)
        await pageLocator.contentFrame().getByTestId('play-pause-button').click();
    });

    test('Classic Spotify Artist', async ({ page }) => {
        const heading = page.getByText('Spotify Artist');
        await heading.scrollIntoViewIfNeeded();
        await expect(heading).toBeVisible();

        const pageLocator = page.locator('iframe[title="Spotify Embed\\: Omar Hisham"]');

        await expect(pageLocator.contentFrame().locator('.CoverArtBase_coverArt__ne0XI')).toBeVisible();
        await expect(pageLocator.contentFrame().getByTestId('spotify-logo')).toBeVisible();
        await expect(pageLocator.contentFrame().getByLabel('More')).toBeVisible();
        await pageLocator.contentFrame().getByTestId('play-pause-button').click();
        await page.waitForTimeout(300)
        await pageLocator.contentFrame().getByTestId('play-pause-button').click();
    });


    test('Classic Spotify Album', async ({ page }) => {
        const heading = page.getByText('Spotify Artist');
        await heading.scrollIntoViewIfNeeded();
        await expect(heading).toBeVisible();

        const pageLocator = page.locator('iframe[title="Spotify Embed\\: Al Sabaê Al Mounjiate \\(Quran\\)"]');

        await expect(pageLocator.contentFrame().locator('.CoverArtBase_coverArt__ne0XI')).toBeVisible();
        await expect(pageLocator.contentFrame().getByRole('link', { name: 'Al Sabaê Al Mounjiate (Quran)' })).toBeVisible();
        await expect(pageLocator.contentFrame().getByRole('link', { name: 'Abd Al Rahman Al Soudaiss' })).toBeVisible();
        await expect(pageLocator.contentFrame().getByTestId('tracklist-row-0')).toBeVisible();
        await pageLocator.contentFrame().getByTestId('play-pause-button').click();
        await page.waitForTimeout(300)
        await pageLocator.contentFrame().getByTestId('tracklist-row-0').getByTestId('playback-indicator').click();
    });

});