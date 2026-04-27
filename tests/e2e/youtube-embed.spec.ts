import { test, expect } from '@playwright/test';
import { createPost, insertShortcode, publishPost, viewPost, expectIframeEmbed } from './helpers/wp';

test.use({ storageState: 'tests/e2e/.auth/wp-session.json' });

test.describe('YouTube Embed', () => {
	test('embeds a YouTube video via shortcode', async ({ page }) => {
		const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

		await createPost(page, 'E2E: YouTube Embed');
		await insertShortcode(page, url);
		const postUrl = await publishPost(page);

		if (postUrl) {
			await viewPost(page, postUrl);
			await expectIframeEmbed(page, 'youtube.com');
		}
	});

	test('embeds a YouTube short URL', async ({ page }) => {
		const url = 'https://youtu.be/dQw4w9WgXcQ';

		await createPost(page, 'E2E: YouTube Short URL');
		await insertShortcode(page, url);
		const postUrl = await publishPost(page);

		if (postUrl) {
			await viewPost(page, postUrl);
			await expectIframeEmbed(page, 'youtube');
		}
	});
});
