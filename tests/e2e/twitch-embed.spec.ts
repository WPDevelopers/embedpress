import { test, expect } from '@playwright/test';
import { createPost, insertShortcode, publishPost, viewPost, expectIframeEmbed } from './helpers/wp';

test.use({ storageState: 'tests/e2e/.auth/wp-session.json' });

test.describe('Twitch Embed', () => {
	test.skip('embeds a Twitch channel — requires parent param for localhost', async ({ page }) => {
		const url = 'https://www.twitch.tv/twitch';

		await createPost(page, 'E2E: Twitch Channel');
		await insertShortcode(page, url);
		const postUrl = await publishPost(page);

		if (postUrl) {
			await viewPost(page, postUrl);
			await expectIframeEmbed(page, 'twitch');
		}
	});
});
