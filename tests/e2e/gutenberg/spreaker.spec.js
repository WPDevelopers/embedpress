const { test, expect } = require('@playwright/test');

let slug = 'gutenberg-spreaker';


test.describe("Spreaker Gutenberg", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(slug);
        await page.waitForLoadState('networkidle');
        await expect(page.getByRole('heading', { name: 'Gutenberg Spreaker' })).toBeVisible();
    });
    // Spreaker Playlist
    test('Spreaker Playlist', async ({ page }) => {
        test.skip(process.env.CI, 'Skipping this test in CI');

        // Assert the main heading is visible
        const heading = page.getByRole('heading', { name: 'Spreaker Playlist' });
        await expect(heading).toBeVisible();

        // Define the common iframe locator and access its content frame
        const iframeLocator = page.locator('iframe').first();
        const frame = await iframeLocator.contentFrame();
        if (!frame) {
            throw new Error('Failed to locate the iframe content frame.');
        }

        // Define locators for elements within the iframe
        const elementsToCheck = [
            { locator: frame.getByLabel('Listen on Spreaker'), description: 'Listen on Spreaker button' },
            { locator: frame.getByRole('link', { name: 'Privacy Policy' }), description: 'Privacy Policy link' },
            { locator: frame.getByRole('img', { name: 'The Deadliest Mountain on' }).first(), description: 'Episode image' },
            { locator: frame.getByLabel('Play episode The Deadliest Mountain on Earth').first(), description: 'Play button' },
            { locator: frame.getByLabel('Skip back 10 seconds'), description: 'Skip back button' },
            { locator: frame.getByLabel('Skip forward 30 seconds'), description: 'Skip forward button' },
            { locator: frame.getByLabel('Like episode'), description: 'Like button' },
            { locator: frame.getByLabel('Read comments'), description: 'Read comments button' },
            { locator: frame.getByLabel('Share episode on social media'), description: 'Share button' },
            { locator: frame.getByLabel('player.download_episode'), description: 'Download button' },
            { locator: frame.locator('.button_info').first(), description: 'Info button' },
            { locator: frame.getByText('The Deadliest Mountain on Earthepisode_explicit16:'), description: 'Episode text' },
            { locator: frame.locator('li').filter({ hasText: 'The Deadliest Mountain on' }).locator('span'), description: 'Episode span' },
            { locator: frame.locator('li').filter({ hasText: 'The Deadliest Mountain on' }).getByLabel('Read description'), description: 'Read description button' },
        ];

        // Check visibility of all elements in the iframe
        for (const { locator, description } of elementsToCheck) {
            await expect(locator).toBeVisible({ message: `${description} should be visible` });
        }

        // Interact with play and pause buttons
        const playButton = frame.getByLabel('Play episode The Deadliest Mountain on Earth').first();
        const pauseButton = frame.getByLabel('Pause episode The Deadliest Mountain on Earth').first();

        await playButton.click();
        await page.waitForTimeout(500); // Small delay to simulate playback
        await pauseButton.click();

        // Assert CSS property of an element within the frame
        const cssElement = frame.locator('.widget.theme_light.theme_with_playlist');

        // Assert that the element has the expected class
        await expect(cssElement).toHaveClass(/widget theme_light theme_with_playlist/);
    });


    // Enable Pro Features 
    test('Enable Pro Features', async ({ page }) => {
        test.skip(process.env.CI, 'Skipping this test in CI');

        // Check the main heading visibility
        const heading = page.getByRole('heading', { name: 'Enable Pro Features' });
        await heading.scrollIntoViewIfNeeded();
        await expect(heading).toBeVisible();

        // Define a common locator for the embedded iframe
        const iframeLocator = page.locator('iframe[title="This is title"]').nth(1);

        // Access the iframe's content frame
        const frame = await iframeLocator.contentFrame();
        if (!frame) {
            throw new Error('Failed to locate the iframe content frame.');
        }

        // Define locators within the iframe for repeated elements
        const elementsToCheck = [
            // { locator: frame.getByLabel('Play episode 287. Evil in the').first(), description: 'Play button for episode 287' },
            // { locator: frame.getByRole('link', { name: '287. Evil in the East: Sara' }), description: 'Link to episode 287' },
            { locator: frame.getByLabel('Skip back 10 seconds'), description: 'Skip back button' },
            { locator: frame.getByLabel('Skip forward 30 seconds'), description: 'Skip forward button' },
            { locator: frame.getByLabel('Like episode'), description: 'Like button' },
            { locator: frame.getByLabel('Read comments'), description: 'Comments button' },
            { locator: frame.getByLabel('Share episode on social media'), description: 'Share button' },
            { locator: frame.locator('.button_info').first(), description: 'Information button' },
            { locator: frame.getByLabel('Listen on Spreaker'), description: 'Listen on Spreaker button' },
            // {locator:frame.}
        ];


        // Check visibility of all required elements within the iframe
        for (const { locator, description } of elementsToCheck) {
            await expect(locator).toBeVisible({ message: `${description} should be visible` });
        }

        // Assert the "Download button" is NOT visible
        const downloadButton = frame.getByLabel('player.download_episode');
        await expect(downloadButton).toBeHidden({ message: 'Download button should not be visible' });

        // Interact with the episode play and pause buttons
        await frame.getByLabel('Play episode 286. A').click();
        await expect(
            frame.getByRole('link', { name: '286. A Thanksgiving Massacre' })
        ).toBeVisible({ message: 'Link to episode 286 should be visible' });
        await frame.getByLabel('Pause episode 286. A').first().click();
    });

    // Disable Pro Features 
    test('Disable Pro Features', async ({ page }) => {
        // Check the main heading visibility
        const heading = page.getByRole('heading', { name: 'Disable Pro Features' });
        await heading.scrollIntoViewIfNeeded();
        await expect(heading).toBeVisible();

        // Define a common locator for the embedded iframe
        const iframeLocator = page.locator('iframe[title="This is title"]').nth(2)

        // Access the iframe's content frame
        const frame = await iframeLocator.contentFrame();
        if (!frame) {
            throw new Error('Failed to locate the iframe content frame.');
        }


        // Check visibility of player actions inside the iframe
        const playerActions = frame.locator('.player_actions');
        await expect(playerActions).toBeVisible({ message: 'Player actions should be visible' });

        // Check the visibility of the "Download Episode" label
        const downloadButton = frame.getByLabel('player.download_episode');
        await expect(downloadButton).toBeVisible({ message: 'Download button should be visible' });

        // Check the visibility of the "Information" button
        const infoButton = frame.locator('.button_info').first();
        await expect(infoButton).toBeVisible({ message: 'Information button should be visible' });
    });

    // Dark Theme & Red Color Hide likes COmments Sharing logo & Download
    test('Dark Theme & Red Color', async ({ page }) => {
        // Check the main heading visibility
        const heading = page.getByRole('heading', { name: 'Dark Theme & Red Color' });
        await heading.scrollIntoViewIfNeeded();
        await expect(heading).toBeVisible();

        // Define a common locator for the iframe
        const iframeLocator = page.locator('iframe[title="This is title"]').nth(3);

        // Access the iframe's content frame
        const frame = await iframeLocator.contentFrame();
        if (!frame) {
            throw new Error('Failed to locate the iframe content frame.');
        }

        // Define locators within the iframe
        const downloadButton = frame.getByLabel('player.download_episode');
        const likeButton = frame.getByLabel('Like episode');
        const commentsButton = frame.getByLabel('Read comments');
        const shareButton = frame.getByLabel('Share episode on social media');
        const logoButton = frame.getByLabel('Listen on Spreaker');

        // Assert that these elements are NOT visible
        await expect(downloadButton).toBeHidden({ message: 'Download button should not be visible' });
        await expect(likeButton).toBeHidden({ message: 'Like button should not be visible' });
        await expect(commentsButton).toBeHidden({ message: 'Comments button should not be visible' });
        await expect(shareButton).toBeHidden({ message: 'Share button should not be visible' });
        await expect(logoButton).toBeHidden({ message: 'Logo button should not be visible' });

        // Assert CSS property of an element within the frame
        const cssElement = frame.locator('.widget.theme_dark.theme_with_playlist');

        // Assert that the element has the expected class
        await expect(cssElement).toHaveClass(/widget theme_dark theme_with_playlist/);
    });


    // Spreaker Single Episode
    test('Spreaker Single Episode', async ({ page }) => {
        // Check the main heading visibility
        const heading = page.getByRole('heading', { name: 'Spreaker Single Episode' });
        await heading.scrollIntoViewIfNeeded();
        await expect(heading).toBeVisible();
        const iframeLocator = page.locator('iframe[title="This is title"]').nth(4);
        await expect(iframeLocator).toBeVisible()
    });
});