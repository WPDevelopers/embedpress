const { test, expect } = require('@playwright/test');

let slug = 'playwright-gutenberg/gutenberg-spotify';


test.describe("Gutenberg Spotify", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(slug);
        await page.waitForLoadState('networkidle');
    });

    test('Spotify Single', async ({ page }) => {
        const heading = page.getByRole('heading', { name: 'Spotify Single' });
        await heading.scrollIntoViewIfNeeded();
        await expect(heading).toBeVisible();
        const framelocator = page.frameLocator('iframe[title="Spotify Embed: Surah Ar-Rahman (Be Heaven)"]');

        await expect(framelocator.locator('.BackgroundColorContainer_backgroundColorContainer__YZSQ7')).toBeVisible();
        await expect(framelocator.locator('.CoverArtBase_coverArt__ne0XI')).toBeVisible();
        await expect(framelocator.getByRole('link', { name: 'Surah Ar-Rahman (Be Heaven)' })).toBeVisible();
        await expect(framelocator.getByLabel('More')).toBeVisible();
        await expect(framelocator.getByTestId('play-pause-button')).toBeVisible();
        await framelocator.getByTestId('play-pause-button').click();
    });


    test('Spotify Artist', async ({ page }) => {
        const heading = page.getByRole('heading', { name: 'Spotify Artist' });
        await heading.scrollIntoViewIfNeeded();
        await expect(heading).toBeVisible();
        const framelocator = page.frameLocator('iframe[title="Spotify Embed\\: Omar Hisham"]')

        await expect(framelocator.getByRole('link', { name: 'Omar Hisham' })).toBeVisible();
        await expect(framelocator.locator('span').filter({ hasText: 'Top tracks' }).first()).toBeVisible();
        await expect(framelocator.locator('.PlayerControlsShort_playerControlsWrapper__qdkr5')).toBeVisible();
        await expect(framelocator.getByTestId('play-pause-button')).toBeVisible();
        await expect(framelocator.getByLabel('More')).toBeVisible();
        await expect(framelocator.getByTestId('tracklist-row-0')).toBeVisible();
        await expect(framelocator.getByTestId('tracklist-row-1')).toBeVisible();
        await expect(framelocator.getByTestId('tracklist-row-2')).toBeVisible();
    });

    test('Spotify Album', async ({ page }) => {
        const heading = page.getByRole('heading', { name: 'Spotify Album' });
        await heading.scrollIntoViewIfNeeded();
        await expect(heading).toBeVisible();
        const framelocator = page.frameLocator('iframe[title="Spotify Embed: Al Sabaê Al Mounjiate (Quran)"]');
        await expect(framelocator
            .getByTestId('tracklist').locator('div').filter({ hasText: 'Al FatihaAbd Al Rahman Al' }).nth(1)).toBeVisible();
        await expect(framelocator.getByTestId('tracklist-row-0')).toBeVisible();
        await expect(framelocator.getByTestId('tracklist-row-1')).toBeVisible();
        await expect(framelocator.getByTestId('tracklist-row-2')).toBeVisible();
        await expect(framelocator.getByTestId('play-pause-button')).toBeVisible();
        await expect(framelocator.locator('.PlayerControlsShort_playerControlsWrapper__qdkr5')).toBeVisible();
        await expect(framelocator.getByLabel('More')).toBeVisible();
        await expect(framelocator.getByTestId('spotify-logo')).toBeVisible();
        await expect(framelocator.locator('.CoverArtBase_coverArt__ne0XI')).toBeVisible();
    });

    test('Spotify Playlist', async ({ page }) => {
        const heading = page.getByRole('heading', { name: 'Spotify Playlist' });
        await heading.scrollIntoViewIfNeeded();
        await expect(heading).toBeVisible();
        const framelocator = page.frameLocator('iframe[title="Spotify Embed\\: Kids Quran playlist"]');

        // await expect(framelocator.getByTestId('initialized-true')).toBeVisible();
        await expect(framelocator.getByTestId('tracklist').locator('div').filter({ hasText: '1AlbaqarahMashary Rashid Al-' }).nth(1)).toBeVisible();
        await expect(framelocator.getByTestId('tracklist-row-0')).toBeVisible();
        await expect(framelocator.getByTestId('tracklist-row-1')).toBeVisible();
        await expect(framelocator.getByTestId('tracklist-row-2')).toBeVisible();
        await expect(framelocator.getByTestId('play-pause-button')).toBeVisible();
        await expect(framelocator.getByLabel('More')).toBeVisible();
        await expect(framelocator.locator('.PlayerControlsShort_playerControlsWrapper__qdkr5')).toBeVisible();
        // await expect(framelocator.getByTestId('save-on-spotify-button')).toBeVisible();
        await expect(framelocator.getByTestId('spotify-logo')).toBeVisible();
        await expect(framelocator.getByRole('link', { name: 'Kids Quran playlist' })).toBeVisible();
        await expect(framelocator.locator('.CoverArtBase_coverArt__ne0XI')).toBeVisible();
        await expect(framelocator.getByTestId('play-pause-button')).toBeVisible();
        await framelocator.getByTestId('play-pause-button').click();

        // await page.waitForTimeout(500);

        // await framelocator.getByTestId('play-pause-button').click();
    });

});