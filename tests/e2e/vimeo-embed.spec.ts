import { test, expect } from '@playwright/test';
import { createPost, insertShortcode, publishPost, viewPost, expectIframeEmbed } from './helpers/wp';

test.use({ storageState: 'tests/e2e/.auth/wp-session.json' });

test.describe('Vimeo Embed', () => {
	test('embeds a Vimeo video via shortcode', async ({ page }) => {
		const url = 'https://vimeo.com/76979871';

		await createPost(page, 'E2E: Vimeo Embed');
		await insertShortcode(page, url);
		const postUrl = await publishPost(page);

		if (postUrl) {
			await viewPost(page, postUrl);
			await expectIframeEmbed(page, 'vimeo.com');
		}
	});
});
