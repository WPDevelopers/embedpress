const { test, expect } = require('@playwright/test');

let slug = 'playwright-elementor/elementor-spotify';


test.describe('Elementor Spotify', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(slug);
        await page.waitForLoadState('networkidle');
    });

    test('Spotify Single', async ({ page }) => {
        const heading = page.getByRole('heading', { name: 'Spotify Single' });
        await heading.scrollIntoViewIfNeeded();
        await expect(heading).toBeVisible();

        const iframe = page.frameLocator('iframe[title="Spotify Embed\\: Surah Ar-Rahman \\(Be Heaven\\)"]');

        await expect(iframe.locator('.BackgroundColorContainer_backgroundColorContainer__YZSQ7')).toBeVisible();
        await expect(iframe.locator('.CoverArtBase_coverArt__ne0XI')).toBeVisible();
        await expect(iframe.getByRole('link', { name: 'Surah Ar-Rahman (Be Heaven)' })).toBeVisible();
        await expect(iframe.getByTestId('play-pause-button')).toBeVisible();
        await expect(iframe.getByLabel('More')).toBeVisible();
    });

    test('Spotify Artist', async ({ page }) => {
        const heading = page.getByRole('heading', { name: 'Spotify Artist' });
        await heading.scrollIntoViewIfNeeded();
        await expect(heading).toBeVisible();

        const iframe = page.frameLocator('iframe[title="Spotify Embed\\: Omar Hisham"]')

        await expect(iframe.getByTestId('tracklist').locator('div').filter({ hasText: 'Surah Ar-Rahman (Be Heaven)' }).nth(1)).toBeVisible();
        await expect(iframe.getByTestId('tracklist-row-0')).toBeVisible();
        await expect(iframe.getByTestId('tracklist-row-1')).toBeVisible();
        await expect(iframe.getByLabel('More')).toBeVisible();
        await expect(iframe.getByTestId('play-pause-button')).toBeVisible();
        await iframe.getByTestId('play-pause-button').click();
        await page.waitForTimeout(3000);
        await iframe.getByTestId('play-pause-button').click();
    });

    test('Spotify Album', async ({ page }) => {
        const heading = page.getByRole('heading', { name: 'Spotify Album' });
        await heading.scrollIntoViewIfNeeded();
        await expect(heading).toBeVisible();

        const iframe = page.frameLocator('iframe[title="Spotify Embed\\: Al Sabaê Al Mounjiate \\(Quran\\)"]');

        await expect(iframe.getByRole('link', { name: 'Al Sabaê Al Mounjiate (Quran)' })).toBeVisible();
        await expect(iframe.getByRole('link', { name: 'Abd Al Rahman Al Soudaiss' })).toBeVisible();
        await expect(iframe.getByTestId('play-pause-button')).toBeVisible();
        await expect(iframe.getByLabel('More')).toBeVisible();
        await expect(iframe.getByTestId('tracklist').locator('div').filter({ hasText: 'Al FatihaAbd Al Rahman Al' }).nth(1)).toBeVisible();
        await expect(iframe.getByTestId('tracklist-row-0')).toBeVisible();
        await expect(iframe.getByTestId('tracklist-row-1')).toBeVisible();
        await iframe.getByTestId('play-pause-button').click();
        await page.waitForTimeout(3000);
        await iframe.getByTestId('play-pause-button').click();
    });

    test('Spotify Playlist', async ({ page }) => {
        const heading = page.getByRole('heading', { name: 'Spotify Playlist' });
        await heading.scrollIntoViewIfNeeded();
        await expect(heading).toBeVisible();

        const iframe = page.frameLocator('iframe[title="Spotify Embed\\: Kids Quran playlist"]');

        await expect(iframe.getByTestId('play-pause-button')).toBeVisible();
        await expect(iframe.getByLabel('More')).toBeVisible();
        await expect(iframe.getByRole('link', { name: 'Kids Quran playlist' })).toBeVisible();
        await expect(iframe.getByTestId('tracklist').locator('div').filter({ hasText: 'AlbaqarahMashary Rashid Al-' }).nth(1)).toBeVisible();
        await expect(iframe.getByTestId('tracklist-row-0')).toBeVisible();
        await expect(iframe.getByTestId('tracklist-row-1')).toBeVisible();
        await iframe.getByTestId('play-pause-button').click();
    });
});