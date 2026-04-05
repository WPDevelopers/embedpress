const { test, expect } = require('@playwright/test');

let slug = 'elementor-spreaker';


test.describe("Elementor Spreaker", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(slug);
        // await page.waitForLoadState('networkidle');
        await expect(page.getByRole('heading', { name: 'Elementor Spreaker' })).toBeVisible();
    });

    // Spreaker Playlist
    test('Spreaker Playlist - Elementor', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Spreaker Playlist' })).toBeVisible();
        await expect(page.locator('#ep-elements-id-f1f4254 iframe[title="This is title"]').contentFrame().getByRole('link', { name: 'player.download_episode' })).toBeVisible();
        await expect(page.locator('#ep-elements-id-f1f4254 iframe[title="This is title"]').contentFrame().getByRole('button', { name: 'Share episode on social media' })).toBeVisible();
        await expect(page.locator('#ep-elements-id-f1f4254 iframe[title="This is title"]').contentFrame().getByRole('link', { name: 'Read comments' })).toBeVisible();
        await expect(page.locator('#ep-elements-id-f1f4254 iframe[title="This is title"]').contentFrame().getByRole('link', { name: 'Like episode' })).toBeVisible();
        await expect(page.locator('#ep-elements-id-f1f4254 iframe[title="This is title"]').contentFrame().getByRole('button', { name: 'Skip forward 30 seconds' })).toBeVisible();
        await expect(page.locator('#ep-elements-id-f1f4254 iframe[title="This is title"]').contentFrame().getByRole('button', { name: 'Skip back 10 seconds' })).toBeVisible();
        await expect(page.locator('#ep-elements-id-f1f4254 iframe[title="This is title"]').contentFrame().getByRole('link', { name: 'Listen on Spreaker' })).toBeVisible();
        await expect(page.locator('#ep-elements-id-f1f4254 iframe[title="This is title"]').contentFrame().getByText('episodes')).toBeVisible();
    });


    // Enable Pro Features 
    test('Enable Pro Features', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Enable Pro Features' })).toBeVisible();
        await page.getByText('Disable Downloads – Upload').click();

        const iframe = page.frameLocator('#ep-elements-id-90c2277 iframe[title="This is title"]');

        const downloadLink = iframe.getByRole('link', { name: 'player.download_episode' });
        await expect(downloadLink).toBeHidden();

        const coverImage = iframe.locator('.player_cover_image');
        await expect(coverImage).toBeVisible();
    });
      

    // Disable Pro Features 
    test('Disable Pro Features', async ({ page }) => {
        // Check the main heading visibility
        const heading = page.getByRole('heading', { name: 'Disable Pro Features' });
        await heading.scrollIntoViewIfNeeded();
        await expect(heading).toBeVisible();

        // Define a common locator for the embedded iframe
        const iframeLocator = page
            .locator('#ep-elements-id-3c6f195 iframe[title="This is title"]')
            .first();

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