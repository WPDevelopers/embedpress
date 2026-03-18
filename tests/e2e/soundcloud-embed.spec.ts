import { test, expect } from '@playwright/test';
import { createPost, insertShortcode, publishPost, viewPost, expectIframeEmbed } from './helpers/wp';

test.use({ storageState: 'tests/e2e/.auth/wp-session.json' });

test.describe('SoundCloud Embed', () => {
	test('embeds a SoundCloud track', async ({ page }) => {
		const url = 'https://soundcloud.com/rick-astley-official/never-gonna-give-you-up-4';

		await createPost(page, 'E2E: SoundCloud');
		await insertShortcode(page, url);
		const postUrl = await publishPost(page);

		if (postUrl) {
			await viewPost(page, postUrl);
			await expectIframeEmbed(page, 'soundcloud.com');
		}
	});
});
