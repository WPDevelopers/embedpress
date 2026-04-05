import { test, expect } from '@playwright/test';
import { createPost, insertShortcode, publishPost, viewPost, expectIframeEmbed } from './helpers/wp';

test.use({ storageState: 'tests/e2e/.auth/wp-session.json' });

test.describe('Spotify Embed', () => {
	test('embeds a Spotify track', async ({ page }) => {
		const url = 'https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT';

		await createPost(page, 'E2E: Spotify Track');
		await insertShortcode(page, url);
		const postUrl = await publishPost(page);

		if (postUrl) {
			await viewPost(page, postUrl);
			await expectIframeEmbed(page, 'spotify.com');
		}
	});

	test('embeds a Spotify playlist', async ({ page }) => {
		const url = 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M';

		await createPost(page, 'E2E: Spotify Playlist');
		await insertShortcode(page, url);
		const postUrl = await publishPost(page);

		if (postUrl) {
			await viewPost(page, postUrl);
			await expectIframeEmbed(page, 'spotify.com');
		}
	});
});
